# bfx-svc-integration

Integration testsuite for core bfx-svc modules.

Run with: `mocha`

## Setup

Run two Grapes:

```
grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```

```
# Add base as upstream:
git remote add upstream https://github.com/bitfinexcom/bfx-util-js

# Configure service:
cp config/common.json.example config/common.json
cp config/facs/grc.config.json.example config/facs/grc.config.json
cp config/apihandlers.svc.json.example config/apihandlers.svc.json
```


### Boot worker

```
node worker.js --env=development --wtype=wrk-svc-apihandlers-api --apiPort 1337
```
