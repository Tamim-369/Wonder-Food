import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={() => {}}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  return value;
};
