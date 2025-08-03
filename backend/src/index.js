// backend/src/index.js

// 1. Import the Express library
const express = require('express');

// 2. Create an instance of an Express application
const app = express();

// 3. Define the port the server will run on.
// We'll use 3001 for the backend to avoid conflicts with the frontend.
const PORT = 3001;

// 4. Start the server and make it listen for connections on the specified port.
app.listen(PORT, () => {
  // This is a callback function that runs once the server is successfully started.
  // We log a message to the console so we know it's working.
  console.log(`🚀 Server is running and listening on http://localhost:${PORT}`);
});
