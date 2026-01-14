import { useRelationEditor } from '../../context/RelationEditorContext';
import { Modal } from '../ui/Modal';
// Zakładam, że Twój formularz jest w tym miejscu:
import RelationEditor from '../admin/RelationEditor'; 

export const GlobalRelationEditor = () => {
  const { isOpen, closeEditor, targetId } = useRelationEditor();

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeEditor}
      title={targetId ? "Edycja relacji" : "Nowa relacja"}
    >
      {/* Przekazujemy funkcję zamykającą, aby formularz mógł zamknąć modal po sukcesie */}
      <RelationEditor 
        relationId={targetId} 
        onSuccess={closeEditor} 
        onCancel={closeEditor}
      />
    </Modal>
  );
};