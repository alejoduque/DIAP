import React, { useState, useEffect } from 'react';
import { 
  Users, TreePine, Zap, Vote, Clock, MapPin, 
  TrendingUp, AlertTriangle, CheckCircle, 
  Mic, Volume2, Globe, Network, Crown
} from 'lucide-react';

interface ParliamentSeat {
  id: string;
  species: string;
  scientificName: string;
  ecologicalRole: 'producer' | 'primary-consumer' | 'secondary-consumer' | 'decomposer' | 'pollinator' | 'seed-disperser';
  iucnStatus: 'CR' | 'EN' | 'VU' | 'NT' | 'LC';
  votingPower: number; // Based on ecosystem function and conservation status
  acousticPresence: number; // 0-1 based on recent acoustic detections
  temporalActivity: 'dawn' | 'day' | 'dusk' | 'night' | 'continuous';
  lastDetected: Date;
  location: string;
  networkConnections: string[]; // Connected to other species
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  type: 'conservation' | 'habitat-management' | 'resource-allocation' | 'threat-response';
  proposedBy: 'human-community' | 'ai-analysis' | 'ecosystem-trigger';
  status: 'open' | 'voting' | 'passed' | 'rejected' | 'implemented';
  votes: {
    species: string;
    vote: 'for' | 'against' | 'abstain';
    votingPower: number;
    timestamp: Date;
  }[];
  createdAt: Date;
  deadline: Date;
  implementationPlan?: string;
  impactAssessment: {
    affectedSpecies: string[];
    ecosystemImpact: 'positive' | 'negative' | 'neutral';
    urgency: 'low' | 'medium' | 'high' | 'critical';
  };
}

interface EcosystemHealth {
  biodiversity: number;
  connectivity: number;
  stability: number;
  threatLevel: number;
  resilience: number;
}

