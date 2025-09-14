import { useState, useEffect } from 'react';
import { CreateExperimentModal } from './components/CreateExperimentModal';

// --- Data Structures ---
// (These interfaces should eventually be moved to a shared types file)
interface Variant {
  id: string;
  name: string;
  isControl: boolean;
}

interface Experiment {
  id: string;
  name: string;
  description: string | null;
  status: string;
  variants: Variant[];
}

interface NewExperimentData {
  name: string;
  description: string;
  variants: { name: string }[];
}

function App() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/experiments');
      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
      }
      const data = await response.json();
      setExperiments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  const handleCreateExperiment = async (data: NewExperimentData) => {
    try {
      // IMPORTANT: Hardcoding IDs for now. We will replace this with dynamic
      // data from the logged-in user once we build authentication.
      const teamId = "cmfjafh850003i36kgygxesi8"; // Replace with your actual Team ID from Prisma Studio
      const apiKeyId = "cme2rb8c20004i39gp1ag2yap"; // Replace with your actual ApiKey ID from Prisma Studio

      const payload = {
        ...data,
        teamId,
        apiKeyId,
        variants: [
          { name: data.variants[0].name, isControl: true, trafficSplit: 0.5 },
          { name: data.variants[1].name, isControl: false, trafficSplit: 0.5 },
        ],
      };

      const response = await fetch('/api/v1/experiments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create experiment');
      }

      setIsModalOpen(false); // Close modal on success
      fetchExperiments(); // Refresh the list of experiments

    } catch (err) {
      alert(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };


  return (
    <>
      <CreateExperimentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateExperiment}
      />
      <div className="bg-slate-900 text-white min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">LaunchWise Dashboard</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg"
            >
              + Create Experiment
            </button>
          </div>

          {loading && <p>Loading experiments...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          
          {!loading && !error && (
            <div className="space-y-4">
              {experiments.length === 0 ? (
                <p className="text-slate-400">No experiments found. Create one to get started!</p>
              ) : (
                experiments.map((experiment) => (
                  <div key={experiment.id} className="bg-slate-800 p-4 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold">{experiment.name}</h2>
                    <p className="text-slate-400">{experiment.description}</p>
                    <span className={`inline-block px-2 py-1 text-sm rounded mt-2 ${
                      experiment.status === 'RUNNING' ? 'bg-green-600' : 'bg-yellow-600'
                    }`}>{experiment.status}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
