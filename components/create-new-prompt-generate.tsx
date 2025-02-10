"use client"

import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  BrainCircuit,
  Cpu,
  FileText,
  GitBranch,
  Lightbulb,
  Loader,
  Loader2,
  Repeat,
  Sparkles,
  TreeDeciduous,
  Workflow,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export type PromptType =
  | "chainOfThought"
  | "fewShot"
  | "zeroShot"
  | "leastToMost"
  | "treeOfThoughts"
  | "reflexion"
  | "react"
  | "autoCot"

interface PromptGeneratorDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (promptIdea: string, promptType: PromptType) => Promise<void>
}

const promptTypeInfo = {
  chainOfThought: {
    icon: Workflow,
    name: "Chain of Thought Prompt",
    description:
      "Generates a prompt that encourages step-by-step thinking and problem-solving.",
  },
  fewShot: {
    icon: Lightbulb,
    name: "Few-Shot Prompt",
    description:
      "Generates a prompt with 3-5 examples to guide the AI in understanding the task pattern.",
  },
  zeroShot: {
    icon: FileText,
    name: "Zero Shot Prompt",
    description: "Generates a single, high-quality prompt without examples.",
  },
  leastToMost: {
    icon: GitBranch,
    name: "Least-to-Most Prompting",
    description:
      "Breaks down a complex problem into simpler sub-problems, solving them in order of increasing difficulty.",
  },
  treeOfThoughts: {
    icon: TreeDeciduous,
    name: "Tree of Thoughts",
    description:
      "Explores multiple reasoning paths simultaneously, like a decision tree.",
  },
  reflexion: {
    icon: Repeat,
    name: "Reflexion",
    description:
      "Asks the model to reflect on and potentially revise its own outputs.",
  },
  react: {
    icon: Zap,
    name: "ReAct Prompting",
    description:
      "Generates both reasoning traces and task-specific actions in an interleaved manner, allowing interaction with external sources.",
  },
  autoCot: {
    icon: Cpu,
    name: "Automatic Chain-of-Thought (Auto-CoT)",
    description:
      "Generates diverse and effective chain-of-thought demonstrations automatically, using question clustering and demonstration sampling.",
  },
}

export function CreateNewPromptGenerateDialog({
  isOpen,
  onOpenChange,
  onGenerate,
}: PromptGeneratorDialogProps) {
  const [promptIdea, setPromptIdea] = useState("")
  const [promptType, setPromptType] = useState<PromptType>("chainOfThought")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    await onGenerate(promptIdea, promptType)
    setIsGenerating(false)
    onOpenChange(false)
    // Reset state for next use
    setPromptIdea("")
    setPromptType("chainOfThought")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[500px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Generate AI Prompt
                </DialogTitle>
                <DialogDescription>
                  Share your idea and choose a prompt type to generate a
                  structured AI prompt.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <Label
                    htmlFor="promptIdea"
                    className="text-sm font-medium mb-1 block"
                  >
                    Your prompt idea
                  </Label>
                  <Textarea
                    id="promptIdea"
                    placeholder="E.g., Generate a creative story about a time traveler..."
                    className="min-h-[100px]"
                    value={promptIdea}
                    onChange={(e) => setPromptIdea(e.target.value)}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Label
                    htmlFor="promptType"
                    className="text-sm font-medium mb-1 block"
                  >
                    Prompt type
                  </Label>
                  <Select
                    value={promptType}
                    onValueChange={(value: PromptType) => setPromptType(value)}
                  >
                    <SelectTrigger
                      id="promptType"
                      className="items-start [&_[data-description]]:hidden"
                    >
                      <SelectValue placeholder="Select a prompt type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(promptTypeInfo).map(([key, info]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <info.icon className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                <span className="font-medium text-primary">
                                  {info.name}
                                </span>
                              </p>
                              <p
                                className="text-xs text-primary"
                                data-description
                              >
                                {info.description}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
              <DialogFooter className="mt-6">
                <motion.div
                  className="w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !promptIdea.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Prompt
                      </>
                    )}
                  </Button>
                </motion.div>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
