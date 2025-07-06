/**
 * Example script demonstrating vector search functionality with Astra DB
 * This script shows how to create tickets with vector embeddings and perform similarity search
 */

const axios = require("axios");

const BASE_URL = "http://localhost:1337/api";

// Example vector embeddings (1536-dimensional vectors like OpenAI embeddings)
const sampleVectors = {
  technical: [0.1, 0.2, 0.3, 0.4, 0.5, ...Array(1531).fill(0.1)], // Simplified for demo
  billing: [0.2, 0.1, 0.4, 0.3, 0.6, ...Array(1531).fill(0.2)],
  general: [0.3, 0.3, 0.2, 0.5, 0.1, ...Array(1531).fill(0.3)],
};

// Helper function to generate a random vector (for demo purposes)
const generateRandomVector = (dimension = 1536) => {
  return Array.from({ length: dimension }, () => Math.random());
};

// Helper function to make API calls
const makeRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(
      `Error making ${method} request to ${endpoint}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Example 1: Create tickets with vector embeddings
const createSampleTickets = async () => {
  console.log("\n=== Creating Sample Tickets with Vector Embeddings ===\n");

  const tickets = [
    {
      ticketId: "TECH-001",
      title: "Server connectivity issues",
      description:
        "Users are experiencing intermittent connection problems to our main server. The issue seems to occur during peak hours.",
      assignedTo: "tech-support@company.com",
      type: "technical",
      tags: ["server", "connectivity", "urgent"],
      status: "open",
      priority: "high",
      vector: sampleVectors.technical,
    },
    {
      ticketId: "BILL-001",
      title: "Incorrect billing amount",
      description:
        "Customer reports being charged twice for the same service. Need to investigate and provide refund.",
      assignedTo: "billing@company.com",
      type: "billing",
      tags: ["billing", "refund", "customer"],
      status: "open",
      priority: "medium",
      vector: sampleVectors.billing,
    },
    {
      ticketId: "GEN-001",
      title: "General inquiry about services",
      description:
        "Customer wants to know more about our premium service offerings and pricing plans.",
      assignedTo: "sales@company.com",
      type: "general",
      tags: ["inquiry", "sales", "pricing"],
      status: "open",
      priority: "low",
      vector: sampleVectors.general,
    },
  ];

  for (const ticket of tickets) {
    try {
      const result = await makeRequest("POST", "/astra/ticket", ticket);
      console.log(`✅ Created ticket: ${ticket.ticketId} - ${ticket.title}`);
      console.log(`   ID: ${result.ticket.id}\n`);
    } catch (error) {
      console.log(`❌ Failed to create ticket: ${ticket.ticketId}`);
    }
  }
};

// Example 2: Perform vector similarity search
const performVectorSearch = async () => {
  console.log("\n=== Performing Vector Similarity Search ===\n");

  // Search for tickets similar to a technical issue
  const technicalQueryVector = generateRandomVector();

  try {
    const searchResult = await makeRequest("POST", "/astra/tickets/search", {
      query: "technical server issues",
      vector: technicalQueryVector,
      limit: 5,
      similarity_threshold: 0.5,
    });

    console.log(`🔍 Search Results for "technical server issues":`);
    console.log(`Found ${searchResult.count} similar tickets\n`);

    searchResult.tickets.forEach((ticket, index) => {
      console.log(
        `${index + 1}. ${ticket.title} (Similarity: ${ticket.similarity?.toFixed(4) || "N/A"})`
      );
      console.log(
        `   ID: ${ticket.id} | Status: ${ticket.status} | Priority: ${ticket.priority}`
      );
      console.log(
        `   Description: ${ticket.description.substring(0, 100)}...\n`
      );
    });
  } catch (error) {
    console.log("❌ Failed to perform vector search");
  }
};

// Example 3: Search for billing-related issues
const searchBillingIssues = async () => {
  console.log("\n=== Searching for Billing-Related Issues ===\n");

  const billingQueryVector = generateRandomVector();

  try {
    const searchResult = await makeRequest("POST", "/astra/tickets/search", {
      query: "billing payment refund",
      vector: billingQueryVector,
      limit: 3,
      similarity_threshold: 0.6,
    });

    console.log(`🔍 Search Results for "billing payment refund":`);
    console.log(`Found ${searchResult.count} similar tickets\n`);

    searchResult.tickets.forEach((ticket, index) => {
      console.log(
        `${index + 1}. ${ticket.title} (Similarity: ${ticket.similarity?.toFixed(4) || "N/A"})`
      );
      console.log(`   Type: ${ticket.type} | Assigned: ${ticket.assignedTo}`);
      console.log(`   Tags: ${ticket.tags.join(", ")}\n`);
    });
  } catch (error) {
    console.log("❌ Failed to search for billing issues");
  }
};

// Example 4: Get a specific ticket
const getSpecificTicket = async (ticketId) => {
  console.log(`\n=== Getting Ticket Details for ID: ${ticketId} ===\n`);

  try {
    const result = await makeRequest("GET", `/astra/ticket/${ticketId}`);

    console.log(`📋 Ticket Details:`);
    console.log(`   ID: ${result.ticket.id}`);
    console.log(`   Ticket ID: ${result.ticket.ticketId}`);
    console.log(`   Title: ${result.ticket.title}`);
    console.log(`   Description: ${result.ticket.description}`);
    console.log(`   Status: ${result.ticket.status}`);
    console.log(`   Priority: ${result.ticket.priority}`);
    console.log(`   Type: ${result.ticket.type}`);
    console.log(`   Assigned To: ${result.ticket.assignedTo}`);
    console.log(`   Tags: ${result.ticket.tags.join(", ")}`);
    console.log(`   Created: ${result.ticket.createdAt}`);
    console.log(`   Updated: ${result.ticket.updatedAt}\n`);
  } catch (error) {
    console.log(`❌ Failed to get ticket: ${ticketId}`);
  }
};

// Main execution function
const main = async () => {
  console.log("🚀 Astra DB Vector Search Example\n");
  console.log(
    "This script demonstrates vector search functionality with tickets.\n"
  );

  try {
    // Step 1: Create sample tickets
    await createSampleTickets();

    // Step 2: Perform vector similarity search
    await performVectorSearch();

    // Step 3: Search for billing issues
    await searchBillingIssues();

    // Step 4: Get a specific ticket (you'll need to replace with actual ticket ID)
    // await getSpecificTicket('actual-ticket-uuid-here');

    console.log("✅ Example completed successfully!");
    console.log("\n💡 Tips:");
    console.log(
      "- Replace the sample vectors with real embeddings from your AI model"
    );
    console.log("- Adjust similarity thresholds based on your use case");
    console.log("- Use the actual ticket IDs returned from create operations");
    console.log("- Consider implementing authentication for production use");
  } catch (error) {
    console.error("❌ Example failed:", error.message);
  }
};

// Run the example if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  createSampleTickets,
  performVectorSearch,
  searchBillingIssues,
  getSpecificTicket,
  generateRandomVector,
};
