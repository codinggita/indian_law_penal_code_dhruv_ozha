const mongoose = require('mongoose');

const lawSchema = new mongoose.Schema({
  sectionNumber: {
    type: String,
    required: [true, 'Section number is required'],
    index: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  actName: {
    type: String,
    required: [true, 'Act name is required'],
    index: true,
    enum: ['IPC', 'CrPC', 'CPC', 'HMA', 'IDA', 'IEA', 'MVA', 'NIA', 'Evidence Act', 'Constitution', 'Other']
  },
  chapter: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    index: true
  },
  punishmentType: {
    type: String
  },
  punishmentDetails: {
    type: String
  },
  bailable: {
    type: Boolean,
    default: false
  },
  cognizable: {
    type: Boolean,
    default: true
  },
  compoundable: {
    type: Boolean,
    default: false
  },
  triableBy: {
    type: String
  },
  state: {
    type: String,
    default: 'All States',
    index: true
  },
  court: {
    type: String,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'repealed', 'amended'],
    default: 'active'
  },
  importance: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  views: {
    type: Number,
    default: 0
  },
  bookmarkCount: {
    type: Number,
    default: 0
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  updateHistory: [{
    updatedAt: { type: Date, default: Date.now },
    updatedBy: String,
    changes: String
  }]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Law', lawSchema);
