#!/bin/bash
# Cursor command to check GitHub Actions CI status and fetch failure details
# Usage: @.cursor/commands/check-ci.sh

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get repository info from git remote
REPO_URL=$(git remote get-url origin 2>/dev/null || echo "")
if [ -z "$REPO_URL" ]; then
  echo -e "${RED}Error: Could not determine repository URL${NC}" >&2
  exit 1
fi

# Extract owner/repo from URL (handles both https and ssh formats)
if [[ "$REPO_URL" =~ github\.com[:/]([^/]+)/([^/]+)\.git ]]; then
  REPO_OWNER="${BASH_REMATCH[1]}"
  REPO_NAME="${BASH_REMATCH[2]%.git}"
  REPO="${REPO_OWNER}/${REPO_NAME}"
else
  echo -e "${RED}Error: Could not parse repository from URL: $REPO_URL${NC}" >&2
  exit 1
fi

WORKFLOW_FILE="ci.yml"

echo -e "${BLUE}=== GitHub Actions CI Status Check ===${NC}"
echo -e "Repository: ${REPO}"
echo -e "Workflow: ${WORKFLOW_FILE}"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
  echo -e "${RED}Error: GitHub CLI (gh) is not installed${NC}" >&2
  echo "Install it with: brew install gh" >&2
  exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
  echo -e "${YELLOW}Warning: Not authenticated with GitHub CLI${NC}" >&2
  echo "Run: gh auth login" >&2
  exit 1
fi

# Fetch latest workflow runs
echo -e "${BLUE}Fetching latest workflow runs...${NC}"
RUNS=$(gh run list --repo "$REPO" --workflow="$WORKFLOW_FILE" --limit 5 --json databaseId,conclusion,status,name,headBranch,createdAt,displayTitle 2>/dev/null)

if [ -z "$RUNS" ] || [ "$RUNS" == "[]" ]; then
  echo -e "${YELLOW}No workflow runs found${NC}"
  exit 0
fi

# Parse runs and display status
echo ""
echo -e "${BLUE}Recent Workflow Runs:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

FAILED_RUNS=()
FAILED_RUN_IDS=()

while IFS= read -r run; do
  RUN_ID=$(echo "$run" | jq -r '.databaseId // empty')
  CONCLUSION=$(echo "$run" | jq -r '.conclusion // "unknown"')
  STATUS=$(echo "$run" | jq -r '.status // "unknown"')
  BRANCH=$(echo "$run" | jq -r '.headBranch // "unknown"')
  CREATED=$(echo "$run" | jq -r '.createdAt // ""')
  TITLE=$(echo "$run" | jq -r '.displayTitle // ""')
  
  if [ -z "$RUN_ID" ]; then
    continue
  fi
  
  # Format date
  if [ -n "$CREATED" ] && [ "$CREATED" != "null" ]; then
    CREATED_FORMATTED=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$CREATED" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || \
                       date -d "$CREATED" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || \
                       echo "$CREATED")
  else
    CREATED_FORMATTED="unknown"
  fi
  
  # Color code based on conclusion
  case "$CONCLUSION" in
    "success")
      COLOR="${GREEN}"
      ICON="✓"
      ;;
    "failure")
      COLOR="${RED}"
      ICON="✗"
      FAILED_RUNS+=("$run")
      FAILED_RUN_IDS+=("$RUN_ID")
      ;;
    "cancelled")
      COLOR="${YELLOW}"
      ICON="⊘"
      ;;
    *)
      COLOR="${YELLOW}"
      ICON="○"
      ;;
  esac
  
  echo -e "${COLOR}${ICON} Run #${RUN_ID}${NC} | ${STATUS} | ${CONCLUSION} | ${BRANCH}"
  echo -e "   Created: ${CREATED_FORMATTED}"
  if [ -n "$TITLE" ] && [ "$TITLE" != "null" ]; then
    echo -e "   Title: ${TITLE}"
  fi
  echo ""
done < <(echo "$RUNS" | jq -c '.[]')

# If there are failed runs, fetch detailed logs
if [ ${#FAILED_RUNS[@]} -gt 0 ]; then
  echo ""
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${RED}⚠️  FAILURES DETECTED${NC}"
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  
  for i in "${!FAILED_RUN_IDS[@]}"; do
    RUN_ID="${FAILED_RUN_IDS[$i]}"
    RUN_DATA="${FAILED_RUNS[$i]}"
    
    BRANCH=$(echo "$RUN_DATA" | jq -r '.headBranch // "unknown"')
    CREATED=$(echo "$RUN_DATA" | jq -r '.createdAt // ""')
    
    echo -e "${RED}📋 Failed Run #${RUN_ID} (Branch: ${BRANCH})${NC}"
    echo ""
    
    # Get job details for this run
    echo -e "${BLUE}Fetching job details...${NC}"
    JOBS=$(gh run view "$RUN_ID" --repo "$REPO" --json jobs --jq '.jobs[] | select(.conclusion=="failure")' 2>/dev/null || echo "[]")
    
    if [ -n "$JOBS" ] && [ "$JOBS" != "[]" ]; then
      while IFS= read -r job; do
        JOB_NAME=$(echo "$job" | jq -r '.name // "unknown"')
        JOB_ID=$(echo "$job" | jq -r '.databaseId // empty')
        
        echo -e "${RED}  Failed Job: ${JOB_NAME} (ID: ${JOB_ID})${NC}"
        
        # Fetch logs for this job
        echo -e "${BLUE}  Fetching logs...${NC}"
        LOGS=$(gh run view "$RUN_ID" --repo "$REPO" --log --job "$JOB_ID" 2>/dev/null || echo "")
        
        if [ -n "$LOGS" ]; then
          echo ""
          echo -e "${YELLOW}  ── Job Logs ──${NC}"
          echo "$LOGS" | head -200  # Limit output to last 200 lines
          if [ $(echo "$LOGS" | wc -l) -gt 200 ]; then
            echo -e "${YELLOW}  ... (truncated, showing last 200 lines)${NC}"
          fi
          echo ""
        fi
      done < <(echo "$JOBS" | jq -c '.')
    else
      # Fallback: get all logs for the run
      echo -e "${BLUE}Fetching run logs...${NC}"
      LOGS=$(gh run view "$RUN_ID" --repo "$REPO" --log 2>/dev/null || echo "")
      
      if [ -n "$LOGS" ]; then
        echo ""
        echo -e "${YELLOW}── Run Logs ──${NC}"
        # Extract error sections
        echo "$LOGS" | grep -A 20 -i "error\|fail\|failed\|✗" | head -300
        echo ""
        echo -e "${YELLOW}... (showing error-related lines, use 'gh run view ${RUN_ID} --log' for full logs)${NC}"
        echo ""
      fi
    fi
    
    # Get workflow run URL
    RUN_URL="https://github.com/${REPO}/actions/runs/${RUN_ID}"
    echo -e "${BLUE}View full details: ${RUN_URL}${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
  done
  
  # Summary
  echo ""
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${RED}Summary: ${#FAILED_RUNS[@]} failed run(s) found${NC}"
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "${YELLOW}The agent should now analyze these failures and fix the issues.${NC}"
  
  exit 1
else
  echo ""
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}✓ All recent workflow runs are passing${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  exit 0
fi
