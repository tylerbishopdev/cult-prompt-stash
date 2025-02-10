"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Bookmark, Sparkles } from "lucide-react"

import { PromptStructure } from "@/lib/data/default-prompts"
import { usePrompt, usePrompts } from "@/lib/hooks/use-prompts"
import { cn, formatRelativeTime } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { GradientHeading } from "./cult/gradient-heading"
import { PopIn } from "./cult/pop-in"
import TextureCard, {
  TextureCardContent,
  TextureCardDescription,
  TextureCardHeader,
  TextureCardTitle,
} from "./cult/texture-card"

export function PromptCard({
  prompt: originalPrompt,
}: {
  prompt: PromptStructure
}) {
  const [prompt, setPrompt] = usePrompt()

  return (
    <div className="flex flex-col space-y-4">
      <TextureCard
        className={cn(
          originalPrompt.id === prompt.selected
            ? "shadow-inner border border-black/10 bg-white dark:bg-muted/60 ring-1 ring-offset-2 ring-offset-background ring-accent/30  transition-colors duration-200"
            : ""
        )}
      >
        <TextureCardHeader className="mr-3 ml-4 space-y-4">
          {/* Tags */}
          <div className="mb-2 -ml-[9px]">
            <div className="flex flex-wrap gap-2 -mt-[17px]">
              {originalPrompt.tags &&
                originalPrompt?.tags.map((tag) => (
                  <Badge
                    variant="outline"
                    key={tag}
                    className="text-xs rounded-[5px] first-of-type:rounded-tl-[9px] last-of-type:rounded-br-[9px] text-muted-foreground font-light"
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>

          {/* Title */}
          <GradientHeading size="sm" className="text-left " weight="semi">
            {originalPrompt.title}
          </GradientHeading>

          {/* Description */}
          <TextureCardDescription className="text-pretty max-w-md">
            {originalPrompt.description}
          </TextureCardDescription>
        </TextureCardHeader>
        <TextureCardContent className="pl-4">
          {/* Date */}
          <div className="flex space-x-1 text-xs text-stone-500 mb-1">
            <span>Prompt</span>
            <span>•</span>
            <span>{formatRelativeTime(originalPrompt.created_at)}</span>
          </div>

          {/* Bookmark */}
          <BookmarkButton
            initialBookmarked={originalPrompt.bookmarked}
            id={originalPrompt.id}
          />
        </TextureCardContent>
        {/* Select prompt button */}
        <div className="absolute bottom-4 right-3">
          <SelectPromptButton
            id={originalPrompt.id}
            isSelected={originalPrompt.id === prompt.selected}
            onSelect={() =>
              setPrompt({
                ...prompt,
                selected: originalPrompt.id,
              })
            }
          />
        </div>
      </TextureCard>
    </div>
  )
}

function SelectPromptButton({
  isSelected,
  onSelect,
  id,
}: {
  isSelected: boolean
  onSelect: (id: string) => void
  id: string
}) {
  return (
    <Button
      size="sm"
      variant="ghost"
      disabled={isSelected}
      onClick={() => onSelect(id)}
      className={cn(
        "relative overflow-hidden text-xs rounded-br-xl  transition-all duration-300 w-24 h-9 disabled:opacity-100 ",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isSelected
          ? "bg-none text-primary"
          : "bg-secondary/80 hover:bg-secondary hover:text-secondary-foreground  text-muted-foreground shadow-elevation-light dark:shadow-elevation-dark"
      )}
    >
      <AnimatePresence mode="wait">
        {isSelected ? (
          <PopIn>
            <div className="flex items-center justify-center space-x-1  ">
              <span className="text-xs font-medium">Use agent</span>
              <Sparkles className="h-4 w-4 stroke-current fill-accent text-accent" />
            </div>
          </PopIn>
        ) : (
          <motion.div
            className="flex items-center justify-center space-x-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-xs font-medium">Test prompt</span>
            <ArrowRight className="h-3 w-3 stroke-current" />
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className={cn(
          "absolute inset-0  transition-transform duration-300 ease-in-out",
          isSelected ? "scale-x-100" : "scale-x-0"
        )}
      />
    </Button>
  )
}

function BookmarkButton({
  id,
  initialBookmarked,
}: {
  id: string
  initialBookmarked: boolean
}) {
  const { toggleBookmark } = usePrompts()

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "absolute top-[11px] right-[7px] p-1",
        "rounded-tr-[13px] rounded-bl-sm",
        "hover:bg-none ",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        "transition-colors duration-200 group"
      )}
      onClick={() => toggleBookmark(id)}
    >
      <Bookmark
        className={cn(
          "h-4 w-4",
          initialBookmarked
            ? "fill-accent stroke-accent"
            : "group-hover:stroke-accent stroke-muted-foreground group-hover:fill-accent",
          "transition-colors duration-200"
        )}
      />
      <span className="sr-only">
        {initialBookmarked ? "Remove bookmark" : "Add bookmark"}
      </span>
    </Button>
  )
}

export function MobilePromptCard({
  prompt: originalPrompt,
  setTab,
}: {
  setTab: (string) => void
  prompt: PromptStructure
}) {
  const [prompt, setPrompt] = usePrompt()

  return (
    <div className="flex flex-col ">
      <TextureCard className="relative px-0">
        <TextureCardHeader className="mr-4  pb-8 pt-2 first:pt-2 pl-2">
          <div className="flex flex-col mb-2 pb-2">
            <div className="flex flex-wrap gap-1 mr-3">
              {originalPrompt.tags &&
                originalPrompt?.tags.map((tag) => (
                  <Badge
                    variant="outline"
                    key={tag}
                    className="text-[10px] rounded-sm first-of-type:rounded-tl-lg"
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>
          <TextureCardTitle className="text-xl">
            {originalPrompt.title}
          </TextureCardTitle>
          <TextureCardDescription>
            {originalPrompt.description}
          </TextureCardDescription>
        </TextureCardHeader>
        <TextureCardContent className="pt-6">
          <div className="absolute top-2 right-2.5">
            <Bookmark className="h-4 w-4 text-stone-500" />
          </div>
          <div className="absolute bottom-2 left-4">
            <div className="flex space-x-1 text-xs text-stone-500 mb-1">
              <span>Created</span>

              <span>{formatRelativeTime(originalPrompt.created_at)}</span>
            </div>
          </div>
          <div className="absolute bottom-2 right-2">
            <Button
              className="text-xs border border-black/10 dark:border-white/10 rounded-br-xl"
              variant="outline"
              size="sm"
              onClick={() => {
                setPrompt({
                  ...prompt,
                  selected: originalPrompt.id,
                })
                setTab("edit")
              }}
            >
              Try it
            </Button>
          </div>
        </TextureCardContent>
      </TextureCard>
    </div>
  )
}
