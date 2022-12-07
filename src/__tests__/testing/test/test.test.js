import { execTestScript } from '../../../main'

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

describe("Test", () => {
    test("Reports a test case with name, and expect statements with results and line numbers", () => {
        return expect(execTestScript(
            `hopp.test("testname", () => {
                hopp.expect(2).toBe(2)
            })`,
            fakeEnv,
            fakeShared,
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

    test("Collects expects outside of a test case into anonymous test cases", () => {
        return expect(execTestScript(
            `hopp.expect("expect outside of a test 1").toBe("expect outside of a test 1")
            hopp.expect("expect outside of a test 2").toBe("expect outside of a test 2")

            hopp.test("test 1", () => {
                hopp.expect(2).toBe(2)
            })

            hopp.expect("expect outside of a test 3").toBe("expect outside of a test 3")
            hopp.expect("expect outside of a test 4").toBe("expect outside of a test 4")
            
            hopp.test("test 2", () => {
                hopp.expect(3).toBe(3)
            })

            hopp.expect("expect outside of a test 5").toBe("expect outside of a test 5")
            hopp.expect("expect outside of a test 6").toBe("expect outside of a test 6")`,
            fakeEnv,
            fakeShared,
            fakeResponse
        )).resolves.toMatchObject({
            result:
            {
                tests: [
                    {
                        name: null,
                        expectations: [
                            {
                                failure: null,
                                lhs: "expect outside of a test 1",
                                line: 1,
                                negation: false,
                                rhs: "expect outside of a test 1",
                                testType: 'toBe'
                            },
                            {
                                failure: null,
                                lhs: "expect outside of a test 2",
                                line: 2,
                                negation: false,
                                rhs: "expect outside of a test 2",
                                testType: 'toBe'
                            }
                        ]
                    },


                    {
                        name: "test 1",
                        expectations: [
                            {
                                failure: null,
                                lhs: 2,
                                line: 5,
                                negation: false,
                                rhs: 2,
                                testType: 'toBe'
                            }
                        ]
                    },

                    {
                        name: null,
                        expectations: [
                            {
                                failure: null,
                                lhs: "expect outside of a test 3",
                                line: 8,
                                negation: false,
                                rhs: "expect outside of a test 3",
                                testType: 'toBe'
                            },
                            {
                                failure: null,
                                lhs: "expect outside of a test 4",
                                line: 9,
                                negation: false,
                                rhs: "expect outside of a test 4",
                                testType: 'toBe'
                            }
                        ]
                    },

                    {
                        name: "test 2",
                        expectations: [
                            {
                                failure: null,
                                lhs: 3,
                                line: 12,
                                negation: false,
                                rhs: 3,
                                testType: 'toBe'
                            }
                        ]
                    },

                    {
                        name: null,
                        expectations: [
                            {
                                failure: null,
                                lhs: "expect outside of a test 5",
                                line: 15,
                                negation: false,
                                rhs: "expect outside of a test 5",
                                testType: 'toBe'
                            },
                            {
                                failure: null,
                                lhs: "expect outside of a test 6",
                                line: 16,
                                negation: false,
                                rhs: "expect outside of a test 6",
                                testType: 'toBe'
                            }
                        ]
                    }
                ]
            }
        })
    })
})
