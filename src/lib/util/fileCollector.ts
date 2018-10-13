import fs from 'fs';
import glob from 'glob';

const extensions: ReadonlyArray<string> = ['.ts', '.tsx'];

export default function collectFiles(
  sourcePath: string
): ReadonlyArray<string> {
  return glob.sync(`${sourcePath}/**`).filter(isFileWithMatchingExtension);
}

function isFileWithMatchingExtension(file: string): boolean {
  const stats = fs.lstatSync(file);
  const extension = '.' + file.split('.').pop();
  return (
    stats.isFile() &&
    !stats.isSymbolicLink() &&
    extensions.indexOf(extension) >= 0
  );
}
