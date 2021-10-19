const { getQuery, transformLean } = require('../utils/mongoose.util')

module.exports = modelName => {
  return {
    get,
    count,
    create,
    updateMany,
    deleteMany,
    distinct
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
      .lean({ virtuals: true, versionKey: false })
      .then(transformLean)
  }

  function count(req, rep) {
    const Model = req.models.get(modelName)

    const query = getQuery(req.query)

    return Model.count(query.filter)
  }

  function distinct(req, rep) {
    const Model = req.models.get(modelName)

    const query = getQuery(req.query)

    return Model.distinct(req.params.path, query.filter)
  }

  function create(req, rep) {
    const Model = req.models.get(modelName)

    return Model.create(req.body)
  }

  function updateMany() {

  }

  function deleteMany() {

  }

}
