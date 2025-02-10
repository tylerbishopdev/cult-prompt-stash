import { z } from "zod"

const defaultExamples = [
  {
    type: "Blog Post",
    topic: "ways to improve mental health in the digital age",
    prompt:
      "Write a blog post that explores ways to improve mental health in the digital age in a comprehensive and engaging way. Begin by addressing the main question or problem related to ways to improve mental health in the digital age and provide relevant context. Use subheadings to break down the key points, include examples and case studies to make the content relatable, and conclude with actionable takeaways or questions for the reader to reflect on. Optimize your content by incorporating targeted keywords naturally throughout the text, and include a compelling meta description that captures the essence of the post.",
  },
  {
    type: "Guide",
    topic: "adopting renewable energy",
    prompt:
      "Create a guide on the benefits and challenges of adopting renewable energy. Discuss different types of renewable energy, their environmental impact, and the economic considerations involved. Conclude with actionable steps readers can take to support the transition to renewable energy.",
  },
]

// Define the gradient options
type GradientOption = "Primary" | "Accent" | "Secondary"

export const actionsRegistry = {
  gradePrompt: {
    actionId: "gradePrompt",
    metadata: {
      title: "Grade Prompt",
      description:
        "Grades a prompt and provides analysis along with an improved prompt.",
      avatarGradient: "Primary" as GradientOption,
    },
    parameters: z.object({
      promptToEvaluate: z.string().describe("The prompt to evaluate."),
    }),
    // Additional properties or functions as needed
  },
  showGoodPromptExamples: {
    actionId: "showGoodPromptExamples",
    metadata: {
      title: "Show Good Prompt Examples",
      description:
        "Displays examples of well-structured and effective prompts.",
      avatarGradient: "Accent" as GradientOption,
    },
    parameters: z.object({
      examples: z
        .array(
          z.object({
            type: z.string(),
            topic: z.string(),
            prompt: z.string(),
          })
        )
        .min(2)
        .default(defaultExamples),
    }),
    handleMissingExamples: (examples) => {
      // Ensure at least two examples
      if (examples.length < 2) {
        return [...examples, ...defaultExamples.slice(0, 2 - examples.length)]
      }
      return examples
    },
  },
  convertToFewShotPrompt: {
    actionId: "convertToFewShotPrompt",
    metadata: {
      title: "Convert to Few-Shot Prompt",
      description: "Converts a prompt to a few-shot style prompt.",
      avatarGradient: "Secondary" as GradientOption,
    },
    parameters: z.object({
      prompt: z.string().describe("The prompt to convert."),
    }),
  },
  // Add more actions as needed
}

// Type for the actionsRegistry
export type ActionsRegistry = typeof actionsRegistry

// Type for a single action
export type Action = ActionsRegistry[keyof ActionsRegistry]
