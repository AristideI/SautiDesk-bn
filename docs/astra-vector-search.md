# Astra DB Vector Search with SautiDesk

This document explains how to use the vector search functionality in SautiDesk with Astra DB using the Cassandra driver.

## Overview

The Astra controller has been updated to use the Cassandra driver for Astra DB, enabling vector similarity search for tickets. This allows you to:

- Store tickets with vector embeddings
- Perform semantic similarity search
- Find related tickets based on content similarity
- Support AI-powered ticket classification and routing

## Prerequisites

1. **Astra DB Setup**: You need an Astra DB instance with vector search capabilities
2. **Environment Variables**: Configure the following environment variables:
   ```bash
   ASTRA_SECURE_CONNECT_BUNDLE=/path/to/secure-connect-bundle.zip
   ASTRA_APPLICATION_TOKEN=your-application-token
   ASTRA_KEYSPACE=sautidesk  # Optional, defaults to 'sautidesk'
   ```

## Installation

The required dependencies are already installed:

- `cassandra-driver`: Cassandra driver for Node.js
- `@types/cassandra-driver`: TypeScript definitions

## API Endpoints

### 1. Create Ticket with Vector Embedding

**POST** `/api/astra/ticket`

Creates a new ticket with optional vector embedding for similarity search.

```json
{
  "ticketId": "TECH-001",
  "title": "Server connectivity issues",
  "description": "Users experiencing connection problems",
  "assignedTo": "tech-support@company.com",
  "type": "technical",
  "tags": ["server", "connectivity", "urgent"],
  "status": "open",
  "priority": "high",
  "vector": [0.1, 0.2, 0.3, ...] // 1536-dimensional vector
}
```

**Response:**

```json
{
  "success": true,
  "ticket": {
    "id": "uuid",
    "ticketId": "TECH-001",
    "title": "Server connectivity issues",
    "description": "Users experiencing connection problems",
    "assignedTo": "tech-support@company.com",
    "type": "technical",
    "tags": ["server", "connectivity", "urgent"],
    "status": "open",
    "priority": "high",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Vector Similarity Search

**POST** `/api/astra/tickets/search`

Performs vector similarity search to find tickets similar to a query vector.

```json
{
  "query": "technical server issues",
  "vector": [0.1, 0.2, 0.3, ...], // 1536-dimensional query vector
  "limit": 10,
  "similarity_threshold": 0.7
}
```

**Response:**

```json
{
  "success": true,
  "tickets": [
    {
      "id": "uuid",
      "ticketId": "TECH-001",
      "title": "Server connectivity issues",
      "description": "Users experiencing connection problems",
      "assignedTo": "tech-support@company.com",
      "type": "technical",
      "tags": ["server", "connectivity", "urgent"],
      "status": "open",
      "priority": "high",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "similarity": 0.8542
    }
  ],
  "count": 1,
  "query": "technical server issues"
}
```

### 3. Get Ticket by ID

**GET** `/api/astra/ticket/:id`

Retrieves a specific ticket by its UUID.

**Response:**

```json
{
  "success": true,
  "ticket": {
    "id": "uuid",
    "ticketId": "TECH-001",
    "title": "Server connectivity issues",
    "description": "Users experiencing connection problems",
    "assignedTo": "tech-support@company.com",
    "type": "technical",
    "tags": ["server", "connectivity", "urgent"],
    "status": "open",
    "priority": "high",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Ticket

**PUT** `/api/astra/ticket/:id`

Updates an existing ticket, including its vector embedding.

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in_progress",
  "vector": [0.1, 0.2, 0.3, ...] // Updated vector embedding
}
```

### 5. Delete Ticket

**DELETE** `/api/astra/ticket/:id`

Deletes a ticket by its UUID.

## Database Schema

The tickets table is automatically created with the following structure:

```sql
CREATE TABLE sautidesk.tickets (
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

CREATE CUSTOM INDEX idx_tickets_vector
ON sautidesk.tickets(vector)
USING 'StorageAttachedIndex'
WITH OPTIONS = {'similarity_function': 'cosine'};
```

## Vector Embeddings

### Vector Dimensions

- The system uses **1536-dimensional vectors** (compatible with OpenAI embeddings)
- You can modify the dimension in the `createTicketsTable` function if needed

### Generating Embeddings

You can generate vector embeddings using various AI models:

1. **OpenAI Embeddings**:

   ```javascript
   const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
   const embeddings = new OpenAIEmbeddings();
   const vector = await embeddings.embedQuery("Your text here");
   ```

2. **Hugging Face Embeddings**:

   ```javascript
   const {
     HuggingFaceTransformersEmbeddings,
   } = require("langchain/embeddings/hf_transformers");
   const embeddings = new HuggingFaceTransformersEmbeddings({
     modelName: "sentence-transformers/all-MiniLM-L6-v2",
   });
   const vector = await embeddings.embedQuery("Your text here");
   ```

3. **Custom Embeddings**: Use any embedding model that outputs 1536-dimensional vectors

## Example Usage

### Running the Example Script

```bash
# Start your Strapi server first
npm run dev

# In another terminal, run the example script
node scripts/vector-search-example.js
```

### Integration with AI Models

```javascript
// Example: Create a ticket with AI-generated embedding
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");

const embeddings = new OpenAIEmbeddings();
const ticketText = `${title} ${description}`;
const vector = await embeddings.embedQuery(ticketText);

const ticket = {
  ticketId: "TECH-002",
  title: "Database performance issues",
  description: "Slow query response times affecting user experience",
  vector: vector,
  // ... other fields
};

const response = await fetch("/api/astra/ticket", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(ticket),
});
```

### Semantic Search for Similar Tickets

```javascript
// Example: Find similar tickets
const queryText = "database slow performance";
const queryVector = await embeddings.embedQuery(queryText);

const searchResponse = await fetch("/api/astra/tickets/search", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: queryText,
    vector: queryVector,
    limit: 5,
    similarity_threshold: 0.7,
  }),
});

const similarTickets = await searchResponse.json();
```

## Best Practices

1. **Vector Quality**: Use high-quality embeddings from well-trained models
2. **Similarity Thresholds**: Start with 0.7-0.8 and adjust based on your use case
3. **Batch Operations**: For bulk operations, consider batching requests
4. **Error Handling**: Always handle connection errors and retry logic
5. **Monitoring**: Monitor similarity scores to ensure quality matches

## Troubleshooting

### Common Issues

1. **Connection Errors**:

   - Verify your Astra DB credentials
   - Check the secure connect bundle path
   - Ensure your IP is whitelisted

2. **Vector Dimension Mismatch**:

   - Ensure all vectors are 1536-dimensional
   - Check your embedding model output

3. **Low Similarity Scores**:
   - Adjust the similarity threshold
   - Improve your embedding model
   - Check vector normalization

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
DEBUG=astra:*
```

## Performance Considerations

- **Index Creation**: Vector indexes take time to build on large datasets
- **Query Performance**: Limit results and use appropriate similarity thresholds
- **Connection Pooling**: The driver handles connection pooling automatically
- **Batch Size**: For bulk operations, process in batches of 100-1000 records

## Security

- Store sensitive credentials in environment variables
- Use HTTPS in production
- Implement proper authentication and authorization
- Validate input data before processing

## Future Enhancements

- Support for multiple vector dimensions
- Hybrid search (vector + text)
- Real-time vector updates
- Advanced similarity functions
- Integration with more AI models
