/**
 * 模拟面试聊天界面组件
 * 提供与 AI 面试官的对话功能，支持代码高亮
 */

import React, { useState, useRef, useEffect } from 'react';
import { interviewApi } from '../api';
import { InterviewMessage } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [interviewTopic, setInterviewTopic] = useState('全栈开发工程师');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 开始新面试
  const startNewInterview = () => {
    setMessages([]);
    setInputMessage('');
    setIsComplete(false);
    setIsLoading(false);

    // 发送初始问候
    const initialMessage: InterviewMessage = {
      user: '你好，我准备好开始面试了',
      ai: `你好！欢迎参加今天的面试。我将担任你的技术面试官，面试主题是"${interviewTopic}"。首先，请简单介绍一下你自己。`,
      timestamp: Date.now()
    };

    setMessages([initialMessage]);
  };

  // 处理发送消息
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading || isComplete) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // 添加用户消息到列表
    const updatedMessages = [
      ...messages,
      { user: userMessage, ai: '', timestamp: Date.now() }
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // 调用 API 获取 AI 回复
      const response = await interviewApi.chat({
        message: userMessage,
        interview_topic: interviewTopic,
        conversation_history: messages
      });

      // 更新消息列表
      setMessages(response.conversation_history);
      setIsComplete(response.is_complete);

      // 如果面试结束，显示提示
      if (response.is_complete) {
        setTimeout(() => {
          alert('面试已结束！感谢你的参与。');
        }, 1000);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '发送消息失败');
      // 回滚用户消息
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  // 渲染消息内容（支持 Markdown 和代码高亮）
  const renderMessageContent = (content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node = {}, inline = false, className, children = '', ...props }: {
            node?: any;
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
            [key: string]: any;
          }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            if (!inline && language) {
              return (
                <SyntaxHighlighter
                  style={(isDarkMode ? vscDarkPlus : vs) as any}
                  language={language}
                  PreTag="div"
                  className="rounded-md my-2 text-sm"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }

            return (
              <code className={`${className} bg-gray-100 rounded px-1 py-0.5 text-sm`} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">模拟技术面试</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={startNewInterview}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              开始新面试
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="topic" className="text-sm font-medium text-gray-700">
            面试主题：
          </label>
          <input
            type="text"
            id="topic"
            value={interviewTopic}
            onChange={(e) => setInterviewTopic(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 聊天消息区域 */}
      <div className={`flex-1 overflow-y-auto mb-4 rounded-lg shadow-md p-4 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50'
      }`}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <h3 className="text-lg font-medium mb-2">准备开始面试</h3>
            <p>点击"开始新面试"按钮开始你的技术面试之旅</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${index === 0 ? 'justify-center' : 'justify-start'} mb-4`}>
                {index > 0 && (
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    msg.user && !msg.ai ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {msg.user && !msg.ai ? '我' : 'AI'}
                  </div>
                )}
                <div className={`max-w-3xl mx-2 p-3 rounded-lg shadow-sm ${
                  msg.user && !msg.ai
                    ? 'bg-blue-500 text-white ml-3'
                    : 'bg-white text-gray-800 dark:bg-gray-700 dark:text-white mr-3'
                }`}>
                  {index === 0 ? (
                    <div className="text-center">
                      <div className="text-2xl mb-2">🤖</div>
                      {renderMessageContent(msg.ai)}
                    </div>
                  ) : msg.user && !msg.ai ? (
                    msg.user
                  ) : (
                    renderMessageContent(msg.ai || '')
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-2">
                  AI
                </div>
                <div className="bg-white text-gray-800 dark:bg-gray-700 dark:text-white p-3 rounded-lg shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 输入区域 */}
      {!isComplete && (
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="输入你的回答..."
            rows={1}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            style={{ maxHeight: '120px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            发送
          </button>
        </form>
      )}

      {isComplete && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
          <h3 className="text-green-800 font-medium">面试已结束</h3>
          <p className="text-green-700 text-sm mt-1">感谢你的参与！点击"开始新面试"可以再次练习。</p>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;