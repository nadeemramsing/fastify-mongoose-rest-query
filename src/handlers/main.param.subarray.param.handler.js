const fp = {
  drop: require('lodash/fp/drop'),
  filter: require('lodash/fp/filter'),
  first: require('lodash/fp/first'),
  pick: require('lodash/fp/pick'),
  pipe: require('lodash/fp/pipe'),
  take: require('lodash/fp/take'),
}

const { getSubArray } = require('../utils/model.util')
const { getQueryForSubArray, toJSONOptions } = require("../utils/mongoose.util")

module.exports = (modelName, path) => {
  return {
    getById,
    updateById,
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

  async function updateById(req, rep) {
    const Model = req.models.get(modelName)

    const doc = await Model.findById(req.params.id)

    const subarray = doc[path]
    const subitem = subarray.find(subitem => subitem.id === req.params.subId)

    Object.assign(subitem, req.body)

    Object.keys(req.body).forEach(field => subitem.markModified(field))

    await doc.save({ req, 'isUpdateSubItemById': true })

    return subitem.toJSON(toJSONOptions)
  }

  async function deleteById(req, rep) {
    const Model = req.models.get(modelName)

    const doc = await Model
      .findById(req.params.id)
      .select(path)

    const subarray = doc[path]
    const subitem = subarray.find(subitem => subitem.id === req.params.subId)

    subitem.remove()
    await doc.save({ req, 'isDeleteSubItemById': true })

    return 'OK'
  }
}