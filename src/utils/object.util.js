module.exports = {
  isEmpty
}

function isEmpty(o) {
  for (const i in o) return false
  return true
}