#!/bin/bash

# Function to show progress bar
show_progress() {
    local current=$1
    local total=$2
    local width=50
    local percentage=$((current * 100 / total))
    local completed=$((current * width / total))
    local remaining=$((width - completed))
    
    printf "\r["
    printf "%*s" $completed | tr ' ' '█'
    printf "%*s" $remaining | tr ' ' '░'
    printf "] %d%% (%d/%d)" $percentage $current $total
}

# Function to show step progress
show_step() {
    local step=$1
    local total_steps=$2
    local description=$3
    echo ""
    echo "Step $step/$total_steps: $description"
    show_progress $step $total_steps
    echo ""
}

# Function to get optimal dimensions maintaining aspect ratio
get_optimal_dimensions() {
    local input_file=$1
    local max_width=1280
    local max_height=720
    
    # Get original dimensions
    local width=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=width -of csv=s=x:p=0 "$input_file" 2>/dev/null)
    local height=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=height -of csv=s=x:p=0 "$input_file" 2>/dev/null)
    
    if [ -z "$width" ] || [ -z "$height" ]; then
        echo "Error: Could not determine video dimensions" >&2
        return 1
    fi
    
    # Calculate aspect ratio
    local aspect_ratio=$(echo "scale=6; $width / $height" | bc -l)
    local max_aspect_ratio=$(echo "scale=6; $max_width / $max_height" | bc -l)
    
    # Determine optimal dimensions while maintaining aspect ratio
    if (( $(echo "$aspect_ratio > $max_aspect_ratio" | bc -l) )); then
        # Width is the limiting factor
        local new_width=$max_width
        local new_height=$(echo "scale=0; $max_width / $aspect_ratio" | bc -l | cut -d. -f1)
    else
        # Height is the limiting factor
        local new_height=$max_height
        local new_width=$(echo "scale=0; $max_height * $aspect_ratio" | bc -l | cut -d. -f1)
    fi
    
    # Ensure dimensions are even numbers (required by some codecs)
    new_width=$(( (new_width + 1) / 2 * 2 ))
    new_height=$(( (new_height + 1) / 2 * 2 ))
    
    echo "${new_width}x${new_height}"
    echo "Original: ${width}x${height} → Optimized: ${new_width}x${new_height} (aspect ratio preserved)" >&2
}

# Check if any arguments provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 video_file [video_file2 ...]"
    echo ""
    echo "Options (set as environment variables):"
    echo "  DITHER_MODE - Dithering algorithm: none, bayer, floyd_steinberg, sierra2_4a (default: bayer)"
    echo "  BAYER_SCALE - Bayer dithering scale 0-5 (default: 2, lower = smaller file)"
    echo "  MAX_COLORS  - Color palette size 8-256 (default: 128, lower = smaller file)"
    echo "  TARGET_FPS  - Frame rate for output (default: 15)"
    echo ""
    echo "Examples:"
    echo "  $0 video.mp4                                    # Default settings"
    echo "  DITHER_MODE=floyd_steinberg $0 video.mp4        # High quality dithering"
    echo "  MAX_COLORS=64 BAYER_SCALE=1 $0 video.mp4        # Smaller file size"
    exit 1
fi

# Configuration with defaults
DITHER_MODE=${DITHER_MODE:-"bayer"}
BAYER_SCALE=${BAYER_SCALE:-2}
MAX_COLORS=${MAX_COLORS:-128}
TARGET_FPS=${TARGET_FPS:-15}

# Check if user provided any custom settings
using_defaults=true
if [ "${DITHER_MODE}" != "bayer" ] || [ "${BAYER_SCALE}" != "2" ] || [ "${MAX_COLORS}" != "128" ] || [ "${TARGET_FPS}" != "15" ]; then
    using_defaults=false
fi

echo "Configuration:"
echo "  Dither mode: $DITHER_MODE"
echo "  Bayer scale: $BAYER_SCALE"
echo "  Max colors: $MAX_COLORS"
echo "  Target FPS: $TARGET_FPS"

if $using_defaults; then
    echo ""
    echo "💡 Using default settings. To customize output:"
    echo "   • For smaller files: MAX_COLORS=64 BAYER_SCALE=1 $0 [files...]"
    echo "   • For higher quality: DITHER_MODE=floyd_steinberg MAX_COLORS=256 $0 [files...]"
    echo "   • For minimal size: DITHER_MODE=none MAX_COLORS=32 $0 [files...]"
    echo "   • Custom framerate: TARGET_FPS=10 $0 [files...]"
    echo ""
    echo "   Run '$0' without arguments to see all options."
fi
echo ""

# Check for required tools
if ! command -v ffprobe >/dev/null 2>&1; then
    echo "❌ Error: ffprobe not found. Please install ffmpeg."
    exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
    echo "❌ Error: ffmpeg not found. Please install ffmpeg."
    exit 1
fi

if ! command -v bc >/dev/null 2>&1; then
    echo "❌ Error: bc not found. Please install bc (basic calculator)."
    exit 1
fi

