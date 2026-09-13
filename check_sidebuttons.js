const fs = require('fs');
const c = fs.readFileSync('assets/App3D-DwM1eiaC.js', 'utf8');

const target = 'ui/sidebuttons/';
let idx = 0;
while ((idx = c.indexOf(target, idx)) !== -1) {
    console.log("=== Found ui/sidebuttons/ ===");
    console.log(c.substring(Math.max(0, idx - 400), Math.min(c.length, idx + 300)));
    idx += target.length;
}
