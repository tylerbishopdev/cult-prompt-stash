"use client"

import { useEffect, useState } from "react"

import { Prompt } from "../data/default-prompts"

export function usePromptString(prompt: Prompt | null) {
  const [promptString, setPromptString] = useState(prompt?.template || "")

  const extractVariables = (promptString: string) => {
    const variableRegex = /\{(\w+)\}/g
    const variables = []
    let match
    while ((match = variableRegex.exec(promptString)) !== null) {
      variables.push(match[1])
    }
    return variables
  }

  const variables = extractVariables(promptString)

  useEffect(() => {
    setPromptString(prompt?.template || "")
  }, [prompt])

  return { promptString, setPromptString, variables }
}
