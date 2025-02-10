"use client"

import React, { useState } from "react"
import { Tag } from "lucide-react"

import { PromptStructure } from "@/lib/data/default-prompts"
import { useFilters } from "@/lib/hooks/use-prompt-filters"
import { useAllTags } from "@/lib/hooks/use-tags"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FilterSidebarProps {
  isCollapsed: boolean
}

export interface Filters {
  useCases: string[]
  dateRange: { from: Date | undefined; to: Date | undefined } | null
  bookmarked: boolean
}

export function PromptFilterListSidebar({ isCollapsed }: FilterSidebarProps) {
  const [openCollapsible, setOpenCollapsible] = useState("useCases")
  const [tags] = useAllTags()
  const [filters, setFilters] = useFilters()

  const handleCollapsibleChange = (id: string) => {
    setOpenCollapsible(openCollapsible === id ? "" : id)
  }

  const handleCheckboxChange = (category: keyof Filters, itemId: string) => {
    setFilters((prevFilters) => {
      const categoryFilters = prevFilters[category] as string[]
      const updatedFilters = categoryFilters.includes(itemId)
        ? categoryFilters.filter((id) => id !== itemId)
        : [...categoryFilters, itemId]
      return { ...prevFilters, [category]: updatedFilters }
    })
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 py-2",
        isCollapsed ? "items-center" : "pl-2"
      )}
    >
      <Collapsible
        open={!isCollapsed && openCollapsible === "useCases"}
        onOpenChange={() => handleCollapsibleChange("useCases")}
      >
        <CollapsibleTrigger>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex items-center gap-2 px-2 py-1",
                  isCollapsed && "justify-center"
                )}
              >
                <Tag
                  className={cn(
                    "h-4 w-4",
                    isCollapsed
                      ? "fill-stone-500/60 stroke-stone-800/80 dark:stroke-stone-200/30"
                      : "stroke-muted-foreground/80"
                  )}
                />
                {!isCollapsed && (
                  <span className="text-sm text-muted-foreground">Tags</span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Use Cases</TooltipContent>
          </Tooltip>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ScrollArea className="h-36 md:h-96 xl:h-[calc(100vh-190px)] border-l border-border/50">
            {tags.useCases.map((item) => (
              <div key={item.id} className="flex items-center gap-2 px-4 py-1">
                <Checkbox
                  id={item.id}
                  checked={filters.useCases.includes(item.id)}
                  onCheckedChange={() =>
                    handleCheckboxChange("useCases", item.id)
                  }
                />
                <label
                  htmlFor={item.id}
                  className="text-xs text-muted-foreground"
                >
                  {item.label}
                </label>
                <span className="ml-auto text-muted-foreground/50 text-xs">
                  {item.count}
                </span>
              </div>
            ))}
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export function filterPrompts(
  prompts: PromptStructure[],
  filters: Filters,
  searchQuery: string
): PromptStructure[] {
  const filteredPrompts = prompts.filter((prompt) => {
    const lowerCaseTags = prompt.tags
      ? prompt.tags.map((tag) => tag.toLowerCase())
      : []
    const lowerCaseTitle = prompt.title.toLowerCase()
    const lowerCaseDescription = prompt.description?.toLowerCase() ?? ""

    const matchesUseCases =
      filters.useCases.length === 0 ||
      filters.useCases.some((useCase) => lowerCaseTags.includes(useCase))

    const matchesBookmarked = !filters.bookmarked || prompt.bookmarked

    const matchesSearchQuery =
      searchQuery === "" ||
      lowerCaseTitle.includes(searchQuery.toLowerCase()) ||
      lowerCaseDescription.includes(searchQuery.toLowerCase())

    return matchesUseCases && matchesBookmarked && matchesSearchQuery
  })

  // Sort the filtered prompts by updated_at, newest first
  return filteredPrompts.sort((a, b) => {
    const dateA = a.updated_at ? new Date(a.updated_at) : new Date(a.created_at)
    const dateB = b.updated_at ? new Date(b.updated_at) : new Date(b.created_at)
    return dateB.getTime() - dateA.getTime()
  })
}
