'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowLeft } from '@hackhyre/ui/icons'
import { Loader2 } from 'lucide-react'
import { clearOnboardingCookie } from '@/actions/onboarding'
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@hackhyre/ui/components/ai-elements/message'
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputFooter,
} from '@hackhyre/ui/components/ai-elements/prompt-input'

interface AiChatModeProps {
  userName: string
  onBack: () => void
}

function getTextFromParts(
  parts: Array<{ type: string; text?: string }>
): string {
  return parts
    .filter((p) => p.type === 'text' && p.text)
    .map((p) => p.text!)
    .join('')
}

export function AiChatMode({ userName, onBack }: AiChatModeProps) {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/onboarding/api/chat',
    }),
    onToolCall({ toolCall }) {
      if (toolCall.toolName === 'markOnboardingComplete') {
        clearOnboardingCookie().then(() => {
          router.push('/dashboard')
        })
      }
    },
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const didInit = useRef(false)
  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    sendMessage({
      text: `Hi, my name is ${userName}. I'd like to set up my profile.`,
    })
  }, [userName, sendMessage])

  const visibleMessages = messages.filter((m) => {
    if (m.role !== 'user' && m.role !== 'assistant') return false
    const text = getTextFromParts(
      m.parts as Array<{ type: string; text?: string }>
    )
    return text.length > 0
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col"
    >
      <div className="flex items-center gap-3 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50 flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
        >
          <ArrowLeft size={18} variant="Linear" />
        </button>
        <div className="space-y-0.5">
          <h2 className="font-mono text-lg font-bold tracking-tight">
            Chat with Hyre
          </h2>
          <p className="text-muted-foreground text-xs">
            AI-powered profile setup
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-6 overflow-y-auto px-1 pr-2"
      >
        <motion.div className="flex flex-col gap-6">
          {visibleMessages.map((message) => {
            const content = getTextFromParts(
              message.parts as Array<{ type: string; text?: string }>
            )
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Message from={message.role as 'user' | 'assistant'}>
                  <MessageContent>
                    <MessageResponse>{content}</MessageResponse>
                  </MessageContent>
                </Message>
              </motion.div>
            )
          })}
          {isLoading &&
            visibleMessages[visibleMessages.length - 1]?.role === 'user' && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Message from="assistant">
                  <MessageContent className="flex flex-row items-center gap-2">
                    <Loader2 className="text-muted-foreground size-3.5 animate-spin" />
                    <span className="text-muted-foreground">
                      Hyre is thinking...
                    </span>
                  </MessageContent>
                </Message>
              </motion.div>
            )}
        </motion.div>
      </div>

      <div className="pt-4">
        <PromptInput
          onSubmit={({ text }) => {
            if (!text.trim()) return
            sendMessage({ text })
          }}
          className="border-t-0"
        >
          <PromptInputTextarea placeholder="Type your message..." />
          <PromptInputFooter>
            <div />
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </motion.div>
  )
}
