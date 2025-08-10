import React, { useState, useEffect } from 'react';
import { Play, Volume2, Zap, TrendingUp } from 'lucide-react';

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

interface CalculationStep {
  id: string;
  name: string;
  value: number;
  description: string;
  color: string;
  delay: number;
  chartData: any;
}

const BioacousticTokenizationDemo: React.FC = () => {
  const [recording, setRecording] = useState<Recording | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [finalTokens, setFinalTokens] = useState<number>(0);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'processing' | 'complete'>('idle');
  const [tokenHistory, setTokenHistory] = useState<number[]>([1]);

  // Generate mock waveform data
  const generateWaveform = (duration: number, quality: number): number[] => {
    return Array.from({ length: 100 }, (_, i) => {
      const noise = Math.random() * (1 - quality);
      const signal = Math.sin(i * 0.3) * quality + Math.sin(i * 0.1) * 0.5;
      return Math.max(-1, Math.min(1, signal + noise));
    });
  };

  // Generate mock spectrogram data
  const generateSpectrogram = (quality: number): number[][] => {
    return Array.from({ length: 20 }, (_, freq) => 
      Array.from({ length: 50 }, (_, time) => {
        const intensity = quality * Math.random() * (1 - freq * 0.02);
        return Math.max(0, intensity);
      })
    );
  };

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
      waveform: generateWaveform(180, 0.92),
      spectrogram: generateSpectrogram(0.92)
    },
    {
      id: '2', 
      duration: 75,
      location: 'Sierra Nevada',
      species: 'Atlapetes flaviceps',
      iucnStatus: 'CR',
      qualityScore: 0.78,
      metadataComplete: true,
      isRareLocation: true,
      coordinates: [10.8, -73.7],
      waveform: generateWaveform(75, 0.78),
      spectrogram: generateSpectrogram(0.78)
    },
    {
      id: '3',
      duration: 45,
      location: 'Medellín Centro',
      qualityScore: 0.35,
      metadataComplete: false,
      isRareLocation: false,
      coordinates: [6.244, -75.581],
      waveform: generateWaveform(45, 0.35),
      spectrogram: generateSpectrogram(0.35)
    }
  ];

  const WaveformViz: React.FC<{ data: number[], color: string, animated?: boolean }> = ({ data, color, animated = false }) => (
    <div className="h-20 flex items-center justify-center bg-black/10 rounded-lg p-2">
      <div className="flex items-center gap-px h-full w-full">
        {data.map((value, i) => (
          <div
            key={i}
            className={`${color} transition-all duration-300 rounded-sm`}
            style={{
              height: `${Math.abs(value) * 100}%`,
              width: '1%',
              animationDelay: animated ? `${i * 10}ms` : '0ms'
            }}
          />
        ))}
      </div>
    </div>
  );

  const SpectrogramViz: React.FC<{ data: number[][], animated?: boolean }> = ({ data, animated = false }) => (
    <div className="h-32 bg-black rounded-lg p-1">
      <div className="grid grid-rows-20 h-full gap-px">
        {data.map((freqBand, freq) => (
          <div key={freq} className="flex gap-px">
            {freqBand.map((intensity, time) => (
              <div
                key={time}
                className="flex-1 transition-all duration-500"
                style={{
                  backgroundColor: `hsl(${240 - intensity * 120}, 100%, ${intensity * 70}%)`,
                  animationDelay: animated ? `${time * 50}ms` : '0ms'
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const RadialProgress: React.FC<{ percentage: number, color: string, size: number, label: string }> = ({ percentage, color, size, label }) => {
    const circumference = 2 * Math.PI * (size / 2 - 10);
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 10}
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 10}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className={color}
              style={{
                transition: 'stroke-dashoffset 1s ease-out'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{percentage}%</span>
          </div>
        </div>
        <span className="text-sm mt-2 text-center">{label}</span>
      </div>
    );
  };

  const TokenFlowChart: React.FC<{ history: number[], current: number }> = ({ history, current }) => (
    <div className="h-24 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 flex items-end">
      {history.map((value, i) => (
        <div key={i} className="flex flex-col items-center flex-1">
          <div
            className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-sm transition-all duration-700 min-h-1"
            style={{ height: `${Math.min((value / Math.max(...history, current)) * 60, 60)}px` }}
          />
          <div className="text-xs mt-1 text-gray-600">{value}</div>
        </div>
      ))}
      <div className="flex flex-col items-center flex-1">
        <div
          className="bg-gradient-to-t from-green-500 to-yellow-400 rounded-t-sm animate-pulse min-h-1"
          style={{ height: `${Math.min((current / Math.max(...history, current)) * 60, 60)}px` }}
        />
        <div className="text-xs mt-1 text-green-600 font-bold">{current}</div>
      </div>
    </div>
  );

  const BiodiversityMap: React.FC<{ isRare: boolean, animated?: boolean }> = ({ isRare, animated = false }) => (
    <div className="relative h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden">
      {/* Background terrain */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${isRare ? 'bg-red-300' : 'bg-gray-300'} opacity-30`}
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              animationDelay: animated ? `${i * 100}ms` : '0ms'
            }}
          />
        ))}
      </div>
      
      {/* Recording location pulse */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className={`w-4 h-4 rounded-full ${isRare ? 'bg-red-500' : 'bg-blue-500'} ${animated ? 'animate-ping' : ''}`} />
        <div className={`absolute top-0 left-0 w-4 h-4 rounded-full ${isRare ? 'bg-red-500' : 'bg-blue-500'}`} />
      </div>

      {/* Biodiversity density visualization */}
      <div className="absolute bottom-2 left-2 text-xs">
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-8 ${isRare ? 'bg-gradient-to-t from-red-200 to-red-500' : 'bg-gradient-to-t from-gray-200 to-gray-400'} rounded-sm`}
              style={{
                height: isRare ? `${(i + 3) * 4}px` : `${(i + 1) * 2}px`,
                animationDelay: animated ? `${i * 200}ms` : '0ms'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const getCalculationSteps = (rec: Recording): CalculationStep[] => [
    {
      id: 'duration',
      name: 'Audio Duration Analysis',
      value: Math.floor(rec.duration / 30),
      description: `${rec.duration}s recording processed through temporal segmentation algorithm`,
      color: 'from-blue-400 to-blue-600',
      delay: 800,
      chartData: { waveform: rec.waveform }
    },
    {
      id: 'metadata',
      name: 'Metadata Completeness Score',
      value: rec.metadataComplete ? 1.8 : 1.0,
      description: 'Machine learning model evaluates data richness and scientific value',
      color: 'from-green-400 to-green-600',
      delay: 1600,
      chartData: { completeness: rec.metadataComplete ? 90 : 30 }
    },
    {
      id: 'location',
      name: 'Biodiversity Hotspot Detection',
      value: rec.isRareLocation ? 2.5 : 1.0,
      description: 'Geospatial analysis cross-referenced with biodiversity databases',
      color: 'from-purple-400 to-purple-600',
      delay: 2400,
      chartData: { isRare: rec.isRareLocation }
    },
    {
      id: 'iucn',
      name: 'Conservation Priority Matrix',
      value: rec.iucnStatus === 'CR' ? 5.0 : 
             rec.iucnStatus === 'EN' ? 3.0 :
             rec.iucnStatus === 'VU' ? 2.0 :
             rec.iucnStatus === 'NT' ? 1.5 : 1.0,
      description: 'IUCN Red List API integration with species identification pipeline',
      color: rec.iucnStatus === 'CR' ? 'from-red-500 to-red-700' :
             rec.iucnStatus === 'EN' ? 'from-orange-500 to-red-600' :
             rec.iucnStatus === 'VU' ? 'from-yellow-500 to-orange-600' :
             'from-gray-400 to-gray-600',
      delay: 3200,
      chartData: { species: rec.species, status: rec.iucnStatus }
    },
    {
      id: 'quality',
      name: 'Spectral Quality Assessment',
      value: rec.qualityScore,
      description: 'Deep learning model analyzes frequency domain for noise reduction and clarity',
      color: rec.qualityScore > 0.8 ? 'from-emerald-400 to-emerald-600' :
             rec.qualityScore > 0.6 ? 'from-yellow-400 to-yellow-600' :
             'from-red-400 to-red-600',
      delay: 4000,
      chartData: { spectrogram: rec.spectrogram, quality: rec.qualityScore }
    }
  ];

  const startCalculation = (selectedRecording: Recording) => {
    setRecording(selectedRecording);
    setIsCalculating(true);
    setCurrentStep(null);
    setCompletedSteps([]);
    setFinalTokens(0);
    setAnimationPhase('processing');
    setTokenHistory([1]);

    const steps = getCalculationSteps(selectedRecording);
    let runningTotal = 1;

    steps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(step.id);
        
        setTimeout(() => {
          if (index === 0) {
            runningTotal = step.value;
          } else {
            runningTotal *= step.value;
          }
          
          setCompletedSteps(prev => [...prev, step.id]);
          const newTotal = Math.round(runningTotal);
          setFinalTokens(newTotal);
          setTokenHistory(prev => [...prev, newTotal]);
          
          if (index === steps.length - 1) {
            setTimeout(() => {
              setIsCalculating(false);
              setAnimationPhase('complete');
              setCurrentStep(null);
            }, 1000);
          }
        }, 600);
      }, step.delay);
    });
  };

  const resetDemo = () => {
    setRecording(null);
    setIsCalculating(false);
    setCurrentStep(null);
    setCompletedSteps([]);
    setFinalTokens(0);
    setAnimationPhase('idle');
    setShowModal(null);
    setTokenHistory([1]);
  };

  const Modal: React.FC<{ step: CalculationStep }> = ({ step }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-2xl mx-4 shadow-2xl transform animate-scale-in">
        <div className={`w-full h-3 bg-gradient-to-r ${step.color} rounded-full mb-6`}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">{step.name}</h3>
            <div className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {step.id === 'duration' ? `${step.value}` : `×${step.value}`}
            </div>
            <p className="text-gray-600 mb-6">{step.description}</p>
          </div>
          
          <div className="space-y-4">
            {step.id === 'duration' && step.chartData.waveform && (
              <WaveformViz data={step.chartData.waveform} color="bg-blue-500" animated={true} />
            )}
            
            {step.id === 'metadata' && (
              <RadialProgress 
                percentage={step.chartData.completeness} 
                color="text-green-500" 
                size={120} 
                label="Data Quality"
              />
            )}
            
            {step.id === 'location' && (
              <BiodiversityMap isRare={step.chartData.isRare} animated={true} />
            )}
            
            {step.id === 'iucn' && step.chartData.species && (
              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
                <div className="text-lg font-bold italic text-red-700 mb-2">{step.chartData.species}</div>
                <div className="text-sm text-red-600">Conservation Priority: {step.chartData.status || 'Unknown'}</div>
                <div className="mt-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div 
                      key={i} 
                      className={`inline-block w-3 h-8 mx-1 rounded ${i < step.value ? 'bg-red-500' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {step.id === 'quality' && step.chartData.spectrogram && (
              <div className="space-y-2">
                <SpectrogramViz data={step.chartData.spectrogram} animated={true} />
                <RadialProgress 
                  percentage={Math.round(step.chartData.quality * 100)} 
                  color="text-emerald-500" 
                  size={80} 
                  label="Audio Clarity"
                />
              </div>
            )}
          </div>
        </div>
        
        <button 
          onClick={() => setShowModal(null)}
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Continue Analysis →
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    if (currentStep) {
      const timer = setTimeout(() => {
        const steps = recording ? getCalculationSteps(recording) : [];
        const step = steps.find(s => s.id === currentStep);
        if (step) {
          setShowModal(currentStep);
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [currentStep, recording]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-purple-500/10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-full px-8 py-4 shadow-xl border border-white/20">
            <Volume2 className="w-10 h-10 text-emerald-400" />
            <h1 className="text-3xl font-bold text-white">
              Bioacoustic Intelligence Engine
            </h1>
          </div>
          <p className="text-gray-300 mt-6 text-xl">
            Neural network tokenization of biodiversity recordings
          </p>
        </div>

        {/* Recording Cards */}
        {animationPhase === 'idle' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {sampleRecordings.map((rec) => (
              <div
                key={rec.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:-translate-y-2 group"
                onClick={() => startCalculation(rec)}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-white ml-1" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Sample {rec.id}</h3>
                    <p className="text-gray-300">{rec.duration}s • {rec.location}</p>
                  </div>
                </div>

                <WaveformViz data={rec.waveform} color="bg-emerald-400" />
                
                {rec.species && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg border border-emerald-500/30">
                    <div className="text-emerald-300 font-bold italic">{rec.species}</div>
                    {rec.iucnStatus && (
                      <div className="text-red-400 text-sm mt-1">
                        Conservation Status: {rec.iucnStatus}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 text-sm">Quality Score</span>
                    <span className="text-white font-bold">{(rec.qualityScore * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${rec.qualityScore * 100}%` }}
                    />
                  </div>
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all group-hover:scale-105">
                  Analyze & Tokenize →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Processing Visualization */}
        {animationPhase === 'processing' && recording && (
          <div className="flex flex-col items-center justify-center min-h-96">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-white/20 max-w-4xl w-full">
              
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center animate-spin">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Neural Analysis in Progress</h2>
                    <p className="text-gray-300">{recording.location} • {recording.species || 'Species detection active'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {getCalculationSteps(recording).map((step, index) => (
                    <div
                      key={step.id}
                      className={`p-4 rounded-xl transition-all duration-700 border ${
                        completedSteps.includes(step.id)
                          ? `bg-gradient-to-r ${step.color} border-white/30 shadow-lg scale-105`
                          : currentStep === step.id
                          ? `bg-gradient-to-r ${step.color} border-white/50 shadow-xl animate-pulse scale-105`
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">{step.name}</span>
                        <div className="text-2xl font-bold text-white">
                          {step.id === 'duration' ? step.value : `×${step.value}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-white font-semibold mb-4">Token Flow</h3>
                    <TokenFlowChart history={tokenHistory.slice(0, -1)} current={finalTokens} />
                  </div>
                  
                  <div className="text-center bg-white/10 rounded-xl p-6 border border-white/20">
                    <div className="text-gray-300 mb-2">Generated Tokens</div>
                    <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                      {finalTokens}
                    </div>
                    <div className="text-gray-300 mt-2">BIOTOKEN</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completion */}
        {animationPhase === 'complete' && (
          <div className="flex flex-col items-center justify-center min-h-96">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-white/20 max-w-lg w-full text-center animate-scale-in">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full mx-auto mb-8 flex items-center justify-center animate-bounce">
                <Zap className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold mb-4 text-white">Analysis Complete</h2>
              <div className="text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                {finalTokens}
              </div>
              <p className="text-xl text-gray-300 mb-8">BIOTOKEN minted</p>
              
              <button
                onClick={resetDemo}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 px-8 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105"
              >
                Analyze Another Sample
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Modal */}
      {showModal && currentStep && recording && (
        <Modal step={getCalculationSteps(recording).find(s => s.id === currentStep)!} />
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.8) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

export default BioacousticTokenizationDemo;