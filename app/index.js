const fs = require("fs");
const path = require("path");
const axios = require("axios");
const express = require("express");
const cors = require("cors");

// counter variable to keep track of requests
let count = 0;
// Default message
const message = "Welcome to the Node-Example API - Deployed with ArgoCD - V6";

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app
  .route("/")
  .get((req, res) => {
    count++;
    res.status(200).json({ success: true, message, count });
  })
  .post((req, res) => {
    count++;
    res.status(201).json({ success: true, data: req.body, message, count });
  });

// Endpoint to crash the server
app.get("/crash", (req, res) => {
  console.log("Crashing the server...");

  res.status(500).json({
    success: false,
    message: "Node-Example Server is crashing...",
    count,
  });
  process.exit(1); // Exit the process to simulate a crash
});

// Endpoint to get data from another service
app
  .route("/data")
  .get(async (req, res) => {
    count++;
    try {
      // Get the URL from query parameters or use default
      const url = req.query.url || "http://client-service:80/data";
      const response = await axios.get(url);
      res
        .status(200)
        .json({ success: true, data: response.data, message, count });
    } catch (error) {
      console.error("Error fetching data from client service:", error);
      res.status(500).json({
        success: false,
        message: "Node-Example app: Error fetching data",
        count,
        error: error?.response?.data || error.message,
      });
    }
  })
  .post(async (req, res) => {
    count++;
    // Call the client service to post data
    const url = req.query.url || "http://client-service:80/data";
    try {
      const response = await axios.post(url, req.body);
      res
        .status(201)
        .json({ success: true, data: response.data, message, count });
    } catch (error) {
      console.error("Error posting data to client service:", error);
      res.status(500).json({
        success: false,
        message: "Node-Example app: Error posting data",
        count,
        error: error?.response?.data || error.message,
      });
    }
  });

// Endpoint to write and read from the public/text.txt file
app
  .route("/text")
  .get(async (req, res) => {
    count++;
    try {
      const data = await fs.promises.readFile(
        path.join(__dirname, "public", "text.txt"),
        "utf-8"
      );
      res.status(200).json({ success: true, text: data, count });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Node-Example app: Error reading text file",
        count,
        error: error.message,
      });
    }
  })
  .post(async (req, res) => {
    count++;
    try {
      await fs.promises.appendFile(
        path.join(__dirname, "public", "text.txt"),
        `${req.body.text}\n`
      );
      res
        .status(201)
        .json({ success: true, count, message: "Text file updated" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Node-Example app: Error writing to text file",
        count,
        error: error.message,
      });
    }
  });

// Start the server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
