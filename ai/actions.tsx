// Import necessary functions and components from various libraries
import { createOpenAI } from "@ai-sdk/openai"
import { generateId } from "ai"
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc"

// Import utility functions and custom components
import { nanoid, secretKey, xorDecrypt } from "@/lib/utils"
import { BotMessage, SpinnerMessage } from "@/components/message"

// Import custom tool functions
import { getConvertToFewShotPromptTool } from "./tools/few-shot"
import { getShowGoodPromptExamplesTool } from "./tools/good-examples"
import { getGradePromptTool } from "./tools/grade-prompt"
// Import type definitions
import { AIState, Chat, UIState } from "./types"

// Define the main function to send a message to the AI
const sendMessage = async (
  message: string,
  localApiKey: string,
  selectedActions?: string[]
) => {
  "use server" // Indicate that this function runs on the server

  // Check if the API key is provided
  if (!localApiKey) {
    throw new Error(
      "OpenAI API key is missing. Please provide a valid API key."
    )
  }

  // Decrypt the API key and create an OpenAI client
  const apiKey = xorDecrypt(localApiKey, secretKey)
  const openai = createOpenAI({ apiKey })

  // Get the current AI state
  const aiState = getMutableAIState<typeof AI>()

  // Update the AI state with the new user message
  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "user",
        content: message,
      },
    ],
  })

  // Initialize variables for streaming the AI response
  let textStream: ReturnType<typeof createStreamableValue<string>>
  let textNode: React.ReactNode

  // Define all available tools
  // ? Add new tools here
  const allTools = {
    gradePrompt: getGradePromptTool({ aiState, apiKey }),
    showGoodPromptExamples: getShowGoodPromptExamplesTool({ aiState, apiKey }),
    convertToFewShotPrompt: getConvertToFewShotPromptTool({ aiState, apiKey }),
  }

  // Select tools based on user preferences or use all tools
  const tools =
    selectedActions && selectedActions.length > 0
      ? selectedActions.reduce(
          (acc, actionId) => {
            if (allTools[actionId]) {
              acc[actionId] = allTools[actionId]
            }
            return acc
          },
          {} as typeof allTools
        )
      : allTools

  // Create an instruction for the AI based on selected tools
  const toolInstruction =
    selectedActions && selectedActions.length > 0
      ? `Use only the following tools to assist the user: ${selectedActions.join(", ")}.`
      : `Use the available tools to grade prompts, show examples, and convert prompts to few-shot format when appropriate.`

  console.log("Available tools for this session:", Object.keys(tools))

  // Stream the AI response using the OpenAI model
  const result = await streamUI({
    model: openai("gpt-4o"),
    initial: <SpinnerMessage />,
    system: `- You are a helpful AI assistant specializing in prompt engineering and evaluation.
  - Provide clear and concise responses to user queries about prompts.
  - ${toolInstruction}`,

    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name,
        display: null,
      })),
    ],
    text: ({ content, done, delta }) => {
      // Initialize the text stream if it doesn't exist
      if (!textStream) {
        textStream = createStreamableValue("")
        textNode = <BotMessage content={textStream.value} />
      }

      // Update the AI state when the response is complete
      if (done) {
        textStream.done()

        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: "assistant",
              content,
            },
          ],
        })
      } else {
        // Update the text stream with new content
        textStream.update(delta)
      }

      return textNode
    },
    tools,
  })

  // Return the AI response
  return {
    id: nanoid(),
    role: "assistant",
    display: result.value,
  }
}

// Create and export the AI instance
export const AI = createAI<AIState, UIState>({
  actions: {
    sendMessage,
  },
  initialUIState: [],
  initialAIState: {
    chatId: generateId(),
    messages: [],
    user: {
      id: "",
      team_id: "",
      full_name: "",
      avatar_url: "",
    },
  },
  onSetAIState: async ({ state, done }) => {
    "use server" // Indicate that this function runs on the server

    // Prepare chat data
    const createdAt = new Date()
    const userId = state.user.id
    const teamId = state.user.team_id

    const { chatId, messages } = state

    const firstMessageContent = messages?.at(0)?.content ?? ""
    const title =
      typeof firstMessageContent === "string"
        ? firstMessageContent.substring(0, 100)
        : ""

    const chat: Chat = {
      id: chatId,
      title,
      userId,
      createdAt,
      messages,
      teamId,
    }

    if (done) {
      console.log(
        "Could save to db here if you wanted @/ai/actions.tsx - export const AI ",
        chat
      )
      // Optionally, save to db
      // await saveChat(chat)
    }
  },
})
