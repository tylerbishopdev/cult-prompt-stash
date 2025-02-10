"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bookmark, Edit, MessageCircleCode, Search } from "lucide-react"

import { PromptStructure } from "@/lib/data/default-prompts"
import { useFilters, useSearchQuery } from "@/lib/hooks/use-prompt-filters"
import { usePrompt, usePrompts } from "@/lib/hooks/use-prompts"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"

import Chat from "../components/agent-chat"
import { AgentPromptEditor } from "../components/agent-prompt"
import ApiKeyInputModal from "../components/api-key-input-modal"
import { CreateNewPromptDrawer } from "../components/create-new-prompt-drawer"
import { PromptCard } from "../components/prompt-card"
import {
  filterPrompts,
  PromptFilterListSidebar,
} from "../components/prompt-filter-sidebar"
import { ModeToggle } from "../components/theme-provider"

interface PromptLibraryProps {
  defaultCollapsed?: boolean
  navCollapsedSize?: number
}

export const DesktopLayout: React.FC<PromptLibraryProps> = ({
  defaultCollapsed = false,
  navCollapsedSize,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  // Global State
  const [prompt] = usePrompt()
  const [filters] = useFilters()
  const { prompts } = usePrompts()
  const [searchQuery, setSearchQuery] = useSearchQuery()

  const filteredPrompts = filterPrompts(prompts, filters, searchQuery)
  const selectedPrompt = prompts.find((item) => item.id === prompt.selected)
  const bookmarkedPrompts = filteredPrompts.filter(
    (prompt) => prompt.bookmarked
  )

  return (
    <div className="">
      <TooltipProvider>
        {/* LEFT PANEL */}
        <ResizablePanelGroup
          direction="horizontal"
          className=" bg-black/90 text-zinc-500   items-stretch"
        >
          <ResizablePanel
            defaultSize={15}
            collapsedSize={navCollapsedSize}
            collapsible={true}
            minSize={15}
            maxSize={20}
            onCollapse={(collapsed: any) => {
              setIsCollapsed(collapsed)
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(collapsed)}`
            }}
            className={cn(
              isCollapsed &&
                "min-w-[60px] transition-all bg-zinc-900 duration-300 ease-in-out"
            )}
          >
            <CreateNewPromptDrawer isCollapsed={isCollapsed} />
            <Separator />
            <PromptFilterListSidebar isCollapsed={isCollapsed} />

            {/* User Settings */}
            <div className="absolute bottom-6 left-3">
              <div className={cn("flex gap-2", isCollapsed ? "flex-col " : "")}>
                <ModeToggle />
                <ApiKeyInputModal />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Center Panel */}
          <ResizablePanel defaultSize={40} minSize={36} className="shadow-lg">
            <Tabs defaultValue="all">
              <div className="flex items-center  justify-between px-4 py-2">
                <h2 className="font-semibold">Prompts</h2>
                <TabsList className="grid w-full grid-cols-2  max-w-[100px]">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="bookmarked">
                    <Bookmark className="size-4" />
                  </TabsTrigger>
                </TabsList>
              </div>

              <Separator />

              {/* Prompt Search */}
              <div className="bg-zinc-800/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-zinc/90 ">
                <form id="prompt-search">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-300/50" />
                    <Input
                      placeholder="Search"
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
              </div>

              {/* All Prompts */}
              <TabsContent value="all " className="m-0">
                <ScrollArea className="h-[calc(100vh-129px)] z-20 bg-zinc-900/95">
                  <div className=" m-3 ">
                    <AnimatePresence initial={false}>
                      {filteredPrompts.map((prompt, index) => (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{
                            height: 0,
                            y:
                              -53 *
                              countSelectedPromptsAfter(
                                prompts,
                                filteredPrompts,
                                prompt
                              ),

                            zIndex: groupSelectedPrompts(
                              prompts,
                              filteredPrompts
                            )
                              .reverse()
                              .findIndex((group) => group.includes(prompt)),
                          }}
                          transition={{
                            ease: [0.32, 0.72, 0, 1],
                            duration: 0.2,
                          }}
                          style={{ overflow: "hidden", zIndex: 1000 }}
                          key={`${prompt.id}`}
                          className="relative z-[1000] flex flex-col justify-end "
                        >
                          <div className="py-2 px-1">
                            <PromptCard prompt={prompt} />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Bookmarked Prompts */}
              <TabsContent value="bookmarked" className="m-0 ">
                <ScrollArea className="h-[calc(100vh-129px)] ">
                  <div className="flex flex-col gap-3 pb-48 pt-4 p-4 ">
                    {bookmarkedPrompts.map((prompt, index) => (
                      <PromptCard key={index} prompt={prompt} />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={45} minSize={42}>
            <Tabs defaultValue="test">
              <div className="flex items-center  justify-between px-4 py-2">
                <h2 className="font-semibold">Agents</h2>

                <TabsList className="grid w-full grid-cols-2  max-w-[100px]">
                  <TabsTrigger value="test">
                    <MessageCircleCode className="size-4" />
                  </TabsTrigger>
                  <TabsTrigger value="edit">
                    <Edit className="size-4" />
                  </TabsTrigger>
                </TabsList>
              </div>

              <Separator />

              <TabsContent value="test" className="m-0">
                <Chat prompt={selectedPrompt || null} />
              </TabsContent>
              <TabsContent value="edit" className="m-0">
                <ScrollArea className="h-[calc(100vh-60px)]">
                  <AgentPromptEditor prompt={selectedPrompt || null} />
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  )
}

function countSelectedPromptsAfter(
  prompts: PromptStructure[],
  selectedPrompts: PromptStructure[],
  prompt: PromptStructure
) {
  const startIndex = prompts.indexOf(prompt)

  if (startIndex === -1 || !selectedPrompts.includes(prompt)) {
    return 0
  }

  let consecutiveCount = 0

  for (let i = startIndex + 1; i < prompts.length; i++) {
    if (selectedPrompts.includes(prompt[i])) {
      consecutiveCount++
    } else {
      break
    }
  }

  return consecutiveCount
}

function groupSelectedPrompts(
  prompts: PromptStructure[],
  selectedPrompts: PromptStructure[]
) {
  const todoGroups = []
  let currentGroup = []

  for (let i = 0; i < prompts.length; i++) {
    const todo = prompts[i]

    if (selectedPrompts.includes(todo)) {
      currentGroup.push(todo)
    } else if (currentGroup.length > 0) {
      // If we encounter a non-selected message and there is an active group,
      // push the current group to the result and reset it.
      todoGroups.push(currentGroup)
      currentGroup = []
    }
  }

  // Check if there's a group remaining after the loop.
  if (currentGroup.length > 0) {
    todoGroups.push(currentGroup)
  }

  return todoGroups
}
