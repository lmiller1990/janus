import { glob } from "glob";
import path from "node:path";
import fs from "node:fs/promises";

export interface ModifiedScreenshot {
  absolutePath: string;
  mtimeMs: number;
}

export async function getModifiedScreenshots(
  projectPath: string,
  // unix timestamp
  { after }: { after: number }
): Promise<ModifiedScreenshot[]> {
  const pngs = await glob(path.join(projectPath, "**/*.png"));
  const withMetadata = await Promise.all(
    pngs.map(async (png) => {
      return {
        mtimeMs: (await fs.stat(png)).mtimeMs,
        absolutePath: png,
      };
    })
  );

  return withMetadata.filter((x) => x.mtimeMs > after);
}
