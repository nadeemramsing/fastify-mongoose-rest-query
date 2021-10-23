const fp = {
  drop: require('lodash/fp/drop'),
  filter: require('lodash/fp/filter'),
  map: require('lodash/fp/map'),
  pick: require('lodash/fp/pick'),
  pipe: require('lodash/fp/pipe'),
  pluck: require('lodash/fp/pluck'),
  take: require('lodash/fp/take'),
  uniq: require('lodash/fp/uniq'),
}

const { getSubArray } = require('../utils/model.util')
const { getQueryForSubArray, toJSONOptions } = require("../utils/mongoose.util")

module.exports = (modelName, path) => {
  return {
    get,
    create,
    distinct
  }

  async function get(req, rep) {
    const subarray = await getSubArray(req, modelName, path)

    const query = getQueryForSubArray(req.query)

    return fp.pipe(
      fp.filter(query.filter),
      fp.drop(query.drop),
      fp.take(query.take),
      fp.map(query.select ? fp.pick(query.select) : x => x)
    )(subarray)
  }

  async function create(req, rep) {
    const Model = req.models[modelName]

    const doc = await Model.findById(req.params.id)

    const subarray = doc[path]
    const body = req.body
    const isBodyArray = Array.isArray(body)

    if (isBodyArray)
      subarray.push(...body)
    else
      subarray.push(body)

    await doc.save({
      path,
      req,
      'isCreateSubItem': true
    })

    return doc.toJSON(toJSONOptions)[path]
  }

  async function distinct(req, rep) {
    const subarray = await getSubArray(req, modelName, path)

    const query = getQueryForSubArray(req.query)

    return fp.pipe(
      fp.filter(query.filter),
      fp.pluck(req.params.path),
      fp.uniq,
    )(subarray)
  }
}