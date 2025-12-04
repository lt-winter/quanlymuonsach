const app = require("./app");
const config = require("./app/config/index");
const MongoDB = require("./app/utils/mongodb.util");
require("dotenv").config();

async function startServer() {
  try {
    await MongoDB.connect(config.db.uri);
    console.info("Connected to the database");

    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.info(`Server is listening on port ${PORT}.`);
    });
  } catch (error) {
    console.error("Cannot connect to the database!", error);
    process.exit();
  }
}

startServer();
