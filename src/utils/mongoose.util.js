const memo = require('nano-memoize')

module.exports = {
  getQuery: memo(getQuery)
}

function getQuery() {

}