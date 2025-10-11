import React, { useEffect, useState } from 'react';

const KpiDashboard = () => {
  const [aps, setAps] = useState([]);
  const [pts, setPts] = useState([]);

  const rev = aps.reduce((s, x) => s + Number(x.cost || 0), 0);
  const pend = aps.filter((x) => x.status === 'Pending').length;
  const comp = aps.filter((x) => x.status === 'Completed').length;

  useEffect(() => {
    const a = JSON.parse(localStorage.getItem('appointments')) || [];
    const p = JSON.parse(localStorage.getItem('patients')) || [];
    setAps(a);
    setPts(p);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg p-4 shadow text-center">
        <h2 className="text-lg font-bold text-indigo-700">Total Patients</h2>
        <p className="text-2xl font-extrabold">{pts.length}</p>
      </div>
      <div className="bg-white rounded-lg p-4 shadow text-center">
        <h2 className="text-lg font-bold text-indigo-700">Revenue</h2>
        <p className="text-2xl font-extrabold">$ {rev}</p>
      </div>
      <div className="bg-white rounded-lg p-4 shadow text-center">
        <h2 className="text-lg font-bold text-indigo-700">Pending Treatments</h2>
        <p className="text-2xl font-extrabold">{pend}</p>
      </div>
      <div className="bg-white rounded-lg p-4 shadow text-center">
        <h2 className="text-lg font-bold text-indigo-700">Completed Treatments</h2>
        <p className="text-2xl font-extrabold">{comp}</p>
      </div>
    </div>
  );
};

export default KpiDashboard;
