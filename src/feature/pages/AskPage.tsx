import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { answerKey } from './ask/answer.ts'
import { useTranslation } from '../../language/index.ts'

type ChatRole = 'user' | 'assistant'

type ChatMessage = {
    id: string
    role: ChatRole
    text: string
}

export default function AskPage() {
    const { t } = useTranslation()
    const [draft, setDraft] = useState('')
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [answering, setAnswering] = useState(false)
    const threadRef = useRef<HTMLDivElement>(null)
    const answerTimer = useRef<number | null>(null)

    useEffect(() => {
        const thread = threadRef.current
        if (!thread) return
        thread.scrollTop = thread.scrollHeight
    }, [messages, answering])

    useEffect(() => {
        return () => {
            if (answerTimer.current !== null) window.clearTimeout(answerTimer.current)
        }
    }, [])

    function ask(question: string) {
        const text = question.trim()
        if (!text || answering) return

        setDraft('')
        setAnswering(true)
        setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'user', text }])

        answerTimer.current = window.setTimeout(() => {
            setMessages((current) => [
                ...current,
                { id: crypto.randomUUID(), role: 'assistant', text: t(answerKey(text)) },
            ])
            setAnswering(false)
            answerTimer.current = null
        }, 700)
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        ask(draft)
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            ask(draft)
        }
    }

    return (
        <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
            <Box>
                <Typography variant="h4">{t('ask.emptyTitle')}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('ask.description')}
                </Typography>
            </Box>
        <Paper
            sx={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <Box
                ref={threadRef}
                aria-live="polite"
                sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}
            >
                {messages.length === 0 && !answering ? (
                    <Stack spacing={1} sx={{ height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420 }}>
                            {t('ask.emptyHint')}
                        </Typography>
                    </Stack>
                ) : (
                    <Stack spacing={1.5}>
                        {messages.map((message) => (
                            <Box
                                key={message.id}
                                sx={{
                                    maxWidth: 'min(72%, 560px)',
                                    alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                                    px: 2,
                                    py: 1.25,
                                    borderRadius: 2,
                                    whiteSpace: 'pre-wrap',
                                    bgcolor: message.role === 'user' ? 'primary.main' : 'background.default',
                                    color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                                    border: message.role === 'assistant' ? 1 : 0,
                                    borderColor: 'divider',
                                }}
                            >
                                <Typography variant="body1">{message.text}</Typography>
                            </Box>
                        ))}
                        {answering ? (
                            <Box
                                sx={{
                                    alignSelf: 'flex-start',
                                    px: 2,
                                    py: 1.25,
                                    borderRadius: 2,
                                    bgcolor: 'background.default',
                                    border: 1,
                                    borderColor: 'divider',
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    {t('ask.thinking')}
                                </Typography>
                            </Box>
                        ) : null}
                    </Stack>
                )}
            </Box>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'flex-end',
                    px: { xs: 2, sm: 3 },
                    py: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                }}
            >
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    size="medium"
                    name="question"
                    placeholder={t('ask.placeholder')}
                    value={draft}
                    disabled={answering}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button type="submit" variant="contained" size="large" disabled={answering || !draft.trim()}>
                    {t('ask.send')}
                </Button>
            </Box>
        </Paper>
        </Stack>
    )
}
