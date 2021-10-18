const memo = require('nano-memoize')

const getQuery = memo(getQuery_)
const getCriteria = memo(getCriteria_)
const formatCriteriaValue = memo(formatCriteriaValue_)
const getSort = memo(getSort_)
const getSelect = memo(getSelect_)

module.exports = {
  getQuery
}


function getQuery_(query) {

  const filter = {}
  const sort = {}
  const select = {}
  const populate = ''
  const criterias = []
  const limit = null
  const skip = null

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
    populate: populate || 'null',
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
