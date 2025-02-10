import { useCallback, useRef } from "react"
import { TrashIcon } from "lucide-react"
import Textarea from "react-textarea-autosize"
import { toast } from "sonner"

import { useSettings, useSettingsModal } from "@/lib/hooks/use-api-key"
import { cn, nanoid } from "@/lib/utils"

import { UserMessage } from "./message"
import { Button } from "./ui/button"
import { IconArrowElbow, IconPlus } from "./ui/icons"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export function AgentChatUserMessageForm({
  formRef,
  inputValue,
  setInputValue,
  setMessages,
  sendMessage,
  selectedActions,
  setSelectedActions,
  renderInputValue,
  setVariableValues,
  onKeyDown,
  setShowActionsMenu,
  prompt,
  handleNewChat,
}: {
  formRef: React.RefObject<HTMLFormElement>
  inputValue: string
  setInputValue: (value: string) => void
  setMessages: React.Dispatch<React.SetStateAction<any[]>>
  sendMessage: (value: string, apiKey: string, actions?: any[]) => Promise<any>
  selectedActions: any[]
  setSelectedActions: React.Dispatch<React.SetStateAction<any[]>>
  renderInputValue: () => string
  setVariableValues: (values: any) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  setShowActionsMenu: (show: boolean) => void
  handleNewChat?: any
  prompt?: { template: string }
}) {
  const { settings } = useSettings()
  const { toggleSettingsModal } = useSettingsModal()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Memoize the onChange handler to prevent unnecessary re-renders
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value)
      if (settings.USER_OPEN_AI_API_KEY === "") {
        toggleSettingsModal()
      }
    },
    [setInputValue, settings.USER_OPEN_AI_API_KEY, toggleSettingsModal]
  )

  return (
    <form
      ref={formRef}
      className="w-full"
      onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Blur the input on mobile devices to hide the keyboard
        if (window.innerWidth < 600) {
          ;(e.target as HTMLFormElement).message?.blur()
        }

        const value = renderInputValue().trim()
        setInputValue("")
        setVariableValues({})
        if (!value) return

        // Check for API key and prompt user if missing
        if (!settings.USER_OPEN_AI_API_KEY) {
          toast.error("Please enter your OpenAI API key in the settings.")
          toggleSettingsModal()
          return
        }

        // Add user message to the chat
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: nanoid(),
            role: "user",
            display: <UserMessage>{value}</UserMessage>,
          },
        ])

        try {
          // Send message to the API
          const response = await sendMessage(
            value,
            settings.USER_OPEN_AI_API_KEY,
            selectedActions.length > 0 ? selectedActions : undefined
          )
          // Add API response to the chat
          setMessages((currentMessages) => [...currentMessages, response])
          setSelectedActions([])
        } catch (error) {
          console.error(error)
          // Provide more specific error messages based on error type
          if (error instanceof TypeError) {
            toast.error("Network error. Please check your internet connection.")
          } else if (error instanceof Response && error.status === 401) {
            toast.error("Invalid API key. Please check your settings.")
          } else {
            toast.error("An unexpected error occurred. Please try again later.")
          }
        }
      }}
    >
      {/* Action Buttons */}
      <div className="relative flex flex-col w-full px-8 overflow-hidden max-h-60 grow  shadow-elevation-light dark:shadow-elevation-dark   md:mt-0 rounded-xl sm:px-12 ">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              tabIndex={-1}
              size="icon"
              className="hidden md:block absolute left-0 w-8 h-8 p-0 rounded-full top-2 bg-background sm:left-2 border-neutral-300/50 dark:border-neutral-700/50 hover:bg-primary hover:text-primary-foreground"
              onClick={handleNewChat}
            >
              <div className="flex items-center justify-center">
                <IconPlus />
                <span className="sr-only">New Chat</span>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              tabIndex={-1}
              size="icon"
              className="hidden md:block md:absolute left-0 w-8 h-8 p-0 rounded-full bottom-2 bg-background sm:left-2 border-neutral-300/50 dark:border-neutral-700/50 hover:bg-destructive hover:text-destructive-foreground"
              onClick={(e) => {
                e.preventDefault()
                setMessages([])
              }}
            >
              <div className="flex items-center justify-center">
                <TrashIcon className="h-4 w-4" />
                <span className="sr-only">Delete Chat</span>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete Chat</TooltipContent>
        </Tooltip>

        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[100px] max-h-[100px] w-full resize-none   px-1 md:px-4 pt-2 pb-1 focus-within:outline-none  text-sm sm:text-sm dark:text-white text-black "
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowActionsMenu(false)}
          aria-label="Chat input"
        />

        {/* Send Message Button */}
        <div className="hidden md:block absolute right-0 bottom-[1px] sm:right-[1px]">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                className={cn(
                  inputValue === ""
                    ? "bg-background text-secondary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    : "",

                  "rounded-t-[2px] rounded-bl-[2px] rounded-r-xl h-[100px] w-[46px] transition-colors duration-300 ease-out"
                )}
                disabled={
                  !settings.USER_OPEN_AI_API_KEY ||
                  (inputValue === "" && prompt?.template === "")
                }
                aria-label="Send message"
              >
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
