import DailyQuestCard from '../components/quests/DailyQuestCard'
import { DAILY_QUESTS, WEEKLY_QUESTS } from '../data/quests'
import { rollConsumableDrop, rollGearDrop, RARITY_META, type GearItem } from '../data/equipment'
import { STORY_CHAPTERS } from '../data/storyline'
import { useAppStore } from '../store/useAppStore'
import { playFanfare } from '../utils/sound'

/** Trang nhiệm vụ: kịch bản chính (questline) + nhiệm vụ phụ ngày/tuần */
export default function QuestsPage() {
  const totalAC = useAppStore((s) => s.totalAC)
  const streak = useAppStore((s) => s.streak)
  const coins = useAppStore((s) => s.user.coins)
  const milestoneIndex = useAppStore((s) => s.milestoneIndex)
  const problems = useAppStore((s) => s.problems)
  const storyProgress = useAppStore((s) => s.storyProgress)
  const inventory = useAppStore((s) => s.inventory)
  const advanceStory = useAppStore((s) => s.advanceStory)
  const addConsumable = useAppStore((s) => s.addConsumable)
  const pushToast = useAppStore((s) => s.pushToast)
  const soundOn = useAppStore((s) => s.settings.soundOn)

  const storyState = {
    totalAC,
    streakCurrent: streak.current,
    streakLongest: streak.longest,
    coins,
    milestoneIndex,
    problems,
  }

  const chapter = STORY_CHAPTERS[storyProgress]
  const allDone = storyProgress >= STORY_CHAPTERS.length
  const progress = chapter ? Math.min(chapter.target, chapter.progress(storyState)) : 0
  const chapterDone = chapter ? progress >= chapter.target : false

  const claimChapter = () => {
    if (!chapter || !chapterDone) return
    let dropped: GearItem | null = null
    if (chapter.drop === 'chance') {
      if (Math.random() < 0.4) dropped = rollGearDrop(inventory)
    } else if (chapter.drop !== 'none') {
      dropped = rollGearDrop(inventory, chapter.drop)
    }
    advanceStory(chapter.rewardCoins, dropped?.id ?? null)
    // mỗi chương hoàn thành tặng kèm 2 bình thuốc ngẫu nhiên cho hành trang chiến đấu
    const potion1 = rollConsumableDrop()
    const potion2 = rollConsumableDrop()
    addConsumable(potion1.id, 1)
    addConsumable(potion2.id, 1)
    const potionText = potion1.id === potion2.id ? `2× ${potion1.name}` : `${potion1.name} + ${potion2.name}`
    pushToast({
      title: `Hoàn thành "${chapter.title}"! +${chapter.rewardCoins} xu 🪙`,
      subtitle: `🧪 Nhận thêm ${potionText}. ${STORY_CHAPTERS[storyProgress + 1]
        ? `Chương tiếp theo: ${STORY_CHAPTERS[storyProgress + 1].title}`
        : 'Bạn đã đi hết kịch bản hiện tại!'}`,
      tone: 'success',
    })
    if (dropped) {
      playFanfare(soundOn)
      const statText = Object.entries(dropped.stats)
        .map(([k, v]) => `${k.toUpperCase()} +${v}`)
        .join(', ')
      pushToast({
        title: `💥 Rơi vật phẩm ${RARITY_META[dropped.rarity].label}: ${dropped.emoji} ${dropped.name}!`,
        subtitle: `${statText} — vào Cửa hàng → Kho trang bị để mặc.`,
        tone: 'success',
      })
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">🎯 Nhiệm vụ</h1>
      <p className="text-sm text-slate-500 mb-4">Theo kịch bản chính để nhận trang bị, làm nhiệm vụ phụ để cày xu mỗi ngày.</p>

      {/* ===== kịch bản chính ===== */}
      <h2 className="font-extrabold text-lg mb-2.5">📜 Kịch bản chính</h2>
      {allDone ? (
        <div className="game-panel p-6 text-center mb-6">
          <div className="text-4xl mb-2">🏆</div>
          <div className="font-extrabold text-[#3d3222]">Bạn đã hoàn thành toàn bộ kịch bản hiện tại!</div>
          <div className="text-sm text-[#8a7550] mt-1">Những chương mới sẽ được cập nhật trong tương lai. Hãy tiếp tục cày rank nhé!</div>
        </div>
      ) : (
        <div className="game-panel relative p-5 mb-4">
          <div className="absolute -top-4 left-4 px-3 py-1 rounded-full bg-[#2f3b5c] border-2 border-[#4a5a85] text-[11px] font-extrabold text-amber-200">
            CHƯƠNG {storyProgress + 1}/{STORY_CHAPTERS.length}
          </div>
          <div className="flex items-start gap-4 flex-col md:flex-row">
            <div className="text-5xl shrink-0" aria-hidden="true">{chapter.emoji}</div>
            <div className="flex-1 min-w-0 w-full">
              <div className="font-extrabold text-lg text-[#3d3222]">{chapter.title}</div>
              <p className="text-sm text-[#8a7550] mt-0.5">{chapter.desc}</p>
              <div className="mt-3 flex items-center gap-3">
                <div
                  className="flex-1 h-4 rounded-full bg-[#e6d9b8] border-2 border-[#c9b78d] overflow-hidden"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={chapter.target}
                  aria-label={`${chapter.title}: ${progress}/${chapter.target}`}
                >
                  <div
                    className={`h-full rounded-full ${chapterDone ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-sky-400 to-violet-400'}`}
                    style={{ width: `${Math.round((progress / chapter.target) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-extrabold text-[#5c4d33] whitespace-nowrap">{progress}/{chapter.target}</span>
              </div>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="game-inset px-3 py-1 text-xs font-extrabold text-amber-700">🪙 +{chapter.rewardCoins} xu</span>
                {chapter.drop !== 'none' && (
                  <span className="game-inset px-3 py-1 text-xs font-extrabold text-violet-600">
                    🎁 {chapter.drop === 'chance' ? 'Có thể rơi trang bị' : `Chắc chắn rơi đồ ${RARITY_META[chapter.drop].label}+`}
                  </span>
                )}
                {chapterDone && (
                  <button
                    onClick={claimChapter}
                    className="game-btn ml-auto px-5 py-2 font-extrabold text-white bg-gradient-to-b from-amber-400 to-orange-500 border-2 border-amber-700"
                    style={{ animation: 'pulse-soft 1.5s ease-in-out infinite' }}
                  >
                    Nhận thưởng! 🎉
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* các chương sắp tới */}
      {!allDone && storyProgress + 1 < STORY_CHAPTERS.length && (
        <div className="flex gap-2 flex-wrap mb-6">
          {STORY_CHAPTERS.slice(storyProgress + 1, storyProgress + 4).map((c) => (
            <div key={c.id} className="game-inset px-3 py-1.5 text-xs font-bold text-[#8a7550] opacity-75">
              🔒 {c.emoji} {c.title}
            </div>
          ))}
          {storyProgress + 4 < STORY_CHAPTERS.length && (
            <div className="px-2 py-1.5 text-xs font-bold text-[#8a7550]">… và {STORY_CHAPTERS.length - storyProgress - 4} chương nữa</div>
          )}
        </div>
      )}

      {/* chương đã hoàn thành */}
      {storyProgress > 0 && (
        <details className="mb-6">
          <summary className="text-xs font-extrabold text-[#8a7550] cursor-pointer select-none">
            ✅ {storyProgress} chương đã hoàn thành
          </summary>
          <div className="flex gap-2 flex-wrap mt-2">
            {STORY_CHAPTERS.slice(0, storyProgress).map((c) => (
              <span key={c.id} className="game-inset px-3 py-1.5 text-xs font-bold text-emerald-700">
                ✅ {c.emoji} {c.title}
              </span>
            ))}
          </div>
        </details>
      )}

      {/* ===== nhiệm vụ phụ ===== */}
      <h2 className="font-extrabold text-lg mb-2.5">🌅 Nhiệm vụ phụ hằng ngày</h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
        {DAILY_QUESTS.map((q) => (
          <DailyQuestCard key={q.id} quest={q} />
        ))}
      </div>

      <h2 className="font-extrabold text-lg mb-2.5">🗓️ Nhiệm vụ phụ hằng tuần</h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {WEEKLY_QUESTS.map((q) => (
          <DailyQuestCard key={q.id} quest={q} />
        ))}
      </div>
    </div>
  )
}
