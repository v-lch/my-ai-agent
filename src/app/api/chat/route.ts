import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// 验证API密钥是否存在
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

// 使用智增增作为OpenAI代理
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.zhizengzeng.com/v1', // 注意：正确的属性名是baseURL，不是base_url
});

console.log('OpenAI client configured with zhizengzeng proxy');
console.log('Base URL:', openai.baseURL);

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    // 打印接收到的请求消息
    console.log('Received request:', { message });

    if (!message) {
      console.log('Error: Message is required');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // return NextResponse.json({
    //   reply: message,
    // });

    console.log('Sending request to OpenAI...');
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
    });

    // 打印OpenAI响应
    console.log('OpenAI response:', {
      model: response.model,
      usage: response.usage,
      reply: response.choices[0].message.content,
    });

    return NextResponse.json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error:', error);
    
    // 更详细的错误处理
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}