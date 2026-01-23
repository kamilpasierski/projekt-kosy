import { useState, type ReactNode } from 'react';
import { RelationEditorContext } from './RelationEditorContextTypes';

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