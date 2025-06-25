export default {
  routes: [
    {
      method: "POST",
      path: "/sms",
      handler: "sms.send",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/sms/mail",
      handler: "sms.mail",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
