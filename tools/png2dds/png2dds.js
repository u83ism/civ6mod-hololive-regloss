// Convert a 32-bit RGBA PNG into an uncompressed 32bpp RGBA DDS with a full mip chain,
// matching the byte-for-byte structure of Firaxis's own shipped UI icon DDS files
// (verified against Civ6 SDK Assets pantry/Textures/CivAztec32.dds and Montezuma32.dds).
// Usage: node png2dds.js <in.png> <out.dds>
const fs = require('fs');
const { PNG } = require('pngjs');

// Box-filter downsample by exactly half (rounding down), used to build each mip level.
function halve(src, w, h) {
  const nw = Math.max(1, w >> 1);
  const nh = Math.max(1, h >> 1);
  const dst = Buffer.alloc(nw * nh * 4);
  for (let y = 0; y < nh; y++) {
    for (let x = 0; x < nw; x++) {
      const x0 = Math.min(x * 2, w - 1);
      const x1 = Math.min(x * 2 + 1, w - 1);
      const y0 = Math.min(y * 2, h - 1);
      const y1 = Math.min(y * 2 + 1, h - 1);
      for (let c = 0; c < 4; c++) {
        const sum =
          src[(y0 * w + x0) * 4 + c] +
          src[(y0 * w + x1) * 4 + c] +
          src[(y1 * w + x0) * 4 + c] +
          src[(y1 * w + x1) * 4 + c];
        dst[(y * nw + x) * 4 + c] = Math.round(sum / 4);
      }
    }
  }
  return { data: dst, w: nw, h: nh };
}

function mipCount(size) {
  let n = 1;
  let s = size;
  while (s > 1) { s = s >> 1; n++; }
  return n;
}

function convert(inPath, outPath) {
  const png = PNG.sync.read(fs.readFileSync(inPath));
  const { width, height, data } = png; // RGBA, row-major, top-down

  if (width !== height) {
    throw new Error(`${inPath}: only square icons are supported (got ${width}x${height})`);
  }

  const levels = [{ data, w: width, h: height }];
  while (levels[levels.length - 1].w > 1 || levels[levels.length - 1].h > 1) {
    const last = levels[levels.length - 1];
    levels.push(halve(last.data, last.w, last.h));
  }
  const numMips = mipCount(width);
  if (levels.length !== numMips) {
    throw new Error(`internal mip count mismatch: ${levels.length} vs expected ${numMips}`);
  }

  const pixelBytes = levels.reduce((sum, l) => sum + l.w * l.h * 4, 0);
  const headerSize = 128; // 4-byte magic + 124-byte DDS_HEADER
  const buf = Buffer.alloc(headerSize + pixelBytes);

  let o = 0;
  buf.write('DDS ', o, 'ascii'); o += 4;
  buf.writeUInt32LE(124, o); o += 4;                 // dwSize
  buf.writeUInt32LE(0x00021007, o); o += 4;          // dwFlags: CAPS|HEIGHT|WIDTH|PIXELFORMAT|MIPMAPCOUNT
  buf.writeUInt32LE(height, o); o += 4;
  buf.writeUInt32LE(width, o); o += 4;
  buf.writeUInt32LE(0, o); o += 4;                   // dwPitchOrLinearSize (unused, matches real files)
  buf.writeUInt32LE(1, o); o += 4;                   // dwDepth (Firaxis writes 1, not 0)
  buf.writeUInt32LE(numMips, o); o += 4;              // dwMipMapCount
  buf.write('FTXT', o, 'ascii');                      // dwReserved1[0]: Firaxis marker (present in real files)
  o += 4 * 11;                                        // rest of dwReserved1 left zero
  buf.writeUInt32LE(32, o); o += 4;                   // pixel format dwSize
  buf.writeUInt32LE(0x41, o); o += 4;                 // DDPF_ALPHAPIXELS|DDPF_RGB
  buf.writeUInt32LE(0, o); o += 4;                    // dwFourCC
  buf.writeUInt32LE(32, o); o += 4;                   // dwRGBBitCount
  buf.writeUInt32LE(0x000000FF, o); o += 4;           // dwRBitMask
  buf.writeUInt32LE(0x0000FF00, o); o += 4;           // dwGBitMask
  buf.writeUInt32LE(0x00FF0000, o); o += 4;           // dwBBitMask
  buf.writeUInt32LE(0xFF000000, o); o += 4;           // dwABitMask
  buf.writeUInt32LE(0x00401008, o); o += 4;           // dwCaps: COMPLEX|TEXTURE|MIPMAP
  o += 4 * 4;                                         // dwCaps2/3/4, dwReserved2, left zero

  // Pixel data is straight R,G,B,A per pixel (matches the masks above) for every mip level, largest first.
  for (const level of levels) {
    level.data.copy(buf, o);
    o += level.data.length;
  }

  fs.writeFileSync(outPath, buf);
  console.log(`${outPath}: ${width}x${height}, ${numMips} mips, ${buf.length} bytes`);
}

if (require.main === module) {
  const [, , inPath, outPath] = process.argv;
  if (!inPath || !outPath) {
    console.error('Usage: node png2dds.js <in.png> <out.dds>');
    process.exit(1);
  }
  convert(inPath, outPath);
}

module.exports = { convert, mipCount };
