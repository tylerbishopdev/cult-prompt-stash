/**
 * Prompt Management Global Local State
 *
 * This module provides a comprehensive system for managing prompts in a React application.
 * It uses Jotai for state management and localStorage for persistence.
 *
 * Key features:
 * 1. Config management: Handles initialization status, default prompt loading, and selected prompt.
 * 2. Prompt storage: Stores prompts and draft prompts in localStorage.
 * 3. CRUD operations: Provides functions to create, read, update, and delete prompts.
 * 4. Initialization: Automatically loads default prompts if needed and handles first-run scenarios.
 * 5. Draft management: Allows saving and managing draft versions of prompts.
 *
 * The module uses a custom hook (usePrompts) that encapsulates all prompt-related functionality.
 * It also provides separate atoms and hooks for more granular control over prompt editing and deletion.
 *
 * The configuration and prompts are stored in localStorage and are loaded on initialization.
 * This allows the prompt state to persist across page reloads and browser sessions.
 */

"use client"

import { useCallback, useEffect, useRef } from "react"
import { atom, useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { z } from "zod"

import {
  prompts as defaultPrompts,
  PromptStructure,
  promptStructureSchema,
} from "@/lib/data/default-prompts"

// Type definitions for the configuration
type Config = {
  selected: PromptStructure["id"] | null
  isInitialized: boolean
  shouldLoadDefaults: boolean
  firstRun: boolean
}

// Define the config schema
const configSchema = z.object({
  selected: z.string().nullable(),
  isInitialized: z.boolean(),
  shouldLoadDefaults: z.boolean(),
  firstRun: z.boolean(),
})

// Helper function to get the initial config
const getInitialConfig = (): Config => {
  if (typeof window === "undefined") {
    return {
      selected: null,
      isInitialized: false,
      shouldLoadDefaults: true,
      firstRun: true,
    }
  }

  const storedConfig = localStorage.getItem("promptConfig")
  if (storedConfig) {
    const result = configSchema.safeParse(JSON.parse(storedConfig))
    if (result.success) {
      return {
        selected: result.data.selected ?? null,
        isInitialized: result.data.isInitialized ?? false,
        shouldLoadDefaults: result.data.shouldLoadDefaults ?? true,
        firstRun: result.data.firstRun ?? true,
      }
    }
    console.error("Failed to parse stored config:", result.error)
  }
  return {
    selected: null,
    isInitialized: false,
    shouldLoadDefaults: true,
    firstRun: true,
  }
}

// Define atoms for config, draft prompts, and prompts using atomWithStorage
const configAtom = atomWithStorage<Config>("promptConfig", getInitialConfig(), {
  getItem: (key) => {
    if (typeof window === "undefined") {
      return getInitialConfig()
    }
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : getInitialConfig()
  },
  setItem: (key, value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value))
    }
  },
  removeItem: (key) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key)
    }
  },
  subscribe: (key, callback) => {
    if (typeof window === "undefined") return () => {}
    const handler = (e: StorageEvent) => {
      if (e.key === key) {
        callback(e.newValue ? JSON.parse(e.newValue) : getInitialConfig())
      }
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  },
})

export const promptsAtom = atomWithStorage<PromptStructure[]>("prompts", [], {
  getItem: (key) => {
    if (typeof window === "undefined") {
      return []
    }
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : []
  },
  setItem: (key, value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value))
    }
  },
  removeItem: (key) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key)
    }
  },
  subscribe: (key, callback) => {
    if (typeof window === "undefined") return () => {}
    const handler = (e: StorageEvent) => {
      if (e.key === key) {
        callback(e.newValue ? JSON.parse(e.newValue) : [])
      }
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  },
})

export const draftPromptsAtom = atomWithStorage<
  Record<string, PromptStructure>
