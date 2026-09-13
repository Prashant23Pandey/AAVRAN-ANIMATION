const fs = require('fs');
const file = 'assets/glyphworker-DoaYwstb.js';
let c = fs.readFileSync(file, 'utf8');

const target = 'return postMessage({error:"Buffer is empty."});';
const repl = 'return postMessage({id:t,error:"Buffer is empty."});';

if (c.includes(target)) {
    c = c.replace(target, repl);
    fs.writeFileSync(file, c, 'utf8');
    console.log('Successfully patched glyphworker error response with id!');
} else {
    console.log('Target string not found or already patched.');
}
