import React, { useState } from 'react';
import { CharacterAvatar } from '../characters/CharacterAvatars';
import { storageService } from '../../services/storage/localStorage';
import { StudentProfile } from '../../types/student';
import { soundFx } from '../../services/sound/webAudio';
import confetti from 'canvas-confetti';

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: (profile: StudentProfile) => void;
}

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileCreated,
}) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [ageGroup, setAgeGroup] = useState('10-12');
  const [selectedAvatar, setSelectedAvatar] = useState<'robo' | 'sparky' | 'brainy' | 'buggy' | 'glitch'>('sparky');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    soundFx.playVictoryFanfare();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });

    const newProfile = storageService.createProfile(name, nickname, ageGroup, selectedAvatar);
    onProfileCreated(newProfile);
    onClose();

    // Reset
    setName('');
    setNickname('');
  };

  const avatars: ('robo' | 'sparky' | 'brainy' | 'buggy')[] = ['robo', 'sparky', 'brainy', 'buggy'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 space-y-6 shadow-2xl border border-slate-100 animate-fadeIn text-right">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900">إضافة مبتكر صغير جديد</h3>
            <p className="text-xs text-slate-500">إنشاء ملف طالب محلي على هذا الجهاز</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 font-bold text-sm">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">اختر الشخصية الرمزية (Avatar):</label>
            <div className="grid grid-cols-4 gap-2">
              {avatars.map((av) => {
                const isSelected = selectedAvatar === av;
                return (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedAvatar(av);
                    }}
                    className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20 scale-105'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <CharacterAvatar character={av} size="sm" />
                    <span className="text-[10px] font-bold text-slate-600 mt-1 capitalize">{av}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم الطالب الكامل *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: يوسف الكيلاني"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اللقب أو الاسم المستعار</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="مثال: صقر البرمجة"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الفئة العمرية</label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="7-9">7 – 9 سنوات (مرحلة الاستكشاف الأولى)</option>
              <option value="10-12">10 – 12 سنة (مرحلة البناء والدوائر)</option>
              <option value="13-14">13 – 14 سنة (مرحلة البرمجة والذكاء المتقدم)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FF5B5A] text-white font-bold text-xs shadow-coral-glow hover:bg-[#E84A5F]"
            >
              إنشاء الملف وبدء المغامرة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