>(
  "draftPrompts",
  {},
  {
    getItem: (key) => {
      if (typeof window === "undefined") {
        return {}
      }
      const storedValue = localStorage.getItem(key)
      return storedValue ? JSON.parse(storedValue) : {}
    },
    setItem: (key, value) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value))
      }
    },
    removeItem: (key) => {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key)
      }
    },
    subscribe: (key, callback) => {
      if (typeof window === "undefined") return () => {}
      const handler = (e: StorageEvent) => {
        if (e.key === key) {
          callback(e.newValue ? JSON.parse(e.newValue) : {})
        }
      }
      window.addEventListener("storage", handler)
      return () => window.removeEventListener("storage", handler)
    },
  }
)

// Use the configAtom in your components
export function usePrompt() {
  return useAtom(configAtom)
}

// Custom hook to manage prompts
export const usePrompts = () => {
  const [prompts, setPrompts] = useAtom(promptsAtom)
  const [draftPrompts, setDraftPrompts] = useAtom(draftPromptsAtom)
  const [config, setConfig] = useAtom(configAtom)
  const initializationRef = useRef(false)

  // Initialize prompts on component mount
  useEffect(() => {
    const initializePrompts = () => {
      console.log("Initializing prompts. Current config:", config)
      console.log("Current prompts:", prompts)

      if (config.shouldLoadDefaults && prompts.length === 0) {
        console.log("Loading default prompts")
        setPrompts(defaultPrompts)
        setConfig({
          ...config,
          isInitialized: true,
          firstRun: false,
          shouldLoadDefaults: false,
        })
      } else if (!config.isInitialized) {
        console.log("Marking as initialized")
        setConfig({
          ...config,
          isInitialized: true,
          shouldLoadDefaults: false,
        })
      } else {
        console.log("Already initialized, no action needed")
      }
    }

    if (!initializationRef.current) {
      initializePrompts()
      initializationRef.current = true
    }
  }, [config, prompts, setPrompts, setConfig])

  // Function to create a new prompt
  const createPrompt = useCallback(
    (prompt: Omit<PromptStructure, "id">) => {
      const newPrompt = { ...prompt, id: generateUniqueId() }
      const validationResult = promptStructureSchema.safeParse(newPrompt)

      if (validationResult.success) {
        setPrompts([...prompts, validationResult.data])
      } else {
        console.error(
          "Failed to create prompt: Invalid prompt structure",
          validationResult.error
        )
        // You might want to handle this error in your UI as well
      }
    },
    [prompts, setPrompts]
  )

  // Function to delete a prompt
  const deletePrompt = useCallback(
    (id: string) => {
      setPrompts(prompts.filter((prompt) => prompt.id !== id))
      if (config?.selected === id) {
        setConfig({ ...config, selected: null })
      }
    },
    [prompts, setPrompts, config, setConfig]
  )

  // Function to edit a prompt
  const editPrompt = useCallback(
    (id: string, updatedPrompt: Partial<PromptStructure>) => {
      setPrompts(
        prompts.map((prompt) => {
          if (prompt.id === id) {
            const updatedFullPrompt = { ...prompt, ...updatedPrompt }
            const validationResult =
              promptStructureSchema.safeParse(updatedFullPrompt)

            if (validationResult.success) {
              return validationResult.data
            } else {
              console.error(
                "Failed to update prompt: Invalid prompt structure",
                validationResult.error
              )
              return prompt // Keep the original prompt if validation fails
            }
          }
          return prompt
        })
      )
    },
    [prompts, setPrompts]
  )

  // Function to toggle bookmark status
  const toggleBookmark = useCallback(
    (id: string) => {
      setPrompts(
        prompts.map((prompt) =>
          prompt.id === id
            ? { ...prompt, bookmarked: !prompt.bookmarked }
            : prompt
        )
      )
    },
    [prompts, setPrompts]
  )

  // Function to save a draft prompt
  const saveDraftPrompt = useCallback(
    (id: string, draftPrompt: PromptStructure) => {
      const validationResult = promptStructureSchema.safeParse(draftPrompt)

      if (validationResult.success) {
        setDraftPrompts({
          ...draftPrompts,
          [id]: validationResult.data,
        })
      } else {
        console.error(
          "Failed to save draft prompt: Invalid prompt structure",
          validationResult.error
        )
        // You might want to handle this error in your UI as well
      }
    },
    [draftPrompts, setDraftPrompts]
  )

  // Function to delete a draft prompt
  const deleteDraftPrompt = useCallback(
    (id: string) => {
      const { [id]: _, ...rest } = draftPrompts
      setDraftPrompts(rest)
    },
    [draftPrompts, setDraftPrompts]
  )

  // Function to toggle lock status
  const toggleLock = useCallback(
    (id: string) => {
      setPrompts(
        prompts.map((prompt) =>
          prompt.id === id ? { ...prompt, locked: !prompt.locked } : prompt
        )
      )
    },
    [prompts, setPrompts]
  )

  // Function to save a draft as a final prompt
  const saveDraftAsFinalPrompt = useCallback(
    (id: string) => {
      const draftPrompt = draftPrompts[id]
      if (draftPrompt) {
        const validationResult = promptStructureSchema.safeParse(draftPrompt)

        if (validationResult.success) {
          editPrompt(id, validationResult.data)
          deleteDraftPrompt(id)
        } else {
          console.error(
            "Failed to save draft as final prompt: Invalid prompt structure",
            validationResult.error
          )
          // You might want to handle this error in your UI as well
        }
      }
    },
    [draftPrompts, editPrompt, deleteDraftPrompt]
  )

  // Function to delete all prompts
  const deleteAllPrompts = useCallback(() => {
    console.log("Deleting all prompts")
    setPrompts([])
    setDraftPrompts({})
    setConfig({
      ...config,
      selected: null,
      isInitialized: true,
      shouldLoadDefaults: false,
      firstRun: false,
    })
    initializationRef.current = false // Reset initialization flag
  }, [setPrompts, setDraftPrompts, setConfig, config])

  // Function to restore default prompts
  const restoreDefaultPrompts = useCallback(() => {
    setPrompts(defaultPrompts)
    setDraftPrompts({})
    setConfig({
      ...config,
      isInitialized: true,
      shouldLoadDefaults: false,
      firstRun: false,
    })
    initializationRef.current = false // Reset initialization flag
  }, [setPrompts, setDraftPrompts, setConfig, config])

  return {
    prompts,
    createPrompt,
    deletePrompt,
    toggleLock,
    editPrompt,
    toggleBookmark,
    draftPrompts,
    saveDraftPrompt,
    deleteDraftPrompt,
    saveDraftAsFinalPrompt,
    deleteAllPrompts,
    restoreDefaultPrompts,
  }
}

