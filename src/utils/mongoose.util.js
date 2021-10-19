const memo = require('nano-memoize')

const getQuery = memo(getQuery_)
const getCriteria = memo(getCriteria_)
const formatCriteriaValue = memo(formatCriteriaValue_)
const getSort = memo(getSort_)
const getSelect = memo(getSelect_)

const toJSONOptions = {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; return ret }
}

module.exports = {
  toJSONOptions,
  transformLean,
  getQuery,
}

function transformLean(docs) {
  if (!Array.isArray(docs))
    return transformLeanSingle(docs)

  return docs.map(transformLeanSingle)
}

function transformLeanSingle(doc) {
  delete doc._id
  return doc
}

function getQuery_(query) {

  let filter = {}
  let sort = {}
  let select = { __v: 0 }
  let populate = ''
  let criterias = []
  let limit = null
  let skip = null

  for (const field in query) {
    const value = query[field]

    if (field === 'sort')
      sort = getSort(value);

    else if (field === 'select')
      select = getSelect(value);

    else if (field === 'limit')
      limit = parseInt(value);

    else if (field === 'skip')
      skip = parseInt(value);

    else if (field === 'populate') {
      if (typeof value == 'object')
        populate = value;
      else
        populate = value.replace(/,/g, " ");
    }

    else {
      if (Array.isArray(value))
        criterias = value.map(v => getCriteria(field, v))
      else
        criterias.push(getCriteria(field, value));
    }
  }

  if (criterias.length > 0)
    filter = {
      $and: criterias
    };

  return {
    filter: filter,
    select: select,
    sort: sort,
    populate: populate,
    limit: limit,
    skip: skip
  };
}

function getCriteria_(field, value) {

  const criteria = {};

  criteria[field] = formatCriteriaValue(value);

  return criteria;
}

function formatCriteriaValue_(value = '') {

  if (value.startsWith('~'))
    return new RegExp(value.slice(1), 'i');

  if (value.startsWith('>='))
    return {
      $gte: value.slice(2)
    };

  if (value.startsWith('>'))
    return {
      $gt: value.slice(1)
    };

  if (value.startsWith('<='))
    return {
      $lte: value.slice(2)
    };

  if (value.startsWith('<'))
    return {
      $lt: value.slice(1)
    };

  if (value.startsWith('!='))
    return {
      $ne: value.slice(2)
    };

  if (value.startsWith('!in='))
    return {
      $nin: value.slice(4).split(',')
    };

  if (value.startsWith('in='))
    return {
      $in: value.slice(3).split(',')
    };

  if (value === 'null')
    return null

  return value;
}

function getSort_(fields) {
  const sort = {};

  const fieldList = fields
    .toString()
    .split(',');

  for (const field of fieldList)
    if (field.startsWith('-'))
      sort[field.slice(1)] = -1;
    else
      sort[field] = 1;

  return sort;
}

function getSelect_(fields) {
  const select = {};

  const fieldList = fields
    .toString()
    .split(',');

  for (const field of fieldList)
    if (field.startsWith('-'))
      select[field.slice(1)] = 0;
    else
      select[field] = 1;

  return select;
}
