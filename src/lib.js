function operateTwo(a, b) {
    return {sum: a+b, product: a*b, division: a/b}
}

consoleOutput = []
// expectResults = [] 
// todo unserializable stuff will become null
tests = []
activeTest = null;
out = {consoleOutput, tests}

function test(name, func) {
    activeTest = {name: name, expectations: []}
    tests.push(activeTest)
    func()
    activeTest = null
}

function pushExpectResults(obj) {
    // if active test push to that
    // if not create one, set it, push to array,
    // push to active test
    if(!activeTest){
        activeTest = {name: null, expectations: []}
        tests.push(activeTest)
    }
    activeTest.expectations.push(obj)
}

function lineNumber(){
    const stacktrace = new Error().stack
    return parseInt(stacktrace.match(/\(ours\.js:(\d+)\)/)[1])
}

console = {
    log: (...args) => consoleOutput.push({level: 'log', args: args, line: lineNumber()}),
    info: (...args) => consoleOutput.push({level: 'info', args: args, line: lineNumber()}),
    debug: (...args) => consoleOutput.push({level: 'debug', args: args, line: lineNumber()}),
    error: (...args) => consoleOutput.push({level: 'error', args: args, line: lineNumber()}),
}

class Expect{
    lhs = undefined
    // negation = false
    not = null
    // failure = undefined

    constructor(lhs, generateNot=true) {
        this.lhs = lhs
        // this.negation = negation
        if(generateNot){
            this.not = new Expect(lhs, false)
        }
    }

    compare(comparison) {
        /*
        Xor expresses this truth table
        this.negation comparison result
                    f          f      f
                    f          t      t
                    t          f      t
                    t          t      f
        */
        return Boolean((this.not === null) ^ comparison)
    }


    toBe(rhs) {
        // this.pushExpectResults({comparison:this.lhs === rhs, rhs, testType:'toBe'})
        const failure = this.compare(this.lhs === rhs) ? null : 'COMPARISON'
        pushExpectResults({
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
        const doesTypeMatch = Number.isFinite(this.lhs)
        // this.pushExpectResults({comparison: doesTypeMatch && this.lhs >= 200 && this.lhs <300, testType:'toBeLevel2xx', doesTypeMatch})

        let failure = null;
        if (Number.isFinite(this.lhs)) {
            if (this.compare(this.lhs < min || this.lhs > max)) {
                failure = 'COMPARISON'
            }
        } else {
            failure = 'TYPE_MISMATCH'
        }

        pushExpectResults({
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

    //tohaveprop
    // length
}

function expect(lhs){
    return new Expect(lhs)
}

let pw = null;

function setPwForPreRequest() {
    pw = {
        // todo env
    }
}

function setPwForPostRequest(response) {
    pw = {
        // todo response, env
        response,
        console,
        test,
        expect,
    }
}