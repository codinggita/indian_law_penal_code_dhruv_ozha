const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const Law = require('./models/Law');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Map of file names to their standard Act acronym
const actFiles = {
  'ipc.json': 'IPC',
  'cpc.json': 'CPC',
  'crpc.json': 'CrPC',
  'hma.json': 'HMA',
  'ida.json': 'IDA',
  'iea.json': 'IEA',
  'nia.json': 'NIA',
  'MVA.json': 'MVA'
};

const normalizeData = (data, actName) => {
  return data.map(item => {
    // Some JSONs use "Section", others "section"
    const sectionRaw = item.Section || item.section;
    
    // Convert section to string safely
    const section = sectionRaw !== undefined && sectionRaw !== null ? String(sectionRaw) : "N/A";
    
    // Some use "section_title", "title"
    const title = item.section_title || item.title || "No Title";
    
    // Some use "section_desc", "description"
    const description = item.section_desc || item.description || "No Description";

    return {
      act: actName,
      chapter: item.chapter || null,
      chapter_title: item.chapter_title || null,
      section: section,
      title: title,
      description: description
    };
  });
};

// Import into DB
const importData = async () => {
  try {
    let allLaws = [];

    for (const [file, actName] of Object.entries(actFiles)) {
      if (fs.existsSync(`${__dirname}/${file}`)) {
        const rawData = JSON.parse(fs.readFileSync(`${__dirname}/${file}`, 'utf-8'));
        const normalized = normalizeData(rawData, actName);
        allLaws = [...allLaws, ...normalized];
        console.log(`Loaded ${normalized.length} records from ${file}`);
      } else {
        console.warn(`Warning: File ${file} not found, skipping.`);
      }
    }

    console.log(`Inserting ${allLaws.length} total records into database...`);
    await Law.create(allLaws);
    console.log('Data Imported Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Law.deleteMany();
    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please pass -i to import or -d to delete');
  process.exit();
}
