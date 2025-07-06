/**
 * A set of functions called "actions" for `astra`
 */
import cassandra from "cassandra-driver";

// Environment variables for Astra DB connection
const secureConnectBundle = process.env.ASTRA_SECURE_CONNECT_BUNDLE;
const applicationToken = process.env.ASTRA_APPLICATION_TOKEN;
const keyspace = process.env.ASTRA_KEYSPACE || "sautidesk";

// Initialize Cassandra client with Astra DB configuration
const cloud = {
  secureConnectBundle: secureConnectBundle,
};

const authProvider = new cassandra.auth.PlainTextAuthProvider(
  "token",
  applicationToken
);

const client = new cassandra.Client({
  cloud,
  authProvider,
  keyspace,
});

// Initialize connection
let isConnected = false;

const initializeConnection = async () => {
  if (!isConnected) {
    try {
      await client.connect();
      isConnected = true;
      console.log("Connected to Astra DB successfully");

      // Create tickets table with vector support if it doesn't exist
      await createTicketsTable();
    } catch (error) {
      console.error("Failed to connect to Astra DB:", error);
      throw error;
    }
  }
};

const createTicketsTable = async () => {
  try {
    // Create table with vector column for embeddings
    await client.execute(`
      CREATE TABLE IF NOT EXISTS ${keyspace}.tickets (
        id UUID PRIMARY KEY,
        ticket_id TEXT,
        title TEXT,
        description TEXT,
        assigned_to TEXT,
        type TEXT,
        tags SET<TEXT>,
        status TEXT,
        priority TEXT,
        created_at TIMESTAMP,
        updated_at TIMESTAMP,
        vector VECTOR<FLOAT, 1536>
      );
    `);

    // Create vector index for similarity search
    await client.execute(`
      CREATE CUSTOM INDEX IF NOT EXISTS idx_tickets_vector
      ON ${keyspace}.tickets(vector)
      USING 'StorageAttachedIndex'
      WITH OPTIONS = {'similarity_function': 'cosine'};
    `);

    console.log("Tickets table and vector index created successfully");
  } catch (error) {
    console.error("Error creating tickets table:", error);
    // Don't throw here as the table might already exist
  }
};

