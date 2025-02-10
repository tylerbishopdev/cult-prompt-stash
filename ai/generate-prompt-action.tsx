"use server"

import { createOpenAI } from "@ai-sdk/openai"
import { generateObject, generateText } from "ai"
import { z } from "zod"

import { secretKey, xorDecrypt } from "@/lib/utils"

// Define the schema for the AI-generated prompt
const promptSchema = z.object({
  title: z.string().describe("A concise, descriptive title for the AI prompt"),
  description: z
    .string()
    .describe("A brief explanation of what the prompt does and how to use it"),
  template: z.string().describe("The main prompt template in markdown format"),
  tags: z
    .array(z.string().max(20, "Each tag must be 20 characters or less"))
    .max(3, "Maximum of 3 tags allowed")
    .optional()
    .describe("Keywords related to the prompt's topic or use case"),
})

type PromptSchema = z.infer<typeof promptSchema>

const promptIdeaSchema = z.string()

/**
 * Generates an AI prompt based on a given idea using OpenAI's GPT model.
 *
 * @param promptIdea - The initial idea for the prompt
 * @param localApiKey - The encrypted OpenAI API key
 * @param promptType - The type of prompt to generate (default: "basic")
 * @returns An object containing the success status, generated prompt data, and any error messages
 */
export async function generatePromptWithAI(
  promptIdea: string,
  localApiKey: string,
  promptType:
    | "chainOfThought"
    | "fewShot"
    | "zeroShot"
    | "leastToMost"
    | "treeOfThoughts"
    | "autoCot"
    | "react"
    | "reflexion" = "fewShot"
): Promise<{ success: boolean; data?: PromptSchema; error?: string }> {
  console.info("Starting generatePromptWithAI function", { promptType })

  try {
    // Validate inputs
    if (!localApiKey) {
      console.error("OpenAI API key is missing")
      throw new Error(
        "OpenAI API key is missing. Please provide a valid API key."
      )
    }

    const validatedPromptIdea = promptIdeaSchema.parse(promptIdea)
    console.debug("Prompt idea validated successfully")

    // Decrypt the API key and create an OpenAI client
    const apiKey = xorDecrypt(localApiKey, secretKey)
    const openai = createOpenAI({ apiKey })
    console.debug("OpenAI client created successfully")

    // Get correct prompt based on the promptType
    const stage1Prompt = createPrompt(validatedPromptIdea, promptType)
    console.debug("Stage 1 prompt created", { promptType })

    // Generate initial text using GPT-4
    const stage1Result = await generateText({
      model: openai("gpt-4o"),
      prompt: stage1Prompt.prompt,
    })
    console.info("Stage 1 text generation completed")

    // Create a second prompt to format the result
    const stage2Prompt = createPrompt(stage1Result.text, "formatPrompt")
    console.debug("Stage 2 prompt created for formatting")

    // Generate the final object using the promptSchema
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: promptSchema,
      prompt: stage2Prompt.prompt,
    })
    console.info("Final prompt object generated successfully")

    return { success: true, data: object }
  } catch (error) {
    console.error("Error generating prompt", { error })
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

function createPrompt(inputString: string, promptType: string) {
  return {
    chainOfThought: {
      name: "Chain of Thought Prompt",
      description:
        "Generates a prompt that encourages step-by-step thinking and problem-solving.",
      prompt: `You are THOUGHTFLOW-AI, an expert in creating chain of thought prompts. Your task is to generate a high-quality prompt that encourages detailed, step-by-step thinking based on this concept:

${inputString}

Follow these steps to create your chain of thought prompt:

1. Analyze the Concept:
   - Identify the main problem, question, or task
   - Determine the key components or aspects that need to be addressed
   - Consider potential challenges or complexities

2. Design the Thought Process:
   - Break down the concept into 4-6 logical steps or stages
   - Ensure each step builds upon the previous ones
   - Include a mix of analytical, creative, and reflective thinking

3. Craft Guiding Questions:
   - For each step, create a clear, open-ended question that prompts deep thinking
   - Ensure questions encourage explanation and justification of thoughts
   - Include prompts for considering alternatives or potential pitfalls

4. Incorporate Metacognition:
   - Add prompts that encourage self-reflection on the thinking process
   - Include questions about confidence levels or potential biases
   - Prompt for evaluation of the reasoning at key points

5. Synthesize and Conclude:
   - Add a final step that brings together all the previous thoughts
   - Include a prompt for summarizing key insights or decisions
   - Encourage reflection on the overall process and potential applications

Your prompt should:
- Begin with a brief introduction setting the context and importance of the task
- Present the steps and questions in a clear, numbered sequence
- Use {PLACEHOLDERS} for any specific details that could be customized
- Encourage detailed explanations and reasoning for each step
- Conclude with instructions for a final synthesis and reflection

Now, THOUGHTFLOW-AI, apply this process to create an outstanding chain of thought prompt based on the given concept. Your output should be the complete prompt itself, without any additional explanations or metadata. Ensure your prompt encourages comprehensive, step-by-step thinking that leads to a thorough exploration and understanding of the concept.`,
    },
    fewShot: {
      name: "Few-Shot Prompt",
      description:
        "Generates a prompt with 3-5 examples to guide the AI in understanding the task pattern.",
      prompt: `You are FEW-SHOT MAESTRO, an AI expert in creating effective few-shot prompts. Your task is to generate a high-quality few-shot prompt based on this task description:
  
  ${inputString}
  
  Follow these steps to create your few-shot prompt:
  
  1. Task Analysis:
     - Identify the core task or problem to be solved
     - Determine the input and output format
     - Consider the key skills or knowledge required
  
  2. Example Selection:
     - Choose 3-5 diverse examples that represent various aspects of the task
     - Ensure examples range from simple to more complex
     - Include edge cases or potential areas of confusion
  
  3. Example Structure:
     - For each example, create:
       a) Input: Clear, concise input that matches the task description
       b) Output: Correct, detailed output that demonstrates the desired response
       c) Explanation: Brief rationale for the output (optional, but recommended)
  
  4. Prompt Construction:
     - Write a clear, concise instruction for the main task
     - Present the examples in a consistent format
     - Use clear separators between examples (e.g., numbering, line breaks)
     - Include a prompt for the new, unsolved task at the end
  
  5. Generalization:
     - Use {PLACEHOLDERS} for specific details that might change between tasks
     - Ensure the prompt structure allows for easy adaptation to similar tasks
  
  Your output should be the complete few-shot prompt, structured and ready to be used with an AI model. Do not include any additional explanations or metadata outside the prompt itself.`,
    },
    zeroShot: {
      name: "Zero Shot Prompt",
      description: "Generates a single, high-quality prompt without examples.",
      prompt: `You are PROMPT ARCHITECT, an advanced AI specialized in crafting exceptional prompts. Your task is to create a detailed, high-quality prompt based on this simple input:

${inputString}

Follow these steps to create your prompt:

1. Analyze the Input:
   - Identify the core concept or task
   - Determine the potential scope and complexity
   - Consider possible applications or use cases

2. Define the Prompt Structure:
   - Craft a clear, engaging opening statement
   - Outline the main task or question
   - Break down the task into subtasks if necessary

3. Add Context and Constraints:
   - Provide relevant background information
   - Specify any limitations or requirements
   - Include potential resources or references if applicable

4. Incorporate Creativity and Critical Thinking:
   - Encourage innovative approaches
   - Prompt for multiple perspectives or solutions
   - Include thought-provoking questions or challenges

5. Specify Output Format and Expectations:
   - Describe the desired format for the response
   - Set clear expectations for the level of detail
   - Suggest a structure for the output if appropriate

6. Refine for Clarity and Engagement:
   - Ensure language is clear and concise
   - Use active voice and direct instructions
   - Incorporate engaging elements (e.g., scenarios, metaphors)

7. Add Flexibility and Customization:
   - Use {PLACEHOLDERS} for variable elements
   - Provide options for different skill levels or interests
   - Allow for creative interpretation within defined boundaries

Now, PROMPT ARCHITECT, apply this process to create an outstanding prompt based on the given input. Your output should be the complete, refined prompt, ready to be used with an AI language model. Do not include any additional explanations or metadata outside the prompt itself.`,
    },

    leastToMost: {
      name: "Least-to-Most Prompting",
      description:
        "Breaks down a complex problem into simpler sub-problems, solving them in order of increasing difficulty.",
      prompt: `You are INCREMENTOR-AI, an expert in breaking down complex problems into manageable steps. Your task is to create a least-to-most prompting sequence based on this complex problem:

${inputString}

Follow these steps to create your least-to-most prompting sequence:

1. Analyze the Complex Problem:
   - Identify the main goal or final output required
   - Recognize the key components or skills needed to solve the problem
   - Note any potential challenges or areas of complexity

2. Break Down the Problem:
   - Divide the complex problem into 4-6 sub-problems or steps
   - Arrange these sub-problems in order of increasing difficulty
   - Ensure each sub-problem builds towards the final solution

3. Craft Sub-Problem Prompts:
   - For each sub-problem, create a clear, focused prompt
   - Start with the simplest sub-problem and progress to the most complex
   - Ensure each prompt is self-contained but builds on previous steps

4. Provide Scaffolding:
   - For earlier, simpler prompts, include more guidance or constraints
   - Gradually reduce scaffolding as the prompts increase in complexity
   - Include hints or suggestions for approaching each sub-problem

5. Connect the Steps:
   - Clearly indicate how the solution to each sub-problem feeds into the next
   - Provide transitions between sub-problems to maintain coherence
   - Ensure the final sub-problem aligns with the original complex problem

6. Summarize and Conclude:
   - After all sub-problems, include a prompt for synthesizing the results
   - Ask for a final solution that addresses the original complex problem
   - Encourage reflection on how breaking down the problem aided in solving it

Your output should be a series of numbered prompts, starting with the simplest sub-problem and ending with the most complex, followed by a synthesis prompt. Each prompt should be clear, concise, and directly related to solving part of the original complex problem.

Now, INCREMENTOR-AI, apply this process to create an outstanding least-to-most prompting sequence based on the given complex problem. Ensure your sequence guides the problem-solving process from simple to complex, ultimately addressing the original challenge.`,
    },
    treeOfThoughts: {
      name: "Tree of Thoughts",
      description:
        "Explores multiple reasoning paths simultaneously, like a decision tree.",
      prompt: `You are ARBOR-AI, a specialist in creating prompts that explore multiple reasoning paths. Your task is to generate a tree of thoughts prompt based on this problem or scenario:

${inputString}

Follow these steps to create your tree of thoughts prompt:

1. Analyze the Problem:
   - Identify the main question or challenge
   - Determine key decision points or areas of uncertainty
   - Consider potential alternative approaches or perspectives

2. Design the Root:
   - Craft an initial prompt that clearly states the problem
   - Encourage broad, initial thinking about possible approaches

3. Create Primary Branches (3-4):
   - Identify 3-4 main strategies or perspectives for approaching the problem
   - For each, create a sub-prompt that explores that particular path
   - Ensure these branches are distinct and cover a range of approaches

4. Develop Secondary Branches:
   - For each primary branch, create 2-3 follow-up prompts
   - These should explore potential outcomes, challenges, or further decisions
   - Encourage detailed reasoning and consideration of consequences

5. Include Evaluation Prompts:
   - At key points, include prompts for evaluating the strengths and weaknesses of each path
   - Encourage comparison between different branches
   - Prompt for consideration of potential risks or unforeseen consequences

6. Synthesize and Conclude:
   - Create a final prompt that asks for integration of insights from multiple branches
   - Encourage selection of the most promising path(s) with justification
   - Prompt for reflection on the overall decision-making process

Your prompt structure should:
- Begin with a clear introduction of the problem and the tree of thoughts approach
- Present each branch and sub-branch as separate, numbered prompts
- Use {PLACEHOLDERS} for any specific details that could be customized
- Encourage exploration of multiple paths before making final decisions
- Conclude with a synthesis that brings together insights from various branches

Now, ARBOR-AI, apply this process to create a comprehensive tree of thoughts prompt based on the given problem or scenario. Your output should be the complete prompt structure, guiding the exploration of multiple reasoning paths to thoroughly analyze the problem from various angles.`,
    },
    reflexion: {
      name: "Reflexion",
      description:
        "Asks the model to reflect on and potentially revise its own outputs.",
      prompt: `You are MIRROR-AI, an expert in creating prompts that encourage self-reflection and iterative improvement. Your task is to generate a reflexion prompt based on this task or output:

${inputString}

Follow these steps to create your reflexion prompt:

1. Analyze the Task/Output:
   - Identify the main goal or purpose of the original task
   - Recognize key elements or criteria for success
   - Note areas that might benefit from deeper reflection or revision

2. Design Initial Task Prompt:
   - Craft a clear prompt for the original task
   - Include any necessary context or constraints

3. Create Reflection Prompts:
   - Develop 3-4 probing questions that encourage critical analysis of the initial output
   - Include prompts for:
     a) Evaluating strengths and weaknesses
     b) Considering alternative approaches
     c) Identifying potential biases or oversights
     d) Assessing alignment with the original goal

4. Craft Revision Prompts:
   - Create prompts that encourage specific improvements based on the reflection
   - Include suggestions for:
     a) Addressing identified weaknesses
     b) Incorporating alternative viewpoints
     c) Enhancing clarity or effectiveness
     d) Ensuring comprehensive coverage of the topic

5. Design Meta-Cognitive Prompts:
   - Develop questions that promote thinking about the thinking process
   - Include prompts for:
     a) Analyzing the reasoning behind certain choices
     b) Considering the impact of different approaches on the outcome
     c) Reflecting on any changes in understanding through the process

6. Create Iteration Loop:
   - Provide a structure for multiple rounds of reflection and revision
   - Include prompts for comparing revised versions with the original

7. Conclude with Synthesis:
   - Craft a final prompt for summarizing the evolution of the output
   - Encourage articulation of key learnings from the reflexion process

Your prompt structure should:
- Start with the initial task prompt
- Follow with a series of reflection, revision, and meta-cognitive prompts
- Provide clear instructions for the iteration process
- Conclude with a synthesis and learning extraction prompt

Now, MIRROR-AI, apply this process to create a comprehensive reflexion prompt based on the given task or output. Your result should be a complete prompt structure that guides through initial creation, critical reflection, targeted revision, and meta-cognitive analysis, ultimately leading to an improved output and deeper understanding of the task and thought process.`,
    },
    react: {
      name: "ReAct Prompting",
      description:
        "Generates both reasoning traces and task-specific actions in an interleaved manner, allowing interaction with external sources.",
      prompt: `You are REACT-AI, an advanced AI capable of combining reasoning and acting to solve complex tasks. Your goal is to create a ReAct (Reasoning+Acting) prompt based on this task or question:

${inputString}

Follow these steps to create your ReAct prompt:

1. Analyze the Task:
   - Identify the main goal or question to be addressed
   - Determine what types of information or actions might be needed
   - Consider potential external sources or tools that could be useful

2. Design the Initial Prompt:
   - Craft a clear introduction to the task
   - Provide context on the ReAct framework (interleaving thoughts and actions)
   - Explain that the model can use external tools (e.g., search engine, knowledge base)

3. Create the Thought-Action-Observation Structure:
   - Design a template for the following components:
     a) Thought: Reasoning about the current state, plan, or information needed
     b) Action: Specific action to take (e.g., search, lookup, calculate)
     c) Observation: Result or information obtained from the action

4. Develop Reasoning Prompts:
   - Create prompts that encourage the model to:
     a) Decompose the task into subtasks
     b) Analyze and interpret information
     c) Plan next steps based on current knowledge
     d) Identify knowledge gaps or uncertainties

5. Design Action Prompts:
   - Develop prompts for various actions, such as:
     a) Searching for information
     b) Looking up specific facts or definitions
     c) Performing calculations or comparisons
     d) Synthesizing information from multiple sources

6. Craft Observation Integration Prompts:
   - Create prompts that guide the model to:
     a) Interpret the results of actions
     b) Update its understanding based on new information
     c) Adjust its plan or reasoning if necessary

7. Include Error Handling and Adaptation:
   - Develop prompts for scenarios where:
     a) Actions don't yield expected results
     b) Information is conflicting or ambiguous
     c) The current approach isn't making progress

8. Design Synthesis and Conclusion Prompts:
   - Create prompts that guide the model to:
     a) Recognize when sufficient information has been gathered
     b) Synthesize insights from multiple thought-action cycles
     c) Formulate and justify a final answer or solution

Your prompt structure should:
- Begin with a clear explanation of the ReAct framework and the task at hand
- Provide a template for the Thought-Action-Observation cycle
- Include guidance for generating diverse and relevant thoughts and actions
- Encourage interaction with hypothetical external tools or sources
- Promote adaptive reasoning based on new information
- Conclude with a prompt for final answer synthesis

Now, REACT-AI, apply this process to create a comprehensive ReAct prompt based on the given task or question. Your output should be a complete prompt structure that guides through multiple cycles of reasoning and acting, ultimately leading to a well-informed and justified solution.`,
    },
    autoCot: {
      name: "Automatic Chain-of-Thought (Auto-CoT)",
      description:
        "Generates diverse and effective chain-of-thought demonstrations automatically, using question clustering and demonstration sampling.",
      prompt: `You are AUTO-COT-AI, an advanced AI specialized in creating Automatic Chain-of-Thought (Auto-CoT) prompts. Your task is to generate an Auto-CoT prompt based on this dataset or task domain:

${inputString}

Follow these steps to create your Auto-CoT prompt:

1. Analyze the Dataset/Task Domain:
   - Identify the main type of problems or questions in the dataset
   - Determine the key skills or knowledge required to solve these problems
   - Consider the potential diversity of questions within the domain

2. Design the Question Clustering Process:
   - Create prompts that guide the model to:
     a) Identify key features for clustering (e.g., topic, difficulty, required skills)
     b) Suggest a suitable number of clusters based on the dataset's diversity
     c) Describe a process for assigning questions to clusters

3. Develop Demonstration Sampling Prompts:
   - Create prompts that guide the model to:
     a) Select a representative question from each cluster
     b) Ensure diversity among selected questions
     c) Apply heuristics for question selection (e.g., length limit of 60 tokens)

4. Craft Zero-Shot-CoT Generation Prompts:
   - Design prompts that:
     a) Instruct the model to use the "Let's think step by step" approach
     b) Encourage clear and concise reasoning steps
     c) Limit the number of reasoning steps (e.g., 5 steps) for simplicity and accuracy

5. Create Heuristic Application Prompts:
   - Develop prompts that guide the model to:
     a) Check if generated chains meet the specified heuristics (e.g., length, number of steps)
     b) Refine or regenerate chains that don't meet the criteria
     c) Ensure consistency in format and style across demonstrations

6. Design Demonstration Assembly Prompts:
   - Create prompts that guide the model to:
     a) Compile the selected questions and their generated reasoning chains
     b) Format the demonstrations consistently
     c) Order the demonstrations effectively (e.g., from simpler to more complex)

7. Craft Meta-Learning Prompts:
   - Develop prompts that encourage the model to:
     a) Reflect on the patterns and strategies used across demonstrations
     b) Identify key principles that can be applied to new, unseen questions
     c) Articulate these insights as part of the final prompt

8. Create Final Task Application Prompts:
   - Design prompts that guide the model to:
     a) Apply the generated demonstrations to new questions in the domain
     b) Encourage flexible adaptation of the demonstrated reasoning processes
     c) Prompt for clear, step-by-step reasoning in solving new problems

Your prompt structure should:
- Begin with an introduction explaining the Auto-CoT approach and its benefits
- Include clear instructions for each stage of the Auto-CoT process
- Provide guidance on maintaining diversity and applying heuristics
- Encourage the generation of clear, concise, and effective reasoning chains
- Conclude with instructions on how to use the generated demonstrations for new problems

Now, AUTO-COT-AI, apply this process to create a comprehensive Auto-CoT prompt based on the given dataset or task domain. Your output should be a complete prompt structure that guides through the entire Auto-CoT process, from question clustering to final task application, resulting in a set of diverse and effective chain-of-thought demonstrations.`,
    },
    formatPrompt: {
      name: "Stage 2 Format Prompt",
      description: "Formats the prompt as json",
      prompt: `You are FORMATBOT-X, an AI specialized in analyzing and structuring content. Your mission is to take a given prompt and transform it into a well-structured JSON object adhering to a specific schema. Here's the prompt you'll be working with:

        ${inputString}

Follow this systematic approach to create the JSON object:

1. Analyze the Prompt:
   - Identify the main theme and purpose
   - Recognize key components (e.g., task description, constraints, audience)
   - Note any specific instructions or formats mentioned

2. Extract and Format Information:
   a) Title:
      - Distill the main concept into a concise, catchy title
      Example: "Time-Traveling Historian's Dilemma"

   b) Description (max 500 chars):
      - Summarize the prompt's purpose and key elements
      Example: "This prompt challenges writers to craft a short story about time travel to a significant historical event, focusing on the ethical and personal challenges faced by the time traveler."

   c) Template:
      - Include the entire input prompt string, preserving its structure
      - Ensure all placeholders are maintained

   d) Template Validation (optional):
      - If the prompt specifies input requirements, include them
      Example: "Ensure {HISTORICAL_EVENT} is a significant event from Earth's history."

   e) Output Format (optional):
      - If a specific response format is mentioned, describe it
      Example: "The output should be a short story of 500-750 words."

   f) Output Validation (optional):
      - If the prompt includes criteria for responses, list them
      Example: "The story should balance excitement with thoughtful reflection and address ethical dilemmas of time travel."

   g) Tags (up to 3, max 20 chars each):
      - Derive relevant keywords from the prompt's theme
      Example: ["TimeTravel", "HistoricalFiction", "Ethics"]

`,
    },
  }[promptType]
}
