import AlgorandService, { TokenMetadata } from './algorandService';
import { Account } from 'algosdk';

export interface EcologicalRelationship {
  primarySpecies: string;
  relatedSpecies: string[];
  relationshipType: 'predator-prey' | 'mutualistic' | 'competitive' | 'commensalistic' | 'acoustic-masking' | 'temporal-overlap';
  strength: number; // 0.0 to 1.0
  temporalPattern: 'dawn-chorus' | 'evening-chorus' | 'nocturnal' | 'diurnal' | 'seasonal' | 'year-round';
  spatialOverlap: number; // 0.0 to 1.0
}

export interface TemporalDynamics {
  seasonalPatterns: {
    season: 'wet' | 'dry' | 'transition';
    activityLevel: number;
    diversityIndex: number;
  }[];
  dailyPatterns: {
    hour: number;
    activityLevel: number;
    speciesCount: number;
  }[];
  migrationEvents: {
    species: string;
    period: 'arrival' | 'departure';
    frequency: number;
  }[];
}

export interface EcosystemHealthMetrics {
  biodiversityIndex: number; // Shannon-Weaver index
  endemismScore: number; // Proportion of endemic species
  threatLevel: number; // Based on IUCN status of present species
  acousticComplexity: number; // Spectral and temporal complexity
  networkConnectivity: number; // How interconnected the acoustic network is
  resilienceScore: number; // Ecosystem's ability to recover from disturbances
}

export interface LivingNetworkToken {
  tokenId: string;
  ecosystemName: string;
  location: {
    coordinates: [number, number];
    bioregion: string;
    protectionStatus: 'protected' | 'unprotected' | 'partially-protected';
  };
  relationships: EcologicalRelationship[];
  temporalDynamics: TemporalDynamics;
  healthMetrics: EcosystemHealthMetrics;
  participatingSpecies: {
    species: string;
    iucnStatus: string;
    acousticSignature: string; // Hash of acoustic pattern
    contributionScore: number;
  }[];
  emergentProperties: {
    networkEffects: string[];
    ecosystemServices: string[];
    culturalSignificance: string;
  };
  tokenValue: number;
  creationTimestamp: number;
  lastUpdateTimestamp: number;
}

/**
 * Service for creating and managing Living Network Tokens
 * These tokens represent ecological relationships and temporal dynamics
 * rather than individual species recordings
 */
export class LivingNetworkService {
  private algorandService: AlgorandService;

  constructor(algorandService: AlgorandService) {
    this.algorandService = algorandService;
  }

  /**
   * Calculate biodiversity index using Shannon-Weaver formula
   */
  private calculateBiodiversityIndex(speciesData: { species: string; abundance: number }[]): number {
    const totalAbundance = speciesData.reduce((sum, sp) => sum + sp.abundance, 0);
    if (totalAbundance === 0) return 0;

    const shannonIndex = speciesData.reduce((index, sp) => {
      const proportion = sp.abundance / totalAbundance;
      return proportion > 0 ? index - (proportion * Math.log(proportion)) : index;
    }, 0);

    return shannonIndex;
  }

  /**
   * Detect ecological relationships from acoustic patterns
   */
  private analyzeEcologicalRelationships(
    acousticData: Array<{
      species: string;
      timestamp: number;
      frequency: number[];
      amplitude: number[];
      duration: number;
    }>
  ): EcologicalRelationship[] {
    const relationships: EcologicalRelationship[] = [];
    const speciesMap = new Map<string, typeof acousticData>();

    // Group by species
    acousticData.forEach(data => {
      if (!speciesMap.has(data.species)) {
        speciesMap.set(data.species, []);
      }
      speciesMap.get(data.species)!.push(data);
    });

    // Analyze temporal overlaps and acoustic interactions
    for (const [primarySpecies, primaryData] of speciesMap.entries()) {
      for (const [relatedSpecies, relatedData] of speciesMap.entries()) {
        if (primarySpecies === relatedSpecies) continue;

        // Calculate temporal overlap
        const temporalOverlap = this.calculateTemporalOverlap(primaryData, relatedData);
        
        // Calculate acoustic masking potential
        const acousticMasking = this.calculateAcousticMasking(primaryData, relatedData);
        
        if (temporalOverlap > 0.3 || acousticMasking > 0.5) {
          const relationshipType = acousticMasking > 0.7 
            ? 'acoustic-masking' 
            : temporalOverlap > 0.8 
            ? 'temporal-overlap' 
            : 'commensalistic';

          relationships.push({
            primarySpecies,
            relatedSpecies: [relatedSpecies],
            relationshipType,
            strength: Math.max(temporalOverlap, acousticMasking),
            temporalPattern: this.determineTemporalPattern(primaryData),
            spatialOverlap: 1.0 // Assuming same location for now
          });
        }
      }
    }

    return relationships;
  }

