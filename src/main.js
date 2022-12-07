import { getQuickJS } from "quickjs-emscripten"
import { readFileSync } from 'fs'

import { inspect } from 'util'
// Don't collapse data structures while printing to console.
inspect.defaultOptions.depth = null;


const REGEX_ENV_VAR = /<<([^>]*)>>/g // "<<myVariable>>"

const ENV_MAX_EXPAND_LIMIT = 10

// todo replace with real thing
function parseTemplate(str, variables) {
  if (!variables || !str) {
    return str
  }

  let result = str
  let depth = 0

  while (result.match(REGEX_ENV_VAR) != null && depth <= ENV_MAX_EXPAND_LIMIT) {
    result = decodeURI(encodeURI(result)).replace(
      REGEX_ENV_VAR,
      (_, p1) => variables.find((x) => x.key === p1)?.value || ""
    )
    depth++
  }

  return depth > ENV_MAX_EXPAND_LIMIT
    ? str // todo return unresolved string
    : result
}

class VmWrapper {
  vm = null;
  handle = null;

  async init() {
    if (this.vm) {
      return
    }

    const QuickJS = await getQuickJS()
    this.vm = QuickJS.newContext()

    const handle = this.vm.newFunction("hostResolve", (strHandle, envsHandle) => {
      const str = this.vm.dump(strHandle)
      const envs = this.vm.dump(envsHandle)
      return this.vm.newString(parseTemplate(str, envs))
    })
    this.vm.setProp(this.vm.global, "hostResolve", handle)
    handle.dispose()

    const handle2 = this.vm.newFunction("hostLog", (valueHandle) => {
      const value = this.vm.dump(valueHandle)
      if (Array.isArray(value)) {
        console.log('Log from vm', ...value)
      } else {
        console.log('Log from vm', value)
      }
    })
    this.vm.setProp(this.vm.global, "hostLog", handle2)
    handle2.dispose()


    let result
    result = await this.vm.evalCode(readFileSync('src/lib.js', 'utf8'), "lib.js")
    if (result.error) {
      // todo use some way to consume this in 
      const out = this.vm.dump(result.error)
      result.error.dispose()
      console.log("VM reports error", out)
      throw out
    }
  }

  async evalCode(code, filename) {
    await this.init()

    const result = this.vm.evalCode(code, filename)
    if (result.error) {
      const out = this.vm.dump(result.error)
      result.error.dispose()
      console.log("VM reports error", out)
      return out
    } else {
      return null
    }
  }

  async getOutput(code = "out") {
    const result = await this.vm.evalCode(code)
    const out = this.vm.dump(result.value)
    result.value.dispose()
    return out
  }

  dispose() {
    // this.handle.dispose()
    this.vm.dispose()
  }
}

// todo add request
export async function execTestScript(script, env, artifact, shared, response) {
  const vm = new VmWrapper()
  const context = {env, artifact, shared, response}
  await vm.evalCode(`setPostRequestContext(${JSON.stringify(context)})`)
  const maybeError = await vm.evalCode(script, "ours.js")
  const out = {
    error: maybeError,
    result: await vm.getOutput()
  }
  // const out = maybeError ? { error: maybeError } : { result: await vm.getOutput() }
  vm.dispose()
  return out
}

async function demopostrequest() {
  console.log(await execTestScript(
    readFileSync('src/demopostrequest.js', 'utf8'),
    { global: [], selected: [] },
    {},
    {},
    {
      headers: {},
      status: 200,
      body: "Some body"
    }
  ))
}

export async function execPreRequestScript(script, env, artifact, request) {
  const vm = new VmWrapper()
  const context = {env, artifact, request}
  await vm.evalCode(`setPreRequestContext(${JSON.stringify(context)})`)
  const maybeError = await vm.evalCode(script, "ours.js")
  // todo move this to Either
  const out = {
    error: maybeError,
    result: await vm.getOutput()
  }
  vm.dispose()
  return out
}

async function demoprerequest() {
  // const env = {global: [], selected: []}
  console.log(await execPreRequestScript(
    readFileSync('src/demoprerequest.js', 'utf8'),
    { global: [], selected: [] },
    {},
    {
      headers: {},
      params: { a: 123, b: "foo" }
    }
    ))
}

function main() {
  const which = process.argv[process.argv.length - 1]
  const options = { demopostrequest, demoprerequest }
  // hack to diffentiate between calling from cmd or import
  if (options.hasOwnProperty(which)) {
    options[which]()
  }
}
main()
