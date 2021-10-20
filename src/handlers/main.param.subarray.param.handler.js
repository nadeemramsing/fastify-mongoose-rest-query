const fp = {
  drop: require('lodash/fp/drop'),
  filter: require('lodash/fp/filter'),
  first: require('lodash/fp/first'),
  pick: require('lodash/fp/pick'),
  pipe: require('lodash/fp/pipe'),
  take: require('lodash/fp/take'),
}

const { getSubArray } = require('../utils/model.util')
const { getQueryForSubArray } = require("../utils/mongoose.util")

module.exports = (modelName, path) => {
  return {
    getById
  }

  async function getById(req, rep) {
    const subarray = await getSubArray(req, modelName, path)

    const query = getQueryForSubArray(req.query)

    return fp.pipe(
      fp.filter({ id: req.params.subId }),
      fp.first,
      query.select ? fp.pick(query.select) : x => x
    )(subarray)
  }
}