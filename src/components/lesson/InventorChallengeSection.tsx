import React, { useState } from 'react';
import { CheckCircle2, Code2, HelpCircle, Lightbulb, Rocket, Sparkles } from 'lucide-react';
import { DifficultyLevel, InventorChallengeData, LessonDetail } from '../../types/curriculum';
import { CharacterAvatar } from '../characters/CharacterAvatars';
import { SpeakButton } from '../common/SpeakButton';
import { FormattedText } from '../common/FormattedText';
import { soundFx } from '../../services/sound/webAudio';

interface InventorChallengeSectionProps {
  challenge: InventorChallengeData;
  challengeLevels?: LessonDetail['challengeLevels'];
  weekNumber: number;
}

export const InventorChallengeSection: React.FC<InventorChallengeSectionProps> = ({
  challenge,
  challengeLevels = [],
}) => {
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>('explorer');
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>(challenge.ideas[0]?.id || 'best-time');
  const [studentDesignText, setStudentDesignText] = useState<string>('');
  const [checkedFeedback, setCheckedFeedback] = useState<string[] | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  const selectedIdea = challenge.ideas.find((item) => item.id === selectedIdeaId) || challenge.ideas[0];
  const activeTier = challengeLevels.find((t) => t.level === selectedLevel) || challengeLevels[0];

  const handleEvaluateIdea = () => {
    soundFx.playClick();
    const text = studentDesignText.trim().toLowerCase();
    if (!text) {
      soundFx.playFalseStartBuzz();
      setCheckedFeedback([]);
      return;
    }

    const matched = challenge.keySignals
      .filter((sig) => sig.keywords.some((kw) => text.includes(kw.toLowerCase())))
      .map((sig) => sig.labelAr);

    if (matched.length > 0) {
      soundFx.playSuccessChime();
    }
    setCheckedFeedback(matched);
  };

  return (
    <div className="space-y-6 animate-lab-enter">
      {/* Header Banner: Robo + Open-Ended Engineering Problem */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F47C62]/15 border border-[#F47C62]/30 flex items-center justify-center shrink-0">
              <CharacterAvatar character={challenge.character} size="md" expression="excited" />
            </div>
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F47C62]/15 text-[#203447] text-xs font-black">
                <Rocket className="w-3.5 h-3.5 text-[#F47C62]" />
                <span>تحدي المبتكرين — فكّر وصمّم بنفسك</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#203447]">{challenge.titleAr}</h2>
            </div>
          </div>

          <SpeakButton
            compact
            text={`${challenge.scenarioAr}. ${challenge.questionAr}`}
            labelAr="اسمع التحدي"
          />
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFAF6] border border-[#FFC857]/70 space-y-2">
          <p className="text-xs sm:text-sm text-slate-600 font-bold">{challenge.scenarioAr}</p>
          <p className="text-base sm:text-lg font-black text-[#203447] leading-relaxed">
            {challenge.questionAr}
          </p>
        </div>

        {/* 3 Optional Challenge Tiers: Explorer / Builder / Inventor */}
        {challengeLevels.length > 0 && (
          <div className="space-y-3 pt-1">
            <div className="text-xs font-black text-[#203447]">اختر مستواك المناسب للتحدي:</div>
            <div className="grid grid-cols-3 gap-2">
              {challengeLevels.map((tier) => {
                const isSelected = selectedLevel === tier.level;
                return (
                  <button
                    key={tier.level}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedLevel(tier.level);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black border transition-all ${
                      isSelected
                        ? 'bg-[#30A89A] text-white border-[#30A89A] shadow-sm'
                        : 'bg-[#FAFAF6] text-[#203447] border-slate-200 hover:border-[#30A89A]/50'
                    }`}
                  >
                    {tier.titleAr}
                  </button>
                );
              })}
            </div>

            {activeTier && (
              <div className="p-4 rounded-2xl bg-[#FAFAF6] border border-slate-200/80 space-y-2 text-xs sm:text-sm">
                <div className="font-black text-[#203447]">
                  <FormattedText text={activeTier.goalAr} />
                </div>
                <ul className="space-y-1.5 pr-4 list-disc text-slate-700 font-medium">
                  {activeTier.tasksAr.map((t, idx) => (
                    <li key={idx}>
                      <FormattedText text={t} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Balanced 50/50 Workspace: Choose Idea Track | Student Design Notebook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Half 1: Choose Which Upgrade to Design */}
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
          <h3 className="text-base sm:text-lg font-black text-[#203447] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FFC857]" />
            <span>1. اختر الميزة التي تريد تصميمها:</span>
          </h3>

          <div className="space-y-3">
            {challenge.ideas.map((idea) => {
              const isSelected = idea.id === selectedIdeaId;
              return (
                <button
                  key={idea.id}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedIdeaId(idea.id);
                    setCheckedFeedback(null);
                  }}
                  className={`w-full text-right p-4 rounded-2xl border transition-all space-y-1.5 ${
                    isSelected
                      ? 'bg-[#30A89A]/10 border-[#30A89A] shadow-sm'
                      : 'bg-[#FAFAF6] border-slate-200/80 hover:border-[#30A89A]/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black text-sm text-[#203447]">{idea.titleAr}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                        isSelected ? 'bg-[#30A89A] text-white' : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      {idea.badgeAr}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{idea.descriptionAr}</p>
                </button>
              );
            })}
          </div>

          {/* Progressive Optional Hint (Never forces ready solution!) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setShowHint((prev) => !prev);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFC857]/20 hover:bg-[#FFC857]/30 border border-[#FFC857] text-[#203447] text-xs font-black transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-[#F47C62]" />
              <span>{showHint ? 'إخفاء تلميح المهندس' : 'أحتاج تلميحاً صغيراً بدون حرق الحل 💡'}</span>
            </button>

            {showHint && (
              <div className="mt-3 p-4 rounded-2xl bg-[#FFC857]/15 border border-[#FFC857] text-xs sm:text-sm font-bold text-[#203447] leading-relaxed">
                💡 {challenge.hintAr}
              </div>
            )}
          </div>
        </div>

        {/* Half 2: Student Design & Code Sketchpad */}
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-black text-[#203447] flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#6388D8]" />
              <span>2. خطّط للحل بطريقتك ({selectedIdea?.titleAr})</span>
            </h3>
          </div>

          <textarea
            value={studentDesignText}
            onChange={(e) => {
              setStudentDesignText(e.target.value);
              if (checkedFeedback !== null) setCheckedFeedback(null);
            }}
            rows={7}
            placeholder={challenge.starterPromptAr}
            className="w-full p-4 rounded-2xl bg-[#FAFAF6] border border-slate-200 focus:border-[#30A89A] focus:ring-2 focus:ring-[#30A89A]/20 outline-none text-sm font-medium text-[#203447] leading-relaxed resize-none"
          />

          <button
            type="button"
            onClick={handleEvaluateIdea}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#30A89A] hover:bg-[#279185] text-white text-sm font-black shadow-teal-glow transition-all active:scale-98"
          >
            <Lightbulb className="w-4 h-4" />
            <span>راجع خطتي الهندسية ✨</span>
          </button>

          {checkedFeedback !== null && (
            <div
              className={`p-4 rounded-2xl border space-y-2 text-xs sm:text-sm font-bold ${
                checkedFeedback.length > 0
                  ? 'bg-[#30A89A]/10 border-[#30A89A] text-[#203447]'
                  : 'bg-[#F47C62]/10 border-[#F47C62] text-[#203447]'
              }`}
            >
              {studentDesignText.trim().length === 0 ? (
                <span>اكتب فكرتك أولاً ولو بسطرين بالعربية قبل المراجعة!</span>
              ) : checkedFeedback.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 text-[#30A89A] font-black">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>تفكير مهندس حقيقي! خطتك غطّت الأفكار التالية:</span>
                  </div>
                  <ul className="space-y-1 pr-5 list-disc">
                    {checkedFeedback.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <span>
                  بداية رائعة! حاول أن تضيف: (1) اسم متغير لحفظ الرقم، و(2) شرط مقارنة `if` لمعرفة هل الزمن الجديد أصغر أم لا.
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

