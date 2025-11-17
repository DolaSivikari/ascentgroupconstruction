#!/usr/bin/env node

/**
 * Cache Headers Verification Script
 * Tests if cache headers are properly configured for production deployment
 * 
 * Usage: node scripts/verify-headers.js [URL]
 * Default URL: https://ascentgroupconstruction.com
 */

const SITE_URL = process.argv[2] || 'https://ascentgroupconstruction.com';

// Test cases for different asset types
const TEST_CASES = [
  { path: '/', expectedMaxAge: 0, type: 'HTML' },
  { path: '/hero-poster-1.webp', expectedMaxAge: 604800, type: 'Image (WebP)' },
  { path: '/og-image.jpg', expectedMaxAge: 604800, type: 'Image (JPG)' },
  // Note: Can't test Vite hashed assets without knowing exact hash
  // These would typically be: /assets/index-[hash].js
];

/**
 * Fetch headers for a URL
 */
async function checkHeaders(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const headers = Object.fromEntries(response.headers.entries());
    
    return {
      success: true,
      status: response.status,
      headers,
      cacheControl: headers['cache-control'] || 'NOT SET',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Parse max-age from Cache-Control header
 */
function parseMaxAge(cacheControl) {
  const match = cacheControl.match(/max-age=(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Format seconds to human-readable duration
 */
function formatDuration(seconds) {
  if (seconds === 0) return '0 seconds (no cache)';
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${seconds} seconds`;
}

/**
 * Test a single URL
 */
async function testUrl(path, expectedMaxAge, type) {
  const url = `${SITE_URL}${path}`;
  console.log(`\n🔍 Testing: ${type}`);
  console.log(`   URL: ${url}`);
  
  const result = await checkHeaders(url);
  
  if (!result.success) {
    console.log(`   ❌ Failed to fetch: ${result.error}`);
    return { passed: false, type };
  }
  
  if (result.status !== 200) {
    console.log(`   ⚠️  Status: ${result.status} (expected 200)`);
    return { passed: false, type };
  }
  
  console.log(`   Status: ${result.status} ✅`);
  console.log(`   Cache-Control: ${result.cacheControl}`);
  
  const maxAge = parseMaxAge(result.cacheControl);
  
  if (maxAge === null && expectedMaxAge > 0) {
    console.log(`   ❌ No max-age found (expected ${formatDuration(expectedMaxAge)})`);
    return { passed: false, type };
  }
  
  if (maxAge === expectedMaxAge) {
    console.log(`   ✅ Cache duration: ${formatDuration(maxAge)} (correct)`);
    return { passed: true, type };
  } else {
    console.log(`   ⚠️  Cache duration: ${formatDuration(maxAge)} (expected ${formatDuration(expectedMaxAge)})`);
    return { passed: false, type };
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('━'.repeat(70));
  console.log('🔍 CACHE HEADERS VERIFICATION');
  console.log('━'.repeat(70));
  console.log(`\n🌐 Testing site: ${SITE_URL}`);
  console.log(`📅 Timestamp: ${new Date().toISOString()}\n`);
  
  const results = [];
  
  for (const testCase of TEST_CASES) {
    const result = await testUrl(testCase.path, testCase.expectedMaxAge, testCase.type);
    results.push(result);
  }
  
  // Summary
  console.log('\n' + '━'.repeat(70));
  console.log('📊 SUMMARY');
  console.log('━'.repeat(70));
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  console.log(`\n✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}\n`);
  
  if (passed === total) {
    console.log('🎉 All cache headers are configured correctly!\n');
  } else {
    console.log('⚠️  Some cache headers are missing or incorrect.');
    console.log('\nRecommendations:');
    console.log('1. Verify _headers file is deployed to production');
    console.log('2. Check hosting provider configuration (Netlify/Vercel)');
    console.log('3. Test with curl: curl -I [URL]');
    console.log('4. Check CDN settings if using a CDN\n');
    
    console.log('Expected _headers configuration:');
    console.log('');
    console.log('/*.webp');
    console.log('  Cache-Control: public, max-age=604800, must-revalidate');
    console.log('');
    console.log('/*.jpg');
    console.log('  Cache-Control: public, max-age=604800, must-revalidate');
    console.log('');
    console.log('/*.html');
    console.log('  Cache-Control: public, max-age=0, must-revalidate\n');
  }
  
  console.log('For manual testing, run:');
  console.log(`  curl -I ${SITE_URL}/hero-poster-1.webp\n`);
  
  process.exit(passed === total ? 0 : 1);
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
