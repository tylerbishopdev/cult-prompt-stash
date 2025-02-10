import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-black/10 dark:border-white/10 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

// export interface TextareaTemplateProps
//   extends React.HTMLAttributes<HTMLDivElement> {
//   value?: string;
//   onValueChange?: (value: string) => void;
//   editable?: boolean;
// }
export interface TextareaTemplateProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string
  onValueChange?: (value: string) => void
  editable?: boolean
}

// const TextareaTemplate = React.forwardRef<
//   HTMLTextAreaElement,
//   TextareaTemplateProps
// >(
//   (
//     { className, value = "", onValueChange, editable = true, ...props },
//     ref
//   ) => {
//     const highlightedValueRef = React.useRef<HTMLDivElement>(null);

//     const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//       const newValue = e.target.value;
//       if (onValueChange) {
//         onValueChange(newValue);
//       }
//     };

//     const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
//       if (highlightedValueRef.current) {
//         highlightedValueRef.current.scrollTop = e.currentTarget.scrollTop;
//       }
//     };

//     const renderHighlightedValue = () => {
//       const parts = value.split(/(\{[\w\s]+\})/);
//       return parts.map((part, index) => {
//         if (part.startsWith("{") && part.endsWith("}")) {
//           return (
//             <span key={index} style={{ color: "blue" }}>
//               {part}
//             </span>
//           );
//         }
//         return part;
//       });
//     };

//     return (
//       <div
//         className={cn(
//           "w-full rounded-md border relative border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//           className
//         )}
//       >
//         <textarea
//           ref={ref}
//           value={value}
//           onChange={handleChange}
//           onScroll={handleScroll}
//           readOnly={!editable}
//           {...props}
//           className="w-full resize-none bg-transparent text-transparent outline-none relative z-10"
//           style={{ height: "auto", overflowY: "hidden" }}
//           rows={1}
//         />
//         <div
//           ref={highlightedValueRef}
//           className="pointer-events-none absolute inset-0 overflow-auto whitespace-pre-wrap"
//         >
//           {renderHighlightedValue()}
//         </div>
//       </div>
//     );
//   }
// );

const TextareaTemplate = React.forwardRef<
  HTMLTextAreaElement,
  TextareaTemplateProps
>(
  (
    { className, value = "", onValueChange, editable = true, ...props },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      if (onValueChange) {
        onValueChange(newValue)
      }
    }

    const highlightVariables = (text: string) => {
      return text.replace(/\{(\w+)\}/g, (match, variable) => `{${variable}}`)
    }

    const highlightedValue = highlightVariables(value)

    return (
      <textarea
        ref={ref}
        value={highlightedValue}
        onChange={handleChange}
        readOnly={!editable}
        {...props}
        className={cn(
          "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{
          ...props.style,
          overflowY: "auto",
          resize: "vertical",
          whiteSpace: "pre-wrap",
          color: "transparent",
          backgroundImage: `linear-gradient(to bottom, black 0%, black 100%)`,
          backgroundAttachment: "local",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
        }}
      />
    )
  }
)

TextareaTemplate.displayName = "TextareaTemplate"

TextareaTemplate.displayName = "TextareaTemplate"
export { Textarea, TextareaTemplate }
