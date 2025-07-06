export default {
  routes: [
    {
      method: "GET",
      path: "/astra",
      handler: "astra.exampleAction",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/astra/ticket",
      handler: "astra.createTicket",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/astra/tickets/search",
      handler: "astra.searchTickets",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/astra/ticket/:id",
      handler: "astra.getTicket",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/astra/ticket/:id",
      handler: "astra.updateTicket",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/astra/ticket/:id",
      handler: "astra.deleteTicket",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
