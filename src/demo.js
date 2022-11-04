test("Math stuff", () => {
    console.log('math stuff')
    expect(2).toBe(2)
    expect(2).toBe(1)
    expect(3).not.toBe(2)
    expect(3).not.toBe(3)
})

expect(2).toBe(2)

test("Response code stuff", () => {
    // console.log('resp')
    expect(200).toBeLevel2xx()
    expect('').toBeLevel2xx()
    expect('').not.toBeLevel2xx()
})

let foo

onRequest((request) => {
    console.log("request params", request.params)
    env.set('dance', 'fandango')
    foo = 123
})

onResponse((response) => {
    test("response stuff", () => {
        expect(response.status).toBeLevel2xx()
    })
    console.log('foo is', foo, 'dance', env.get('dance'))
})

console.log({}, [], 123)
console.log("hello")
env.set('foo', 'bar')