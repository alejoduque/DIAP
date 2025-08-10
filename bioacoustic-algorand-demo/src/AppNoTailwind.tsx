import React, { useState, useEffect } from 'react';
import { Play, Volume2, Zap, TrendingUp, MapPin, Shield, Globe, Layers } from 'lucide-react';

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

interface AlgorandTransaction {
  txId: string;
  assetId: string;
  amount: number;
  timestamp: number;
  status: 'pending' | 'confirmed';
}

const BioacousticAlgorandDemo: React.FC = () => {
  const [recording, setRecording] = useState<Recording | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [finalTokens, setFinalTokens] = useState<number>(0);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'processing' | 'blockchain' | 'complete'>('idle');
  const [tokenHistory, setTokenHistory] = useState<number[]>([1]);
  const [blockchainPhase, setBlockchainPhase] = useState<'validation' | 'minting' | 'georef' | 'complete'>('validation');
  const [algorandTx, setAlgorandTx] = useState<AlgorandTransaction | null>(null);
  const [networkStats, setNetworkStats] = useState({
    tps: 6000,
    fee: 0.001,
    finalityTime: 4.5,
    validators: 1847
  });

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

  const AlgorandArchitecture: React.FC<{ animated: boolean }> = ({ animated }) => (
    <div style={{
      position: 'relative',
      background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(88, 28, 135, 0.2))',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      marginBottom: '48px'
    }}>
      <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
        Arquitectura Algorand para Tokens Ambientales
      </h3>
      
      {/* Layer 1 - Blockchain Base */}
      <div style={{
        background: 'rgba(37, 99, 235, 0.3)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        border: '1px solid rgba(59, 130, 246, 0.5)',
        animation: animated ? 'pulse 2s infinite' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Layers style={{ width: '24px', height: '24px', color: '#60a5fa' }} />
          <div>
            <div style={{ color: '#93c5fd', fontWeight: '600' }}>Capa 1 - Blockchain Algorand</div>
            <div style={{ color: '#d1d5db', fontSize: '14px' }}>Consenso Pure Proof-of-Stake • Finalidad instantánea</div>
          </div>
        </div>
        <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '12px' }}>
          <div style={{ background: 'rgba(30, 64, 175, 0.5)', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ color: '#bfdbfe' }}>TPS</div>
            <div style={{ color: 'white', fontWeight: 'bold' }}>{networkStats.tps.toLocaleString()}</div>
          </div>
          <div style={{ background: 'rgba(30, 64, 175, 0.5)', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ color: '#bfdbfe' }}>Fee</div>
            <div style={{ color: 'white', fontWeight: 'bold' }}>{networkStats.fee} ALGO</div>
          </div>
          <div style={{ background: 'rgba(30, 64, 175, 0.5)', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ color: '#bfdbfe' }}>Finalidad</div>
            <div style={{ color: 'white', fontWeight: 'bold' }}>{networkStats.finalityTime}s</div>
          </div>
        </div>
      </div>

      {/* Layer 2 - Smart Contracts */}
      <div style={{
        background: 'rgba(34, 197, 94, 0.3)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        border: '1px solid rgba(34, 197, 94, 0.5)',
        animation: animated ? 'pulse 2s infinite' : 'none',
        animationDelay: '0.5s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield style={{ width: '24px', height: '24px', color: '#4ade80' }} />
          <div>
            <div style={{ color: '#86efac', fontWeight: '600' }}>Smart Contracts AVM</div>
            <div style={{ color: '#d1d5db', fontSize: '14px' }}>Validación automática • Metadata inmutable</div>
          </div>
        </div>
      </div>

      {/* Layer 3 - Georeferencing */}
      <div style={{
        background: 'rgba(147, 51, 234, 0.3)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        border: '1px solid rgba(147, 51, 234, 0.5)',
        animation: animated ? 'pulse 2s infinite' : 'none',
        animationDelay: '1s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MapPin style={{ width: '24px', height: '24px', color: '#a855f7' }} />
          <div>
            <div style={{ color: '#c084fc', fontWeight: '600' }}>Georeferenciación</div>
            <div style={{ color: '#d1d5db', fontSize: '14px' }}>Coordenadas verificables • Prueba de ubicación</div>
          </div>
        </div>
      </div>

      {/* Layer 4 - Environmental Token */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.3)',
        borderRadius: '8px',
        padding: '16px',
        border: '1px solid rgba(16, 185, 129, 0.5)',
        animation: animated ? 'pulse 2s infinite' : 'none',
        animationDelay: '1.5s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Globe style={{ width: '24px', height: '24px', color: '#34d399' }} />
          <div>
            <div style={{ color: '#6ee7b7', fontWeight: '600' }}>BIOTOKEN ASA</div>
            <div style={{ color: '#d1d5db', fontSize: '14px' }}>Token estándar ASA • Transferible • Divisible</div>
          </div>
        </div>
      </div>

      {/* Network visualization */}
      <div style={{ position: 'absolute', top: '-8px', right: '-8px' }}>
        <div style={{
          width: '16px',
          height: '16px',
          background: '#22c55e',
          borderRadius: '50%',
          animation: 'ping 1s infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '16px',
          height: '16px',
          background: '#22c55e',
          borderRadius: '50%'
        }}></div>
      </div>
    </div>
  );

  const WaveformViz: React.FC<{ data: number[], color: string, animated?: boolean }> = ({ data, color, animated = false }) => (
    <div style={{
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      padding: '8px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1px', height: '100%', width: '100%' }}>
        {data.map((value, i) => (
          <div
            key={i}
            style={{
              backgroundColor: color,
              height: `${Math.abs(value) * 100}%`,
              width: '1%',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              animationDelay: animated ? `${i * 10}ms` : '0ms'
            }}
          />
        ))}
      </div>
    </div>
  );

  const BiodiversityMap: React.FC<{ isRare: boolean, animated?: boolean, coordinates?: [number, number] }> = ({ isRare, animated = false, coordinates }) => (
    <div style={{
      position: 'relative',
      height: '128px',
      background: 'linear-gradient(135deg, #dcfce7, #dbeafe)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Background terrain */}
      <div style={{ position: 'absolute', inset: '0' }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              background: isRare ? '#fca5a5' : '#d1d5db',
              opacity: 0.3,
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
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        <div style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: isRare ? '#ef4444' : '#3b82f6',
          animation: animated ? 'ping 1s infinite' : 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: isRare ? '#ef4444' : '#3b82f6'
        }} />
      </div>

      {/* Coordinates display */}
      {coordinates && (
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          background: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '12px',
          color: 'white'
        }}>
          {coordinates[0].toFixed(3)}, {coordinates[1].toFixed(3)}
        </div>
      )}
    </div>
  );

  const getCalculationSteps = (rec: Recording): CalculationStep[] => [
    {
      id: 'duration',
      name: 'Análisis de Duración de Audio',
      value: Math.floor(rec.duration / 30),
      description: `Grabación de ${rec.duration}s procesada con algoritmo de segmentación temporal`,
      color: 'linear-gradient(to right, #60a5fa, #2563eb)',
      delay: 800,
      chartData: { waveform: rec.waveform }
    },
    {
      id: 'metadata',
      name: 'Puntuación de Completitud de Metadatos',
      value: rec.metadataComplete ? 1.8 : 1.0,
      description: 'Modelo de machine learning evalúa riqueza de datos y valor científico',
      color: 'linear-gradient(to right, #4ade80, #16a34a)',
      delay: 1600,
      chartData: { completeness: rec.metadataComplete ? 90 : 30 }
    },
    {
      id: 'location',
      name: 'Detección de Hotspot de Biodiversidad',
      value: rec.isRareLocation ? 2.5 : 1.0,
      description: 'Análisis geoespacial referenciado con bases de datos de biodiversidad',
      color: 'linear-gradient(to right, #a855f7, #9333ea)',
      delay: 2400,
      chartData: { isRare: rec.isRareLocation, coordinates: rec.coordinates }
    },
    {
      id: 'iucn',
      name: 'Matriz de Prioridad de Conservación',
      value: rec.iucnStatus === 'CR' ? 5.0 : 
             rec.iucnStatus === 'EN' ? 3.0 :
             rec.iucnStatus === 'VU' ? 2.0 :
             rec.iucnStatus === 'NT' ? 1.5 : 1.0,
      description: 'Integración API Lista Roja IUCN con pipeline de identificación de especies',
      color: rec.iucnStatus === 'CR' ? 'linear-gradient(to right, #ef4444, #dc2626)' :
             rec.iucnStatus === 'EN' ? 'linear-gradient(to right, #f97316, #ea580c)' :
             rec.iucnStatus === 'VU' ? 'linear-gradient(to right, #eab308, #d97706)' :
             'linear-gradient(to right, #9ca3af, #6b7280)',
      delay: 3200,
      chartData: { species: rec.species, status: rec.iucnStatus }
    },
    {
      id: 'quality',
      name: 'Evaluación de Calidad Espectral',
      value: rec.qualityScore,
      description: 'Modelo de deep learning analiza dominio de frecuencia para reducción de ruido y claridad',
      color: rec.qualityScore > 0.8 ? 'linear-gradient(to right, #10b981, #059669)' :
             rec.qualityScore > 0.6 ? 'linear-gradient(to right, #f59e0b, #d97706)' :
             'linear-gradient(to right, #ef4444, #dc2626)',
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
              setAnimationPhase('blockchain');
              setCurrentStep(null);
              startBlockchainProcess(newTotal);
            }, 1000);
          }
        }, 600);
      }, step.delay);
    });
  };

  const startBlockchainProcess = (tokens: number) => {
    // Generate mock transaction
    const txId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const assetId = `ASA${Math.floor(Math.random() * 1000000)}`;
    
    setAlgorandTx({
      txId,
      assetId,
      amount: tokens,
      timestamp: Date.now(),
      status: 'pending'
    });

    // Blockchain animation sequence
    const phases = ['validation', 'minting', 'georef', 'complete'];
    
    phases.forEach((phase, index) => {
      setTimeout(() => {
        setBlockchainPhase(phase as any);
        
        if (phase === 'complete') {
          setAlgorandTx(prev => prev ? {...prev, status: 'confirmed'} : null);
          setTimeout(() => {
            setAnimationPhase('complete');
          }, 1000);
        }
      }, (index + 1) * 2000);
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
    setBlockchainPhase('validation');
    setAlgorandTx(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Add CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.8) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Animated Background */}
      <div style={{ position: 'absolute', inset: '0', overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '40px',
          width: '384px',
          height: '384px',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '240px',
          right: '80px',
          width: '320px',
          height: '320px',
          background: 'rgba(147, 51, 234, 0.1)',
          borderRadius: '50%',
          animation: 'pulse 2s infinite',
          animationDelay: '2s'
        }}></div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            borderRadius: '9999px',
            padding: '16px 32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Volume2 style={{ width: '40px', height: '40px', color: '#34d399' }} />
            <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Motor de Inteligencia Bioacústica
            </h1>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(to right, #3b82f6, #9333ea)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>A</span>
            </div>
          </div>
          <p style={{ color: '#d1d5db', marginTop: '24px', fontSize: '20px', margin: '24px 0 0 0' }}>
            Tokenización neural de grabaciones de biodiversidad en Algorand
          </p>
          <div style={{
            marginTop: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#93c5fd'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#22c55e',
              borderRadius: '50%',
              animation: 'ping 1s infinite'
            }}></div>
            <span style={{ fontSize: '14px' }}>Red Algorand • {networkStats.validators.toLocaleString()} validadores activos</span>
          </div>
        </div>

        {/* Algorand Architecture */}
        <AlgorandArchitecture animated={animationPhase !== 'idle'} />

        {/* Recording Cards */}
        {animationPhase === 'idle' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: '48px'
          }}>
            {sampleRecordings.map((rec) => (
              <div
                key={rec.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => startCalculation(rec)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: 'linear-gradient(135deg, #34d399, #3b82f6)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.3s ease'
                  }}>
                    <Play style={{ width: '28px', height: '28px', color: 'white', marginLeft: '4px' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>Muestra {rec.id}</h3>
                    <p style={{ color: '#d1d5db', margin: '4px 0 0 0' }}>{rec.duration}s • {rec.location}</p>
                  </div>
                </div>

                <WaveformViz data={rec.waveform} color="#34d399" />
                
                {rec.species && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2))',
                    borderRadius: '8px',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    <div style={{ color: '#6ee7b7', fontWeight: 'bold', fontStyle: 'italic' }}>{rec.species}</div>
                    {rec.iucnStatus && (
                      <div style={{ color: '#fca5a5', fontSize: '14px', marginTop: '4px' }}>
                        Estado de Conservación: {rec.iucnStatus}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ marginTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#d1d5db', fontSize: '14px' }}>Puntuación de Calidad</span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{(rec.qualityScore * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ width: '100%', background: '#374151', borderRadius: '9999px', height: '8px' }}>
                    <div style={{
                      background: 'linear-gradient(to right, #34d399, #3b82f6)',
                      height: '8px',
                      borderRadius: '9999px',
                      transition: 'all 0.3s ease',
                      width: `${rec.qualityScore * 100}%`
                    }} />
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <BiodiversityMap 
                    isRare={rec.isRareLocation} 
                    coordinates={rec.coordinates}
                  />
                </div>

                <button style={{
                  width: '100%',
                  marginTop: '24px',
                  background: 'linear-gradient(to right, #10b981, #3b82f6)',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}>
                  Analizar y Tokenizar →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Processing Visualization */}
        {animationPhase === 'processing' && recording && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '384px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(16px)',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              maxWidth: '1152px',
              width: '100%'
            }}>
              
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #34d399, #3b82f6)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'spin 2s linear infinite'
                  }}>
                    <TrendingUp style={{ width: '32px', height: '32px', color: 'white' }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: 'white', margin: 0 }}>Análisis Neural en Progreso</h2>
                    <p style={{ color: '#d1d5db', margin: '4px 0 0 0' }}>{recording.location} • {recording.species || 'Detección de especies activa'}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {getCalculationSteps(recording).map((step, index) => (
                    <div
                      key={step.id}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        transition: 'all 0.7s ease',
                        border: completedSteps.includes(step.id)
                          ? '1px solid rgba(255, 255, 255, 0.3)'
                          : currentStep === step.id
                          ? '1px solid rgba(255, 255, 255, 0.5)'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        background: completedSteps.includes(step.id)
                          ? step.color
                          : currentStep === step.id
                          ? step.color
                          : 'rgba(255, 255, 255, 0.05)',
                        boxShadow: completedSteps.includes(step.id) || currentStep === step.id
                          ? '0 10px 25px rgba(0, 0, 0, 0.3)'
                          : 'none',
                        transform: completedSteps.includes(step.id) || currentStep === step.id
                          ? 'scale(1.05)'
                          : 'scale(1)',
                        animation: currentStep === step.id ? 'pulse 1s infinite' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: 'white', fontWeight: '600' }}>{step.name}</span>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                          {step.id === 'duration' ? step.value : `×${step.value}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '16px' }}>Flujo de Tokens</h3>
                    <div style={{
                      height: '96px',
                      background: 'linear-gradient(to right, #dbeafe, #f3e8ff)',
                      borderRadius: '8px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'flex-end'
                    }}>
                      {tokenHistory.map((value, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                          <div
                            style={{
                              background: i === tokenHistory.length - 1 
                                ? 'linear-gradient(to top, #22c55e, #eab308)'
                                : 'linear-gradient(to top, #3b82f6, #9333ea)',
                              borderTopLeftRadius: '2px',
                              borderTopRightRadius: '2px',
                              transition: 'all 0.7s ease',
                              minHeight: '4px',
                              height: `${Math.min((value / Math.max(...tokenHistory, finalTokens)) * 60, 60)}px`,
                              animation: i === tokenHistory.length - 1 ? 'pulse 1s infinite' : 'none'
                            }}
                          />
                          <div style={{
                            fontSize: '12px',
                            marginTop: '4px',
                            color: i === tokenHistory.length - 1 ? '#16a34a' : '#6b7280',
                            fontWeight: i === tokenHistory.length - 1 ? 'bold' : 'normal'
                          }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <div style={{ color: '#d1d5db', marginBottom: '8px' }}>Tokens Generados</div>
                    <div style={{
                      fontSize: '72px',
                      fontWeight: 'bold',
                      background: 'linear-gradient(to right, #34d399, #3b82f6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {finalTokens}
                    </div>
                    <div style={{ color: '#d1d5db', marginTop: '8px' }}>BIOTOKEN</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blockchain Processing */}
        {animationPhase === 'blockchain' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '384px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(16px)',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              maxWidth: '1152px',
              width: '100%'
            }}>
              
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #60a5fa, #a855f7)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      border: '4px solid white',
                      borderTop: '4px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  </div>
                  <div>
                    <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: 'white', margin: 0 }}>Procesamiento en Blockchain Algorand</h2>
                    <p style={{ color: '#d1d5db', margin: '4px 0 0 0' }}>Creando token ASA georeferenciado</p>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: 'linear-gradient(to right, #1e293b, #0f172a)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #475569'
                }}>
                  <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '24px' }}>Proceso en Blockchain Algorand</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Step 1: Validation */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      borderRadius: '8px',
                      transition: 'all 0.7s ease',
                      background: blockchainPhase === 'validation' ? '#2563eb' : 
                                 ['minting', 'georef', 'complete'].includes(blockchainPhase) ? '#16a34a' : '#374151',
                      boxShadow: blockchainPhase === 'validation' ? '0 10px 25px rgba(37, 99, 235, 0.3)' : 'none'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {blockchainPhase === 'validation' ? (
                          <div style={{
                            width: '16px',
                            height: '16px',
                            background: '#60a5fa',
                            borderRadius: '50%',
                            animation: 'ping 1s infinite'
                          }}></div>
                        ) : ['minting', 'georef', 'complete'].includes(blockchainPhase) ? (
                          <div style={{ width: '16px', height: '16px', background: '#4ade80', borderRadius: '50%' }}></div>
                        ) : (
                          <div style={{ width: '16px', height: '16px', background: '#9ca3af', borderRadius: '50%' }}></div>
                        )}
                      </div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ color: 'white', fontWeight: '600' }}>1. Validación de Datos</div>
                        <div style={{ color: '#d1d5db', fontSize: '14px' }}>Smart contract verifica metadata bioacústica</div>
                      </div>
                    </div>

                    {/* Step 2: Minting */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      borderRadius: '8px',
                      transition: 'all 0.7s ease',
                      background: blockchainPhase === 'minting' ? '#9333ea' : 
                                 ['georef', 'complete'].includes(blockchainPhase) ? '#16a34a' : '#374151',
                      boxShadow: blockchainPhase === 'minting' ? '0 10px 25px rgba(147, 51, 234, 0.3)' : 'none'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {blockchainPhase === 'minting' ? (
                          <div style={{
                            width: '16px',
                            height: '16px',
                            background: '#a855f7',
                            borderRadius: '50%',
                            animation: 'ping 1s infinite'
                          }}></div>
                        ) : ['georef', 'complete'].includes(blockchainPhase) ? (
                          <div style={{ width: '16px', height: '16px', background: '#4ade80', borderRadius: '50%' }}></div>
                        ) : (
                          <div style={{ width: '16px', height: '16px', background: '#9ca3af', borderRadius: '50%' }}></div>
                        )}
                      </div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ color: 'white', fontWeight: '600' }}>2. Acuñación de Token ASA</div>
                        <div style={{ color: '#d1d5db', fontSize: '14px' }}>Creación de {finalTokens} BIOTOKEN en Algorand</div>
                      </div>
                    </div>

                    {/* Step 3: Georeferencing */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      borderRadius: '8px',
                      transition: 'all 0.7s ease',
                      background: blockchainPhase === 'georef' ? '#059669' : 
                                 blockchainPhase === 'complete' ? '#16a34a' : '#374151',
                      boxShadow: blockchainPhase === 'georef' ? '0 10px 25px rgba(5, 150, 105, 0.3)' : 'none'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {blockchainPhase === 'georef' ? (
                          <div style={{
                            width: '16px',
                            height: '16px',
                            background: '#10b981',
                            borderRadius: '50%',
                            animation: 'ping 1s infinite'
                          }}></div>
                        ) : blockchainPhase === 'complete' ? (
                          <div style={{ width: '16px', height: '16px', background: '#4ade80', borderRadius: '50%' }}></div>
                        ) : (
                          <div style={{ width: '16px', height: '16px', background: '#9ca3af', borderRadius: '50%' }}></div>
                        )}
                      </div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ color: 'white', fontWeight: '600' }}>3. Registro Georeferenciado</div>
                        <div style={{ color: '#d1d5db', fontSize: '14px' }}>Coordenadas y timestamp inmutables</div>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    {algorandTx && (
                      <div style={{
                        marginTop: '24px',
                        padding: '16px',
                        background: 'linear-gradient(to right, rgba(30, 58, 138, 0.3), rgba(88, 28, 135, 0.3))',
                        borderRadius: '8px',
                        border: '1px solid rgba(59, 130, 246, 0.3)'
                      }}>
                        <div style={{ color: '#93c5fd', fontWeight: '600', marginBottom: '8px' }}>Detalles de Transacción</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#d1d5db' }}>TX ID:</span>
                            <span style={{ color: '#60a5fa', fontFamily: 'monospace' }}>{algorandTx.txId}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#d1d5db' }}>Asset ID:</span>
                            <span style={{ color: '#4ade80', fontFamily: 'monospace' }}>{algorandTx.assetId}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#d1d5db' }}>Estado:</span>
                            <span style={{
                              fontWeight: '600',
                              color: algorandTx.status === 'confirmed' ? '#4ade80' : '#facc15'
                            }}>
                              {algorandTx.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completion */}
        {animationPhase === 'complete' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '384px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(16px)',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              maxWidth: '768px',
              width: '100%',
              textAlign: 'center',
              animation: 'scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
              <div style={{
                width: '96px',
                height: '96px',
                background: 'linear-gradient(135deg, #34d399, #3b82f6)',
                borderRadius: '50%',
                margin: '0 auto 32px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'bounce 1s infinite'
              }}>
                <Zap style={{ width: '48px', height: '48px', color: 'white' }} />
              </div>
              
              <h2 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '16px', color: 'white' }}>¡Token ASA Creado Exitosamente!</h2>
              <div style={{
                fontSize: '96px',
                fontWeight: 'bold',
                marginBottom: '24px',
                background: 'linear-gradient(to right, #34d399, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {finalTokens}
              </div>
              <p style={{ fontSize: '20px', color: '#d1d5db', marginBottom: '32px' }}>BIOTOKEN acuñados en Algorand</p>

              {/* Transaction success details */}
              {algorandTx && (
                <div style={{
                  background: 'linear-gradient(to right, rgba(5, 150, 105, 0.3), rgba(16, 185, 129, 0.3))',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '32px',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  <h3 style={{ color: '#6ee7b7', fontWeight: 'bold', marginBottom: '16px' }}>Detalles de Transacción Confirmada</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '14px' }}>
                    <div>
                      <div style={{ color: '#d1d5db' }}>ID de Transacción:</div>
                      <div style={{ color: '#4ade80', fontFamily: 'monospace', wordBreak: 'break-all' }}>{algorandTx.txId}</div>
                    </div>
                    <div>
                      <div style={{ color: '#d1d5db' }}>ID de Asset (ASA):</div>
                      <div style={{ color: '#60a5fa', fontFamily: 'monospace' }}>{algorandTx.assetId}</div>
                    </div>
                    <div>
                      <div style={{ color: '#d1d5db' }}>Estado:</div>
                      <div style={{ color: '#4ade80', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          background: '#22c55e',
                          borderRadius: '50%',
                          animation: 'ping 1s infinite'
                        }}></div>
                        Confirmado
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#d1d5db' }}>Finalización:</div>
                      <div style={{ color: 'white' }}>{networkStats.finalityTime}s</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Environmental impact stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <div style={{
                  background: 'rgba(30, 58, 138, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                  <div style={{ color: '#93c5fd', fontSize: '14px', marginBottom: '8px' }}>Impacto Ambiental</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>~0.00001</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>kWh consumidos</div>
                </div>
                <div style={{
                  background: 'rgba(5, 150, 105, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  <div style={{ color: '#6ee7b7', fontSize: '14px', marginBottom: '8px' }}>Huella de Carbono</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>0.000004</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>kg CO₂</div>
                </div>
                <div style={{
                  background: 'rgba(88, 28, 135, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid rgba(147, 51, 234, 0.3)'
                }}>
                  <div style={{ color: '#c084fc', fontSize: '14px', marginBottom: '8px' }}>Eficiencia</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>99.99%</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>vs. otras blockchains</div>
                </div>
              </div>
              
              <button
                onClick={resetDemo}
                style={{
                  background: 'linear-gradient(to right, #10b981, #3b82f6)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Analizar Otra Muestra
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BioacousticAlgorandDemo;