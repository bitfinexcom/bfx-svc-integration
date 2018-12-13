'use strict'

const { WrkApi } = require('bfx-wrk-api')

class WrkSvcIntegrationApi extends WrkApi {
  constructor (conf, ctx) {
    super(conf, ctx)

    this.loadConf('apihandlers.svc', 'svc')

    this.init()
    this.start()
  }

  getPluginCtx (type) {
    const ctx = super.getPluginCtx(type)

    switch (type) {
      case 'api_bfx':
        break
    }

    return ctx
  }

  init () {
    super.init()
  }
}

module.exports = WrkSvcIntegrationApi
