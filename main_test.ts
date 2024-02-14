import {
  assertArrayIncludes,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.214.0/assert/mod.ts";
import { getRandom, sampling } from "./util.ts";

Deno.test("サンプリング後の件数が指定した件数になること", () => {
  const strList: string[] = ["a", "b", "c", "d", "e"];

  for (let i = 1; i <= strList.length; i++) {
    const retVal = sampling(strList, i);
    assertEquals(i, retVal.length);
  }
});

Deno.test("サンプリング数が0以下の場合は1件取得できること", () => {
  const strList: string[] = ["a", "b", "c", "d", "e"];

  assertEquals(sampling(strList, 0).length, 1);
  assertEquals(sampling(strList, -1).length, 1);
});

Deno.test("サンプリングした配列に重複する値が含まれていないこと", () => {
  const strList: string[] = ["a", "b", "c", "d", "e"];
  const retVal = sampling(strList, 3);
  const uniqued = [...new Set(retVal)];
  const testCount = 100;

  for (let i = 0; i < testCount; i++) {
    assertEquals(retVal.length, uniqued.length);
  }
});

Deno.test("サンプリングした値が指定した配列の値に含まれていること", () => {
  const strList: string[] = ["a", "b", "c", "d", "e"];

  for (let i = 1; i <= strList.length; i++) {
    const retVal = sampling(strList, i);
    assertArrayIncludes(strList, retVal);
  }
});

Deno.test("サンプリング数が配列数より長い場合にエラーが発生すること", () => {
  const strList: string[] = ["a", "b", "c", "d", "e"];

  assertEquals(sampling(strList, 5).length, 5);

  assertThrows(() => {
    sampling(strList, 6), Error, "sampling count is begger than list length.";
  });
});

Deno.test("getRandomの値が指定した範囲に収まること(float)", () => {
  const min = 0.1;
  const max = 0.3;
  const random = getRandom(min, max);
  for (let i = 0; i < 1000; i++) {
    assertEquals(min < random, true);
    assertEquals(random < max, true);
  }
});

Deno.test("getRandomの値が指定した範囲に収まること(int)", () => {
  const min = 1;
  const max = 3;
  const random = getRandom(min, max);
  for (let i = 0; i < 1000; i++) {
    assertEquals(min < random, true);
    assertEquals(random < max, true);
  }
});
