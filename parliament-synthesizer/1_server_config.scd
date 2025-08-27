// Parliament of All Things - Server Configuration
// Audio and Control Bus Setup
// Current Date: 2025-08-27

(
{
    var success = true;
    
    try {
        "Loading Parliament Server Configuration...".postln;
        
        // Audio buses for agent types
        ~parliament.audioBuses = (
            main: Bus.audio(s, 2),
            acousticSpecies: Bus.audio(s, 2),
            ednaSites: Bus.audio(s, 2), 
            fungiNetworks: Bus.audio(s, 2),
            aiCore: Bus.audio(s, 2),
            reverb: Bus.audio(s, 2),
            delay: Bus.audio(s, 2)
        );
        
        // Control buses for real-time parameter control
        ~parliament.controlBuses = (
            // Global parliament controls
            consensusLevel: Bus.control(s, 1).set(0.5),
            rotationSpeed: Bus.control(s, 1).set(1.0),
            totalVotes: Bus.control(s, 1).set(26),
            masterVolume: Bus.control(s, 1).set(0.7),
            
            // Agent type controls
            acousticPresence: Bus.control(s, 1).set(0.6),
            ednaValidation: Bus.control(s, 1).set(0.88),
            fungiChemical: Bus.control(s, 1).set(0.5),
            aiConsciousness: Bus.control(s, 1).set(0.8),
            aiOptimization: Bus.control(s, 1).set(64)
        );
        
        // Individual agent control buses (21 agents)
        ~parliament.agentBuses = 21.collect({ |i|
            (
                presence: Bus.control(s, 1).set(0.5 + (0.4.rand)),
                activity: Bus.control(s, 1).set(0.3 + (0.4.rand)),
                parameter1: Bus.control(s, 1).set(0.5.rand),
                parameter2: Bus.control(s, 1).set(0.5.rand)
            )
        });
        
        // Colombian biodiversity agent data
        ~parliament.agents = (
            acousticSpecies: [
                (name: "Ara macao", votes: 8, presence: 0.6, status: "CR", freq: 220),
                (name: "Atlapetes blancae", votes: 5, presence: 0.8, status: "VU", freq: 330), 
                (name: "Cecropia obtusa", votes: 3, presence: 0.9, status: "LC", freq: 440),
                (name: "Alouatta seniculus", votes: 6, presence: 0.7, status: "VU", freq: 165),
                (name: "Tinamus major", votes: 4, presence: 0.5, status: "LC", freq: 275)
            ],
            
            ednaSites: [
                (name: "Chocó Biogeographic", biodiversity: 0.95, validation: 0.88),
                (name: "Amazon Basin", biodiversity: 0.92, validation: 0.85),
                (name: "Eastern Cordillera", biodiversity: 0.87, validation: 0.90),
                (name: "Caribbean Coast", biodiversity: 0.78, validation: 0.82),
                (name: "Orinoquía Plains", biodiversity: 0.83, validation: 0.87),
                (name: "Pacific Coast", biodiversity: 0.89, validation: 0.84),
                (name: "Magdalena Valley", biodiversity: 0.76, validation: 0.79),
                (name: "Guayana Shield", biodiversity: 0.91, validation: 0.86)
            ],
            
            fungiNetworks: [
                (name: "Northern Mycorrhizal Network", chemical: 0.7, connectivity: 0.8, coverage: 25),
                (name: "Central Spore Network", chemical: 0.6, connectivity: 0.9, coverage: 30),
                (name: "Southern Fungal Web", chemical: 0.8, connectivity: 0.7, coverage: 20),
                (name: "Coastal Decomposer Grid", chemical: 0.5, connectivity: 0.6, coverage: 15)
            ],
            
            aiCore: [
                (name: "Gaia Meta-Governance AI", consciousness: 0.8, optimization: 64, metaGov: 0.75)
            ]
        );
        
        "Parliament Server Configuration loaded successfully:".postln;
        ("  Audio buses: " ++ ~parliament.audioBuses.size ++ " channels").postln;
        ("  Control buses: " ++ ~parliament.controlBuses.size ++ " parameters").postln;
        ("  Agents: " ++ ~parliament.config.agents ++ " total").postln;
        ~parliament.status.server = true;
        
    } {
        |error|
        ~handleParliamentError.value(error, "server_config");
        success = false;
    };
    
    success;
}.value;
)