// Parliament of All Things - Main Loader
// Component Loading System
// Current Date: 2025-08-27

(
{
    var success = true;
    
    try {
        "Parliament Loader initializing...".postln;
        
        // Initialize parliament namespace
        ~parliament = ();
        ~parliament.config = (
            version: "1.0.0",
            name: "Parliament of All Things",
            agents: 21,
            acousticSpecies: 5,
            ednaSites: 8,
            fungiNetworks: 4,
            aiCore: 1
        );
        
        // Component loading order
        ~parliament.loadOrder = [
            "1_server_config.scd",
            "2_agent_synthdefs.scd", 
            "3_temporal_engine.scd",
            "4_parliament_gui.scd",
            "5_parliament_control.scd",
            "6_effect_synthdefs.scd",
            "7_osc_handlers.scd"
        ];
        
        // Error handling
        ~handleParliamentError = { |error, component|
            ("Parliament Error in " ++ component ++ ": " ++ error.errorString).warn;
        };
        
        // Status tracking
        ~parliament.status = (
            server: false,
            agents: false,
            gui: false,
            temporal: false,
            consensus: false,
            osc: false
        );
        
        // Load components function
        ~loadParliamentComponents = {
            "Loading Parliament of All Things...".postln;
            
            ~parliament.loadOrder.do { |filename|
                var path = thisProcess.nowExecutingPath.dirname +/+ filename;
                if(File.exists(path)) {
                    ("Loading: " ++ filename).postln;
                    path.load;
                } {
                    ("Warning: " ++ filename ++ " not found").warn;
                };
            };
            
            // Final status
            Task({
                1.wait;
                if(~reportParliamentStatus.notNil) {
                    ~reportParliamentStatus.value;
                };
            }).start;
        };
        
        "Parliament Loader initialized successfully.".postln;
        "Run ~loadParliamentComponents.value to begin loading...".postln;
        
    } {
        |error|
        ("Parliament loader error: " ++ error.errorString).warn;
        success = false;
    };
    
    success;
}.value;
)