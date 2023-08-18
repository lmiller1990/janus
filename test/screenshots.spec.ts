import {
  ModifiedScreenshot,
  getModifiedScreenshots,
} from "../src/screenshots.js";
import { describe, it } from "node:test";
import { setupFixtureProject } from "./utils.js";
import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert";

describe("getModifiedScreenshots", () => {
  it("gets png images modified after a given time", async () => {
    const dir = await setupFixtureProject("screenshots");
    const img = path.join(dir, "img-1.png");

    const start = new Date().getTime();
    await fs.utimes(img, new Date().getTime(), new Date().getTime());
    const newStat = await fs.stat(img);

    const expected: ModifiedScreenshot[] = [
      {
        absolutePath: img,
        mtimeMs: newStat.mtimeMs,
      },
    ];

    const actual = await getModifiedScreenshots(dir, { after: start });

    assert.deepEqual(actual, expected);
  });
});
