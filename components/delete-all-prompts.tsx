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

export function DeleteAllPromptsButton() {
  const { deleteAllPrompts } = usePrompts()
  const [isOpen, setIsOpen] = useState(false)

  const handleDeleteAll = () => {
    deleteAllPrompts()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete All Prompts</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete All Prompts</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete all prompts? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteAll}>
            Delete All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
