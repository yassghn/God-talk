/**
 * cli.ts
 */
import { parseArgs, styleText } from "util";
import { stdout } from "process";
import {
  makeSuggestion,
  makeExpression,
  makeWarning,
  makeContext,
  makeRandom,
  makeGuide,
  makeExplain,
} from "./God-talk.js";
import prand from "pure-rand";

(async function () {
  "use strict";

  const _options = {
    talk: {
      name: "talk",
      cmds: {
        suggestion: "suggestion",
        expression: "expression",
        warning: "warning",
        context: "context",
        guide: "guide",
        explain: "explain",
      },
    },
    random: {
      name: "random",
    },
    question: {
      name: "question",
    },
    help: {
      name: "help",
    },
  };

  function getCliArgs() {
    const args = parseArgs({
      args: Bun.argv,
      strict: true,
      allowPositionals: true,
      options: {
        talk: {
          type: "string",
          multiple: true,
          short: "t",
        },
        random: {
          type: "boolean",
          multiple: true,
          short: "r",
        },
        question: {
          type: "string",
          short: "q",
        },
        help: {
          type: "boolean",
          short: "h",
        },
      },
    });

    return args.values;
  }

  function talkCmdsVerified(args: string[]) {
    // iterate talk args
    for (const arg of args) {
      // verify talk command exists
      if (!Object.hasOwn(_options.talk.cmds, arg)) {
        // write error to stderr
        Bun.write(Bun.stderr, `invalid talk command: ${arg}\n`);
        Bun.write(
          Bun.stderr,
          `talk command must be one of: [${Object.keys(_options.talk.cmds)}]\n`
        );
        return false;
      }
    }
    return true;
  }

  function _applyEmitter(str: string): string {
    const ret = { str: "" };
    ret.str += styleText("red", str, { stream: stdout, validateStream: true });
    return ret.str;
  }

  async function echo(label: string, str: string) {
    const coloredLabel = _applyEmitter(label);
    await Bun.write(Bun.stdout, coloredLabel + str + "\n");
  }

  async function runCmd(cmd: string) {
    switch (cmd) {
      case _options.talk.cmds.suggestion:
        // write suggestion to stdout
        const suggestion = makeSuggestion();
        await echo("suggestion: ", suggestion);
        break;
      case _options.talk.cmds.expression:
        // write expression to stdout
        const expression = makeExpression();
        await echo("expression: ", expression);
        break;
      case _options.talk.cmds.warning:
        const warning = makeWarning();
        await echo("   warning: ", warning);
        break;
      case _options.talk.cmds.guide:
        const guide = makeGuide();
        await echo("     guide: ", guide);
        break;
      case _options.talk.cmds.explain:
        const explain = makeExplain();
        await echo("   explain: ", explain);
        break;
      case _options.talk.cmds.context:
        const context = makeContext();
        await echo("   context: ", context);
        break;
    }
  }

  async function talkCmd(args: string[]) {
    // verify talk commands
    if (talkCmdsVerified(args)) {
      // iterate talk commands
      for (const arg of args) {
        switch (arg) {
          case _options.talk.cmds.suggestion:
            await runCmd(_options.talk.cmds.suggestion);
            break;
          case _options.talk.cmds.expression:
            await runCmd(_options.talk.cmds.expression);
            break;
          case _options.talk.cmds.warning:
            await runCmd(_options.talk.cmds.warning);
            break;
          case _options.talk.cmds.guide:
            await runCmd(_options.talk.cmds.guide);
            break;
          case _options.talk.cmds.explain:
            await runCmd(_options.talk.cmds.explain);
            break;
          case _options.talk.cmds.context:
            await runCmd(_options.talk.cmds.context);
            break;
        }
      }
    }
  }

  async function randomCmd() {
      const random = makeRandom();
      await echo("    random: ", random)
  }

  /**
   * https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
   * @param str
   * @returns
   */
  function cyrb128(str: string) {
    let h1 = 1779033703,
      h2 = 3144134277,
      h3 = 1013904242,
      h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    (h1 ^= h2 ^ h3 ^ h4), (h2 ^= h1), (h3 ^= h1), (h4 ^= h1);
    return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
  }

  async function questionCmd(arg: string) {
    const responses = [
      "yes",
      "no",
      "maybe",
      "i don't know",
      "incorrect question",
      "bad question",
      "retry",
      "unknown",
      "other",
    ];
    const arr = cyrb128(arg);
    const idot = arr.pop() + arr.pop() + arr.pop() + arr.pop();
    const rl = responses.length - 1;
    const seed = Math.floor(Math.random() * idot);
    const rng = prand.xoroshiro128plus(seed);
    const randIndex = prand.unsafeUniformIntDistribution(0, rl, rng);
    const reply = responses[randIndex];
    if (reply) {
      await echo("     reply: ", reply);
    } else {
      console.error("error in reply, try rl - 1 probably");
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
      `-q, --question STRING  question command` +
      `\n` +
      `-h, --help             help`;
    // write to stdout using bun i/o api
    await Bun.write(Bun.stdout, helpStr);
  }

  async function processOptions() {
    // get cli args
    const args = getCliArgs();
    // iterate cli args
    for (const arg in args) {
      switch (arg) {
        case _options.talk.name:
          if (args.talk) {
            await talkCmd(args.talk);
          }
          break;
        case _options.random.name:
          if (args.random) {
            await randomCmd();
          }
          break;
        case _options.question.name:
          if (args.question) {
            await questionCmd(args.question);
          }
          break;
        case _options.help.name:
          outputHelp();
          break;
        default:
          throw new Error("invalid option");
      }
    }
  }

  async function cli() {
    await processOptions();
  }

  await cli();
})();
