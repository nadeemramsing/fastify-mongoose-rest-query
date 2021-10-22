module.exports = {
  printResult
}

function printResult(resultFastify, resultExpress) {
  const table = {
    'Requests per second (avg)': { 'fastify': resultFastify.requests.average, 'express': resultExpress.requests.average },
    'Requests per second (max)': { 'fastify': resultFastify.requests.max, 'express': resultExpress.requests.max },

    'Response data throughput per second (avg)': {
      'fastify': resultFastify.throughput.average,
      'express': resultExpress.throughput.average
    },

    'Response data throughput per second (max)': {
      'fastify': resultFastify.throughput.max,
      'express': resultExpress.throughput.max
    },

    'Latency (avg)': { 'fastify': resultFastify.latency.average, 'express': resultExpress.latency.average },
    'Latency (max)': { 'fastify': resultFastify.latency.max, 'express': resultExpress.latency.max },

    'Number of errors': { 'fastify': resultFastify.errors, 'express': resultExpress.errors },
    'Number of timeouts': { 'fastify': resultFastify.timeouts, 'express': resultExpress.timeouts }
  }

  console.table(table)
}