const fs = require('fs');
const c = fs.readFileSync('assets/App3D-DwM1eiaC.js', 'utf8');

const target = 'workerTask';
let idx = 0;
while ((idx = c.indexOf(target, idx)) !== -1) {
    console.log("=== Found workerTask ===");
    console.log(c.substring(Math.max(0, idx - 100), Math.min(c.length, idx + 400)));
    idx += target.length;
}
