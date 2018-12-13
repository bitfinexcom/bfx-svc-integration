'use strict'

const { Api } = require('bfx-wrk-api')

class SvcApihandlers extends Api {
  asyncCb (space, ip, cb) {
    setTimeout(() => {
      cb(null, ip)
    }, 200)
  }

  async asyncWithCb (space, ip, cb) {
    setTimeout(() => {
      cb(null, ip)
    }, 200)
  }

  async asyncWithCbThrows (space, ip, cb) {
    try {
      throw new Error('boom')
    } catch (e) {
      return cb(e)
    }
  }

  async asyncWithoutCbNoPrefix (space, ip) {
    function networkRequest () {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('a')
        }, 200)
      })
    }

    const res = await networkRequest()
    return res
  }

  async aPrmAsyncWithoutCb (space, ip) {
    function networkRequest () {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('prm_a')
        }, 200)
      })
    }

    const res = await networkRequest()
    return res
  }

  async aPrmAsyncWithCbAsserts (space, ip, cb) {
    try {
      cb()
    } catch (e) {
      return [ip, e.message]
    }
  }

  parseDocs (a) {
    throw new Error('tricky')
  }

  async aPrmAsyncWithCbThrows (space, ip) {
    const res = this.parseDocs()

    return res
  }

  twoCallbacks (space, cb) {
    cb(null, 'a')
    cb(null, 'b')
  }

  async asyncTwoCallbacks (space, cb) {
    cb(null, 'a')
    cb(null, 'b')
  }

  public (space, cb) {
    cb(null, 'orange')
  }

  _private (space, cb) {
    cb(null, 'pineapple')
  }
}

module.exports = SvcApihandlers
