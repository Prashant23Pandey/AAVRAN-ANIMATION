const fs = require('fs');
const filePath = 'assets/App3D-DwM1eiaC.js';
let code = fs.readFileSync(filePath, 'utf8');

const target = 'const introData={name:"MESSENGER",color:"#66BDE6",voice:"quest"}';
const repl = 'const introData={name:"PRASHANT",color:"#66BDE6",voice:"quest"}';

if (code.includes(target)) {
  code = code.replace(target, repl);
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Successfully replaced MESSENGER with PRASHANT in introData!');
} else {
  console.error('Target introData string not found!');
  process.exit(1);
}