for f in "$@"
do
    # Check if file exists
    if [ ! -f "$f" ]; then
        echo "Error: File '$f' not found"
        continue
    fi

    echo "Processing: $f"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    dir="$(dirname "$f")"
    name="$(basename "$f")"

    cd "$dir" || exit 1

    show_step 1 4 "Getting video properties and calculating dimensions"
    
    # Get original framerate
    original_fps=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=r_frame_rate -of csv=s=x:p=0 "$f" 2>/dev/null)
    if [ -z "$original_fps" ]; then
        echo "❌ Error: Could not determine video framerate"
        continue
    fi

    # Convert fraction to decimal if needed
    if [[ $original_fps == *"/"* ]]; then
        fps_decimal=$(echo "$original_fps" | awk -F'/' '{printf "%.2f", $1/$2}')
    else
        fps_decimal=$original_fps
    fi

    echo "✓ Original framerate: $original_fps fps ($fps_decimal fps)"

    # Get optimal dimensions maintaining aspect ratio
    optimal_dimensions=$(get_optimal_dimensions "$f")
    if [ $? -ne 0 ]; then
        echo "❌ Error: Could not calculate optimal dimensions"
        continue
    fi

    echo "✓ Dimensions: $optimal_dimensions"

    show_step 2 4 "Generating optimized color palette"
    
    # Create temp directory for intermediate files
    mkdir -p .temp

    # Get video duration for progress estimation
    duration=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$f" 2>/dev/null)
    if [ -n "$duration" ]; then
        duration_int=$(echo "$duration" | cut -d'.' -f1)
        echo "Video duration: ${duration_int}s"
    fi
    
    echo "Generating color palette with $MAX_COLORS colors... (step 1 of 2)"
    
    # Generate palette with specified color count and optimizations
    if ffmpeg -i "$f" \
        -vf "fps=5,scale=$optimal_dimensions:flags=lanczos,palettegen=max_colors=$MAX_COLORS:stats_mode=diff" \
        -y .temp/palette.png 2>&1 | while IFS= read -r line; do
            if [[ $line == *"time="* ]]; then
                echo -n "."
            fi
        done; then
        echo ""
        echo "✓ Generated optimized color palette ($MAX_COLORS colors)"
    else
        echo ""
        echo "❌ Error: Failed to generate color palette"
        rm -rf .temp
        continue
    fi

    show_step 3 4 "Creating GIF with optimized settings"
    
    echo "Converting to GIF with $DITHER_MODE dithering... (step 2 of 2)"
    echo "Using $TARGET_FPS fps for GIF"
    
    # Build dithering parameters based on mode
    case $DITHER_MODE in
        "none")
            dither_params="dither=none"
            ;;
        "floyd_steinberg")
            dither_params="dither=floyd_steinberg"
            ;;
        "sierra2_4a")
            dither_params="dither=sierra2_4a"
            ;;
        "bayer"|*)
            dither_params="dither=bayer:bayer_scale=$BAYER_SCALE"
            ;;
    esac
    
    if ffmpeg -i "$f" -i .temp/palette.png \
        -lavfi "fps=$TARGET_FPS,scale=$optimal_dimensions:flags=lanczos[x];[x][1:v]paletteuse=$dither_params:diff_mode=rectangle" \
        -y .temp/temp.gif 2>&1 | while IFS= read -r line; do
            if [[ $line == *"time="* ]]; then
                # Extract time from ffmpeg output
                current_time=$(echo "$line" | grep -o 'time=[0-9:]*\.[0-9]*' | cut -d'=' -f2)
                if [ -n "$current_time" ] && [ -n "$duration" ]; then
                    # Convert time to seconds
                    current_seconds=$(echo "$current_time" | awk -F: '{print ($1 * 3600) + ($2 * 60) + $3}')
                    progress=$(echo "$current_seconds $duration" | awk '{printf "%.0f", ($1/$2)*100}')
                    if [ "$progress" -le 100 ]; then
                        printf "\rProgress: %d%%" "$progress"
                    fi
                fi
            fi
        done; then
        echo ""
        echo "✓ Created optimized GIF with $DITHER_MODE dithering"
    else
        echo ""
        echo "❌ Error: Failed to create GIF"
        rm -rf .temp
        continue
    fi

    show_step 4 4 "Final optimization and cleanup"
    
    # Final optimization with gifsicle if available
    if command -v gifsicle >/dev/null 2>&1; then
        echo "Applying final optimization with gifsicle..."
        if gifsicle -O3 --colors $MAX_COLORS .temp/temp.gif > "${name%.*}.gif"; then
            echo "✅ Successfully created optimized GIF: ${name%.*}.gif"
        else
            echo "⚠️  Gifsicle optimization failed, using standard version"
            cp .temp/temp.gif "${name%.*}.gif"
        fi
    else
        echo "⚠️  Gifsicle not found, using standard version (install gifsicle for better optimization)"
        cp .temp/temp.gif "${name%.*}.gif"
    fi
    
    # Show file info
    if [ -f "${name%.*}.gif" ]; then
        gif_size=$(ls -lh "${name%.*}.gif" | awk '{print $5}')
        original_size=$(ls -lh "$f" | awk '{print $5}')
        echo "📁 Original size: $original_size → GIF size: $gif_size"
        echo "📺 Resolution: $optimal_dimensions (aspect ratio preserved)"
        echo "🎨 Dithering: $DITHER_MODE (colors: $MAX_COLORS)"
        
        # Get frame count of final GIF
        if command -v identify >/dev/null 2>&1; then
            frame_count=$(identify "${name%.*}.gif" 2>/dev/null | wc -l)
            echo "🎞️  Frame count: $frame_count frames @ $TARGET_FPS fps"
        fi
        
        # Show completion bar
        echo ""
        show_progress 4 4
        echo ""
    else
        echo "❌ Error: Final GIF was not created"
    fi
    
    # Cleanup
    rm -rf .temp

    echo ""
    echo "🎉 Finished processing: $f"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

done

echo "✨ All files processed successfully! ✨"