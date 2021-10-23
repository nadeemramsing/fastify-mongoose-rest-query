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
const { getQueryForSubArray } = require("../utils/mongoose.util")

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

  function create(req, rep) {
    debugger
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