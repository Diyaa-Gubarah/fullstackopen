const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
require("express-async-errors");

const app = express();
const blogRouter = require("./controllers/blog");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

// if (process.env.NODE_ENV === 'test') {
const testingRouter = require("./controllers/forTest");

app.use("/api/testing", testingRouter);
// }

app.use("/api/blogs", middleware.userExtractor, blogRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
