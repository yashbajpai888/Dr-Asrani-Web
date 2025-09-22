import React, { useEffect, useState } from 'react';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const weeksInMonth = (y, m) => {
  const wks = [];
  const e = new Date(y, m + 1, 0);
  const s = new Date(y, m, 1);
  
  let c = new Date(s);
  c.setDate(c.getDate() - c.getDay());
  while (c <= e || c.getDay() !== 0) {
    const wk = [];
    for (let i = 0; i < 7; i++) {
      wk.push(new Date(c));
      c.setDate(c.getDate() + 1);
    }
    wks.push(wk);
  }
  return wks;
};

const Cal = () => {
  const [apps, setApps] = useState([]);
  const [cur, setCur] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [sel, setSel] = useState(null);

  
  const grp = apps.reduce((acc, a) => {
    const k = a.appointmentDate.split('T')[0];
    acc[k] = acc[k] ? [...acc[k], a] : [a];
    return acc;
  }, {});
useEffect(() => {
    const a = JSON.parse(localStorage.getItem('appointments')) || [];
    setApps(a);
  }, []);
  const { y, m } = cur;
  const wks = weeksInMonth(y, m);
const next = () => setCur((p) => {
    let ny = p.y, nm = p.m + 1;
    if (nm > 11) { nm = 0; ny += 1; }
    return { y: ny, m: nm };
  });
  const prev = () => setCur((p) => {
    let ny = p.y, nm = p.m - 1;
    if (nm < 0) { nm = 11; ny -= 1; }
    return { y: ny, m: nm };
  });

  
const mName = new Date(y, m).toLocaleString('default', { month: 'long' });

  const sKey = sel && `${sel.getFullYear()}-${String(sel.getMonth() + 1).padStart(2, '0')}-${String(sel.getDate()).padStart(2, '0')}`;
  const selApps = sel && grp[sKey] ? grp[sKey] : [];
  const t = new Date();
  const tKey = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 py-8 px-2 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={prev} className="px-4 py-2 rounded bg-orange-300 hover:bg-orange-400 text-orange-900 font-bold">&lt;</button>
          <h2 className="text-3xl font-extrabold text-brown-800 tracking-tight">{mName} {y}</h2>
          <button onClick={next} className="px-4 py-2 rounded bg-orange-300 hover:bg-orange-400 text-orange-900 font-bold">&gt;</button>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-8 min-w-[700px]">
            {wks.map((wk, wi) => (
              <div key={wi} className="flex flex-col items-center min-w-[120px]">
                <div className="font-bold text-brown-600 mb-2 text-center">Week {wi + 1}</div>
                <div className="flex flex-col gap-4">
                  {wk.map((d, di) => {
                    const inMonth = d.getMonth() === m;
                    const dKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                    const isToday = dKey === tKey;
                    const past = d.setHours(0, 0, 0, 0) < new Date(t.getFullYear(), t.getMonth(), t.getDate()).setHours(0, 0, 0, 0);
                    let border = "";
                    if (isToday) border = "border-purple-700";
                    else if (grp[dKey]) {
                      const pend = grp[dKey].some(a => a.status === "Pending");
                      const comp = past && grp[dKey].some(a => a.status === "Completed");
                      if (pend) border = "border-red-700";
                      else if (comp) border = "border-green-700";
                    }
                    return (
                      <div
                        key={di}
                        className={`relative rounded-xl px-3 py-2 shadow transition cursor-pointer border-2 ${border}
                          ${!inMonth ? 'bg-orange-100 border-orange-200 text-orange-300' : ''}
                          ${past && inMonth && !isToday && !border ? 'bg-yellow-50 border-yellow-100 text-yellow-400' : ''}
                          ${inMonth && !past && !isToday && !border ? 'bg-yellow-50 border-yellow-200' : ''}
                          hover:shadow-lg hover:bg-orange-50`}
                        onClick={() => inMonth && setSel(d)}
                        title={days[d.getDay()]}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-lg ${isToday ? 'text-yellow-900' : 'text-brown-700'}`}>{d.getDate()}</span>
                          <span className="text-xs text-brown-500">{days[d.getDay()]}</span>
                          {isToday && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 text-xs font-semibold">Today</span>
                          )}
                        </div>
                        {grp[dKey] && (
                          <div className="mt-1">
                            {grp[dKey].slice(0, 2).map((a) => (
                              <div key={a.id} className="bg-orange-200 text-xs rounded px-2 py-0.5 mb-1 truncate text-brown-900" title={a.title}>{a.title}</div>
                            ))}
                            {grp[dKey].length > 2 && (
                              <div className="text-xs text-brown-500">+{grp[dKey].length - 2} more</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        {sel && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-yellow-50 rounded-xl shadow-2xl p-8 w-full max-w-md relative border-2 border-orange-300">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl" onClick={() => setSel(null)} title="Close">&times;</button>
              <h3 className="text-xl font-bold mb-4 text-brown-700">Appointments on {sel.toLocaleDateString()}</h3>
              {selApps.length === 0 ? (
                <div className="text-brown-400 text-center">No appointments.</div>
              ) : (
                <div className="space-y-3">
                  {selApps.map((a) => (
                    <div key={a.id} className="border rounded p-3 bg-white">
                      <div className="font-semibold text-brown-700">{a.title}</div>
                      <div className="text-sm text-brown-600">Time: {a.appointmentDate.split('T')[1]?.slice(0, 5) || 'N/A'}</div>
                      <div className="text-sm text-brown-600">Patient ID: {a.patientId}</div>
                      <div className="text-sm text-brown-600">Status: {a.status}</div>
                      <div className="text-sm text-brown-600">Treatment: {a.treatment}</div>
                      <div className="text-sm text-brown-600">Cost: ₹ {a.cost}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Cal;
