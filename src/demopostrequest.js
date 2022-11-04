pw.console.log()
pw.console.log(1, {}, "Foo")

pw.expect(2).toBe(2)

pw.expect(2).not.toBe(3)

pw.test("Response code stuff", () => {
    pw.console.log('resp', pw.response)
    pw.expect(pw.response.status).toBeLevel2xx()
    pw.expect(pw.response.status).not.toBeLevel4xx()
})

pw.expect(2).toBe(2)

pw.env.set('foo', '<<bar>>')
pw.env.set('bar', 'baz')
pw.console.log('foo is', pw.env.get('foo'))

pw.console.log('foo', pw.env.resolve('foo <<foo>> foo'))
pw.console.log('foo getResolve', pw.env.getResolve('foo'))