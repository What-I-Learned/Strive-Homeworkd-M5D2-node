import express from "express";
import bodyParser from "body-parser";
import listEndpoints from "express-list-endpoints";
import cors from "cors";

// import blogRouter from "./blog/index.js"; // remeber to use extension

const app = express(); // server
const PORT = 3001; // port number

app.use(cors()); // enable FE to communicate with BE
app.use(bodyParser.json()); // to parse the request body else it would be undefined

// endpoints
// app.use("/blog", blogRouter);

// listen to requests
app.listen(PORT, () => {
  console.log("Server is running");
});
