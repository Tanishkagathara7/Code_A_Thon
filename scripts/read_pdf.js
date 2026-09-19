const fs = require('fs');
const zlib = require('zlib');
const buf = fs.readFileSync('GST_Billing_System_Task (1).pdf');

// Let's find ToUnicode CMap streams
let pos = 0;
let cmaps = [];
while ((pos = buf.indexOf('/ToUnicode', pos)) !== -1) {
  let refMatch = buf.slice(pos, pos + 100).toString('latin1').match(/\/ToUnicode\s+(\d+)\s+(\d+)\s+R/);
  if (refMatch) {
    let objNum = refMatch[1];
    let objHeader = `${objNum} 0 obj`;
    let objPos = buf.indexOf(objHeader);
    if (objPos !== -1) {
      let streamPos = buf.indexOf('stream', objPos);
      let endstreamPos = buf.indexOf('endstream', streamPos);
      let s = buf.slice(streamPos + 6, endstreamPos);
      if (s[0] === 0x0d && s[1] === 0x0a) s = s.slice(2);
      else if (s[0] === 0x0a || s[0] === 0x0d) s = s.slice(1);
      try {
        let decomp = zlib.inflateSync(s).toString('utf8');
        cmaps.push(decomp);
      } catch(e){}
    }
  }
  pos += 10;
}
console.log('CMaps found:', cmaps.length);

function parseCMap(cmapStr) {
  const map = {};
  const bfrangeRegex = /(\d+)\s+beginbfrange\s*([\s\S]*?)\s*endbfrange/g;
  let m;
  while ((m = bfrangeRegex.exec(cmapStr)) !== null) {
    const lines = m[2].trim().split('\n');
    for (let line of lines) {
      line = line.trim();
      let parts = line.match(/<([0-9a-fA-F]+)>\s+<([0-9a-fA-F]+)>\s+<([0-9a-fA-F]+)>/);
      if (parts) {
        let start = parseInt(parts[1], 16);
        let end = parseInt(parts[2], 16);
        let target = parseInt(parts[3], 16);
        for (let code = start; code <= end; code++) {
          map[code.toString(16).padStart(4, '0').toLowerCase()] = String.fromCharCode(target + (code - start));
        }
      }
    }
  }
  const bfcharRegex = /(\d+)\s+beginbfchar\s*([\s\S]*?)\s*endbfchar/g;
  while ((m = bfcharRegex.exec(cmapStr)) !== null) {
    const lines = m[2].trim().split('\n');
    for (let line of lines) {
      line = line.trim();
      let parts = line.match(/<([0-9a-fA-F]+)>\s+<([0-9a-fA-F]+)>/);
      if (parts) {
        let code = parts[1].toLowerCase().padStart(4, '0');
        let target = parseInt(parts[2], 16);
        map[code] = String.fromCharCode(target);
      }
    }
  }
  return map;
}

const combinedMap = {};
for (let c of cmaps) {
  Object.assign(combinedMap, parseCMap(c));
}
console.log('Mapped characters count:', Object.keys(combinedMap).length);

// Now decode stream 4, 5, 6
for (let sIdx of [4, 5, 6]) {
  let pos = 0, count = 0;
  while ((pos = buf.indexOf('stream', pos)) !== -1) {
    if (count === sIdx) {
      let start = pos + 6;
      if (buf[start] === 0x0d && buf[start+1] === 0x0a) start += 2;
      else if (buf[start] === 0x0a || buf[start] === 0x0d) start += 1;
      let end = buf.indexOf('endstream', start);
      let decomp = zlib.inflateSync(buf.slice(start, end)).toString('utf8');
      
      // replace hex strings <0027> with chars
      let text = decomp.replace(/<([0-9a-fA-F]{4})>/g, (match, hex) => {
        return combinedMap[hex.toLowerCase()] || '?';
      });
      // remove PDF drawing commands
      let lines = text.split('\n').filter(l => l.includes('TJ') || l.includes('Tj'));
      let extracted = lines.map(l => {
        let inner = l.match(/\[(.*?)\]/);
        if (inner) {
          return inner[1].replace(/[-0-9.]+/g, '').trim();
        }
        return '';
      }).join(' ');
      console.log(`=== PAGE / STREAM ${sIdx} ===`);
      console.log(extracted.slice(0, 2000));
      break;
    }
    count++;
    pos += 6;
  }
}
