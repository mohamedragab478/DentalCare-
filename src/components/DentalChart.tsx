import React, { useState } from 'react';
import { ToothRecord, ToothStatus } from '../types';

interface DentalChartProps {
  teeth: Record<number, ToothRecord>;
  onUpdateTooth?: (toothId: number, status: ToothStatus, notes?: string, date?: string) => void;
  isReadOnly?: boolean;
  onSelectTooth?: (toothId: number) => void;
  selectedToothId?: number | null;
}

export type ToothType = 'incisor' | 'canine' | 'premolar' | 'molar';

export const getToothType = (toothId: number): { type: ToothType; arabicName: string; englishName: string } => {
  const pos = toothId % 10;
  if (pos === 1 || pos === 2) {
    return {
      type: 'incisor',
      arabicName: pos === 1 ? 'قاطع مركزي' : 'قاطع جانبي',
      englishName: pos === 1 ? 'Central Incisor' : 'Lateral Incisor'
    };
  }
  if (pos === 3) {
    return {
      type: 'canine',
      arabicName: 'ناب',
      englishName: 'Canine / Cuspid'
    };
  }
  if (pos === 4 || pos === 5) {
    return {
      type: 'premolar',
      arabicName: pos === 4 ? 'ضاحك أول' : 'ضاحك ثاني',
      englishName: pos === 4 ? '1st Premolar' : '2nd Premolar'
    };
  }
  return {
    type: 'molar',
    arabicName: pos === 8 ? 'ضرس العقل' : pos === 7 ? 'ضرس ثاني' : 'ضرس أول',
    englishName: pos === 8 ? '3rd Molar (Wisdom)' : pos === 7 ? '2nd Molar' : '1st Molar'
  };
};

