// Parliament of All Things - SuperCollider Synthesizer
// Loader and Initialization System
// Based on sonETH architecture
// Current Date: 2025-08-26

(
{
    var success = true;
    
    try {
        // Initialize global parliament namespace
        ~parliament = ~parliament ?? ();
        
        // Parliament configuration
        ~parliament.config = (
            version: "1.0.0",
            name: "Parliament of All Things",
            agents: 21,
            sampleRate: 48000,
            blockSize: 512,
            
            // Agent counts by type
            acousticSpecies: 5,
            ednaSites: 8, 
            fungiNetworks: 4,
            aiCore: 1,
            
            // Temporal cycles (in seconds)
            parliamentRotation: 120,
            aiConsciousness: 3,
            fungiChemical: 6,
            ednaValidation: 8,
            
            // Audio routing
            mainOut: 0,
            auxSends: 4
        );
        
        // Component loading order
        ~parliament.loadOrder = [
            "1_server_config.scd",
            "2_agent_synthdefs.scd", 
            "3_temporal_engine.scd",
            "4_parliament_gui.scd",
            "5_agent_controllers.scd",
            "6_consensus_engine.scd",
            "7_osc_handlers.scd"
        ];
        
        // Status tracking
        ~parliament.status = (
            server: false,
            agents: false,
            gui: false,
            temporal: false,
            consensus: false,
            osc: false
        );
        
        // Load components sequentially
        ~loadParliamentComponents = {
            "Loading Parliament of All Things...".postln;
            
            ~parliament.loadOrder.do { |filename|
                var path = thisProcess.nowExecutingPath.dirname +/+ filename;
                if(File.exists(path)) {
                    ("Loading: " ++ filename).postln;
                    path.load;
                    0.1.wait; // Small delay between loads
                } {
                    ("Warning: " ++ filename ++ " not found").warn;
                };
            };
            
            // Final status report
            Task({
                1.wait;
                ~reportParliamentStatus.value;
            }).start;
        };
        
        // Status reporting function  
        ~reportParliamentStatus = {
            "".postln;
            "=== Parliament of All Things - Status Report ===".postln;
            ("Version: " ++ ~parliament.config.version).postln;
            ("Total Agents: " ++ ~parliament.config.agents).postln;
            "".postln;
            
            "Component Status:".postln;
            ~parliament.status.keysValuesDo { |key, status|
                ("  " ++ key.asString.toUpper ++ ": " ++ 
                 if(status) { "✓ LOADED" } { "✗ NOT LOADED" }).postln;
            };
            "".postln;
            
            if(~parliament.status.values.every(_ == true)) {
                "🏛️ Parliament ready for democratic synthesis!".postln;
            } {
                "⚠️ Some components failed to load - check errors above".postln;
            };
            "".postln;
        };
        
        // Cleanup function
        ~cleanupParliament = {
            "Cleaning up Parliament resources...".postln;
            
            // Stop routines
            if(~parliament.temporalRoutine.notNil) { 
                ~parliament.temporalRoutine.stop;
                ~parliament.temporalRoutine = nil;
            };
            if(~parliament.guiRoutine.notNil) { 
                ~parliament.guiRoutine.stop;
                ~parliament.guiRoutine = nil;
            };
            
            // Close GUI
            if(~parliament.mainWindow.notNil) {
                ~parliament.mainWindow.close;
                ~parliament.mainWindow = nil;
            };
            
            // Free synths
            if(~parliament.agents.notNil) {
                ~parliament.agents.do { |agent|
                    if(agent.synth.notNil) {
                        agent.synth.free;
                    };
                };
                ~parliament.agents = nil;
            };
            
            // Free buses
            if(~parliament.buses.notNil) {
                ~parliament.buses.do { |bus|
                    if(bus.notNil) { bus.free };
                };
                ~parliament.buses = nil;
            };
            
            ~parliament = nil;
            "Parliament cleanup complete.".postln;
        };
        
        // Error handler for parliament operations
        ~handleParliamentError = { |error, context|
            ("Parliament Error in " ++ context ++ ": " ++ error.errorString).error;
            ~parliament.status[context.asSymbol] = false;
        };
        
        "Parliament Loader initialized successfully.".postln;
        "Run ~loadParliamentComponents.value to begin loading...".postln;
        
    } {
        |error|
        "Parliament Loader initialization failed: %".format(error.errorString).error;
        success = false;
    };
    
    success;
}.value;
)