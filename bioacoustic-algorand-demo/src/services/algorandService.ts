import algosdk, { Account, Algodv2 } from 'algosdk';

export interface TokenMetadata {
  assetName: string;
  unitName: string;
  decimals: number;
  totalSupply: number;
  url?: string;
  metadataHash?: Uint8Array;
}

export interface TransactionResult {
  txId: string;
  assetId?: number;
  confirmedRound?: number;
}

export interface WalletConnection {
  address: string;
  isConnected: boolean;
  provider?: 'pera' | 'defly' | 'algosigner' | 'walletconnect';
}

/**
 * Algorand Service for Bio-Token operations
 * Handles real blockchain interactions for environmental token creation and management
 */
export class AlgorandService {
  private algodClient: Algodv2;
  private testNetServer: string = 'https://testnet-api.algonode.cloud';
  private testNetPort: string | number = 443;
  private testNetToken: string = '';

  constructor() {
    // Initialize Algorand client for TestNet
    this.algodClient = new algosdk.Algodv2(
      this.testNetToken,
      this.testNetServer,
      this.testNetPort
    );
  }

  /**
   * Create a new Algorand account for testing purposes
   * In production, users would connect their existing wallets
   */
  generateTestAccount(): Account {
    return algosdk.generateAccount();
  }

  /**
   * Get account balance and assets
   */
  async getAccountInfo(address: string) {
    try {
      const accountInfo = await this.algodClient.accountInformation(address).do();
      return {
        balance: accountInfo.amount,
        assets: accountInfo.assets || [],
        address: accountInfo.address
      };
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw new Error(`Failed to get account information: ${error}`);
    }
  }

