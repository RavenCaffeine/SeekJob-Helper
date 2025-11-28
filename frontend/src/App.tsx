/**
 * 主应用组件
 * 实现顶部导航栏和页面路由
 */

import React, { useState } from 'react';
import { BookOpen, MessageSquare, FileText } from 'lucide-react';
import ResumePolisher from './components/ResumePolisher';
import ChatInterface from './components/ChatInterface';
import QuestionBank from './components/QuestionBank';

type TabType = 'resume' | 'interview' | 'questions';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('resume');

  // 导航菜单配置
  const tabs = [
    {
      id: 'resume' as TabType,
      name: '简历优化',
      icon: FileText,
      description: 'AI 深度优化你的简历'
    },
    {
      id: 'interview' as TabType,
      name: '模拟面试',
      icon: MessageSquare,
      description: '与 AI 面试官进行真实对话'
    },
    {
      id: 'questions' as TabType,
      name: '八股题库',
      icon: BookOpen,
      description: '练习面试题目和知识点'
    }
  ];

  // 根据当前标签渲染对应组件
  const renderContent = () => {
    switch (activeTab) {
      case 'resume':
        return <ResumePolisher />;
      case 'interview':
        return <ChatInterface />;
      case 'questions':
        return <QuestionBank />;
      default:
        return <ResumePolisher />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo 和标题 */}
            <div className="flex items-center space-x-3">
              <div className="text-blue-600 text-2xl">
                <BookOpen />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SeekJob Helper</h1>
                <p className="text-sm text-gray-500">智能求职助手</p>
              </div>
            </div>

            {/* 导航标签 */}
            <nav className="flex space-x-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center px-5 py-2 rounded-md transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mb-1" />
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main>
        {renderContent()}
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              © 2024 SeekJob Helper. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                使用帮助
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                隐私政策
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                关于我们
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;