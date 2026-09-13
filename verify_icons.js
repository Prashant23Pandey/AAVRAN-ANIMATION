const fs = require('fs');
const c = fs.readFileSync('assets/App3D-DwM1eiaC.js', 'utf8');

const regex = /([a-zA-Z0-9_\-\.\/]+?\.icon)/g;
const icons = new Set();
let m;
while ((m = regex.exec(c)) !== null) {
    icons.add(m[1]);
}
console.log(`Found ${icons.size} icon references:`);
for (const ic of Array.from(icons).sort()) {
    const local = `assets/images/${ic}`;
    const exists = fs.existsSync(local);
    console.log(`${ic} -> ${exists ? 'EXISTS (' + fs.statSync(local).size + 'B)' : 'MISSING'}`);
}
