import { Dispatch, SetStateAction } from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

type SelectedActionsDisplayProps<T extends Record<string, any>> = {
  selectedActions: (keyof T)[]
  setSelectedActions: Dispatch<SetStateAction<(keyof T)[]>>
  actionsRegistry: T
}

const gradientMap = {
  Primary:
    "shadow-elevation-light dark:shadow-elevation-dark from-primary to-primary/80 text-primary-foreground",
  Accent:
    "shadow-elevation-light dark:shadow-elevation-dark from-accent to-accent/80 text-accent-foreground",
  Secondary:
    "shadow-elevation-light dark:shadow-elevation-dark from-secondary to-secondary/80 text-secondary-foreground",
} as const

export const SelectedActionsDisplay = <T extends Record<string, any>>({
  selectedActions,
  setSelectedActions,
  actionsRegistry,
}: SelectedActionsDisplayProps<T>) => {
  const hasSelectedActions = selectedActions.length > 0

  return (
    <fieldset className="  bg-background rounded-lg border border-black/20 dark:border-white/20 p-4 text-sm flex flex-row flex-wrap gap-2 items-center justify-start ">
      <legend className="-ml-1 px-1 text-sm font-medium">
        Enabled Agent Tools
      </legend>
      {hasSelectedActions
        ? ""
        : "Use @ to select ai actions (all are on by default)"}
      {selectedActions.map((actionId) => (
        <div
          key={actionId as string}
          className={cn(
            "bg-card  border dark:border-white/10 border-black/10  py-1 px-[5px] flex gap-2 items-center flex-row rounded-lg",
            "text-card-foreground transition-colors duration-200 ease-in-out cursor-pointer hover:bg-muted/50 group"
          )}
          onClick={() =>
            setSelectedActions((prevActions) =>
              prevActions.filter((id) => id !== actionId)
            )
          }
        >
          <div className="relative">
            <div
              className={cn(
                "rounded-full h-4 w-4 bg-gradient-to-r flex items-center justify-center text-card-foreground transition-opacity duration-200",
                "group-hover:opacity-0",
                gradientMap[actionsRegistry[actionId].metadata.avatarGradient]
              )}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <X className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
          <div className="text-xs pr-0.5">
            {actionsRegistry[actionId].metadata.title.toLowerCase()}
          </div>
        </div>
      ))}
    </fieldset>
  )
}
