import { ScriptRunner } from '../main';

test.skip('Avoid Jest complaining this file needs atleast one test', () => 1)

export async function runScript(script, env) {
    const scriptRunner = new ScriptRunner();
    await scriptRunner.init(script, env);
    const out = await scriptRunner.getOutput();
    scriptRunner.dispose();
    return out;
}
