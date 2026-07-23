import type { Problem } from '../types'
import { localDateKey } from '../utils/dates'

function day(offset: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return localDateKey(d)
}

/** ~10 bài mẫu để giao diện có dữ liệu minh họa */
export function sampleProblems(): Problem[] {
  const rows: Array<Partial<Problem> & { name: string; rating: number; tags: string[]; date: string }> = [
    { name: 'Watermelon Split', contestId: '4', problemIndex: 'A', rating: 1200, tags: ['math', 'brute force'], date: day(-1), solveTimeMinutes: 12, difficultyFeel: 1, note: 'Bài khởi động, chú ý trường hợp w = 2.', submissions: 1 },
    { name: 'Theatre Square Tiles', contestId: '1', problemIndex: 'A', rating: 1200, tags: ['math'], date: day(-1), solveTimeMinutes: 15, difficultyFeel: 2, submissions: 1 },
    { name: 'Beautiful Matrix', contestId: '263', problemIndex: 'A', rating: 1200, tags: ['implementation'], date: day(-2), solveTimeMinutes: 18, difficultyFeel: 1, submissions: 2 },
    { name: 'Two Pointers Warmup', contestId: '381', problemIndex: 'A', rating: 1200, tags: ['two pointers', 'greedy'], date: day(-2), solveTimeMinutes: 25, difficultyFeel: 2, submissions: 1 },
    { name: 'Binary Search Garden', contestId: '474', problemIndex: 'B', rating: 1200, tags: ['binary search'], date: day(-3), solveTimeMinutes: 30, difficultyFeel: 3, note: 'Nhớ dùng prefix sum + lower_bound.', submissions: 3 },
    { name: 'String Task Filter', contestId: '118', problemIndex: 'A', rating: 1200, tags: ['strings', 'implementation'], date: day(-4), solveTimeMinutes: 14, difficultyFeel: 1, submissions: 1 },
    { name: 'DP Coin Trail', contestId: '996', problemIndex: 'A', rating: 1200, tags: ['dp', 'greedy'], date: day(-5), solveTimeMinutes: 35, difficultyFeel: 3, note: 'Tham lam theo mệnh giá lớn trước.', submissions: 2 },
    { name: 'Graph Islands Count', contestId: '520', problemIndex: 'B', rating: 1200, tags: ['graphs', 'dfs and similar'], date: day(-6), solveTimeMinutes: 40, difficultyFeel: 4, needsReview: true, note: 'BFS từ n về 1 nhanh hơn. Cần làm lại!', submissions: 4 },
    { name: 'Number Theory Gift', contestId: '735', problemIndex: 'A', rating: 1200, tags: ['number theory', 'math'], date: day(-7), solveTimeMinutes: 22, difficultyFeel: 2, submissions: 1 },
    { name: 'Greedy Candy Rush', contestId: '160', problemIndex: 'A', rating: 1200, tags: ['greedy', 'sortings'], date: day(-7), solveTimeMinutes: 20, difficultyFeel: 2, submissions: 2 },
  ]

  return rows.map((r, i) => ({
    id: `sample-${i}`,
    name: r.name,
    url: r.contestId ? `https://codeforces.com/problemset/problem/${r.contestId}/${r.problemIndex}` : undefined,
    contestId: r.contestId,
    problemIndex: r.problemIndex,
    rating: r.rating,
    tags: r.tags,
    status: 'AC',
    note: r.note,
    solveTimeMinutes: r.solveTimeMinutes,
    difficultyFeel: r.difficultyFeel,
    date: r.date,
    createdAt: Date.now() - (10 - i) * 3600_000,
    needsReview: r.needsReview ?? false,
    submissions: r.submissions ?? 1,
  }))
}

export const ALL_TAGS = [
  'implementation', 'math', 'greedy', 'dp', 'data structures', 'brute force',
  'constructive algorithms', 'graphs', 'sortings', 'binary search', 'dfs and similar',
  'trees', 'strings', 'number theory', 'combinatorics', 'two pointers', 'bitmasks', 'geometry',
]
