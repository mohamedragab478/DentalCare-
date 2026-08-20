import React, { useState } from 'react';
import { MedicalImage } from '../types';

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (image: MedicalImage) => void;
}

export const UploadImageModal: React.FC<UploadImageModalProps> = ({
  isOpen,
  onClose,
  onUpload
}) => {
  const [title, setTitle] = useState('Bite-wing Right Quad');
  const [imageType, setImageType] = useState<'xray' | 'bitewing' | 'intraoral' | 'photo'>('bitewing');
  const [previewUrl, setPreviewUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuCNUJfRvywofbv1G0KsVnD1hWkBS1MArwp6OLKVjZqEJNF28ij4qxEEq9SZGP1DBObE8hVjZPcl7IAqgCw7_x6vB5JBNMrHuBDyckX0ZydrRFcTa9qYfI6OjiDXV3wkLjjaqH7pWOh9LvsTT1rfrhJlWiX0qP97DTBABJhoiMvH06Qel_qGXCgCRDIKylpdsdOfCMkV4cvSP7V_WnVlSS-lhlb4hve4K-iERWoRkPwktmYkGiKOfp_lsg');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newImage: MedicalImage = {
      id: `img-${Date.now()}`,
      title,
      date: today,
      url: previewUrl,
      type: imageType
    };

    onUpload(newImage);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006194] text-2xl">add_a_photo</span>
            <h2 className="font-headline font-bold text-xl text-slate-900">Upload Medical Scan</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Image Title / Label
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
              placeholder="e.g. Bite-wing Right Quad"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Scan Modality
            </label>
            <select
              value={imageType}
              onChange={(e) => setImageType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
            >
              <option value="xray">Panoramic X-ray</option>
              <option value="bitewing">Bite-wing X-ray</option>
              <option value="intraoral">Intraoral Camera</option>
              <option value="photo">Clinical Photograph</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              File Attachment
            </label>
            <label className="border-2 border-dashed border-slate-200 hover:border-[#006194] bg-[#f8fafc] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-3xl text-slate-400 mb-1">cloud_upload</span>
              <span className="text-xs font-semibold text-[#006194]">Choose file or drag & drop</span>
              <span className="text-[10px] text-slate-400 mt-0.5">DICOM, JPG, PNG up to 25MB</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {previewUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video bg-black">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#006194] hover:bg-[#004b73] text-white text-sm font-bold shadow-xs cursor-pointer"
            >
              Save to Patient Records
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
