import { execPreRequestScript } from '../main'

describe("execPreRequestScript", () => {
    test("updates the selected environment variable correctly", () => {
        return expect(execPreRequestScript(
            `pw.env.set('foo', 'bar')`,
            {
                global: [],
                selected: [],
            }
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