  /**
   * Create a Bio-Token ASA (Algorand Standard Asset)
   * This represents environmental tokens based on bioacoustic data
   */
  async createBioToken(
    creatorAccount: Account, 
    tokenMetadata: TokenMetadata,
    speciesData?: {
      species: string;
      iucnStatus: string;
      location: string;
      duration: number;
      qualityScore: number;
    }
  ): Promise<TransactionResult> {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do();

      // Encode metadata about the bioacoustic recording
      const metadata = {
        name: tokenMetadata.assetName,
        description: `Bio-token representing ${speciesData?.species || 'unknown species'} acoustic signature`,
        species: speciesData?.species,
        conservation_status: speciesData?.iucnStatus,
        location: speciesData?.location,
        duration_seconds: speciesData?.duration,
        quality_score: speciesData?.qualityScore,
        created_at: new Date().toISOString(),
        standard: 'arc69'  // Algorand metadata standard
      };

      const metadataJSON = JSON.stringify(metadata);
      const note = new TextEncoder().encode(metadataJSON);

      // Create asset creation transaction
      const assetCreateTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: creatorAccount.addr,
        total: tokenMetadata.totalSupply,
        decimals: tokenMetadata.decimals,
        assetName: tokenMetadata.assetName,
        unitName: tokenMetadata.unitName,
        assetURL: tokenMetadata.url || '',
        assetMetadataHash: tokenMetadata.metadataHash,
        manager: creatorAccount.addr,
        reserve: creatorAccount.addr,
        freeze: undefined, // No freeze address for environmental tokens
        clawback: undefined, // No clawback for community tokens
        suggestedParams,
        note
      });

      // Sign transaction
      const signedTxn = assetCreateTxn.signTxn(creatorAccount.sk);

      // Submit to network
      const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();

      // Wait for confirmation
      const confirmedTxn = await this.waitForConfirmation(txId);
      
      // Extract asset ID from confirmed transaction
      const assetId = confirmedTxn['asset-index'];

      return {
        txId,
        assetId,
        confirmedRound: confirmedTxn['confirmed-round']
      };
    } catch (error) {
      console.error('Error creating bio-token:', error);
      throw new Error(`Failed to create bio-token: ${error}`);
    }
  }

  /**
   * Transfer bio-tokens between accounts
   */
  async transferBioToken(
    fromAccount: Account,
    toAddress: string,
    assetId: number,
    amount: number,
    note?: string
  ): Promise<TransactionResult> {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do();

      const transferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: fromAccount.addr,
        to: toAddress,
        amount,
        assetIndex: assetId,
        suggestedParams,
        note: note ? new TextEncoder().encode(note) : undefined
      });

      const signedTxn = transferTxn.signTxn(fromAccount.sk);
      const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();

      const confirmedTxn = await this.waitForConfirmation(txId);

      return {
        txId,
        confirmedRound: confirmedTxn['confirmed-round']
      };
    } catch (error) {
      console.error('Error transferring bio-token:', error);
      throw new Error(`Failed to transfer bio-token: ${error}`);
    }
  }

  /**
   * Opt-in to receive a specific ASA
   */
  async optInToAsset(account: Account, assetId: number): Promise<TransactionResult> {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do();

      const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: account.addr,
        to: account.addr,
        amount: 0,
        assetIndex: assetId,
        suggestedParams
      });

      const signedTxn = optInTxn.signTxn(account.sk);
      const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();

      const confirmedTxn = await this.waitForConfirmation(txId);

      return {
        txId,
        confirmedRound: confirmedTxn['confirmed-round']
      };
    } catch (error) {
      console.error('Error opting in to asset:', error);
      throw new Error(`Failed to opt in to asset: ${error}`);
    }
  }

  /**
   * Get asset information from the blockchain
   */
  async getAssetInfo(assetId: number) {
    try {
      const assetInfo = await this.algodClient.getAssetByID(assetId).do();
      return assetInfo;
    } catch (error) {
      console.error('Error fetching asset info:', error);
      throw new Error(`Failed to get asset information: ${error}`);
    }
  }

  /**
   * Wait for transaction confirmation
   */
  private async waitForConfirmation(txId: string, timeout = 10) {
    const status = await this.algodClient.status().do();
    let lastRound = status['last-round'];
    
    while (lastRound < lastRound + timeout) {
      try {
        const confirmedTxn = await this.algodClient
          .pendingTransactionInformation(txId)
          .do();
          
        if (confirmedTxn['confirmed-round'] !== null && confirmedTxn['confirmed-round'] > 0) {
          return confirmedTxn;
        }
        
        lastRound++;
        await this.algodClient.statusAfterBlock(lastRound).do();
      } catch (error) {
        throw new Error(`Transaction failed to confirm: ${error}`);
      }
    }
    
    throw new Error('Transaction confirmation timeout');
  }

  /**
   * Calculate bio-token value based on ecological parameters
   * This implements the tokenization algorithm from your research
   */
  calculateBioTokenValue(params: {
    duration: number;
    species?: string;
    iucnStatus?: string;
    location: string;
    qualityScore: number;
    isRareLocation: boolean;
  }): number {
    let baseValue = Math.floor(params.duration / 30); // Base duration scoring
    
    // Metadata multiplier
    let metadataMultiplier = 1.0;
    if (params.species) metadataMultiplier *= 1.2;
    if (params.iucnStatus) metadataMultiplier *= 1.3;
    
    // Location rarity bonus
    let locationRarity = params.isRareLocation ? 1.5 : 1.0;
    
    // IUCN status bonus
    let iucnBonus = 1.0;
    switch (params.iucnStatus) {
      case 'CR': iucnBonus = 2.0; break;
      case 'EN': iucnBonus = 1.8; break;
      case 'VU': iucnBonus = 1.5; break;
      case 'NT': iucnBonus = 1.2; break;
      case 'LC': iucnBonus = 1.0; break;
      default: iucnBonus = 1.0;
    }
    
    // Quality score (0.0 - 1.0)
    let qualityMultiplier = Math.max(0.1, params.qualityScore);
    
    // Final calculation
    const tokenValue = Math.round(
      baseValue * metadataMultiplier * locationRarity * iucnBonus * qualityMultiplier
    );
    
    return Math.max(1, tokenValue); // Minimum 1 token
  }

  /**
   * Create environmental tokens based on bioacoustic data
   * This is the main function that integrates all bio-token logic
   */
  async createEnvironmentalToken(
    creatorAccount: Account,
    bioacousticData: {
      duration: number;
      species?: string;
      iucnStatus?: string;
      location: string;
      qualityScore: number;
      isRareLocation: boolean;
      coordinates: [number, number];
      waveform: number[];
      spectrogram: number[][];
    }
  ): Promise<{ result: TransactionResult; tokenValue: number }> {
    // Calculate token value using the bio-tokenization algorithm
    const tokenValue = this.calculateBioTokenValue(bioacousticData);
    
    // Create token metadata
    const tokenMetadata: TokenMetadata = {
      assetName: `BioToken-${bioacousticData.species?.replace(' ', '-') || 'Unknown'}-${Date.now()}`,
      unitName: 'BIOTK',
      decimals: 0,
      totalSupply: tokenValue,
      url: `https://biotokenization.org/token/metadata`, // Could link to IPFS metadata
    };
    
    // Create the token on Algorand
    const result = await this.createBioToken(creatorAccount, tokenMetadata, {
      species: bioacousticData.species || 'Unknown',
      iucnStatus: bioacousticData.iucnStatus || 'Not Assessed',
      location: bioacousticData.location,
      duration: bioacousticData.duration,
      qualityScore: bioacousticData.qualityScore
    });
    
    return { result, tokenValue };
  }

  /**
   * Get all bio-tokens owned by an account
   */
  async getBioTokens(address: string) {
    try {
      const accountInfo = await this.getAccountInfo(address);
      const bioTokens = [];
      
      for (const asset of accountInfo.assets) {
        const assetInfo = await this.getAssetInfo(asset['asset-id']);
        
        // Check if this is a bio-token by looking at the asset name or metadata
        if (assetInfo.params['unit-name'] === 'BIOTK' || 
            assetInfo.params.name.includes('BioToken')) {
          bioTokens.push({
            assetId: asset['asset-id'],
            balance: asset.amount,
            assetInfo: assetInfo.params
          });
        }
      }
      
      return bioTokens;
    } catch (error) {
      console.error('Error fetching bio-tokens:', error);
      throw new Error(`Failed to get bio-tokens: ${error}`);
    }
  }
}

export default AlgorandService;