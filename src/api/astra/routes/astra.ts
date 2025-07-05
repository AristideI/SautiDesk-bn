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
  ],
};
