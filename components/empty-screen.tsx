"use client"

import { useState } from "react"
import { ArrowRight, Database, Key, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { GradientHeading } from "./cult/gradient-heading"
import {
  TextureCard,
  TextureCardContent,
  TextureCardHeader,
} from "./cult/texture-card"

export function EmptyScreen() {
  const [activeTab, setActiveTab] = useState("about")

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <TextureCard className="px-2">
        <TextureCardHeader className="px-4">
          <GradientHeading className="text-left" size="xs" weight="semi">
            Cult Prompt Stash
          </GradientHeading>
        </TextureCardHeader>
        <TextureCardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 max-w-sm">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-4">
              <p className="text-foreground/90 text-base">
                Prompt Stash is a local-first template built for storing and
                crafting prompts. Inspired by the anthropic prompt eval tool.
              </p>
            </TabsContent>
            <TabsContent value="features" className="mt-4">
              <ul className="space-y-2">
                {[
                  "Local storage for all your prompts",
                  "Test prompts with your OpenAI key",
                  "Leverage powerful agent tools",
                  "Craft and refine your prompts easily",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <ArrowRight className="h-4 w-4 size-4 text-muted-foreground" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="security" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Lock className="size-4 text-muted-foreground" />
                  <p>Your data never leaves your browser</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Key className="size-4 text-muted-foreground" />
                  <p>API keys are encrypted in local storage</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="size-4 text-muted-foreground" />
                  <p>Decryption happens only when needed</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </TextureCardContent>
      </TextureCard>
    </div>
  )
}
