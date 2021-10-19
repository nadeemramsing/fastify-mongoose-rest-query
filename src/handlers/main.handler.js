const { getQuery } = require('../utils/mongoose.util')

module.exports = modelName => {
  return {
    get,
    count,
    create,
    updateMany,
    deleteMany
  }

  function get(req, rep) {
    const Model = req.models.get(modelName)

    const query = getQuery(req.query)

    return Model
      .find(query.filter)
      .select(query.select)
      .populate(query.populate)
      .skip(query.skip)
      .limit(query.limit)
      .lean({ virtuals: true })
  }

  function count(req, rep) {
    const Model = req.models.get(modelName)

    const query = getQuery()

    return Model.count(query.filter)
  }

  function create() {

  }

  function updateMany() {

  }

  function deleteMany() {

  }

}
