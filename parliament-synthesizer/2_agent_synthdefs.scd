// Parliament of All Things - Agent Synthesis Definitions  
// Multi-Agent Synthesis for Ecological Democracy
// Based on sonETH synthesis patterns
// Current Date: 2025-08-26

(
{
    var success = true;
    
    try {
        "Loading Parliament Agent SynthDefs...".postln;
        
        // =========== ACOUSTIC SPECIES SYNTHDEF ===========
        SynthDef(\acousticSpecies, {
            arg freq=440, amp=0.3, gate=1, species=0, presence=0.6, activity=0.5, votes=15,
                out=0, auxSend1=0, auxSend2=0,
                grainSize=0.1, grainDensity=20, filterFreq=1000, filterRes=0.3,
                spatialPos=0, evolutionRate=0.1;
            
            var env, sig, grains, filter, spatial, envCurve;
            var presenceMod, activityMod, votesPower;
            
            // Envelope based on democratic presence
            envCurve = Select.kr(species, [
                Env.adsr(0.01, 0.3, 0.7, 1.5),  // Ara macao - sustained calls
                Env.adsr(0.005, 0.2, 0.9, 0.8), // Atlapetes - quick alert calls  
                Env.adsr(0.1, 0.8, 0.4, 3.0),   // Cecropia - wind through leaves
                Env.adsr(0.02, 0.5, 0.6, 2.0),  // Alouatta - howler calls
                Env.adsr(0.01, 0.4, 0.5, 1.0)   // Tinamus - ground bird
            ]);
            
            env = EnvGen.kr(envCurve, gate, doneAction: 2);
            
            // Presence and activity modulation
            presenceMod = presence.lag(0.5);
            activityMod = LFNoise1.kr(activity * 2).range(0.3, 1.0);
            votesPower = (votes / 25).min(1.0); // Normalize to max 25 votes
            
            // Species-specific base oscillators
            sig = Select.ar(species, [
                // Ara macao - rich harmonics (macaw calls)
                Mix.fill(5, { |i| 
                    SinOsc.ar(freq * (i + 1), 0, 0.2 / (i + 1)) 
                }),
                
                // Atlapetes flaviceps - high frequency (endangered songbird)
                SinOsc.ar(freq * [1, 1.618, 2.414], 0, [0.5, 0.3, 0.2]).sum,
                
                // Cecropia - wind-like texture (tree sounds)
                WhiteNoise.ar(0.3) * SinOsc.kr([0.1, 0.15, 0.2]).sum,
                
                // Alouatta - rich low harmonics (howler monkey)
                Mix.fill(4, { |i|
                    SinOsc.ar((freq * 0.5) * (i + 1), 0, 0.3 / (i + 1))
                }),
                
                // Tinamus - percussive ground bird
                Decay.ar(Dust.ar(activityMod * 3), 0.3) * 
                SinOsc.ar(freq * [1, 0.618], 0, [0.6, 0.4]).sum
            ]);
            
            // Granular processing for natural texture
            grains = GrainIn.ar(
                2, 
                Dust.kr(grainDensity * presenceMod),
                grainSize,
                sig,
                Phasor.kr(0, evolutionRate * 0.1, -1, 1) // Slow evolution
            );
            
            sig = XFade2.ar(sig, grains, presenceMod * 2 - 1);
            
            // Filtering based on habitat characteristics
            filter = RLPF.ar(
                sig,
                filterFreq * (1 + (activityMod * 0.5)),
                filterRes + (presenceMod * 0.2)
            );
            
            // Spatial positioning in democratic space
            spatial = PanAz.ar(
                8, // 8-channel surround for spatial democracy
                filter,
                spatialPos.lag(2), // Slow spatial evolution
                1,
                2,
                0.5
            );
            
            // Apply democratic weighting (votes influence amplitude)
            sig = spatial * env * (amp * votesPower * presenceMod * activityMod);
            
            // Outputs
            Out.ar(out, sig[0..1]); // Stereo main
            Out.ar(auxSend1, sig * 0.3); // Send to reverb 
            Out.ar(auxSend2, sig * 0.1); // Send to delay
        }).add;
        
        
        // =========== eDNA SITES SYNTHDEF ===========
        SynthDef(\ednaSite, {
            arg freq=220, amp=0.2, gate=1, siteId=0, biodiversity=0.87, validation=0.92,
                out=0, auxSend1=0, auxSend2=0,
                mutationRate=0.05, harmonicCount=8, validationPhase=0;
            
            var env, sig, harmonics, mutations, validation_mod, biodiversity_mod;
            var genetic_drift, monthly_cycle;
            
            env = EnvGen.kr(Env.asr(2.0, 1.0, 3.0), gate, doneAction: 2);
            
            // Biodiversity controls harmonic complexity
            harmonicCount = (biodiversity * 12).round.max(3);
            biodiversity_mod = biodiversity.lag(10); // Slow biodiversity changes
            
            // Validation creates monthly cycles
            monthly_cycle = SinOsc.kr(1/30) * validation; // 30-second month cycle
            validation_mod = (validation + monthly_cycle).lag(5);
            
            // Genetic drift simulation
            genetic_drift = Array.fill(harmonicCount, { 
                LFNoise1.kr(mutationRate * [0.1, 0.05, 0.02].choose) 
            });
            
            // Harmonic series representing genetic diversity
            harmonics = Mix.fill(harmonicCount, { |i|
                var harmonic_freq = freq * (i + 1);
                var genetic_variation = 1 + (genetic_drift[i] * 0.1);
                var harmonic_amp = 0.8 / (i + 1); // Natural harmonic decay
                
                SinOsc.ar(
                    harmonic_freq * genetic_variation,
                    0,
                    harmonic_amp * biodiversity_mod
                )
            });
            
            // Add sampling noise (lab processing artifacts)
            sig = harmonics + (WhiteNoise.ar(0.05) * validation_mod);
            
            // Regional site filtering (each site has different spectral characteristics)
            sig = Select.ar(siteId.min(7), [
                BPF.ar(sig, 400, 0.5),  // Chocó - mid frequencies
                HPF.ar(sig, 300),       // Amazonas - full spectrum
                LPF.ar(sig, 1200),      // Caribe - coastal filtering
                BPF.ar(sig, 800, 0.3),  // Andina - mountain resonance
                BPF.ar(sig, 200, 0.8),  // Pacifica - deep ocean influence
                HPF.ar(sig, 150),       // Orinoquía - river systems
                LPF.ar(sig, 1500),      // Central - varied terrain
                BPF.ar(sig, 600, 0.4)   // Magdalena - river valley
            ]);
            
            // Apply validation-based amplitude modulation
            sig = sig * env * amp * validation_mod;
            
            // Stereo spread based on genetic diversity
            sig = [sig, DelayL.ar(sig, 0.02, biodiversity * 0.01)];
            
            Out.ar(out, sig);
            Out.ar(auxSend1, sig * 0.4); // More reverb for eDNA (lab ambience)
        }).add;
        
        
        // =========== FUNGI NETWORKS SYNTHDEF ===========
        SynthDef(\fungiNetwork, {
            arg freq=60, amp=0.3, gate=1, nodeId=0, chemical=0.5, connectivity=0.7, coverage=15,
                out=0, auxSend1=0, auxSend2=0,
                chemicalRate=0.02, networkSpread=0.3, seasonalPhase=0;
            
            var env, sig, chemical_waves, network_modulation, seasonal_mod;
            var mycelial_growth, spore_releases, root_connections;
            
            env = EnvGen.kr(Env.asr(5.0, 1.0, 8.0), gate, doneAction: 2); // Very slow envelope
            
            // Chemical signal propagation
            chemical_waves = Array.fill(4, { |i|
                SinOsc.kr(chemicalRate * (i + 1) * [0.8, 1.0, 1.2].choose) * chemical
            });
            
            // Network connectivity creates cross-modulation
            network_modulation = Mix(chemical_waves) * connectivity;
            
            // Seasonal growth patterns
            seasonal_mod = SinOsc.kr(1/120) * 0.3 + 0.7; // 2-minute seasonal cycle
            
            // Mycelial drone layers (very low frequencies)
            mycelial_growth = Mix.fill(3, { |i|
                SinOsc.ar(
                    freq * (i + 1) * (1 + (network_modulation * 0.1)),
                    0,
                    0.4 / (i + 1)
                )
            });
            
            // Spore release events (rare percussive elements)
            spore_releases = Decay.ar(
                Dust.ar(coverage * 0.01), // Coverage determines spore frequency
                2.0
            ) * WhiteNoise.ar(0.1);
            
            // Root system connections (filtered noise)
            root_connections = BPF.ar(
                PinkNoise.ar(connectivity * 0.2),
                freq * 4 * (1 + (chemical * 0.5)),
                0.1
            );
            
            sig = mycelial_growth + spore_releases + root_connections;
            
            // Chemical signal filtering
            sig = RLPF.ar(
                sig,
                freq * 8 * (1 + chemical),
                0.3 + (connectivity * 0.2)
            );
            
            // Slow spatial movement (underground networks)
            sig = sig * env * amp * seasonal_mod;
            sig = [
                sig,
                DelayL.ar(sig, 0.1, networkSpread * 0.05) // Network delay spread
            ];
            
            Out.ar(out, sig);
            Out.ar(auxSend1, sig * 0.6); // Heavy reverb for underground ambience
            Out.ar(auxSend2, sig * 0.2); // Some delay for chemical propagation
        }).add;
        
        
        // =========== AI CORE SYNTHDEF ===========  
        SynthDef(\aiCore, {
            arg freq=200, amp=0.4, gate=1, consciousness=0.8, optimization=64, metaGov=1.0,
                out=0, auxSend1=0, auxSend2=0,
                algorithmicRate=3, complexityDepth=8, evolutionSpeed=0.1;
            
            var env, sig, consciousness_layers, optimization_pulses, meta_modulation;
            var algorithm_evolution, system_feedback, quantum_fluctuations;
            
            env = EnvGen.kr(Env.asr(0.1, 1.0, 0.5), gate, doneAction: 2); // Quick AI response
            
            // Consciousness depth determines harmonic complexity
            consciousness_layers = Mix.fill(complexityDepth.round, { |i|
                var layer_freq = freq * (i + 1) * (1 + (consciousness * 0.1));
                var layer_amp = consciousness / (i + 1);
                
                SinOsc.ar(layer_freq, 0, layer_amp * 0.1)
            });
            
            // Optimization creates rhythmic pulses
            optimization_pulses = Pulse.ar(
                freq * 0.5,
                optimization / 127, // PWM based on optimization rate
                0.3
            );
            
            // Meta-governance modulates everything
            meta_modulation = SinOsc.kr(
                algorithmicRate / 60, // 3-second consciousness cycle
                0,
                metaGov * 0.5
            );
            
            // Algorithm evolution (self-modifying synthesis)
            algorithm_evolution = LFNoise2.kr(evolutionSpeed) * consciousness;
            
            // System feedback loops
            system_feedback = CombC.ar(
                consciousness_layers,
                0.1,
                evolutionSpeed * 0.05,
                consciousness * 2
            );
            
            // Quantum fluctuations (random digital artifacts)
            quantum_fluctuations = Crackle.ar(
                1.5 + (optimization / 127),
                0.05 * consciousness
            );
            
            sig = consciousness_layers + optimization_pulses + system_feedback + quantum_fluctuations;
            
            // AI processing filtering (digital character)
            sig = MoogFF.ar(
                sig,
                freq * 4 * (1 + algorithm_evolution),
                consciousness * 2
            );
            
            // Meta-governance spatial control
            sig = sig * env * amp * (1 + meta_modulation);
            sig = [sig * (1 + meta_modulation * 0.1), sig * (1 - meta_modulation * 0.1)];
            
            Out.ar(out, sig);
            Out.ar(auxSend2, sig * 0.5); // Heavy delay for digital echoes
        }).add;
        
        
        // =========== CONSENSUS ENGINE SYNTHDEF ===========
        SynthDef(\consensusEngine, {
            arg consensusLevel=0.5, totalVotes=0, rotationSpeed=1.0,
                freq=110, amp=0.2, out=0;
            
            var consensus_harmony, rotation_mod, democratic_resolution;
            var harmonic_convergence, voting_rhythms, parliamentary_chord;
            
            // Consensus creates harmonic convergence
            consensus_harmony = Mix.fill(5, { |i|
                var interval_ratio = [1, 1.25, 1.5, 1.75, 2][i]; // Perfect intervals
                var consensus_tuning = consensusLevel.linlin(0, 1, 0.95, 1.0); // Tuning stability
                
                SinOsc.ar(
                    freq * interval_ratio * consensus_tuning,
                    0,
                    0.2 / (i + 1) * consensusLevel
                )
            });
            
            // Rotation speed affects temporal rhythm
            rotation_mod = LFSaw.kr(rotationSpeed / 60); // 2-minute base cycle
            
            // Total votes create rhythmic density
            voting_rhythms = Pulse.kr(
                totalVotes.linlin(0, 100, 0.5, 4), // Voting activity rate
                0.5,
                consensusLevel * 0.3
            );
            
            // Democratic resolution - higher consensus = more stable harmony
            democratic_resolution = consensus_harmony * (1 + (consensusLevel * 0.5));
            
            democratic_resolution = democratic_resolution * amp * voting_rhythms;
            democratic_resolution = [democratic_resolution, democratic_resolution * (1 + rotation_mod * 0.1)];
            
            Out.ar(out, democratic_resolution);
        }).add;
        
        ~parliament.status.agents = true;
        
        "Parliament Agent SynthDefs loaded successfully:".postln;
        "  - Acoustic Species (granular field recordings)".postln;  
        "  - eDNA Sites (genetic harmonic evolution)".postln;
        "  - Fungi Networks (chemical signal drones)".postln;
        "  - AI Core (algorithmic meta-composition)".postln;
        "  - Consensus Engine (democratic harmony resolution)".postln;
        
    } {
        |error|
        ~handleParliamentError.value(error, "agents");
        success = false;
    };
    
    success;
}.value;
)