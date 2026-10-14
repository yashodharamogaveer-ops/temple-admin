// Copies the few files that describe the website's content model from ../website into this project,
// so the admin panel always knows the same texts, defaults and page list as the live site.
// Run:  npm run sync-shared   (after changing texts in website/src/types.ts or running the website's extract-strings)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const web = path.resolve(here, '../../website/src');
const dst = path.resolve(here, '../src');
const files = ['types.ts', 'lib/content.ts', 'lib/seo.ts', 'lib/stringCatalog.ts'];
if (!fs.existsSync(web)) { console.error('Could not find ../website — run this from the full project folder.'); process.exit(1); }
for (const f of files) { fs.copyFileSync(path.join(web, f), path.join(dst, f)); console.log('synced', f); }
