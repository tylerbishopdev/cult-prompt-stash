"use client"

import { atom, useAtom } from "jotai"

import { promptsAtom } from "./use-prompts"

const allTagsAtom = atom(async (get) => {
  const promptsData = await get(promptsAtom)

  const tags: {
    useCases: { id: string; label: string; count: number }[]
    type: { id: string; label: string; count: number }[]
  } = {
    useCases: [],
    type: [],
  }

  promptsData?.forEach((prompt) => {
    if (prompt.tags) {
      prompt.tags.forEach((tag) => {
        const lowercaseTag = tag.toLowerCase()
        if (lowercaseTag.includes("prompttemplate")) {
          const existingType = tags.type.find((t) => t.id === lowercaseTag)
          if (existingType) {
            existingType.count++
          } else {
            tags.type.push({
              id: lowercaseTag,
              label: lowercaseTag
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              count: 1,
            })
          }
        } else {
          const existingUseCase = tags.useCases.find(
            (u) => u.id === lowercaseTag
          )
          if (existingUseCase) {
            existingUseCase.count++
          } else {
            tags.useCases.push({
              id: lowercaseTag,
              label: lowercaseTag
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              count: 1,
            })
          }
        }
      })
    }
  })

  return tags
})

export function useAllTags() {
  return useAtom(allTagsAtom)
}
