import React, { useState, useEffect } from 'react';
import { getPatients, addPatient, updatePatient, deletePatient } from '../../utils/patientStorage';
import PatientForm from './PatientForm';

const PatList = () => {
  const [pts, setPts] = useState([]);
  const [editPt, setEditPt] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewPt, setViewPt] = useState(null);
  const [delId, setDelId] = useState(null);
  const [showDel, setShowDel] = useState(false);
  const [q, setQ] = useState('');
const refresh = () => setPts(getPatients());

  useEffect(() => {
    setPts(getPatients());
  }, []);

  
const confDel = () => {
    if (delId) {
      deletePatient(delId);
      refresh();
      setDelId(null);
      setShowDel(false);
    }
  };
  const addNew = () => {
    setEditPt(null);
    setShowForm(true);
  };

  

  const onSubmit = (pt) => {
    if (editPt) {
      updatePatient(pt);
    } else {
      addPatient(pt);
    }
    setShowForm(false);
    refresh();
  };
const onEdit = (pt) => {
    setEditPt(pt);
    setShowForm(true);
  };
  const filtPts = pts.filter(
    (p) =>
      p.name?.toLowerCase().includes(q.toLowerCase()) ||
      p.contact?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Patient Directory
          </h2>
          <button
            type="button"
            onClick={addNew}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm flex items-center gap-2 px-4 py-2 font-medium transition w-full sm:w-auto justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Add Patient</span>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search patients..."
                value={q}
                onChange={e => setQ(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-800 placeholder:text-gray-400 shadow-sm transition"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {filtPts.length} {filtPts.length === 1 ? 'patient' : 'patients'} found
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtPts.length === 0 && (
            <div className="col-span-3 text-center text-gray-500 py-12 bg-white rounded-lg shadow-sm border border-gray-100">
              No patients found. Try adjusting your search or add a new patient.
            </div>
          )}
          {filtPts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow-sm p-5 flex flex-col gap-3 border border-gray-100 hover:shadow-md transition relative justify-between"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center text-lg font-medium">
                  {p.name?.[0]?.toUpperCase() || "P"}
                </div>
                <div>
                  <div className="text-lg font-medium text-gray-800">{p.name}</div>
                  <div className="text-xs text-gray-500">
                    DOB: {p.dob ? new Date(p.dob).toLocaleDateString() : 'Not specified'}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-gray-700 text-sm flex-1">
                <div className="flex items-start">
                  <span className="text-gray-500 w-24">Contact:</span> 
                  <span className="font-medium">{p.contact || 'Not provided'}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 w-24">Health Info:</span> 
                  <span className="font-medium">{p.healthInfo || 'None'}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setViewPt(p)}
                  className="px-3 py-1.5 rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition text-sm font-medium flex items-center gap-1"
                  title="View Details"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.45825 12C3.73253 7.94288 7.52281 5 12.0004 5C16.4781 5 20.2684 7.94291 21.5426 12C20.2684 16.0571 16.4781 19 12.0005 19C7.52281 19 3.73251 16.0571 2.45825 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  View
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(p)}
                  className="px-3 py-1.5 rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 transition text-sm font-medium flex items-center gap-1"
                  title="Edit Patient"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDelId(p.id);
                    setShowDel(true);
                  }}
                  className="px-3 py-1.5 rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition text-sm font-medium flex items-center gap-1"
                  title="Delete Patient"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-10 border-2 border-cyan-200 relative">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
                style={{ zIndex: 10 }}
              >
                &times;
              </button>
              <PatientForm
                initialData={editPt}
                onSubmit={onSubmit}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        {viewPt && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-fuchsia-50 rounded-2xl shadow-2xl p-8 w-full max-w-md relative border-2 border-cyan-200">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
                onClick={() => setViewPt(null)}
              >
                &times;
              </button>
              <h3 className="text-2xl font-bold mb-4 text-fuchsia-800">Patient Details</h3>
              <div className="space-y-2 text-fuchsia-900">
                <div><span className="font-semibold">Name:</span> {viewPt.name}</div>
                <div><span className="font-semibold">DOB:</span> {viewPt.dob ? new Date(viewPt.dob).toLocaleDateString('en-GB') : ''}</div>
                <div><span className="font-semibold">Contact:</span> {viewPt.contact}</div>
                <div><span className="font-semibold">Health Info:</span> {viewPt.healthInfo}</div>
              </div>
            </div>
          </div>
        )}

        {showDel && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-red-50 rounded-2xl shadow-2xl p-8 min-w-[320px] max-w-sm text-center relative border-2 border-red-200">
              <h3 className="text-xl font-bold mb-4 text-red-700">Delete Patient</h3>
              <p className="mb-6 text-fuchsia-900">Are you sure you want to delete this patient?</p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
                  onClick={confDel}
                >
                  Delete
                </button>
                <button
                  className="px-4 py-2 rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
                  onClick={() => setShowDel(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatList;
