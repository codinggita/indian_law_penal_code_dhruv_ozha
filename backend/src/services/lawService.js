const Law = require('../models/Law');

function findAll(filters, sort, skip, limit) {
  return Law.find(filters).sort(sort).skip(skip).limit(limit);
}

function countAll(filters) {
  return Law.countDocuments(filters);
}

function findById(id) {
  return Law.findById(id);
}

function createOne(payload) {
  return Law.create(payload);
}

function updateById(id, payload) {
  return Law.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true
  });
}

function deleteById(id) {
  return Law.findByIdAndDelete(id);
}

module.exports = {
  findAll,
  countAll,
  findById,
  createOne,
  updateById,
  deleteById
};