export default {
  exampleAction: async (ctx, next) => {
    try {
      await initializeConnection();
      const result = await client.execute(
        "SELECT keyspace_name FROM system_schema.keyspaces"
      );
      ctx.body = result.rows;
    } catch (err) {
      ctx.body = { error: err.message };
    }
  },

  async createTicket(ctx, next) {
    try {
      await initializeConnection();

      const {
        ticketId,
        title,
        description,
        assignedTo,
        type,
        tags,
        status = "open",
        priority = "medium",
        vector,
      } = ctx.request.body;

      // Validate required fields
      if (!ticketId || !title || !description) {
        ctx.status = 400;
        ctx.body = { error: "ticketId, title, and description are required" };
        return;
      }

      // Generate UUID for the ticket
      const id = cassandra.types.Uuid.random();
      const now = new Date();

      // Prepare the insert query
      const insertQuery = `
        INSERT INTO ${keyspace}.tickets (
          id, ticket_id, title, description, assigned_to, type, 
          tags, status, priority, created_at, updated_at, vector
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        id,
        ticketId,
        title,
        description,
        assignedTo || null,
        type || null,
        tags || [],
        status,
        priority,
        now,
        now,
        vector || null,
      ];

      await client.execute(insertQuery, params, { prepare: true });

      ctx.body = {
        success: true,
        ticket: {
          id: id.toString(),
          ticketId,
          title,
          description,
          assignedTo,
          type,
          tags,
          status,
          priority,
          createdAt: now,
          updatedAt: now,
        },
      };
    } catch (err) {
      console.error("Error creating ticket:", err);
      ctx.status = 500;
      ctx.body = { error: err.message };
    }
  },

  async searchTickets(ctx, next) {
    try {
      await initializeConnection();

      const {
        query,
        vector,
        limit = 10,
        similarity_threshold = 0.7,
      } = ctx.request.body;

      if (!vector || !Array.isArray(vector)) {
        ctx.status = 400;
        ctx.body = { error: "Vector array is required for similarity search" };
        return;
      }

      // Perform vector similarity search
      const searchQuery = `
        SELECT 
          id, ticket_id, title, description, assigned_to, type, 
          tags, status, priority, created_at, updated_at,
          similarity_cosine(vector, ?) AS similarity
        FROM ${keyspace}.tickets
        WHERE similarity_cosine(vector, ?) > ?
        ORDER BY vector ANN OF ? 
        LIMIT ?
      `;

      const params = [vector, vector, similarity_threshold, vector, limit];

      const result = await client.execute(searchQuery, params, {
        prepare: true,
      });

      // Format the results
      const tickets = result.rows.map((row) => ({
        id: row.id.toString(),
        ticketId: row.ticket_id,
        title: row.title,
        description: row.description,
        assignedTo: row.assigned_to,
        type: row.type,
        tags: row.tags ? Array.from(row.tags) : [],
        status: row.status,
        priority: row.priority,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        similarity: row.similarity,
      }));

      ctx.body = {
        success: true,
        tickets,
        count: tickets.length,
        query: query || "vector_similarity_search",
      };
    } catch (err) {
      console.error("Error searching tickets:", err);
      ctx.status = 500;
      ctx.body = { error: err.message };
    }
  },

  async getTicket(ctx, next) {
    try {
      await initializeConnection();

      const { id } = ctx.params;

      if (!id) {
        ctx.status = 400;
        ctx.body = { error: "Ticket ID is required" };
        return;
      }

      const query = `
        SELECT 
          id, ticket_id, title, description, assigned_to, type, 
          tags, status, priority, created_at, updated_at
        FROM ${keyspace}.tickets
        WHERE id = ?
      `;

      const result = await client.execute(
        query,
        [cassandra.types.Uuid.fromString(id)],
        { prepare: true }
      );

      if (result.rows.length === 0) {
        ctx.status = 404;
        ctx.body = { error: "Ticket not found" };
        return;
      }

      const row = result.rows[0];
      const ticket = {
        id: row.id.toString(),
        ticketId: row.ticket_id,
        title: row.title,
        description: row.description,
        assignedTo: row.assigned_to,
        type: row.type,
        tags: row.tags ? Array.from(row.tags) : [],
        status: row.status,
        priority: row.priority,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };

      ctx.body = {
        success: true,
        ticket,
      };
    } catch (err) {
      console.error("Error getting ticket:", err);
      ctx.status = 500;
      ctx.body = { error: err.message };
    }
  },

  async updateTicket(ctx, next) {
    try {
      await initializeConnection();

      const { id } = ctx.params;
      const updateData = ctx.request.body;

      if (!id) {
        ctx.status = 400;
        ctx.body = { error: "Ticket ID is required" };
        return;
      }

      // Build dynamic update query based on provided fields
      const allowedFields = [
        "title",
        "description",
        "assigned_to",
        "type",
        "tags",
        "status",
        "priority",
        "vector",
      ];

      const updateFields = [];
      const params = [];

      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          updateFields.push(`${field} = ?`);
          params.push(updateData[field]);
        }
      });

      if (updateFields.length === 0) {
        ctx.status = 400;
        ctx.body = { error: "No valid fields to update" };
        return;
      }

      // Add updated_at timestamp
      updateFields.push("updated_at = ?");
      params.push(new Date());

      // Add ticket ID for WHERE clause
      params.push(cassandra.types.Uuid.fromString(id));

      const updateQuery = `
        UPDATE ${keyspace}.tickets
        SET ${updateFields.join(", ")}
        WHERE id = ?
      `;

      await client.execute(updateQuery, params, { prepare: true });

      ctx.body = {
        success: true,
        message: "Ticket updated successfully",
      };
    } catch (err) {
      console.error("Error updating ticket:", err);
      ctx.status = 500;
      ctx.body = { error: err.message };
    }
  },

  async deleteTicket(ctx, next) {
    try {
      await initializeConnection();

      const { id } = ctx.params;

      if (!id) {
        ctx.status = 400;
        ctx.body = { error: "Ticket ID is required" };
        return;
      }

      const deleteQuery = `
        DELETE FROM ${keyspace}.tickets
        WHERE id = ?
      `;

      await client.execute(deleteQuery, [cassandra.types.Uuid.fromString(id)], {
        prepare: true,
      });

      ctx.body = {
        success: true,
        message: "Ticket deleted successfully",
      };
    } catch (err) {
      console.error("Error deleting ticket:", err);
      ctx.status = 500;
      ctx.body = { error: err.message };
    }
  },
};
