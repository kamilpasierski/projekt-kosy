import { useState } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DescriptionProps {
  description?: string;
  clubId?: number;
  isAdmin?: boolean;
  onDescriptionUpdate?: (newDescription: string) => void;
}

export default function Description({ 
  description,
  clubId,
  isAdmin = false,
  onDescriptionUpdate
}: DescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!description && !isAdmin) return null;

  const handleSave = async () => {
    if (!clubId || !onDescriptionUpdate) return;
    
    setIsSaving(true);
    try {
      await onDescriptionUpdate(editedDescription);
      setIsEditing(false);
    } catch (error) {
      console.error('Błąd podczas zapisywania opisu:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedDescription(description || '');
    setIsEditing(false);
  };

  return (
    /* Ten kontener zajmuje całą dostępną szerokość (w-full),
       ale jego zawartość jest ograniczona do 1180px i wyśrodkowana (mx-auto). */
    <div className="w-full py-8 md:py-12 antialiased">
      <div className="max-w-[1180px] mx-auto px-4 md:px-0">

        {/* Nagłówek "O klubie" z przyciskiem edycji dla adminów */}
        <div className="mb-10 flex items-center justify-between">
          <h2 className="font-medium text-[18px] md:text-[20px] uppercase leading-[130%] text-white">
            O klubie
          </h2>
          {isAdmin && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#274fde] hover:bg-[#1e3fbd] text-white rounded-[20px] transition-colors"
            >
              <PencilIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Edytuj</span>
            </button>
          )}
          {isEditing && (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-[#247f46] hover:bg-[#1e6838] text-white rounded-[20px] transition-colors disabled:opacity-50"
              >
                <CheckIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{isSaving ? 'Zapisywanie...' : 'Zapisz'}</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-[#8a2525] hover:bg-[#6e1d1d] text-white rounded-[20px] transition-colors disabled:opacity-50"
              >
                <XMarkIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Anuluj</span>
              </button>
            </div>
          )}
        </div>

        {/* Kontener Rectangle 20 - Szerokość 1174px zgodnie z Figmą */}
        <div
          className="w-full rounded-[30px] bg-[#333232] px-6 py-8 md:px-[60px] md:py-[40px]"
          style={{
            boxShadow: '6px 2px 19.1px 0px rgba(0, 0, 0, 0.19)'
          }}
        >
          {/* Tekst opisu - Montserrat 20px, Line-height 163% */}
          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full min-h-[200px] font-medium text-[16px] md:text-[20px] leading-[163%] tracking-[0.6px] text-white bg-[#2a2a2a] rounded-[20px] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#274fde] resize-vertical"
              placeholder="Wprowadź opis klubu..."
            />
          ) : (
            <p className="font-medium text-[16px] md:text-[20px] leading-[163%] tracking-[0.6px] text-white">
              {description || (isAdmin ? 'Brak opisu. Kliknij "Edytuj" aby dodać opis.' : 'Brak opisu.')}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}