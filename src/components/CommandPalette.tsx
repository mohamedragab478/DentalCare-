import React, { useState, useEffect } from 'react';
import { Patient, AppView } from '../types';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';
import { Modal, Input, Avatar } from './ui/Primitives';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onNavigate: (view: AppView) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  patients,
  onSelectPatient,
  onNavigate,
}) => {
  const { t, isRTL } = useAppThemeLanguage();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredPatients = query.trim()
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.id.toLowerCase().includes(query.toLowerCase()) ||
          p.phone.includes(query)
      )
    : patients.slice(0, 5);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isRTL ? 'بحث سريع في سجلات المرضى' : 'Global Patient Search'} maxWidth="lg">
      <div className="flex flex-col gap-4">
        <Input
          autoFocus
          icon="search"
          placeholder={isRTL ? 'ابحث باسم المريض، رقم الهاتف، أو الرقم التعريفي... (Press Esc to close)' : 'Search by name, ID, or phone number... (Esc to close)'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
          {filteredPatients.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">{t('no_matching_patients')}</p>
          ) : (
            filteredPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => {
                  onSelectPatient(patient.id);
                  onNavigate('doctor-patient-profile');
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-start cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={patient.name} src={patient.avatar} size="sm" />
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{patient.name}</h5>
                    <p className="text-xs text-slate-500 dir-ltr inline-block">
                      ID: #{patient.id} • {patient.phone}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#006194] dark:text-[#00a3e0] bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded-md border border-blue-100 dark:border-blue-900">
                  {isRTL ? 'فتح السجل' : 'Open Record'}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
