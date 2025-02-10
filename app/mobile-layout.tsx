"use client"

import { useState } from "react"
import {
  Bookmark,
  Filter,
  ListTreeIcon,
  PlusIcon,
  Search,
  X,
} from "lucide-react"

import { PromptStructure } from "@/lib/data/default-prompts"
import { useFilters } from "@/lib/hooks/use-prompt-filters"
import { usePrompt, usePrompts } from "@/lib/hooks/use-prompts"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Chat from "@/components/agent-chat"
import { AgentPromptEditor } from "@/components/agent-prompt"
import { NewPromptForm } from "@/components/create-new-prompt-form"
import { MobilePromptCard } from "@/components/prompt-card"
import { PromptFilterListSidebar } from "@/components/prompt-filter-sidebar"

export function MobileLayout() {
  const [tab, setTab] = useState("prompts")

  // Global state
  const [prompt] = usePrompt()
  const [filters] = useFilters()
  const { prompts } = usePrompts()

  // Filter the prompts based on the selected filters
  const filteredPrompts = prompts.filter((prompt) => {
    const lowerCaseTags = prompt.tags
      ? prompt?.tags.map((tag) => tag.toLowerCase())
      : []

    const matchesUseCases =
      filters.useCases.length === 0 ||
      filters.useCases.some((useCase) => lowerCaseTags.includes(useCase))

    return matchesUseCases
  })

  return (
    <div className="grid h-screen w-full ">
      <div className="flex flex-col">
        <Tabs value={tab} onValueChange={setTab}>
          <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-primary rounded-full py-1 px-1.5 hover:bg-primary/80"
                >
                  <PlusIcon className="text-white" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-white flex flex-col fixed bottom-0 left-0 right-0 max-h-[96%] rounded-t-[10px]">
                <DrawerHeader className=" self-start w-full  md:pl-64">
                  <DrawerTitle>Create new prompt</DrawerTitle>
                </DrawerHeader>

                <div className="w-full mx-auto flex flex-col overflow-auto p-4 rounded-t-[10px]">
                  <div className="flex justify-center overflow-auto">
                    <NewPromptForm />
                  </div>
                </div>

                <DrawerClose className="absolute top-6 right-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border border-black/10 dark:border-white/10 py-6 rounded-full hover:bg-black/10 dark:hover:bg-white/10 active:bg-black/20 dark:active:bg-white/20"
                  >
                    <X />
                  </Button>
                </DrawerClose>

                <DrawerFooter></DrawerFooter>
              </DrawerContent>
            </Drawer>

            <div className="flex w-full justify-end  ">
              <TabsList className="grid w-full grid-cols-3  max-w-[230px]">
                <TabsTrigger value="prompts">Prompts</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="test">Test</TabsTrigger>
              </TabsList>
            </div>
          </header>

          <main className="grid flex-1 gap-4 overflow-auto  md:grid-cols-2 lg:grid-cols-3">
            <TabsContent value="prompts" className="m-0">
              <MobilePromptList
                filteredPrompts={filteredPrompts}
                setTab={setTab}
              />
            </TabsContent>
            <TabsContent value="edit" className="m-0">
              <ScrollArea className="h-[calc(100vh-60px)]">
                <div className="flex-1 overflow-y-auto bg-white dark:bg-black ">
                  <AgentPromptEditor
                    prompt={
                      prompts.find((item) => item.id === prompt.selected) ||
                      null
                    }
                  />
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="test" className="m-0">
              <Chat
                prompt={
                  prompts.find((item) => item.id === prompt.selected) || null
                }
              />
            </TabsContent>
          </main>
        </Tabs>
      </div>
    </div>
  )
}

function MobilePromptList({
  setTab,
  filteredPrompts,
}: {
  setTab: (string) => void
  filteredPrompts: PromptStructure[]
}) {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center  justify-between pr-4 pl-2 py-2">
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-transparent"
            >
              <Filter className="size-4" />
              <span className="sr-only">Filters</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh]">
            <DrawerHeader>
              <DrawerTitle>Filters</DrawerTitle>
              <DrawerDescription>
                Filter your prompts by tag, model and more.
              </DrawerDescription>
            </DrawerHeader>
            <PromptFilterListSidebar isCollapsed={false} />
          </DrawerContent>
        </Drawer>

        <TabsList className="grid w-full grid-cols-2  max-w-xs">
          <TabsTrigger value="all">
            <ListTreeIcon className="size-4" />
          </TabsTrigger>
          <TabsTrigger value="bookmarked">
            <Bookmark className="size-4" />
          </TabsTrigger>
        </TabsList>
      </div>

      <Separator />

      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground/50" />
            <Input placeholder="Search" className="pl-8" />
          </div>
        </form>
      </div>
      <TabsContent value="all" className="m-0">
        <ScrollArea className="h-[calc(100vh-129px)] ">
          <div className="flex flex-col gap-3 pb-48 pt-4 p-4 ">
            {filteredPrompts.map((prompt, index) => (
              <MobilePromptCard setTab={setTab} key={index} prompt={prompt} />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  )
}
