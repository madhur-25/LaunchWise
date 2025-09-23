import { useState, useEffect } from 'react';
import { CreateExperimentModal } from './CreateExperimentModal';
import { EditExperimentModal } from './EditExperimentModal';
import { ExperimentCard } from './ExperimentCard';
import { SkeletonCard } from './SkeletonCard';
import { Plus, Beaker, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { Experiment } from '../types';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingExperiment, setEditingExperiment] = useState<Experiment | null>(null);
  const { logout } = useAuth();

  const fetchExperiments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getExperiments();
      setExperiments(data);
    } catch (error) {
      toast.error("Failed to load experiments.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  const handleCreateExperiment = async (data: any) => {
    // No more hardcoded IDs! The backend gets the team info from our token.
    const payload = {
      name: data.name,
      description: data.description,
      variants: [
        { name: 'Control', isControl: true, trafficSplit: 0.5 },
        { name: data.variantName, isControl: false, trafficSplit: 0.5 },
      ],
    };

    toast.promise(api.createExperiment(payload), {
      loading: 'Creating experiment...',
      success: () => {
        fetchExperiments();
        setIsCreateModalOpen(false);
        return <b>Experiment created!</b>;
      },
      error: (err) => <b>{err.toString()}</b>,
    });
  };

  const handleUpdateExperiment = async (experimentId: string, data: { name: string, description: string }) => {
    toast.promise(api.updateExperiment(experimentId, data), {
      loading: 'Saving changes...',
      success: () => {
        fetchExperiments();
        setEditingExperiment(null);
        return <b>Changes saved!</b>;
      },
      error: (err) => <b>{err.toString()}</b>,
    });
  };

  const handleDeleteExperiment = (experimentId: string) => {
    toast.promise(api.deleteExperiment(experimentId), {
      loading: 'Deleting experiment...',
      success: () => {
        setExperiments(prev => prev.filter(exp => exp.id !== experimentId));
        return <b>Experiment deleted.</b>;
      },
      error: (err) => <b>{err.toString()}</b>,
    });
  };

  const confirmDelete = (experimentId: string) => {
    toast((t) => (
      <span className="flex flex-col items-center gap-4">
        <b>Are you sure?</b>
        This action cannot be undone.
        <div className="flex gap-2">
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
            onClick={() => {
              handleDeleteExperiment(experimentId);
              toast.dismiss(t.id);
            }}
          >
            Delete
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </span>
    ), {
      style: {
        background: '#374151',
        color: '#FFFFFF',
      },
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }

    if (experiments.length === 0) {
      return (
        <div className="mt-16 flex flex-col items-center gap-4 text-center text-gray-500">
          <Beaker size={48} />
          <h3 className="text-xl font-semibold">No Experiments Found</h3>
          <p>Click the "+ Create Experiment" button to get started.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map(exp => (
          <ExperimentCard 
            key={exp.id} 
            experiment={exp}
            onDelete={() => confirmDelete(exp.id)}
            onEdit={() => setEditingExperiment(exp)}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-900 text-white font-sans">
        <aside className="w-64 bg-gray-800 p-6 flex flex-col">
          <div>
            <h1 className="text-2xl font-bold mb-8">LaunchWise</h1>
            <nav>
              {/* Future nav links can go here */}
            </nav>
          </div>
          <div className="mt-auto">
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center bg-gray-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <LogOut size={16} className="mr-2"/>
              Logout
            </button>
          </div>
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
          
          {renderContent()}
        </main>
      </div>

      <CreateExperimentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateExperiment}
      />
      <EditExperimentModal
        isOpen={editingExperiment !== null}
        onClose={() => setEditingExperiment(null)}
        onUpdate={handleUpdateExperiment}
        experimentData={editingExperiment}
      />
    </>
  );
}

