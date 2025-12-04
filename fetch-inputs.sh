#!/bin/bash
# Fetches Advent of Code input files and optionally creates solution templates
# Command acquired by: developer tools > network tab > request > copy > copy as cURL
# Cookies can be acquired by clicking lock icon on browser's address bar
# reads aoc-session.cookie
# ! BE AWARE THAT HISTORY CAN REMEMBER COOKIES, SO DON'T DO echo <cookie> > ...

print_help() {
    cat << EOF
Usage: $0 [OPTIONS] [DAY...]
Fetches inputs from adventofcode.com. Requires session cookie.
Cookie can be included in the aoc-session.cookie file or passed to stdin.

Options:
  -y, --year YEAR        Year of the event (default: current year)
  -d, --day DAY          Day of the event (can be specified multiple times)
  -t, --template FILE    Template file to use (can be specified multiple times, default: templates/default)
  -f, --force            Overwrite existing input files
  --no-template          Skip creating solution template
  -h, --help             Show this help message

Arguments:
  DAY...                 Additional days to fetch (can be zero-padded like 01)

Examples:
  $0                     # Fetch today's input and create template
  $0 -y 2019 1 2 3       # Fetch days 1-3 from 2019
  $0 -y 2023 -d 5        # Fetch day 5 from 2023
  $0 --no-template 1 2   # Fetch days 1-2 without creating templates
  $0 -f 1                # Force re-fetch day 1 even if it exists
  $0 -t templates/default.ts {1..25}  # Use specific template for days 1-25
  $0 -t templates/default.ts -t templates/default.kts 1 2  # Create multiple templates
EOF
    exit 0
}

# Parse command line arguments using GNU getopt
TEMP=$(getopt -o 'hfy:d:t:' --long 'help,force,year:,day:,template:,no-template' -n "$0" -- "$@")
if [ $? -ne 0 ]; then
    echo "Error parsing arguments. Use -h for help." >&2
    exit 1
fi
eval set -- "$TEMP"
unset TEMP

# Default values
YEAR=$(date +%Y)
DEFAULT_DAY=$(date +%-d)
TEMPLATES=("templates/default")
CREATE_TEMPLATE=true
FORCE_OVERWRITE=false
DAYS=()
USE_DEFAULT_DAY=true
USE_DEFAULT_TEMPLATE=true

# Process options
while true; do
    case "$1" in
        -h|--help)
            print_help
            ;;
        -f|--force)
            FORCE_OVERWRITE=true
            shift
            ;;
        -y|--year)
            YEAR="$2"
            shift 2
            ;;
        -d|--day)
            DAYS+=("$2")
            USE_DEFAULT_DAY=false
            shift 2
            ;;
        -t|--template)
            if [ "$USE_DEFAULT_TEMPLATE" = true ]; then
                TEMPLATES=()
                USE_DEFAULT_TEMPLATE=false
            fi
            TEMPLATES+=("$2")
            shift 2
            ;;
        --no-template)
            CREATE_TEMPLATE=false
            shift
            ;;
        --)
            shift
            break
            ;;
        *)
            echo "Internal error during argument parsing!" >&2
            exit 1
            ;;
    esac
done

# Collect remaining positional arguments as additional days
if [ $# -gt 0 ]; then
    DAYS+=("$@")
    USE_DEFAULT_DAY=false
fi

# If no days were specified, use today
if [ "$USE_DEFAULT_DAY" = true ]; then
    DAYS=("$DEFAULT_DAY")
fi

# Normalize year (allow shorthand like 19 for 2019)
YEAR=$(echo "$YEAR" | perl -pe 's/^(\d{2})$/20$1/')


# Read session cookie
COOKIEFILE=aoc-session.cookie
if [ -e "$COOKIEFILE" ]; then
    echo "using cookie file: $(tput setaf 3)$COOKIEFILE$(tput sgr0)" >&2
    SESSION_COOKIE=$(cat "$COOKIEFILE")
else
    echo "reading from STDIN: $COOKIEFILE" >&2
    read -rep $'Paste the value of session cookie (just the hash):\n' SESSION_COOKIE
fi

if [[ -z "$SESSION_COOKIE" ]]; then
    echo "$(tput setaf 1)Error: session cookie not specified$(tput sgr0)" >&2
    exit 1
fi

# Create directory for inputs
mkdir -p "$YEAR/IN"

# Fetch inputs for each day
for i in "${DAYS[@]}"; do
    
    DAY_PADDED=$(printf "%02d" "$i") # ensure zero-padded
    DAY_URL=$((10#$i)) # remove leading zeros
    INPUT_FILE="$YEAR/IN/$DAY_PADDED"
    
    # Skip if input already exists and force flag not set
    if [[ -f "$INPUT_FILE" && "$FORCE_OVERWRITE" == false ]]; then
        echo "Skipping year $YEAR day $DAY_URL (input already exists)"
    else
        echo -n "Fetching year $YEAR day $DAY_URL... "
        curl "https://adventofcode.com/$YEAR/day/$DAY_URL/input" \
        -b "session=$SESSION_COOKIE" \
        -H 'authority: adventofcode.com' \
        -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
        -H 'accept-language: pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7' \
        -H 'cache-control: no-cache' \
        -H 'pragma: no-cache' \
        -H "referer: https://adventofcode.com/$YEAR/day/$DAY_URL" \
        -H 'sec-ch-ua: "Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"' \
        -H 'sec-ch-ua-mobile: ?0' \
        -H 'sec-ch-ua-platform: "Linux"' \
        -H 'sec-fetch-dest: document' \
        -H 'sec-fetch-mode: navigate' \
        -H 'sec-fetch-site: same-origin' \
        -H 'sec-fetch-user: ?1' \
        -H 'upgrade-insecure-requests: 1' \
        -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36' \
        --compressed -f -o "$INPUT_FILE" \
        -w "status: %{http_code} size: %{size_download}B file: %{filename_effective} from: %{url} took: %{time_total}sec\n" \
        -sS 2>/dev/null \
        | perl -pe "s/(.*status: 200.*)/$(tput setaf 2)\$1$(tput sgr0)/" | perl -pe "s/(.*status: (?!200).*)/$(tput setaf 1)\$1$(tput sgr0)/"

        if [[ ${PIPESTATUS[0]} -ne 0 ]]; then continue; fi # skip if curl failed
    fi
    
    # Create solution templates if requested
    if [[ "$CREATE_TEMPLATE" == true ]]; then
        for TEMPLATE in "${TEMPLATES[@]}"; do
            # Resolve template path (follow symlink if needed)
            TEMPLATE_PATH="$TEMPLATE"
            if [[ -L "$TEMPLATE_PATH" && -e "$TEMPLATE_PATH" ]]; then
                TEMPLATE_PATH=$(readlink -f "$TEMPLATE_PATH")
            fi
            
            # Get file extension from template
            TEMPLATE_EXT="${TEMPLATE_PATH##*.}"
            SOLUTION="$YEAR/$DAY_PADDED.$TEMPLATE_EXT"
            
            # Only create if solution doesn't exist
            if [[ ! -f "$SOLUTION" ]]; then
                if [[ -f "$TEMPLATE_PATH" ]]; then
                    echo "program missing, creating template from $TEMPLATE..."
                    sed 's/<<<DAY>>>/'"$DAY_PADDED"'/g' "$TEMPLATE_PATH" > "$SOLUTION"
                else
                    echo "$(tput setaf 3)Warning: template file '$TEMPLATE' not found, skipping template creation$(tput sgr0)" >&2
                fi
            fi
        done
    fi
done
