export default {
  routes: [
    {
      method: "GET",
      path: "/astra",
      handler: "astra.getTickets",
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
  ],
};
