'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowLeft, Send } from '@hackhyre/ui/icons'
import { Loader2 } from 'lucide-react'
import { Button } from '@hackhyre/ui/components/button'
import { Input } from '@hackhyre/ui/components/input'
import { clearOnboardingCookie } from '@/actions/onboarding'
import { OnboardingChatBubble } from './onboarding-chat-bubble'

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
  const [inputValue, setInputValue] = useState('')

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/onboarding/api/chat',
    }),
    onToolCall({ toolCall }) {
      if (toolCall.toolName === 'markOnboardingComplete') {
        clearOnboardingCookie().then(() => {
          router.push('/')
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

  // Send an initial greeting once on mount
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return
    sendMessage({ text: inputValue })
    setInputValue('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex h-130 flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5"
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

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pr-1">
        {visibleMessages.map((message) => (
          <OnboardingChatBubble
            key={message.id}
            role={message.role as 'user' | 'assistant'}
            content={getTextFromParts(
              message.parts as Array<{ type: string; text?: string }>
            )}
          />
        ))}
        {isLoading &&
          visibleMessages[visibleMessages.length - 1]?.role === 'user' && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Hyre is thinking...
            </div>
          )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex items-center gap-2 border-t pt-4"
      >
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !inputValue.trim()}
        >
          <Send size={18} variant="Bold" />
        </Button>
      </form>
    </motion.div>
  )
}
