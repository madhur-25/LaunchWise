import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // <-- Import motion

interface CreateExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; description: string; variantName: string }) => void;
}

export function CreateExperimentModal({ isOpen, onClose, onCreate }: CreateExperimentModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [variantName, setVariantName] = useState('Variant B');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !variantName) return;
    onCreate({ name, description, variantName });
  };

  // AnimatePresence is a wrapper that allows us to animate components when they are removed from the DOM.
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-white">Create New Experiment</h2>
            <form onSubmit={handleSubmit}>
              {/* --- Form Inputs and Buttons --- */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">
                  Experiment Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Homepage Headline Test"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-300 text-sm font-bold mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What is this experiment trying to achieve?"
                  rows={3}
                />
              </div>
               <div className="mb-6">
                <label htmlFor="variantName" className="block text-gray-300 text-sm font-bold mb-2">
                  Variant Name
                </label>
                <input
                  type="text"
                  id="variantName"
                  value={variantName}
                  onChange={e => setVariantName(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 'New Awesome Headline'"
                  required
                />
                 <p className="text-xs text-gray-500 mt-1">This will be your first variant (Variant B). 'Control' is created automatically.</p>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Create Experiment
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

