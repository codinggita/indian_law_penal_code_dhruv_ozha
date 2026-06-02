require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Law = require('../models/Law');

const DATASET_DIR_CANDIDATES = [
  path.resolve(__dirname, '../../../recourse/Indian-Law-Penal-Code-Json'),
  path.resolve(__dirname, '../../../Indian-Law-Penal-Code-Json')
];

const ACT_NAMES = {
  cpc: 'CPC',
  crpc: 'CrPC',
  hma: 'HMA',
  ida: 'IDA',
  iea: 'IEA',
  ipc: 'IPC',
  mva: 'MVA',
  nia: 'NIA'
};

const ACT_CATEGORIES = {
  cpc: 'Civil Procedure',
  crpc: 'Criminal Procedure',
  hma: 'Family Law',
  ida: 'Family Law',
  iea: 'Evidence Law',
  ipc: 'Criminal Law',
  mva: 'Motor Vehicles',
  nia: 'Negotiable Instruments'
};

function getDatasetDir() {
  const datasetDir = DATASET_DIR_CANDIDATES.find((candidate) => fs.existsSync(candidate));

  if (!datasetDir) {
    throw new Error('Dataset folder not found. Expected recourse/Indian-Law-Penal-Code-Json or Indian-Law-Penal-Code-Json.');
  }

  return datasetDir;
}

function normalizeLaw(fileName, item) {
  const actKey = path.basename(fileName, '.json').toLowerCase();
  const sectionNumber = item.section ?? item.Section;
  const title = String(item.title ?? item.section_title ?? '').trim();
  const description = String(item.description ?? item.section_desc ?? '').trim();
  const chapter = item.chapter == null ? undefined : String(item.chapter);
  const chapterTitle = item.chapter_title;

  return {
    sectionNumber: String(sectionNumber ?? '').trim(),
    title: title || `Section ${sectionNumber}`,
    description: description || 'Description not available in source dataset.',
    actName: ACT_NAMES[actKey] || 'Other',
    chapter,
    category: chapterTitle || ACT_CATEGORIES[actKey] || 'General',
    state: 'All States',
    status: 'active',
    importance: 'medium',
    tags: [ACT_NAMES[actKey] || 'Other', chapterTitle || ACT_CATEGORIES[actKey] || 'General'].filter(Boolean)
  };
}

function cleanCsvValue(value) {
  return String(value ?? '')
    .trim()
    .replace(/^"|"$/g, '')
    .trim();
}

function toStructuredRecords(records) {
  const structuredRecords = [];

  records.forEach((item) => {
    if (!Object.prototype.hasOwnProperty.call(item, 'chapter,section,section_title,section_desc')) {
      structuredRecords.push(item);
      return;
    }

    const line = cleanCsvValue(item['chapter,section,section_title,section_desc']);
    if (!line) return;

    const match = line.match(/^([^,]+),([^,]+),([^,]+),(.*)$/);
    if (match) {
      structuredRecords.push({
        chapter: cleanCsvValue(match[1]),
        section: cleanCsvValue(match[2]),
        section_title: cleanCsvValue(match[3]),
        section_desc: cleanCsvValue(match[4])
      });
      return;
    }

    const previousRecord = structuredRecords[structuredRecords.length - 1];
    if (previousRecord) {
      previousRecord.section_desc = `${previousRecord.section_desc || ''} ${line}`.trim();
    }
  });

  return structuredRecords;
}

async function seed() {
  const datasetDir = getDatasetDir();
  const files = fs
    .readdirSync(datasetDir)
    .filter((fileName) => fileName.toLowerCase().endsWith('.json'))
    .sort();

  const laws = files.flatMap((fileName) => {
    const filePath = path.join(datasetDir, fileName);
    const records = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!Array.isArray(records)) {
      throw new Error(`${fileName} must contain a JSON array.`);
    }

    return toStructuredRecords(records).map((item) => normalizeLaw(fileName, item));
  });

  const invalidLaw = laws.find((law) => !law.sectionNumber || !law.title || !law.description);
  if (invalidLaw) {
    throw new Error(`Dataset contains an invalid law record: ${JSON.stringify(invalidLaw)}`);
  }

  await mongoose.connect(process.env.MONGO_URI);
  await Law.deleteMany({});
  await Law.insertMany(laws, { ordered: false });

  const counts = await Law.aggregate([
    { $group: { _id: '$actName', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  console.log(`Dataset seeded successfully. Inserted ${laws.length} laws.`);
  console.table(counts);

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(`Seed failed: ${error.message}`);
  try {
    await mongoose.disconnect();
  } catch (_) {
    // Ignore disconnect failures during seed error cleanup.
  }
  process.exit(1);
});
