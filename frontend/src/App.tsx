import { useState, useEffect } from 'react';
import { CreateExperimentModal } from './components/CreateExperimentModal';
import { EditExperimentModal } from './components/EditExperimentModal'; // Import the new modal
import { ExperimentCard } from './components/ExperimentCard';
import { Plus } from 'lucide-react';

// --- Type Definitions ---
export interface Variant {
  id: string;
  name: string;
  trafficSplit: number;
  isControl: boolean;
  experimentId: string;
}

export interface Experiment {
  id: string;
  name: string;
  description: string | null;
  status: string;
  variants: Variant[];
}

function App() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // NEW: State to manage the edit modal and the experiment being edited
  const [editingExperiment, setEditingExperiment] = useState<Experiment | null>(null);

  const fetchExperiments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/experiments');
      if (!response.ok) throw new Error('Network response was not ok');
      const data: Experiment[] = await response.json();
      setExperiments(data);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  const handleCreateExperiment = async (data: any) => {
    // IMPORTANT: Replace with your actual IDs
    const teamId = "cmfjafh850003i36kgygxesi8"; 
    const apiKeyId = "cme2rb8c20004i39gp1ag2yap"; 

    const payload = {
      name: data.name,
      description: data.description,
      teamId,
      apiKeyId,
      variants: [
        { name: 'Control', isControl: true, trafficSplit: 0.5 },
        { name: data.variantName, isControl: false, trafficSplit: 0.5 },
      ],
    };

    try {
      const response = await fetch('/api/v1/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to create experiment');
      setIsCreateModalOpen(false);
      fetchExperiments();
    } catch (error) {
      console.error(error);
      alert('Error: Could not create experiment.');
    }
  };

  // NEW: Function to handle updating an experiment
  const handleUpdateExperiment = async (experimentId: string, data: { name: string, description: string }) => {
    try {
      const response = await fetch(`/api/v1/experiments/${experimentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update experiment');
      
      setEditingExperiment(null); // Close the modal on success
      fetchExperiments(); // Re-fetch all data to show the update
    } catch (error) {
      console.error(error);
      alert('Error: Could not update experiment.');
    }
  };

  const handleDeleteExperiment = async (experimentId: string) => {
    if (!window.confirm('Are you sure you want to delete this experiment?')) return;

    try {
      const response = await fetch(`/api/v1/experiments/${experimentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete experiment');
      setExperiments(prev => prev.filter(exp => exp.id !== experimentId));
    } catch (error) {
      console.error(error);
      alert('Error: Could not delete experiment.');
    }
  };

  // NEW: Function to open the edit modal
  const handleOpenEditModal = (experiment: Experiment) => {
    setEditingExperiment(experiment);
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-900 text-white font-sans">
        <aside className="w-64 bg-gray-800 p-6 flex flex-col">
          <h1 className="text-2xl font-bold mb-8">LaunchWise</h1>
        </aside>

        <main className="flex-1 p-8">
          <header className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Create Experiment
            </button>
          </header>

          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiments.map(exp => (
                <ExperimentCard 
                  key={exp.id} 
                  experiment={exp}
                  onDelete={handleDeleteExperiment}
                  onEdit={handleOpenEditModal} // <-- Pass the new edit handler
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Render the Create Modal */}
      <CreateExperimentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateExperiment}
      />
      
      {/* Render the new Edit Modal */}
      <EditExperimentModal
        isOpen={editingExperiment !== null}
        onClose={() => setEditingExperiment(null)}
        onUpdate={handleUpdateExperiment}
        experimentData={editingExperiment}
      />
    </>
  );
}

export default App;
