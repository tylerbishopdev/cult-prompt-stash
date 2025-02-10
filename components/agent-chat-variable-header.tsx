import { AnimatePresence, motion } from "framer-motion"
import { MessageCircleDashed } from "lucide-react"

import { AgentChatVariableInputs } from "./agent-chat-variable-inputs"
import { TextureCardHeader, TextureSeparator } from "./cult/texture-card"

export function AgentChatVariableHeader({
  messages,
  inputValue,
  variables,
  variableValues,
  handleVariableChange,
}) {
  const showHeader = inputValue.includes("{") || messages.length < 1

  return (
    <AnimatePresence>
      {showHeader && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: "auto",
            opacity: 1,
            transition: {
              duration: 0.6,
              ease: [0.43, 0.13, 0.23, 0.96],
            },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: {
              duration: 0.4,
              ease: [0.43, 0.13, 0.23, 0.96],
            },
          }}
        >
          <TextureCardHeader className="first:pt-2 last:pb-0">
            {messages.length < 1 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    ease: [0.43, 0.13, 0.23, 0.96],
                    delay: 0.2,
                  },
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  transition: {
                    duration: 0.3,
                    ease: [0.43, 0.13, 0.23, 0.96],
                  },
                }}
                className="hidden md:flex flex-col pb-3 w-full items-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      duration: 0.5,
                      ease: [0.43, 0.13, 0.23, 0.96],
                      delay: 0.3,
                    },
                  }}
                  exit={{
                    scale: 0.8,
                    opacity: 0,
                    transition: {
                      duration: 0.3,
                      ease: [0.43, 0.13, 0.23, 0.96],
                    },
                  }}
                  className="bg-primary-foreground p-4 rounded-full flex justify-center"
                >
                  <MessageCircleDashed className="h-6 w-6 text-primary" />
                </motion.div>
              </motion.div>
            )}
            {inputValue.includes("{") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    ease: [0.43, 0.13, 0.23, 0.96],
                    delay: 0.4,
                  },
                }}
                exit={{
                  opacity: 0,
                  y: 20,
                  transition: {
                    duration: 0.3,
                    ease: [0.43, 0.13, 0.23, 0.96],
                  },
                }}
              >
                <AgentChatVariableInputs
                  variables={variables}
                  variableValues={variableValues}
                  onVariableChange={handleVariableChange}
                />
              </motion.div>
            )}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: 1,
                transition: {
                  duration: 0.5,
                  ease: [0.43, 0.13, 0.23, 0.96],
                  delay: 0.6,
                },
              }}
              exit={{
                scaleX: 0,
                transition: {
                  duration: 0.3,
                  ease: [0.43, 0.13, 0.23, 0.96],
                },
              }}
            >
              <TextureSeparator />
            </motion.div>
          </TextureCardHeader>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
