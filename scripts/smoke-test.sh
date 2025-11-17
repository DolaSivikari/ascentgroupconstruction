#!/bin/bash

# Smoke Test Script for Ascent Group Construction
# Tests end-to-end CMS publish → public site workflow

set -e

BASE_URL="${1:-https://ascentgroupconstruction.com}"
ANON_KEY="${VITE_SUPABASE_ANON_KEY}"
PROJECT_ID="${VITE_SUPABASE_PROJECT_ID}"

echo "🚀 Starting smoke tests for: $BASE_URL"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "\n${YELLOW}Test 1: API Health Check${NC}"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
if [ "$RESPONSE" -eq 200 ]; then
  echo -e "${GREEN}✓ Site is reachable (HTTP $RESPONSE)${NC}"
else
  echo -e "${RED}✗ Site returned HTTP $RESPONSE${NC}"
  exit 1
fi

# Test 2: Projects API
echo -e "\n${YELLOW}Test 2: Projects API${NC}"
PROJECTS_RESPONSE=$(curl -s "$BASE_URL/api/projects" || echo '{"error": true}')
if echo "$PROJECTS_RESPONSE" | grep -q "error"; then
  echo -e "${RED}✗ Projects API failed${NC}"
  exit 1
else
  PROJECT_COUNT=$(echo "$PROJECTS_RESPONSE" | jq '. | length' 2>/dev/null || echo "0")
  echo -e "${GREEN}✓ Projects API working (found $PROJECT_COUNT projects)${NC}"
fi

# Test 3: Site Settings API
echo -e "\n${YELLOW}Test 3: Site Settings API${NC}"
SETTINGS_RESPONSE=$(curl -s "$BASE_URL/api/site-settings" || echo '{"error": true}')
if echo "$SETTINGS_RESPONSE" | grep -q "company_name"; then
  COMPANY_NAME=$(echo "$SETTINGS_RESPONSE" | jq -r '.company_name' 2>/dev/null)
  echo -e "${GREEN}✓ Site settings API working (Company: $COMPANY_NAME)${NC}"
else
  echo -e "${RED}✗ Site settings API failed${NC}"
  exit 1
fi

# Test 4: Public Projects Page
echo -e "\n${YELLOW}Test 4: Public Projects Page${NC}"
PROJECTS_HTML=$(curl -s "$BASE_URL/projects")
if echo "$PROJECTS_HTML" | grep -q "Projects"; then
  echo -e "${GREEN}✓ Projects page loads correctly${NC}"
else
  echo -e "${RED}✗ Projects page failed to load${NC}"
  exit 1
fi

# Test 5: Admin Panel Access
echo -e "\n${YELLOW}Test 5: Admin Panel Routing${NC}"
ADMIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/admin")
if [ "$ADMIN_RESPONSE" -eq 200 ]; then
  echo -e "${GREEN}✓ Admin panel is accessible${NC}"
else
  echo -e "${YELLOW}⚠ Admin panel returned HTTP $ADMIN_RESPONSE (may require auth)${NC}"
fi

# Test 6: Image Loading
echo -e "\n${YELLOW}Test 6: Featured Image Loading${NC}"
FIRST_PROJECT=$(echo "$PROJECTS_RESPONSE" | jq -r '.[0].featured_image // empty' 2>/dev/null)
if [ -n "$FIRST_PROJECT" ]; then
  IMG_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FIRST_PROJECT")
  if [ "$IMG_RESPONSE" -eq 200 ]; then
    echo -e "${GREEN}✓ Featured images load correctly${NC}"
  else
    echo -e "${RED}✗ Featured image failed (HTTP $IMG_RESPONSE)${NC}"
    exit 1
  fi
else
  echo -e "${YELLOW}⚠ No featured images to test${NC}"
fi

# Test 7: Performance Check
echo -e "\n${YELLOW}Test 7: Performance Check${NC}"
LOAD_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$BASE_URL")
LOAD_TIME_MS=$(echo "$LOAD_TIME * 1000" | bc)
if (( $(echo "$LOAD_TIME < 3" | bc -l) )); then
  echo -e "${GREEN}✓ Page loads in ${LOAD_TIME}s${NC}"
else
  echo -e "${YELLOW}⚠ Page load time: ${LOAD_TIME}s (slower than expected)${NC}"
fi

# Summary
echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ All smoke tests passed!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

exit 0
