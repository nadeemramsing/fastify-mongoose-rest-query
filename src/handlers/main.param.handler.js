const { getQuery } = require("../utils/mongoose.util")

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
      .lean({ virtuals: true })
  }

  function updateById(req, rep) {
    const Model = req.models.get(modelName)

    return Model
  }

  function deleteById(req, rep) {
    const Model = req.models.get(modelName)

    return Model.deleteOne({ _id: req.params.id })
  }
}