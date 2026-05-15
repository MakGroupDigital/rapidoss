#!/usr/bin/env node

/**
 * Generate PNG icons from SVG
 * Usage: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (err) {
  console.error('❌ Error: sharp module not found');
  console.error('Install it with: npm install --save-dev sharp');
  process.exit(1);
}

const svgPath = path.join(__dirname, '../app/icon.svg');
const publicDir = path.join(__dirname, '../public');

const sizes = [192, 512];

async function generateIcons() {
  try {
    // Read SVG file
    const svgBuffer = fs.readFileSync(svgPath);
    
    console.log('🎨 Generating PNG icons from SVG...\n');
    
    for (const size of sizes) {
      const outputPath = path.join(publicDir, `icon-${size}.png`);
      
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated: public/icon-${size}.png`);
    }
    
    console.log('\n✅ All icons generated successfully!');
    console.log('\nIcons created:');
    console.log('  - public/icon-192.png (PWA, Manifest)');
    console.log('  - public/icon-512.png (PWA, Splash Screen)');
    
  } catch (err) {
    console.error('❌ Error generating icons:', err.message);
    process.exit(1);
  }
}

generateIcons();
