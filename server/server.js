const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
require("dotenv").config();

const authRoute = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const chatRoute = require("./routes/chatRoute");

const chatController = require("./controllers/chatController");

const app = express();
const port = 2000;
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/", authRoute);
app.use("/", adminRoute);
app.use("/", chatRoute);

chatController.socketServer(server);

server.listen(port, () => {
  console.log(`Server running on PORT: ${port}`);
});
