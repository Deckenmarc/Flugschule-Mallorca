#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';

const inputDir = 'src/assets/images';
const outputDir = 'src/assets/images/optimized';

async function optimizeImages() {
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    console.log('🖼️  Optimizing images...');
    
    // Optimize JPEG images
    const jpegFiles = await imagemin([`${inputDir}/*.{jpg,jpeg}`], {
      destination: outputDir,
      plugins: [
        imageminMozjpeg({
          quality: 85,
          progressive: true
        })
      ]
    });
    
    // Optimize PNG images
    const pngFiles = await imagemin([`${inputDir}/*.png`], {
      destination: outputDir,
      plugins: [
        imageminPngquant({
          quality: [0.8, 0.9]
        })
      ]
    });
    
    // Convert to WebP format
    const webpFiles = await imagemin([`${inputDir}/*.{jpg,jpeg,png}`], {
      destination: `${outputDir}/webp`,
      plugins: [
        imageminWebp({
          quality: 85,
          method: 6 // Best compression
        })
      ]
    });
    
    console.log(`✅ Optimized ${jpegFiles.length} JPEG files`);
    console.log(`✅ Optimized ${pngFiles.length} PNG files`);
    console.log(`✅ Created ${webpFiles.length} WebP files`);
    
    // Generate responsive image sizes
    await generateResponsiveImages();
    
    console.log('🎉 Image optimization complete!');
    
  } catch (error) {
    console.error('❌ Error optimizing images:', error);
    process.exit(1);
  }
}

async function generateResponsiveImages() {
  // This would typically use sharp or similar for generating different sizes
  // For now, we'll create a manifest of optimized images
  const manifest = {
    hero: {
      original: 'hero-background.jpg',
      webp: 'webp/hero-background.webp',
      sizes: ['320w', '768w', '1024w', '1920w']
    },
    aircraft: {
      'cessna-t303': {
        original: 'cessna-t303.jpg',
        webp: 'webp/cessna-t303.webp'
      },
      'socata-tb20': {
        original: 'socata-tb20.jpg',
        webp: 'webp/socata-tb20.webp'
      },
      'piper-arrow': {
        original: 'piper-arrow.jpg',
        webp: 'webp/piper-arrow.webp'
      },
      'piper-turbo': {
        original: 'piper-turbo.jpg',
        webp: 'webp/piper-turbo.webp'
      }
    },
    team: {
      'team-1': {
        original: 'team-1-min.jpg',
        webp: 'webp/team-1-min.webp'
      },
      'team-2': {
        original: 'team-2-min.jpg',
        webp: 'webp/team-2-min.webp'
      },
      'team-3': {
        original: 'team-3-min.jpg',
        webp: 'webp/team-3-min.webp'
      }
    }
  };
  
  await fs.writeFile(
    `${outputDir}/image-manifest.json`,
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('📋 Generated image manifest');
}

// Run optimization
optimizeImages();