#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');
const exts = ['.ts', '.tsx', '.js', '.jsx', '.mts', '.cts', '.json'];

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === 'dist' || e.name === 'out') continue;
      walk(full, files);
    } else if (/\.(ts|tsx|js|jsx|mts|cts)$/.test(e.name)) {
      files.push(full);
    }
  }
  return files;
}

function findImportPaths(content, filePath) {
  const imports = new Set();
  const importRegex = /import\s+(?:.+?\s+from\s+)?['"](.+?)['"]/g;
  const importCallRegex = /import\(\s*['"](.+?)['"]\s*\)/g;
  const requireRegex = /require\(\s*['"](.+?)['"]\s*\)/g;
  let m;
  while ((m = importRegex.exec(content))) imports.add(m[1]);
  while ((m = importCallRegex.exec(content))) imports.add(m[1]);
  while ((m = requireRegex.exec(content))) imports.add(m[1]);
  return Array.from(imports).map(p => ({ spec: p, file: filePath }));
}

function resolveImport(baseDir, spec) {
  if (!spec.startsWith('.')) return null; // skip packages
  const abs = path.resolve(baseDir, spec);
  // try file extensions
  for (const ext of exts) {
    if (fs.existsSync(abs + ext)) return abs + ext;
  }
  // try index files
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return abs;
  for (const ext of exts) {
    if (fs.existsSync(path.join(abs, 'index' + ext))) return path.join(abs, 'index' + ext);
  }
  return null;
}

function checkCasing(realPath) {
  const rel = path.relative(root, realPath);
  const parts = rel.split(path.sep);
  let cur = root;
  const problems = [];
  for (const part of parts) {
    const parent = cur;
    cur = path.join(cur, part);
    try {
      const entries = fs.readdirSync(parent);
      const match = entries.find(e => e.toLowerCase() === part.toLowerCase());
      if (!match) {
        problems.push({ type: 'missing', parent, expected: part });
        break;
      }
      if (match !== part) {
        problems.push({ type: 'case-mismatch', parent, expected: part, actual: match, actualPath: path.join(parent, match) });
      }
    } catch (err) {
      problems.push({ type: 'error', parent, err: String(err) });
      break;
    }
  }
  return problems;
}

function main() {
  if (!fs.existsSync(srcDir)) {
    console.error('src/ not found, aborting');
    process.exit(1);
  }
  const files = walk(srcDir);
  const results = [];
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    const imports = findImportPaths(content, f);
    const baseDir = path.dirname(f);
    for (const imp of imports) {
      if (!imp.spec.startsWith('.')) continue;
      const resolved = resolveImport(baseDir, imp.spec);
      if (!resolved) {
        // unresolved imports might be due to extension omission; we still report
        results.push({ file: imp.file, import: imp.spec, resolved: null, problems: [{ type: 'unresolved' }] });
        continue;
      }
      const problems = checkCasing(resolved);
      if (problems.length) {
        results.push({ file: imp.file, import: imp.spec, resolved, problems });
      }
    }
  }

  if (results.length === 0) {
    console.log('No case-sensitive import mismatches found.');
    process.exit(0);
  }

  console.log('Found potential casing issues:');
  for (const r of results) {
    console.log('---');
    console.log('source:', r.file);
    console.log('import:', r.import);
    console.log('resolved:', r.resolved);
    for (const p of r.problems) {
      if (p.type === 'case-mismatch') {
        console.log(`case-mismatch: parent=${p.parent} expected=${p.expected} actual=${p.actual}`);
      } else if (p.type === 'missing') {
        console.log(`missing path segment under ${p.parent}: expected ${p.expected}`);
      } else if (p.type === 'unresolved') {
        console.log('unresolved import (no matching file found with standard extensions)');
      } else {
        console.log('error:', p.err || JSON.stringify(p));
      }
    }
  }
  process.exit(2);
}

main();
