import type { MutableAIState } from "@/ai/types"
import { createOpenAI } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

import { nanoid } from "@/lib/utils"

import { FewShotPromptResultCard } from "../ai-ui/few-shot"

const fewShotPromptSchema = z.object({
  fewShotPrompt: z.string().describe("The converted few-shot prompt"),
  examples: z
    .array(z.string())
    .describe("Examples used in the few-shot prompt"),
})

async function convertToFewShotPrompt(prompt: string, apiKey: string) {
  const openai = createOpenAI({ apiKey: apiKey })
  const userPrompt = `Convert the following prompt into a few-shot prompt with examples:\n\n${prompt}`

  const result = await generateObject({
    prompt: userPrompt,
    schema: fewShotPromptSchema,
    model: openai("gpt-4o"),
    temperature: 0.7,
  })

  if (!result.object.fewShotPrompt) {
    return {
      success: false,
      message: "Failed to convert prompt to few-shot format",
    }
  }

  return result.object
}

export function getConvertToFewShotPromptTool({
  aiState,
  apiKey,
}: {
  aiState: MutableAIState
  apiKey: string
}) {
  return {
    description: "Converts a prompt to a few-shot style prompt.",
    parameters: z.object({
      prompt: z.string().describe("The prompt to convert."),
    }),
    generate: async (args: { prompt: string }) => {
      const toolCallId = nanoid()

      const { prompt } = args

      console.log("Executing convertToFewShotPrompt tool with prompt:", prompt)

      const result = await convertToFewShotPrompt(prompt, apiKey)
      const { fewShotPrompt = "N/A", examples = [] } =
        "success" in result ? {} : result

      console.log("Few-shot prompt:", fewShotPrompt, "Examples:", examples)

      const props = {
        fewShotPrompt,
        examples,
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
                toolName: "convertToFewShotPrompt",
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
                toolName: "convertToFewShotPrompt",
                toolCallId,
                result: props,
              },
            ],
          },
        ],
      })

      return <FewShotPromptResultCard {...props} />
    },
  }
}
