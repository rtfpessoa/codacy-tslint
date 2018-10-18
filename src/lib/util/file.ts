import fs from 'fs';

export default function readFileSync(path: string): string | undefined {
  return fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : undefined;
}
