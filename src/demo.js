console.log()
console.log(1, {}, "Foo")

console.debug(1, "Foo")

console.error(2,2, "Foo")

expect(2).toBe(2)

test("Math stuff", () => {
    console.log('math stuff')
    expect(2).toBe(2)
    expect(2).toBe(1)
    expect(3).not.toBe(2)
    expect(3).not.toBe(3)
})

expect(2).toBe(2)

test("Response code stuff", () => {
    console.log('resp')
    expect(200).toBeLevel2xx()
    expect(299).toBeLevel2xx()
    expect(300).toBeLevel3xx()
    expect(404).toBeLevel4xx()
    if(true) {
        expect(500).toBeLevel2xx()
        expect(500).not.toBeLevel2xx()
    }
    expect('').toBeLevel2xx()
    expect('').not.toBeLevel2xx()
})

expect(2).toBe(2)