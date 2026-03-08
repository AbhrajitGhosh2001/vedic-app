import { PHILOSOPHERS } from '@/lib/astrological-philosophers'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages, philosopherId } = body

    if (!philosopherId) {
      return new Response(JSON.stringify({ error: 'philosopherId is required' }), { status: 400 })
    }

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages are required' }), { status: 400 })
    }

    const philosopher = PHILOSOPHERS.find((p) => p.id === philosopherId)

    if (!philosopher) {
      return new Response(JSON.stringify({ error: 'Philosopher not found' }), { status: 404 })
    }

    // Call Groq API directly
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `${philosopher.systemPrompt}\n\nYou are ${philosopher.name} (${philosopher.era}), a figure from the ${philosopher.tradition} astrological tradition. ${philosopher.description}\n\nAlways stay in character. Answer the user's question from your unique astrological and philosophical perspective. Be insightful, wise, and true to your tradition. Format your response with clear paragraphs.`,
          },
          ...messages,
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!groqResponse.ok) {
      const error = await groqResponse.json()
      return new Response(JSON.stringify({ error: error.error?.message || 'Groq API error' }), { status: 500 })
    }

    // Stream the response directly to the client
    return new Response(groqResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('[v0] Error in philosopher-chat:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }
}
