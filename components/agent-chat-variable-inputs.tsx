import { motion } from "framer-motion"

import { Input } from "./ui/input"
import { Label } from "./ui/label"

export function AgentChatVariableInputs({
  variables,
  variableValues,
  onVariableChange,
}) {
  return (
    <div className="pb-3 px-3 rounded-lg">
      <fieldset className="grid space-x-3 space-y-3 grid-cols-3 bg-background rounded-lg border border-black/20 dark:border-white/20 px-3 pb-3 -mt-1">
        <legend className="-ml-1 px-1 text-sm font-medium">Variables</legend>
        {variables.map((variable) => (
          <motion.div
            key={variable}
            className="col-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Label>{variable}</Label>
            <Input
              type="text"
              value={variableValues[variable] || ""}
              onChange={(e) => onVariableChange(variable, e.target.value)}
              className="bg-white dark:bg-black text-primary focus-visible:ring-blue-300/0 dark:focus-visible:border-blue-300/70"
            />
          </motion.div>
        ))}
      </fieldset>
    </div>
  )
}
