"use client"

import { ErrorBoundary } from "next/dist/client/components/error-boundary"
import { useRouter } from "next/navigation"
import { AI } from "@/ai/actions"
import { useAIState, type StreamableValue } from "ai/rsc"

import { useStreamableText } from "@/lib/hooks/use-streamable-text"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { OpenAI } from "./icons"
import { MemoizedReactMarkdown } from "./markdown"

export function ErrorFallback() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div>
        <h2 className="text-md">Something went wrong</h2>
      </div>
      <Button onClick={() => router.refresh()} variant="outline">
        Try again
      </Button>
    </div>
  )
}

export const spinner = (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className="size-5 animate-spin stroke-zinc-400"
  >
    <path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12" />
  </svg>
)

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex items-start">
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2 text-xs font-mono leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start">
      <div className="flex size-[25px] shrink-0 select-none items-center justify-center">
        <ChatAvatar role="assistant" />
      </div>

      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
        {spinner}
      </div>
    </div>
  )
}

export function BotMessage({
  content,
}: {
  content: string | StreamableValue<string>
}) {
  const text = useStreamableText(content)

  return (
    <ErrorBoundary errorComponent={ErrorFallback}>
      <div className="group relative flex items-start">
        <div className="flex size-[25px] shrink-0 select-none items-center justify-center">
          <ChatAvatar role="assistant" />
        </div>

        <div className="ml-4 flex-1 overflow-hidden pl-2 text-xs font-mono">
          <MemoizedReactMarkdown className="prose break-words dark:prose-invert leading-relaxed prose-pre:p-0 mb-2 last:mb-0 text-xs font-mono">
            {text}
          </MemoizedReactMarkdown>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export function BotCard({
  children,
  showAvatar = true,
  className,
}: {
  children?: React.ReactNode
  showAvatar?: boolean
  className?: string
}) {
  return (
    <ErrorBoundary errorComponent={ErrorFallback}>
      <div className="group relative flex items-start">
        <div className="flex size-[25px] shrink-0 select-none items-center justify-center">
          {showAvatar && <ChatAvatar role="assistant" />}
        </div>

        <div
          className={cn(
            "ml-4 flex-1 space-y-2 overflow-hidden pl-2 text-xs font-mono leading-relaxed",
            className
          )}
        >
          {children}
        </div>
      </div>
    </ErrorBoundary>
  )
}

type Props = {
  role: "assistant" | "user"
}
export function ChatAvatar({ role }: Props) {
  const [aiState] = useAIState<typeof AI>()

  switch (role) {
    case "user": {
      return (
        <Avatar className="size-6">
          <AvatarImage
            src={aiState?.user?.avatar_url}
            alt={aiState?.user?.full_name ?? ""}
          />
        </Avatar>
      )
    }

    default:
      return <OpenAI />
  }
}
