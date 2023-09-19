const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Connect to Database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "userdb",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Terhubung ke database MySQL");
});

app.use(bodyParser.json());

// Post
app.post("/users", (req, res) => {
  const { nama, email, password } = req.body;
  const sql = "INSERT INTO users (nama, email, password) VALUES (?, ?, ?)";
  db.query(sql, [nama, email, password], (err, result) => {
    if (err) {
      throw err;
    }
    res.json({
      user: {
        id: result.insertId,
        nama: nama,
        email: email,
      },
    });
  });
});

// Get
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

// Get by ID
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

// PUT (Update)
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { nama, email, password } = req.body;
  const sql = "UPDATE users SET nama = ?, email = ?, password = ? WHERE id = ?";
  db.query(sql, [nama, email, password, id], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.affectedRows > 0) {
      res.send(`Pengguna dengan ID ${id} berhasil diperbarui`);
    } else {
      res.status(404).send(`Pengguna dengan ID ${id} tidak ditemukan`);
    }
  });
});

// Delete
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.affectedRows > 0) {
      res.send(`Pengguna dengan ID ${id} berhasil dihapus`);
    } else {
      res.status(404).send(`Pengguna dengan ID ${id} tidak ditemukan`);
    }
  });
});

// Run Server
app.listen(port);
