#!/usr/bin/env node

/**
 * Console Error Checker
 * Runs a headless browser test to detect console errors and warnings
 * Usage: node scripts/check-console-errors.js
 */

const puppeteer = require('puppeteer');

const TEST_URL = process.env.TEST_URL || 'http://localhost:8080';
const TIMEOUT = 30000;

async function checkConsoleErrors() {
  let browser;
  const errors = [];
  const warnings = [];

  try {
    console.log(`🚀 Launching browser to test: ${TEST_URL}`);
    
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Listen for console messages
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        errors.push(text);
      } else if (type === 'warning') {
        warnings.push(text);
      }
    });

    // Listen for page errors
    page.on('pageerror', (error) => {
      errors.push(`Page Error: ${error.message}`);
    });

    // Navigate to the page
    await page.goto(TEST_URL, {
      waitUntil: 'networkidle2',
      timeout: TIMEOUT
    });

    // Wait for first meaningful paint
    await page.waitForTimeout(2000);

    console.log('\n📊 Test Results:');
    console.log('================');
    
    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ No console errors or warnings detected!');
      process.exit(0);
    }

    if (errors.length > 0) {
      console.log(`\n❌ Found ${errors.length} error(s):`);
      errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    if (warnings.length > 0) {
      console.log(`\n⚠️  Found ${warnings.length} warning(s):`);
      warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
    }

    // Fail if there are errors
    if (errors.length > 0) {
      console.log('\n❌ Test failed due to console errors');
      process.exit(1);
    }

    console.log('\n✅ Test passed (warnings are informational only)');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
checkConsoleErrors();
