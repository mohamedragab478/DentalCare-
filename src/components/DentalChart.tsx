import React, { useState } from 'react';
import { ToothRecord, ToothStatus } from '../types';

interface DentalChartProps {
  teeth: Record<number, ToothRecord>;
  onUpdateTooth: (toothId: number, status: ToothStatus, notes?: string, date?: string) => void;
}

export const DentalChart: React.FC<DentalChartProps> = ({
  teeth,
  onUpdateTooth
}) => {
  const [selectedToothId, setSelectedToothId] = useState<number>(26);
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);

  const selectedTooth: ToothRecord = teeth[selectedToothId] || {
    id: selectedToothId,
    status: 'none',
    notes: 'No clinical observations recorded for this tooth.'
  };

  // Status visual mapping
  const getStatusColor = (status: ToothStatus) => {
    switch (status) {
      case 'extraction':
        return {
          fill: '#fee2e2',
          stroke: '#ef4444',
          badgeBg: 'bg-[#fee2e2]',
          badgeText: 'text-[#b91c1c]',
          dotBg: 'bg-[#ef4444]',
          label: 'Extraction'
        };
      case 'filling':
        return {
          fill: '#fef3c7',
          stroke: '#f59e0b',
          badgeBg: 'bg-[#fef3c7]',
          badgeText: 'text-[#b45309]',
          dotBg: 'bg-[#f59e0b]',
          label: 'Filling'
        };
      case 'root-canal':
        return {
          fill: '#d1fae5',
          stroke: '#10b981',
          badgeBg: 'bg-[#d1fae5]',
          badgeText: 'text-[#047857]',
          dotBg: 'bg-[#10b981]',
          label: 'Root Canal'
        };
      case 'crown':
        return {
          fill: '#ede9fe',
          stroke: '#8b5cf6',
          badgeBg: 'bg-[#ede9fe]',
          badgeText: 'text-[#6d28d9]',
          dotBg: 'bg-[#8b5cf6]',
          label: 'Crown'
        };
      case 'implant':
        return {
          fill: '#dbeafe',
          stroke: '#3b82f6',
          badgeBg: 'bg-[#dbeafe]',
          badgeText: 'text-[#1d4ed8]',
          dotBg: 'bg-[#3b82f6]',
          label: 'Implant'
        };
      case 'none':
      default:
        return {
          fill: '#ffffff',
          stroke: '#cbd5e1',
          badgeBg: 'bg-[#f1f5f9]',
          badgeText: 'text-[#475569]',
          dotBg: 'bg-[#94a3b8]',
          label: 'Healthy'
        };
    }
  };

  const handleStatusChange = (newStatus: ToothStatus) => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    onUpdateTooth(
      selectedToothId,
      newStatus,
      selectedTooth.notes || (newStatus !== 'none' ? `${newStatus.toUpperCase()} procedure applied.` : undefined),
      newStatus !== 'none' ? today : undefined
    );
  };

  const handleSaveNotes = () => {
    onUpdateTooth(
      selectedToothId,
      selectedTooth.status,
      editingNotes,
      selectedTooth.lastTreatmentDate
    );
    setIsEditingNotes(false);
  };

  // Upper Arch FDI teeth coordinates (Upper Right: 18..11, Upper Left: 21..28)
  const upperTeeth = [
    { id: 18, cx: 55, cy: 155, r: 13 },
    { id: 17, cx: 72, cy: 125, r: 13 },
    { id: 16, cx: 95, cy: 100, r: 14 },
    { id: 15, cx: 120, cy: 80, r: 13 },
    { id: 14, cx: 146, cy: 68, r: 13 },
    { id: 13, cx: 172, cy: 60, r: 13 },
    { id: 12, cx: 198, cy: 56, r: 14 },
    { id: 11, cx: 226, cy: 55, r: 15 },
    // Upper Left
    { id: 21, cx: 258, cy: 55, r: 15 },
    { id: 22, cx: 286, cy: 56, r: 14 },
    { id: 23, cx: 312, cy: 60, r: 13 },
    { id: 24, cx: 338, cy: 68, r: 13 },
    { id: 25, cx: 364, cy: 80, r: 13 },
    { id: 26, cx: 388, cy: 100, r: 15 },
    { id: 27, cx: 412, cy: 125, r: 13 },
    { id: 28, cx: 428, cy: 155, r: 13 },
  ];

  // Lower Arch FDI teeth coordinates (Lower Right: 48..41, Lower Left: 31..38)
  const lowerTeeth = [
    { id: 48, cx: 62, cy: 230, r: 13 },
    { id: 47, cx: 80, cy: 255, r: 13 },
    { id: 46, cx: 105, cy: 278, r: 14 },
    { id: 45, cx: 132, cy: 295, r: 13 },
    { id: 44, cx: 158, cy: 308, r: 13 },
    { id: 43, cx: 184, cy: 316, r: 13 },
    { id: 42, cx: 210, cy: 320, r: 13 },
    { id: 41, cx: 234, cy: 322, r: 14 },
    // Lower Left
    { id: 31, cx: 250, cy: 322, r: 14 },
    { id: 32, cx: 274, cy: 320, r: 13 },
    { id: 33, cx: 300, cy: 316, r: 13 },
    { id: 34, cx: 326, cy: 308, r: 13 },
    { id: 35, cx: 352, cy: 295, r: 13 },
    { id: 36, cx: 378, cy: 278, r: 14 },
    { id: 37, cx: 404, cy: 255, r: 13 },
    { id: 38, cx: 422, cy: 230, r: 13 },
  ];

  const currentStatusConfig = getStatusColor(selectedTooth.status);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Main Anatomical Chart Card (8 cols) */}
      <div className="lg:col-span-8 bg-white border border-[#e2e8f0] rounded-xl p-5 md:p-6 shadow-xs flex flex-col min-h-[580px] relative">
        {/* Header and Legend */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#e2e8f0] pb-4 mb-4 gap-3">
          <h3 className="font-headline font-bold text-xl text-slate-900">Anatomical Chart</h3>
          
          {/* Status Legend */}
          <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-600">
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
              <span className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1] border border-slate-300"></span> None
            </span>
          </div>
        </div>

        {/* Interactive Arch Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc] rounded-xl border border-slate-200/80 p-4 md:p-6 relative overflow-visible select-none">
          <div className="w-full max-w-[540px] relative">
            <svg viewBox="0 0 484 380" className="w-full h-auto drop-shadow-xs">
              {/* Upper Arch Curve Background Track */}
              <path
                d="M 50,165 C 45,20 440,20 434,165"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="42"
                strokeLinecap="round"
                className="transition-colors opacity-90"
              />

              {/* Lower Arch Curve Background Track */}
              <path
                d="M 58,220 C 52,360 432,360 426,220"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="42"
                strokeLinecap="round"
                className="transition-colors opacity-90"
              />

              {/* Center Arch Soft Background Shade */}
              <ellipse cx="242" cy="190" rx="140" ry="85" fill="#f1f5f9" opacity="0.6" />

              {/* Upper Arch Quadrant Label (Maxillary) */}
              <text x="242" y="145" textAnchor="middle" className="text-[10px] font-semibold fill-slate-400 uppercase tracking-widest">
                Maxillary (Upper)
              </text>
              <text x="242" y="240" textAnchor="middle" className="text-[10px] font-semibold fill-slate-400 uppercase tracking-widest">
                Mandibular (Lower)
              </text>

              {/* Upper Teeth Nodes */}
              {upperTeeth.map((tooth) => {
                const record = teeth[tooth.id];
                const status = record?.status || 'none';
                const colorConfig = getStatusColor(status);
                const isSelected = selectedToothId === tooth.id;

                // Tooth number text offset
                const isTopHalf = tooth.cy < 100;
                const textY = isTopHalf ? tooth.cy - tooth.r - 5 : tooth.cy - tooth.r - 4;

                return (
                  <g 
                    key={`upper-${tooth.id}`}
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedToothId(tooth.id);
                      setEditingNotes(teeth[tooth.id]?.notes || '');
                    }}
                  >
                    {/* Glow ring when selected */}
                    {isSelected && (
                      <circle
                        cx={tooth.cx}
                        cy={tooth.cy}
                        r={tooth.r + 5}
                        fill="none"
                        stroke="#006194"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                        className="animate-pulse"
                      />
                    )}

                    {/* Tooth body */}
                    <circle
                      cx={tooth.cx}
                      cy={tooth.cy}
                      r={tooth.r}
                      fill={colorConfig.fill}
                      stroke={isSelected ? '#006194' : colorConfig.stroke}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-all duration-150 group-hover:stroke-[#006194] group-hover:scale-105"
                    />

                    {/* Tooth Number (FDI) */}
                    <text
                      x={tooth.cx}
                      y={textY}
                      textAnchor="middle"
                      className={`text-[11px] font-bold ${
                        isSelected 
                          ? 'fill-[#006194] font-extrabold' 
                          : 'fill-slate-600 group-hover:fill-[#006194]'
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

                // Tooth number text offset
                const textY = tooth.cy + tooth.r + 13;

                return (
                  <g 
                    key={`lower-${tooth.id}`}
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedToothId(tooth.id);
                      setEditingNotes(teeth[tooth.id]?.notes || '');
                    }}
                  >
                    {/* Glow ring when selected */}
                    {isSelected && (
                      <circle
                        cx={tooth.cx}
                        cy={tooth.cy}
                        r={tooth.r + 5}
                        fill="none"
                        stroke="#006194"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                        className="animate-pulse"
                      />
                    )}

                    {/* Tooth body */}
                    <circle
                      cx={tooth.cx}
                      cy={tooth.cy}
                      r={tooth.r}
                      fill={colorConfig.fill}
                      stroke={isSelected ? '#006194' : colorConfig.stroke}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-all duration-150 group-hover:stroke-[#006194] group-hover:scale-105"
                    />

                    {/* Tooth Number (FDI) */}
                    <text
                      x={tooth.cx}
                      y={textY}
                      textAnchor="middle"
                      className={`text-[11px] font-bold ${
                        isSelected 
                          ? 'fill-[#006194] font-extrabold' 
                          : 'fill-slate-600 group-hover:fill-[#006194]'
                      }`}
                    >
                      {tooth.id}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Contextual Popover for Selected Tooth matching mockup */}
            <div className="absolute top-[32%] right-[10%] md:right-[15%] w-64 bg-white rounded-xl border border-slate-200 shadow-xl p-3 z-20 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2.5">
                <span className="font-headline font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#006194]">dentistry</span>
                  Tooth {selectedToothId}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">FDI Notation</span>
              </div>

              <p className="text-[11px] text-slate-500 mb-2 font-medium">Assign Clinical Condition:</p>

              <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
                {/* Extraction */}
                <button
                  onClick={() => handleStatusChange('extraction')}
                  className={`py-1.5 px-2 rounded-lg text-left flex items-center gap-1.5 transition-all border ${
                    selectedTooth.status === 'extraction'
                      ? 'bg-[#ef4444] text-white border-[#ef4444] shadow-xs'
                      : 'bg-[#fee2e2] text-[#b91c1c] hover:bg-[#ef4444] hover:text-white border-transparent'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span>Extraction</span>
                </button>

                {/* Filling */}
                <button
                  onClick={() => handleStatusChange('filling')}
                  className={`py-1.5 px-2 rounded-lg text-left flex items-center gap-1.5 transition-all border ${
                    selectedTooth.status === 'filling'
                      ? 'bg-[#f59e0b] text-white border-[#f59e0b] shadow-xs'
                      : 'bg-[#fef3c7] text-[#b45309] hover:bg-[#f59e0b] hover:text-white border-transparent'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span>Filling</span>
                </button>

                {/* Root Canal */}
                <button
                  onClick={() => handleStatusChange('root-canal')}
                  className={`py-1.5 px-2 rounded-lg text-left flex items-center gap-1.5 transition-all border ${
                    selectedTooth.status === 'root-canal'
                      ? 'bg-[#10b981] text-white border-[#10b981] shadow-xs'
                      : 'bg-[#d1fae5] text-[#047857] hover:bg-[#10b981] hover:text-white border-transparent'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span>Root Canal</span>
                </button>

                {/* Crown */}
                <button
                  onClick={() => handleStatusChange('crown')}
                  className={`py-1.5 px-2 rounded-lg text-left flex items-center gap-1.5 transition-all border ${
                    selectedTooth.status === 'crown'
                      ? 'bg-[#8b5cf6] text-white border-[#8b5cf6] shadow-xs'
                      : 'bg-[#ede9fe] text-[#6d28d9] hover:bg-[#8b5cf6] hover:text-white border-transparent'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span>Crown</span>
                </button>

                {/* Implant */}
                <button
                  onClick={() => handleStatusChange('implant')}
                  className={`py-1.5 px-2 rounded-lg text-left flex items-center gap-1.5 transition-all border ${
                    selectedTooth.status === 'implant'
                      ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-xs'
                      : 'bg-[#dbeafe] text-[#1d4ed8] hover:bg-[#3b82f6] hover:text-white border-transparent'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span>Implant</span>
                </button>

                {/* Clear */}
                <button
                  onClick={() => handleStatusChange('none')}
                  className={`py-1.5 px-2 rounded-lg text-left flex items-center gap-1.5 transition-all border ${
                    selectedTooth.status === 'none'
                      ? 'bg-slate-700 text-white border-slate-700'
                      : 'bg-[#f1f5f9] text-[#475569] hover:bg-slate-200 border-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel: Selection Detail (4 cols) matching mockup */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 md:p-6 shadow-xs">
          <div className="border-b border-[#e2e8f0] pb-3 mb-4 flex justify-between items-center">
            <h3 className="font-headline font-bold text-lg text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194] fill-1 text-[22px]">dentistry</span>
              Selection Detail
            </h3>
          </div>

          {/* Large Tooth Number Badge & Status Card */}
          <div className="bg-[#f1f4fa] rounded-xl p-4 mb-5 border border-slate-200 flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center font-headline font-bold text-2xl text-[#006194] shadow-xs border border-slate-200">
              {selectedToothId}
            </div>
            <div>
              <span className="block text-slate-500 text-xs font-semibold uppercase tracking-wider">Current Status</span>
              <span className={`inline-flex items-center gap-1.5 ${currentStatusConfig.badgeBg} ${currentStatusConfig.badgeText} px-3 py-1 rounded-full text-xs font-bold mt-1 shadow-2xs`}>
                <span className={`w-2 h-2 rounded-full ${currentStatusConfig.dotBg}`}></span>
                {currentStatusConfig.label}
              </span>
            </div>
          </div>

          {/* Treatment info */}
          <div className="space-y-4">
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                Last Treatment Date
              </label>
              <div className="text-sm font-medium text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                {selectedTooth.lastTreatmentDate || 'No procedures recorded'}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  Clinical Notes
                </label>
                {!isEditingNotes ? (
                  <button
                    onClick={() => {
                      setEditingNotes(selectedTooth.notes || '');
                      setIsEditingNotes(true);
                    }}
                    className="text-xs text-[#006194] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={handleSaveNotes}
                    className="text-xs bg-[#006194] text-white px-2 py-0.5 rounded font-semibold hover:bg-[#004b73]"
                  >
                    Save
                  </button>
                )}
              </div>

              {isEditingNotes ? (
                <textarea
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Type clinical observations, shade, procedure notes..."
                  rows={4}
                  className="w-full bg-white p-3 rounded-lg border border-[#006194] focus:ring-1 focus:ring-[#006194] text-sm text-slate-800 outline-none resize-none shadow-xs"
                />
              ) : (
                <div className="bg-[#f8fafc] p-3.5 rounded-lg border border-slate-200 text-sm text-slate-700 leading-relaxed min-h-[110px]">
                  {selectedTooth.notes || (
                    <span className="text-slate-400 italic">No notes added for tooth {selectedToothId}. Click 'Edit' to enter clinical details.</span>
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
