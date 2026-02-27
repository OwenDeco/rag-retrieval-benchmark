import 'dotenv/config';
import fs from 'fs';
import path from 'path';

function readText(p) {
  return fs.readFileSync(p, 'utf8');
}

function parseCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
  const header = lines[0].split(',').map(s => s.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    // Simple CSV parser assumption: no commas inside fields (true for our manifest)
    const cols = lines[i].split(',').map(s => s.trim());
    const row = {};
    header.forEach((h, idx) => row[h] = cols[idx] ?? '');
    rows.push(row);
  }
  return rows;
}

const repoRootFromHere = path.resolve(process.cwd(), '..', '..');
const manifestPath = path.join(repoRootFromHere, 'corpus', 'manifest_v1.csv');
const rawDir = path.join(repoRootFromHere, 'corpus', 'raw');

if (!fs.existsSync(manifestPath)) throw new Error('Missing manifest: ' + manifestPath);
if (!fs.existsSync(rawDir)) throw new Error('Missing raw dir: ' + rawDir);

const manifest = parseCsv(readText(manifestPath));

console.log('Manifest rows:', manifest.length);
let missing = 0;

for (const doc of manifest) {
  const fileName = doc.file_name;
  const filePath = path.join(rawDir, fileName);

  if (!fileName) {
    console.log('[WARN] missing file_name for doc_id', doc.doc_id);
    missing++;
    continue;
  }

  if (!fs.existsSync(filePath)) {
    console.log('[MISSING]', doc.doc_id, '->', fileName);
    missing++;
  }
}

console.log('Missing files:', missing);
if (missing === 0) console.log('OK: all manifest files exist in corpus/raw');
