# Onboarding: Creating a New Tool for the AI System

## Introduction

Welcome to the guide on creating new tools for our AI system. Tools are specialized functions that extend the AI's capabilities, allowing it to perform specific tasks or generate particular types of content. This README will walk you through the process of creating, implementing, and integrating a new tool into our AI system.

## Prerequisites

Before you begin, ensure you have the following:

1. Access to the project repository
2. Node.js (v14 or later) installed
3. Familiarity with TypeScript and React
4. Understanding of the AI SDK and its core concepts

## Step-by-Step Guide to Creating a New Tool

Follow these steps to create and integrate a new tool:

1. **Plan Your Tool**: Define the purpose and functionality of your tool.
2. **Create a New File**: In the `tools` directory, create a new TypeScript file for your tool (e.g., `my-new-tool.ts`).
3. **Implement the Tool**: Write the tool's logic and define its structure.
4. **Create UI Components**: If necessary, create React components for the tool's output.
5. **Integrate the Tool**: Add the tool to the main AI file and update the actions registry.
6. **Test the Tool**: Verify the tool's functionality within the AI system.
7. **Document the Tool**: Update relevant documentation to include information about the new tool.

## Tool Structure and Components

A typical tool consists of the following components:

1. **Tool Function**: The main function that returns the tool object.
2. **Description**: A string describing the tool's purpose and functionality.
3. **Parameters**: A Zod schema defining the input parameters for the tool.
4. **Generate Function**: An async function that executes the tool's logic and returns a result (often a React component).

## Best Practices and Considerations

- Use TypeScript for type safety and better code documentation.
- Keep the tool's functionality focused and specific.
- Handle errors gracefully and provide meaningful feedback.
- Consider performance implications, especially for tools that make API calls.
- Follow the project's coding standards and naming conventions.
- Write unit tests for your tool to ensure reliability.

## Example: Creating a New Tool

Let's create a simple "Word Count" tool as an example. This tool will count the number of words in a given text and provide a breakdown of word frequency.

1. Create a new file `tools/word-count.tsx`:

```tsx
import { useState } from "react"
import type { MutableAIState } from "@/ai/types"
import { z } from "zod"

import { nanoid } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Args = {
  aiState: MutableAIState
}

function countWords(text: string): {
  total: number
  frequency: Record<string, number>
} {
  const words = text.toLowerCase().match(/\b\w+\b/g) || []
  const frequency: Record<string, number> = {}

  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1
  })

  return {
    total: words.length,
    frequency,
  }
}

function WordCountResult({
  total,
  frequency,
}: {
  total: number
  frequency: Record<string, number>
}) {
  const [showAll, setShowAll] = useState(false)
  const sortedWords = Object.entries(frequency).sort((a, b) => b[1] - a[1])
  const displayWords = showAll ? sortedWords : sortedWords.slice(0, 5)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Word Count Results</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Total words: {total}</p>
        <h3 className="font-semibold mb-2">Word Frequency:</h3>
        <ul className="list-disc pl-5 mb-4">
          {displayWords.map(([word, count]) => (
            <li key={word}>
              {word}: {count}
            </li>
          ))}
        </ul>
        {sortedWords.length > 5 && (
          <Button onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show Less" : "Show All"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function getWordCountTool({ aiState }: Args) {
  return {
    description:
      "Counts the number of words in a given text and provides a frequency breakdown.",
    parameters: z.object({
      text: z.string().describe("The text to analyze for word count."),
    }),
    generate: async (args: { text: string }) => {
      const toolCallId = nanoid()
      const { text } = args
      const result = countWords(text)

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
                toolName: "wordCount",
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
                toolName: "wordCount",
                toolCallId,
                result,
              },
            ],
          },
        ],
      })

      return (
        <WordCountResult total={result.total} frequency={result.frequency} />
      )
    },
  }
}
```

2. Update the main AI file (e.g., `ai/actions.ts`) to include the new tool:

```typescript
import { getWordCountTool } from "./tools/word-count"

// ... other imports

const allTools = {
  wordCount: getWordCountTool({ aiState }),
  // ... other tools
}

// ... rest of the file
```

3. Update the `actionsRegistry` in `types.ts`:

```typescript
export const actionsRegistry = {
  // ... other actions
  wordCount: {
    actionId: "wordCount",
    metadata: {
      title: "Word Count",
      description: "Counts words and provides frequency analysis.",
      avatarGradient: "Secondary" as GradientOption,
    },
    parameters: z.object({
      text: z.string().describe("The text to analyze for word count."),
    }),
  },
}
```

## Testing and Integration

After creating your tool, follow these steps to test and integrate it:

1. Run the development server and navigate to the AI interface.
2. Try using the new tool by asking the AI to perform a word count on a given text.
3. Verify that the tool executes correctly and displays the expected output.
4. Test edge cases, such as empty input or very long texts, to ensure robustness.

## Troubleshooting

If you encounter issues while creating or using your new tool, consider the following:

- Double-check that all imports are correct and files are in the right locations.
- Ensure that the tool's parameters match the expected input in the generate function.
- Verify that the AI state is being updated correctly within the tool.
- Check the browser console for any JavaScript errors that might indicate issues.

If problems persist, consult with the team or refer to the project's troubleshooting guide for more specific assistance.
