// Parliament of All Things - Agent Synthesis Definitions
// Multi-Agent Synthesis System
// Current Date: 2025-08-27

(
{
    var success = true;
    
    try {
        "Loading Parliament Agent SynthDefs...".postln;
        
        // Acoustic Species SynthDef - Granular field recording simulation
        SynthDef(\acousticSpecies, {
            arg freq=220, amp=0.3, presence=0.6, activity=0.5, species=0,
            votes=5, spatialPos=0, out=0, auxSend1=nil, auxSend2=nil;
            
            var sig, env, grains, mod, filter;
            var masterVol = In.kr(~parliament.controlBuses.masterVolume, 1);
            var presenceControl = In.kr(~parliament.controlBuses.acousticPresence, 1);
            
            // Granular synthesis with species-specific characteristics
            env = EnvGen.kr(Env.perc(0.01, 2 + (species * 0.5)), gate: 1);
            
            // Multiple grain layers
            grains = Mix.fill(3, { |i|
                var grainFreq = freq * (1 + (i * 0.02));
                var grainAmp = LFNoise1.kr(activity + 0.1).range(0.2, 1);
                var grainMod = SinOsc.ar(grainFreq * 1.5) * (activity * 0.1) * grainFreq;
                SinOsc.ar(grainFreq + grainMod, mul: grainAmp)
            });
            
            // Species-specific filtering
            filter = switch(species,
                0, { BPF.ar(grains, freq * 2, 0.3) },      // Ara macao - bright
                1, { LPF.ar(grains, freq * 4) },           // Atlapetes - filtered
                2, { HPF.ar(grains, freq * 0.5) },         // Cecropia - high
                3, { BRF.ar(grains, freq * 1.5, 0.4) },    // Alouatta - notched
                4, { AllpassN.ar(grains, 0.2, 0.1, 2) },   // Tinamus - delayed
                { grains } // default
            );
            
            sig = filter * env * amp * presence * presenceControl * masterVol;
            
            // Spatial positioning
            sig = Pan2.ar(sig, spatialPos);
            
            Out.ar(out, sig);
            if(auxSend1.notNil) { Out.ar(auxSend1, sig * 0.3) };
            if(auxSend2.notNil) { Out.ar(auxSend2, sig * 0.2) };
        }).add;
        
        // eDNA Site SynthDef - Genetic algorithm harmonic evolution
        SynthDef(\ednaSite, {
            arg freq=55, amp=0.2, biodiversity=0.9, validation=0.88, siteId=0,
            mutationRate=0.05, harmonicCount=8, out=0, auxSend1=nil;
            
            var sig, harmonics, envelope, mutation;
            var masterVol = In.kr(~parliament.controlBuses.masterVolume, 1);
            var validationControl = In.kr(~parliament.controlBuses.ednaValidation, 1);
            
            // Genetic harmonic evolution
            harmonics = Mix.fill(8, { |i|
                var harmFreq = freq * (i + 1) * biodiversity;
                var harmAmp = validation * (1 / (i + 1).sqrt) * 0.15;
                var mutation = LFNoise1.kr(mutationRate).range(0.98, 1.02);
                SinOsc.ar(harmFreq * mutation, mul: harmAmp)
            });
            
            // Monthly validation cycle simulation
            envelope = LFTri.kr(0.125).range(0.7, 1.0); // 8 second cycle = monthly
            
            sig = harmonics * amp * envelope * validationControl * masterVol;
            
            Out.ar(out, sig ! 2);
            if(auxSend1.notNil) { Out.ar(auxSend1, sig ! 2 * 0.4) };
        }).add;
        
        // Fungi Network SynthDef - Chemical signal drone layers  
        SynthDef(\fungiNetwork, {
            arg freq=40, amp=0.3, chemical=0.7, connectivity=0.8, coverage=20,
            nodeId=0, chemicalRate=0.02, networkSpread=0.3, out=0, auxSend1=nil, auxSend2=nil;
            
            var sig, drones, chemicalMod, networkPulse;
            var masterVol = In.kr(~parliament.controlBuses.masterVolume, 1);
            var chemicalControl = In.kr(~parliament.controlBuses.fungiChemical, 1);
            
            // Chemical signal modulation
            chemicalMod = LFNoise1.kr(chemicalRate).range(0.5, 1.5);
            
            // Network pulse patterns
            networkPulse = LFPulse.kr(connectivity * 0.1 + 0.05, width: networkSpread).range(0.3, 1.0);
            
            // Drone layers with chemical modulation
            drones = Mix.fill(4, { |i|
                var droneFreq = freq * (1 + (i * 0.25)) * chemicalMod;
                var droneAmp = connectivity * (1 / (i + 1)) * 0.2;
                SinOsc.ar(droneFreq, mul: droneAmp * networkPulse)
            });
            
            sig = drones * amp * chemical * chemicalControl * masterVol;
            
            Out.ar(out, sig ! 2);
            if(auxSend1.notNil) { Out.ar(auxSend1, sig ! 2 * 0.3) };
            if(auxSend2.notNil) { Out.ar(auxSend2, sig ! 2 * 0.4) };
        }).add;
        
        // AI Core SynthDef - Algorithmic meta-composition
        SynthDef(\aiCore, {
            arg freq=200, amp=0.4, consciousness=0.8, optimization=64, metaGov=0.75,
            algorithmicRate=3, complexityDepth=8, out=0, auxSend2=nil;
            
            var sig, algorithm, consciousness_wave, optimization_seq;
            var masterVol = In.kr(~parliament.controlBuses.masterVolume, 1);
            var consciousnessControl = In.kr(~parliament.controlBuses.aiConsciousness, 1);
            var optimizationControl = In.kr(~parliament.controlBuses.aiOptimization, 1);
            
            // Consciousness wave patterns
            consciousness_wave = LFTri.kr(algorithmicRate * 0.3).range(0.5, 1.0);
            
            // Optimization sequence generation  
            optimization_seq = LFNoise0.kr(algorithmicRate).range(0, optimization);
            
            // Algorithmic composition
            algorithm = Mix.fill(6, { |i|
                var algoFreq = freq * (1 + (optimization * 0.001));
                var algoAmp = consciousness * metaGov * (1 / (i + 1).sqrt) * 0.1;
                SinOsc.ar(algoFreq * (i + 1), mul: algoAmp * consciousness_wave)
            });
            
            sig = algorithm * amp * consciousnessControl * masterVol;
            
            Out.ar(out, sig ! 2);
            if(auxSend2.notNil) { Out.ar(auxSend2, sig ! 2 * 0.5) };
        }).add;
        
        // Consensus Engine SynthDef - Democratic harmony resolution
        SynthDef(\consensusEngine, {
            arg consensusLevel=0.5, totalVotes=26, rotationSpeed=1.0, freq=110, amp=0.2, out=0;
            
            var sig, harmony, consensus_stability, rotation_mod;
            var masterVol = In.kr(~parliament.controlBuses.masterVolume, 1);
            var consensus = In.kr(~parliament.controlBuses.consensusLevel, 1);
            var rotation = In.kr(~parliament.controlBuses.rotationSpeed, 1);
            
            // Consensus stability affects harmonic content
            consensus_stability = consensus.linlin(0, 1, 0.1, 0.9);
            
            // Parliament rotation modulation
            rotation_mod = LFTri.kr(rotation * 0.008).range(0.8, 1.0);
            
            // Democratic harmony - more consensus = more stable harmonics
            harmony = Mix.fill(7, { |i|
                var harmFreq = freq * (i + 1);
                var harmStability = consensus_stability * (consensus * (i * 0.1 + 0.5));
                var harmAmp = harmStability * 0.12;
                var detune = LFNoise1.kr(0.1 * (1 - consensus)).range(-1, 1);
                SinOsc.ar(harmFreq + detune, mul: harmAmp)
            });
            
            sig = harmony * amp * rotation_mod * masterVol;
            
            Out.ar(out, sig ! 2);
        }).add;
        
        "Parliament Agent SynthDefs loaded successfully:".postln;
        "  \\acousticSpecies - Granular field recordings (5 species)".postln;
        "  \\ednaSite - Genetic harmonic evolution (8 sites)".postln;
        "  \\fungiNetwork - Chemical signal drones (4 networks)".postln;  
        "  \\aiCore - Algorithmic meta-composition (1 core)".postln;
        "  \\consensusEngine - Democratic harmony resolution".postln;
        ~parliament.status.agents = true;
        
    } {
        |error|
        ~handleParliamentError.value(error, "agent_synthdefs");
        success = false;
    };
    
    success;
}.value;
)