import React, { useState } from 'react';
import { FolderGit2, Plus, Sparkles, Tag, Calendar, Cpu, Code2, ArrowLeft, Star, Download, Check } from 'lucide-react';
import { StudentProfile, StudentProject } from '../../types/student';
import { storageService } from '../../services/storage/localStorage';
import { soundFx } from '../../services/sound/webAudio';

interface ProjectsPageProps {
  activeProfile: StudentProfile;
  onRefreshProfile: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ activeProfile, onRefreshProfile }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<StudentProject | null>(null);

  // Form State
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [weekRef, setWeekRef] = useState(1);
  const [componentsText, setComponentsText] = useState('Arduino UNO, LED, Resistor, Breadboard');
  const [codeSnippet, setCodeSnippet] = useState('void setup() {\n  // your code\n}');
  const [challengesSolvedAr, setChallengesSolvedAr] = useState('');

  const projects = activeProfile.progress.projects || [];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim()) return;

    soundFx.playSuccessChime();

    const comps = componentsText.split(',').map((c) => c.trim()).filter(Boolean);

    storageService.addProject(activeProfile.id, {
      titleAr: titleAr.trim(),
      titleEn: titleEn.trim() || 'My Project',
      descriptionAr: descriptionAr.trim(),
      weekRef,
      componentsUsed: comps,
      codeSnippet: codeSnippet.trim(),
      challengesSolvedAr: challengesSolvedAr.trim(),
      ratingStars: 5,
      tags: ['Arduino', 'Electronics', 'Code'],
    });

    onRefreshProfile();
    setIsModalOpen(false);

    // Reset Form
    setTitleAr('');
    setTitleEn('');
    setDescriptionAr('');
    setChallengesSolvedAr('');
  };

  const handleExportPortfolio = () => {
    soundFx.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `portfolio-${activeProfile.nickname || activeProfile.name}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-8 rounded-3xl bg-white border border-slate-100 shadow-card">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>معرض أعمال المبتكر الصغير</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mt-2">
            مشاريع {activeProfile.nickname || activeProfile.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            سجل إلكتروني يوثق ابتكارات الطالب، دارات الآردوينو المنفذة، والأكواد البرمجية البرمجية
          </p>
        </div>

        <div className="flex items-center gap-3">
          {projects.length > 0 && (
            <button
              onClick={handleExportPortfolio}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              <Download className="w-4 h-4" />
              <span>تصدير المشاريع (JSON)</span>
            </button>
          )}

          <button
            onClick={() => {
              soundFx.playClick();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#FF5B5A] hover:bg-[#E84A5F] text-white text-xs font-bold shadow-coral-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>توثيق مشروع جديد</span>
          </button>
        </div>
      </div>

      {/* Projects Grid or Empty State */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedProject(proj);
              }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-card cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    الأسبوع #{proj.weekRef}
                  </span>
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: proj.ratingStars }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-800 group-hover:text-[#FF5B5A] transition-colors">
                  {proj.titleAr}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {proj.descriptionAr}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex flex-wrap gap-1">
                  {proj.componentsUsed.slice(0, 3).map((comp, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                    >
                      {comp}
                    </span>
                  ))}
                  {proj.componentsUsed.length > 3 && (
                    <span className="text-[10px] text-slate-400">+{proj.componentsUsed.length - 3}</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{proj.completedAt}</span>
                  </span>
                  <span className="font-bold text-blue-600 group-hover:underline">عرض التفاصيل ←</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-card space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <FolderGit2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-800">لا توجد مشاريع موثقة حتى الآن</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            عندما ينهي الطالب حصة الآردوينو أو يصمم دارة جديدة، يمكنه توثيق مشروعه هنا وحفظ الأكواد والمكونات المستخدمة وحصد +50 XP!
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
            >
              أضف أول مشروع الآن
            </button>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                  الأسبوع #{selectedProject.weekRef}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{selectedProject.titleAr}</h3>
                <p className="text-xs text-slate-400">{selectedProject.titleEn}</p>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">وصف المشروع:</h4>
                <p className="text-slate-600 leading-relaxed">{selectedProject.descriptionAr}</p>
              </div>

              {selectedProject.challengesSolvedAr && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                  <h4 className="font-bold mb-1">التحديات الهندسية التي تم حلها:</h4>
                  <p className="leading-relaxed">{selectedProject.challengesSolvedAr}</p>
                </div>
              )}

              <div>
                <h4 className="font-bold text-slate-800 mb-2">المكونات الإلكترونية:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.componentsUsed.map((c, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {selectedProject.codeSnippet && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">كود الآردوينو الخاص بالمشروع:</h4>
                  <div className="bg-slate-900 rounded-2xl p-4 font-mono text-emerald-400 border border-slate-800 overflow-x-auto max-h-56">
                    <pre className="whitespace-pre-wrap">{selectedProject.codeSnippet}</pre>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-6 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">توثيق مشروع جديد</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم المشروع بالعربية *</label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="مثال: جهاز استشعار المسافات الذكي"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم المشروع بالإنجليزية</label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Smart Distance Radar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الأسبوع المرتبط</label>
                <select
                  value={weekRef}
                  onChange={(e) => setWeekRef(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {Array.from({ length: 24 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      الأسبوع #{i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">وصف المشروع</label>
                <textarea
                  rows={3}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="اشرح ماذا يفعل المشروع وكيف بنيته..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المكونات (مفصولة بفاصلة)</label>
                <input
                  type="text"
                  value={componentsText}
                  onChange={(e) => setComponentsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">التحديات التي واجهتها وكيف حللتها</label>
                <textarea
                  rows={2}
                  value={challengesSolvedAr}
                  onChange={(e) => setChallengesSolvedAr(e.target.value)}
                  placeholder="مثال: كان الزر يهتز وتمت معالجته بكود debounce..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">كود الآردوينو</label>
                <textarea
                  rows={4}
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#FF5B5A] text-white font-bold text-xs shadow-coral-glow hover:bg-[#E84A5F]"
                >
                  حفظ المشروع (+50 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

