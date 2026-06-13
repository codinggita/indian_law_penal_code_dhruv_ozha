const mongoose = require('mongoose');
const lawService = require('../services/lawService');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const { getPagination } = require('../utils/pagination');

// ALLOWED_SORT_FIELDS now supports views, bookmarkCount, and importance
const ALLOWED_SORT_FIELDS = new Set([
  'sectionNumber', 'title', 'actName', 'category', 'state', 
  'createdAt', 'updatedAt', 'views', 'bookmarkCount', 'importance'
]);

const MAX_SEARCH_LENGTH = 80;

function parseBoolean(value) {
  if (value === undefined) return undefined;
  if (String(value).toLowerCase() === 'true') return true;
  if (String(value).toLowerCase() === 'false') return false;
  return undefined;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeSort(sortValue) {
  if (!sortValue || typeof sortValue !== 'string') return 'sectionNumber';
  
  let isDesc = sortValue.startsWith('-');
  let field = isDesc ? sortValue.slice(1) : sortValue;
  
  // Map 'section' to actual schema field 'sectionNumber'
  if (field === 'section') {
    field = 'sectionNumber';
  }
  
  if (!ALLOWED_SORT_FIELDS.has(field)) {
    return 'sectionNumber';
  }
  
  return isDesc ? `-${field}` : field;
}

function buildFilters(query) {
  const filters = {};

  if (query.act) {
    filters.actName = Array.isArray(query.act) ? { $in: query.act } : (query.act.includes(',') ? { $in: query.act.split(',') } : query.act);
  }
  if (query.category) {
    filters.category = Array.isArray(query.category) ? { $in: query.category } : (query.category.includes(',') ? { $in: query.category.split(',') } : query.category);
  }
  if (query.state) {
    filters.state = Array.isArray(query.state) ? { $in: query.state } : (query.state.includes(',') ? { $in: query.state.split(',') } : query.state);
  }

  const bailable = parseBoolean(query.bailable);
  if (bailable !== undefined) filters.bailable = bailable;

  const cognizable = parseBoolean(query.cognizable);
  if (cognizable !== undefined) filters.cognizable = cognizable;

  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filters.$or = [
      { title: regex },
      { description: regex },
      { actName: regex },
      { category: regex }
    ];
  }

  return filters;
}

async function listByFilters(req, res, next, extraFilters = {}, defaultSort = 'sectionNumber') {
  const { page, limit, skip } = getPagination(req.query);
  const sort = normalizeSort(req.query.sort || defaultSort);
  const filters = { ...buildFilters(req.query), ...extraFilters };

  const [laws, total] = await Promise.all([
    lawService.findAll(filters, sort, skip, limit),
    lawService.countAll(filters)
  ]);

  const pagination = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };

  return ApiResponse.success(res, 'Laws fetched successfully', laws, 200, pagination);
}

exports.getAllLaws = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req.query);
  const sort = normalizeSort(req.query.sort);

  if (req.query.bailable !== undefined && parseBoolean(req.query.bailable) === undefined) {
    return ApiResponse.error(res, 'Invalid bailable value. Use true or false.', null, 400);
  }
  if (req.query.cognizable !== undefined && parseBoolean(req.query.cognizable) === undefined) {
    return ApiResponse.error(res, 'Invalid cognizable value. Use true or false.', null, 400);
  }
  if (req.query.search && String(req.query.search).length > MAX_SEARCH_LENGTH) {
    return ApiResponse.error(res, `Search must be at most ${MAX_SEARCH_LENGTH} characters.`, null, 400);
  }
  if (req.query.search) {
    req.query.search = escapeRegex(String(req.query.search).trim());
  }

  const filters = buildFilters(req.query);

  const [laws, total] = await Promise.all([
    lawService.findAll(filters, sort, skip, limit),
    lawService.countAll(filters)
  ]);

  const pagination = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };

  return ApiResponse.success(res, 'Laws fetched successfully', laws, 200, pagination);
});

exports.getRecentLaws = asyncHandler(async (req, res, next) => listByFilters(req, res, next, {}, '-createdAt'));
exports.getTrendingLaws = asyncHandler(async (req, res, next) => listByFilters(req, res, next, {}, '-views'));
exports.getArchivedLaws = asyncHandler(async (req, res, next) => listByFilters(req, res, next, { isArchived: true }, '-updatedAt'));
exports.searchLaws = asyncHandler(async (req, res, next) => {
  req.query.search = req.query.q || req.query.search;
  return listByFilters(req, res, next);
});

