const mongoose = require('mongoose');

const lawSchema = new mongoose.Schema({
  act: { 
    type: String, 
    required: [true, 'Act name is required'],
    index: true // e.g., 'IPC', 'CPC', 'CrPC', 'MVA'
  },
  chapter: { 
    type: Number, 
    default: null 
  },
  chapter_title: { 
    type: String, 
    default: null 
  },
  section: { 
    type: String, 
    required: [true, 'Section number/string is required'],
    index: true // e.g., "1", "2A", "498A"
  },
  title: { 
    type: String, 
    required: [true, 'Section title is required'],
    index: true
  },
  description: { 
    type: String, 
    required: [true, 'Section description is required']
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Law', lawSchema);
