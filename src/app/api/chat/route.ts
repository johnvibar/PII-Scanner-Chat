import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });

  try {    
    const response = await streamText({
      model: openai('gpt-4o-mini'),
      messages,
    });

    return response.toDataStreamResponse();
  } catch (error) {
    console.error('Error with OpenAI request:', error);
    return Response.json({
      error: 'There was an error processing your request.'
    }, { status: 500 });
  }
}