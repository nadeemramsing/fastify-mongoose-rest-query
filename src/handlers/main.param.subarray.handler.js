const fp = {
  drop: require('lodash/fp/drop'),
  filter: require('lodash/fp/filter'),
  pipe: require('lodash/fp/pipe'),
  take: require('lodash/fp/take'),
}

const { getSubArray } = require('../utils/model.util')
const { getQueryForSubArray } = require("../utils/mongoose.util")

module.exports = (modelName, path) => {
  return {
    get
  }

  async function get(req, rep) {
    const subarray = await getSubArray(req, modelName, path)

    const query = getQueryForSubArray(req.query)

    return fp.pipe(
      fp.filter(query.filter),
      fp.drop(query.drop),
      fp.take(query.take)
    )(subarray)
  }
}