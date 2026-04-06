#!/usr/bin/env node

/**
 * Script to rename font files by removing hash suffixes
 * Converts: Nohemi-Bold-BF6438cc587b5b5.ttf -> Nohemi-Bold.ttf
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fontsDir = __dirname;

// Get all files in the fonts directory
const files = fs.readdirSync(fontsDir).filter(file => {
  // Filter out non-font files and this script
  return /\.(woff|woff2|otf|ttf)$/i.test(file) && file !== 'rename-fonts.js' && file !== 'README.md';
});

if (files.length === 0) {
  console.log('No font files found in', fontsDir);
  console.log('Please copy your font files to this directory first.');
  process.exit(0);
}

console.log(`Found ${files.length} font file(s) to process:\n`);

const renamed = [];
const skipped = [];

files.forEach(file => {
  // Pattern: FontName-Weight-Hash.extension
  // We want to extract: FontName-Weight.extension
  
  // Match pattern: FontName-Weight-Hash.extension
  // Hash is typically 16 hex characters, but we'll match any sequence of hex chars
  // This regex matches: FontName-Weight-<hexadecimal-hash>.extension
  const match = file.match(/^(.+?)-([A-Za-z]+)-[A-Fa-f0-9]{8,}(\.(woff|woff2|otf|ttf))$/i);
  
  if (match) {
    // match[1] = fontName, match[2] = weight, match[3] = .extension (includes the dot)
    const [, fontName, weight, extension] = match;
    const newName = `${fontName}-${weight}${extension}`;
    const oldPath = path.join(fontsDir, file);
    const newPath = path.join(fontsDir, newName);
    
    // Check if target already exists
    if (fs.existsSync(newPath)) {
      console.log(`⚠️  Skipping ${file} -> ${newName} (target already exists)`);
      skipped.push({ old: file, new: newName });
    } else {
      try {
        fs.renameSync(oldPath, newPath);
        console.log(`✓ Renamed: ${file} -> ${newName}`);
        renamed.push({ old: file, new: newName });
      } catch (error) {
        console.error(`✗ Error renaming ${file}:`, error.message);
        skipped.push({ old: file, new: newName, error: error.message });
      }
    }
  } else {
    // File doesn't match the pattern, skip it
    console.log(`⊘ Skipping ${file} (doesn't match pattern FontName-Weight-Hash.ext)`);
    skipped.push({ old: file, new: null });
  }
});

console.log(`\n✅ Renamed ${renamed.length} file(s)`);
if (skipped.length > 0) {
  console.log(`⊘ Skipped ${skipped.length} file(s)`);
}

