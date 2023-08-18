import { getNewlyCreatedScreenshots } from "../src/screenshots.js";
import { describe, it } from "node:test";
import { setupFixtureProject } from "./utils.js";
import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert";

const delay = () => new Promise((res) => setTimeout(res, 100));

describe("getNewlyCreatedScreenshots", () => {
  it("gets png images modified after a given time", async () => {
    const dir = await setupFixtureProject("screenshots");
    const img = path.join(dir, "img-1.png");
    await delay();

    const start = new Date().getTime();
    const newImg = path.join(dir, "new-image.png");
    await fs.copyFile(img, newImg);

    const actual = await getNewlyCreatedScreenshots(dir, { after: start });

    assert.deepEqual(actual, [newImg]);
  });
});
