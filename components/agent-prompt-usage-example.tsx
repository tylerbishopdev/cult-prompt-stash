import { TextureCardPrimary } from "./cult/texture-card"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function PromptUsageExampleComponent({ examples }) {
  return (
    <TextureCardPrimary className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Usage Examples</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {examples.map((example, index) => (
          <Card key={index} className="border border-muted">
            <CardHeader>
              <CardTitle className="text-sm">Example {index + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Input:</h4>
                <div className="grid gap-2">
                  {Object.entries(example.input).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {key}
                      </Badge>
                      <span className="text-sm">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Output:</h4>
                <p className="text-sm bg-muted p-2 rounded-md whitespace-pre-wrap">
                  {example.output}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </TextureCardPrimary>
  )
}
