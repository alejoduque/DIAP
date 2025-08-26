// Parliament of All Things - Main Control System
// Agent Management and Democratic Coordination
// Based on sonETH control patterns
// Current Date: 2025-08-26

(
{
    var success = true;
    
    try {
        "Loading Parliament Control System...".postln;
        
        // Agent management functions
        ~startParliament = {
            "🏛️ Starting Parliament of All Things...".postln;
            
            if(Server.default.serverRunning.not) {
                "Server not running - please load server configuration first".warn;
                ^false;
            };
            
            // Start temporal engine first
            ~startTemporalEngine.value;
            
            // Start all acoustic species agents
            ~parliament.agents.acousticSpecies.do({ |agent, i|
                var freq = [220, 330, 440, 165, 275][i]; // Species-specific base frequencies
                
                agent.synth = Synth(\acousticSpecies, [
                    \freq, freq,
                    \amp, 0.3,
                    \species, i,
                    \presence, agent.presence,
                    \activity, 0.5,
                    \votes, agent.votes,
                    \out, ~parliament.audioBuses.acousticSpecies.index,
                    \auxSend1, ~parliament.audioBuses.reverb.index,
                    \auxSend2, ~parliament.audioBuses.delay.index,
                    \spatialPos, (i / 4) * 2 - 1 // Distribute spatially
                ]);
                
                ("  ✓ " ++ agent.name ++ " active (" ++ agent.votes ++ " votes, " ++ agent.status ++ ")").postln;
            });
            
            // Start all eDNA site agents
            ~parliament.agents.ednaSites.do({ |agent, i|
                var freq = 110 + (i * 20); // Regional frequency variations
                
                agent.synth = Synth(\ednaSite, [
                    \freq, freq,
                    \amp, 0.2,
                    \siteId, i,
                    \biodiversity, agent.biodiversity,
                    \validation, agent.validation,
                    \out, ~parliament.audioBuses.ednaSites.index,
                    \auxSend1, ~parliament.audioBuses.reverb.index,
                    \mutationRate, 0.05,
                    \harmonicCount, (agent.biodiversity * 12).round.max(3)
                ]);
                
                ("  ✓ " ++ agent.name ++ " monitoring (" ++ (agent.biodiversity * 100).round(0.1) ++ "% biodiversity)").postln;
            });
            
            // Start all fungi network agents
            ~parliament.agents.fungiNetworks.do({ |agent, i|
                var freq = 40 + (i * 8); // Very low frequencies for fungi
                
                agent.synth = Synth(\fungiNetwork, [
                    \freq, freq,
                    \amp, 0.3,
                    \nodeId, i,
                    \chemical, agent.chemical,
                    \connectivity, agent.connectivity,
                    \coverage, agent.coverage,
                    \out, ~parliament.audioBuses.fungiNetworks.index,
                    \auxSend1, ~parliament.audioBuses.reverb.index,
                    \auxSend2, ~parliament.audioBuses.delay.index,
                    \chemicalRate, 0.02,
                    \networkSpread, 0.3
                ]);
                
                ("  ✓ " ++ agent.name ++ " network (" ++ agent.coverage ++ " km² coverage)").postln;
            });
            
            // Start AI Core agent
            ~parliament.agents.aiCore[0].synth = Synth(\aiCore, [
                \freq, 200,
                \amp, 0.4,
                \consciousness, ~parliament.agents.aiCore[0].consciousness,
                \optimization, ~parliament.agents.aiCore[0].optimization,
                \metaGov, ~parliament.agents.aiCore[0].metaGov,
                \out, ~parliament.audioBuses.aiCore.index,
                \auxSend2, ~parliament.audioBuses.delay.index,
                \algorithmicRate, 3,
                \complexityDepth, 8
            ]);
            
            ("  ✓ " ++ ~parliament.agents.aiCore[0].name ++ " online (" ++ 
             (~parliament.agents.aiCore[0].consciousness * 100).round(0.1) ++ "% consciousness)").postln;
            
            // Start consensus engine
            ~parliament.consensusEngine = Synth(\consensusEngine, [
                \consensusLevel, 0.5,
                \totalVotes, ~parliament.agents.acousticSpecies.collect(_.votes).sum,
                \rotationSpeed, 1.0,
                \freq, 110,
                \amp, 0.2,
                \out, ~parliament.audioBuses.main.index
            ]);
            
            "  ✓ Consensus Engine active".postln;
            
            // Start effect processors
            ~startEffectProcessors.value;
            
            // Update GUI if available
            if(~parliament.mainWindow.notNil) {
                { ~parliament.startButton.value = 1 }.defer;
            };
            
            ~parliament.status.consensus = true;
            "🏛️ Parliament of All Things is now active - " ++ ~parliament.config.agents ++ " agents participating".postln;
            true;
        };
        
        ~stopParliament = {
            "🏛️ Stopping Parliament of All Things...".postln;
            
            // Stop temporal engine
            ~stopTemporalEngine.value;
            
            // Free all agent synths
            ~parliament.agents.acousticSpecies.do({ |agent|
                if(agent.synth.notNil) {
                    agent.synth.free;
                    agent.synth = nil;
                };
            });
            
            ~parliament.agents.ednaSites.do({ |agent|
                if(agent.synth.notNil) {
                    agent.synth.free;
                    agent.synth = nil;
                };
            });
            
            ~parliament.agents.fungiNetworks.do({ |agent|
                if(agent.synth.notNil) {
                    agent.synth.free;
                    agent.synth = nil;
                };
            });
            
            if(~parliament.agents.aiCore[0].synth.notNil) {
                ~parliament.agents.aiCore[0].synth.free;
                ~parliament.agents.aiCore[0].synth = nil;
            };
            
            // Free consensus engine
            if(~parliament.consensusEngine.notNil) {
                ~parliament.consensusEngine.free;
                ~parliament.consensusEngine = nil;
            };
            
            // Stop effect processors
            ~stopEffectProcessors.value;
            
            // Update GUI if available
            if(~parliament.mainWindow.notNil) {
                { ~parliament.startButton.value = 0 }.defer;
            };
            
            ~parliament.status.consensus = false;
            "🏛️ Parliament stopped - All agents offline".postln;
            true;
        };
        
        // Effect processors
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
        
        // Parameter update functions (called from GUI and OSC)
        ~updateAgentParameter = { |agentType, param, value|
            switch(agentType,
                "Acoustic Species", {
                    ~parliament.agents.acousticSpecies.do({ |agent|
                        if(agent.synth.notNil) {
                            agent.synth.set(param, value);
                        };
                    });
                },
                "eDNA Sites", {
                    ~parliament.agents.ednaSites.do({ |agent|
                        if(agent.synth.notNil) {
                            agent.synth.set(param, value);
                        };
                    });
                },
                "Fungi Networks", {
                    ~parliament.agents.fungiNetworks.do({ |agent|
                        if(agent.synth.notNil) {
                            agent.synth.set(param, value);
                        };
                    });
                },
                "AI Core", {
                    if(~parliament.agents.aiCore[0].synth.notNil) {
                        ~parliament.agents.aiCore[0].synth.set(param, value);
                    };
                }
            );
        };
        
        // Agent state queries
        ~getAgentStates = {
            (
                acousticSpecies: ~parliament.agents.acousticSpecies.collect({ |agent|
                    (
                        name: agent.name,
                        active: agent.synth.notNil,
                        presence: agent.presence,
                        votes: agent.votes,
                        status: agent.status
                    )
                }),
                
                ednaSites: ~parliament.agents.ednaSites.collect({ |agent|
                    (
                        name: agent.name,
                        active: agent.synth.notNil,
                        biodiversity: agent.biodiversity,
                        validation: agent.validation
                    )
                }),
                
                fungiNetworks: ~parliament.agents.fungiNetworks.collect({ |agent|
                    (
                        name: agent.name,
                        active: agent.synth.notNil,
                        chemical: agent.chemical,
                        connectivity: agent.connectivity,
                        coverage: agent.coverage
                    )
                }),
                
                aiCore: (
                    name: ~parliament.agents.aiCore[0].name,
                    active: ~parliament.agents.aiCore[0].synth.notNil,
                    consciousness: ~parliament.agents.aiCore[0].consciousness,
                    optimization: ~parliament.agents.aiCore[0].optimization,
                    metaGov: ~parliament.agents.aiCore[0].metaGov
                ),
                
                consensus: (
                    active: ~parliament.consensusEngine.notNil,
                    level: ~parliament.controlBuses.consensusLevel.getSynchronous,
                    totalVotes: ~parliament.controlBuses.totalVotes.getSynchronous,
                    rotationSpeed: ~parliament.controlBuses.rotationSpeed.getSynchronous
                )
            )
        };
        
        // Democratic voting simulation
        ~simulateVote = { |proposalType="environmental"|
            "🗳️ Simulating democratic vote on " ++ proposalType ++ " proposal...".postln;
            
            var totalVotes = 0;
            var yesVotes = 0;
            
            // Each acoustic species votes based on IUCN status weighting
            ~parliament.agents.acousticSpecies.do({ |agent|
                if(agent.synth.notNil) {
                    var voteWeight = agent.votes;
                    var voteChance = switch(agent.status,
                        "CR", 0.9, // Critically endangered species vote strongly for protection
                        "VU", 0.7, // Vulnerable species generally support
                        "LC", 0.5  // Least concern species neutral
                    );
                    
                    if(voteChance > 0.5.rand) {
                        yesVotes = yesVotes + voteWeight;
                        ("  ✓ " ++ agent.name ++ " votes YES (" ++ voteWeight ++ " votes)").postln;
                    } {
                        ("  ✗ " ++ agent.name ++ " votes NO (" ++ voteWeight ++ " votes)").postln;
                    };
                    
                    totalVotes = totalVotes + voteWeight;
                };
            });
            
            var consensus = yesVotes / totalVotes;
            ~parliament.controlBuses.consensusLevel.set(consensus);
            ~parliament.controlBuses.totalVotes.set(totalVotes);
            
            var result = if(consensus > 0.6) { "PASSED" } { "FAILED" };
            ("🏛️ Vote Result: " ++ result ++ " (" ++ (consensus * 100).round(0.1) ++ "% consensus, " ++ totalVotes ++ " total votes)").postln;
            
            consensus;
        };
        
        // Emergency response system
        ~triggerEmergencyResponse = { |threatLevel=0.8|
            "🚨 ENVIRONMENTAL EMERGENCY DETECTED - Activating emergency protocols".postln;
            
            // All agents go to maximum activity
            ~parliament.agents.acousticSpecies.do({ |agent|
                if(agent.synth.notNil) {
                    agent.synth.set(\presence, 1.0, \activity, 1.0);
                };
            });
            
            // eDNA sites increase validation frequency
            ~parliament.agents.ednaSites.do({ |agent|
                if(agent.synth.notNil) {
                    agent.synth.set(\validation, 1.0, \mutationRate, 0.1);
                };
            });
            
            // Fungi networks boost chemical signaling
            ~parliament.agents.fungiNetworks.do({ |agent|
                if(agent.synth.notNil) {
                    agent.synth.set(\chemical, 1.0, \connectivity, 1.0);
                };
            });
            
            // AI Core increases optimization
            if(~parliament.agents.aiCore[0].synth.notNil) {
                ~parliament.agents.aiCore[0].synth.set(\consciousness, 1.0, \optimization, 127);
            };
            
            // Force consensus to emergency level
            ~parliament.controlBuses.consensusLevel.set(threatLevel);
            
            "🚨 Emergency response active - All agents at maximum capacity".postln;
        };
        
        // Status reporting
        ~reportParliamentStatus = {
            var states = ~getAgentStates.value;
            
            "".postln;
            "🏛️ === PARLIAMENT OF ALL THINGS - STATUS REPORT ===".postln;
            ("Time: " ++ Date.localtime).postln;
            "".postln;
            
            "ACOUSTIC SPECIES:".postln;
            states.acousticSpecies.do({ |agent|
                ("  " ++ agent.name ++ ": " ++ 
                 if(agent.active) { "🟢 ACTIVE" } { "🔴 OFFLINE" } ++
                 " | " ++ agent.votes ++ " votes | " ++ 
                 (agent.presence * 100).round(0.1) ++ "% presence | " ++ agent.status).postln;
            });
            
            "".postln;
            "eDNA MONITORING SITES:".postln;
            states.ednaSites.do({ |agent|
                ("  " ++ agent.name ++ ": " ++ 
                 if(agent.active) { "🟢 MONITORING" } { "🔴 OFFLINE" } ++
                 " | " ++ (agent.biodiversity * 100).round(0.1) ++ "% biodiversity | " ++
                 (agent.validation * 100).round(0.1) ++ "% validation").postln;
            });
            
            "".postln;
            "FUNGI NETWORKS:".postln;
            states.fungiNetworks.do({ |agent|
                ("  " ++ agent.name ++ ": " ++ 
                 if(agent.active) { "🟢 CONNECTED" } { "🔴 OFFLINE" } ++
                 " | " ++ agent.coverage ++ " km² coverage | " ++
                 (agent.connectivity * 100).round(0.1) ++ "% connectivity").postln;
            });
            
            "".postln;
            "AI CORE:".postln;
            ("  " ++ states.aiCore.name ++ ": " ++ 
             if(states.aiCore.active) { "🟢 ONLINE" } { "🔴 OFFLINE" } ++
             " | " ++ (states.aiCore.consciousness * 100).round(0.1) ++ "% consciousness | " ++
             states.aiCore.optimization ++ " optimization rate").postln;
            
            "".postln;
            "CONSENSUS STATUS:".postln;
            ("  Democratic Consensus: " ++ (states.consensus.level * 100).round(0.1) ++ "%").postln;
            ("  Total Voting Power: " ++ states.consensus.totalVotes ++ " votes").postln;
            ("  Parliament Rotation: " ++ states.consensus.rotationSpeed ++ "x speed").postln;
            
            "".postln;
            "=== END STATUS REPORT ===".postln;
            "".postln;
        };
        
        "Parliament Control System loaded successfully:".postln;
        "  - Agent management (start/stop)".postln;
        "  - Democratic voting simulation".postln;
        "  - Emergency response protocols".postln;
        "  - Status monitoring and reporting".postln;
        "  - Parameter updates (GUI/OSC integration)".postln;
        "".postln;
        "Available functions:".postln;
        "  ~startParliament.value - Start all agents".postln;
        "  ~stopParliament.value - Stop all agents".postln;
        "  ~simulateVote.value - Democratic vote simulation".postln;
        "  ~triggerEmergencyResponse.value - Emergency protocols".postln;
        "  ~reportParliamentStatus.value - Full status report".postln;
        
    } {
        |error|
        ~handleParliamentError.value(error, "control");
        success = false;
    };
    
    success;
}.value;
)