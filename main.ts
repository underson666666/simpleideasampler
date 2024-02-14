import { parse } from "https://deno.land/std@0.215.0/ini/mod.ts";
import { readLines } from "https://deno.land/std@0.114.0/io/mod.ts";
import { getRandom, getTargetFilePath, sampling, sleep } from "./util.ts";
import { brightGreen } from "https://deno.land/std@0.215.0/fmt/colors.ts";

const filePath = "./ideas.txt";
let ideas: string[];
try {
  ideas = await readIdeas(getTargetFilePath(filePath));
} catch (e: Error) {
  console.error(`${filePath} is not found.`);
  // console.error(e);
  Deno.exit(0);
}

const configFilePath = "./config.ini";
let config: object;
try {
  config = readIni(getTargetFilePath(configFilePath));
} catch (e: Error) {
  console.error(`${configFilePath} is not found.`);
  // console.error(e);
  Deno.exit(0);
}
console.log(`${config.Sample.sample_count} will pick up from '${filePath}'`);
// await Deno.stdout.write(new TextEncoder().encode("hello: "));

const encoder = new TextEncoder();
while (true) {
  const sampled = sampling(ideas, config.Sample.sample_count);

  if (!config.Sample.animation) {
    console.table(sampled);
  } else {
    for (const sample of sampled) {
      // console.log("output");
      await outputStrs(sample);
    }
  }

  console.log("");
  await sleep(0.2);
  const key = await prompt(
    "終了するには q を入力、続けるには他のキーを入力してエンターを押してください。",
  );
  if (key === "q") {
    break;
  }
  // promptの後に改行を入れる
  console.log("");
}

/**
 * 文字列を1文字ずつ改行せずに出力し最後に開業する
 * @param {string} sample
 */
async function outputStrs(sample: string): void {
  for (let i = 0; i < sample.length; i++) {
    const s = sample.slice(i, i + 1);
    const byte = encoder.encode(brightGreen(s));
    await Deno.stdout.write(byte);
    // await sleep(0.1);
    await sleep(getRandom(0.03, 0.2));
  }
  console.log("");
}

async function readIdeas(filePath: string): Promise<string[]> {
  const newIdeas: string[] = [];
  const file = await Deno.open(filePath);
  for await (const line of readLines(file)) {
    newIdeas.push(line);
  }
  file.close();
  return newIdeas;
}

function readIni(filePath: string): object {
  const config = parse(Deno.readTextFileSync(filePath), {
    reviver: (key, value, section) => {
      if (section === "Sample") {
        if (key === "sample_count") return Number(value);
        if (key === "animation") {
          if (value === "1") {
            return true;
          } else {
            return false;
          }
        }
      }
    },
  });
  return config;
}
