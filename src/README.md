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

## Todo stuff

Switch contexts. Have pre context with request. Extract request after running. Have response and allow those apis. Have the pw. api for both.

Env thing. 

Do the test thing. Push to default or named tests.

Does it meet the needs of the cli?

Show diff context based on unified/pre/post
runPre(req, env)
runResponse(resp, env)
unified()
unified.before(req)
unified.after(resp)
unified.kill()


### New sandbox
Console - done
test and expect - done
response
env
onrequest
onresponse


Execution failed: {
  name: 'ReferenceError',
  message: "'x' is not defined",
  stack: '    at <eval> (ours.js:8)\n'
}

Include this as test case for finding line no 35
    at lineNumber (lib.js:32)
    at toBeLevelxxx (lib.js:111)
    at toBeLevel2xx (lib.js:116)
    at <anonymous> (ours.js:35)
    at test (lib.js:15)
    at <eval> (ours.js:37)