// Generate a unique ID
const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9)
}

// Refactored editPromptAtom
export const editPromptAtom = atom(
  null,
  (
    get,
    set,
    {
      id,
      updatedPrompt,
    }: { id: string; updatedPrompt: Partial<PromptStructure> }
  ) => {
    const prompts = get(promptsAtom)
    set(
      promptsAtom,
      prompts.map((prompt) => {
        if (prompt.id === id) {
          const updatedFullPrompt = { ...prompt, ...updatedPrompt }
          const validationResult =
            promptStructureSchema.safeParse(updatedFullPrompt)

          if (validationResult.success) {
            return validationResult.data
          } else {
            console.error(
              "Failed to update prompt: Invalid prompt structure",
              validationResult.error
            )
            return prompt // Keep the original prompt if validation fails
          }
        }
        return prompt
      })
    )
  }
)

// Refactored deletePromptAtom
export const deletePromptAtom = atom(null, (get, set, id: string) => {
  const prompts = get(promptsAtom)
  set(
    promptsAtom,
    prompts.filter((prompt) => prompt.id !== id)
  )

  const config = get(configAtom)
  if (config?.selected === id) {
    set(configAtom, { ...config, selected: null })
  }
})

// Custom hook to use editPromptAtom
export function useEditPrompt() {
  const [, editPrompt] = useAtom(editPromptAtom)
  return editPrompt
}

// Custom hook to use deletePromptAtom
export function useDeletePrompt() {
  const [, deletePrompt] = useAtom(deletePromptAtom)
  return deletePrompt
}
