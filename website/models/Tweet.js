const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
  id: {
    type: Number,
    require: false,
  },
  date: {
    type: Date,
    require: true,
  },
  user: {
    type: String,
    require: true,
  },
  text: {
    type: String,
    require: true,
  },
  retweets: {
    type: Number,
    require: false,
  },
});

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
