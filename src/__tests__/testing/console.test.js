import { execTestScript } from '../../main'

const fakeResponse = {
    headers: {},
    status: 200,
    body: "Some body"
}

const fakeEnv = {
    global: [],
    selected: [],
}

const fakeShared = {}

describe("Console stuff", () => {
    test("String, number, object, arrays are correctly tracked", async () => {
        return expect(execTestScript(
            `const x = {a:1, b:2}
            console.log('foo', 1, x, [1,2,3])`,
            fakeEnv,
            fakeShared,
            fakeResponse
        )).resolves.toMatchObject({
            result: {
                console: [{ level: 'log', line: 2, args: ['foo', 1, { a: 1, b: 2 }, [1, 2, 3]] }],
            }
        })
    })

    test("Functions and class logs as null", async () => {
        return expect(execTestScript(
            `class A {

            }
            console.log('logs:',A, () => {1}, function(){})`,
            fakeEnv,
            fakeShared,
            fakeResponse
        )).resolves.toMatchObject({
            result: {
                console: [{ level: 'log', line: 4, args: ['logs:', null, null, null] },
                ],
            }
        })
    })

    // todo put this somewhere else
    // todo do that x = too
    test("cyclic object causes poof", async () => {
        return expect(execTestScript(
            `
            const a = {}
            a.b = a`,
            fakeEnv,
            fakeShared,
            fakeResponse
        )).rejects.toThrow('Assertion failed: list_empty(&rt->gc_obj_list)')
    })

    test("Correct line number is tracked", async () => {
        return expect(execTestScript(
            `console.log(1)
            if(true){
                console.log(2)
            }

            console.log(3)
            `,
            fakeEnv,
            fakeShared,
            fakeResponse
        )).resolves.toMatchObject({
            result: {
                console: [{ level: 'log', line: 1, args: [1] },
                { level: 'log', line: 3, args: [2] },
                { level: 'log', line: 6, args: [3] }],
            }
        })
    })

    test("log, debug, warn and error levels work", async () => {
        return expect(execTestScript(
            `console.log(1)
            console.debug(2)
            console.warn(3)
            console.error(4)`,
            fakeEnv,
            fakeShared,
            fakeResponse
        )).resolves.toMatchObject({
            result: {
                console: [{ level: 'log', line: 1, args: [1] },
                { level: 'debug', line: 2, args: [2] },
                { level: 'warn', line: 3, args: [3] },
                { level: 'error', line: 4, args: [4] }],
            }
        })
    })
})
