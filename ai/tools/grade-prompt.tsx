import { GradeResultCard } from "@/ai/ai-ui/grade-prompt"
import type { MutableAIState } from "@/ai/types"
import { createOpenAI } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

import { nanoid } from "@/lib/utils"

type Args = {
  aiState: MutableAIState
  apiKey: string
}

const promptEvalSchema = z.object({
  grade: z.number().describe("Grade 0 - 100"),
  newPrompt: z
    .string()
    .describe("Improved prompt based on the analysis of the promptToEvaluate"),
  analysis: z.string().describe("Analysis of the promptToEvaluate"),
})

async function getPromptEvaluation(promptToEvaluate: string, apiKey: string) {
  const openai = createOpenAI({ apiKey: apiKey })
  const prompt = `Extract details about the following AI prompt, then analyze, grade, and improve the prompt:\n\n${promptToEvaluate}`

  const result = await generateObject({
    prompt: prompt,
    schema: promptEvalSchema,
    model: openai("gpt-4o"), // Specify the model you want to use
    temperature: 0.7,
  })

  console.log("[getPromptEvaluation - result]", result)

  if (!result.object.grade) {
    return {
      success: false,
      message: "Failed to generate prompt analysis",
    }
  }

  // Optionally store the result here, e.g., db.insert(result);
  return result.object ?? { grade: 0, newPrompt: "", analysis: "" }
}

export function getGradePromptTool({ aiState, apiKey }: Args) {
  return {
    description:
      "Grades a prompt and provides analysis along with an improved prompt.",
    parameters: z.object({
      promptToEvaluate: z.string().describe("The prompt to evaluate."),
    }),
    generate: async (args) => {
      const toolCallId = nanoid()

      const { promptToEvaluate } = args

      console.log("Executing gradePrompt tool with prompt:", promptToEvaluate)
      const result = await getPromptEvaluation(promptToEvaluate, apiKey)
      const {
        grade = 0,
        newPrompt = "",
        analysis = "",
      } = "success" in result ? {} : result

      console.log(
        "Grade result:",
        grade,
        "New prompt:",
        newPrompt,
        "Analysis:",
        analysis
      )

      const props = {
        grade,
        analysis,
        newPrompt,
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
                toolName: "gradePrompt",
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
                toolName: "gradePrompt",
                toolCallId,
                result: props,
              },
            ],
          },
        ],
      })

      return <GradeResultCard {...props} />
    },
  }
}
