import React, { createContext, useContext, ReactNode } from 'react';
import { Prospect } from '../types/prospects';

interface ProspectContextType {
  prospects: Prospect[];
  setProspects: (prospects: Prospect[]) => void;
}

const ProspectContext = createContext<ProspectContextType | undefined>(undefined);

export const ProspectProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [prospects, setProspects] = React.useState<Prospect[]>([]);

  return (
    <ProspectContext.Provider value={{ prospects, setProspects }}>
      {children}
    </ProspectContext.Provider>
  );
};

export const useProspects = () => {
  const context = useContext(ProspectContext);
  if (context === undefined) {
    throw new Error('useProspects must be used within a ProspectProvider');
  }
  return context;
};