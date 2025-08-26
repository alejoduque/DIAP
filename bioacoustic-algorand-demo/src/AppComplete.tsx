import React, { useState } from 'react';
import AlgorandTokenization from './components/AlgorandTokenization';
import EcologicalParliament from './components/EcologicalParliament';
import ErrorBoundary from './components/ErrorBoundary';
import { NotificationProvider, NotificationContainer } from './components/NotificationSystem';
import { LoadingSpinner } from './components/LoadingSpinner';
import { 
  Leaf, Vote, Zap, Network, Globe, TreePine, 
  Users, ArrowRight, CheckCircle, Lightbulb 
} from 'lucide-react';
import './App.css';

/**
 * Complete Bio-Token Application
 * Demonstrates the evolution from individual bio-tokens to ecological parliament governance
 */
function AppComplete() {
  const [currentView, setCurrentView] = useState<'overview' | 'tokenization' | 'parliament'>('overview');
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Application Error:', error);
    console.error('Error Info:', errorInfo);
  };

  const OverviewSection = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* Hero Section */}
      <div className="text-center py-16">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Leaf className="w-20 h-20 text-green-600" />
            <Network className="w-8 h-8 text-blue-600 absolute -top-2 -right-2" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Bio-Token Ecosystem
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Revolutionary blockchain framework combining Passive Acoustic Monitoring, 
          Actor-Network Theory, and multi-species democratic governance for environmental conservation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setCurrentView('tokenization')}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Bio-Tokenization
          </button>
          <button
            onClick={() => setCurrentView('parliament')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Vote className="w-5 h-5 mr-2" />
            Ecological Parliament
          </button>
        </div>
      </div>

      {/* Innovation Showcase */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Bio-Tokenization</h3>
          <p className="text-gray-600 mb-6">
            Transform bioacoustic recordings into environmental tokens using real 
            Algorand blockchain integration and scientific algorithms.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              IUCN Conservation Status Integration
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Colombian Biodiversity Focus
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Real Algorand SDK Implementation
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Network className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Living Network Tokens</h3>
          <p className="text-gray-600 mb-6">
            Advanced tokens representing ecological relationships, temporal dynamics, 
            and ecosystem health rather than individual recordings.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
              Inter-species Relationships
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
              Temporal Dynamics Analysis
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
              Ecosystem Health Metrics
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Vote className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Ecological Parliament</h3>
          <p className="text-gray-600 mb-6">
            Groundbreaking multi-species governance system based on Actor-Network Theory, 
            where species vote based on acoustic presence and ecological importance.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
              Multi-species Democracy
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
              Acoustic-based Voting Power
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
              Actor-Network Theory Implementation
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Path */}
      <div className="bg-gradient-to-r from-green-50 to-purple-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          From Individual Recordings to Ecological Democracy
        </h2>
        <div className="flex items-center justify-center space-x-4 overflow-x-auto">
          <div className="flex flex-col items-center min-w-0 flex-1">
            <div className="bg-white rounded-lg p-4 shadow-md mb-4 w-full max-w-xs">
              <TreePine className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-center">Individual Species</h4>
              <p className="text-sm text-gray-600 text-center">Single recordings become bio-tokens</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
          <div className="flex flex-col items-center min-w-0 flex-1">
            <div className="bg-white rounded-lg p-4 shadow-md mb-4 w-full max-w-xs">
              <Network className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-center">Ecological Networks</h4>
              <p className="text-sm text-gray-600 text-center">Relationships form living networks</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
          <div className="flex flex-col items-center min-w-0 flex-1">
            <div className="bg-white rounded-lg p-4 shadow-md mb-4 w-full max-w-xs">
              <Vote className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-center">Democratic Governance</h4>
              <p className="text-sm text-gray-600 text-center">Species participate in decisions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Innovation */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Technical Innovations
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
              Blockchain Integration
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Real Algorand SDK implementation with ASA creation</li>
              <li>• TestNet integration for demonstration</li>
              <li>• Comprehensive error handling and user feedback</li>
              <li>• Transaction monitoring and confirmation</li>
              <li>• Wallet integration architecture</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
              Actor-Network Theory
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Multi-species voting system implementation</li>
              <li>• Acoustic presence as democratic participation</li>
              <li>• Temporal governance patterns (dawn chorus, nocturnal)</li>
              <li>• Ecological role-based voting power</li>
              <li>• Network effect calculations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Colombian Biodiversity Focus */}
      <div className="bg-gradient-to-r from-yellow-50 to-green-50 rounded-xl p-8">
        <div className="text-center">
          <Globe className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Colombian Biodiversity Conservation
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            This framework specifically targets Colombian mega-biodiversity, incorporating 
            species from the Chocó Biogeográfico, Sierra Nevada de Santa Marta, and Colombian 
            Amazon. The system integrates with Colombian environmental regulations and 
            IUCN conservation data to create scientifically-grounded bio-tokens.
          </p>
        </div>
      </div>
    </div>
  );

  const Navigation = () => (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Leaf className="w-8 h-8 text-green-600 mr-3" />
            <span className="text-xl font-bold text-gray-900">Bio-Token Ecosystem</span>
          </div>
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentView('overview')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'overview'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('tokenization')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'tokenization'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bio-Tokenization
            </button>
            <button
              onClick={() => setCurrentView('parliament')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'parliament'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ecological Parliament
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <ErrorBoundary onError={handleError}>
      <NotificationProvider>
        <div className="App min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
          <Navigation />
          
          {isLoading && (
            <LoadingSpinner 
              variant="full-screen" 
              message="Loading Bio-Token Ecosystem"
              submessage="Initializing blockchain connections and species data..."
            />
          )}

          {!isLoading && (
            <>
              {currentView === 'overview' && <OverviewSection />}
              {currentView === 'tokenization' && <AlgorandTokenization />}
              {currentView === 'parliament' && <EcologicalParliament />}
            </>
          )}
          
          <NotificationContainer />
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default AppComplete;