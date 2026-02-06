'use client';

import React, { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

// 添加内联CSS样式
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #fff;
  }
  
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  
  .chat-header {
    padding: 16px 24px;
    border-bottom: 1px solid #eaeaea;
    background-color: #fff;
  }
  
  .chat-header-content {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .chat-header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .ai-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #3b82f6;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
  
  .nav-buttons {
    display: flex;
    gap: 12px;
  }
  
  .nav-button {
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .nav-button:hover {
    background-color: #f3f4f6;
  }
  
  .nav-button.active {
    background-color: #f3f4f6;
  }
  
  .chat-header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .settings-button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }
  
  .settings-button:hover {
    background-color: #f3f4f6;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
  }
  
  .chat-main {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow:hidden;
  }
  
  .messages-container {
    flex: 1;
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    padding: 24px;
    overflow-y: auto;
    height: calc(100vh - 240px);
  }
  
  .welcome-screen {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    min-height: 400px;
  }
  
  .welcome-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .welcome-subtitle {
    color: #6b7280;
    margin-bottom: 24px;
  }
  
  .quick-start-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    width: 100%;
    max-width: 400px;
  }
  
  .quick-start-button {
    padding: 16px;
    border: 1px solid #eaeaea;
    border-radius: 8px;
    background: none;
    cursor: pointer;
    text-align: left;
    transition: background-color 0.2s;
  }
  
  .quick-start-button:hover {
    background-color: #f9fafb;
  }
  
  .quick-start-title {
    font-weight: 500;
    margin-bottom: 4px;
  }
  
  .quick-start-description {
    font-size: 12px;
    color: #6b7280;
  }
  
  .messages-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .message {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  
  .message.user {
    justify-content: flex-end;
  }
  
  .message.assistant {
    justify-content: flex-start;
  }
  
  .message-content {
    max-width: 80%;
  }
  
  .message-bubble {
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 4px;
  }
  
  .message.user .message-bubble {
    background-color: #dbeafe;
    color: #1e40af;
  }
  
  .message.assistant .message-bubble {
    background-color: #f3f4f6;
    color: #374151;
  }
  
  .message-time {
    font-size: 12px;
    color: #9ca3af;
  }
  
  .loading-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #6b7280;
  }
  
  .loading-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #3b82f6;
    animation: pulse 1.5s infinite;
  }
  
  .loading-dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .loading-dot:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .error-message {
    background-color: #fee2e2;
    color: #b91c1c;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #fecaca;
    margin-bottom: 16px;
  }
  
  .error-dismiss {
    background: none;
    border: none;
    color: #b91c1c;
    font-size: 12px;
    cursor: pointer;
    margin-top: 8px;
    text-decoration: underline;
  }
  
  .chat-input-area {
    border-top: 1px solid #eaeaea;
    background-color: #fff;
    padding: 16px 24px;
  }
  
  .chat-input-content {
    max-width: 800px;
    margin: 0 auto;
    border: 1px solid #eaeaea;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .input-toolbar {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  
  .toolbar-button {
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    background-color: #f3f4f6;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: background-color 0.2s;
  }
  
  .toolbar-button:hover {
    background-color: #e5e7eb;
  }
  
  .input-container {
    display: flex;
    align-items: flex-end;
    gap: 12px;
  }
  
  .input-textarea {
    flex: 1;
    min-height: 80px;
    max-height: 200px;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    resize: none;
    font-family: inherit;
    font-size: 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  
  .input-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .input-textarea:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
  
  .send-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #3b82f6;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }
  
  .send-button:hover:not(:disabled) {
    background-color: #2563eb;
  }
  
  .send-button:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }
  
  .input-footer {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 8px;
  }
`;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // 在客户端渲染后添加样式
  useEffect(() => {
    if (typeof window !== 'undefined' && !styleRef.current) {
      const styleElement = document.createElement('style');
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);
      styleRef.current = styleElement;
    }

    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, []);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息到后端API
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    // 添加用户消息到聊天记录
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      role: 'user',
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // 准备发送给API的对话历史
      const chatHistory = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();

      // 添加AI回复到聊天记录
      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newAssistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  // 处理回车键发送消息
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      {/* 顶部导航 */}
      <header className="chat-header">
        <div className="chat-header-content">
          <div className="chat-header-left">
            <div className="ai-icon">AI</div>
            <div className="nav-buttons">
              <button className="nav-button active">New Chat</button>
              <button className="nav-button">History</button>
            </div>
          </div>
          <div className="chat-header-right">
            <button className="settings-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
            <div className="user-avatar">You</div>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="chat-main">
        {/* 消息列表 - 占据剩余空间 */}
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <h2 className="welcome-title">AI Chat Assistant</h2>
              <p className="welcome-subtitle">Start a conversation with the AI assistant. Ask any question or just say hello.</p>
              <div className="quick-start-buttons">
                <button className="quick-start-button">
                  <div className="quick-start-title">What is AI?</div>
                  <div className="quick-start-description">Learn about artificial intelligence</div>
                </button>
                <button className="quick-start-button">
                  <div className="quick-start-title">Help with coding</div>
                  <div className="quick-start-description">Get assistance with programming</div>
                </button>
                <button className="quick-start-button">
                  <div className="quick-start-title">Write an email</div>
                  <div className="quick-start-description">Draft a professional email</div>
                </button>
                <button className="quick-start-button">
                  <div className="quick-start-title">General knowledge</div>
                  <div className="quick-start-description">Ask about any topic</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.role}`}>
                  {message.role === 'assistant' && (
                    <div className="ai-icon">AI</div>
                  )}
                  <div className="message-content">
                    <div className="message-bubble">
                      <div>{message.content}</div>
                    </div>
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="user-avatar">You</div>
                  )}
                </div>
              ))}
              
              {/* 加载指示器 */}
              {loading && (
                <div className="loading-indicator">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <span>Generating response...</span>
                </div>
              )}
              
              {/* 错误提示 */}
              {error && (
                <div className="error-message">
                  <div>{error}</div>
                  <button 
                    onClick={() => setError(null)}
                    className="error-dismiss"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 输入区域 - 固定在底部 */}
        <div className="chat-input-area">
          <div className="chat-input-content">
            <div className="input-toolbar">
              <button className="toolbar-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </svg>
                Deep Thinking
              </button>
              <button className="toolbar-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                Web Search
              </button>
            </div>
            <div className="input-container">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="input-textarea"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="send-button"
              >
                {loading ? (
                  <div className="loading-dot"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                )}
              </button>
            </div>
            <div className="input-footer">
              Content generated by AI, please verify carefully
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
