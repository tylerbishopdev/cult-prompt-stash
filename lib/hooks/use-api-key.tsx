"use client"

import { atom, useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { secretKey, xorEncrypt } from "../utils"

// Define the settings state using Jotai atomWithStorage
const settingsAtom = atomWithStorage("settings", {
  USER_OPEN_AI_API_KEY: "",
})

// Custom hook for managing settings
export const useSettings = () => {
  const [settings, setSettings] = useAtom(settingsAtom)

  // Function to update the USER_OPEN_AI_API_KEY
  const setUserOpenAIApiKey = (apiKey: string) => {
    const encodedApiKey = xorEncrypt(apiKey, secretKey)
    setSettings((prevSettings) => ({
      ...prevSettings,
      USER_OPEN_AI_API_KEY: encodedApiKey,
    }))
  }

  return {
    settings,
    setUserOpenAIApiKey,
  }
}

const isOpenSettingsModalAtom = atom(false)

// Custom hook for managing settings
export const useSettingsModal = () => {
  const [isOpenSettingsModal, setIsOpenSettingsModal] = useAtom(
    isOpenSettingsModalAtom
  )
  const toggleSettingsModal = () => {
    setIsOpenSettingsModal((prev) => !prev)
  }

  return {
    isOpenSettingsModal,
    toggleSettingsModal,
  }
}
