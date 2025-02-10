"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AI } from "@/ai/actions"
import { actionsRegistry } from "@/ai/registry"
import { ClientMessage } from "@/ai/types"
import { useActions, useAIState, useUIState } from "ai/rsc"

import { PromptStructure } from "@/lib/data/default-prompts"
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit"
import { usePromptString } from "@/lib/hooks/use-prompt-variables"
import { nanoid } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AgentChatActionsMenu } from "@/components/agent-chat-action-menu"
import {
  TextureCard,
  TextureCardContent,
  TextureCardFooter,
} from "@/components/cult/texture-card"
import { EmptyScreen } from "@/components/empty-screen"
import { SelectedActionsDisplay } from "@/components/selected-action-display"

import { ChatList } from "./agent-chat-list"
import { AgentChatUserMessageForm } from "./agent-chat-user-message-form"
import { AgentChatVariableHeader } from "./agent-chat-variable-header"

// Define the type for action keys based on the actionsRegistry
// This allows for type-safe access to actions throughout the component
type ActionKey = keyof typeof actionsRegistry

// Interface for the chat state
// This centralizes all the state variables related to the chat interface
interface ChatState {
  variableValues: Record<string, string> // Stores values for variables in the prompt
  inputValue: string // Current value of the input field
  showActionsMenu: boolean // Controls visibility of the actions menu
  actionsSearch: string // Current search term in the actions menu
  selectedActions: ActionKey[] // List of currently selected actions
  selectedIndex: number // Index of the currently selected action in the menu
  aiActionsEnabled: boolean
}

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
    aiActionsEnabled: true,
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
  const [_, setAIState] = useAIState<typeof AI>()

  // Refs for accessing DOM elements
  // These allow direct manipulation of input fields when needed
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Custom hook for sending messages
  // This encapsulates the message sending logic provided by the AI system
  const { sendMessage } = useActions()

  // Effect to update input value when prompt changes
  // Ensures the input field always reflects the current prompt template
  useEffect(() => {
    if (prompt) {
      setChatState((prev) => ({ ...prev, inputValue: prompt.template ?? "" }))
    }
  }, [prompt])

  // Effect to add global keyboard shortcut for focusing input
  // Improves user experience by allowing quick access to the input field
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).nodeName)
      ) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Memoized filtered actions based on search and selected actions
  // This optimizes performance by only recalculating when necessary
  const filteredActions = useMemo(
    () =>
      Object.values(actionsRegistry)
        .filter(
          (action) =>
            (action.metadata?.title
              ?.toLowerCase()
              .includes(chatState.actionsSearch.toLowerCase()) ||
              action.metadata?.description
                ?.toLowerCase()
                .includes(chatState.actionsSearch.toLowerCase())) &&
            !chatState.selectedActions.includes(action.actionId as ActionKey)
        )
        .slice(0, 5),
    [chatState.actionsSearch, chatState.selectedActions]
  )

  // Handler for '@' key press to show actions menu
  // This improves UX by providing quick access to the actions menu
  const handleAtKeyDown = useCallback(async () => {
    setChatState((prev) => ({
      ...prev,
      actionsSearch: "",
      selectedIndex: 0,
      showActionsMenu: true,
    }))
    // Small delay to ensure the search input is focused after the menu appears
    await new Promise((resolve) => setTimeout(resolve, 0))
    searchRef.current?.focus()
  }, [])

  // Combined key down handler for '@' and Enter keys
  // This centralizes keyboard event handling for the input field
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "@") {
        handleAtKeyDown()
        event.preventDefault()
      } else {
        onEnterKeyDown(event)
      }
    },
    [handleAtKeyDown, onEnterKeyDown]
  )

  // Handler for changing variable values
  // This allows dynamic updating of prompt variables
  const handleVariableChange = useCallback(
    (variable: string, value: string) => {
      setChatState((prev) => ({
        ...prev,
        variableValues: { ...prev.variableValues, [variable]: value },
      }))
    },
    []
  )

  // Function to render input value with variable substitution
  // This ensures that the displayed input reflects the current variable values
  const renderInputValue = useCallback(() => {
    return chatState.inputValue.replace(
      /\{(\w+)\}/g,
      (_, variable) => chatState.variableValues[variable] || `{${variable}}`
    )
  }, [chatState.inputValue, chatState.variableValues])

  // Handler for new messages
  // This updates the message list when new messages are received or sent
  const handleNewMessage = useCallback(
    (newMessages: ClientMessage[]) => {
      setMessages(newMessages)
    },
    [setMessages]
  )

  // Handler for updating selected actions
  // This allows for flexible updating of the selected actions list
  const setSelectedActions = useCallback(
    (value: ActionKey[] | ((prev: ActionKey[]) => ActionKey[])) => {
      setChatState((prev) => ({
        ...prev,
        selectedActions:
          typeof value === "function" ? value(prev.selectedActions) : value,
      }))
    },
    []
  )

  // Handler for starting a new chat
  // This resets the chat state and generates a new chat ID
  const handleNewChat = useCallback(() => {
    const newChatId = nanoid()
    setChatState((prev) => ({ ...prev, inputValue: "" }))
    setAIState((prev) => ({ ...prev, messages: [], chatId: newChatId }))
    setMessages([])
  }, [setAIState, setMessages])

  return (
    <div
      className="relative flex flex-col w-full h-[calc(100vh-64px)] overflow-hidden"
      role="main"
    >
      {/* Scrollable area for chat messages */}
      <ScrollArea className="flex-grow overflow-y-auto">
        <div className="p-4 pb-24" role="log" aria-live="polite">
          {messages.length ? <ChatList messages={messages} /> : <EmptyScreen />}
          <div className="w-full h-px" />
        </div>
      </ScrollArea>

      <Separator className="mt-auto" />

      {/* Chat input area */}
      <div className="sticky bottom-0 left-0 right-0 w-full bg-background py-2 ">
        <div className="mx-auto    px-1 sm:px-4 ">
          <TextureCard>
            <div className="flex flex-col space-y-4">
              {/* Variable header for displaying and editing chat variables */}
              <AgentChatVariableHeader
                messages={messages}
                variables={variables}
                inputValue={chatState.inputValue}
                variableValues={chatState.variableValues}
                handleVariableChange={handleVariableChange}
              />

              <TextureCardContent className="px-4">
                {/* Actions menu for selecting chat actions */}

                <AgentChatActionsMenu
                  actionsSearch={chatState.actionsSearch}
                  setActionsSearch={(value) =>
                    setChatState((prev) => ({
                      ...prev,
                      actionsSearch: value,
                    }))
                  }
                  setAiActionsEnabled={(value) =>
                    setChatState((prev) => ({
                      ...prev,
                      aiActionsEnabled:
                        typeof value === "function"
                          ? value(prev.aiActionsEnabled)
                          : value,
                    }))
                  }
                  aiActionsEnabled={
                    chatState.showActionsMenu &&
                    chatState.selectedActions.length <
                      Object.keys(actionsRegistry).length &&
                    chatState.aiActionsEnabled
                  }
                  filteredActions={filteredActions}
                  selectedIndex={chatState.selectedIndex}
                  setSelectedIndex={(value) =>
                    setChatState((prev) => ({
                      ...prev,
                      selectedIndex:
                        typeof value === "function"
                          ? value(prev.selectedIndex)
                          : value,
                    }))
                  }
                  setSelectedActions={setSelectedActions}
                  searchRef={searchRef}
                />

                {/* Display for selected actions */}
                <div className="flex flex-row gap-2 justify-between items-start pb-1">
                  <SelectedActionsDisplay
                    selectedActions={chatState.selectedActions}
                    setSelectedActions={setSelectedActions}
                    actionsRegistry={actionsRegistry}
                  />
                </div>
              </TextureCardContent>
            </div>
            <TextureCardFooter className="w-full">
              {/* User message input form */}
              <AgentChatUserMessageForm
                formRef={formRef}
                inputValue={chatState.inputValue}
                setInputValue={(value) =>
                  setChatState((prev) => ({ ...prev, inputValue: value }))
                }
                setMessages={handleNewMessage}
                sendMessage={sendMessage}
                selectedActions={chatState.selectedActions}
                setSelectedActions={setSelectedActions}
                renderInputValue={renderInputValue}
                handleNewChat={handleNewChat}
                setVariableValues={(values) =>
                  setChatState((prev) => ({ ...prev, variableValues: values }))
                }
                onKeyDown={onKeyDown}
                setShowActionsMenu={(value) =>
                  setChatState((prev) => ({ ...prev, showActionsMenu: value }))
                }
              />
            </TextureCardFooter>
          </TextureCard>
        </div>
      </div>
    </div>
  )
}
