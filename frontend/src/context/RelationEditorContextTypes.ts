import { createContext } from 'react';

export interface RelationEditorContextType {
  isOpen: boolean;
  openEditor: (relationId?: number) => void;
  closeEditor: () => void;
  targetId: number | null;
}

export const RelationEditorContext = createContext<RelationEditorContextType | undefined>(undefined);
