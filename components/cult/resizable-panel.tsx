"use client"

import { ComponentProps, createContext, ReactNode, useContext } from "react"
import { AnimatePresence, motion } from "framer-motion"
import useMeasure from "react-use-measure"

let PanelContext = createContext({ value: "" })

export function Root({
  children,
  value,
  ...rest
}: {
  children: ReactNode
  value: string
} & ComponentProps<"div">) {
  let [ref, bounds] = useMeasure()

  return (
    <motion.div
      animate={{ height: bounds.height > 0 ? bounds.height : undefined }}
      transition={{ type: "spring", bounce: 0, duration: 0.8 }}
      style={{ overflow: "hidden", position: "relative" }}
    >
      <div ref={ref}>
        <PanelContext.Provider value={{ value }}>
          <div {...rest}>{children}</div>
        </PanelContext.Provider>
      </div>
    </motion.div>
  )
}

export function Content({
  value,
  children,
  ...rest
}: {
  value: string
  children: ReactNode
} & ComponentProps<"div">) {
  let panelContext = useContext(PanelContext)
  let isActive = panelContext.value === value

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              type: "ease",
              ease: "easeInOut",
              duration: 0.3,
              delay: 0.2,
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              type: "ease",
              ease: "easeInOut",
              duration: 0.2,
            },
          }}
        >
          <div {...rest}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
