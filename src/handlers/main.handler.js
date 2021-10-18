const { getQuery } = require('../utils/mongoose.util')

const list = modelName => async (req, rep) => {
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

module.exports = {
  list
}
