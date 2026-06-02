const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporterName: {
    type: String,
    required: true
  },
  lawId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Law',
    required: true
  },
  issueDescription: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'resolved'],
    default: 'pending'
  },
  resolutionDetails: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
