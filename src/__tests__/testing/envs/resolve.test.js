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

describe("env.resolve", () => {
  test("value should be a string", () => {
    return expect(
      func(
        `
          hopp.env.resolve(5)
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

  test("resolves global variables correctly", () => {
    return expect(
      func(
        `
          const data = hopp.env.resolve("<<hello>>")
          hopp.expect(data).toBe("there")
        `,
        {
          global: [
            {
              key: "hello",
              value: "there",
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

  test("resolves selected env variables correctly", () => {
    return expect(
      func(
        `
          const data = hopp.env.resolve("<<hello>>")
          hopp.expect(data).toBe("there")
        `,
        {
          global: [],
          selected: [
            {
              key: "hello",
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

  test("chooses selected env variable over global variables when both have same variable", () => {
    return expect(
      func(
        `
          const data = hopp.env.resolve("<<hello>>")
          hopp.expect(data).toBe("there")
        `,
        {
          global: [
            {
              key: "hello",
              value: "yo",
            },
          ],
          selected: [
            {
              key: "hello",
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

  test("if infinite loop in resolution, abandons resolutions altogether", () => {
    return expect(
      func(
        `
          const data = hopp.env.resolve("<<hello>>")
          hopp.expect(data).toBe("<<hello>>")
        `,
        {
          global: [],
          selected: [
            {
              key: "hello",
              value: "<<there>>",
            },
            {
              key: "there",
              value: "<<hello>>",
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
})
