const fp = {
  drop: require('lodash/fp/drop'),
  filter: require('lodash/fp/filter'),
  pipe: require('lodash/fp/pipe'),
  take: require('lodash/fp/take'),
}

const { leanOptions, transformLean, getQueryForSubArray } = require("../utils/mongoose.util")

module.exports = (modelName, path) => {
  return {
    get
  }

  async function get(req, rep) {
    const Model = req.models.get(modelName)

    const query = getQueryForSubArray(req.query)

    const doc = await Model
      .findById(req.params.id)
      .select(path)
      .lean(leanOptions)

    const subarray = transformLean(doc[path])

    return fp.pipe(
      fp.filter(query.filter),
      fp.drop(query.drop),
      fp.take(query.take)
    )(subarray)
  }
}