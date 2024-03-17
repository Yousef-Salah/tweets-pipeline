const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.SERVER_PORT || 3000;
const Tweet = require("./models/Tweet");
const kafkaConsumer = require("./consumer");

require("dotenv").config();
app.set("view engine", "ejs"); // use EJS
app.set("views", "./views");
app.use(express.static(path.join(__dirname, "/public"))); // set path for assets folder

// MongoDB connection
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error(error));

app.get("/dashboard", function (req, res) {
  res.sendFile("./public/index.html");
});

kafkaConsumer();

app.get("/top-users", async (req, res) => {
  const topUsers = await Tweet.aggregate([
    { $group: { _id: "$user", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 },
    { $project: { _id: 0, user: "$_id", count: 1 } }, // Rename _id to user
  ]);

  let data = topUsers.map(function (recored) {
    return recored.count;
  });

  let labels = topUsers.map(function (recored) {
    return recored.user;
  });

  res.json({
    data,
    labels,
  });
});

app.get("/tweet-distribution", async (req, res) => {
  let tweetDistribution = await Tweet.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, day: "$_id", count: 1 } },
  ]);

  let data = tweetDistribution.map(function (recored) {
    return recored.count;
  });

  let labels = tweetDistribution.map(function (recored) {
    return recored.day;
  });

  res.json({ data, labels });
});

app.get("/user-tweet-distribution", async (req, res) => {
  console.log(req.query.username);
  let tweetDistribution = await Tweet.aggregate([
    {
      $match: {
        user: req.query.username,
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, day: "$_id", count: 1 } },
  ]);

  let data = tweetDistribution.map(function (recored) {
    return recored.count;
  });

  let labels = tweetDistribution.map(function (recored) {
    return recored.day;
  });

  res.json({ data, labels });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
