import { GoodPromptExamplesCard } from "@/ai/ai-ui/good-examples"
import type { MutableAIState } from "@/ai/types"
import { z } from "zod"

import { nanoid } from "@/lib/utils"

type Args = {
  aiState: MutableAIState
  apiKey: string
}

export function getShowGoodPromptExamplesTool({ aiState }: Args) {
  return {
    description: "Displays examples of well-structured and effective prompts.",
    parameters: z.object({
      examples: z
        .array(
          z.object({
            type: z.string(),
            topic: z.string(),
            prompt: z.string(),
          })
        )
        .min(2),
    }),
    generate: async (args) => {
      const toolCallId = nanoid()

      const { examples } = args

      console.log(
        "Executing showGoodPromptExamples tool with examples:",
        examples
      )

      // Ensure there are at least two examples
      if (examples.length < 2) {
        examples.push({
          type: "Blog Post",
          topic: "the benefits and challenges of adopting renewable energy",
          prompt:
            "Write a blog post that explains the benefits and challenges of adopting renewable energy. Start by outlining the current global energy situation and the need for renewable sources. Use subheadings to explore key benefits like environmental sustainability and cost savings, and also address challenges like infrastructure costs. Conclude with actionable insights on how readers can support renewable energy initiatives.",
        })
      }

      aiState.done({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            id: nanoid(),
            role: "assistant",
            content: [
              {
                type: "tool-call",
                toolName: "showGoodPromptExamples",
                toolCallId,
                args,
              },
            ],
          },
          {
            id: nanoid(),
            role: "tool",
            content: [
              {
                type: "tool-result",
                toolName: "showGoodPromptExamples",
                toolCallId,
                result: { examples },
              },
            ],
          },
        ],
      })

      return <GoodPromptExamplesCard examples={examples} />
    },
  }
}