  /**
   * Calculate temporal overlap between two species' acoustic activities
   */
  private calculateTemporalOverlap(
    species1Data: Array<{ timestamp: number; duration: number }>,
    species2Data: Array<{ timestamp: number; duration: number }>
  ): number {
    let overlapCount = 0;
    let totalComparisons = 0;

    species1Data.forEach(call1 => {
      species2Data.forEach(call2 => {
        totalComparisons++;
        const call1End = call1.timestamp + call1.duration;
        const call2End = call2.timestamp + call2.duration;
        
        // Check for temporal overlap
        if (call1.timestamp < call2End && call2.timestamp < call1End) {
          overlapCount++;
        }
      });
    });

    return totalComparisons > 0 ? overlapCount / totalComparisons : 0;
  }

  /**
   * Calculate acoustic masking potential between species
   */
  private calculateAcousticMasking(
    species1Data: Array<{ frequency: number[] }>,
    species2Data: Array<{ frequency: number[] }>
  ): number {
    // Simplified acoustic masking calculation based on frequency overlap
    const freq1Range = this.getFrequencyRange(species1Data);
    const freq2Range = this.getFrequencyRange(species2Data);

    const overlapStart = Math.max(freq1Range.min, freq2Range.min);
    const overlapEnd = Math.min(freq1Range.max, freq2Range.max);

    if (overlapStart >= overlapEnd) return 0;

    const overlapSize = overlapEnd - overlapStart;
    const range1Size = freq1Range.max - freq1Range.min;
    const range2Size = freq2Range.max - freq2Range.min;

    return overlapSize / Math.min(range1Size, range2Size);
  }

  /**
   * Get frequency range for a species' acoustic data
   */
  private getFrequencyRange(speciesData: Array<{ frequency: number[] }>): { min: number; max: number } {
    let min = Infinity;
    let max = -Infinity;

    speciesData.forEach(data => {
      data.frequency.forEach(freq => {
        min = Math.min(min, freq);
        max = Math.max(max, freq);
      });
    });

    return { min: min === Infinity ? 0 : min, max: max === -Infinity ? 0 : max };
  }

  /**
   * Determine temporal pattern from acoustic data
   */
  private determineTemporalPattern(acousticData: Array<{ timestamp: number }>): TemporalDynamics['dailyPatterns'][0]['hour'] extends number ? 'dawn-chorus' | 'evening-chorus' | 'nocturnal' | 'diurnal' | 'seasonal' | 'year-round' : never {
    const hours = acousticData.map(data => new Date(data.timestamp).getHours());
    const avgHour = hours.reduce((sum, hour) => sum + hour, 0) / hours.length;

    if (avgHour >= 5 && avgHour <= 8) return 'dawn-chorus';
    if (avgHour >= 17 && avgHour <= 20) return 'evening-chorus';
    if (avgHour >= 22 || avgHour <= 4) return 'nocturnal';
    return 'diurnal';
  }

