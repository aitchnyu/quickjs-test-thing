# Quickjs Sandbox 

## How to 

$ npm install
$ npm run main demoprerequest # runs main/demoprerequest on demoprerequest.js
$ npm run main demopostrequest # runs main/demopostrequest on demopostrequest.js
$ NODE_OPTIONS=--experimental-vm-modules npm run test
## Benefits
- Can run with pw.pre/post
- Easier to maintain
- Show line nos
- Show output even after execution is interrupted by error
- Hopefully no subtle memory errors
- can i8n the failure messages

### New sandbox
Console - done
test and expect - done
response - done
env
shared/artifact

## Todo stuff
Integrate? Try
Implementation notes
-pw.
-each part

Artifact and shared in prerequest and post

move the pre and post script runner params into context. Annotate with TS later.
Shared and artifact docs

shared? Shared - get, set, update, delete (rfc)
Artifact? Persistent 

Crypto? MDN Just a few fns
Does it meet the needs of the cli?
https://about.sourcegraph.com/blog/migrating-monaco-codemirror

Test cases for legacy env

pw.console and `x = ` gave a memory error. Global scripts may be a pain.

Any js object - recursive check

Req
console (es standard)
hopp.request
hopp.env
hopp.shared (avoid bombs)

Res
console
hopp.test hopp.expect
hopp.request hopp.resp (test too)
hopp.env
hopp.shared (same)

Rebase sandbox branch to new stuff
Then try to reimplement

