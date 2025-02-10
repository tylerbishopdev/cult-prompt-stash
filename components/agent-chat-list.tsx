"use client"

import type { ClientMessage } from "@/ai/types"

import { cn } from "@/lib/utils"
import { PopIn } from "@/components/cult/pop-in"
import * as ResizablePanel from "@/components/cult/resizable-panel"

type Props = {
  messages: ClientMessage[]
  className?: string
}

export function ChatList({ messages, className }: Props) {
  if (!messages.length) {
    return null
  }

  return (
    <div className={cn("flex flex-col gap-8 select-text px-4", className)}>
      {messages
        .filter((message) => message.display !== undefined)
        .map((message, index) => (
          <PopIn key={message.id}>
            <ResizablePanel.Root value={message.id}>
              <ResizablePanel.Content value={message.id}>
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex-1 flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "relative rounded-[1.3rem] transition-colors max-w-[80%] px-4 py-3  border border-border",

                        message.role === "user"
                          ? "bg-card text-card-foreground ring-primary/10"
                          : "bg-muted dark:bg-black  mr-8"
                      )}
                    >
                      {message.display}
                    </div>
                  </div>
                </div>
              </ResizablePanel.Content>
            </ResizablePanel.Root>
          </PopIn>
        ))}
    </div>
  )
}