exports.filterByAct = asyncHandler(async (req, res, next) => listByFilters(req, res, next, { actName: req.params.actName }));
exports.filterByCategory = asyncHandler(async (req, res, next) => listByFilters(req, res, next, { category: req.params.category }));
exports.filterByState = asyncHandler(async (req, res, next) => listByFilters(req, res, next, { state: req.params.state }));
exports.filterByCourt = asyncHandler(async (req, res, next) => listByFilters(req, res, next, { court: req.params.courtName }));
exports.filterByStatus = asyncHandler(async (req, res, next) => listByFilters(req, res, next, { status: req.params.status }));
exports.filterByBailable = asyncHandler(async (req, res, next) => listByFilters(req, res, next, { bailable: req.params.value === 'true' }));
exports.filterByCognizable = asyncHandler(async (req, res, next) => listByFilters(req, res, next, { cognizable: req.params.value === 'true' }));
exports.filterByChapter = asyncHandler(async (req, res, next) => listByFilters(req, res, next, { chapter: req.params.chapterId }));
exports.filterBySection = asyncHandler(async (req, res, next) => listByFilters(req, res, next, { sectionNumber: req.params.sectionNumber }));
exports.filterByPunishmentType = asyncHandler(async (req, res, next) => listByFilters(req, res, next, { punishmentType: req.params.type }));

exports.getLawById = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return ApiResponse.error(res, 'Invalid law id', null, 400);
  }

  const law = await lawService.findById(req.params.id);
  if (!law) {
    return ApiResponse.error(res, 'Law not found', null, 404);
  }

  return ApiResponse.success(res, 'Law fetched successfully', law, 200);
});

exports.getLawExistsById = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return ApiResponse.error(res, 'Invalid law id', null, 400);
  }
  const law = await lawService.findById(req.params.id);
  return ApiResponse.success(res, 'Law existence checked', { exists: Boolean(law) }, 200);
});

exports.getRandomLaw = asyncHandler(async (req, res, next) => {
  const laws = await lawService.findAll({}, 'sectionNumber', 0, 1);
  if (!laws.length) {
    return ApiResponse.error(res, 'No laws found', null, 404);
  }
  const count = await lawService.countAll({});
  const randomSkip = Math.floor(Math.random() * count);
  const randomLaw = await lawService.findAll({}, 'sectionNumber', randomSkip, 1);
  return ApiResponse.success(res, 'Random law fetched successfully', randomLaw[0] || laws[0], 200);
});

exports.getLawSummary = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return ApiResponse.error(res, 'Invalid law id', null, 400);
  }
  const law = await lawService.findById(req.params.id);
  if (!law) {
    return ApiResponse.error(res, 'Law not found', null, 404);
  }
  return ApiResponse.success(res, 'Law summary fetched successfully', {
    id: law._id,
    sectionNumber: law.sectionNumber,
    title: law.title,
    punishmentType: law.punishmentType,
    punishmentDetails: law.punishmentDetails
  }, 200);
});

exports.getLawHistory = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return ApiResponse.error(res, 'Invalid law id', null, 400);
  }
  const law = await lawService.findById(req.params.id);
  if (!law) {
    return ApiResponse.error(res, 'Law not found', null, 404);
  }
  return ApiResponse.success(res, 'Law history fetched successfully', law.updateHistory || [], 200);
});

exports.createLaw = asyncHandler(async (req, res, next) => {
  const law = await lawService.createOne(req.body);
  return ApiResponse.success(res, 'Law created successfully', law, 201);
});

exports.updateLaw = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return ApiResponse.error(res, 'Invalid law id', null, 400);
  }

  const payload = {
    ...req.body,
    $push: {
      updateHistory: {
        updatedAt: new Date(),
        updatedBy: req.user?.id || 'system',
        changes: 'Law updated'
      }
    }
  };
  const law = await lawService.updateById(req.params.id, payload);

  if (!law) {
    return ApiResponse.error(res, 'Law not found', null, 404);
  }

  return ApiResponse.success(res, 'Law updated successfully', law, 200);
});

exports.archiveLaw = asyncHandler(async (req, res, next) => {
  req.body = { isArchived: true };
  return exports.updateLaw(req, res, next);
});

exports.restoreLaw = asyncHandler(async (req, res, next) => {
  req.body = { isArchived: false };
  return exports.updateLaw(req, res, next);
});

exports.deleteLaw = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return ApiResponse.error(res, 'Invalid law id', null, 400);
  }

  const law = await lawService.deleteById(req.params.id);
  if (!law) {
    return ApiResponse.error(res, 'Law not found', null, 404);
  }

  return ApiResponse.success(res, 'Law deleted successfully', { id: req.params.id }, 200);
});

exports.getLawStats = asyncHandler(async (req, res, next) => {
  const stats = await lawService.getOverviewStats();
  return ApiResponse.success(res, 'Law stats fetched successfully', stats, 200);
});
