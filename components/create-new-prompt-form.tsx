"use client"

import React, { useState } from "react"
import { generatePromptWithAI } from "@/ai/generate-prompt-action"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader, SparklesIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import TextArea from "react-textarea-autosize"
import { toast } from "sonner"
import { z } from "zod"

import { PromptStructure } from "@/lib/data/default-prompts"
import { useSettings } from "@/lib/hooks/use-api-key"
import { usePrompts } from "@/lib/hooks/use-prompts"
import { nanoid } from "@/lib/utils"

import {
  CreateNewPromptGenerateDialog,
  PromptType,
} from "./create-new-prompt-generate"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less"),
  template: z.string().min(1, "Template is required"),
  tags: z.any(),
})

type FormSchema = z.infer<typeof formSchema>

export function NewPromptForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { settings } = useSettings()
  const { createPrompt } = usePrompts()

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      template: "",
      tags: [],
    },
  })

  async function onSubmit(data: FormSchema) {
    const promptData: Partial<PromptStructure> = {
      ...data,
      id: nanoid(22),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      bookmarked: false,
      input_variables: [],
      locked: false,
    }

    try {
      await createPrompt(promptData as PromptStructure)
      toast.success("Prompt created successfully")
      form.reset()
    } catch (error) {
      toast.error("Failed to create prompt")
    }
  }

  const handleGeneratePrompt = async (
    promptIdea: string,
    promptType: PromptType
  ) => {
    setIsGenerating(true)
    try {
      const result = await generatePromptWithAI(
        promptIdea,
        settings.USER_OPEN_AI_API_KEY,
        promptType
      )
      if (result.success && result.data) {
        form.reset(result.data)
        toast.success("Prompt generated successfully")
      } else {
        throw new Error(result.error || "Failed to generate prompt")
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while generating the prompt"
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <CardTitle>Manual or Generate</CardTitle>
            <CardDescription>
              Fill out the form below or generate a prompt using AI. <br />{" "}
              (zero shot, few shot, or chain of thought, etc)
            </CardDescription>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={isGenerating}
            className="w-full sm:w-auto"
          >
            {isGenerating ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="mr-2 h-4 w-4" />
                Generate with AI
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[600px] pr-4 ">
              <div className="space-y-6 px-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormDescription>
                        A descriptive title for your prompt.
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="Enter a title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormDescription>
                        An easy to understand description of your prompt.
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="Describe your prompt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="template"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt</FormLabel>
                      <FormDescription>
                        The main prompt template in markdown format.
                      </FormDescription>
                      <FormControl>
                        <TextArea
                          placeholder="Add your prompt template here"
                          className="resize-none  p-1 flex min-h-[80px] w-full rounded-md border border-black/10 dark:border-white/10 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          minRows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormDescription>
                        Enter up to 3 relevant tags for the prompt, separated by
                        commas.
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Enter comma-separated tags"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                .split(",")
                                .map((tag) => tag.trim())
                                .filter(Boolean)
                            )
                          }
                          value={field.value ? field.value.join(", ") : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
          </form>
        </Form>
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          className="w-full"
        >
          Create Prompt
        </Button>
      </CardContent>

      <CreateNewPromptGenerateDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onGenerate={handleGeneratePrompt}
      />
    </Card>
  )
}
