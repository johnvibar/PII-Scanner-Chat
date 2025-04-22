import { handlePIIScan } from '@/app/lib/pii-scanner';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages, tool: toolRequest } = await req.json();

  if (toolRequest && toolRequest.name === 'scanForPII' && toolRequest.arguments) {
    try {
      const { fileData, fileName, fileType } = JSON.parse(toolRequest.arguments);
      
      const scanResults = await handlePIIScan(fileData, fileName, fileType);
      
      return Response.json({
        tool_result: {
          name: 'scanForPII',
          content: scanResults
        }
      });
    } catch (error) {
      console.error('Error during PII scan:', error);
      return Response.json({
        tool_result: {
          name: 'scanForPII',
          content: 'There was an error processing your file. Please try again.'
        }
      });
    }
  }

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