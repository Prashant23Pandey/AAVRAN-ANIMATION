const fs = require('fs');

const workers = [
  'bitmapworker-DtCLhbWB.js',
  'charactergeoworker-D8pdYVWP.js',
  'collisionworker-eT5h7hIA.js',
  'dracoworker-9mmlh0V-.js',
  'exrworker-Dm3Bkfzh.js',
  'geometryworker-WyEueJn9.js',
  'glyphworker-DoaYwstb.js',
  'msdfworker-DGxypdow.js'
];

for (const w of workers) {
    const file = `assets/${w}`;
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    console.log(`\n=== Worker: ${w} ===`);
    let idx = 0;
    while ((idx = content.indexOf('postMessage', idx)) !== -1) {
        console.log(content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 100)));
        idx += 11;
    }
}
