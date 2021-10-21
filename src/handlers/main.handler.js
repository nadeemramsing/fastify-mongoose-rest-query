const bs = require('binary-search')

const fp = {
  omit: require('lodash/fp/omit'),
}

const { getQuery, transformLean, leanOptions, toJSONOptions } = require('../utils/mongoose.util')

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
      .lean(leanOptions)
      .then(transformLean)
  }

  function count(req, rep) {
    const Model = req.models.get(modelName)

    const query = getQuery(req.query)

    return Model.estimatedDocumentCount(query.filter)
  }

  function distinct(req, rep) {
    const Model = req.models.get(modelName)

    const query = getQuery(req.query)

    return Model.distinct(req.params.path, query.filter)
  }

  async function create(req, rep) {
    const Model = req.models.get(modelName)
    const body = req.body

    if (!Array.isArray(body))
      body = [body]

    const docs = await Model.create(body, { req })

    return docs.map(doc => doc.toJSON(toJSONOptions))
  }

  async function updateMany(req, rep) {
    const Model = req.models.get(modelName)

    const ids = req.body.map(doc => doc.id)

    const docs = await Model
      .find({ '_id': { $in: ids } })
      .sort('_id')

    const docsId = docs.map(doc => doc.id)

    for (let body of req.body) {
      const i = bs(docsId, body.id, (needle, id) => needle.localeCompare(id))
      const doc = docs[i]

      if (!doc)
        continue

      body = fp.omit('id', body)

      Object.assign(doc, body)

      Object.keys(body).forEach(field => doc.markModified(field))

      await doc.save({ req, 'isUpdateMany': true })
    }

    return docs.map(doc => doc.toJSON(toJSONOptions))
  }

  async function deleteMany(req, rep) {
    const Model = req.models.get(modelName)

    const query = getQuery(req.query)

    const docs = await Model.find(query.filter)

    if (!docs.length)
      throw 'Document(s)NotFound'

    await Promise.all(docs.map(doc => doc.remove({ req, 'isDeleteByQuery': true })))

    return 'OK'
  }

}
