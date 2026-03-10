import { PHILOSOPHERS } from '@/lib/astrological-philosophers'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, philosopherId } = await req.json()

  const philosopher = PHILOSOPHERS.find((p) => p.id === philosopherId)

  if (!philosopher) {
    return new Response(JSON.stringify({ error: 'Philosopher not found' }), { 
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Format messages for Groq API
  const formattedMessages = messages.map((msg: any) => {
    // Handle both parts format and content format
    let content = ''
    if (msg.parts) {
      content = msg.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('')
    } else if (msg.content) {
      content = msg.content
    } else if (msg.text) {
      content = msg.text
    }
    return { role: msg.role, content }
  })

  const systemPrompt = `${philosopher.systemPrompt}\n\nYou are ${philosopher.name} (${philosopher.era}), a figure from the ${philosopher.tradition} astrological tradition. ${philosopher.description}\n\nAlways stay in character. Answer the user's question from your unique astrological and philosophical perspective. Be insightful, wise, and true to your tradition. Format your response with clear paragraphs.`

  // Call Groq API directly
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...formattedMessages,
      ],
      stream: true,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    return new Response(JSON.stringify({ error: `Groq API error: ${error}` }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Create a transform stream to convert Groq SSE to a simple text stream
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const transformStream = new TransformStream({
    async transform(chunk, controller) {
      const text = decoder.decode(chunk, { stream: true })
      const lines = text.split('\n')
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              controller.enqueue(encoder.encode(content))
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    }
  })

  return new Response(response.body?.pipeThrough(transformStream), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}
