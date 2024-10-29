const express = require("express");
const morgan = require("morgan");
const pg = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Database configuration
const db = new pg.Client({
    host: "localhost",
    port: 5432,
    database: "finance_tracker",
    user: "postgres",
    password: "root"
});

// Connect to the database with error handling
db.connect()
    .then(() => console.log("Database connected!"))
    .catch((err) => {
        console.error("Database connection error:", err);
        process.exit(1); // Exit if the database connection fails
    });

// Middleware
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add JSON body parsing

// Routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/add", async (req, res) => {
    try {
        const data = req.body;
        
        // Check if required fields are provided
        if (!data.id || !data.desc || !data.mode || !data.amount) {
            return res.status(400).send("Missing required fields.");
        }
        
        // Insert data into the database
        const result = await db.query(
            `INSERT INTO hello (id, desc, mode, amount) VALUES ($1, $2, $3, $4) RETURNING *`,
            [data.id, data.desc, data.mode, data.amount]
        );
        
        console.log("Inserted Record:", result.rows[0]); // Log the inserted record
        res.status(201).send("Record Inserted");
    } catch (err) {
        console.error("Error inserting record:", err);
        res.status(500).send("Server error");
    }
});

// Start the server
app.listen(6969, () => {
    console.log("Server started at port 6969");
});
