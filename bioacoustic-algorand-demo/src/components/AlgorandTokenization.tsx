import React, { useState, useEffect } from 'react';
import { ChevronRight, Wallet, Zap, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import AlgorandService from '../services/algorandService';
import { Account } from 'algosdk';
import { LoadingSpinner, ProgressBar } from './LoadingSpinner';
import { useBioTokenNotifications, useNotifications } from './NotificationSystem';
import { useErrorHandler } from './ErrorBoundary';

interface Recording {
  id: string;
  duration: number;
  location: string;
  species?: string;
  iucnStatus?: 'CR' | 'EN' | 'VU' | 'NT' | 'LC';
  qualityScore: number;
  metadataComplete: boolean;
  isRareLocation: boolean;
  coordinates: [number, number];
  waveform: number[];
  spectrogram: number[][];
}

interface AlgorandState {
  account: Account | null;
  isConnected: boolean;
  balance: number;
  bioTokens: any[];
  isLoading: boolean;
  error: string | null;
}

interface TokenizationStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  txId?: string;
  assetId?: number;
  details?: string;
}

export const AlgorandTokenization: React.FC = () => {
  const [algorandService] = useState(new AlgorandService());
  const [algorandState, setAlgorandState] = useState<AlgorandState>({
    account: null,
    isConnected: false,
    balance: 0,
    bioTokens: [],
    isLoading: false,
    error: null
  });

  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [tokenizationSteps, setTokenizationSteps] = useState<TokenizationStep[]>([]);
  const [isTokenizing, setIsTokenizing] = useState(false);

  // Error handling and notifications
  const { handleError } = useErrorHandler();
  const { 
    notifyTokenCreated, 
    notifyTokenizationError, 
    notifyWalletConnected,
    notifyBlockchainInteraction,
    notifyNetworkIssue
  } = useBioTokenNotifications();

  // Sample recordings with Colombian biodiversity focus
  const sampleRecordings: Recording[] = [
    {
      id: '1',
      duration: 180,
      location: 'Chocó Biogeográfico',
      species: 'Ara macao',
      iucnStatus: 'VU',
      qualityScore: 0.92,
      metadataComplete: true,
      isRareLocation: true,
      coordinates: [5.6333, -77.4],
      waveform: Array.from({ length: 100 }, (_, i) => Math.sin(i * 0.3) * 0.8),
      spectrogram: Array.from({ length: 20 }, () => Array.from({ length: 50 }, () => Math.random() * 0.8))
    },
    {
      id: '2',
      duration: 75,
      location: 'Sierra Nevada de Santa Marta',
      species: 'Atlapetes flaviceps',
      iucnStatus: 'CR',
      qualityScore: 0.78,
      metadataComplete: true,
      isRareLocation: true,
      coordinates: [10.8, -73.7],
      waveform: Array.from({ length: 100 }, (_, i) => Math.sin(i * 0.2) * 0.6),
      spectrogram: Array.from({ length: 20 }, () => Array.from({ length: 50 }, () => Math.random() * 0.6))
    },
    {
      id: '3',
      duration: 120,
      location: 'Amazonas Colombiano',
      species: 'Tinamus major',
      iucnStatus: 'LC',
      qualityScore: 0.85,
      metadataComplete: true,
      isRareLocation: true,
      coordinates: [-2.1, -70.3],
      waveform: Array.from({ length: 100 }, (_, i) => Math.sin(i * 0.15) * 0.7),
      spectrogram: Array.from({ length: 20 }, () => Array.from({ length: 50 }, () => Math.random() * 0.7))
    }
  ];

  const generateWaveform = (duration: number, quality: number): number[] => {
    return Array.from({ length: 100 }, (_, i) => {
      const noise = Math.random() * (1 - quality);
      const signal = Math.sin(i * 0.3) * quality + Math.sin(i * 0.1) * 0.5;
      return Math.max(-1, Math.min(1, signal + noise));
    });
  };

  const generateSpectrogram = (quality: number): number[][] => {
    return Array.from({ length: 20 }, (_, freq) => 
      Array.from({ length: 50 }, (_, time) => {
        const intensity = quality * Math.random() * (1 - freq * 0.02);
        return Math.max(0, intensity);
      })
    );
  };

  // Create test account with better error handling
  const createTestAccount = async () => {
    try {
      setAlgorandState(prev => ({ ...prev, isLoading: true, error: null }));
      notifyBlockchainInteraction('Creating test account...');
      
      const testAccount = algorandService.generateTestAccount();
      
      // Try to get account info to verify connection
      const accountInfo = await algorandService.getAccountInfo(testAccount.addr);
      
      setAlgorandState(prev => ({
        ...prev,
        account: testAccount,
        isConnected: true,
        balance: accountInfo.balance,
        isLoading: false
      }));
      
      notifyWalletConnected(testAccount.addr);
      
      console.log(`Test account created: ${testAccount.addr}`);
      
    } catch (error) {
      console.error('Failed to create test account:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred while creating test account';
        
      setAlgorandState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      
      // Check if it's a network issue
      if (errorMessage.toLowerCase().includes('network') || 
          errorMessage.toLowerCase().includes('connection') ||
          errorMessage.toLowerCase().includes('fetch')) {
        notifyNetworkIssue('Algorand TestNet');
      } else {
        notifyTokenizationError(errorMessage, true);
      }
      
      handleError(error instanceof Error ? error : new Error(errorMessage));
    }
  };

  // Start bio-tokenization process
  const startBioTokenization = async (recording: Recording) => {
    if (!algorandState.account) {
      setAlgorandState(prev => ({ ...prev, error: 'Please create a test account first' }));
      return;
    }

    setIsTokenizing(true);
    setSelectedRecording(recording);
    
    const steps: TokenizationStep[] = [
      { id: 'calculate', name: 'Calculate Token Value', status: 'pending' },
      { id: 'create', name: 'Create Bio-Token ASA', status: 'pending' },
      { id: 'confirm', name: 'Confirm on Algorand', status: 'pending' }
    ];
    
    setTokenizationSteps(steps);

    try {
      // Step 1: Calculate token value
      setTokenizationSteps(prev => prev.map(step => 
        step.id === 'calculate' ? { ...step, status: 'processing' } : step
      ));

      const tokenValue = algorandService.calculateBioTokenValue({
        duration: recording.duration,
        species: recording.species,
        iucnStatus: recording.iucnStatus,
        location: recording.location,
        qualityScore: recording.qualityScore,
        isRareLocation: recording.isRareLocation
      });

      setTokenizationSteps(prev => prev.map(step => 
        step.id === 'calculate' ? { 
          ...step, 
          status: 'completed', 
          details: `Calculated value: ${tokenValue} BIOTK` 
        } : step
      ));

      // Step 2: Create bio-token
      setTokenizationSteps(prev => prev.map(step => 
        step.id === 'create' ? { ...step, status: 'processing' } : step
      ));

      const bioacousticData = {
        duration: recording.duration,
        species: recording.species,
        iucnStatus: recording.iucnStatus,
        location: recording.location,
        qualityScore: recording.qualityScore,
        isRareLocation: recording.isRareLocation,
        coordinates: recording.coordinates,
        waveform: recording.waveform,
        spectrogram: recording.spectrogram
      };

      const { result, tokenValue: finalTokenValue } = await algorandService.createEnvironmentalToken(
        algorandState.account,
        bioacousticData
      );

      setTokenizationSteps(prev => prev.map(step => 
        step.id === 'create' ? { 
          ...step, 
          status: 'completed',
          details: `Asset ID: ${result.assetId}`
        } : step
      ));

      // Step 3: Confirmation
      setTokenizationSteps(prev => prev.map(step => 
        step.id === 'confirm' ? { 
          ...step, 
          status: 'completed',
          txId: result.txId,
          assetId: result.assetId,
          details: `Transaction confirmed in round ${result.confirmedRound}`
        } : step
      ));

      // Update bio-tokens list
      const bioTokens = await algorandService.getBioTokens(algorandState.account.addr);
      setAlgorandState(prev => ({ ...prev, bioTokens }));

      console.log(`Bio-tokenization completed! Asset ID: ${result.assetId}, Tokens: ${finalTokenValue}`);

    } catch (error) {
      console.error('Bio-tokenization error:', error);
      
      setTokenizationSteps(prev => prev.map(step => 
        step.status === 'processing' ? { ...step, status: 'error', details: String(error) } : step
      ));
      
      setAlgorandState(prev => ({ 
        ...prev, 
        error: `Tokenization failed: ${error}. Note: TestNet accounts need ALGO for transactions.` 
      }));
    } finally {
      setIsTokenizing(false);
    }
  };

  const getIUCNColor = (status?: string) => {
    switch (status) {
      case 'CR': return 'text-red-600 bg-red-100';
      case 'EN': return 'text-orange-600 bg-orange-100';
      case 'VU': return 'text-yellow-600 bg-yellow-100';
      case 'NT': return 'text-blue-600 bg-blue-100';
      case 'LC': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const WaveformViz: React.FC<{ data: number[], color: string }> = ({ data, color }) => (
    <div className="h-16 flex items-center justify-center bg-black/5 rounded-lg p-2">
      <div className="flex items-center gap-px h-full w-full">
        {data.slice(0, 50).map((value, i) => (
          <div
            key={i}
            className={`w-1 ${color} rounded-sm`}
            style={{ height: `${Math.abs(value) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bio-Token Creation on Algorand
        </h1>
        <p className="text-gray-600">
          Transform bioacoustic recordings into environmental tokens using real blockchain technology
        </p>
      </div>

      {/* Algorand Connection Status */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Algorand TestNet Connection</h2>
          {algorandState.isConnected ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              Connected
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <AlertCircle className="w-5 h-5 mr-2" />
              Not Connected
            </div>
          )}
        </div>

        {algorandState.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm">{algorandState.error}</p>
          </div>
        )}

        {algorandState.isConnected && algorandState.account ? (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Account Address</label>
              <p className="text-sm font-mono text-gray-600 break-all">
                {algorandState.account.addr}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Balance</label>
              <p className="text-sm text-gray-600">
                {algorandState.balance / 1000000} ALGO
              </p>
            </div>
            {algorandState.bioTokens.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700">Bio-Tokens Created</label>
                <p className="text-sm text-green-600">
                  {algorandState.bioTokens.length} bio-token(s)
                </p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={createTestAccount}
            disabled={algorandState.isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Wallet className="w-4 h-4 mr-2" />
            {algorandState.isLoading ? 'Creating...' : 'Create Test Account'}
          </button>
        )}
      </div>

      {/* Sample Recordings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Colombian Biodiversity Recordings</h2>
        <div className="grid gap-4">
          {sampleRecordings.map((recording) => (
            <div key={recording.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {recording.species || 'Unknown Species'}
                  </h3>
                  <p className="text-sm text-gray-600">{recording.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {recording.iucnStatus && (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getIUCNColor(recording.iucnStatus)}`}>
                      {recording.iucnStatus}
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    {recording.duration}s • Quality: {Math.round(recording.qualityScore * 100)}%
                  </span>
                </div>
              </div>
              
              <WaveformViz data={recording.waveform} color="bg-green-500" />
              
              <div className="mt-3 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Estimated tokens: {algorandService.calculateBioTokenValue({
                    duration: recording.duration,
                    species: recording.species,
                    iucnStatus: recording.iucnStatus,
                    location: recording.location,
                    qualityScore: recording.qualityScore,
                    isRareLocation: recording.isRareLocation
                  })} BIOTK
                </div>
                <button
                  onClick={() => startBioTokenization(recording)}
                  disabled={!algorandState.isConnected || isTokenizing}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isTokenizing && selectedRecording?.id === recording.id ? 'Tokenizing...' : 'Create Bio-Token'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tokenization Progress */}
      {tokenizationSteps.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bio-Tokenization Progress</h2>
          <div className="space-y-4">
            {tokenizationSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex-shrink-0">
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : step.status === 'processing' ? (
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : step.status === 'error' ? (
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-medium text-gray-900">{step.name}</p>
                  {step.details && (
                    <p className="text-sm text-gray-600">{step.details}</p>
                  )}
                  {step.txId && (
                    <p className="text-xs text-blue-600 font-mono">TX: {step.txId}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Note about TestNet */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
          <div>
            <p className="text-sm text-yellow-800 font-semibold">TestNet Environment</p>
            <p className="text-sm text-yellow-700 mt-1">
              This demo uses Algorand TestNet. Created accounts start with 0 ALGO balance. 
              For testing transactions, you would need to fund accounts with TestNet ALGO from a faucet.
              In production, users would connect funded MainNet wallets using Pera, Defly, or AlgoSigner.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorandTokenization;