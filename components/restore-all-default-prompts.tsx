import { useState } from "react"

import { usePrompts } from "@/lib/hooks/use-prompts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "./ui/button"

export function RestoreDefaultPromptsButton() {
  const { restoreDefaultPrompts } = usePrompts()
  const [isOpen, setIsOpen] = useState(false)

  const handleRestoreDefaults = () => {
    restoreDefaultPrompts()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Restore Default Prompts</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore Default Prompts</DialogTitle>
          <DialogDescription>
            Are you sure you want to restore all default prompts? This will
            overwrite your current prompts.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleRestoreDefaults}>Restore</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
