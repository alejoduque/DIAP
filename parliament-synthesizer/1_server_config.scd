// Parliament of All Things - Server Configuration
// Based on sonETH server configuration patterns
// Current Date: 2025-08-26

(
{
    var success = true;
    
    try {
        // Server configuration for Parliament
        ~parliament.serverConfig = (
            sampleRate: 48000,
            blockSize: 512,
            numInputBusChannels: 8,
            numOutputBusChannels: 8,
            numAudioBusChannels: 1024,
            numControlBusChannels: 16384,
            memSize: 65536,
            maxNodes: 2048,
            maxSynthDefs: 2048,
            protocol: \tcp,
            verbosity: 0
        );
        
        // Start server if not running
        if(Server.default.serverRunning.not) {
            "Starting SuperCollider server for Parliament...".postln;
            
            Server.default.options.sampleRate = ~parliament.serverConfig.sampleRate;
            Server.default.options.blockSize = ~parliament.serverConfig.blockSize;
            Server.default.options.numInputBusChannels = ~parliament.serverConfig.numInputBusChannels;
            Server.default.options.numOutputBusChannels = ~parliament.serverConfig.numOutputBusChannels;
            Server.default.options.numAudioBusChannels = ~parliament.serverConfig.numAudioBusChannels;
            Server.default.options.numControlBusChannels = ~parliament.serverConfig.numControlBusChannels;
            Server.default.options.memSize = ~parliament.serverConfig.memSize;
            Server.default.options.maxNodes = ~parliament.serverConfig.maxNodes;
            Server.default.options.maxSynthDefs = ~parliament.serverConfig.maxSynthDefs;
            Server.default.options.protocol = ~parliament.serverConfig.protocol;
            Server.default.options.verbosity = ~parliament.serverConfig.verbosity;
            
            Server.default.boot;
        };
        
        Server.default.waitForBoot({
            
            // Initialize audio buses for Parliament
            ~parliament.audioBuses = (
                // Main output channels
                main: Bus.audio(s, 2),          // Stereo main mix
                
                // Agent type group buses
                acousticSpecies: Bus.audio(s, 2),
                ednaSites: Bus.audio(s, 2), 
                fungiNetworks: Bus.audio(s, 2),
                aiCore: Bus.audio(s, 2),
                
                // Spatial positioning (8 channels for surround)
                spatial: Bus.audio(s, 8),
                
                // Send effects
                reverb: Bus.audio(s, 2),
                delay: Bus.audio(s, 2),
                chorus: Bus.audio(s, 2),
                filter: Bus.audio(s, 2)
            );
            
            // Initialize control buses for each agent type
            ~parliament.controlBuses = (
                
                // Global parliamentary controls
                consensusLevel: Bus.control(s, 1).set(0.5),
                rotationSpeed: Bus.control(s, 1).set(1.0),
                totalVotes: Bus.control(s, 1).set(0),
                
                // Acoustic Species controls (5 agents)
                acousticPresence: Bus.control(s, 5).set(0.6),    // Array for 5 species
                acousticActivity: Bus.control(s, 5).set(0.5),
                acousticVotes: Bus.control(s, 5).set([15, 25, 20, 12, 8]), // IUCN-based voting power
                
                // eDNA Site controls (8 agents) 
                ednaBiodiversity: Bus.control(s, 8).set(0.87),   // Biodiversity percentages
                ednaValidation: Bus.control(s, 8).set(0.92),     // Validation rates
                ednaSampling: Bus.control(s, 8).set(1.0),        // Monthly cycle phase
                
                // Fungi Network controls (4 agents)
                fungiChemical: Bus.control(s, 4).set(0.5),       // Chemical signal strength
                fungiConnectivity: Bus.control(s, 4).set(0.7),   // Network connectivity
                fungiCoverage: Bus.control(s, 4).set(15),        // Coverage in km²
                
                // AI Core controls (1 agent)
                aiConsciousness: Bus.control(s, 1).set(0.8),     // Consciousness level
                aiOptimization: Bus.control(s, 1).set(64),       // Optimization rate
                aiMetaGov: Bus.control(s, 1).set(1.0),           // Meta-governance active
                
                // Synthesis parameters (shared)
                masterVolume: Bus.control(s, 1).set(0.7),
                spatialSpread: Bus.control(s, 1).set(0.5),
                reverbMix: Bus.control(s, 1).set(0.3),
                delayMix: Bus.control(s, 1).set(0.2),
                chorusMix: Bus.control(s, 1).set(0.1)
            );
            
            // Initialize agent data structure
            ~parliament.agents = (
                
                // Acoustic Species (based on our SVG)
                acousticSpecies: [
                    (name: "Ara macao", votes: 15, status: "VU", presence: 0.6, synth: nil),
                    (name: "Atlapetes flaviceps", votes: 25, status: "CR", presence: 0.8, synth: nil),
                    (name: "Cecropia", votes: 20, status: "LC", presence: 0.5, synth: nil),
                    (name: "Alouatta", votes: 12, status: "LC", presence: 0.4, synth: nil),
                    (name: "Tinamus", votes: 8, status: "LC", presence: 0.3, synth: nil)
                ],
                
                // eDNA Sites (8 Colombian regions)
                ednaSites: [
                    (name: "eDNA-CHOCÓ-N", biodiversity: 0.87, validation: 0.92, synth: nil),
                    (name: "eDNA-AMAZONIA-NE", biodiversity: 0.91, validation: 0.89, synth: nil),
                    (name: "eDNA-CARIBE-E", biodiversity: 0.75, validation: 0.94, synth: nil),
                    (name: "eDNA-ANDINA-SE", biodiversity: 0.83, validation: 0.91, synth: nil),
                    (name: "eDNA-PACIFICA-S", biodiversity: 0.89, validation: 0.88, synth: nil),
                    (name: "eDNA-ORINOQUIA-SW", biodiversity: 0.79, validation: 0.93, synth: nil),
                    (name: "eDNA-CENTRAL-W", biodiversity: 0.81, validation: 0.90, synth: nil),
                    (name: "eDNA-MAGDALENA-NW", biodiversity: 0.85, validation: 0.91, synth: nil)
                ],
                
                // Fungi Networks (4 nodes)
                fungiNetworks: [
                    (name: "MYCORRHIZAL-N", chemical: 0.6, connectivity: 0.8, coverage: 15, synth: nil),
                    (name: "FUNGI-E", chemical: 0.5, connectivity: 0.7, coverage: 12, synth: nil),
                    (name: "SAPROBIC-S", chemical: 0.4, connectivity: 0.6, coverage: 10, synth: nil),
                    (name: "NETWORK-W", chemical: 0.7, connectivity: 0.9, coverage: 18, synth: nil)
                ],
                
                // AI Core (single meta-agent)
                aiCore: [
                    (name: "AI-EVOLUTION-AGENCY", consciousness: 0.8, optimization: 64, metaGov: 1.0, synth: nil)
                ]
            );
            
            // Initialize temporal cycles (matching our SVG animations)
            ~parliament.temporalCycles = (
                parliament: 120,     // 2-minute rotation cycle
                ai: 3,               // AI consciousness pulse
                fungi: 6,            // Chemical signal evolution  
                edna: 8,             // Validation cycles
                species: [4, 4.5, 5, 5.5, 6, 6.5, 7] // Variable species activity
            );
            
            // Create master tempo clock
            ~parliament.masterClock = TempoClock(120/60); // 2-minute cycle as base tempo
            
            // Initialize OSC responders namespace
            ~parliament.oscResponders = ();
            
            // Set up basic monitoring
            ~parliament.monitoring = (
                serverRunning: { Server.default.serverRunning },
                nodeCount: { Server.default.numRunningNodes },
                cpuLoad: { Server.default.avgCPU },
                busesUsed: { ~parliament.audioBuses.size + ~parliament.controlBuses.size }
            );
            
            // Update Parliament status
            ~parliament.status.server = true;
            
            // Server configuration complete
            [
                "Parliament Server Configuration complete:",
                ("  Sample Rate: " ++ ~parliament.serverConfig.sampleRate),
                ("  Block Size: " ++ ~parliament.serverConfig.blockSize),  
                ("  Audio Buses: " ++ ~parliament.audioBuses.size),
                ("  Control Buses: " ++ ~parliament.controlBuses.size),
                ("  Total Agents: " ++ ~parliament.config.agents),
                ("  Master Tempo: " ++ (120/60) ++ " Hz (120s cycle)"),
                "Ready for agent synthesis definitions."
            ].join("\n").postln;
            
        });
        
    } {
        |error|
        ~handleParliamentError.value(error, "server");
        success = false;
    };
    
    success;
}.value;
)