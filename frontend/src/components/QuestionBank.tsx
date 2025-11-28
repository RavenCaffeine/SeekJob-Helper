/**
 * 八股文题库组件
 * 提供题库管理和随机刷题功能
 */

import React, { useState, useEffect } from 'react';
import { questionApi } from '../api';
import { Question, AnswerEvaluationResponse } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

const QuestionBank: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<AnswerEvaluationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'practice'>('list');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    answer: '',
    tags: '',
    difficulty: ''
  });
  const [filter, setFilter] = useState({
    tags: '',
    difficulty: ''
  });

  // 加载题目列表
  useEffect(() => {
    if (viewMode === 'list') {
      loadQuestions();
    }
  }, [viewMode, filter]);

  const loadQuestions = async () => {
    setIsLoading(true);
    setError('');

    try {
      const params: any = {};
      if (filter.tags) params.tags = filter.tags;
      if (filter.difficulty) params.difficulty = filter.difficulty;

      const data = await questionApi.getQuestions(params);
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载题目失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 获取随机题目
  const getRandomQuestion = async () => {
    setIsLoading(true);
    setError('');
    setEvaluation(null);
    setUserAnswer('');

    try {
      const params: any = {};
      if (filter.tags) params.tags = filter.tags;
      if (filter.difficulty) params.difficulty = filter.difficulty;

      const question = await questionApi.getRandomQuestion(params);
      setCurrentQuestion(question);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取题目失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 提交答案
  const submitAnswer = async () => {
    if (!currentQuestion || !userAnswer.trim()) {
      setError('请输入答案');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await questionApi.evaluateAnswer(currentQuestion.id, {
        question_id: currentQuestion.id,
        user_answer: userAnswer
      });
      setEvaluation(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交答案失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 添加新题目
  const addQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newQuestion.question.trim() || !newQuestion.answer.trim()) {
      setError('请填写题目和答案');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await questionApi.createQuestion(newQuestion);
      setNewQuestion({ question: '', answer: '', tags: '', difficulty: '' });
      setShowAddForm(false);
      loadQuestions(); // 重新加载题目列表
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加题目失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 删除题目
  const deleteQuestion = async (id: number) => {
    if (!window.confirm('确定要删除这道题目吗？')) return;

    setIsLoading(true);
    setError('');

    try {
      await questionApi.deleteQuestion(id);
      loadQuestions(); // 重新加载题目列表
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除题目失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 渲染题目内容
  const renderQuestionContent = (content: string) => {
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
                  style={vscDarkPlus as any}
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

  // 难度标签样式
  const getDifficultyClass = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case '简单':
        return 'bg-green-100 text-green-800';
      case '中等':
        return 'bg-yellow-100 text-yellow-800';
      case '困难':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">八股文题库</h1>

      {/* 模式切换 */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-md ${
            viewMode === 'list'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } transition-colors`}
        >
          题库管理
        </button>
        <button
          onClick={() => setViewMode('practice')}
          className={`px-4 py-2 rounded-md ${
            viewMode === 'practice'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } transition-colors`}
        >
          随机刷题
        </button>
      </div>

      {/* 筛选条件 */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="标签筛选（逗号分隔）"
          value={filter.tags}
          onChange={(e) => setFilter({ ...filter, tags: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filter.difficulty}
          onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">全部难度</option>
          <option value="简单">简单</option>
          <option value="中等">中等</option>
          <option value="困难">困难</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6 text-red-700">
          {error}
        </div>
      )}

      {/* 题库管理模式 */}
      {viewMode === 'list' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">题目列表</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              {showAddForm ? '取消' : '+ 添加题目'}
            </button>
          </div>

          {/* 添加题目表单 */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">添加新题目</h3>
              <form onSubmit={addQuestion}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">题目</label>
                  <textarea
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    placeholder="输入题目内容..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">答案</label>
                  <textarea
                    value={newQuestion.answer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                    placeholder="输入标准答案..."
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
                    <input
                      type="text"
                      value={newQuestion.tags}
                      onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                      placeholder="例如：JavaScript,算法"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">难度</label>
                    <select
                      value={newQuestion.difficulty}
                      onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">请选择难度</option>
                      <option value="简单">简单</option>
                      <option value="中等">中等</option>
                      <option value="困难">困难</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? '添加中...' : '添加题目'}
                </button>
              </form>
            </div>
          )}

          {/* 题目列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">加载中...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                <h3 className="text-lg font-medium mb-2">暂无题目</h3>
                <p>点击"添加题目"按钮开始添加题目</p>
              </div>
            ) : (
              questions.map((question) => (
                <div key={question.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold flex-1">{renderQuestionContent(question.question)}</h3>
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                  {question.tags && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {question.tags.split(',').map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  {question.difficulty && (
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyClass(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 刷题模式 */}
      {viewMode === 'practice' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">随机刷题</h2>
            <button
              onClick={getRandomQuestion}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '加载中...' : '换一道题'}
            </button>
          </div>

          {!currentQuestion ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-lg font-medium mb-4">开始刷题</h3>
              <p className="mb-6 text-gray-600">点击"换一道题"按钮开始你的刷题之旅</p>
              <button
                onClick={getRandomQuestion}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition-colors"
              >
                开始刷题
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 题目显示 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  {currentQuestion.tags && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {currentQuestion.tags.split(',').map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  {currentQuestion.difficulty && (
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyClass(currentQuestion.difficulty)}`}>
                      {currentQuestion.difficulty}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-4">题目：</h3>
                <div className="text-lg leading-relaxed">{renderQuestionContent(currentQuestion.question)}</div>
              </div>

              {/* 答案输入 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">你的答案：</h3>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="输入你的答案..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm mb-4"
                />
                <button
                  onClick={submitAnswer}
                  disabled={isLoading || !userAnswer.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? '提交中...' : '提交答案'}
                </button>
              </div>

              {/* 答案评估 */}
              {evaluation && (
                <div className="space-y-4">
                  {/* 评分 */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-2">评分</h3>
                    <div className={`text-4xl font-bold ${evaluation.score >= 8 ? 'text-green-600' : evaluation.score >= 6 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {evaluation.score.toFixed(1)}
                      <span className="text-lg text-gray-500 ml-2">/ 10</span>
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <h4 className="font-medium mb-2">评价：</h4>
                      <p>{evaluation.evaluation}</p>
                    </div>
                  </div>

                  {/* 建议 */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-3">改进建议</h3>
                    <ul className="space-y-2">
                      {evaluation.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 答案对比 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold mb-3">你的答案</h3>
                      <div className="bg-gray-50 p-4 rounded-md font-mono text-sm max-h-64 overflow-y-auto">
                        {evaluation.user_answer}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold mb-3 text-green-600">标准答案</h3>
                      <div className="bg-gray-50 p-4 rounded-md font-mono text-sm max-h-64 overflow-y-auto">
                        {renderQuestionContent(evaluation.standard_answer)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionBank;