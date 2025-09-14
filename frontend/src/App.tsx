import { useState, useEffect } from 'react';

// Define the structure of our data to make TypeScript happy
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

function App() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This function fetches data from our backend API
    const fetchExperiments = async () => {
      try {
        setLoading(true);
        // The '/api' path here is handled by the Vite proxy
        const response = await fetch('/api/v1/experiments');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setExperiments(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExperiments();
  }, []); // The empty array [] means this effect runs once when the component mounts

  return (
    <div className="bg-slate-900 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">LaunchWise Dashboard</h1>

        {loading && <p>Loading experiments...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        
        {!loading && !error && (
          <div className="space-y-4">
            {experiments.map((experiment) => (
              <div key={experiment.id} className="bg-slate-800 p-4 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold">{experiment.name}</h2>
                <p className="text-slate-400">{experiment.description}</p>
                <span className={`inline-block px-2 py-1 text-sm rounded mt-2 ${
                  experiment.status === 'RUNNING' ? 'bg-green-600' : 'bg-yellow-600'
                }`}>{experiment.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