  /**
   * Calculate ecosystem health metrics from acoustic data
   */
  private calculateEcosystemHealth(
    speciesData: Array<{
      species: string;
      iucnStatus: string;
      acousticComplexity: number;
      abundance: number;
    }>,
    relationships: EcologicalRelationship[]
  ): EcosystemHealthMetrics {
    // Biodiversity index
    const biodiversityIndex = this.calculateBiodiversityIndex(
      speciesData.map(sp => ({ species: sp.species, abundance: sp.abundance }))
    );

    // Endemism score (would need external data in real implementation)
    const endemismScore = 0.3; // Placeholder

    // Threat level based on IUCN status
    const threatWeights = { 'CR': 5, 'EN': 4, 'VU': 3, 'NT': 2, 'LC': 1, 'DD': 1 };
    const avgThreatLevel = speciesData.reduce((sum, sp) => {
      const weight = threatWeights[sp.iucnStatus as keyof typeof threatWeights] || 1;
      return sum + weight;
    }, 0) / speciesData.length;
    const threatLevel = avgThreatLevel / 5; // Normalize to 0-1

    // Acoustic complexity
    const acousticComplexity = speciesData.reduce((sum, sp) => sum + sp.acousticComplexity, 0) / speciesData.length;

    // Network connectivity
    const networkConnectivity = relationships.length / Math.max(1, speciesData.length * (speciesData.length - 1) / 2);

    // Resilience score (simplified calculation)
    const resilienceScore = (biodiversityIndex * 0.4) + (networkConnectivity * 0.3) + ((1 - threatLevel) * 0.3);

    return {
      biodiversityIndex,
      endemismScore,
      threatLevel,
      acousticComplexity,
      networkConnectivity,
      resilienceScore
    };
  }

  /**
   * Calculate token value for Living Network Token
   */
  private calculateLivingNetworkValue(
    healthMetrics: EcosystemHealthMetrics,
    relationships: EcologicalRelationship[],
    speciesCount: number
  ): number {
    const baseValue = speciesCount * 10; // Base value per species
    const healthMultiplier = (healthMetrics.biodiversityIndex + healthMetrics.resilienceScore) / 2;
    const networkMultiplier = Math.min(2.0, 1 + healthMetrics.networkConnectivity);
    const rarityBonus = healthMetrics.endemismScore * 50;
    const threatPenalty = healthMetrics.threatLevel * 20;

    const finalValue = Math.round(
      (baseValue * healthMultiplier * networkMultiplier + rarityBonus - threatPenalty)
    );

    return Math.max(10, finalValue); // Minimum 10 tokens
  }

