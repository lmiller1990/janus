import os from "node:os";
import url from "node:url";
import fs from "node:fs/promises";
import path from "node:path";

const __dirname = path.dirname(url.fileURLToPath(new URL(import.meta.url)));

export async function setupFixtureProject(projectName: string) {
  const dir = path.join(os.tmpdir(), projectName);

  if (await fs.stat(dir)) {
    await fs.rm(dir, { recursive: true });
  }

  await fs.cp(path.join(__dirname, "fixtures", projectName), dir, {
    recursive: true,
    preserveTimestamps: true
  });

  return dir;
}
