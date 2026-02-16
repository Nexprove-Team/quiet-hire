'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'

import { useCreateJob } from '@/hooks/use-jobs'
import type { CreateJobInput } from '@/actions/job-mutations'

import { Button } from '@hackhyre/ui/components/button'
import { Input } from '@hackhyre/ui/components/input'
import { Spinner } from '@hackhyre/ui/components/spinner'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@hackhyre/ui/components/card'
import { ScrollArea } from '@hackhyre/ui/components/scroll-area'
import { Microphone2, Send, TickCircle } from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'

import { VoiceChatBubble, type ChatMessage } from './voice-chat-bubble'
import { JobPreview } from './job-preview'
import { VOICE_AI_SCRIPT } from '@/lib/mock-data'

interface ConstructedJob {
  title?: string
  description?: string
  employmentType?: string
  experienceLevel?: string
  location?: string
  isRemote?: boolean
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  requirements?: string[]
  responsibilities?: string[]
  skills?: string[]
}

export function VoiceMode() {
  const router = useRouter()
  const { mutateAsync, isPending: isCreating } = useCreateJob()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [scriptIndex, setScriptIndex] = useState(0)
  const [constructedJob, setConstructedJob] = useState<ConstructedJob>({})
  const [isComplete, setIsComplete] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Send initial AI greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstScript = VOICE_AI_SCRIPT[0]
      if (firstScript) {
        setMessages([
          {
            id: 'ai-0',
            role: 'ai',
            content: firstScript.response,
          },
        ])
        setScriptIndex(1)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const processUserMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping || isComplete) return

      // Add user message
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text.trim(),
      }
      setMessages((prev) => [...prev, userMsg])
      setInput('')

      // Update constructed job based on script step
      const currentScript = VOICE_AI_SCRIPT[scriptIndex - 1]
      if (currentScript?.field) {
        const userText = text.trim()
        setConstructedJob((prev) => {
          const updated = { ...prev }
          switch (currentScript.field) {
            case 'title':
              updated.title = userText
              break
            case 'employmentType':
              if (userText.toLowerCase().includes('full'))
                updated.employmentType = 'full_time'
              else if (userText.toLowerCase().includes('part'))
                updated.employmentType = 'part_time'
              else if (userText.toLowerCase().includes('contract'))
                updated.employmentType = 'contract'
              else if (userText.toLowerCase().includes('intern'))
                updated.employmentType = 'internship'
              else updated.employmentType = 'full_time'
              break
            case 'experienceLevel':
              if (userText.toLowerCase().includes('entry'))
                updated.experienceLevel = 'entry'
              else if (userText.toLowerCase().includes('mid'))
                updated.experienceLevel = 'mid'
              else if (userText.toLowerCase().includes('senior'))
                updated.experienceLevel = 'senior'
              else if (userText.toLowerCase().includes('lead'))
                updated.experienceLevel = 'lead'
              else if (userText.toLowerCase().includes('exec'))
                updated.experienceLevel = 'executive'
              else updated.experienceLevel = 'mid'
              break
            case 'location':
              updated.location = userText
              updated.isRemote =
                userText.toLowerCase().includes('remote') ||
                userText.toLowerCase().includes('yes')
              break
            case 'salary':
              // Extract numbers from text
              const nums = userText.match(/\d[\d,]*/g)
              if (nums && nums.length >= 2) {
                updated.salaryMin = parseInt(nums[0]!.replace(/,/g, ''), 10)
                updated.salaryMax = parseInt(nums[1]!.replace(/,/g, ''), 10)
              } else if (nums && nums.length === 1) {
                const val = parseInt(nums[0]!.replace(/,/g, ''), 10)
                updated.salaryMin = val
                updated.salaryMax = Math.round(val * 1.3)
              }
              updated.salaryCurrency = 'USD'
              break
            case 'responsibilities':
              updated.responsibilities = userText
                .split(/[,;\n]/)
                .map((s) => s.trim())
                .filter(Boolean)
              break
            case 'requirements':
              updated.requirements = userText
                .split(/[,;\n]/)
                .map((s) => s.trim())
                .filter(Boolean)
              break
            case 'skills':
              updated.skills = userText
                .split(/[,;\n]/)
                .map((s) => s.trim())
                .filter(Boolean)
              break
          }
          return updated
        })
      }

      // Show typing indicator, then AI response
      setIsTyping(true)
      const nextScript = VOICE_AI_SCRIPT[scriptIndex]

      setTimeout(() => {
        setIsTyping(false)
        if (nextScript) {
          setMessages((prev) => [
            ...prev,
            {
              id: `ai-${Date.now()}`,
              role: 'ai',
              content: nextScript.response,
            },
          ])
          setScriptIndex((prev) => prev + 1)

          // Check if this is the last step
          if (scriptIndex >= VOICE_AI_SCRIPT.length - 1) {
            setIsComplete(true)
          }
        }
      }, 1500)
    },
    [scriptIndex, isTyping, isComplete]
  )

  function handleSend() {
    processUserMessage(input)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function toggleRecording() {
    if (isRecording) {
      setIsRecording(false)
      // Mock: simulate voice-to-text after "recording"
      setTimeout(() => {
        processUserMessage('Senior Full Stack Engineer')
      }, 300)
    } else {
      setIsRecording(true)
      // Auto-stop after 3 seconds (mock)
      setTimeout(() => setIsRecording(false), 3000)
    }
  }

  async function handleCreateJob() {
    try {
      await mutateAsync({
        title: constructedJob.title ?? 'Untitled Job',
        description: constructedJob.description ?? '',
        employmentType: constructedJob.employmentType as CreateJobInput['employmentType'],
        experienceLevel: constructedJob.experienceLevel as CreateJobInput['experienceLevel'],
        location: constructedJob.location,
        isRemote: constructedJob.isRemote,
        salaryMin: constructedJob.salaryMin,
        salaryMax: constructedJob.salaryMax,
        salaryCurrency: constructedJob.salaryCurrency,
        requirements: constructedJob.requirements,
        responsibilities: constructedJob.responsibilities,
        skills: constructedJob.skills,
        status: 'draft',
      })
      toast.success('Job created!', {
        description: `"${constructedJob.title}" has been saved as a draft.`,
      })
      router.push('/recuriter/jobs')
    } catch (error) {
      toast.error('Failed to create job', {
        description: error instanceof Error ? error.message : 'Something went wrong',
      })
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Chat panel */}
      <div className="lg:col-span-3">
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Voice Conversation
            </CardTitle>
            <CardDescription>
              Talk to our AI to build your job listing step by step
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 px-4">
            <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
              <div className="space-y-4 py-2">
                {messages.map((msg) => (
                  <VoiceChatBubble key={msg.id} message={msg} />
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-muted-foreground flex items-center gap-2 text-sm"
                  >
                    <Spinner className="h-4 w-4" />
                    AI is thinking...
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="border-t pt-4">
            <div className="flex w-full items-center gap-2">
              <Button
                type="button"
                variant={isRecording ? 'destructive' : 'outline'}
                size="icon"
                className={cn('shrink-0', isRecording && 'animate-pulse')}
                onClick={toggleRecording}
                disabled={isTyping || isComplete}
              >
                <Microphone2
                  size={18}
                  variant={isRecording ? 'Bold' : 'Linear'}
                />
              </Button>

              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isComplete ? 'Conversation complete' : 'Type your response...'
                }
                disabled={isTyping || isComplete}
                className="flex-1"
              />

              <Button
                type="button"
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isTyping || isComplete}
              >
                <Send size={18} variant="Bold" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Preview panel */}
      <div className="space-y-4 lg:col-span-2">
        <JobPreview data={constructedJob} />

        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button className="w-full" size="lg" onClick={handleCreateJob} disabled={isCreating}>
                {isCreating ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <TickCircle size={18} variant="Bold" className="mr-2" />
                )}
                {isCreating ? 'Creating...' : 'Create Job'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