  /**
   * Create a Living Network Token from multi-species acoustic data
   */
  async createLivingNetworkToken(
    creatorAccount: Account,
    networkData: {
      ecosystemName: string;
      location: { coordinates: [number, number]; bioregion: string; protectionStatus: 'protected' | 'unprotected' | 'partially-protected' };
      acousticData: Array<{
        species: string;
        iucnStatus: string;
        timestamp: number;
        frequency: number[];
        amplitude: number[];
        duration: number;
        acousticComplexity: number;
        abundance: number;
      }>;
      culturalSignificance: string;
      ecosystemServices: string[];
    }
  ): Promise<{ token: LivingNetworkToken; assetId: number; txId: string }> {
    
    // Analyze ecological relationships
    const relationships = this.analyzeEcologicalRelationships(networkData.acousticData);
    
    // Create temporal dynamics (simplified for demo)
    const temporalDynamics: TemporalDynamics = {
      seasonalPatterns: [
        { season: 'wet', activityLevel: 0.8, diversityIndex: 0.9 },
        { season: 'dry', activityLevel: 0.6, diversityIndex: 0.7 }
      ],
      dailyPatterns: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        activityLevel: hour >= 5 && hour <= 8 || hour >= 17 && hour <= 20 ? 0.9 : 0.3,
        speciesCount: Math.round(networkData.acousticData.length * (hour >= 5 && hour <= 20 ? 0.8 : 0.4))
      })),
      migrationEvents: [] // Would be populated with real migration data
    };

    // Calculate ecosystem health
    const healthMetrics = this.calculateEcosystemHealth(
      networkData.acousticData.map(data => ({
        species: data.species,
        iucnStatus: data.iucnStatus,
        acousticComplexity: data.acousticComplexity,
        abundance: data.abundance
      })),
      relationships
    );

    // Calculate token value
    const tokenValue = this.calculateLivingNetworkValue(
      healthMetrics,
      relationships,
      networkData.acousticData.length
    );

    // Prepare participating species data
    const participatingSpecies = networkData.acousticData.map(data => ({
      species: data.species,
      iucnStatus: data.iucnStatus,
      acousticSignature: this.generateAcousticHash(data.frequency, data.amplitude),
      contributionScore: data.acousticComplexity * data.abundance
    }));

    // Detect emergent properties
    const emergentProperties = {
      networkEffects: this.identifyNetworkEffects(relationships),
      ecosystemServices: networkData.ecosystemServices,
      culturalSignificance: networkData.culturalSignificance
    };

    // Create the Living Network Token object
    const livingNetworkToken: LivingNetworkToken = {
      tokenId: `LNT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ecosystemName: networkData.ecosystemName,
      location: networkData.location,
      relationships,
      temporalDynamics,
      healthMetrics,
      participatingSpecies,
      emergentProperties,
      tokenValue,
      creationTimestamp: Date.now(),
      lastUpdateTimestamp: Date.now()
    };

    // Create token metadata for Algorand ASA
    const tokenMetadata: TokenMetadata = {
      assetName: `LivingNetwork-${networkData.ecosystemName.replace(/\s+/g, '-')}`,
      unitName: 'LNTK',
      decimals: 0,
      totalSupply: tokenValue,
      url: `https://biotokenization.org/living-networks/${livingNetworkToken.tokenId}`
    };

    // Create the ASA on Algorand
    const result = await this.algorandService.createBioToken(
      creatorAccount,
      tokenMetadata,
      {
        species: `Network of ${participatingSpecies.length} species`,
        iucnStatus: `Avg threat: ${healthMetrics.threatLevel.toFixed(2)}`,
        location: networkData.location.bioregion,
        duration: 0, // Network tokens don't have duration
        qualityScore: healthMetrics.resilienceScore
      }
    );

    return {
      token: livingNetworkToken,
      assetId: result.assetId!,
      txId: result.txId
    };
  }

  /**
   * Generate a hash representing the acoustic signature
   */
  private generateAcousticHash(frequency: number[], amplitude: number[]): string {
    const combined = frequency.concat(amplitude);
    const sum = combined.reduce((acc, val) => acc + val, 0);
    return `ASH${sum.toString(36).toUpperCase()}`;
  }

  /**
   * Identify emergent network effects from relationships
   */
  private identifyNetworkEffects(relationships: EcologicalRelationship[]): string[] {
    const effects: string[] = [];

    // Analyze relationship types
    const relationshipCounts = relationships.reduce((counts, rel) => {
      counts[rel.relationshipType] = (counts[rel.relationshipType] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    if (relationshipCounts['dawn-chorus'] > 2) {
      effects.push('Coordinated Dawn Chorus');
    }
    if (relationshipCounts['acoustic-masking'] > 1) {
      effects.push('Acoustic Niche Partitioning');
    }
    if (relationships.length > 5) {
      effects.push('High Connectivity Network');
    }
    if (relationships.some(rel => rel.strength > 0.8)) {
      effects.push('Strong Ecological Coupling');
    }

    return effects;
  }

  /**
   * Update an existing Living Network Token with new data
   */
  async updateLivingNetworkToken(
    existingToken: LivingNetworkToken,
    newAcousticData: Array<{
      species: string;
      iucnStatus: string;
      timestamp: number;
      frequency: number[];
      amplitude: number[];
      duration: number;
      acousticComplexity: number;
      abundance: number;
    }>
  ): Promise<LivingNetworkToken> {
    // Merge new data with existing
    const allAcousticData = [...newAcousticData]; // In real implementation, would merge with historical data

    // Recalculate relationships and health metrics
    const newRelationships = this.analyzeEcologicalRelationships(allAcousticData);
    const newHealthMetrics = this.calculateEcosystemHealth(
      allAcousticData.map(data => ({
        species: data.species,
        iucnStatus: data.iucnStatus,
        acousticComplexity: data.acousticComplexity,
        abundance: data.abundance
      })),
      newRelationships
    );

    // Update token
    const updatedToken: LivingNetworkToken = {
      ...existingToken,
      relationships: newRelationships,
      healthMetrics: newHealthMetrics,
      lastUpdateTimestamp: Date.now(),
      tokenValue: this.calculateLivingNetworkValue(
        newHealthMetrics,
        newRelationships,
        allAcousticData.length
      )
    };

    return updatedToken;
  }
}

export default LivingNetworkService;