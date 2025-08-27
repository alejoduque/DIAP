# Parliament of All Things - Control Guide

## MIDI and OSC Setup for External Control

This guide explains how to connect MIDI controllers and OSC devices to control the Parliament of All Things synthesizer in SuperCollider.

---

## Table of Contents
- [Quick Start](#quick-start)
- [MIDI Setup](#midi-setup)
- [OSC Control](#osc-control)
- [Control Mapping](#control-mapping)
- [External Software Integration](#external-software-integration)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

1. **Load the Parliament system:**
   ```supercollider
   "parliament-synthesizer/0_parliament_loader.scd".loadRelative
   ~loadParliamentComponents.value
   ```

2. **Start the Parliament:**
   ```supercollider
   ~startParliament.value
   ```

3. **Begin external control** (choose MIDI or OSC below)

---

## MIDI Setup

### Enable MIDI in SuperCollider

```supercollider
// Initialize MIDI
MIDIClient.init;

// List available MIDI devices
MIDIClient.sources;

// Connect to your MIDI device (replace 0 with your device index)
MIDIIn.connectAll;
```

### MIDI Control Mapping

The Parliament system uses these MIDI CC mappings:

| Parameter | CC Number | Range | Function |
|-----------|-----------|-------|----------|
| **Global Controls** |
| Master Volume | CC 7 | 0-127 | Overall synthesis volume |
| Consensus Level | CC 1 | 0-127 | Democratic consensus strength |
| Parliament Rotation | CC 2 | 0-127 | Rotation speed (0.1x - 2.0x) |
| **Species Controls** |
| Species Presence | CC 10 | 0-127 | Acoustic species activity level |
| Species Activity | CC 11 | 0-127 | Granular synthesis intensity |
| **eDNA Controls** |
| eDNA Validation | CC 20 | 0-127 | Genetic validation strength |
| eDNA Biodiversity | CC 21 | 0-127 | Harmonic complexity |
| **Fungi Controls** |
| Chemical Signals | CC 30 | 0-127 | Chemical communication intensity |
| Network Connectivity | CC 31 | 0-127 | Inter-network communication |
| **AI Controls** |
| AI Consciousness | CC 40 | 0-127 | Consciousness wave modulation |
| AI Optimization | CC 41 | 0-127 | Algorithmic complexity |

### MIDI Implementation Example

```supercollider
// MIDI responder for Master Volume (CC 7)
MIDIdef.cc(\parliamentVolume, { |val, num, chan, src|
    var mappedVal = val / 127.0;
    ~parliament.controlBuses.masterVolume.set(mappedVal);
    ("MIDI: Master Volume = " ++ (mappedVal * 100).round(1) ++ "%").postln;
}, 7);

// MIDI responder for Consensus Level (CC 1) 
MIDIdef.cc(\parliamentConsensus, { |val, num, chan, src|
    var mappedVal = val / 127.0;
    ~parliament.controlBuses.consensusLevel.set(mappedVal);
    ("MIDI: Consensus Level = " ++ (mappedVal * 100).round(1) ++ "%").postln;
}, 1);

// MIDI responder for Species Presence (CC 10)
MIDIdef.cc(\speciesPresence, { |val, num, chan, src|
    var mappedVal = val / 127.0;
    ~parliament.controlBuses.acousticPresence.set(mappedVal);
    ("MIDI: Species Presence = " ++ (mappedVal * 100).round(1) ++ "%").postln;
}, 10);

// MIDI trigger for Democratic Vote (Note C4 = 60)
MIDIdef.noteOn(\parliamentVote, { |val, num, chan, src|
    ~simulateVote.value;
    "MIDI: Democratic vote triggered!".postln;
}, 60);

// MIDI trigger for Emergency Response (Note C#4 = 61)
MIDIdef.noteOn(\emergencyResponse, { |val, num, chan, src|
    var threatLevel = val / 127.0;
    ~triggerEmergencyResponse.value(threatLevel);
    ("MIDI: Emergency response triggered! Level: " ++ (threatLevel * 100).round(1) ++ "%").postln;
}, 61);
```

---

## OSC Control

### OSC Network Configuration

The Parliament system automatically starts OSC communication on port **57120**.

```supercollider
// Check OSC status
~parliament.osc.port; // Should show 57120

// Test OSC communication
~testParliamentOSC.value;
```

### OSC Message Reference

#### Global Parliament Controls
- `/parliament/consensus <float>` - Set consensus level (0.0 - 1.0)
- `/parliament/rotation <float>` - Set rotation speed (0.1 - 2.0)  
- `/parliament/volume <float>` - Set master volume (0.0 - 1.0)
- `/parliament/start` - Start Parliament synthesis
- `/parliament/stop` - Stop Parliament synthesis
- `/parliament/vote` - Trigger democratic vote simulation
- `/parliament/emergency <float>` - Emergency response (0.0 - 1.0)

#### Acoustic Species Controls (5 species: 0-4)
- `/agents/species/presence <int> <float>` - Species presence (species_id, 0.0-1.0)
- `/agents/species/activity <int> <float>` - Species activity (species_id, 0.0-1.0)

#### eDNA Site Controls (8 sites: 0-7)
- `/agents/edna/biodiversity <int> <float>` - Biodiversity level (site_id, 0.0-1.0)
- `/agents/edna/validation <int> <float>` - Validation strength (site_id, 0.0-1.0)

#### Fungi Network Controls (4 networks: 0-3)
- `/agents/fungi/chemical <int> <float>` - Chemical signals (node_id, 0.0-1.0)
- `/agents/fungi/connectivity <int> <float>` - Network connectivity (node_id, 0.0-1.0)

#### AI Core Controls
- `/agents/ai/consciousness <float>` - Consciousness level (0.0-1.0)
- `/agents/ai/optimization <int>` - Optimization rate (0-127)

### OSC Examples

#### Using TouchOSC or similar apps:
```
// Set 75% consensus
/parliament/consensus 0.75

// Boost Ara macao (species 0) presence to 90%
/agents/species/presence 0 0.9

// Set Chocó eDNA site (site 0) to 95% biodiversity
/agents/edna/biodiversity 0 0.95

// Trigger emergency response at 80% threat level
/parliament/emergency 0.8
```

#### Using Max/MSP:
```
udpsend 127.0.0.1 57120
/parliament/consensus 0.6

udpsend 127.0.0.1 57120  
/agents/species/presence 0 0.8
```

#### Using Python (python-osc):
```python
from pythonosc import udp_client

# Connect to Parliament
client = udp_client.SimpleUDPClient("127.0.0.1", 57120)

# Control consensus level
client.send_message("/parliament/consensus", 0.7)

# Control species presence  
client.send_message("/agents/species/presence", [0, 0.9])  # Ara macao

# Trigger democratic vote
client.send_message("/parliament/vote", 1)
```

---

## Control Mapping

### Colombian Species Mapping
| Index | Species Name | IUCN Status | Voting Power | Synthesis Character |
|-------|--------------|-------------|--------------|-------------------|
| 0 | Ara macao (Scarlet Macaw) | CR | 8 votes | Bright filtered |
| 1 | Atlapetes blancae | VU | 5 votes | Low-pass filtered |
| 2 | Cecropia obtusa | LC | 3 votes | High-pass filtered |
| 3 | Alouatta seniculus (Red Howler) | VU | 6 votes | Notch filtered |
| 4 | Tinamus major (Great Tinamou) | LC | 4 votes | Delay processed |

### eDNA Site Mapping
| Index | Region | Biodiversity | Validation | Character |
|-------|--------|--------------|------------|-----------|
| 0 | Chocó Biogeographic | 95% | 88% | Genetic harmonics |
| 1 | Amazon Basin | 92% | 85% | Mutation patterns |
| 2 | Eastern Cordillera | 87% | 90% | Validation pulses |
| 3 | Caribbean Coast | 78% | 82% | Coastal genetics |
| 4 | Orinoquía Plains | 83% | 87% | Plains evolution |
| 5 | Pacific Coast | 89% | 84% | Pacific diversity |
| 6 | Magdalena Valley | 76% | 79% | Valley sampling |
| 7 | Guayana Shield | 91% | 86% | Shield genetics |

### Fungi Network Mapping
| Index | Network Name | Coverage | Connectivity | Character |
|-------|--------------|----------|--------------|-----------|
| 0 | Northern Mycorrhizal | 25 km² | 80% | Chemical drones |
| 1 | Central Spore Network | 30 km² | 90% | Network pulses |
| 2 | Southern Fungal Web | 20 km² | 70% | Web signals |
| 3 | Coastal Decomposer Grid | 15 km² | 60% | Grid communication |

---

## External Software Integration

### Ableton Live Integration
1. **Setup**: Enable OSC in Live preferences
2. **Control Surface**: Use OSC control surface scripts  
3. **Example**: Map Live clips to Parliament agents
   ```
   Clip 1 → /agents/species/presence 0 0.8
   Clip 2 → /agents/edna/biodiversity 0 0.9
   ```

### Max/MSP Integration
```maxpat
// Max patch example
[udpsend 127.0.0.1 57120]
|
[/parliament/consensus $1]
|
[prepend send]
```

### TouchOSC Layout
Create custom layouts with:
- **Faders**: Map to species presence, consensus level
- **XY Pads**: Control multiple parameters simultaneously
- **Buttons**: Trigger votes, emergency responses
- **Labels**: Show agent names and current values

### Arduino/Hardware Integration
```arduino
// Arduino OSC example (using OSC library)
void sendParliamentData() {
  OSCMessage msg("/agents/species/presence");
  msg.add(0);  // Species ID
  msg.add(analogRead(A0) / 1023.0);  // Sensor value
  Udp.beginPacket(parliamentIP, 57120);
  msg.send(Udp);
  Udp.endPacket();
}
```

---

## Troubleshooting

### MIDI Issues
```supercollider
// Check MIDI connections
MIDIClient.sources;

// Restart MIDI if needed
MIDIClient.restart;

// Clear MIDI definitions
MIDIdef.freeAll;
```

### OSC Issues
```supercollider
// Check OSC port
NetAddr.langPort; // Should show 57120

// Test OSC reception
OSCdef.trace(true);  // Enable OSC tracing
OSCdef.trace(false); // Disable when done

// Clear OSC definitions
OSCdef.freeAll;
```

### Common Problems
1. **No sound**: Ensure Parliament is started with `~startParliament.value`
2. **MIDI not responding**: Check device connection and CC numbers
3. **OSC not working**: Verify IP address (127.0.0.1) and port (57120)
4. **Values not changing**: Check parameter ranges (0.0-1.0 for most controls)

### Debug Commands
```supercollider
// Check Parliament status
~reportParliamentStatus.value;

// Check control bus values
~parliament.controlBuses.consensusLevel.getSynchronous;
~parliament.controlBuses.masterVolume.getSynchronous;

// Test OSC manually
~parliament.osc.netAddr.sendMsg('/parliament/consensus', 0.8);
```

---

## Advanced Usage

### Custom Control Mappings
```supercollider
// Create custom MIDI mapping
MIDIdef.cc(\customControl, { |val, num, chan, src|
    // Your custom logic here
    var species = val.linlin(0, 127, 0, 4).round;
    var presence = 1.0.rand;
    ~parliament.osc.netAddr.sendMsg('/agents/species/presence', species, presence);
}, yourCCNumber);
```

### Automated Sequences
```supercollider
// Create automated control sequence
Routine({
    loop {
        // Simulate ecosystem changes
        8.do { |i|
            var biodiversity = sin(Main.elapsedTime * 0.1 + i) * 0.1 + 0.8;
            ~parliament.osc.netAddr.sendMsg('/agents/edna/biodiversity', i, biodiversity);
        };
        1.wait;
    };
}).play;
```

---

## Integration Examples

### Climate Data Integration
Connect real environmental sensors to Parliament parameters:
- **Temperature** → Species presence
- **Humidity** → eDNA validation  
- **CO₂ levels** → Emergency response triggers
- **Soil pH** → Fungi chemical signals

### Social Media Integration
Use sentiment analysis from environmental discussions:
- **Positive sentiment** → Increase consensus
- **Urgency keywords** → Trigger emergency responses
- **Species mentions** → Boost specific agent presence

---

*Parliament of All Things - Ecological Democracy Through Sound*

*For support and updates: [GitHub Repository](https://github.com/alejoduque/DApp/tree/master/parliament-synthesizer)*