// Parliament of All Things - Effect Synthesis Definitions
// Audio Processing and Mixing for Democratic Synthesis
// Current Date: 2025-08-27

(
{
    var success = true;
    
    try {
        "Loading Parliament Effect SynthDefs...".postln;
        
        // FreeVerb2 Stereo Reverb
        SynthDef(\freeverb2, {
            arg in, out=0, mix=0.3, room=0.7, damp=0.5, amp=1.0;
            var sig, wet;
            
            sig = In.ar(in, 2);
            wet = FreeVerb2.ar(sig[0], sig[1], mix, room, damp);
            
            Out.ar(out, wet * amp);
        }).add;
        
        // Simple Delay
        SynthDef(\delay1, {
            arg in, out=0, maxdelaytime=2.0, delaytime=0.3, decaytime=2.0, mul=0.2;
            var sig, delayed;
            
            sig = In.ar(in, 2);
            delayed = DelayC.ar(sig, maxdelaytime, delaytime, decaytime);
            
            Out.ar(out, delayed * mul);
        }).add;
        
        // 4-Channel Mixer
        SynthDef(\mixer, {
            arg in1, in2, in3, in4, out=0, 
                amp1=1.0, amp2=1.0, amp3=1.0, amp4=1.0, masterAmp=1.0;
            var sig1, sig2, sig3, sig4, mix;
            
            sig1 = In.ar(in1, 2) * amp1;
            sig2 = In.ar(in2, 2) * amp2;
            sig3 = In.ar(in3, 2) * amp3;
            sig4 = In.ar(in4, 2) * amp4;
            
            mix = (sig1 + sig2 + sig3 + sig4) * masterAmp;
            
            Out.ar(out, mix);
        }).add;
        
        // Master Output with Limiting
        SynthDef(\masterOut, {
            arg in, out=0, amp=1.0, limit=0.95;
            var sig;
            
            sig = In.ar(in, 2) * amp;
            sig = Limiter.ar(sig, limit, 0.01);
            
            Out.ar(out, sig);
        }).add;
        
        // Effect processor management
        ~startEffectProcessors = {
            // Reverb processor
            ~parliament.reverbProcessor = Synth(\freeverb2, [
                \in, ~parliament.audioBuses.reverb.index,
                \out, ~parliament.audioBuses.main.index,
                \mix, 0.3,
                \room, 0.7,
                \damp, 0.5
            ], addAction: \addToTail);
            
            // Delay processor
            ~parliament.delayProcessor = Synth(\delay1, [
                \in, ~parliament.audioBuses.delay.index,
                \out, ~parliament.audioBuses.main.index,
                \maxdelaytime, 2.0,
                \delaytime, 0.3,
                \decaytime, 2.0,
                \mul, 0.2
            ], addAction: \addToTail);
            
            // Main mixer
            ~parliament.mainMixer = Synth(\mixer, [
                \in1, ~parliament.audioBuses.acousticSpecies.index,
                \in2, ~parliament.audioBuses.ednaSites.index,
                \in3, ~parliament.audioBuses.fungiNetworks.index,
                \in4, ~parliament.audioBuses.aiCore.index,
                \out, ~parliament.audioBuses.main.index,
                \amp1, 0.8, \amp2, 0.6, \amp3, 0.7, \amp4, 0.5
            ], addAction: \addToTail);
            
            // Master output
            ~parliament.masterOutput = Synth(\masterOut, [
                \in, ~parliament.audioBuses.main.index,
                \out, 0,
                \amp, 0.7
            ], addAction: \addToTail);
        };
        
        ~stopEffectProcessors = {
            [~parliament.reverbProcessor, ~parliament.delayProcessor, 
             ~parliament.mainMixer, ~parliament.masterOutput].do({ |synth|
                if(synth.notNil) {
                    synth.free;
                };
            });
            
            ~parliament.reverbProcessor = nil;
            ~parliament.delayProcessor = nil;
            ~parliament.mainMixer = nil;
            ~parliament.masterOutput = nil;
        };
        
        "Effect SynthDefs loaded: FreeVerb2, Delay, Mixer, MasterOut".postln;
        
    } {
        |error|
        ~handleParliamentError.value(error, "effects");
        success = false;
    };
    
    success;
}.value;
)