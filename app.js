const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const logger = require("./utils/logger");
const { configLoader } = require("./configs/index");

configLoader
  .init()
  .then((data) => {
    logger.info("Config loaded successfully.");

    app.use(cors());

    const router = require("./router/route");

    const PORT = process.env.PORT;
      app.use(express.json({ limit: '20mb' }));


    app.use(router);

    app.listen(PORT, () => {
	    console.log("sanbox tracer backend")
      logger.info("server listening at port " + PORT);
    });
  })
  .catch((e) => {
    console.error("Error loading config file:", e);
  });
