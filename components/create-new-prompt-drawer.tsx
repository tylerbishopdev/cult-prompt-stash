"use client"

import { Plus, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { NewPromptForm } from "./create-new-prompt-form"
import { CultLogo } from "./cult/logo"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"

export function CreateNewPromptDrawer({
  isCollapsed,
}: {
  isCollapsed: boolean
}) {
  return (
    <div
      className={cn(
        "flex h-[52px] items-center justify-between ",
        isCollapsed ? "h-[52px] pl-3" : "pr-2"
      )}
    >
      <div className={cn("", isCollapsed ? "hidden" : "pl-2")}>
        <CultLogo className="size-6 w-auto fill-black dark:fill-blue-100" />
      </div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              " flex items-center gap-1 justify-center text-xs shadow-elevation-light dark:shadow-elevation-dark",
              isCollapsed ? "rounded-full py-5 px-3 " : ""
            )}
          >
            <span className={cn(isCollapsed ? "hidden" : "")}>New prompt</span>
            <Plus className="size-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-white dark:bg-background flex flex-col fixed bottom-0 left-0 right-0 max-h-[96%] rounded-t-[10px]">
          <DrawerHeader className="self-start w-full mx-auto">
            <DrawerTitle className="text-center text-xl font-black  pb-3 bg-clip-text text-transparent bg-gradient-to-t from-stone-900/80 to-stone-950/90 dark:from-stone-100/80 dark:to-stone-50/90">
              Add new prompt to your stash
            </DrawerTitle>
          </DrawerHeader>

          <div className="w-full mx-auto flex flex-col overflow-auto p-4 rounded-t-[10px]">
            <div className="flex justify-center overflow-auto">
              <NewPromptForm />
            </div>
          </div>

          <DrawerClose asChild className="absolute top-6 right-6">
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
    </div>
  )
}
