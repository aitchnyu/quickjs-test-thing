import { execTestScript } from '../main'

const fakeResponse = {
    headers: {},
    status: 200,
    body: "Some body"
}

describe("pw.* apis", () => {
    test("pw.console is available", () => {
        return expect(execTestScript(
            `pw.console.log(1)`,
            {
                global: [],
                selected: [],
            },
            {},
            {},
            fakeResponse
        )).resolves.toMatchObject({
            result:
            {
                console: [{ level: 'log', line: 1, args: [1] }],
            }
        })
    })

    test("pw.response is available", () => {
        return expect(execTestScript(
            `pw.console.log(pw.response)`,
            {
                global: [],
                selected: [],
            },
            {},
            {},
            fakeResponse
        )).resolves.toMatchObject({
            result:
            {
                console: [{ level: 'log', line: 1, args: [fakeResponse] }],
            }
        })
    })

    test("pw.env is available", () => {
        return expect(execTestScript(
            `pw.env.set('foo', 'bar')`,
            {
                global: [],
                selected: [],
            },
            {},
            {},
            fakeResponse
        )).resolves.toMatchObject({
            result:
            {
                env: {
                    global: [],
                    selected: [{
                        "key": "foo",
                        "value": "bar",
                    }],
                }
            }
        })
    })

    test("pw.expect and pw.test is available", () => {
        return expect(execTestScript(
            `pw.test("testname", () => {
                pw.expect(2).toBe(2)
            })`,
            {
                global: [],
                selected: [],
            },
            {},
            {},
            fakeResponse
        )).resolves.toMatchObject({
            result:
            {
                tests: [
                    {
                        name: "testname",
                        expectations: [
                            {
                                failure: null,
                                lhs: 2,
                                line: 2,
                                negation: false,
                                rhs: 2,
                                testType: 'toBe'

                            }
                        ]

                    }
                ]
            }
        })
    })
})

describe("hopp.* apis", () => {
    test("hopp.console is available", () => {
        return expect(execTestScript(
            `console.log(1)`,
            {
                global: [],
                selected: [],
            },
            {},
            {},
            fakeResponse
        )).resolves.toMatchObject({
            result:
            {
                console: [{ level: 'log', line: 1, args: [1] }],
            }
        })
    })

    test("hopp.response is available", () => {
        return expect(execTestScript(
            `console.log(hopp.response)`,
            {
                global: [],
                selected: [],
            },
            {},
            {},
            fakeResponse
        )).resolves.toMatchObject({
            result:
            {
                console: [{ level: 'log', line: 1, args: [fakeResponse] }],
            }
        })
    })

    test("hopp.env is available", () => {
        return expect(execTestScript(
            `hopp.env.set('foo', 'bar')`,
            {
                global: [],
                selected: [],
            },
            {},
            {},
            fakeResponse
        )).resolves.toMatchObject({
            result:
            {
                env: {
                    global: [],
                    selected: [{
                        "key": "foo",
                        "value": "bar",
                    }],
                }
            }
        })
    })

    test("hopp.expect and hopp.test is available", () => {
        return expect(execTestScript(
            `hopp.test("testname", () => {
                hopp.expect(2).toBe(2)
            })`,
            {
                global: [],
                selected: [],
            },
            {},
            {},
            fakeResponse
        )).resolves.toMatchObject({
            result:
            {
                tests: [
                    {
                        name: "testname",
                        expectations: [
                            {
                                failure: null,
                                lhs: 2,
                                line: 2,
                                negation: false,
                                rhs: 2,
                                testType: 'toBe'

                            }
                        ]

                    }
                ]
            }
        })
    })

    test("hopp.artifact and hopp.shared is available", () => {
        return expect(execTestScript(
            `hopp.artifact.create('aKey', "a value")
            hopp.shared.create('foo', {someKey: [1,2,3]})`,
            {
                global: [],
                selected: [],
            },
            {},
            {},
            fakeResponse
        )).resolves.toMatchObject({
            result:
            {
                artifact: { aKey: "a value" },
                shared: { foo: { someKey: [1, 2, 3] } }
            }
        })
    })
})
