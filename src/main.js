import { getQuickJS } from "quickjs-emscripten"
import {readFileSync} from 'fs'

import {inspect} from 'util'
// Don't collapse data structures while printing to console.
inspect.defaultOptions.depth = null;

class VmWrapper {
  vm = null;

  constructor () {
    
  }

  async evalCode (code, filename) {
    if(!this.vm) {
      const QuickJS = await getQuickJS()
      this.vm = QuickJS.newContext()
    }
    const result = this.vm.evalCode(code, filename)
    if (result.error) {
    //   console.log("Execution failed:", vm.dump(result.error))
      const out = this.vm.dump(result.error)
      result.error.dispose()
      return {error: out, result: null}
    } else {
      const out = this.vm.dump(result.value)
      result.value.dispose()
      return {error: null, result: out}
    }
  }

  dispose() {
    this.vm.dispose()
  }

}


async function demo() {
  const vm = new VmWrapper()

  let res

  res = await vm.evalCode(readFileSync('src/lib.js', 'utf8'), "lib.js")
  res = await vm.evalCode(readFileSync('src/demo.js', 'utf8'), "ours.js")
  if(res.error) {
    console.log('failed', res.error)
  }
  res = await vm.evalCode("out")
  console.log(res.result)
  vm.dispose()
}

async function demopostrequest() {
  const vm = new VmWrapper()

  let res
  res = await vm.evalCode(readFileSync('src/lib.js', 'utf8'), "lib.js")
  let response = {
    status: 200,
    body: "Some body"
  }
  res = await vm.evalCode(`setPwForPostRequest(${JSON.stringify(response)})`)

  res = await vm.evalCode(readFileSync('src/demopostrequest.js', 'utf8'), "ours.js")
  if(res.error) {
    console.log('failed', res.error)
  }

  res = await vm.evalCode("out")
  console.log(res.result)

  vm.dispose()
}

function main(){
  const which = process.argv[process.argv.length - 1]
  // console.log(which)
  const options = {demo, demopostrequest}
  options[which]()

}  

main()