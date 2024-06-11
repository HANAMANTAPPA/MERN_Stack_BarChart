const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");
const Transaction = require("./models/Transaction");

const app = express();
app.use(bodyParser.json());

const DATABASE_URL = "mongodb://localhost:27017/mern-coding-challenge";
mongoose
  .connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

// Initialize the database
app.get("/api/init", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const transactions = response.data;
    await Transaction.deleteMany({});
    await Transaction.insertMany(transactions);
    res.status(200).send("Database initialized with seed data");
  } catch (error) {
    res.status(500).send("Error initializing database");
  }
});

// List all transactions with search and pagination
app.get("/api/transactions", async (req, res) => {
  const { page = 1, perPage = 10, search = "", month } = req.query;
  const query = {
    $or: [
      { title: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
      { price: new RegExp(search, "i") },
    ],
    dateOfSale: {
      $gte: new Date(`2021-${month}-01`),
      $lt: new Date(`2021-${parseInt(month) + 1}-01`),
    },
  };

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));
    const total = await Transaction.countDocuments(query);
    res.json({ transactions, total });
  } catch (error) {
    res.status(500).send("Error fetching transactions");
  }
});

// API for statistics
app.get("/api/statistics", async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(`2021-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  try {
    const totalSaleAmount = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const totalSoldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lt: endDate },
      sold: true,
    });

    const totalNotSoldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lt: endDate },
      sold: false,
    });

    res.json({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    res.status(500).send("Error fetching statistics");
  }
});

// API for bar chart
app.get("/api/bar-chart", async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(`2021-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  try {
    const priceRanges = [
      { range: "0-100", min: 0, max: 100 },
      { range: "101-200", min: 101, max: 200 },
      { range: "201-300", min: 201, max: 300 },
      { range: "301-400", min: 301, max: 400 },
      { range: "401-500", min: 401, max: 500 },
      { range: "501-600", min: 501, max: 600 },
      { range: "601-700", min: 601, max: 700 },
      { range: "701-800", min: 701, max: 800 },
      { range: "801-900", min: 801, max: 900 },
      { range: "901-above", min: 901, max: Infinity },
    ];

    const result = await Promise.all(
      priceRanges.map(async ({ range, min, max }) => {
        const count = await Transaction.countDocuments({
          dateOfSale: { $gte: startDate, $lt: endDate },
          price: { $gte: min, $lt: max },
        });
        return { range, count };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).send("Error fetching bar chart data");
  }
});

// API for pie chart
app.get("/api/pie-chart", async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(`2021-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  try {
    const categories = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json(categories);
  } catch (error) {
    res.status(500).send("Error fetching pie chart data");
  }
});

// Combined API
app.get("/api/combined", async (req, res) => {
  const { month } = req.query;
  const [statistics, barChart, pieChart] = await Promise.all([
    axios.get(`http://localhost:3000/api/statistics?month=${month}`),
    axios.get(`http://localhost:3000/api/bar-chart?month=${month}`),
    axios.get(`http://localhost:3000/api/pie-chart?month=${month}`),
  ]);

  res.json({
    statistics: statistics.data,
    barChart: barChart.data,
    pieChart: pieChart.data,
  });
});

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
