module.exports = {
  printResult
}

function printResult(resultFastify, resultExpress) {
  const table = {
    'Response time per request in ms (avg)': {
      'fastify': calcResponseTime(resultFastify),
      'express': calcResponseTime(resultExpress)
    },

    'Requests per second (avg)': {
      'fastify': resultFastify.requests.average,
      'express': resultExpress.requests.average
    },

    'Requests per second (max)': {
      'fastify': resultFastify.requests.max,
      'express': resultExpress.requests.max
    },

    'Number of errors': {
      'fastify': resultFastify.errors,
      'express': resultExpress.errors
    },

    'Number of timeouts': {
      'fastify': resultFastify.timeouts,
      'express': resultExpress.timeouts
    }
  }

  console.table(table)
}

function calcResponseTime({ requests, duration }) {
  return +((duration * 1000) / requests.average).toFixed(2)
}

function convertByteToKB(n) {
  return +(n / 1024).toFixed(2)
}