"use client"

import React, { useState } from "react"
import { Check, Code, Copy, FileText, Layers } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradientHeading } from "@/components/cult/gradient-heading"
import TextureCard, {
  TextureCardContent,
  TextureCardHeader,
  TextureSeparator,
} from "@/components/cult/texture-card"
import { BotCard } from "@/components/message"

interface FewShotPromptResultCardProps {
  fewShotPrompt: string
  examples: string[]
}

export function FewShotPromptResultCard({
  fewShotPrompt,
  examples,
}: FewShotPromptResultCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const combinedContent = `${fewShotPrompt}\n\nExamples:\n${examples.join("\n\n")}`

  return (
    <BotCard className="px-1 py-1">
      <TextureCard className="w-full max-w-3xl  font-sans bg-card">
        <TextureCardHeader className="bg-muted/50 pb-4">
          <GradientHeading size="sm">Few Shot Prompt</GradientHeading>
        </TextureCardHeader>
        <TextureSeparator />

        <TextureCardContent className="pt-3 ">
          <Tabs defaultValue="full-prompt" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-md  max-w-md mx-auto">
              <TabsTrigger value="full-prompt">
                <Layers className="h-4 w-4 mr-2" />
                Full Prompt
              </TabsTrigger>
              <TabsTrigger value="prompt">
                <FileText className="h-4 w-4 mr-2" />
                Prompt
              </TabsTrigger>
              <TabsTrigger value="examples">
                <Code className="h-4 w-4 mr-2" />
                Examples
              </TabsTrigger>
            </TabsList>

            <TabsContent value="full-prompt" className="p-4 ">
              <div className=" mx-auto">
                <div className="flex justify-end mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(combinedContent, examples.length)
                    }
                    className={cn(
                      "transition-colors",
                      copiedIndex === examples.length && "text-green-500"
                    )}
                  >
                    {copiedIndex === examples.length ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy All
                      </>
                    )}
                  </Button>
                </div>
                <ScrollArea className="h-[300px] w-full rounded-md border bg-muted/30 p-2">
                  <div className="text-sm  text-foreground whitespace-pre-wrap break-words">
                    {combinedContent}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="prompt" className="p-4 ">
              <div className=" mx-auto">
                <ScrollArea className="h-[300px] w-full rounded-md border bg-muted/30 p-2">
                  <div className="text-sm  text-foreground">
                    {fewShotPrompt}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            <TabsContent value="examples" className="p-4 ">
              <div className=" mx-auto">
                <ScrollArea className="h-[300px] w-full rounded-md border bg-muted/30">
                  {examples.map((example, index) => (
                    <div
                      key={index}
                      className="w-full bg-card border-b border-muted last:border-b-0"
                    >
                      <div className="flex items-center justify-between p-2 bg-muted/50">
                        <Badge
                          variant="outline"
                          className="text-xs font-medium"
                        >
                          Example {index + 1}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(example, index)}
                          className={cn(
                            "h-8 w-8 p-0 transition-colors",
                            copiedIndex === index && "text-green-500"
                          )}
                        >
                          {copiedIndex === index ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="p-4 text-sm  text-foreground whitespace-pre-wrap break-words">
                        {`${example}`}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </TextureCardContent>
      </TextureCard>
    </BotCard>
  )
}
