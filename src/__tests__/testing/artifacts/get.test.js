import { execTestScript } from '../../../main'

function func(script, env, artifacts) {
  const fakeResponse = {
    headers: {},
    status: 200,
    body: "Some body"
  }
  const fakeShared = {}
  return execTestScript(script, env, artifacts, fakeShared, fakeResponse)
}

describe("artifact.get", () => {
  test("returns the correct value for an existing artifact", () => {
    return expect(
      func(
        `
          const data = hopp.artifact.get("a")
          hopp.expect(data).toBe("b")
      `,
        {},
        { a: "b" }
      )
    ).resolves.toMatchObject({
      result:
      {
        artifact: {
          a: "b"
        },
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

  test("returns undefined for an key that is not present in existing artifacts", () => {
    return expect(
      func(
        `
          const data = hopp.artifact.get("a")

          if(data === undefined) {
            hopp.artifact.create("a", "undefined")
          }
      `,
        {},
        {}
      )
    ).resolves.toMatchObject({
      result:
      {
        artifact: {
          a: "undefined"
        }
      }
    })
  })

  test("error if the key is not a string", () => {
    return expect(
      func(
        `
          const data = hopp.artifact.get(5)
      `,
        {},
        {}
      )
    ).resolves.toMatchObject({
      error: { message: "Key is not string" }
    })
  })
})
