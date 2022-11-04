# Quickjs Sandbox 

## How to 

$ npm install
$ npm run main demo # runs main/demo on demo.js
$ npm run main demopostrequest # runs main/demopostrequest on demopostrequest.js

## Benefits
- Can run with pw.pre/post or unified
- Easier to maintain
- Show line nos
- Show output even after execution is interrupted by error
- Hopefully no subtle memory errors

### New sandbox
Console - done
test and expect - done
response - done
env
onrequest
onresponse

## Todo stuff

Integrate into existing codebase
Complete test suites

Enable del for env. Handle invalid inputs for get, set and other methods. Type checking
Does it meet the needs of the cli?

pw.console and `x = ` gave a memory error. Global scripts may be a pain.




