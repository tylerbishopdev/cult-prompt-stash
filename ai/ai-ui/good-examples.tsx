"use client"

import React from "react"
import Balancer from "react-wrap-balancer"

import TextureCard, { TextureCardContent } from "@/components/cult/texture-card"
import { BotCard } from "@/components/message"

interface Example {
  type?: string
  topic?: string
  prompt?: string
}

interface GoodPromptExamplesCardProps {
  examples: Example[]
}

export const GoodPromptExamplesCard: React.FC<GoodPromptExamplesCardProps> = ({
  examples,
}) => {
  return (
    <BotCard className="px-1 py-1">
      <TextureCard className="font-sans bg-card">
        <TextureCardContent className=" p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Good Prompt Examples</h2>
          <ul className="space-y-6">
            {examples.map((example, index) => (
              <li key={index}>
                <div className="mb-2">
                  <span className="font-bold">Type:</span> {example.type}
                </div>
                <div className="mb-2">
                  <span className="font-bold">Topic:</span> {example.topic}
                </div>

                <p className=" p-2 rounded-md bg-black text-lime-100">
                  <Balancer>{example.prompt}</Balancer>
                </p>
              </li>
            ))}
          </ul>
        </TextureCardContent>
      </TextureCard>
    </BotCard>
  )
}
