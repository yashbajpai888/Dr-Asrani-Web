import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [u, setU] = useState(null);
  const [l, setL] = useState(true); 

  useEffect(() => {
    const stored = localStorage.getItem("sessionUser");
    if (stored) setU(JSON.parse(stored));
    setL(false);
  }, []);
  if (l) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-2xl font-bold animate-pulse text-indigo-600">Loading...</div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user: u, setUser: setU }}>
      {children}
    </UserContext.Provider>
  );
};
