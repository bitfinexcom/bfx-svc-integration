/* eslint-env mocha */

'use strict'

const assert = require('assert')
const path = require('path')

const createGrapes = require('bfx-svc-test-helper/grapes')
const createWorker = require('bfx-svc-test-helper/worker')
const createClient = require('bfx-svc-test-helper/client')

let grapes, worker, client
describe('promise and callback support', () => {
  before(async function () {
    this.timeout(20000)

    grapes = createGrapes()
    await grapes.start()

    worker = createWorker({
      env: 'development',
      wtype: 'wrk-svc-apihandlers-api',
      apiPort: 8721,
      serviceRoot: path.join(__dirname, '..')
    }, grapes)

    await worker.start()

    client = createClient(worker)
  })

  after(async function () {
    this.timeout(5000)

    await client.stop()
    await worker.stop()
    await grapes.stop()
  })

  it('public functions can be called', (done) => {
    const query = {
      action: 'public',
      args: []
    }

    client.request(query, (err, data) => {
      if (err) throw err

      assert.strictEqual(data, 'orange')
      done()
    })
  })

  it('private functions prefixed by underscore are not allowed', (done) => {
    const query = {
      action: '_private',
      args: []
    }

    client.request(query, (err) => {
      assert.strictEqual(err.message, 'ERR_API_ACTION_NOTFOUND')
      done()
    })
  })
})
