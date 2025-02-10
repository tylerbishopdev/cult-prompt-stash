import { z } from "zod"

export const promptStructureSchema = z.object({
  id: z.string(),
  locked: z.boolean(),
  title: z.string(),
  description: z.string().nullable(),
  template: z.string().nullable(),
  input_variables: z.array(
    z.object({
      id: z.number().nullable().optional(),
      prompt_id: z.string().nullable().optional(),
      name: z.string(),
      description: z.string(),
      type: z.string(),
      required: z.boolean(),
      variable_validation: z.string(),
    })
  ),
  tags: z.array(z.string()).optional(),
  examples: z
    .array(
      z.object({
        id: z.number().optional(),
        prompt_id: z.string().nullable().optional(),
        input: z.record(z.any()).optional(),
        output: z.any().optional(),
      })
    )
    .optional(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  bookmarked: z.boolean(),
})

export type PromptStructure = z.infer<typeof promptStructureSchema>

export const prompts: PromptStructure[] = [
  {
    id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    locked: false,
    title: "Sentiment Analysis",
    description:
      "Analyze the sentiment of given text, classifying it as positive, negative, or neutral.",
    template:
      "Analyze the sentiment of the following text and classify it as positive, negative, or neutral: {text}",

    input_variables: [
      {
        name: "text",
        description: "The text to be analyzed for sentiment",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
    ],

    tags: [
      "Sentiment Analysis",
      "Text Classification",
      "Social Media Monitoring",
    ],
    examples: [
      {
        input: { text: "I absolutely love this product! It's amazing!" },
        output:
          "Positive: The text expresses strong positive sentiment with words like 'love' and 'amazing'.",
      },
    ],
    created_at: "2024-03-15T10:00:00Z",
    updated_at: null,
    bookmarked: false,
  },
  {
    id: "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",

    locked: false,
    title: "Creative Writing Assistant",
    description:
      "Generate creative writing prompts or assist in developing story ideas based on user input.",
    template:
      "Generate a creative writing prompt or story idea based on the following theme or concept: {theme}",

    input_variables: [
      {
        name: "theme",
        description:
          "The theme or concept to base the writing prompt or story idea on",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
    ],

    tags: ["Creative Writing", "Story Ideas", "Writing Prompts"],
    examples: [
      {
        input: { theme: "A world where dreams become reality" },
        output:
          "In a city where people's dreams physically manifest while they sleep, a dream therapist must help a client whose nightmares are terrorizing the neighborhood. As the therapist delves deeper into the client's subconscious, they uncover a conspiracy that threatens the fabric of reality itself.",
      },
    ],
    created_at: "2024-03-15T11:00:00Z",
    updated_at: null,
    bookmarked: false,
  },
  {
    id: "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",

    locked: false,
    title: "Data Visualization Recommendation",
    description:
      "Suggest appropriate chart types and visualization techniques based on given data characteristics.",
    template:
      "Recommend appropriate data visualization techniques for the following data: {data_description}",

    input_variables: [
      {
        name: "data_description",
        description:
          "Description of the data to be visualized, including types of variables and relationships",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
    ],

    tags: ["Data Visualization", "Chart Recommendation", "Data Analysis"],
    examples: [
      {
        input: {
          data_description:
            "Time series data showing monthly sales for multiple product categories over the past year",
        },
        output:
          "- Line chart: Best for showing trends over time for multiple categories.\n- Stacked area chart: Useful for comparing the total sales and the contribution of each category.\n- Heatmap: Effective for highlighting seasonal patterns in sales across categories.",
      },
    ],
    created_at: "2024-03-15T12:00:00Z",
    updated_at: null,
    bookmarked: false,
  },
  {
    id: "4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s",

    locked: false,
    title: "Technical Documentation Generator",
    description:
      "Create clear and concise technical documentation for software projects based on code snippets and brief descriptions.",
    template:
      "Generate technical documentation for the following code snippet and description: \nCode: {code_snippet}\nDescription: {description}",

    input_variables: [
      {
        name: "code_snippet",
        description: "The code snippet to document",
        type: "string",
        required: true,
        variable_validation: "^[\\s\\S]+$",
      },
      {
        name: "description",
        description:
          "A brief description of the code's purpose or functionality",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
    ],

    tags: [
      "Technical Documentation",
      "Code Documentation",
      "Software Development",
    ],
    examples: [
      {
        input: {
          code_snippet:
            "def calculate_area(length: float, width: float) -> float:\n    return length * width",
          description: "A function to calculate the area of a rectangle",
        },
        output:
          "# calculate_area\n\nCalculates the area of a rectangle.\n\n## Parameters\n\n- length (float): The length of the rectangle\n- width (float): The width of the rectangle\n\n## Returns\n\n- float: The calculated area of the rectangle\n\n## Usage\n\n```python\narea = calculate_area(5.0, 3.0)\nprint(f'The area is: {area}')\n```",
      },
    ],
    created_at: "2024-03-15T13:00:00Z",
    updated_at: null,
    bookmarked: false,
  },
  {
    id: "5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t",

    locked: false,
    title: "Interview Question Generator",
    description:
      "Generate relevant interview questions based on a job description and required skills.",
    template:
      "Generate interview questions for the following job description and required skills:\nJob Description: {job_description}\nRequired Skills: {required_skills}",

    input_variables: [
      {
        name: "job_description",
        description: "A brief description of the job position",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
      {
        name: "required_skills",
        description:
          "A comma-separated list of required skills for the position",
        type: "string",
        required: true,
        variable_validation: "^[\\w\\s]+(,[\\w\\s]+)*$",
      },
    ],

    tags: ["Interview Questions", "Recruitment", "HR"],
    examples: [
      {
        input: {
          job_description:
            "We are seeking a full-stack web developer to join our team and work on various client projects.",
          required_skills: "JavaScript, React, Node.js, SQL, Git",
        },
        output:
          "1. Can you describe a complex web application you've built using React and Node.js?\n2. How do you approach optimizing database queries in SQL for better performance?\n3. Explain your workflow when using Git for version control in a team environment.\n4. How do you stay updated with the latest trends and best practices in JavaScript development?\n5. Can you walk us through your process for debugging a performance issue in a full-stack application?",
      },
    ],
    created_at: "2024-03-15T14:00:00Z",
    updated_at: null,
    bookmarked: false,
  },
  {
    id: "6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u",

    locked: false,
    title: "Product Description Optimizer",
    description:
      "Enhance product descriptions for e-commerce platforms, focusing on key features and benefits.",
    template:
      "Optimize the following product description, highlighting key features and benefits:\nProduct Name: {product_name}\nOriginal Description: {original_description}\nKey Features: {key_features}",

    input_variables: [
      {
        name: "product_name",
        description: "The name of the product",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
      {
        name: "original_description",
        description: "The original product description to be optimized",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
      {
        name: "key_features",
        description: "A comma-separated list of key features of the product",
        type: "string",
        required: true,
        variable_validation: "^[\\w\\s]+(,[\\w\\s]+)*$",
      },
    ],

    tags: ["Product Description", "E-commerce", "Content Optimization"],
    examples: [
      {
        input: {
          product_name: "UltraFlex Yoga Mat",
          original_description:
            "This yoga mat is made of high-quality materials and is suitable for all types of yoga practices.",
          key_features:
            "Non-slip surface, Extra thick padding, Eco-friendly materials, Easy to clean",
        },
        output:
          "Elevate your yoga practice with the UltraFlex Yoga Mat, the ultimate companion for yogis of all levels. Crafted with eco-friendly materials, this premium mat features a non-slip surface that ensures stability in even the most challenging poses. The extra thick padding provides unparalleled comfort and joint protection, allowing you to flow through your practice with ease. Easy to clean and maintain, the UltraFlex Yoga Mat is designed to withstand the rigors of daily use while supporting your journey to inner peace and physical well-being. Experience the perfect balance of grip, cushioning, and sustainability – your body and the planet will thank you.",
      },
    ],
    created_at: "2024-03-15T15:00:00Z",
    updated_at: null,
    bookmarked: false,
  },
  {
    id: "7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v",

    locked: false,
    title: "Academic Paper Summarizer",
    description:
      "Provide concise summaries of academic papers, highlighting key findings and methodologies.",
    template:
      "Summarize the following academic paper, focusing on key findings and methodologies:\nTitle: {paper_title}\nAbstract: {paper_abstract}",

    input_variables: [
      {
        name: "paper_title",
        description: "The title of the academic paper",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
      {
        name: "paper_abstract",
        description: "The abstract of the academic paper",
        type: "string",
        required: true,
        variable_validation: "^.{50,}$",
      },
    ],

    tags: ["Academic Research", "Paper Summary", "Literature Review"],
    examples: [
      {
        input: {
          paper_title:
            "The Impact of Artificial Intelligence on Climate Change Mitigation",
          paper_abstract:
            "This paper explores the potential of artificial intelligence (AI) in addressing climate change. Through a comprehensive review of current AI applications in energy systems, transportation, and environmental monitoring, we identify key areas where AI can contribute to climate change mitigation. Our findings suggest that AI-driven solutions can significantly reduce greenhouse gas emissions and improve energy efficiency across various sectors. However, we also highlight potential challenges and ethical considerations in the widespread adoption of AI for climate action.",
        },
        output:
          "## Key Findings\n\n- AI has significant potential to contribute to climate change mitigation across multiple sectors.\n- AI-driven solutions can reduce greenhouse gas emissions and improve energy efficiency.\n- Challenges and ethical considerations exist in the widespread adoption of AI for climate action.\n\n## Methodology\n\n- Comprehensive review of current AI applications in energy systems, transportation, and environmental monitoring.\n- Analysis of AI's potential impact on reducing greenhouse gas emissions and improving energy efficiency.\n\n## Implications\n\n- AI could play a crucial role in achieving climate change mitigation goals.\n- Further research and development are needed to address challenges and ethical concerns associated with AI adoption in climate action strategies.",
      },
    ],
    created_at: "2024-03-15T16:00:00Z",
    updated_at: null,
    bookmarked: false,
  },
  {
    id: "8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w",

    locked: false,
    title: "Code Refactoring Advisor",
    description:
      "Analyze code snippets and provide suggestions for improving code quality, readability, and efficiency.",
    template:
      "Analyze the following code snippet and provide suggestions for refactoring to improve quality, readability, and efficiency:\nLanguage: {language}\nCode:\n{code_snippet}",

    input_variables: [
      {
        name: "language",
        description: "The programming language of the code snippet",
        type: "string",
        required: true,
        variable_validation: "^(Python|JavaScript|Java|C\\+\\+|Ruby)$",
      },
      {
        name: "code_snippet",
        description: "The code snippet to be analyzed and refactored",
        type: "string",
        required: true,
        variable_validation: "^[\\s\\S]+$",
      },
    ],

    tags: ["Code Refactoring", "Code Quality", "Software Development"],
    examples: [
      {
        input: {
          language: "Python",
          code_snippet:
            "def calculate_total(items):\n    total = 0\n    for i in range(len(items)):\n        total = total + items[i]\n    return total",
        },
        output:
          '## Use built-in sum() function\n\nReplace the manual loop with Python\'s built-in sum() function for better readability and efficiency.\n\n```python\ndef calculate_total(items):\n    return sum(items)\n```\n\n## Use type hinting\n\nAdd type hints to improve code readability and catch potential type-related errors.\n\n```python\nfrom typing import List\n\ndef calculate_total(items: List[float]) -> float:\n    return sum(items)\n```\n\n## Consider input validation\n\nAdd input validation to ensure the function receives a valid list of numbers.\n\n```python\nfrom typing import List\n\ndef calculate_total(items: List[float]) -> float:\n    if not isinstance(items, list) or not all(isinstance(item, (int, float)) for item in items):\n        raise ValueError("Input must be a list of numbers")\n    return sum(items)\n```',
      },
    ],
    created_at: "2024-03-15T17:00:00Z",
    updated_at: null,
    bookmarked: false,
  },
  {
    id: "9i0j1k2l-3m4n-5o6p-7q8r-9s0t1u2v3w4x",

    locked: false,
    title: "Personalized Fitness Plan Generator",
    description:
      "Create customized workout plans based on user goals, fitness level, and available equipment.",
    template:
      "Generate a personalized fitness plan based on the following information:\nGoal: {fitness_goal}\nFitness Level: {fitness_level}\nAvailable Equipment: {available_equipment}\nTime Available: {time_available}",

    input_variables: [
      {
        name: "fitness_goal",
        description: "The primary fitness goal of the user",
        type: "string",
        required: true,
        variable_validation:
          "^(Weight Loss|Muscle Gain|Endurance|Flexibility|General Fitness)$",
      },
      {
        name: "fitness_level",
        description: "The current fitness level of the user",
        type: "string",
        required: true,
        variable_validation: "^(Beginner|Intermediate|Advanced)$",
      },
      {
        name: "available_equipment",
        description: "A comma-separated list of available fitness equipment",
        type: "string",
        required: true,
        variable_validation: "^[\\w\\s]+(,[\\w\\s]+)*$",
      },
      {
        name: "time_available",
        description: "The amount of time available for workouts per session",
        type: "string",
        required: true,
        variable_validation: "^\\d+ (minutes|hours)$",
      },
    ],

    tags: ["Fitness", "Workout Plan", "Personal Training"],
    examples: [
      {
        input: {
          fitness_goal: "Weight Loss",
          fitness_level: "Beginner",
          available_equipment: "Dumbbells, Resistance Bands, Yoga Mat",
          time_available: "30 minutes",
        },
        output:
          "# 4-Week Weight Loss Workout Plan for Beginners\n\n## Week 1-2: Full Body Circuit (3 times per week)\n\n1. Bodyweight Squats: 3 sets of 10 reps\n2. Dumbbell Rows: 3 sets of 10 reps\n3. Push-ups (or Modified Push-ups): 3 sets of 5-10 reps\n4. Resistance Band Leg Press: 3 sets of 12 reps\n5. Plank: 3 sets of 20-30 seconds\n\nRest 30 seconds between exercises and 1-2 minutes between circuits.\n\n## Week 3-4: Upper/Lower Split (4 times per week)\n\n### Upper Body (2 times per week)\n\n1. Dumbbell Chest Press: 3 sets of 10 reps\n2. Resistance Band Rows: 3 sets of 12 reps\n3. Dumbbell Shoulder Press: 3 sets of 10 reps\n4. Resistance Band Bicep Curls: 3 sets of 12 reps\n5. Tricep Dips (using a chair): 3 sets of 8-10 reps\n\n### Lower Body (2 times per week)\n\n1. Dumbbell Goblet Squats: 3 sets of 12 reps\n2. Resistance Band Leg Press: 3 sets of 15 reps\n3. Dumbbell Romanian Deadlifts: 3 sets of 10 reps\n4. Resistance Band Glute Bridges: 3 sets of 15 reps\n5. Bodyweight Calf Raises: 3 sets of 20 reps\n\nRest 45 seconds between exercises and 1-2 minutes between sets.\n\n## Cardio (2-3 times per week)\n\nPerform 15-20 minutes of moderate-intensity cardio (e.g., brisk walking, jogging in place, or jumping jacks) on non-strength training days or after your strength workouts if time allows.\n\n## Cool-down and Stretching (5 minutes)\n\nPerform light stretching for major muscle groups after each workout to improve flexibility and reduce muscle soreness.",
      },
    ],
    created_at: "2024-03-15T18:00:00Z",
    updated_at: null,
    bookmarked: false,
  },
  {
    id: "0j1k2l3m-4n5o-6p7q-8r9s-0t1u2v3w4x5y",

    locked: false,
    title: "Environmental Impact Calculator",
    description:
      "Estimate the environmental impact of various activities or products based on user input.",
    template:
      "Calculate the environmental impact of the following activity or product:\nActivity/Product: {activity_product}\nQuantity/Duration: {quantity_duration}\nFrequency: {frequency}",

    input_variables: [
      {
        name: "activity_product",
        description:
          "The activity or product to calculate the environmental impact for",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
      {
        name: "quantity_duration",
        description: "The quantity or duration of the activity or product use",
        type: "string",
        required: true,
        variable_validation: "^\\d+(\\.\\d+)? [\\w\\s]+$",
      },
      {
        name: "frequency",
        description:
          "How often the activity is performed or the product is used",
        type: "string",
        required: true,
        variable_validation: "^(Daily|Weekly|Monthly|Yearly|One-time)$",
      },
    ],

    tags: ["Environmental Impact", "Sustainability", "Carbon Footprint"],
    examples: [
      {
        input: {
          activity_product: "Car commute",
          quantity_duration: "20 miles",
          frequency: "Daily",
        },
        output:
          "## Carbon Footprint\n\nEstimated CO2 emissions: 4.6 kg per day, or 1,679 kg per year\nBased on an average passenger vehicle emitting 404 grams of CO2 per mile.\n\n## Fuel Consumption\n\nEstimated fuel usage: 1 gallon per day, or 365 gallons per year\nAssuming an average fuel efficiency of 20 miles per gallon.\n\n## Cost\n\nEstimated fuel cost: $3 per day, or $1,095 per year\nBased on an average gas price of $3 per gallon.\n\n## Recommendations\n\n1. Consider carpooling to reduce individual emissions and costs.\n2. Explore public transportation options if available in your area.\n3. Look into remote work possibilities to eliminate commute days.\n4. If feasible, consider switching to an electric or hybrid vehicle to reduce emissions.\n5. Offset your carbon footprint by supporting verified carbon offset projects.",
      },
    ],
    created_at: "2024-03-15T19:00:00Z",
    updated_at: null,
    bookmarked: false,
  },
  {
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    locked: false,
    title: "Agent-based API Interaction",
    description:
      "This prompt enables an AI agent to interact with APIs to retrieve information and perform actions based on user input.",
    template:
      "You are an AI agent that can interact with APIs to retrieve information and perform actions based on user input. {user_input}",

    input_variables: [
      {
        name: "user_input",
        description: "The user's input or request",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
    ],

    tags: ["Agents", "Interacting with APIs"],
    examples: [
      {
        input: { user_input: "What's the weather like in New York?" },
        output:
          "The AI agent queries a weather API and responds with the current weather conditions in New York.",
      },
    ],
    created_at: "2024-03-10T14:00:00Z",
    updated_at: "2024-03-10T14:30:00Z",
    bookmarked: false,
  },
  {
    id: "7e57d004-2b97-4c7a-9c8e-f0a1bfb3a9d6",
    locked: false,
    title: "Multilingual Chatbot",
    description:
      "A prompt for creating a chatbot that can communicate in multiple languages, providing engaging conversations and assistance to users.",
    template:
      "You are a multilingual chatbot capable of communicating in various languages. Respond to the user's input in the appropriate language. {user_input}",

    input_variables: [
      {
        name: "user_input",
        description: "The user's input or message",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
    ],

    tags: ["Chatbots", "Multi-modal", "English", "Spanish", "French"],
    examples: [
      {
        input: {
          user_input: "Bonjour! Comment puis-je améliorer mon français?",
        },
        output:
          "Voici quelques conseils pour améliorer votre français: pratiquez régulièrement, écoutez des podcasts en français, regardez des films et des émissions en français avec des sous-titres, et n'ayez pas peur de faire des erreurs. La pratique et la persévérance sont les clés du succès!",
      },
    ],
    created_at: "2024-03-09T10:00:00Z",
    updated_at: "2024-03-09T10:15:00Z",
    bookmarked: false,
  },
  {
    id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    locked: false,
    title: "Code Understanding and Generation",
    description:
      "This prompt enables the AI to understand and generate code snippets based on natural language descriptions, supporting multiple programming languages.",
    template:
      "You are an AI programming assistant. Given the following description, provide the corresponding code snippet in the specified programming language. Description: {description} Programming Language: {language}",

    input_variables: [
      {
        name: "description",
        description: "The natural language description of the code snippet",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
      {
        name: "language",
        description: "The programming language for the code snippet",
        type: "string",
        required: true,
        variable_validation: "^(Python|JavaScript|Java|C\\+\\+|Ruby)$",
      },
    ],
    tags: ["Code understanding", "Code writing"],
    examples: [
      {
        input: {
          description: "Find the sum of two numbers",
          language: "Python",
        },
        output: "def sum_numbers(a, b):\n    return a + b",
      },
    ],
    created_at: "2024-03-08T18:30:00Z",
    updated_at: "2024-03-08T18:45:00Z",
    bookmarked: false,
  },
  {
    id: "cf5d8b5a-6eff-4c6f-b8b1-6e8a1f6d8b9a",
    locked: false,
    title: "Text Summarization",
    description:
      "A prompt that generates concise summaries of long articles or documents, preserving key information and main points.",
    template:
      "Summarize the following text, focusing on the main ideas and key information: {text}",

    input_variables: [
      {
        name: "text",
        description: "The input text to be summarized",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
    ],

    tags: ["Summarization", "English"],
    examples: [
      {
        input: {
          text: "A long article about the benefits of exercise and healthy eating habits.",
        },
        output:
          "Regular exercise and a balanced diet are essential for maintaining good health. Exercise helps improve cardiovascular health, strengthens muscles and bones, and boosts mental well-being. Eating a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats provides the body with essential nutrients and reduces the risk of chronic diseases.",
      },
    ],
    created_at: "2024-03-07T09:00:00Z",
    updated_at: "2024-03-07T09:20:00Z",
    bookmarked: false,
  },
  {
    id: "5e8d4b7c-6d51-4e9f-bf7f-c7e8d4e4c4a4",
    locked: false,
    title: "SQL Query Generation",
    description:
      "This prompt allows users to describe their database query requirements in natural language and generates the corresponding SQL queries.",
    template:
      "Generate an SQL query based on the following description: {description}",

    input_variables: [
      {
        name: "description",
        description:
          "The natural language description of the SQL query requirements",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
    ],

    tags: ["SQL", "English"],
    examples: [
      {
        input: {
          description:
            "Retrieve the names and email addresses of all customers who have placed an order in the last 30 days",
        },
        output:
          "SELECT c.name, c.email\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nWHERE o.order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)",
      },
    ],
    created_at: "2024-03-06T16:40:00Z",
    updated_at: "2024-03-06T16:55:00Z",
    bookmarked: false,
  },
  {
    id: "7f6c7d4b-4b8f-4c1d-8f4c-7b8f4c1d8f4c",
    locked: false,
    title: "Language Translation",
    description:
      "A prompt that enables high-quality translation between various languages, preserving context and meaning.",
    template:
      "Translate the following text from {source_language} to {target_language}: {text}",

    input_variables: [
      {
        name: "source_language",
        description: "The source language of the text to be translated",
        type: "string",
        required: true,
        variable_validation:
          "^(English|French|German|Spanish|Chinese|Russian)$",
      },
      {
        name: "target_language",
        description: "The target language for the translation",
        type: "string",
        required: true,
        variable_validation:
          "^(English|French|German|Spanish|Chinese|Russian)$",
      },
      {
        name: "text",
        description: "The text to be translated",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
    ],

    tags: ["Multi-modal", "English", "French"],
    examples: [
      {
        input: {
          source_language: "English",
          target_language: "French",
          text: "Hello, how are you?",
        },
        output: "Bonjour, comment allez-vous?",
      },
    ],
    created_at: "2024-03-05T12:00:00Z",
    updated_at: "2024-03-05T12:10:00Z",
    bookmarked: false,
  },
  {
    id: "c0a5d9e9-b8f8-4b1d-9d2c-a5d9e9b8f8b1",
    locked: false,
    title: "Text Classification",
    description:
      "This prompt allows users to classify text documents into predefined categories based on their content and features.",
    template:
      "Classify the following text into one of the provided categories: {text}\nCategories: {categories}",

    input_variables: [
      {
        name: "text",
        description: "The input text to be classified",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
      {
        name: "categories",
        description: "The list of predefined categories for classification",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
    ],

    tags: ["Classification", "Tagging", "English"],
    examples: [
      {
        input: {
          text: "A news article about the latest advancements in artificial intelligence.",
          categories: "Technology, Science, Politics, Sports, Entertainment",
        },
        output: "Technology",
      },
    ],
    created_at: "2024-03-04T19:20:00Z",
    updated_at: "2024-03-04T19:35:00Z",
    bookmarked: false,
  },
  {
    id: "5e9b8f8c-a5d9-4e9b-8f8c-a5d9e9b8f8c",
    locked: false,
    title: "LinkedIn Post Generation",
    description:
      "This prompt allows users to generate a LinkedIn post to promote their latest content based on a provided summary.",
    template:
      "You are an expert assistant who can generate a LinkedIn post to invite people to visit a link that is a {type_content}, the post should be generated based on a summary.\n\nThe post should be written in the first person and use {counter_p} paragraphs to separate ideas or concepts, be conscientious and get to the point.\n\nStart your post with a question to create an engagement. Create a post in {language} on LinkedIn to promote my latest content based on this summary: {summary}\n\nThe summary is in {format} format.\n\nHere is the link: {link} and remember to target the post to the {target_audience} audience.",

    input_variables: [
      {
        name: "type_content",
        description:
          "The type of content being promoted (e.g., blog post, video, infographic)",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
      {
        name: "counter_p",
        description: "The number of paragraphs to use in the LinkedIn post",
        type: "integer",
        required: true,
        variable_validation: "^\\d+$",
      },
      {
        name: "language",
        description: "The language to use for the LinkedIn post",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
      {
        name: "summary",
        description: "The summary of the content being promoted",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
      {
        name: "format",
        description: "The format of the summary (e.g., text, markdown, JSON)",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
      {
        name: "link",
        description: "The link to the content being promoted",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
      {
        name: "target_audience",
        description: "The target audience for the LinkedIn post",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
    ],

    tags: [
      "Social Media",
      "Marketing",
      "Content Promotion",
      "LinkedIn",
      "Text Generation",
    ],
    examples: [
      {
        input: {
          type_content: "blog post",
          counter_p: 3,
          language: "English",
          summary:
            "This blog post provides an in-depth analysis of the latest trends in artificial intelligence and how they are impacting various industries. It explores the potential benefits and challenges of AI adoption and offers practical recommendations for businesses looking to leverage this technology.",
          format: "text",
          link: "https://www.example.com/ai-trends",
          target_audience: "Technology professionals, business leaders",
        },
        output:
          "Have you been keeping up with the latest advancements in artificial intelligence? In my latest blog post, I dive deep into the trends that are reshaping industries across the board.\n\nThis comprehensive analysis covers the potential benefits and challenges of AI adoption, as well as practical steps businesses can take to harness this powerful technology. Whether you're a tech professional or a business leader, you won't want to miss this insightful read.\n\nCheck out the full post here: https://www.example.com/ai-trends. I've tailored the content to our target audience of technology professionals and business leaders, so you're sure to find it valuable.",
      },
    ],
    created_at: "2024-03-04T19:20:00Z",
    updated_at: "2024-03-04T19:35:00Z",
    bookmarked: false,
  },
  {
    id: "8c7a5d9e-c8f8-4b1d-9d2c-a5d9e9b8f8b1",
    locked: false,
    title: "Python Code Generation for Data Science Problem",
    description:
      "This prompt generates a Python code solution for a given data science problem by leveraging code snippets from multiple domain experts.",
    template:
      "You are experienced Data Scientist. You end goal is to provide a python code that can solve the question {question}.\n\nCreate visualization with matplot and seaborn to share insights with the enduser.\n\nYou have been given code from multiple people to solve the questions.\n\n1. Python developer has sent to you the final code as per his understanding of the problem {generated_code_1}.\n\n2. Data analyst has sent to you the final code as per his understanding of the problem {generated_code_2}.\n\n3. Numerical analysis developer has sent to you the final code as per his understanding of the problem {generated_code_3}.\n\n4. Statistics modeller has sent to you the final code {generated_code_4}.\n\nDo Not Generate columns on your own.",

    input_variables: [
      {
        name: "question",
        description: "The data science problem to be solved",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
      {
        name: "generated_code_1",
        description: "The code snippet provided by the Python developer",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
      {
        name: "generated_code_2",
        description: "The code snippet provided by the data analyst",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
      {
        name: "generated_code_3",
        description:
          "The code snippet provided by the numerical analysis developer",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
      {
        name: "generated_code_4",
        description: "The code snippet provided by the statistics modeller",
        type: "string",
        required: true,
        variable_validation: "^.+$",
      },
    ],

    tags: ["Python", "Data Science", "Code Generation", "Visualization"],
    examples: [
      {
        input: {
          question:
            "Predict the sales for the next quarter based on historical data.",
          generated_code_1:
            "import pandas as pd\n\ndf = pd.read_csv('sales_data.csv')\ndf['Date'] = pd.to_datetime(df['Date'])\ndf.set_index('Date', inplace=True)\n\ndf_resampled = df.resample('Q').sum()\n\nfrom statsmodels.tsa.arima.model import ARIMA\n\nmodel = ARIMA(df_resampled, order=(1,1,1))\nmodel_fit = model.fit()\n\nforecast = model_fit.forecast(steps=1)\nprint(f'Forecasted sales for the next quarter: {forecast[0]}')",
          generated_code_2:
            "import numpy as np\n\nsales_data = np.loadtxt('sales_data.csv', delimiter=',')\n\nX = sales_data[:, :-1]\ny = sales_data[:, -1]\n\nfrom sklearn.linear_model import LinearRegression\n\nmodel = LinearRegression()\nmodel.fit(X, y)\n\nnext_quarter_features = np.array([[2.5, 1000, 0.1]])\npredicted_sales = model.predict(next_quarter_features)\nprint(f'Predicted sales for the next quarter: {predicted_sales[0]}')",
          generated_code_3:
            "import scipy.optimize as opt\n\ndef objective(x, a, b, c):\n return a * x + b * x**2 + c\n\ndef model_func(x, a, b, c):\n return a * x + b * x**2 + c\n\nxdata = np.array([1, 2, 3, 4, 5])\nydata = np.array([100, 200, 250, 300, 350])\n\nparams, _ = opt.curve_fit(model_func, xdata, ydata)\n\nnext_quarter = 6\npredicted_sales = objective(next_quarter, *params)\nprint(f'Predicted sales for the next quarter: {predicted_sales}')",
          generated_code_4:
            "from statsmodels.tsa.holtwinters import ExponentialSmoothing\n\nmodel = ExponentialSmoothing(df, trend='add', seasonal='add', seasonal_periods=4)\nmodel_fit = model.fit()\n\nforecast = model_fit.forecast(1)\nprint(f'Forecasted sales for the next quarter: {forecast[0]}')",
        },
        output:
          "import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport seaborn as sns\nfrom statsmodels.tsa.arima.model import ARIMA\nfrom sklearn.linear_model import LinearRegression\nimport scipy.optimize as opt\nfrom statsmodels.tsa.holtwinters import ExponentialSmoothing\n\n# Load and preprocess data\ndf = pd.read_csv('sales_data.csv')\ndf['Date'] = pd.to_datetime(df['Date'])\ndf.set_index('Date', inplace=True)\n\n# Resample data to quarterly frequency\ndf_resampled = df.resample('Q').sum()\n\n# ARIMA model\narima_model = ARIMA(df_resampled, order=(1,1,1))\narima_model_fit = arima_model.fit()\narima_forecast = arima_model_fit.forecast(steps=1)\n\n# Linear Regression model\nX = df_resampled.index.to_numpy().reshape(-1, 1)\ny = df_resampled['Sales'].to_numpy()\nlinear_model = LinearRegression()\nlinear_model.fit(X, y)\nnext_quarter_features = np.array([[df_resampled.index[-1] + pd.offsets.QuarterEnd()]])\nlinear_forecast = linear_model.predict(next_quarter_features)\n\n# Curve fitting model\ndef objective(x, a, b, c):\n return a * x + b * x**2 + c\n\ndef model_func(x, a, b, c):\n return a * x + b * x**2 + c\n\nxdata = np.arange(len(df_resampled))\nydata = df_resampled['Sales'].to_numpy()\nparams, _ = opt.curve_fit(model_func, xdata, ydata)\nnext_quarter = len(df_resampled)\ncurve_forecast = objective(next_quarter, *params)\n\n# Exponential Smoothing model\nexp_model = ExponentialSmoothing(df_resampled, trend='add', seasonal='add', seasonal_periods=4)\nexp_model_fit = exp_model.fit()\nexp_forecast = exp_model_fit.forecast(1)\n\n# Visualization\nplt.figure(figsize=(12, 6))\nplt.plot(df_resampled.index, df_resampled['Sales'], label='Actual Sales')\nplt.plot(arima_forecast.index, arima_forecast, label='ARIMA Forecast')\nplt.plot(linear_forecast.index, linear_forecast, label='Linear Regression Forecast')\nplt.plot(exp_forecast.index, exp_forecast, label='Exponential Smoothing Forecast')\nplt.plot(df_resampled.index[-1] + pd.offsets.QuarterEnd(), curve_forecast, 'ro', label='Curve Fitting Forecast')\nplt.xlabel('Date')\nplt.ylabel('Sales')\nplt.title('Sales Forecast for the Next Quarter')\nplt.legend()\nplt.show()\n\nprint(f'ARIMA Forecast: {arima_forecast[0]}')\nprint(f'Linear Regression Forecast: {linear_forecast[0]}')\nprint(f'Exponential Smoothing Forecast: {exp_forecast[0]}')\nprint(f'Curve Fitting Forecast: {curve_forecast}')",
      },
    ],
    created_at: "2024-03-04T19:42:00Z",
    updated_at: "2024-03-04T20:15:00Z",
    bookmarked: false,
  },
]

function generateTags(prompts: PromptStructure[]) {
  const tags: {
    useCases: { id: string; label: string; count: number }[]
    type: { id: string; label: string; count: number }[]
    language: { id: string; label: string; count: number }[]
    model: { id: string; label: string; count: number }[]
  } = {
    useCases: [],
    type: [],
    language: [],
    model: [],
  }

  prompts.forEach((prompt) => {
    if (prompt.tags) {
      prompt.tags.forEach((tag) => {
        const lowercaseTag = tag.toLowerCase()
        if (lowercaseTag.includes("prompttemplate")) {
          const existingType = tags.type.find((t) => t.id === lowercaseTag)
          if (existingType) {
            existingType.count++
          } else {
            tags.type.push({
              id: lowercaseTag,
              label: lowercaseTag
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              count: 1,
            })
          }
        } else {
          const existingUseCase = tags.useCases.find(
            (u) => u.id === lowercaseTag
          )
          if (existingUseCase) {
            existingUseCase.count++
          } else {
            tags.useCases.push({
              id: lowercaseTag,
              label: lowercaseTag
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              count: 1,
            })
          }
        }
      })
    }
  })

  return tags
}

export const tags = generateTags(prompts)

export type Prompt = (typeof prompts)[number]
