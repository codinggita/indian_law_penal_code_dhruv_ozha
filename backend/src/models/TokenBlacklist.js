const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d' // Automatically removes the token after 7 days
  }
});

module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema);
