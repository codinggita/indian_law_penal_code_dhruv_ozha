const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') }); // Load .env from backend root
const mongoose = require('mongoose');
const fs = require('fs');
const connectDB = require('../config/db');
const Law = require('../models/Law');

// Base directory where JSON files are located
const dataDir = path.resolve(__dirname, '../../../../'); 

const filesToImport = [
  { file: 'cpc.json', actName: 'CPC', category: 'Civil Procedure' },
  { file: 'crpc.json', actName: 'CrPC', category: 'Criminal Procedure' },
  { file: 'hma.json', actName: 'HMA', category: 'Family Law' },
  { file: 'ida.json', actName: 'IDA', category: 'Family Law' },
  { file: 'iea.json', actName: 'IEA', category: 'Evidence Law' },
  { file: 'ipc.json', actName: 'IPC', category: 'Criminal Law' },
  { file: 'MVA.json', actName: 'MVA', category: 'Motor Vehicles Law' },
  { file: 'nia.json', actName: 'NIA', category: 'Commercial Law' }
];

async function importData() {
  try {
    await connectDB();
    console.log('Connected to MongoDB. Starting import...');

    // Clear existing laws? Maybe not, or just add new ones.
    // Let's not clear to preserve any existing user data, unless needed.
    // Since this is an initial seed, we might want to clear or just insert.
    // We will just insert them. If user wants to clear, they can use admin route.
    
    let totalImported = 0;

    for (const item of filesToImport) {
      const filePath = path.join(dataDir, item.file);
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
      }

      console.log(`Reading ${item.file}...`);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      const lawsToInsert = data.map(law => ({
        sectionNumber: law.section ? String(law.section) : 'Unknown',
        title: law.title || 'No Title',
        description: law.description || 'No Description',
        actName: item.actName,
        category: item.category,
        bailable: false, 
        cognizable: true, 
        status: 'active',
        importance: 'medium',
        state: 'All States'
      }));

      // Insert into DB
      await Law.insertMany(lawsToInsert);
      console.log(`Successfully imported ${lawsToInsert.length} records from ${item.file}`);
      totalImported += lawsToInsert.length;
    }

    console.log(`\nImport complete! Total records imported: ${totalImported}`);
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importData();
