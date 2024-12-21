import React from 'react';

interface PresetButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function PresetButton({ label, isSelected, onClick }: PresetButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-colors ${
        isSelected
          ? 'bg-black text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );
}