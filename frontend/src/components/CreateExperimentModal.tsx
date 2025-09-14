import { useState } from 'react';

// Define the shape of the data we'll send to the API
interface NewExperimentData {
  name: string;
  description: string;
  variants: { name: string }[];
}

// Define the component's props
interface CreateExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: NewExperimentData) => void;
}

export function CreateExperimentModal({ isOpen, onClose, onCreate }: CreateExperimentModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [variantA, setVariantA] = useState('Control');
  const [variantB, setVariantB] = useState('Variant B');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !variantA || !variantB) {
      alert('Please fill out all required fields.');
      return;
    }
    onCreate({
      name,
      description,
      variants: [{ name: variantA }, { name: variantB }],
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Create New Experiment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-slate-400 mb-2">Experiment Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-slate-400 mb-2">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
           <div className="mb-6">
            <label className="block text-slate-400 mb-2">Variants (A/B)</label>
            <input
              type="text"
              value={variantA}
              onChange={(e) => setVariantA(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 mb-2 text-white"
              required
            />
             <input
              type="text"
              value={variantB}
              onChange={(e) => setVariantB(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-white bg-slate-600 hover:bg-slate-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md text-white bg-sky-600 hover:bg-sky-500 font-semibold">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
