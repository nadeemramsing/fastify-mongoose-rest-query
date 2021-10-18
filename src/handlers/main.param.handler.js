module.exports = modelName => {
  return {
    list
  }

  function list(req, rep) {
    const Model = req.models.get(modelName)

    // const query = getQuery(req.query)

    return Model
      .findById(req.params.id)
      // .select(query.select)
      // .populate(query.populate)
      .lean()
  }
}