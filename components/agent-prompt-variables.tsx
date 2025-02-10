import { TextureCardPrimary } from "./cult/texture-card"
import { Badge } from "./ui/badge"
import { CardContent, CardHeader, CardTitle } from "./ui/card"

export function AgentPromptVariables({ inputVariables }) {
  return (
    <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
      <TextureCardPrimary>
        <CardHeader>
          <CardTitle className="text-lg ">Prompt Input Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 pl-2">
            <ul className=" list-disc flex gap-2 flex-wrap">
              {inputVariables.map((variable) => (
                <li className=" list-none" key={variable.name}>
                  <Badge
                    className="bg-transparent p-0 m-0 border border-black/10 dark:border-white/10"
                    variant="outline"
                  >
                    <span className="bg-black/80 dark:bg-black dark:text-white py-1 px-3 text-accent rounded-l-full">
                      var
                    </span>
                    <p className=" text-primary hover:bg-primary/80 py-1 pl-1 pr-3 rounded-r-full">
                      &#123;{variable.name}&#125;
                    </p>
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </TextureCardPrimary>
    </div>
  )
}
