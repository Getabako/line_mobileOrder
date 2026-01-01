import liff from '@line/liff'

const LIFF_ID = import.meta.env.VITE_LIFF_ID || ''

export interface LiffUser {
  lineUserId: string
  displayName: string
  pictureUrl?: string
}

let isInitialized = false

export const initLiff = async (): Promise<void> => {
  if (isInitialized) return

  if (!LIFF_ID) {
    console.warn('LIFF ID is not set. Running in mock mode.')
    isInitialized = true
    return
  }

  try {
    await liff.init({ liffId: LIFF_ID })
    isInitialized = true

    if (!liff.isLoggedIn()) {
      liff.login()
    }
  } catch (error) {
    console.error('LIFF initialization failed:', error)
    throw error
  }
}

export const getLiffUser = async (): Promise<LiffUser> => {
  if (!LIFF_ID || !liff.isLoggedIn()) {
    // Mock user for development
    return {
      lineUserId: 'mock-user-id',
      displayName: 'テストユーザー',
      pictureUrl: undefined,
    }
  }

  const profile = await liff.getProfile()
  return {
    lineUserId: profile.userId,
    displayName: profile.displayName,
    pictureUrl: profile.pictureUrl,
  }
}

export const isInLiff = (): boolean => {
  return LIFF_ID ? liff.isInClient() : false
}

export const closeLiff = (): void => {
  if (LIFF_ID && liff.isInClient()) {
    liff.closeWindow()
  }
}
