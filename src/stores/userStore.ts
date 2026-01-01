import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  lineUserId: string | null
  displayName: string | null
  pictureUrl: string | null
  setUser: (user: { lineUserId: string; displayName: string; pictureUrl?: string }) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      lineUserId: null,
      displayName: null,
      pictureUrl: null,

      setUser: (user) => {
        set({
          lineUserId: user.lineUserId,
          displayName: user.displayName,
          pictureUrl: user.pictureUrl || null,
        })
      },

      clearUser: () => {
        set({
          lineUserId: null,
          displayName: null,
          pictureUrl: null,
        })
      },
    }),
    {
      name: 'user-storage',
    }
  )
)
