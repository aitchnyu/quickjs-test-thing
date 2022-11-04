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
    ? null
    : result
}

class VmWrapper {
  vm = null;
  handle = null;

  context = null
  env = null

  constructor(context) {
    // todo context has mode, env and optionally response
    this.context = context
    // this.env = env
  }

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
    result = await this.vm.evalCode(`setContext(${JSON.stringify(this.context)})`)
    if (result.error) {
      // todo use some way to consume this without dispose
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

export class ScriptRunner {
  vm

  // todo inform that functions will return error
  async init(script, env) {
    this.vm = new VmWrapper({ mode: 'current', env })
    // let maybeError
    return await this.vm.evalCode(script, "ours.js")
  }

  async handleRequest(request) {
    return await this.vm.evalCode(`callbackHandler.executeRequestCallbacks(${JSON.stringify(request)})`)
  }

  async handleResponse(response) {
    return await this.vm.evalCode(`callbackHandler.executeResponseCallbacks(${JSON.stringify(response)})`)
  }

  async getOutput() {
    return await this.vm.getOutput()
  }

  async dispose() {
    this.vm.dispose()
  }
}

async function demo() {
  const scriptRunner = new ScriptRunner()
  let maybeError 
  maybeError = await scriptRunner.init(readFileSync('src/demo.js', 'utf8'), { global: [], selected: [] })
  if (maybeError) {
    console.log('failed init', maybeError)
  }
  maybeError = await scriptRunner.handleRequest({
    headers: {},
    params: { a: 123, b: "foo" }
  })
  if (maybeError) {
    console.log('failed req', maybeError)
  }
  maybeError = await scriptRunner.handleResponse({
    headers: {},
    status: 200,
    body: "Some body"
  })
  if (maybeError) {
    console.log('failed resp', maybeError)
  }
  const res = await scriptRunner.getOutput()
  console.log(res)
  scriptRunner.dispose()
}

export async function execTestScript(script, env, response) {
  const vm = new VmWrapper({ mode: 'legacyPostRequest', env, response })
  const maybeError = await vm.evalCode(script, "ours.js")
  // todo move this to either
  const out = maybeError ? { error: maybeError } : { result: await vm.getOutput() }
  vm.dispose()
  return out
}

async function demopostrequest() {
  console.log(await execTestScript(
    readFileSync('src/demopostrequest.js', 'utf8'),
    { global: [], selected: [] },
    {
      headers: {},
      status: 200,
      body: "Some body"
    }
  ))
}

export async function execPreRequestScript(script, env) {
  const vm = new VmWrapper({ mode: 'legacyPreRequest', env: env })
  const maybeError = await vm.evalCode(script, "ours.js")
  // todo move this to Either
  const out = maybeError ? { error: maybeError } : { result: await vm.getOutput() }
  vm.dispose()
  return out
}

async function demoprerequest() {
  // const env = {global: [], selected: []}
  console.log(await execPreRequestScript(
    readFileSync('src/demoprerequest.js', 'utf8'),
    { global: [], selected: [] }))
}

function main() {
  const which = process.argv[process.argv.length - 1]
  const options = { demo, demopostrequest, demoprerequest }
  // hack to diffentiate between calling from cmd or import
  if (options.hasOwnProperty(which)) {
    options[which]()
  }
}
main()
