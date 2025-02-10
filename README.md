# Cult Prompt Stash

## What is this project?

Cult Prompt Stash is an advanced AI Prompt Management System designed to help users create, organize, and manage prompts for various AI models. It features a web-based interface with a robust AI agent system and extensible tools, streamlining your AI prompt workflow.

## Key Features

1. Create, edit, and manage AI prompts
2. Categorize prompts with tags for easy organization
3. Advanced filtering and search capabilities
4. Customizable prompt settings for different AI models
5. Interactive prompt template editor with variable highlighting
6. Secure OpenAI API key storage
7. Extensible AI agent system with custom tools

## Technology Stack

- React & Next.js: For a responsive and server-side rendered UI
- TypeScript: For type-safe code
- Tailwind CSS: For efficient styling
- Jotai: For state management
- OpenAI API: For AI model integration

## Security: OpenAI API Key Storage

We prioritize the security of your API key:

- AES encryption for API key storage in browser's local storage
- Encryption key derived from user-specific data and application secrets
- Secure persistence between sessions without plain text exposure

**Note**: For production use, consider implementing server-side storage with additional security measures.

## Getting Started

1. Install dependencies:

   ```
   pnpm i
   ```

2. Start the development server:

   ```
   pnpm run dev
   ```

3. Open `http://localhost:3000` in your browser

4. Enter your OpenAI API key when prompted for AI Agent functionality

## Key Components

1. **Prompt Editor**: Edit prompt details, templates, and variables
2. **Filter Sidebar**: Advanced filtering options for prompts
3. **Prompt Card**: Displays individual prompt details
4. **New Prompt Form**: Create new prompts with ease
5. **AI Agent System**: Extensible system for custom AI tools

## Core Concepts

1. **Prompts**: Central entities with title, description, template, and metadata
2. **Filters**: Multi-criteria prompt organization
3. **Variables**: Dynamic placeholders in prompts, highlighted in the editor
4. **Models**: Customizable AI model settings for each prompt
5. **API Key Management**: Secure handling of OpenAI API keys
6. **AI Tools**: Extensible functions enhancing AI capabilities

## AI Agent System: Creating Custom Tools

The AI agent system allows for the creation of specialized tools to extend AI capabilities. Here's a quick guide:

1. Plan your tool's functionality
2. Create a new TypeScript file in the `tools` directory
3. Implement the tool logic and structure
4. Create necessary UI components
5. Integrate the tool with the main AI system
6. Test and document your new tool

For a detailed example, refer to the following code snippets:

```tsx
// 13:81:ai/tools/good-examples.tsx
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
```

```tsx
// 39:103:ai/tools/few-shot.tsx
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
```

```tsx
// 45:114:ai/tools/grade-prompt.tsx
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
```

These examples demonstrate the structure and implementation of custom AI tools.

## Best Practices for Tool Development

- Use TypeScript for type safety
- Keep tool functionality focused and specific
- Implement error handling and meaningful feedback
- Consider performance, especially for API calls
- Follow project coding standards
- Write unit tests for reliability

## Advanced Features

1. **Variable Highlighting**: The prompt editor uses custom logic to highlight variables:

```tsx
// 85:92:components/agent-prompt.tsx
const highlightVariables = useCallback((code: string) => {
  // Custom highlighting logic
  const highlightedCode = code.replace(
    /\{(\w+)\}/g,
    '<span style="color: hsl(var(--primary));">{$1}</span>'
  )
  return <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
}, [])
```

2. **Dynamic Prompt Handling**: The chat component manages dynamic prompts with variable placeholders:

```tsx
// 39:66:components/agent-chat.tsx
// Main Chat component
// This component orchestrates the entire chat interface, managing state and user interactions
export default function Chat({ prompt }: { prompt: PromptStructure | null }) {
  // Extract variables from the prompt using a custom hook
  // This allows for dynamic prompts with variable placeholders
  const { variables } = usePromptString(prompt)

  // Custom hook for handling form submission on Enter key press
  // Improves user experience by allowing quick message sending
  const { formRef, onKeyDown: onEnterKeyDown } = useEnterSubmit()

  // State management
  // Using a single state object for all chat-related-action state and variable state
  const [chatState, setChatState] = useState<ChatState>({
    variableValues: {},
    inputValue: prompt?.template ?? "",
    showActionsMenu: false,
    actionsSearch: "",
    selectedActions: [],
    selectedIndex: 0,
  })

  // Use AI-specific hooks for managing messages and AI state
  // These hooks integrate with the AI system to handle message flow
  const [messages, setMessages] = useUIState<typeof AI>() as [
    ClientMessage[],
    (messages: ClientMessage[]) => void,
  ]
```

## Next Steps

1. Customize the UI for your specific needs
2. Implement prompt versioning or collaboration features
3. Integrate with additional AI models for testing
4. Enhance the filtering system
5. Implement server-side API key storage for production
6. Create new AI tools to extend system capabilities
