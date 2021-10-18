const { getQuery } = require('../utils/mongoose.util')

module.exports = modelName => {
  return {
    list,
    count,
    create,
    updateMany,
    deleteMany
  }

  async function list(req, rep) {
    const Model = req.models.get(modelName)

    // const query = getQuery()

    const docs = await Model
      .find()
    // .find(query.filter)
    // .select(query.select)
    // .populate(query.populate)
    // .skip(query.skip)
    // .limit(query.limit)
    // .lean()

    rep.send(docs)
  }

  async function count(req, rep) {
    const Model = req.models.get(modelName)

    // const query = getQuery()

    const count = await Model.count()
    // .count(query.filter)

    rep.send(count)
  }

  function create() {

  }

  function updateMany() {

  }

  function deleteMany() {

  }

}
