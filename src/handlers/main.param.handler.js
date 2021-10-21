const { getQuery, toJSONOptions, transformLean, leanOptions } = require("../utils/mongoose.util")

module.exports = modelName => {
  return {
    getById,
    updateById,
    deleteById
  }

  function getById(req, rep) {
    const Model = req.models.get(modelName)

    const query = getQuery(req.query)

    return Model
      .findById(req.params.id)
      .select(query.select)
      .populate(query.populate)
      .lean(leanOptions)
      .then(transformLean)
  }

  async function updateById(req, rep) {
    const Model = req.models.get(modelName)

    const doc = await Model.findById(req.params.id)

    Object.assign(doc, req.body)

    Object.keys(req.body).forEach(key => doc.markModified(key))

    await doc.save({ req, 'isUpdateById': true })

    return doc.toJSON(toJSONOptions)
  }

  async function deleteById(req, rep) {
    const Model = req.models.get(modelName)

    const doc = await Model
      .findById(req.params.id)
      .select('_id')

    if (!doc)
      throw 'DocumentNotFound'

    await doc.remove({ req, 'isDeleteById': true })

    return 'OK'
  }
}