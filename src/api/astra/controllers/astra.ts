/**
 * A set of functions called "actions" for `astra`
 */
import { DataAPIClient } from "@datastax/astra-db-ts";

const astraDbUrl = process.env.ASTRA_DB_URL;
const astraToken = process.env.ASTRA_TOKEN;

const astraClient = new DataAPIClient({
  dbOptions: {
    token: astraToken,
  },
});
const astraDb = astraClient.db(astraDbUrl);
const ticketsCollection = astraDb.collection("tickets");
const agentsCollection = astraDb.collection("agents");

export default {
  exampleAction: async (ctx, next) => {
    try {
      const collections = await astraDb.listCollections();
      ctx.body = collections;
    } catch (err) {
      ctx.body = err;
    }
  },

  async createTicket(ctx, next) {
    try {
      const { ticketId, title, description, assignedTo, type, tags } =
        ctx.request.body;
      const ticket = await ticketsCollection.insertOne({
        ticketId,
        title,
        description,
        assignedTo,
        type,
        tags,
        $vectorize: "Text to vectorize for this document",
      });
      ctx.body = ticket;
    } catch (err) {
      ctx.body = err;
    }
  },
};