export const EcologicalParliament: React.FC = () => {
  const [parliamentSeats, setParliamentSeats] = useState<ParliamentSeat[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [ecosystemHealth, setEcosystemHealth] = useState<EcosystemHealth>({
    biodiversity: 0.75,
    connectivity: 0.68,
    stability: 0.82,
    threatLevel: 0.35,
    resilience: 0.71
  });
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [view, setView] = useState<'parliament' | 'proposals' | 'governance' | 'analytics'>('parliament');

  // Initialize Colombian biodiversity parliament
  useEffect(() => {
    const colombianSpecies: ParliamentSeat[] = [
      {
        id: 'ara-macao',
        species: 'Scarlet Macaw',
        scientificName: 'Ara macao',
        ecologicalRole: 'seed-disperser',
        iucnStatus: 'VU',
        votingPower: 15,
        acousticPresence: 0.8,
        temporalActivity: 'day',
        lastDetected: new Date(Date.now() - 2 * 60 * 60 * 1000),
        location: 'Chocó Biogeográfico',
        networkConnections: ['cecropia-tree', 'howler-monkey']
      },
      {
        id: 'atlapetes-flaviceps',
        species: 'Yellow-headed Brush-finch',
        scientificName: 'Atlapetes flaviceps',
        ecologicalRole: 'primary-consumer',
        iucnStatus: 'CR',
        votingPower: 25, // High voting power due to critical status
        acousticPresence: 0.6,
        temporalActivity: 'dawn',
        lastDetected: new Date(Date.now() - 6 * 60 * 60 * 1000),
        location: 'Sierra Nevada de Santa Marta',
        networkConnections: ['andean-oak', 'mountain-insects']
      },
      {
        id: 'tinamus-major',
        species: 'Great Tinamou',
        scientificName: 'Tinamus major',
        ecologicalRole: 'seed-disperser',
        iucnStatus: 'LC',
        votingPower: 8,
        acousticPresence: 0.9,
        temporalActivity: 'dusk',
        lastDetected: new Date(Date.now() - 30 * 60 * 1000),
        location: 'Amazonas Colombiano',
        networkConnections: ['forest-floor', 'fruit-trees']
      },
      {
        id: 'alouatta-seniculus',
        species: 'Red Howler Monkey',
        scientificName: 'Alouatta seniculus',
        ecologicalRole: 'seed-disperser',
        iucnStatus: 'LC',
        votingPower: 12,
        acousticPresence: 0.95, // Very loud calls
        temporalActivity: 'dawn',
        lastDetected: new Date(Date.now() - 15 * 60 * 1000),
        location: 'Multiple regions',
        networkConnections: ['canopy-trees', 'fruit-resources']
      },
      {
        id: 'cecropia-tree',
        species: 'Cecropia Tree',
        scientificName: 'Cecropia peltata',
        ecologicalRole: 'producer',
        iucnStatus: 'LC',
        votingPower: 20, // High as primary producer
        acousticPresence: 0.3, // Wind-generated sounds
        temporalActivity: 'continuous',
        lastDetected: new Date(Date.now() - 10 * 60 * 1000),
        location: 'Tropical forests',
        networkConnections: ['ara-macao', 'fruit-bats', 'insects']
      }
    ];

    const sampleProposals: Proposal[] = [
      {
        id: 'habitat-corridor-1',
        title: 'Create Acoustic Corridor for Dawn Chorus',
        description: 'Establish protected acoustic corridors connecting fragmented forest patches to enable dawn chorus communication networks.',
        type: 'habitat-management',
        proposedBy: 'ecosystem-trigger',
        status: 'voting',
        votes: [
          { species: 'Atlapetes flaviceps', vote: 'for', votingPower: 25, timestamp: new Date() },
          { species: 'Red Howler Monkey', vote: 'for', votingPower: 12, timestamp: new Date() }
        ],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        impactAssessment: {
          affectedSpecies: ['Atlapetes flaviceps', 'Red Howler Monkey', 'Cecropia Tree'],
          ecosystemImpact: 'positive',
          urgency: 'high'
        }
      },
      {
        id: 'threat-response-1',
        title: 'Emergency Response to Acoustic Pollution',
        description: 'Immediate action required due to increased noise pollution affecting critical species communication.',
        type: 'threat-response',
        proposedBy: 'ai-analysis',
        status: 'open',
        votes: [],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        impactAssessment: {
          affectedSpecies: ['Scarlet Macaw', 'Great Tinamou'],
          ecosystemImpact: 'negative',
          urgency: 'critical'
        }
      }
    ];

    setParliamentSeats(colombianSpecies);
    setProposals(sampleProposals);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CR': return 'bg-red-600 text-white';
      case 'EN': return 'bg-orange-600 text-white';
      case 'VU': return 'bg-yellow-600 text-white';
      case 'NT': return 'bg-blue-600 text-white';
      case 'LC': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'producer': return <TreePine className="w-4 h-4" />;
      case 'seed-disperser': return <Globe className="w-4 h-4" />;
      case 'pollinator': return <Zap className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getAcousticStrength = (presence: number) => {
    if (presence > 0.8) return { color: 'text-green-600', bars: 4 };
    if (presence > 0.6) return { color: 'text-yellow-600', bars: 3 };
    if (presence > 0.4) return { color: 'text-orange-600', bars: 2 };
    return { color: 'text-red-600', bars: 1 };
  };

  const calculateVoteResult = (proposal: Proposal) => {
    const totalPossibleVotes = parliamentSeats.reduce((sum, seat) => sum + seat.votingPower, 0);
    const forVotes = proposal.votes.filter(v => v.vote === 'for').reduce((sum, v) => sum + v.votingPower, 0);
    const againstVotes = proposal.votes.filter(v => v.vote === 'against').reduce((sum, v) => sum + v.votingPower, 0);
    const abstainVotes = proposal.votes.filter(v => v.vote === 'abstain').reduce((sum, v) => sum + v.votingPower, 0);

    return {
      for: (forVotes / totalPossibleVotes) * 100,
      against: (againstVotes / totalPossibleVotes) * 100,
      abstain: (abstainVotes / totalPossibleVotes) * 100,
      participation: ((forVotes + againstVotes + abstainVotes) / totalPossibleVotes) * 100
    };
  };

  const simulateVote = (proposalId: string, speciesId: string, vote: 'for' | 'against' | 'abstain') => {
    const species = parliamentSeats.find(s => s.id === speciesId);
    if (!species) return;

    setProposals(prev => prev.map(proposal => {
      if (proposal.id === proposalId) {
        const existingVoteIndex = proposal.votes.findIndex(v => v.species === species.species);
        const newVote = {
          species: species.species,
          vote,
          votingPower: species.votingPower,
          timestamp: new Date()
        };

        const newVotes = existingVoteIndex >= 0 
          ? proposal.votes.map((v, i) => i === existingVoteIndex ? newVote : v)
          : [...proposal.votes, newVote];

        return { ...proposal, votes: newVotes };
      }
      return proposal;
    }));
  };

  const ParliamentView = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Ecological Parliament</h2>
        <p className="text-gray-600">Multi-species governance through acoustic democracy</p>
      </div>

      {/* Parliament Seats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parliamentSeats.map((seat) => {
          const acoustic = getAcousticStrength(seat.acousticPresence);
          return (
            <div key={seat.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {getRoleIcon(seat.ecologicalRole)}
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{seat.species}</h3>
                    <p className="text-sm text-gray-600 italic">{seat.scientificName}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(seat.iucnStatus)}`}>
                  {seat.iucnStatus}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Voting Power</span>
                  <div className="flex items-center">
                    <Crown className="w-4 h-4 text-yellow-600 mr-1" />
                    <span className="font-semibold">{seat.votingPower}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Acoustic Presence</span>
                  <div className="flex items-center">
                    <Volume2 className={`w-4 h-4 mr-2 ${acoustic.color}`} />
                    <div className="flex space-x-1">
                      {Array.from({ length: 4 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-4 rounded ${i < acoustic.bars ? acoustic.color.replace('text-', 'bg-') : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Activity</span>
                  <span className="text-sm font-medium capitalize">{seat.temporalActivity}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Detected</span>
                  <span className="text-sm font-medium">
                    {Math.round((Date.now() - seat.lastDetected.getTime()) / (1000 * 60 * 60))}h ago
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Ecological Role: {seat.ecologicalRole}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const ProposalsView = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Active Proposals</h2>
        <p className="text-gray-600">Community and ecosystem-driven governance proposals</p>
      </div>

      {proposals.map((proposal) => {
        const voteResult = calculateVoteResult(proposal);
        return (
          <div key={proposal.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{proposal.title}</h3>
                <p className="text-gray-600 mb-4">{proposal.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                proposal.status === 'voting' ? 'bg-blue-100 text-blue-800' :
                proposal.status === 'open' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {proposal.status}
              </span>
            </div>

            {/* Proposal Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                Deadline: {proposal.deadline.toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                Impact: {proposal.impactAssessment.ecosystemImpact}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Urgency: {proposal.impactAssessment.urgency}
              </div>
            </div>

            {/* Vote Progress */}
            {proposal.votes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Voting Progress</span>
                  <span>{voteResult.participation.toFixed(1)}% participation</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div className="flex h-full rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500"
                      style={{ width: `${voteResult.for}%` }}
                    />
                    <div 
                      className="bg-red-500"
                      style={{ width: `${voteResult.against}%` }}
                    />
                    <div 
                      className="bg-yellow-500"
                      style={{ width: `${voteResult.abstain}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>For: {voteResult.for.toFixed(1)}%</span>
                  <span>Against: {voteResult.against.toFixed(1)}%</span>
                  <span>Abstain: {voteResult.abstain.toFixed(1)}%</span>
                </div>
              </div>
            )}

            {/* Recent Votes */}
            {proposal.votes.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Recent Votes</h4>
                <div className="space-y-2">
                  {proposal.votes.slice(0, 3).map((vote, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{vote.species}</span>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold mr-2 ${
                          vote.vote === 'for' ? 'bg-green-100 text-green-800' :
                          vote.vote === 'against' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {vote.vote}
                        </span>
                        <span className="text-sm text-gray-500">Power: {vote.votingPower}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Simulate voting (for demo) */}
            {proposal.status === 'voting' && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Simulate Votes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parliamentSeats.slice(0, 3).map((seat) => (
                    <div key={seat.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{seat.species}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => simulateVote(proposal.id, seat.id, 'for')}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200"
                        >
                          For
                        </button>
                        <button
                          onClick={() => simulateVote(proposal.id, seat.id, 'against')}
                          className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
                        >
                          Against
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg shadow-md p-2">
          <div className="flex space-x-2">
            {[
              { key: 'parliament', label: 'Parliament', icon: Users },
              { key: 'proposals', label: 'Proposals', icon: Vote },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setView(key as any)}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  view === key
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ecosystem Health Dashboard */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ecosystem Health Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(ecosystemHealth).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {(value * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </div>
              <div className={`w-full bg-gray-200 rounded-full h-2 mt-2`}>
                <div
                  className={`h-2 rounded-full ${
                    value > 0.7 ? 'bg-green-500' : value > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${value * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content based on selected view */}
      {view === 'parliament' && <ParliamentView />}
      {view === 'proposals' && <ProposalsView />}

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h4 className="font-semibold text-blue-900 mb-2">How the Ecological Parliament Works</h4>
        <div className="text-sm text-blue-800 space-y-2">
          <p>• <strong>Species Representation:</strong> Each species gets voting power based on ecological importance and conservation status</p>
          <p>• <strong>Acoustic Democracy:</strong> Voting power is weighted by recent acoustic presence (species must be "present" to vote)</p>
          <p>• <strong>Proposal System:</strong> Decisions can be triggered by ecosystem changes, AI analysis, or human community input</p>
          <p>• <strong>Consensus Building:</strong> Proposals require majority approval weighted by ecological network effects</p>
          <p>• <strong>Temporal Governance:</strong> Voting patterns reflect natural activity cycles (dawn chorus, nocturnal activity, etc.)</p>
        </div>
      </div>
    </div>
  );
};

export default EcologicalParliament;