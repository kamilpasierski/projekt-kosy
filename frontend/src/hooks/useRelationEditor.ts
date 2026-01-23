import { useContext } from 'react';
import { RelationEditorContext } from '../context/RelationEditorContextTypes';

export const useRelationEditor = () => {
  const context = useContext(RelationEditorContext);
  if (!context) {
    throw new Error('useRelationEditor must be used within a RelationEditorProvider');
  }
  return context;
};
