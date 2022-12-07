import { execTestScript } from '../../../main'

function func(script, env) {
  const fakeResponse = {
    headers: {},
    status: 200,
    body: "Some body"
  }
  const fakeShared = {}
  return execTestScript(script, env, fakeShared, fakeResponse)
}

describe("env.set", () => {
  test("updates the selected environment variable correctly", () => {
    return expect(
      func(
        `
          hopp.env.set("a", "c")
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
        env: {
          global: [],
          selected: [{
            "key": "a",
            "value": "c",
          }],
        }
      }
    })
  })

  test("updates the global environment variable correctly", () => {
    return expect(
      func(
        `
          hopp.env.set("a", "c")
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
        env: {
          global: [{
            "key": "a",
            "value": "c",
          }],
          selected: [],
        }
      }
    })
  })

  test("updates the selected environment if env present in both", () => {
    return expect(
      func(
        `
          hopp.env.set("a", "c")
        `,
        {
          global: [
            {
              key: "a",
              value: "b",
            },
          ],
          selected: [
            {
              key: "a",
              value: "d",
            },
          ],
        }
      )
    ).resolves.toMatchObject({
      result:
      {
        env: {
          global: [{
            "key": "a",
            "value": "b",
          }],
          selected: [{
            "key": "a",
            "value": "c",
          }],
        }
      }
    })
  })

  test("non existent keys are created in the selected environment", () => {
    return expect(
      func(
        `
          hopp.env.set("a", "c")
        `,
        {
          global: [],
          selected: [],
        }
      )
    ).resolves.toMatchObject({
      result:
      {
        env: {
          global: [],
          selected: [{
            "key": "a",
            "value": "c",
          }],
        }
      }
    })
  })

  test("keys should be a string", () => {
    return expect(
      func(
        `
          hopp.env.set(5, "c")
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

  test("values should be a string", () => {
    return expect(
      func(
        `
          hopp.env.set("a", 5)
        `,
        {
          global: [],
          selected: [],
        }
      )
    ).resolves.toMatchObject({
      error: { message: "value is not string" }
    })
  })

  test("set environment values are reflected in the script execution", () => {
    return expect(
      func(
        `
          hopp.env.set("a", "b")
          hopp.expect(hopp.env.get("a")).toBe("b")
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
})
