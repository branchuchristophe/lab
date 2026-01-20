#!/bin/bash
# Ralph: Autonomous AI Coding Loop
# Runs Claude Code repeatedly until all tasks complete
#
# Usage: ./ralph.sh [max_iterations]
# Default: 10 iterations
#
# Prerequisites:
# - Claude Code CLI installed
# - prd.json populated with user stories
# - progress.txt initialized with codebase patterns

set -e

MAX_ITERATIONS=${1:-10}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Ralph${NC}"
echo "Max iterations: $MAX_ITERATIONS"
echo "Working directory: $SCRIPT_DIR"
echo ""

# Verify required files exist
if [ ! -f "$SCRIPT_DIR/prd.json" ]; then
    echo -e "${RED}Error: prd.json not found${NC}"
    exit 1
fi

if [ ! -f "$SCRIPT_DIR/prompt.md" ]; then
    echo -e "${RED}Error: prompt.md not found${NC}"
    exit 1
fi

for i in $(seq 1 $MAX_ITERATIONS); do
    echo -e "${YELLOW}═══════════════════════════════════════${NC}"
    echo -e "${YELLOW}═══ Iteration $i of $MAX_ITERATIONS ═══${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════${NC}"
    echo ""

    # Run Claude Code with the prompt
    # --dangerously-skip-permissions allows autonomous operation
    OUTPUT=$(cat "$SCRIPT_DIR/prompt.md" | \
        claude --dangerously-skip-permissions 2>&1 | \
        tee /dev/stderr) || true

    # Check for completion signal
    if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
        echo ""
        echo -e "${GREEN}═══════════════════════════════════════${NC}"
        echo -e "${GREEN}✅ All stories complete!${NC}"
        echo -e "${GREEN}═══════════════════════════════════════${NC}"
        echo ""
        echo "Review your commits: git log --oneline -10"
        echo "Check progress: cat $SCRIPT_DIR/progress.txt"
        exit 0
    fi

    # Brief pause between iterations
    sleep 2
done

echo ""
echo -e "${YELLOW}═══════════════════════════════════════${NC}"
echo -e "${YELLOW}⚠️  Max iterations reached${NC}"
echo -e "${YELLOW}═══════════════════════════════════════${NC}"
echo ""
echo "Some stories may still be incomplete."
echo "Check status: cat $SCRIPT_DIR/prd.json | jq '.userStories[] | {id, passes}'"
exit 1
