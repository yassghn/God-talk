/**
 * cli.ts
 */
import { parseArgs, styleText } from 'util'
import { stdout } from 'process'
import { makeSuggestion, makeExpression, makeWarning, makeContext, makeGuide, makeExplain } from './God-talk.js'

(function () {
    'use strict'

    const _options = {
        talk: {
            name: 'talk',
            cmds: {
                suggestion: 'suggestion',
                expression: 'expression',
                warning: 'warning',
                context: 'context',
                guide: 'guide',
                explain: 'explain'
            }
        },
        help: {
            name: 'help'
        }
    }

    function getCliArgs() {
        const args = parseArgs({
            args: Bun.argv,
            strict: true,
            allowPositionals: true,
            options: {
                talk: {
                    type: 'string',
                    multiple: true,
                    short: 't'
                },
                help: {
                    type: 'boolean',
                    short: 'h'
                }
            }
        })

        return args.values
    }

    function talkCmdsVerified(args: string[]) {
        // iterate talk args
        for (const arg of args) {
            // verify talk command exists
            if (!Object.hasOwn(_options.talk.cmds, arg)) {
                // write error to stderr
                Bun.write(Bun.stderr, `invalid talk command: ${arg}\n`)
                Bun.write(Bun.stderr, `talk command must be one of: [${Object.keys(_options.talk.cmds)}]\n`)
                return false
            }
        }
        return true
    }

    function _applyEmitter(str: string): string {
        const ret = { str: '' }
        ret.str += styleText('red', str, { stream: stdout, validateStream: true})
        return ret.str
    }

    function echo(label: string, str: string) {
        const coloredLabel = _applyEmitter(label)
        Bun.write(Bun.stdout, coloredLabel + str + '\n')
    }

    function runCmd(cmd: string) {
        switch (cmd) {
            case _options.talk.cmds.suggestion:
                // write suggestion to stdout
                const suggestion = makeSuggestion()
                echo('suggestion: ', suggestion)
                break
            case _options.talk.cmds.expression:
                // write expression to stdout
                const expression = makeExpression()
                echo('expression: ', expression)
                break
            case _options.talk.cmds.warning:
                const warning = makeWarning()
                echo('   warning: ', warning)
                break
            case _options.talk.cmds.guide:
                const guide = makeGuide()
                echo('     guide: ', guide)
                break
            case _options.talk.cmds.explain:
                const explain = makeExplain()
                echo('   explain: ', explain)
                break
            case _options.talk.cmds.context:
                const context = makeContext()
                echo('   context: ', context)
                break
        }
    }

    function talkCmd(args: string[]) {
        // verify talk commands
        if (talkCmdsVerified(args)) {
            // iterate talk commands
            for (const arg of args) {
                switch (arg) {
                    case _options.talk.cmds.suggestion:
                        runCmd(_options.talk.cmds.suggestion)
                        break
                    case _options.talk.cmds.expression:
                        runCmd(_options.talk.cmds.expression)
                        break
                    case _options.talk.cmds.warning:
                        runCmd(_options.talk.cmds.warning)
                        break
                    case _options.talk.cmds.guide:
                        runCmd(_options.talk.cmds.guide)
                        break
                    case _options.talk.cmds.explain:
                        runCmd(_options.talk.cmds.explain)
                        break
                    case _options.talk.cmds.context:
                        runCmd(_options.talk.cmds.context)
                        break
                }
            }
        }
    }

    async function outputHelp() {
        // build help str
        const helpStr =
            `God-talk cli v0.0.1 (2025-05-09)` +
            `\n\n` +
            `God-talk! "random"-ly formulated sentences.` +
            `\n\n` +
            `USAGE` +
            `\n` +
            ` $ bun run cli.ts FLAG COMMAND` +
            `\n\n` +
            `Flags: ` +
            `\n` +
            `-t, --talk COMMAND     talk command` +
            `\n` +
            `-h, --help             help`
        // write to stdout using bun i/o api
        await Bun.write(Bun.stdout, helpStr)
    }

    function processOptions() {
        // get cli args
        const args = getCliArgs()
        // iterate cli args
        for (const arg in args) {
            switch (arg) {
                case _options.talk.name:
                    if (args.talk) {
                        talkCmd(args.talk)
                    }
                    break
                case _options.help.name:
                    outputHelp()
                    break
                default:
                    throw new Error('invalid option')
            }
        }
    }

    function cli() {
        processOptions()
    }

    cli()
})()
