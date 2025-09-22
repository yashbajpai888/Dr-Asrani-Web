import React, { useState, useEffect } from 'react';

const PatientForm = ({ initialData, onSubmit, onCancel }) => {
  const [n, setN] = useState('');
  const [dob, setDob] = useState('');
  const [cn, setC] = useState('');
  const [healthInfo, setHealthInfo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const nw = {
      id: initialData?.id || `p${Date.now()}`,
      name: n,
      dob,
      contact: cn,
      healthInfo,
    };
    onSubmit(nw);
  };

  useEffect(() => {
    if (initialData) {
      setN(initialData.name || '');
      setDob(initialData.dob || '');
      setC(initialData.contact || '');
      setHealthInfo(initialData.healthInfo || '');
    }
  }, [initialData]);

  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-lg shadow-lg border border-gray-100 bg-white p-0 overflow-hidden flex flex-col"
        style={{ minWidth: 340 }}
      >
        
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Edit Patient' : 'Add Patient'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-white text-2xl font-medium hover:text-gray-200 transition"
            title="Close"
          >
            &times;
          </button>
        </div>
        <div className="flex flex-col gap-5 px-6 py-6 bg-white">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={n}
                onChange={e => setN(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
            <input
              type="text"
              value={cn}
              onChange={e => {
                const value = e.target.value.replace(/[^0-9+]/g, '');
                setC(value);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder="Phone number"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Health Information</label>
            <textarea
              value={healthInfo}
              onChange={e => setHealthInfo(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition min-h-[100px]"
              required
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition font-medium text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition font-medium text-sm"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
