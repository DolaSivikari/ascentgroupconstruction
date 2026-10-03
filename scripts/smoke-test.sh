#!/bin/bash

# Smoke Test Script for Ascent Group Construction (SPA + Supabase)
# Validates production-relevant availability and route integrity signals.

set -euo pipefail

BASE_URL="${1:-https://www.ascentgroupconstruction.com}"
BASE_URL="${BASE_URL%/}"
SUPABASE_PROJECT_ID="${VITE_SUPABASE_PROJECT_ID:-}"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "${GREEN}✓ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
fail() { echo -e "${RED}✗ $1${NC}"; exit 1; }

status_code() {
  # Follow redirects and avoid hard-exit on transient curl/network failures
  local code
  code=$(curl -L -s --connect-timeout 10 --max-time 30 --retry 2 --retry-delay 1 -o /dev/null -w "%{http_code}" "$1" 2>/dev/null || true)
  if [[ ! "$code" =~ ^[0-9]{3}$ ]]; then
    code="000"
  fi
  echo "$code"
}

echo "🚀 Starting smoke tests for: $BASE_URL"

# 1) Base availability
echo -e "\n${YELLOW}Test 1: Base URL availability${NC}"
BASE_STATUS=$(status_code "$BASE_URL")
if [ "$BASE_STATUS" = "200" ]; then
  pass "Base URL reachable (HTTP $BASE_STATUS)"
elif [[ "$BASE_STATUS" =~ ^30[1278]$ ]]; then
  pass "Base URL reachable via redirect (HTTP $BASE_STATUS)"
else
  fail "Base URL returned HTTP $BASE_STATUS"
fi

# 2) SPA route fallback health
echo -e "\n${YELLOW}Test 2: SPA route fallback health${NC}"
ROUTES=("/" "/services" "/contact" "/projects" "/admin" "/submit-rfp")
for route in "${ROUTES[@]}"; do
  CODE=$(status_code "$BASE_URL$route")
  if [ "$CODE" = "200" ]; then
    pass "Route $route served (HTTP 200)"
  else
    fail "Route $route returned HTTP $CODE"
  fi
done

# 3) Core static SEO assets
echo -e "\n${YELLOW}Test 3: Core static assets${NC}"
for asset in "/sitemap.xml" "/robots.txt"; do
  CODE=$(status_code "$BASE_URL$asset")
  if [ "$CODE" = "200" ]; then
    pass "Asset $asset served"
  else
    warn "Asset $asset returned HTTP $CODE"
  fi
done

# 4) Homepage content sanity signal
echo -e "\n${YELLOW}Test 4: Homepage sanity signal${NC}"
HOME_HTML=$(curl -L -s --connect-timeout 10 --max-time 30 "$BASE_URL")
if echo "$HOME_HTML" | grep -qi "Ascent Group Construction"; then
  pass "Homepage contains expected brand signal"
else
  warn "Homepage brand signal not found (check rendering/content)"
fi

# 5) Optional Supabase Edge Function reachability check
echo -e "\n${YELLOW}Test 5: Supabase Edge Function reachability (optional)${NC}"
if [ -n "$SUPABASE_PROJECT_ID" ]; then
  FN_URL="https://${SUPABASE_PROJECT_ID}.functions.supabase.co/submit-form"
  FN_CODE=$(curl -s --connect-timeout 10 --max-time 30 -o /dev/null -w "%{http_code}" -X OPTIONS "$FN_URL" -H "Origin: $BASE_URL" -H "Access-Control-Request-Method: POST" || true)

  # 200/204 = good CORS response, 401/403/405 can still indicate endpoint exists behind auth/method controls
  if [[ "$FN_CODE" =~ ^(200|204|401|403|405)$ ]]; then
    pass "Supabase function endpoint reachable (HTTP $FN_CODE)"
  else
    warn "Supabase function endpoint unexpected HTTP $FN_CODE ($FN_URL)"
  fi
else
  warn "VITE_SUPABASE_PROJECT_ID not set; skipped edge function reachability"
fi

# 6) Basic performance signal
echo -e "\n${YELLOW}Test 6: Response time signal${NC}"
LOAD_TIME=$(curl -L -s --connect-timeout 10 --max-time 30 -o /dev/null -w "%{time_total}" "$BASE_URL")
if awk "BEGIN { exit !($LOAD_TIME < 3.0) }"; then
  pass "Base response time acceptable (${LOAD_TIME}s)"
else
  warn "Base response time elevated (${LOAD_TIME}s)"
fi

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
pass "Smoke tests completed"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
