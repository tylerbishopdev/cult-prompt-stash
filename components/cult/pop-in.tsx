import type { PropsWithChildren } from "react"
import { motion } from "framer-motion"

interface MotionProps extends PropsWithChildren<{}> {
  className?: string
  delay?: number
}

function PopIn({ children, className, delay = 0 }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, type: "spring", delay: delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

PopIn.displayName = "PopIn"
export { PopIn }
