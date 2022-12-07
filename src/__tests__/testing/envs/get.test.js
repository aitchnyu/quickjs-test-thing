import { execTestScript } from '../../../main'

function func(script, env) {
  const fakeResponse = {
    headers: {},
    status: 200,
    body: "Some body"
  }
  const fakeShared = {}
  return execTestScript(script, env, {}, fakeShared, fakeResponse)
}

describe("env.get", () => {
  test("returns the correct value for an existing selected environment value", () => {
    return expect(
      func(
        `
          const data = hopp.env.get("a")
          hopp.expect(data).toBe("b")
      `,
        {
          global: [],
          selected: [
            {
              key: "a",
              value: "b",
            },
          ],
        }
      )
    ).resolves.toMatchObject({
      result:
      {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: null,
                lhs: 'b',
                line: 3,
                negation: false,
                rhs: 'b',
                testType: 'toBe'
              }
            ]
          }
        ]
      }
    })
  })

  test("returns the correct value for an existing global environment value", () => {
    return expect(
      func(
        `
          const data = hopp.env.get("a")
          hopp.expect(data).toBe("b")
      `,
        {
          global: [
            {
              key: "a",
              value: "b",
            },
          ],
          selected: [],
        }
      )
    ).resolves.toMatchObject({
      result:
      {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: null,
                lhs: 'b',
                line: 3,
                negation: false,
                rhs: 'b',
                testType: 'toBe'
              }
            ]
          }
        ]
      }
    })
  })

  test("returns undefined for a key that is not present in both selected or environment", () => {
    return expect(
      func(
        `
          const data = hopp.env.get("a")
          hopp.expect(data).toBe(undefined)
      `,
        {
          global: [],
          selected: [],
        }
      )
    ).resolves.toMatchObject({
      result:
      {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: null,
                // lhs: undefined,
                line: 3,
                negation: false,
                // rhs: undefined,
                testType: 'toBe'
              }
            ]
          }
        ]
      }
    })
  })

  test("returns the value defined in selected environment if it is also present in global", () => {
    return expect(
      func(
        `
          const data = hopp.env.get("a")
          hopp.expect(data).toBe("selected val")
      `,
        {
          global: [
            {
              key: "a",
              value: "global val",
            },
          ],
          selected: [
            {
              key: "a",
              value: "selected val",
            },
          ],
        }
      )
    ).resolves.toMatchObject({
      result:
      {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: null,
                lhs: 'selected val',
                line: 3,
                negation: false,
                rhs: 'selected val',
                testType: 'toBe'
              }
            ]
          }
        ]
      }
    })
  })

  test("resolve environment values", () => {
    return expect(
      func(
        `
          const data = hopp.env.get("a")
          hopp.expect(data).toBe("there")
      `,
        {
          global: [
            {
              key: "hello",
              value: "<<there>>",
            },
          ],
          selected: [
            {
              key: "a",
              value: "<<hello>>",
            },
            {
              key: "there",
              value: "there",
            },
          ],
        }
      )
    ).resolves.toMatchObject({
      result:
      {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: null,
                lhs: 'there',
                line: 3,
                negation: false,
                rhs: 'there',
                testType: 'toBe'
              }
            ]
          }
        ]
      }
    })
  })

  test("returns unresolved value on infinite loop in resolution", () => {
    return expect(
      func(
        `
          const data = hopp.env.get("a")
          hopp.expect(data).toBe("<<hello>>")
      `,
        {
          global: [],
          selected: [
            {
              key: "a",
              value: "<<hello>>",
            },
            {
              key: "hello",
              value: "<<a>>",
            },
          ],
        }
      )
    ).resolves.toMatchObject({
      result:
      {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: null,
                lhs: '<<hello>>',
                line: 3,
                negation: false,
                rhs: '<<hello>>',
                testType: 'toBe'
              }
            ]
          }
        ]
      }
    })
  })

  test("errors if the key is not a string", () => {
    return expect(
      func(
        `
          const data = hopp.env.get(5)
      `,
        {
          global: [],
          selected: [],
        }
      )
    ).resolves.toMatchObject({
      error: { message: "key is not string" }
    })
  })
})
