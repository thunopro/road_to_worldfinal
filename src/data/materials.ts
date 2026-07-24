export interface MaterialItem {
  id: string
  name: string
  kind: 'doc' | 'exercises'
  topic: string
  price: number
  desc: string
  emoji: string
  links: Array<{ label: string; url: string }>
}

/**
 * Cửa hàng học liệu: dùng xu cày được để mở khóa tài liệu & bộ bài tập
 * các thuật toán nâng cao. Giá tăng dần theo độ khó của chủ đề.
 */
export const MATERIALS: MaterialItem[] = [
  {
    id: 'doc-dsu', name: 'Tài liệu DSU', kind: 'doc', topic: 'DSU', price: 150, emoji: '📗',
    desc: 'Disjoint Set Union — nền tảng của mọi kiếm sĩ.',
    links: [
      { label: 'cp-algorithms: Disjoint Set Union', url: 'https://cp-algorithms.com/data_structures/disjoint_set_union.html' },
      { label: 'VNOI Wiki', url: 'https://vnoi.info/wiki/' },
    ],
  },
  {
    id: 'ex-dsu', name: 'Bài tập DSU', kind: 'exercises', topic: 'DSU', price: 100, emoji: '📝',
    desc: 'Bộ bài luyện DSU từ dễ đến khó.',
    links: [
      { label: 'CF 25D — Roads not only in Berland', url: 'https://codeforces.com/problemset/problem/25/D' },
      { label: 'CF 1213G — Path Queries', url: 'https://codeforces.com/problemset/problem/1213/G' },
      { label: 'CF 87D — Beautiful Road', url: 'https://codeforces.com/problemset/problem/87/D' },
    ],
  },
  {
    id: 'doc-segtree', name: 'Tài liệu Segment Tree nâng cao', kind: 'doc', topic: 'Segment Tree', price: 250, emoji: '📘',
    desc: 'Lazy propagation, segment tree trên tập hợp, merge tree.',
    links: [
      { label: 'cp-algorithms: Segment Tree', url: 'https://cp-algorithms.com/data_structures/segment_tree.html' },
      { label: 'USACO Guide: Segment Trees', url: 'https://usaco.guide/gold/PURS' },
    ],
  },
  {
    id: 'ex-segtree', name: 'Bài tập Segment Tree', kind: 'exercises', topic: 'Segment Tree', price: 180, emoji: '📝',
    desc: 'Luyện lazy propagation và các biến thể.',
    links: [
      { label: 'CF 52C — Circular RMQ', url: 'https://codeforces.com/problemset/problem/52/C' },
      { label: 'CF 380C — Sereja and Brackets', url: 'https://codeforces.com/problemset/problem/380/C' },
      { label: 'SPOJ GSS3', url: 'https://www.spoj.com/problems/GSS3/' },
    ],
  },
  {
    id: 'doc-hld', name: 'Tài liệu HLD', kind: 'doc', topic: 'HLD', price: 400, emoji: '📙',
    desc: 'Heavy-Light Decomposition — chia cây trị vì thiên hạ.',
    links: [
      { label: 'cp-algorithms: Heavy-light decomposition', url: 'https://cp-algorithms.com/graph/hld.html' },
      { label: 'USACO Guide: HLD', url: 'https://usaco.guide/plat/hld' },
    ],
  },
  {
    id: 'ex-hld', name: 'Bài tập HLD', kind: 'exercises', topic: 'HLD', price: 300, emoji: '📝',
    desc: 'Những bài HLD kinh điển phải làm một lần trong đời.',
    links: [
      { label: 'CF 343D — Water Tree', url: 'https://codeforces.com/problemset/problem/343/D' },
      { label: 'CF 165D — Beard Graph', url: 'https://codeforces.com/problemset/problem/165/D' },
      { label: 'SPOJ QTREE', url: 'https://www.spoj.com/problems/QTREE/' },
    ],
  },
  {
    id: 'doc-centroid', name: 'Tài liệu Centroid Decomposition', kind: 'doc', topic: 'Centroid', price: 450, emoji: '📕',
    desc: 'Phân rã trọng tâm — nhìn cây theo cách hoàn toàn khác.',
    links: [
      { label: 'USACO Guide: Centroid Decomposition', url: 'https://usaco.guide/plat/centroid' },
      { label: 'Codeforces blog: Centroid Decomposition', url: 'https://codeforces.com/blog/entry/81661' },
    ],
  },
  {
    id: 'ex-centroid', name: 'Bài tập Centroid', kind: 'exercises', topic: 'Centroid', price: 350, emoji: '📝',
    desc: 'Chinh phục trọng tâm của cây qua các bài kinh điển.',
    links: [
      { label: 'CF 342E — Xenia and Tree', url: 'https://codeforces.com/problemset/problem/342/E' },
      { label: 'CF 321C — Ciel the Commander', url: 'https://codeforces.com/problemset/problem/321/C' },
    ],
  },
  {
    id: 'doc-flow', name: 'Tài liệu Luồng (Max Flow)', kind: 'doc', topic: 'Luồng', price: 500, emoji: '📓',
    desc: 'Luồng cực đại, lát cắt cực tiểu, Dinic — vũ khí tối thượng.',
    links: [
      { label: 'cp-algorithms: Maximum flow (Dinic)', url: 'https://cp-algorithms.com/graph/dinic.html' },
      { label: 'cp-algorithms: Edmonds-Karp', url: 'https://cp-algorithms.com/graph/edmonds_karp.html' },
      { label: 'cp-algorithms: Min-cost flow', url: 'https://cp-algorithms.com/graph/min_cost_flow.html' },
    ],
  },
  {
    id: 'ex-flow', name: 'Bài tập Luồng', kind: 'exercises', topic: 'Luồng', price: 400, emoji: '📝',
    desc: 'Từ luồng cơ bản đến matching và min-cut.',
    links: [
      { label: 'SPOJ FASTFLOW', url: 'https://www.spoj.com/problems/FASTFLOW/' },
      { label: 'CF 546E — Soldier and Traveling', url: 'https://codeforces.com/problemset/problem/546/E' },
    ],
  },
  {
    id: 'doc-2sat', name: 'Tài liệu Two-SAT', kind: 'doc', topic: 'Two-SAT', price: 400, emoji: '📔',
    desc: 'Giải bài toán thỏa mãn với SCC — logic là sức mạnh.',
    links: [
      { label: 'cp-algorithms: 2-SAT', url: 'https://cp-algorithms.com/graph/2SAT.html' },
      { label: 'USACO Guide: 2-SAT', url: 'https://usaco.guide/adv/2SAT' },
    ],
  },
  {
    id: 'ex-2sat', name: 'Bài tập Two-SAT', kind: 'exercises', topic: 'Two-SAT', price: 300, emoji: '📝',
    desc: 'Các bài 2-SAT hay nhất từng xuất hiện trên CF.',
    links: [
      { label: 'CF 776D — The Door Problem', url: 'https://codeforces.com/problemset/problem/776/D' },
      { label: 'CF 228E — The Road to Berland is Paved', url: 'https://codeforces.com/problemset/problem/228/E' },
    ],
  },
  {
    id: 'doc-fft', name: 'Tài liệu FFT', kind: 'doc', topic: 'FFT', price: 600, emoji: '📖',
    desc: 'Biến đổi Fourier nhanh — nhân đa thức trong O(n log n).',
    links: [
      { label: 'cp-algorithms: FFT', url: 'https://cp-algorithms.com/algebra/fft.html' },
      { label: 'USACO Guide: FFT', url: 'https://usaco.guide/adv/fft' },
    ],
  },
]

export function materialById(id: string): MaterialItem | undefined {
  return MATERIALS.find((m) => m.id === id)
}
