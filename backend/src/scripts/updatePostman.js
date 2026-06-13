const fs = require('fs');
const path = require('path');

const postmanPath = path.join(__dirname, '../../postman/indian-law-penal-code.postman_collection.json');

if (!fs.existsSync(postmanPath)) {
  console.error("Postman collection not found");
  process.exit(1);
}

const collection = JSON.parse(fs.readFileSync(postmanPath, 'utf8'));

// Helper to find a folder by name
function findFolder(items, namePart) {
  return items.find(item => item.name && item.name.toLowerCase().includes(namePart.toLowerCase()));
}

// 1. Add PUT /api/v1/laws/:id to Basic CRUD
const crudFolder = findFolder(collection.item, 'Basic CRUD') || findFolder(collection.item, 'Laws');
if (crudFolder && crudFolder.item) {
  const hasPut = crudFolder.item.some(i => i.request && i.request.method === 'PUT');
  if (!hasPut) {
    crudFolder.item.push({
      name: "Replace Law by ID (PUT)",
      request: {
        method: "PUT",
        header: [
          { key: "Content-Type", value: "application/json" },
          { key: "Authorization", value: "Bearer {{token}}" }
        ],
        body: {
          mode: "raw",
          raw: "{\n  \"title\": \"Updated Title\"\n}"
        },
        url: {
          raw: "{{baseUrl}}/api/v1/laws/{{lawId}}",
          host: ["{{baseUrl}}"],
          path: ["api", "v1", "laws", "{{lawId}}"]
        }
      }
    });
    console.log("Added PUT route to CRUD folder.");
  }
}

// 2. Add Filters
const filterFolder = findFolder(collection.item, 'Filter') || findFolder(collection.item, 'Laws');
if (filterFolder && filterFolder.item) {
  const filtersToAdd = [
    { name: "Filter by Punishment Type", path: ["api", "v1", "laws", "filter", "punishment", "Imprisonment"] },
    { name: "Filter Recent", path: ["api", "v1", "laws", "filter", "recent"] },
    { name: "Filter Trending", path: ["api", "v1", "laws", "filter", "trending"] }
  ];

  for (const filter of filtersToAdd) {
    const rawUrl = "{{baseUrl}}/" + filter.path.join('/');
    const exists = filterFolder.item.some(i => i.request && i.request.url && i.request.url.raw === rawUrl);
    if (!exists) {
      filterFolder.item.push({
        name: filter.name,
        request: {
          method: "GET",
          header: [],
          url: {
            raw: rawUrl,
            host: ["{{baseUrl}}"],
            path: filter.path
          }
        }
      });
      console.log(`Added ${filter.name} to Filter folder.`);
    }
  }
}

fs.writeFileSync(postmanPath, JSON.stringify(collection, null, 2));
console.log("Postman collection updated successfully.");
