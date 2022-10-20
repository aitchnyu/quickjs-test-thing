pw.console.log()
pw.console.log(1, {}, "Foo")

pw.expect(2).toBe(2)

pw.expect(2).toBe(2)

pw.test("Response code stuff", () => {
    pw.console.log('resp', pw.response)
    pw.expect(pw.response.status).toBeLevel2xx()
})

pw.expect(2).toBe(2)