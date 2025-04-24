const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_password",
  database: "user_auth",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected.");
});

// Signup route
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.query(sql, [username, hashedPassword], (err) => {
    if (err) return res.status(500).send("Error creating user.");
    res.status(201).send("User created.");
  });
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, result) => {
    if (err) return res.status(500).send("Error finding user.");
    if (result.length === 0) return res.status(404).send("User not found.");

    const user = result[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).send("Invalid password.");

    const token = jwt.sign({ id: user.id }, "secret_key", { expiresIn: 86400 });
    res.status(200).send({ auth: true, token });
  });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));