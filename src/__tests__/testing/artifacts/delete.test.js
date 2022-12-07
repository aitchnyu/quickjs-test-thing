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

describe("artifact.delete", () => {
  test("deletes from artifact for given key", () => {
    return expect(
      func(
        `
          hopp.artifact.delete("a")
        `,
        {},
        { a: "c", b: "d" }
      )
    ).resolves.toMatchObject({
      result:
      {
        artifact: {
          b: "d"
        }
      }
    })
  })

  test("error if artifact key is not string", () => {
    return expect(
      func(
        `
          hopp.artifact.delete(5)
        `,
        {},
        {}
      )
    ).resolves.toMatchObject({
      error: { message: "Key is not string" }
    })
  })

  test("error if artifact key doesn't exists", () => {
    return expect(
      func(
        `
          hopp.artifact.delete("a")
        `,
        {},
        {}
      )
    ).resolves.toMatchObject({
      error: { message: "Key does not exist" }
    })
  })
})
