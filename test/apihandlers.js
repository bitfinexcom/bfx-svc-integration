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

  it('callback called twice, just first value returned, no crash', (done) => {
    const query = {
      action: 'twoCallbacks',
      args: []
    }

    client.request(query, (err, data) => {
      if (err) throw err

      assert.strictEqual(data, 'a')
      done()
    })
  })

  it('callback called twice, async function', (done) => {
    const query = {
      action: 'asyncTwoCallbacks',
      args: []
    }

    client.request(query, (err, data) => {
      if (err) throw err

      assert.strictEqual(data, 'a')
      done()
    })
  })

  it('callback called', (done) => {
    const query = {
      action: 'asyncCb',
      args: ['a']
    }

    client.request(query, (err, data) => {
      if (err) throw err

      assert.strictEqual(data, 'a')
      done()
    })
  })

  it('async/await functions mixed with callbacks, async cb returns', (done) => {
    const query = {
      action: 'asyncWithCb',
      args: ['a']
    }

    client.request(query, (err, data) => {
      if (err) throw err

      assert.strictEqual(data, 'a')
      done()
    })
  })

  it('async/await functions using cb throws', (done) => {
    const query = {
      action: 'asyncWithCbThrows',
      args: ['a']
    }

    client.request(query, (err, data) => {
      assert.strictEqual(err.message, 'ERR_API_BASE: boom')
      done()
    })
  })

  it('async functions without prefix are not resolved', (done) => {
    const query = {
      action: 'asyncWithoutCbNoPrefix',
      args: ['a']
    }

    client.request(query, { timeout: 1500 }, (err, data) => {
      assert.strictEqual(err.message, 'ERR_REQUEST_GENERIC: ESOCKETTIMEDOUT')
      done()
    })
  })

  it('async functions with prefix are resolved', (done) => {
    const query = {
      action: 'aPrmAsyncWithoutCb',
      args: ['a']
    }

    client.request(query, { timeout: 1500 }, (err, data) => {
      if (err) throw err

      assert.strictEqual(data, 'prm_a')
      done()
    })
  })

  it('no callback available in async aPrm prefixed handler', (done) => {
    const query = {
      action: 'aPrmAsyncWithCbAsserts',
      args: ['apple']
    }

    client.request(query, { timeout: 1500 }, (_err, data) => {
      assert.strictEqual(data[0], 'apple')
      assert.strictEqual(data[1], 'cb is not a function')
      done()
    })
  })

  it('pure async/await functions prefixed by aPrm throws', (done) => {
    const query = {
      action: 'aPrmAsyncWithCbThrows',
      args: [ 'pineapple' ]
    }

    client.request(query, { timeout: 1500 }, (err, data) => {
      assert.ok(err)
      assert.strictEqual(err.message, 'ERR_API_BASE: tricky')

      done()
    })
  })
})
