import {
  assertEquals,
  assertNotEquals,
  assertThrows,
} from "https://deno.land/std@0.163.0/testing/asserts.ts";
import { reconstructSecret, shareSecret } from "../secretsharing.ts";
const rndInt = (min: number, max: number) =>
  Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
  Math.ceil(min);

const input = new Int8Array(rndInt(10, 50)).map(() => rndInt(0, 255));
const NUM_SHARES = rndInt(3, 16);
const THRESHOLD = Math.round(NUM_SHARES / 2);

Deno.test("Test secret reconstruction", async (t) => {
  const shares = shareSecret(input, NUM_SHARES, THRESHOLD);
  for (let i = 2; i < NUM_SHARES; i++) {
    await t.step(`Trying with ${i} shares`, () => {
      const res = reconstructSecret(shares.slice(0, i));
      if (i < THRESHOLD) {
        assertNotEquals(res, input);
      } else {
        assertEquals(res, input);
      }
    });
  }
});

Deno.test("Test shareSecret error management", async (t) => {
  await t.step("Empty secret throws", () => {
    assertThrows(() => shareSecret(new Int8Array(), NUM_SHARES, THRESHOLD));
    assertThrows(() => reconstructSecret([new Int8Array()]));
  });
  await t.step("Less than 2 shares throws", () => {
    assertThrows(() => shareSecret(new Int8Array(), 1, 1));
  });
  await t.step("Threshold greater than shares throws", () => {
    assertThrows(() => shareSecret(new Int8Array(), 1, 2));
  });
});

Deno.test("Test reconstructSecret error management", async (t) => {
  await t.step("Less than 2 shares throws", () => {
    assertThrows(() => reconstructSecret([new Int8Array()]));
  });
  await t.step("Misaligned shares (length) throws", () => {
    assertThrows(() =>
      reconstructSecret([
        new Int8Array(),
        new Int8Array(rndInt(10, 50)).map(() => rndInt(0, 255)),
        new Int8Array(rndInt(1, 20)).map(() => rndInt(0, 255)),
      ])
    );
  });
});
