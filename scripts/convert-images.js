#!/usr/bin/env node

/**
 * Batch Image Conversion Script
 * Converts all images in public/ to WebP and AVIF formats
 * 
 * Usage: node scripts/convert-images.js
 * 
 * Requirements:
 * - npm install sharp (run this first if not installed)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if sharp is available
let sharp;
try {
  sharp = (await import('sharp')).default;
  console.log('✅ Sharp library loaded successfully\n');
} catch (error) {
  console.error('❌ Sharp library not found. Please install it first:');
  console.error('   npm install sharp --save-dev\n');
  process.exit(1);
}

// Configuration
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];
const OUTPUT_FORMATS = ['webp', 'avif'];
const QUALITY = {
  webp: 85,
  avif: 75,
  jpg: 80,
};

// Statistics
let stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  totalSizeBefore: 0,
  totalSizeAfter: 0,
};

/**
 * Get all image files recursively
 */
function getImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and hidden directories
      if (!file.startsWith('.') && file !== 'node_modules') {
        getImageFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Convert image to modern formats
 */
async function convertImage(inputPath) {
  const relativePath = path.relative(PUBLIC_DIR, inputPath);
  console.log(`📸 Processing: ${relativePath}`);

  try {
    const inputStats = fs.statSync(inputPath);
    stats.totalSizeBefore += inputStats.size;

    const parsedPath = path.parse(inputPath);
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`   Dimensions: ${metadata.width}x${metadata.height}`);
    console.log(`   Size: ${(inputStats.size / 1024).toFixed(2)} KB`);

    // Strip metadata and optimize
    const optimizedImage = image.rotate(); // Auto-rotate based on EXIF

    // Convert to each format
    for (const format of OUTPUT_FORMATS) {
      const outputPath = path.join(parsedPath.dir, `${parsedPath.name}.${format}`);

      // Check if already exists
      if (fs.existsSync(outputPath)) {
        console.log(`   ⏭️  Skipping ${format.toUpperCase()} (already exists)`);
        stats.skipped++;
        continue;
      }

      // Convert
      await optimizedImage
        .clone()
        [format]({ quality: QUALITY[format] })
        .toFile(outputPath);

      const outputStats = fs.statSync(outputPath);
      stats.totalSizeAfter += outputStats.size;
      
      const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
      console.log(`   ✅ Created ${format.toUpperCase()}: ${(outputStats.size / 1024).toFixed(2)} KB (${savings}% smaller)`);
    }

    stats.processed++;
    console.log('');
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}\n`);
    stats.errors++;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting batch image conversion...\n');
  console.log(`📁 Scanning directory: ${PUBLIC_DIR}\n`);

  const imageFiles = getImageFiles(PUBLIC_DIR);
  
  console.log(`Found ${imageFiles.length} images to process\n`);
  console.log('━'.repeat(60));
  console.log('');

  for (const imagePath of imageFiles) {
    await convertImage(imagePath);
  }

  // Print summary
  console.log('━'.repeat(60));
  console.log('\n📊 CONVERSION SUMMARY\n');
  console.log(`✅ Successfully processed: ${stats.processed}`);
  console.log(`⏭️  Skipped (already exist): ${stats.skipped}`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log('');
  
  if (stats.totalSizeBefore > 0) {
    const totalSavings = ((1 - stats.totalSizeAfter / stats.totalSizeBefore) * 100).toFixed(1);
    console.log(`📦 Original size: ${(stats.totalSizeBefore / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📦 Converted size: ${(stats.totalSizeAfter / 1024 / 1024).toFixed(2)} MB`);
    console.log(`💾 Total savings: ${totalSavings}%\n`);
  }

  console.log('✨ Done!\n');
  console.log('Next steps:');
  console.log('1. Update image references in code to use WebP/AVIF formats');
  console.log('2. Use <picture> element or OptimizedImage component');
  console.log('3. Test on different browsers to ensure compatibility\n');
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
