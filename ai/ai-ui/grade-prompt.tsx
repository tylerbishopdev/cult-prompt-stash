"use client"

import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconCheck, IconCopy } from "@/components/ui/icons"
import { Label } from "@/components/ui/label"
import TextureCard, {
  TextureCardContent,
  TextureCardDescription,
  TextureCardHeader,
  TextureCardTitle,
  TextureSeparator,
} from "@/components/cult/texture-card"
import { BotCard } from "@/components/message"

export function GradeResultCard({
  grade,
  analysis,
  newPrompt,
}: {
  grade: number
  analysis: string
  newPrompt: string
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(newPrompt)
  }

  return (
    <BotCard className="py-3 px-1">
      <TextureCard className="w-full relative font-sans py-3">
        <TextureCardHeader className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 mb-4 sm:mb-0">
              <Badge variant="outline" className="text-xs mb-2">
                Grade
              </Badge>
              <TextureCardTitle
                className={cn(
                  grade >= 84
                    ? "text-lime-500 dark:text-lime-400"
                    : "text-blue-500 dark:text-blue-400",
                  " text-5xl font-bold"
                )}
              >
                {grade}
              </TextureCardTitle>
            </div>
            <div className="flex-grow sm:ml-6">
              <Label className="text-sm font-medium mb-2 block">Analysis</Label>
              <TextureCardDescription className="text-sm text-neutral-600 dark:text-neutral-400">
                {analysis}
              </TextureCardDescription>
            </div>
          </div>
        </TextureCardHeader>
        <TextureSeparator />
        <TextureCardContent className="p-6">
          <Label className="text-sm font-medium mb-2 block">
            Revised Prompt
          </Label>
          <p className="text-base text-neutral-900 dark:text-neutral-100 mb-4 leading-relaxed">
            {newPrompt}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:ring-1 focus-visible:ring-neutral-700 focus-visible:ring-offset-0 border-neutral-300/50 dark:border-neutral-700/50 hover:text-primary"
            onClick={onCopy}
          >
            {isCopied ? (
              <IconCheck className="mr-2 h-4 w-4 text-lime-500" />
            ) : (
              <IconCopy className="mr-2 h-4 w-4" />
            )}
            {isCopied ? "Copied!" : "Copy revised prompt"}
          </Button>
        </TextureCardContent>
      </TextureCard>
    </BotCard>
  )
}
