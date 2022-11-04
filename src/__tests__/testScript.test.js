import { execTestScript } from '../main'

const fakeRequest = {
    headers: {},
    status: 200,
    body: "Some body"
  }

describe("execTextScript", () => {
    test("updates the selected environment variable correctly", () => {
        return expect(execTestScript(
            `pw.env.set('foo', 'bar')`,
            {
                global: [],
                selected: [],
            },
            fakeRequest
        )).resolves.toMatchObject({result:
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
})

test('Something', () => {
    expect(1 + 1).toBe(2);
});