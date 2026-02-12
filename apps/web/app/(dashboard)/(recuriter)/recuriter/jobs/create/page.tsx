"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@hackhyre/ui/components/tabs";
import { Microphone2, DocumentText, Magicpen } from "@hackhyre/ui/icons";

import { VoiceMode } from "@/components/jobs/create/voice-mode";
import { FormMode } from "@/components/jobs/create/form-mode";
import { AIPasteMode } from "@/components/jobs/create/ai-paste-mode";

export default function CreateJobPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono text-2xl font-bold tracking-tight">
          Create a Job
        </h1>
        <p className="text-muted-foreground text-sm">
          Choose how you&apos;d like to create your listing
        </p>
      </div>

      <Tabs defaultValue="voice">
        <TabsList variant="line" className="mb-6">
          <TabsTrigger value="voice" className="gap-1.5">
            <Microphone2 size={16} variant="Linear" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="form" className="gap-1.5">
            <DocumentText size={16} variant="Linear" />
            Form
          </TabsTrigger>
          <TabsTrigger value="paste" className="gap-1.5">
            <Magicpen size={16} variant="Linear" />
            AI Paste
          </TabsTrigger>
        </TabsList>

        <TabsContent value="voice">
          <VoiceMode />
        </TabsContent>
        <TabsContent value="form">
          <FormMode />
        </TabsContent>
        <TabsContent value="paste">
          <AIPasteMode />
        </TabsContent>
      </Tabs>
    </div>
  );
}
