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
    getById,
    deleteById,
  }

  async function getById(req, rep) {
    const subarray = await getSubArray(req, modelName, path)
    const query = getQueryForSubArray(req.query)

    const subitem = fp.pipe(
      fp.filter({ id: req.params.subId }),
      fp.first,
      query.select ? fp.pick(query.select) : x => x
    )(subarray)

    if (!subitem)
      throw 'SubDocumentNotFound'

    return subitem
  }

  async function deleteById(req, rep) {
    const Model = req.models.get(modelName)

    const doc = await Model
      .findById(req.params.id)
      .select(path)

    const subarray = doc[path]
    const subitem = subarray.find(subitem => subitem.id === req.params.subId)

    subitem.remove()
    await doc.save({ req, 'isDeleteSubItem': true })

    return 'OK'
  }
}