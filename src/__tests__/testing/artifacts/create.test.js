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

describe("artifact.create", () => {
  test("creates new artifact key correctly", () => {
    return expect(
      func(
        `
          hopp.artifact.create("a", "c")
        `,
        {},
        {}
      )
    ).resolves.toMatchObject({
      result:
      {
        artifact: {
          a: "c"
        }
      }
    })
  })

  test("doesn't override existing artifact key", () => {
    return expect(
      func(
        `
          hopp.artifact.create("a", "b")
        `,
        {},
        { a: "c" }
      )
    ).resolves.toMatchObject({
      result:
      {
        artifact: {
          a: "c"
        }
      }
    })
  })

  test("error if key is not string", () => {
    return expect(
      func(
        `
          hopp.artifact.create(5, "c")
        `,
        {},
        {}
      )
    ).resolves.toMatchObject({
      error: { message: "Key is not string" }
    })
  })

  // test("error if value is not string", () => {
  //   return expect(
  //     func(
  //       `
  //         artifact.create("a", 5)
  //       `,
  //       DEFAULT_ENV,
  //       {}
  //     )()
  //   ).resolves.toBeLeft()
  // })

  // test("error if both keys and values are not string", () => {
  //   return expect(
  //     func(
  //       `
  //         artifact.create(5, 5)
  //       `,
  //       DEFAULT_ENV,
  //       {}
  //     )()
  //   ).resolves.toBeLeft()
  // })
})