export const DentalChart: React.FC<DentalChartProps> = ({
  teeth,
  onUpdateTooth,
  isReadOnly = false,
  onSelectTooth,
  selectedToothId: controlledToothId
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<number>(26);
  const selectedToothId = controlledToothId !== undefined && controlledToothId !== null ? controlledToothId : internalSelectedId;
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);

  const handleSelectTooth = (id: number) => {
    setInternalSelectedId(id);
    if (onSelectTooth) {
      onSelectTooth(id);
    }
    setEditingNotes(teeth[id]?.notes || '');
  };

  const selectedTooth: ToothRecord = teeth[selectedToothId] || {
    id: selectedToothId,
    status: 'none',
    notes: 'No clinical observations recorded for this tooth.'
  };

  const toothTypeInfo = getToothType(selectedToothId);

  // Status visual mapping
  const getStatusColor = (status: ToothStatus) => {
    switch (status) {
      case 'extraction':
        return {
          fill: '#fee2e2',
          stroke: '#ef4444',
          iconColor: '#b91c1c',
          badgeBg: 'bg-[#fee2e2]',
          badgeText: 'text-[#b91c1c]',
          dotBg: 'bg-[#ef4444]',
          label: 'Extraction',
          arabicLabel: 'خلع'
        };
      case 'filling':
        return {
          fill: '#fef3c7',
          stroke: '#f59e0b',
          iconColor: '#b45309',
          badgeBg: 'bg-[#fef3c7]',
          badgeText: 'text-[#b45309]',
          dotBg: 'bg-[#f59e0b]',
          label: 'Filling',
          arabicLabel: 'حشو'
        };
      case 'root-canal':
        return {
          fill: '#d1fae5',
          stroke: '#10b981',
          iconColor: '#047857',
          badgeBg: 'bg-[#d1fae5]',
          badgeText: 'text-[#047857]',
          dotBg: 'bg-[#10b981]',
          label: 'Root Canal',
          arabicLabel: 'علاج عصب'
        };
      case 'crown':
        return {
          fill: '#ede9fe',
          stroke: '#8b5cf6',
          iconColor: '#6d28d9',
          badgeBg: 'bg-[#ede9fe]',
          badgeText: 'text-[#6d28d9]',
          dotBg: 'bg-[#8b5cf6]',
          label: 'Crown',
          arabicLabel: 'طربوش / تاج'
        };
      case 'implant':
        return {
          fill: '#dbeafe',
          stroke: '#3b82f6',
          iconColor: '#1d4ed8',
          badgeBg: 'bg-[#dbeafe]',
          badgeText: 'text-[#1d4ed8]',
          dotBg: 'bg-[#3b82f6]',
          label: 'Implant',
          arabicLabel: 'زراعة'
        };
      case 'none':
      default:
        return {
          fill: '#ffffff',
          stroke: '#94a3b8',
          iconColor: '#64748b',
          badgeBg: 'bg-[#f1f5f9]',
          badgeText: 'text-[#475569]',
          dotBg: 'bg-[#94a3b8]',
          label: 'Healthy',
          arabicLabel: 'سليم'
        };
    }
  };

  const handleStatusChange = (newStatus: ToothStatus) => {
    if (isReadOnly || !onUpdateTooth) return;
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    onUpdateTooth(
      selectedToothId,
      newStatus,
      selectedTooth.notes || (newStatus !== 'none' ? `${newStatus.toUpperCase()} procedure applied.` : undefined),
      newStatus !== 'none' ? today : undefined
    );
  };

  const handleSaveNotes = () => {
    if (isReadOnly || !onUpdateTooth) return;
    onUpdateTooth(
      selectedToothId,
      selectedTooth.status,
      editingNotes,
      selectedTooth.lastTreatmentDate
    );
    setIsEditingNotes(false);
  };

  // Spacious Coordinates for Upper Arch (Maxillary) - FDI: 18..11, 21..28
  const upperTeeth = [
    { id: 18, cx: 60, cy: 175, r: 17 },
    { id: 17, cx: 85, cy: 135, r: 17 },
    { id: 16, cx: 118, cy: 100, r: 18 },
    { id: 15, cx: 155, cy: 75, r: 16 },
    { id: 14, cx: 195, cy: 58, r: 16 },
    { id: 13, cx: 238, cy: 46, r: 16 },
    { id: 12, cx: 282, cy: 40, r: 16 },
    { id: 11, cx: 326, cy: 38, r: 17 },
    // Upper Left
    { id: 21, cx: 374, cy: 38, r: 17 },
    { id: 22, cx: 418, cy: 40, r: 16 },
    { id: 23, cx: 462, cy: 46, r: 16 },
    { id: 24, cx: 505, cy: 58, r: 16 },
    { id: 25, cx: 545, cy: 75, r: 16 },
    { id: 26, cx: 582, cy: 100, r: 18 },
    { id: 27, cx: 615, cy: 135, r: 17 },
    { id: 28, cx: 640, cy: 175, r: 17 },
  ];

  // Spacious Coordinates for Lower Arch (Mandibular) - FDI: 48..41, 31..38
  const lowerTeeth = [
    { id: 48, cx: 65, cy: 265, r: 17 },
    { id: 47, cx: 90, cy: 305, r: 17 },
    { id: 46, cx: 124, cy: 338, r: 18 },
    { id: 45, cx: 162, cy: 362, r: 16 },
    { id: 44, cx: 202, cy: 378, r: 16 },
    { id: 43, cx: 244, cy: 388, r: 16 },
    { id: 42, cx: 286, cy: 394, r: 16 },
    { id: 41, cx: 328, cy: 396, r: 16 },
    // Lower Left
    { id: 31, cx: 372, cy: 396, r: 16 },
    { id: 32, cx: 414, cy: 394, r: 16 },
    { id: 33, cx: 456, cy: 388, r: 16 },
    { id: 34, cx: 498, cy: 378, r: 16 },
    { id: 35, cx: 538, cy: 362, r: 16 },
    { id: 36, cx: 576, cy: 338, r: 18 },
    { id: 37, cx: 610, cy: 305, r: 17 },
    { id: 38, cx: 635, cy: 265, r: 17 },
  ];

  // Render authentic anatomical SVG icon inside the tooth node
  const renderToothAnatomyIcon = (toothId: number, cx: number, cy: number, iconColor: string) => {
    const { type } = getToothType(toothId);

    if (type === 'incisor') {
      // قاطع: مستطيل أمامي بشفرة مستوية وخط مركزي
      return (
        <g transform={`translate(${cx - 7}, ${cy - 7}) scale(0.7)`}>
          <rect
            x="2"
            y="2"
            width="16"
            height="16"
            rx="3"
            fill="none"
            stroke={iconColor}
            strokeWidth="2"
          />
          <line x1="10" y1="4" x2="10" y2="16" stroke={iconColor} strokeWidth="1.5" strokeDasharray="2 1" />
          <line x1="4" y1="7" x2="16" y2="7" stroke={iconColor} strokeWidth="1" opacity="0.6" />
        </g>
      );
    }

    if (type === 'canine') {
      // ناب: شكل مدبب / رمح حاد
      return (
        <g transform={`translate(${cx - 7}, ${cy - 7}) scale(0.7)`}>
          <path
            d="M 10,2 L 18,10 L 14,18 L 6,18 L 2,10 Z"
            fill="none"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="10" r="2" fill={iconColor} />
        </g>
      );
    }

    if (type === 'premolar') {
      // ضاحك: حلمتان مستديرتان (Bicuspid) مع شق وسطي
      return (
        <g transform={`translate(${cx - 7}, ${cy - 7}) scale(0.7)`}>
          <ellipse cx="6" cy="10" rx="4" ry="7" fill="none" stroke={iconColor} strokeWidth="1.8" />
          <ellipse cx="14" cy="10" rx="4" ry="7" fill="none" stroke={iconColor} strokeWidth="1.8" />
          <line x1="10" y1="4" x2="10" y2="16" stroke={iconColor} strokeWidth="1.5" />
        </g>
      );
    }

    // Molar (ضرس): 4 حلمات تشريحية مع خطوط الشقوق المتقاطعة
    return (
      <g transform={`translate(${cx - 8}, ${cy - 8}) scale(0.8)`}>
        <rect
          x="2"
          y="2"
          width="16"
          height="16"
          rx="4"
          fill="none"
          stroke={iconColor}
          strokeWidth="2"
        />
        <line x1="10" y1="3" x2="10" y2="17" stroke={iconColor} strokeWidth="1.5" />
        <line x1="3" y1="10" x2="17" y2="10" stroke={iconColor} strokeWidth="1.5" />
        <circle cx="10" cy="10" r="1.5" fill={iconColor} />
      </g>
    );
  };

  const currentStatusConfig = getStatusColor(selectedTooth.status);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Main Anatomical Chart Card (8 cols) */}
      <div className="lg:col-span-8 bg-white border border-[#e2e8f0] rounded-2xl p-5 md:p-6 shadow-xs flex flex-col space-y-6">
        {/* Header and Legend */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#e2e8f0] pb-4 gap-3">
          <div>
            <h3 className="font-headline font-bold text-xl text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194]">dentistry</span>
              <span>Anatomical Dental Chart</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isReadOnly
                ? 'Select any tooth on the arch to view your documented clinical history'
                : 'Click any tooth on the arch to inspect details and assign clinical procedures below'}
            </p>
          </div>
          
          {/* Status Legend */}
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span> Extraction
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span> Filling
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span> Root Canal
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]"></span> Crown
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></span> Implant
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1] border border-slate-300"></span> Healthy
            </span>
          </div>
        </div>

        {/* Interactive Arch Canvas with Widened Spacing & Shapes */}
        <div className="flex flex-col items-center justify-center bg-[#f8fafc] rounded-2xl border border-slate-200 p-4 md:p-6 select-none relative overflow-hidden">
          {/* Anatomical Key Legend Bar */}
          <div className="w-full flex justify-between items-center text-[11px] font-semibold text-slate-500 px-2 pb-2 border-b border-slate-200/80 mb-2">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border border-slate-400 rounded-xs flex items-center justify-center text-[8px]">■</span>
              قواطع (Incisors: 11, 12, 21, 22...)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border border-slate-400 rounded-full flex items-center justify-center text-[8px]">▲</span>
              أنياب (Canines: 13, 23, 33, 43)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border border-slate-400 rounded-xs flex items-center justify-center text-[8px]">⬭</span>
              ضواحك (Premolars: 14, 15, 24...)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border border-slate-400 rounded-xs flex items-center justify-center text-[8px]">⊞</span>
              أضراس (Molars: 16, 17, 18...)
            </span>
          </div>

          <div className="w-full max-w-[680px]">
            <svg viewBox="0 0 700 440" className="w-full h-auto drop-shadow-xs">
              {/* Upper Arch Curve Background Track */}
              <path
                d="M 55,185 C 50,5 650,5 645,185"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="50"
                strokeLinecap="round"
                className="transition-colors opacity-90"
              />

              {/* Lower Arch Curve Background Track */}
              <path
                d="M 60,255 C 55,435 645,435 640,255"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="50"
                strokeLinecap="round"
                className="transition-colors opacity-90"
              />

              {/* Center Arch Soft Background Shade */}
              <ellipse cx="350" cy="220" rx="190" ry="110" fill="#f1f5f9" opacity="0.6" />

              {/* Midline separator */}
              <line x1="350" y1="10" x2="350" y2="430" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />

              {/* Upper Arch Quadrant Label (Maxillary) */}
              <text x="350" y="170" textAnchor="middle" className="text-[11px] font-bold fill-slate-400 uppercase tracking-widest">
                Maxillary Arch (الفك العلوي)
              </text>
              <text x="350" y="270" textAnchor="middle" className="text-[11px] font-bold fill-slate-400 uppercase tracking-widest">
                Mandibular Arch (الفك السفلي)
              </text>

              {/* Left / Right Indicators */}
              <text x="40" y="225" textAnchor="middle" className="text-[12px] font-extrabold fill-slate-400">
                R
              </text>
              <text x="660" y="225" textAnchor="middle" className="text-[12px] font-extrabold fill-slate-400">
                L
              </text>

              {/* Upper Teeth Nodes */}
              {upperTeeth.map((tooth) => {
                const record = teeth[tooth.id];
                const status = record?.status || 'none';
                const colorConfig = getStatusColor(status);
                const isSelected = selectedToothId === tooth.id;

                const isTopHalf = tooth.cy < 100;
                const textY = isTopHalf ? tooth.cy - tooth.r - 6 : tooth.cy - tooth.r - 5;

                return (
                  <g 
                    key={`upper-${tooth.id}`}
                    className="cursor-pointer group"
                    onClick={() => handleSelectTooth(tooth.id)}
                  >
                    {isSelected && (
                      <circle
                        cx={tooth.cx}
                        cy={tooth.cy}
                        r={tooth.r + 5}
                        fill="none"
                        stroke="#006194"
                        strokeWidth="3"
                        strokeDasharray="4 2"
                      />
                    )}

                    <circle
                      cx={tooth.cx}
                      cy={tooth.cy}
                      r={tooth.r}
                      fill={colorConfig.fill}
                      stroke={isSelected ? '#006194' : colorConfig.stroke}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-colors duration-150 group-hover:stroke-[#006194]"
                    />

                    {renderToothAnatomyIcon(tooth.id, tooth.cx, tooth.cy, isSelected ? '#006194' : colorConfig.iconColor)}

                    <text
                      x={tooth.cx}
                      y={textY}
                      textAnchor="middle"
                      className={`text-[12px] font-bold ${
                        isSelected 
                          ? 'fill-[#006194] font-extrabold text-[13px]' 
                          : 'fill-slate-700 group-hover:fill-[#006194]'
                      }`}
                    >
                      {tooth.id}
                    </text>
                  </g>
                );
              })}

              {/* Lower Teeth Nodes */}
              {lowerTeeth.map((tooth) => {
                const record = teeth[tooth.id];
                const status = record?.status || 'none';
                const colorConfig = getStatusColor(status);
                const isSelected = selectedToothId === tooth.id;

                const textY = tooth.cy + tooth.r + 15;

                return (
                  <g 
                    key={`lower-${tooth.id}`}
                    className="cursor-pointer group"
                    onClick={() => handleSelectTooth(tooth.id)}
                  >
                    {isSelected && (
                      <circle
                        cx={tooth.cx}
                        cy={tooth.cy}
                        r={tooth.r + 5}
                        fill="none"
                        stroke="#006194"
                        strokeWidth="3"
                        strokeDasharray="4 2"
                      />
                    )}

                    <circle
                      cx={tooth.cx}
                      cy={tooth.cy}
                      r={tooth.r}
                      fill={colorConfig.fill}
                      stroke={isSelected ? '#006194' : colorConfig.stroke}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-colors duration-150 group-hover:stroke-[#006194]"
                    />

                    {renderToothAnatomyIcon(tooth.id, tooth.cx, tooth.cy, isSelected ? '#006194' : colorConfig.iconColor)}

                    <text
                      x={tooth.cx}
                      y={textY}
                      textAnchor="middle"
                      className={`text-[12px] font-bold ${
                        isSelected 
                          ? 'fill-[#006194] font-extrabold text-[13px]' 
                          : 'fill-slate-700 group-hover:fill-[#006194]'
                      }`}
                    >
                      {tooth.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Clinical Action Selection Window - PLACED DIRECTLY BELOW THE CHART (User requirement) */}
        {!isReadOnly && (
          <div className="bg-[#f8fafc] rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#006194] text-white flex items-center justify-center font-headline font-bold text-lg shadow-xs">
                  {selectedToothId}
                </div>
                <div>
                  <h4 className="font-headline font-bold text-base text-slate-900 flex items-center gap-2">
                    <span>Tooth #{selectedToothId}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100/80 text-[#006194]">
                      {toothTypeInfo.arabicName} ({toothTypeInfo.englishName})
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500">Select procedure to apply to this tooth</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Current Status:</span>
                <span className={`inline-flex items-center gap-1.5 ${currentStatusConfig.badgeBg} ${currentStatusConfig.badgeText} px-3 py-1 rounded-full text-xs font-bold shadow-2xs`}>
                  <span className={`w-2 h-2 rounded-full ${currentStatusConfig.dotBg}`}></span>
                  {currentStatusConfig.label} ({currentStatusConfig.arabicLabel})
                </span>
              </div>
            </div>

            {/* Procedure Action Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-xs font-bold">
              {/* Extraction */}
              <button
                onClick={() => handleStatusChange('extraction')}
                className={`py-3 px-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                  selectedTooth.status === 'extraction'
                    ? 'bg-[#ef4444] text-white border-[#ef4444] shadow-md ring-2 ring-[#ef4444]/30'
                    : 'bg-white text-[#b91c1c] border-red-200 hover:bg-[#fee2e2]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                <span>Extraction (خلع)</span>
              </button>

              {/* Filling */}
              <button
                onClick={() => handleStatusChange('filling')}
                className={`py-3 px-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                  selectedTooth.status === 'filling'
                    ? 'bg-[#f59e0b] text-white border-[#f59e0b] shadow-md ring-2 ring-[#f59e0b]/30'
                    : 'bg-white text-[#b45309] border-amber-200 hover:bg-[#fef3c7]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">brush</span>
                <span>Filling (حشو)</span>
              </button>

              {/* Root Canal */}
              <button
                onClick={() => handleStatusChange('root-canal')}
                className={`py-3 px-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                  selectedTooth.status === 'root-canal'
                    ? 'bg-[#10b981] text-white border-[#10b981] shadow-md ring-2 ring-[#10b981]/30'
                    : 'bg-white text-[#047857] border-emerald-200 hover:bg-[#d1fae5]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">medical_services</span>
                <span>Root Canal (عصب)</span>
              </button>

              {/* Crown */}
              <button
                onClick={() => handleStatusChange('crown')}
                className={`py-3 px-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                  selectedTooth.status === 'crown'
                    ? 'bg-[#8b5cf6] text-white border-[#8b5cf6] shadow-md ring-2 ring-[#8b5cf6]/30'
                    : 'bg-white text-[#6d28d9] border-purple-200 hover:bg-[#ede9fe]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">shield</span>
                <span>Crown (طربوش)</span>
              </button>

              {/* Implant */}
              <button
                onClick={() => handleStatusChange('implant')}
                className={`py-3 px-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                  selectedTooth.status === 'implant'
                    ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-md ring-2 ring-[#3b82f6]/30'
                    : 'bg-white text-[#1d4ed8] border-blue-200 hover:bg-[#dbeafe]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">construction</span>
                <span>Implant (زراعة)</span>
              </button>

              {/* Clear / Healthy */}
              <button
                onClick={() => handleStatusChange('none')}
                className={`py-3 px-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                  selectedTooth.status === 'none'
                    ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>Healthy (سليم)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Side Panel: Selection Detail (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 md:p-6 shadow-xs">
          <div className="border-b border-[#e2e8f0] pb-3 mb-4 flex justify-between items-center">
            <h3 className="font-headline font-bold text-lg text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194] fill-1 text-[22px]">dentistry</span>
              <span>Tooth #{selectedToothId} Details</span>
            </h3>
            <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              FDI System
            </span>
          </div>

          {/* Large Tooth Number Badge & Status Card */}
          <div className="bg-[#f1f4fa] rounded-2xl p-4 mb-5 border border-slate-200 flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center font-headline font-bold text-2xl text-[#006194] shadow-xs border border-slate-200">
              <span>{selectedToothId}</span>
              <span className="text-[9px] font-normal text-slate-400 uppercase -mt-1">FDI</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">{toothTypeInfo.arabicName}</h4>
              <p className="text-xs text-slate-500">{toothTypeInfo.englishName}</p>
              <div className="mt-1.5">
                <span className={`inline-flex items-center gap-1.5 ${currentStatusConfig.badgeBg} ${currentStatusConfig.badgeText} px-2.5 py-0.5 rounded-full text-xs font-bold shadow-2xs`}>
                  <span className={`w-2 h-2 rounded-full ${currentStatusConfig.dotBg}`}></span>
                  {currentStatusConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* Treatment info */}
          <div className="space-y-4">
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                Last Procedure Date
              </label>
              <div className="text-sm font-medium text-slate-800 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200">
                {selectedTooth.lastTreatmentDate || 'No procedures recorded'}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  Clinical Observations & Notes
                </label>
                {!isReadOnly && !isEditingNotes && (
                  <button
                    onClick={() => {
                      setEditingNotes(selectedTooth.notes || '');
                      setIsEditingNotes(true);
                    }}
                    className="text-xs text-[#006194] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                    Edit Notes
                  </button>
                )}
                {!isReadOnly && isEditingNotes && (
                  <button
                    onClick={handleSaveNotes}
                    className="text-xs bg-[#006194] text-white px-2.5 py-1 rounded-lg font-bold hover:bg-[#004b73] cursor-pointer"
                  >
                    Save
                  </button>
                )}
              </div>

              {!isReadOnly && isEditingNotes ? (
                <div className="space-y-2">
                  <textarea
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Type clinical observations, shade, procedure notes..."
                    rows={4}
                    className="w-full bg-white p-3 rounded-xl border border-[#006194] focus:ring-1 focus:ring-[#006194] text-sm text-slate-800 outline-none resize-none shadow-xs"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingNotes(false)}
                      className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      className="px-4 py-1 rounded-lg bg-[#006194] text-white text-xs font-bold hover:bg-[#004b73]"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#f8fafc] p-3.5 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed min-h-[110px]">
                  {selectedTooth.notes || (
                    <span className="text-slate-400 italic">
                      No clinical notes recorded for tooth #{selectedToothId}.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
