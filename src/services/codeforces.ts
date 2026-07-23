/**
 * Service làm việc với Codeforces.
 * Phiên bản hiện tại chỉ parse URL; đã chuẩn bị sẵn chỗ để gắn Codeforces API sau này.
 */

export interface ParsedProblem {
  contestId: string
  problemIndex: string
}

/**
 * Hỗ trợ các dạng link:
 *  - https://codeforces.com/problemset/problem/1729/A
 *  - https://codeforces.com/contest/1729/problem/A
 *  - https://codeforces.com/gym/104114/problem/B
 */
export function parseProblemUrl(url: string): ParsedProblem | null {
  try {
    const u = new URL(url.trim())
    if (!/codeforces\.(com|ml|es)$/i.test(u.hostname.replace(/^www\./, ''))) return null
    const parts = u.pathname.split('/').filter(Boolean)

    if (parts[0] === 'problemset' && parts[1] === 'problem' && parts[2] && parts[3]) {
      return { contestId: parts[2], problemIndex: parts[3].toUpperCase() }
    }
    if ((parts[0] === 'contest' || parts[0] === 'gym') && parts[1] && parts[2] === 'problem' && parts[3]) {
      return { contestId: parts[1], problemIndex: parts[3].toUpperCase() }
    }
    return null
  } catch {
    return null
  }
}

export interface RemoteProblemInfo {
  name?: string
  rating?: number
  tags?: string[]
}

/**
 * Chuẩn bị cho tương lai: gọi Codeforces API để lấy tên bài, rating và tag.
 * (https://codeforces.com/api/problemset.problems)
 * Hiện trả về null để app hoạt động hoàn toàn offline.
 */
export async function fetchProblemInfo(_parsed: ParsedProblem): Promise<RemoteProblemInfo | null> {
  return null
}
