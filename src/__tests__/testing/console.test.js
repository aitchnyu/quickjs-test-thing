import { runScript } from '../utils'

describe("Console stuff", () => {
    test("prints to console", async () => {
        return expect(runScript(
            `const x = 123
            console.log('foo', 1, {a:1}, [1,2,3], x)`,
            {
                global: [],
                selected: [],
            }
        )).resolves.toMatchObject({
            console: [{level: 'log', line: 2, args: [ 'foo', 1, {a:1}, [1,2,3], 123 ]}],
            env: {
                global: [],
                selected: [],
            },
            tests: []
        })
    })
})
