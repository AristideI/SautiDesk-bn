module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
  "users-permissions": {
    config: {
      register: {
        allowedFields: [
          "username",
          "email",
          "password",
          "roles",
          "phone",
          "profile",
          "address",
          "worker",
        ],
      },
    },
  },
});
