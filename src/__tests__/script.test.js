import { ScriptRunner } from "../main";
// todo test errors are handled
// todo test each case of the apis

export async function runScript(script, env, request=null, response=null) {
    const scriptRunner = new ScriptRunner();
    await scriptRunner.init(script, env);
    if(request) {
        await scriptRunner.handleRequest(request)
    }
    if(response) {
        await scriptRunner.handleResponse(response)
    }
    const out = await scriptRunner.getOutput();
    scriptRunner.dispose();
    return out;
}

const testRequest = {
    headers: {},
    params: { a: 123, b: "foo" }
  }

const testResponse = {
    headers: {},
    status: 200,
    body: "Some body"
  }  

describe("Script stuff", () => {
    test("updates the selected environment variable correctly", async () => {
        return expect(runScript(
            `env.set('foo', 'bar')`,
            {
                global: [],
                selected: [],
            }
        )).resolves.toMatchObject({
            console: [],
            env: {
                global: [],
                selected: [{
                    "key": "foo",
                    "value": "bar",
                }],
            },
            tests: []
        })
    })
    
    test("executes all the request handlers", async () => {
        return expect(runScript(
            `onRequest((request) => {
                console.log("request params", request.params)
            })
            onRequest((request) => {
                console.log("another request handler")
            })
            `,
            {
                global: [],
                selected: [],
            },
            testRequest
        )).resolves.toMatchObject({
            console: [{level: 'log', line: 2, args: ["request params", {a: 123, b: 'foo'}]},
            {level: 'log', line: 5, args: ["another request handler"]} ],
            env: {
                global: [],
                selected: [],
            },
            tests: []
        })
    })
    
    test("executes all the response handlers", async () => {
        return expect(runScript(
            `onResponse((response) => {
                console.log("response status", response.status)
            })
            onResponse((response) => {
                console.log("another response handler")
            })
            `,
            {
                global: [],
                selected: [],
            },
            testRequest,
            testResponse
        )).resolves.toMatchObject({
            console: [{level: 'log', line: 2, args: ["response status", 200]},
            {level: 'log', line: 5, args: ["another response handler"]} ],
            env: {
                global: [],
                selected: [],
            },
            tests: []
        })
    })
})
