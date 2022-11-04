/* 
todo Include this as test case for finding line no 35
    at lineNumber (lib.js:32)
    at toBeLevelxxx (lib.js:111)
    at toBeLevel2xx (lib.js:116)
    at <anonymous> (ours.js:35)
    at test (lib.js:15)
    at <eval> (ours.js:37)
*/

function lineNumber() {
    const stacktrace = new Error().stack
    return parseInt(stacktrace.match(/\(ours\.js:(\d+)\)/)[1])
}


class Console {
    consoleOutput

    constructor() {
        this.consoleOutput = []
    }

    log(...args) {
        this.consoleOutput.push({ level: 'log', args: args, line: lineNumber() })
    }

    info(...args) {
        this.consoleOutput.push({ level: 'info', args: args, line: lineNumber() })
    }

    debug(...args) {
        this.consoleOutput.push({ level: 'debug', args: args, line: lineNumber() })
    }

    error(...args) {
        this.consoleOutput.push({ level: 'error', args: args, line: lineNumber() })
    }
}

class TestSuite {
    tests
    activeTest

    constructor() {
        this.tests = []
        this.activeTest = null
    }

    executeTest(name, func) {
        this.activeTest = { name: name, expectations: [] }
        this.tests.push(this.activeTest)
        func()
        this.activeTest = null
    }

    createExpect(lhs) {
        return new Expect(this, lhs)
    }

    pushExpectResults(obj) {
        if (!this.activeTest) {
            this.activeTest = { name: null, expectations: [] }
            this.tests.push(this.activeTest)
        }
        this.activeTest.expectations.push(obj)
    }
}

class Expect {
    testSuite
    lhs
    not

    constructor(testSuite, lhs, generateNot = true) {
        this.testSuite = testSuite
        this.lhs = lhs
        // this.negation = negation
        if (generateNot) {
            this.not = new Expect(this.testSuite, lhs, false)
        }
    }

    compare(comparison) {
        /*
        Xor expresses this truth table
        this.not undefined comparison result
                         F          F      F
                         F          T      T
                         T          F      T
                         T          T      F
        */
        return Boolean((this.not === undefined) ^ comparison)
    }


    toBe(rhs) {
        // this.pushExpectResults({comparison:this.lhs === rhs, rhs, testType:'toBe'})
        const failure = this.compare(this.lhs === rhs) ? null : 'COMPARISON'
        this.testSuite.pushExpectResults({
            // todo stringify values
            lhs: this.lhs,
            rhs,
            failure,
            // hasPassed: Boolean(this.negation ^ comparison),
            // doesTypeMatch: doesTypeMatch,
            testType: 'toBe',
            negation: (this.not === null),
            line: lineNumber()
        })
    }

    toBeLevelxxx(min, max, name) {
        // todo this should accept both result, number, strings like numbers
        // wrong type should fail for wrong type

        let failure = null;
        if (Number.isFinite(this.lhs)) {
            if (this.compare(this.lhs < min || this.lhs > max)) {
                failure = 'COMPARISON'
            }
        } else {
            failure = 'TYPE_MISMATCH'
        }

        this.testSuite.pushExpectResults({
            // todo stringify values
            lhs: this.lhs,
            // rhs,
            failure,
            // hasPassed: Boolean(this.negation ^ comparison),
            // doesTypeMatch: doesTypeMatch,
            testType: name,
            negation: (this.not === undefined),
            line: lineNumber()
        })
    }

    toBeLevel2xx() {
        this.toBeLevelxxx(200, 299, 'toBeLevel2xx')
    }

    toBeLevel3xx() {
        this.toBeLevelxxx(300, 399, 'toBeLevel3xx')
    }

    toBeLevel4xx() {
        this.toBeLevelxxx(400, 499, 'toBeLevel4xx')
    }

    toBeLevel5xx() {
        this.toBeLevelxxx(500, 599, 'toBeLevel5xx')
    }

    // todo tohaveprop
    // length
}

class Env {
    global = null
    selected = null

    constructor(data) {
        this.global = data.global
        this.selected = data.selected
    }

    get(key) {
        if (typeof (key) !== "string") {
            throw Error('key is not string')
        }
        const maybeFromSelected = this.selected.find(item => item.key === key)
        if (maybeFromSelected) {
            return maybeFromSelected.value
        }
        const maybeFromGlobal = this.global.find(item => item.key === key)
        if (maybeFromGlobal) {
            return maybeFromGlobal.value
        }
        return undefined
    }

    set(key, value) {
        if (typeof (key) !== "string") {
            throw Error('key is not string')
        }
        if (typeof (value) !== "string") {
            throw Error('value is not string')
        }
        const maybeFromSelected = this.selected.find(item => item.key === key)
        if (maybeFromSelected) {
            maybeFromSelected.value = value
            return
        }
        const maybeFromGlobal = this.global.find(item => item.key === key)
        if (maybeFromGlobal) {
            maybeFromGlobal.value = value
            return
        }
        this.selected.push({ key: key, value: value })
    }

    resolve(key) {
        if (typeof (key) !== "string") {
            throw Error('key is not string')
        }
        return hostResolve(key, [...this.selected, ...this.global])
    }

    getResolve(key) {
        if (typeof (key) !== "string") {
            throw Error('key is not string')
        }
        return hostResolve(this.get(key), [...this.selected, ...this.global])
    }
}

class CallbackHandler {
    constructor() {
        this.requestCallbacks = []
        this.responseCallbacks = []

    }

    addRequestCallback(fun) {
        this.requestCallbacks.push(fun)
    }

    addResponseCallback(fun) {
        this.responseCallbacks.push(fun)
    }

    executeRequestCallbacks(request) {
        for (let callback of this.requestCallbacks) {
            callback(request)
        }
    }

    executeResponseCallbacks(response, request) {
        for (let callback of this.responseCallbacks) {
            callback(response, request)
        }
    }
}


// consolidate them
let out
let expect
let test
let console
let env
let pw

let callbackHandler
let onRequest
let onResponse


function setCurrentContext(context) {
    const testSuite = new TestSuite()
    test = (name, func) => testSuite.executeTest(name, func)
    expect = (lhs) => testSuite.createExpect(lhs)
    console = new Console()
    env = new Env(context.env)
    callbackHandler = new CallbackHandler()
    onRequest = (fun) => callbackHandler.addRequestCallback(fun)
    onResponse = (fun) => callbackHandler.addResponseCallback(fun)
    out = {
        console: console.consoleOutput,
        env: { global: env.global, selected: env.selected },
        tests: testSuite.tests
    }
}

function setLegacyPreRequestContext(context) {
    const env = new Env(context.env)
    pw = {
        env
    }
    out = {
        env: { global: env.global, selected: env.selected },
    }
}

function setLegacyPostRequestContext(context) {
    // console.log('before set post')
    const console = new Console()
    const testSuite = new TestSuite()
    const env = new Env(context.env)
    pw = {
        env,
        response: context.response,
        console,
        test: (name, func) => testSuite.executeTest(name, func),
        expect: (lhs) => testSuite.createExpect(lhs),
    }
    out = {
        console: console.consoleOutput,
        env: { global: env.global, selected: env.selected },
        tests: testSuite.tests
    }
}

function setContext(context) {
    const choices = {
        current: setCurrentContext,
        legacyPreRequest: setLegacyPreRequestContext,
        legacyPostRequest: setLegacyPostRequestContext
    }
    choices[context.mode](context)
}