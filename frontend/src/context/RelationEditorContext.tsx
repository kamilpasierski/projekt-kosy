import { createContext, useContext, useState, type ReactNode } from 'react';

interface RelationEditorContextType {
  isOpen: boolean;
  openEditor: (relationId?: number) => void;
  closeEditor: () => void;
  targetId: number | null;
}

const RelationEditorContext = createContext<RelationEditorContextType | undefined>(undefined);

export const RelationEditorProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetId, setTargetId] = useState<number | null>(null);

  const openEditor = (relationId?: number) => {
    setTargetId(relationId || null);
    setIsOpen(true);
  };

  const closeEditor = () => {
    setIsOpen(false);
    setTargetId(null);
  };

  return (
    <RelationEditorContext.Provider value={{ isOpen, openEditor, closeEditor, targetId }}>
      {children}
    </RelationEditorContext.Provider>
  );
};

// Custom Hook dla DX
export const useRelationEditor = () => {
  const context = useContext(RelationEditorContext);
  if (!context) {
    throw new Error('useRelationEditor must be used within a RelationEditorProvider');
  }
  return context;
};