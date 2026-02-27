import 'dotenv/config';
import fs from 'fs';

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    throw new Error("Missing env var: " + name);
  }
  return v;
}

const endpoint = requireEnv('AZURE_SEARCH_ENDPOINT');
const indexName = requireEnv('AZURE_SEARCH_INDEX');

console.log("OK: env loaded");
console.log("Endpoint:", endpoint);
console.log("Index:", indexName);

const manifestPath = '../../corpus/manifest_v1.csv';
if (!fs.existsSync(manifestPath)) {
  throw new Error("manifest not found at " + manifestPath);
}
console.log("OK: manifest exists:", manifestPath);