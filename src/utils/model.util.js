const { leanOptions, transformLean } = require("./mongoose.util")

module.exports = {
  getSubArray
}

async function getSubArray(req, modelName, path) {
  const Model = req.models[modelName]

  const doc = await Model
    .findById(req.params.id)
    .select(path)
    .lean(leanOptions)

  return transformLean(doc[path])
}