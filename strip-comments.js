const fs = require('fs');
const glob = require('glob');
const strip = require('strip-comments');

const files = glob.sync('src/**/*.{ts,tsx}', { ignore: 'node_modules/**' });
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const stripped = strip(content, { keepProtected: false, block: true, line: true });
  fs.writeFileSync(file, stripped);
  console.log('Stripped:', file);
});
