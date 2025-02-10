import { Dispatch, SetStateAction, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { WrenchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type AgentChatActionsMenuProps = {
  actionsSearch: string
  setActionsSearch: (search: string) => void
  filteredActions: any[]
  selectedIndex: number
  setSelectedIndex: Dispatch<SetStateAction<number>>
  setSelectedActions: Dispatch<SetStateAction<string[]>>
  searchRef: React.RefObject<HTMLInputElement>
  aiActionsEnabled: boolean
  setAiActionsEnabled: Dispatch<SetStateAction<boolean>>
}

const gradientMap = {
  Primary: "from-primary to-primary/80 text-primary-foreground",
  Accent: "from-accent to-accent/80 text-accent-foreground",
  Secondary: "from-secondary to-secondary/80 text-secondary-foreground",
} as const

const containerVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      height: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      height: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export const AgentChatActionsMenu: React.FC<AgentChatActionsMenuProps> = ({
  actionsSearch,
  setActionsSearch,
  filteredActions,
  selectedIndex,
  setSelectedIndex,
  setSelectedActions,
  searchRef,
  aiActionsEnabled,
  setAiActionsEnabled,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      setSelectedIndex(
        (prev) => (prev - 1 + filteredActions.length) % filteredActions.length
      )
      e.preventDefault()
    } else if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % filteredActions.length)
      e.preventDefault()
    } else if (e.key === "Enter") {
      const newAction = filteredActions[selectedIndex]
      if (newAction) {
        setSelectedActions((prev) => [...prev, newAction.actionId])
        setSelectedIndex(0)
        setActionsSearch("")
        e.preventDefault()
      }
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-semibold">Prompt Agent</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ai-actions-toggle"
                  checked={aiActionsEnabled}
                  onCheckedChange={setAiActionsEnabled}
                />
                <Label htmlFor="ai-actions-toggle">Enable AI Actions</Label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Enable AI to suggest and execute actions based on your messages.
                These Agent Actions use generative UI to help you improve your
                prompt.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <AnimatePresence initial={false}>
        {aiActionsEnabled && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="bg-background rounded-lg border border-black/20 dark:border-white/20 p-4">
              <div className="text-sm font-medium mb-3">All Agent Tools</div>
              <motion.div variants={itemVariants}>
                <Input
                  value={actionsSearch}
                  onChange={(e) => setActionsSearch(e.target.value)}
                  placeholder="Search for an action..."
                  ref={searchRef}
                  className="w-full mb-3"
                  onKeyDown={handleKeyDown}
                />
              </motion.div>
              <motion.div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredActions.map((action, index) => (
                  <motion.div key={action.actionId} variants={itemVariants}>
                    <Button
                      onClick={() =>
                        setSelectedActions((prev) => [...prev, action.actionId])
                      }
                      variant="ghost"
                      className={cn(
                        "py-6 px-4 flex flex-row gap-4 w-full justify-start text-left",
                        selectedIndex === index && "bg-muted"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-full h-8 w-8 bg-gradient-to-b flex items-center justify-center text-white border border-black/10 dark:border-white/10 shrink-0",
                          action.metadata &&
                            gradientMap[action.metadata.avatarGradient]
                        )}
                      >
                        <WrenchIcon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col space-y-1 items-start overflow-hidden">
                        <span className="font-medium truncate w-full">
                          {action.metadata && action.metadata.title}
                        </span>
                        <span className="text-muted-foreground line-clamp-2 text-sm">
                          {action.metadata && action.metadata.description}
                        </span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
