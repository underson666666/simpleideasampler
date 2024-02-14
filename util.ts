import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";
import { sample } from "https://deno.land/std@0.107.0/collections/mod.ts";

export function getTargetFilePath(filePath: string): string {
  let dirName: string;
  if (Deno.build.os === "windows") {
    dirName = dirname(Deno.execPath());
  } else {
    const executeFilePath = fromFileUrl(import.meta.url);
    dirName = dirname(executeFilePath);
  }
  const targetFilePath = join(dirName, filePath);
  return targetFilePath;
}

/**
 * 配列からランダムに指定した個数の要素を取り出して返す
 *
 * @param {string[]} ideas
 * @param {number} sampleCount - 取得する要素数
 * @return {(string|undefined)[]}
 */
export function sampling(
  ideas: readonly string[],
  sampleCount: number,
): (string | undefined)[] {
  if (ideas.length < sampleCount) {
    throw new Error("sampling count is begger than list length.");
  }

  const sampledIdeas: (string | undefined)[] = [];

  while (true) {
    const sampledIdea: string | undefined = sample(ideas);

    // 同じ要素は追加しない
    if (sampledIdeas.length) {
      const aaa = sampledIdeas.filter((n) => n === sampledIdea);
      if (aaa.length) {
        continue;
      }
    }

    sampledIdeas.push(sampledIdea);
    if (sampledIdeas.length >= sampleCount) {
      break;
    }
  }

  return sampledIdeas;
}

export function getRandom(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * n秒待機する　awaitが必要
 * @param {number} sec
 */
export function sleep(sec: number) {
  return new Promise((res) => {
    setTimeout(() => res(null), sec * 1000);
  });
}
