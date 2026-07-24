import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { hydrateFromRemote, stopSync } from '../lib/sync'

export type AuthStatus = 'loading' | 'signedOut' | 'guest' | 'signedIn'

export interface RemoteProfile {
  id: string
  name: string
  avatar_url: string | null
  role: 'user' | 'admin'
  login_reward_day: number
  last_reward_date: string | null
}

interface AuthState {
  status: AuthStatus
  session: Session | null
  profile: RemoteProfile | null
  init: () => void
  continueAsGuest: () => void
  signInWithGoogle: () => Promise<string | null>
  signOut: () => Promise<void>
  setProfile: (p: RemoteProfile) => void
}

const GUEST_KEY = 'rtw-guest-mode'
let initialized = false

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: 'loading',
  session: null,
  profile: null,

  init: () => {
    if (initialized) return
    initialized = true

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        localStorage.removeItem(GUEST_KEY)
        set({ session, status: 'signedIn' })
        // nạp dữ liệu từ cloud + bắt đầu đồng bộ (an toàn khi gọi lại)
        void hydrateFromRemote(session).then((profile) => {
          if (profile) set({ profile })
        })
      } else {
        stopSync()
        set({
          session: null,
          profile: null,
          status: localStorage.getItem(GUEST_KEY) ? 'guest' : 'signedOut',
        })
      }
    })
  },

  continueAsGuest: () => {
    localStorage.setItem(GUEST_KEY, '1')
    set({ status: 'guest' })
  },

  /** trả về message lỗi nếu thất bại, null nếu đang chuyển hướng */
  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    return error ? error.message : null
  },

  signOut: async () => {
    stopSync()
    await supabase.auth.signOut()
    localStorage.removeItem(GUEST_KEY)
    get().init()
    set({ session: null, profile: null, status: 'signedOut' })
  },

  setProfile: (profile) => set({ profile }),
}))
