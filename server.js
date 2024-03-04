/*******************************************/
/*              Express Setup               */
/*******************************************/

// Importing the Express framework
const express = require("express");

// Creating an Express application instance
const app = express();

/*******************************************/
/*            Server Setup                  */
/*******************************************/

// Creating an HTTP server instance using the Express application
const http = require("http").createServer(app);

// Setting the port number for the server to listen on
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

/*******************************************/
/*        Serving Static Files              */
/*******************************************/

// Serving static files (e.g., HTML, CSS, JavaScript) from the public directory
app.use(express.static(__dirname + "/public"));

/*******************************************/
/*          Handling Root Request           */
/*******************************************/

// Handling requests to the root URL and serving the index.html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

/*******************************************/
/*            Socket.IO Setup               */
/*******************************************/

// Setting up Socket.IO for real-time communication
const io = require("socket.io")(http);

/*******************************************/
/*         Handling Socket Connections      */
/*******************************************/

// Handling socket connections
io.on("connection", (socket) => {
  // Log a message when a new socket connection is established
  console.log("Connected...");

  // Handling incoming messages from clients and broadcasting them to other clients
  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });

  // Listen for typing event
  socket.on("typing", () => {
    // Broadcast to other clients that this user is typing
    socket.broadcast.emit("userTyping", socket.id);
  });

  // Listen for stop typing event
  socket.on("stopTyping", () => {
    // Broadcast to other clients that this user stopped typing
    socket.broadcast.emit("userStoppedTyping", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
