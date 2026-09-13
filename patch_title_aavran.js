const fs = require('fs');

const filePath = 'assets/App3D-DwM1eiaC.js';
const bakPath = 'assets/App3D-DwM1eiaC.js.bak';

if (!fs.existsSync(bakPath)) {
  fs.copyFileSync(filePath, bakPath);
  console.log('Created backup of App3D-DwM1eiaC.js');
}

let code = fs.readFileSync(filePath, 'utf8');

// The replacement logic: builds 3D block letters for 'A' and 'V', and extracts 'R' and 'N' from Draco
const startStr = 'const _allG=await geometryLoader.batched("planets/present/intro/title_vertical.drc");';
const endStr = 'const e=[0,1,2,4,5,8].map(k=>_allG[k]);';

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `const _allG=await geometryLoader.batched("planets/present/intro/title_vertical.drc");
function _createLetterA() {
  const left = new BoxGeometry(1.04, 4.35, 4.275);
  left.applyMatrix4(new Matrix4().makeTranslation(-1.51, -0.505, 0));

  const right = new BoxGeometry(1.04, 4.35, 4.275);
  right.applyMatrix4(new Matrix4().makeTranslation(1.51, -0.505, 0));

  const top = new BoxGeometry(4.06, 1.01, 4.275);
  top.applyMatrix4(new Matrix4().makeTranslation(0, 2.175, 0));

  const cross = new BoxGeometry(1.98, 0.85, 4.275);
  cross.applyMatrix4(new Matrix4().makeTranslation(0, 0.05, 0));

  const merged = mergeGeometries([left, right, top, cross]);
  delete merged.attributes.uv;
  return merged;
}

function _createLetterV() {
  const mLeft = new Matrix4();
  mLeft.multiply(new Matrix4().makeTranslation(-0.76, 0.08, 0));
  mLeft.multiply(new Matrix4().makeRotationZ(0.24));
  const left = new BoxGeometry(1.04, 5.55, 4.275);
  left.applyMatrix4(mLeft);

  const mRight = new Matrix4();
  mRight.multiply(new Matrix4().makeTranslation(0.76, 0.08, 0));
  mRight.multiply(new Matrix4().makeRotationZ(-0.24));
  const right = new BoxGeometry(1.04, 5.55, 4.275);
  right.applyMatrix4(mRight);

  const bottom = new BoxGeometry(1.2, 0.95, 4.275);
  bottom.applyMatrix4(new Matrix4().makeTranslation(0, -2.2, 0));

  const merged = mergeGeometries([left, right, bottom]);
  delete merged.attributes.uv;
  return merged;
}

const _geoA = _createLetterA();
const _geoV = _createLetterV();
const _geoR = _allG[8].clone();
const _geoN = _allG[5].clone();

const e = [_geoA, _geoA.clone(), _geoV, _geoR, _geoA.clone(), _geoN];
e.forEach(g => {
  delete g.attributes.uv;
});`;

  code = code.slice(0, startIndex) + replacement + code.slice(endIndex + endStr.length);
  console.log('Successfully patched Draco loader with real 3D AAVRAN geometries.');
}

// 2. Adjust Y positions for a clean 2-line layout (Row 1: AAV at +3.45, Row 2: RAN at -3.45)
const targetY = 'h.__position.y=(Math.floor(c/3)-1)*-6.9';
const replY = 'h.__position.y=(Math.floor(c/3)===0?1:-1)*3.45';

if (code.includes(targetY)) {
  code = code.replace(targetY, replY);
  console.log('Successfully patched letter Y positions to 2 balanced lines (+3.45, -3.45).');
}

// 3. Ensure center explosion reference in playInAnimation works cleanly with 6 letters
const targetCenter = 'const o=this.objs[4].__position;';
const replCenter = 'const o=this.objs[1]?this.objs[1].__position:{x:0,y:0,z:0};';

if (code.includes(targetCenter)) {
  code = code.replace(targetCenter, replCenter);
  console.log('Successfully patched explosion center reference for 6 letters.');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('AAVRAN patch completed successfully!');
