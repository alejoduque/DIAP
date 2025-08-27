# Parliament of All Things - SuperCollider Synthesizer

## Description
A SuperCollider synthesizer implementing ecological democracy through sound synthesis, representing the "Parliament of All Things" concept with Colombian biodiversity data.

## Features
- **5 Colombian Acoustic Species** with unique synthesis characteristics:
  - Ara macao (Scarlet Macaw) - Bright filtering
  - Atlapetes - Low-pass filtered  
  - Cecropia obtusa - High-pass filtered
  - Alouatta seniculus (Red Howler Monkey) - Notch filtered
  - Tinamus major (Great Tinamou) - Delay processed

- **Democratic Consensus Engine** - Harmonic stability based on voting consensus
- **Real-time GUI Control** - Based on sonETH architecture patterns
- **Parameter Control** - Species presence, consensus level, parliament rotation, volume
- **Democratic Voting Simulation** - Simulates ecological voting with visual feedback

## Usage
1. Load in SuperCollider:
   ```supercollider
   "parliament-synthesizer/parliament_with_gui.scd".loadRelative
   ```

2. Use the GUI controls:
   - **Start Parliament** button to begin synthesis
   - **Simulate Vote** for democratic voting simulation
   - Sliders for real-time parameter control
   - Status lights show system state

## Architecture
Built using proven sonETH patterns:
- Control bus system for real-time parameter updates
- Audio bus routing for clean mixing
- GUI update routines with proper cleanup
- Species-specific synthesis with ecological characteristics

## Colombian Biodiversity Integration
- IUCN conservation status affects voting power
- Regional representation through different species
- Ecological democracy translated to harmonic relationships
- Real Colombian species with accurate data