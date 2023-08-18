import { glob } from "glob";
import path from "node:path";
import fs from "node:fs/promises";
import { debuglog } from "node:util";

const debug = debuglog("screenshots");

export async function getNewlyCreatedScreenshots(
  projectPath: string,
  // unix timestamp
  { after }: { after: number }
): Promise<string[]> {
  const pngs = await glob(path.join(projectPath, "**/*.png"));
  debug("found %o", pngs);
  const withMetadata = await Promise.all(
    pngs.map(async (png) => {
      return {
        ctimeMs: (await fs.stat(png)).ctimeMs,
        absolutePath: png,
      };
    })
  );

  const createdAfterStart = withMetadata.reduce<string[]>((acc, curr) => {
    if (curr.ctimeMs > after) {
      return acc.concat(curr.absolutePath);
    }
    return acc;
  }, []);

  debug("screenshots created after run started %o", createdAfterStart);

  return createdAfterStart;
}
