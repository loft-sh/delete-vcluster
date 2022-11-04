import * as core from '@actions/core'
import {exec, getExecOutput} from '@actions/exec'
import {which} from '@actions/io'
import {coerce, satisfies} from 'semver'

import {ArgsBuilder} from './args-builder'

async function run(): Promise<void> {
  try {
    const name: string = core.getInput('name', {required: true})

    // Check that the loft CLI is installed
    await which('loft', true)

    // Check that the loft CLI supports projects
    const project: string = core.getInput('project')
    const loftVersion = await getLoftVersion()
    if (project !== '' && !isProjectSupported(loftVersion)) {
      throw new Error(`Project input requires Loft CLI version 3.0 and above`)
    }

    const args: ArgsBuilder = new ArgsBuilder()
    args.addSubcommand('delete')
    args.addSubcommand('vcluster')
    args.addSubcommand(name)
    args.add('cluster', core.getInput('cluster'))
    args.add('project', project)
    args.add('space', core.getInput('space'))
    args.addFlag('delete-space', core.getBooleanInput('delete-space'))
    args.addFlag('delete-context', true)

    // Execute the delete space command
    await exec('loft', args.build())
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

async function getLoftVersion(): Promise<string> {
  const {stdout: loftVersionOutput = ''} = await getExecOutput('loft', [
    '--version'
  ])
  return loftVersionOutput.replace('loft version', '').trim()
}

function isProjectSupported(version: string): boolean {
  const coerced = coerce(version)
  if (coerced == null) {
    return false
  }
  return satisfies(coerced, '^3.0.0')
}

run()
