"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  BookOpen,
  GlobeLockIcon,
  Info,
  Key,
  Settings,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { useSettings, useSettingsModal } from "@/lib/hooks/use-api-key"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { IconOpenAI } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeleteAllPromptsButton } from "@/components/delete-all-prompts"
import { RestoreDefaultPromptsButton } from "@/components/restore-all-default-prompts"

const apiKeySchema = z.string().regex(/^sk-[a-zA-Z0-9-_]{30,}$/)

export default function ImprovedSettingsModal() {
  const { settings, setUserOpenAIApiKey } = useSettings()
  const { isOpenSettingsModal, toggleSettingsModal } = useSettingsModal()
  const [inputValue, setInputValue] = useState(settings.USER_OPEN_AI_API_KEY)
  const [activeTab, setActiveTab] = useState("api-key")

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSaveKey = () => {
    const key = apiKeySchema.safeParse(inputValue)
    if (key.success) {
      setUserOpenAIApiKey(key.data)
      toast.success("API key saved successfully")
      toggleSettingsModal()
    } else {
      toast.error("API key format is invalid")
    }
  }

  const handleDeleteKey = () => {
    setInputValue("")
    setUserOpenAIApiKey("")
    toast.success("API key removed")
  }

  return (
    <Dialog open={isOpenSettingsModal} onOpenChange={toggleSettingsModal}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border border-black/10 dark:border-white/10 group"
          aria-label="Open Settings"
        >
          <Settings className="h-[1.2rem] w-[1.2rem] group-hover:rotate-6 transition-all" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center gap-3 justify-center">
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-full"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "api-key" ? (
                  <IconOpenAI className="text-white w-6 h-6" />
                ) : (
                  <BookOpen className="text-white w-6 h-6" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500">
            Manage your API key and prompt library settings
          </DialogDescription>
        </DialogHeader>
        <Tabs
          defaultValue="api-key"
          className="w-full mt-6"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="api-key">API Key</TabsTrigger>
            <TabsTrigger value="prompt-library">Prompt Library</TabsTrigger>
          </TabsList>
          <TabsContent value="api-key" className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-sm font-medium">
                OpenAI API Key
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="apiKey"
                  type="password"
                  value={inputValue}
                  onChange={handleApiKeyChange}
                  className="pl-10 pr-20 h-12 focus-visible:ring-blue-500"
                  placeholder="sk-proj-..."
                  aria-describedby="apiKeyHint"
                />
                {inputValue && (
                  <Button
                    type="button"
                    onClick={handleDeleteKey}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <p id="apiKeyHint" className="text-xs text-gray-500">
                Your API key should start with &apos;sk-proj-&apos; followed by
                a series of characters and periods
              </p>
            </div>
            <Button
              onClick={handleSaveKey}
              className="w-full h-12 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <GlobeLockIcon className="w-4 h-4 mr-2" /> Save API Key
            </Button>
          </TabsContent>
          <TabsContent value="prompt-library" className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Delete All Prompts
                </Label>
                <p className="text-xs text-gray-500">
                  This action will permanently delete all your saved prompts.
                  Use with caution.
                </p>
              </div>
              <DeleteAllPromptsButton />
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Restore Default Prompts
                </Label>
                <p className="text-xs text-gray-500">
                  This will add all default prompts to your current list.
                  Existing prompts will not be affected.
                </p>
              </div>
              <RestoreDefaultPromptsButton />
            </div>
          </TabsContent>
        </Tabs>
        <Separator className="my-6" />
        <DialogFooter className="flex justify-center items-center mx-auto">
          <div className="flex items-center space-x-2 text-gray-500">
            <Info className="w-4 h-4" />
            <p className="text-xs">
              Your data is stored locally and never sent to our servers
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
