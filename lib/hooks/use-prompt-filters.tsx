"use client"

import { atom, useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { prompts, PromptStructure } from "@/lib/data/default-prompts"

export interface Filters {
  useCases: string[]

  dateRange: { from: Date | undefined; to: Date | undefined } | null
  bookmarked: boolean
}

export const filtersAtom = atom<Filters>({
  useCases: [],
  dateRange: null,
  bookmarked: false,
})

export function useFilters() {
  return useAtom(filtersAtom)
}

export const searchQueryAtom = atom<string>("")

export function useSearchQuery() {
  return useAtom(searchQueryAtom)
}

export const promptsAtom = atomWithStorage<PromptStructure[]>(
  "prompts",
  prompts,
  undefined,
  { getOnInit: true }
)

export const filteredPromptsAtom = atom(async (get) => {
  const prompts = await get(promptsAtom)
  const searchQuery = get(searchQueryAtom)
  const filters = get(filtersAtom)

  return filterPrompts(prompts, filters, searchQuery)
})

export function filterPrompts(
  prompts: PromptStructure[],
  filters: Filters,
  searchQuery: string
): PromptStructure[] {
  return prompts.filter((prompt) => {
    const lowerCaseTags = prompt.tags
      ? prompt.tags.map((tag) => tag.toLowerCase())
      : []
    const lowerCaseTitle = prompt.title.toLowerCase()
    const lowerCaseDescription = prompt.description?.toLowerCase() ?? ""

    const matchesUseCases =
      filters.useCases.length === 0 ||
      filters.useCases.some((useCase) => lowerCaseTags.includes(useCase))

    const matchesDateRange =
      !filters.dateRange ||
      !filters.dateRange.from ||
      !filters.dateRange.to ||
      (new Date(prompt.created_at) >= filters.dateRange.from &&
        new Date(prompt.created_at) <= filters.dateRange.to)

    const matchesBookmarked = !filters.bookmarked || prompt.bookmarked

    const matchesSearchQuery =
      searchQuery === "" ||
      lowerCaseTitle.includes(searchQuery.toLowerCase()) ||
      lowerCaseDescription.includes(searchQuery.toLowerCase())

    return (
      matchesUseCases &&
      matchesDateRange &&
      matchesBookmarked &&
      matchesSearchQuery
    )
  })
}
