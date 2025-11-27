require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// In-memory storage for testing
let people = [];
let nextId = 1;

// Routes
app.get("/api/v1/people", (req, res) => {
  res.json({ success: true, data: people });
});

app.post("/api/v1/people", (req, res) => {
  const { name, email, phone, department } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ 
      success: false, 
      message: "Name and email are required" 
    });
  }

  const person = {
    id: nextId++,
    name,
    email,
    phone: phone || "",
    department: department || "",
    createdAt: new Date().toISOString()
  };
  
  people.push(person);
  console.log("✅ Added person:", person.name);
  res.status(201).json({ success: true, data: person });
});

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    peopleCount: people.length
  });
});

// Get person by ID
app.get("/api/v1/people/:id", (req, res) => {
  const person = people.find(p => p.id === parseInt(req.params.id));
  if (!person) {
    return res.status(404).json({ success: false, message: "Person not found" });
  }
  res.json({ success: true, data: person });
});

// Delete person by ID
app.delete("/api/v1/people/:id", (req, res) => {
  const index = people.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Person not found" });
  }
  
  const deletedPerson = people.splice(index, 1)[0];
  console.log("🗑️ Deleted person:", deletedPerson.name);
  res.json({ success: true, data: deletedPerson });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`\n🚀 Server started successfully!`);
  console.log(`📍 Port: ${port}`);
  console.log(`🌐 URL: http://localhost:${port}`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   GET  /api/v1/health     - Health check`);
  console.log(`   GET  /api/v1/people     - Get all people`);
  console.log(`   POST /api/v1/people     - Add a person`);
  console.log(`   GET  /api/v1/people/:id - Get person by ID`);
  console.log(`   DELETE /api/v1/people/:id - Delete person by ID`);
  console.log(`\n💡 Tip: Use curl or Postman to test the API`);
  console.log(`   Example: curl -X POST http://localhost:${port}/api/v1/people \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '{"name":"John Doe","email":"john@example.com"}'`);
  console.log(`\n✅ Ready to accept requests...\n`);
});
