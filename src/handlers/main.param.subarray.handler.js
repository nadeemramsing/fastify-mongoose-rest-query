const fp = {
  drop: require('lodash/fp/drop'),
  filter: require('lodash/fp/filter'),
  map: require('lodash/fp/map'),
  pick: require('lodash/fp/pick'),
  pipe: require('lodash/fp/pipe'),
  pluck: require('lodash/fp/pluck'),
  take: require('lodash/fp/take'),
  uniq: require('lodash/fp/uniq'),
}

const { getSubArray } = require('../utils/model.util')
const { getQueryForSubArray, toJSONOptions } = require("../utils/mongoose.util")

module.exports = (modelName, path) => {
  return {
    get,
    create,
    updateMany,
    distinct
  }

  async function get(req, rep) {
    const subarray = await getSubArray(req, modelName, path)

    const query = getQueryForSubArray(req.query)

    return fp.pipe(
      fp.filter(query.filter),
      fp.drop(query.drop),
      fp.take(query.take),
      fp.map(query.select ? fp.pick(query.select) : x => x)
    )(subarray)
  }

  async function create(req, rep) {
    const Model = req.models[modelName]

    const doc = await Model.findById(req.params.id)

    const subarray = doc[path]
    let body = req.body

    if (!Array.isArray(body))
      body = [body]

    subarray.push(...body)

    await doc.save({
      path,
      req,
      'isCreateSubItem': true
    })

    const res = subarray.slice(-body.length).map(subitem => subitem.toJSON(toJSONOptions))

    return body.length === 1 ? res[0] : res
  }

  async function updateMany(req, rep) {
    const Model = req.models[modelName]
    let body = req.body

    if (!Array.isArray(body))
      body = [body]

    const ids = body.map(doc => doc.id)

    const doc = await Model.findById(req.params.id)

    const subarray = doc[path]

    const saved = []

    for (const index in ids) {
      const id = ids[index]

      const subitem = subarray.find(subitem => subitem.id === id)

      if (!subitem)
        continue

      const payload = body[index]

      const _prev = subitem.toJSON()

      Object.assign(subitem, payload)

      Object.keys(payload).forEach(field => subitem.markModified(field))

      saved.push(subitem)

      await doc.save({
        req,
        _prev,
        'isUpdateManySubItem': true
      })
    }

    return saved.map(subitem => subitem.toJSON(toJSONOptions))
  }

  async function distinct(req, rep) {
    const subarray = await getSubArray(req, modelName, path)

    const query = getQueryForSubArray(req.query)

    return fp.pipe(
      fp.filter(query.filter),
      fp.pluck(req.params.path),
      fp.uniq,
    )(subarray)
  }
}