import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Layers,
  ScreenShare,
  Download,
  Upload,
  Plus,
  Sparkles,
  Trophy,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Check,
  FileJson
} from 'lucide-react';
import { StudentProfile } from '../../types/student';
import { LESSONS_DATA } from '../../data/curriculum';
import { storageService } from '../../services/storage/localStorage';
import { soundFx } from '../../services/sound/webAudio';
import { CharacterAvatar } from '../../components/characters/CharacterAvatars';

interface InstructorDashboardProps {
  profiles: StudentProfile[];
  activeProfile: StudentProfile;
  onProfileChange: (p: StudentProfile) => void;
  onRefreshProfiles: () => void;
  onOpenClassroom: () => void;
  onOpenLesson: (week: number) => void;
  onOpenCreateProfile: () => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  profiles,
  activeProfile,
  onProfileChange,
  onRefreshProfiles,
  onOpenClassroom,
  onOpenLesson,
  onOpenCreateProfile,
}) => {
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // Stats calculation
  const totalStudents = profiles.length;
  const totalXpAll = profiles.reduce((acc, p) => acc + p.progress.xp, 0);
  const avgXp = totalStudents > 0 ? Math.round(totalXpAll / totalStudents) : 0;
  const totalProjectsAll = profiles.reduce((acc, p) => acc + (p.progress.projects?.length || 0), 0);

  // JSON Export
  const handleExportJSON = () => {
    soundFx.playClick();
    const jsonStr = storageService.exportDataAsJSON();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonStr);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `young-innovators-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // JSON Import
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storageService.importDataFromJSON(content);
      if (success) {
        soundFx.playVictoryFanfare();
        setImportNotice('تم استيراد بيانات الطلاب بنجاح!');
        onRefreshProfiles();
      } else {
        soundFx.playFalseStartBuzz();
        setImportNotice('فشل استيراد الملف. تأكد من صحة تنسيق JSON.');
      }
      setTimeout(() => setImportNotice(null), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-black border border-indigo-500/30">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>بوابة المعلّم والمدرّب المعتمد</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black">لوحة التحكم الأكاديمية وإدارة الحصص</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            متابعة إنجاز طلاب قاعة الدرس، إطلاق وضع العرض التفاعلي على جهاز العرض (Projector)، وتصدير النسخ الاحتياطية.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenClassroom();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-indigo-glow transition-all"
          >
            <ScreenShare className="w-4 h-4" />
            <span>إطلاق وضع قاعة الدرس (Classroom Mode)</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      {importNotice && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          <span>{importNotice}</span>
        </div>
      )}

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card space-y-1">
          <div className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>عدد الطلاب المسجلين</span>
          </div>
          <div className="text-3xl font-black text-slate-800 font-mono">{totalStudents}</div>
          <span className="text-[10px] text-slate-400">ملفات محلية على هذا الجهاز</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card space-y-1">
          <div className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>إجمالي نقاط XP</span>
          </div>
          <div className="text-3xl font-black text-amber-600 font-mono">{totalXpAll}</div>
          <span className="text-[10px] text-slate-400">معدل {avgXp} XP لكل طالب</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card space-y-1">
          <div className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-emerald-500" />
            <span>المشاريع الموثقة</span>
          </div>
          <div className="text-3xl font-black text-emerald-600 font-mono">{totalProjectsAll}</div>
          <span className="text-[10px] text-slate-400">ابتكارات ودارات عملية</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card space-y-1">
          <div className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-500" />
            <span>إجمالي الدروس</span>
          </div>
          <div className="text-3xl font-black text-slate-800 font-mono">24</div>
          <span className="text-[10px] text-slate-400">6 عوالم تعليمية</span>
        </div>
      </div>

      {/* Local Storage & Backup Management (Section 2 & 10) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-800">إدارة البيانات والنسخ الاحتياطي (JSON)</h3>
            <p className="text-xs text-slate-500">
              حفظ تقدم طلاب الفصل كملف JSON واستعادته على أي جهاز حاسوب آخر في المختبر دون الحاجة لخادم سحابي
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير نسخة احتياطية (JSON)</span>
            </button>

            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>استيراد نسخة سابقة</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <span className="font-bold text-amber-700 shrink-0">📌 تنبيه تقني:</span>
          <p className="leading-relaxed">
            وفق المعمارية المحددة للنسخة الحالية، تحفظ بيانات الطلاب داخل LocalStorage في المتصفح الحالي فقط لضمان السرعة والأمان التام، ولا تطلب المنصة أي كلمات مرور أو معلومات حساسة.
          </p>
        </div>
      </div>

      {/* Students Profiles Table / Cards */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-100 shadow-card space-y-5 sm:space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-800">قائمة طلاب الفصل الحالي</h3>
            <p className="text-xs text-slate-500">انقر على أي طالب لجعله الطالب النشط أو مراجعة سجله</p>
          </div>

          <button
            onClick={onOpenCreateProfile}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5B5A] hover:bg-[#E84A5F] text-white font-bold text-xs shadow-coral-glow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة طالب جديد</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profiles.map((p) => {
            const isActive = p.id === activeProfile.id;
            const completedCount = p.progress.completedWeeks.length;

            return (
              <div
                key={p.id}
                onClick={() => {
                  soundFx.playClick();
                  storageService.setActiveProfileId(p.id);
                  onProfileChange(p);
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isActive
                    ? 'border-blue-500 bg-blue-50/40 ring-4 ring-blue-500/10 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CharacterAvatar character={(p.avatarSeed as any) || 'robo'} size="sm" />
                    <div>
                      <div className="font-black text-slate-900 text-sm">{p.name}</div>
                      <div className="text-[11px] text-slate-400 font-bold">{p.nickname}</div>
                    </div>
                  </div>

                  {isActive && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black">
                      النشط الآن
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>المهمات المنجزة:</span>
                    <span className="font-bold font-mono text-slate-900">{completedCount} من 24</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>نقاط الخبرة:</span>
                    <span className="font-bold font-mono text-amber-600">{p.progress.xp} XP</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>الأوسمة:</span>
                    <span className="font-bold font-mono text-indigo-600">{p.progress.earnedBadgeIds.length}</span>
                  </div>
                </div>

                <div className="pt-2 text-center text-[11px] font-bold text-blue-600">
                  {isActive ? '✓ محدد كطالب نشط' : 'انقر للتبديل لهذا الطالب'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Curriculum Quick Browser for Instructor */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-card space-y-6">
        <div>
          <h3 className="text-xl font-black text-slate-800">تصفح المنهج الأسبوعي الشامل (24 أسبوعاً)</h3>
          <p className="text-xs text-slate-500">افتح أي درس لمراجعته أو عرضه مباشرة في قاعة الدرس</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1">
          {LESSONS_DATA.map((l) => (
            <div
              key={l.week}
              onClick={() => onOpenLesson(l.week)}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1 font-bold">
                  <span className="text-blue-600">أسبوع #{l.week}</span>
                  <span className="text-slate-400 font-mono">+{l.xpReward} XP</span>
                </div>
                <h4 className="font-bold text-xs text-slate-800 leading-snug line-clamp-1">{l.missionNameAr}</h4>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{l.titleAr}</p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
                <span>{l.isFullyImplemented ? 'جاهز 100%' : 'موثق'}</span>
                <span className="text-blue-600 font-bold">فتح ←</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

