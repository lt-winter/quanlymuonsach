const config = {
  app: {
    port: process.env.PORT || 6789,
  },
  db: {
    uri: process.env.DB_URI || "mongodb://localhost:27017/quanlymuonsach",
  },
};
module.exports = config;
