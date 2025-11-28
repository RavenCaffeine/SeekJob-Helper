/**
 * 简历优化组件
 * 提供简历文本输入和优化结果展示功能
 */

import React, { useState } from 'react';
import { resumeApi } from '../api';
import { ResumeOptimizeResponse } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const ResumePolisher: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [position, setPosition] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResumeOptimizeResponse | null>(null);
  const [error, setError] = useState('');

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeText.trim()) {
      setError('请输入简历内容');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await resumeApi.optimizeResume({
        resume_text: resumeText,
        position: position.trim() || undefined
      });

      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '简历优化失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 计算评分颜色
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">简历深度优化</h1>

      {/* 输入表单 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">输入简历信息</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              目标职位（可选）
            </label>
            <input
              type="text"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="例如：全栈开发工程师"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="resumeText" className="block text-sm font-medium text-gray-700 mb-1">
              简历内容
            </label>
            <textarea
              id="resumeText"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="请输入您的简历内容，或粘贴完整简历文本..."
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !resumeText.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '优化中...' : '开始优化'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* 优化结果 */}
      {result && (
        <div className="space-y-6">
          {/* 评分 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">优化评分</h3>
            <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
              {result.score.toFixed(1)}
              <span className="text-lg text-gray-500 ml-2">/ 10</span>
            </div>
          </div>

          {/* 优化建议 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">优化建议</h3>
            <ul className="space-y-2">
              {result.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 简历对比 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 原始简历 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3">原始简历</h3>
              <div className="bg-gray-50 p-4 rounded-md font-mono text-sm max-h-96 overflow-y-auto">
                {result.original_resume}
              </div>
            </div>

            {/* 优化后简历 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3 text-green-600">优化后简历</h3>
              <div className="bg-gray-50 p-4 rounded-md font-mono text-sm max-h-96 overflow-y-auto">
                {result.optimized_resume}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="bg-blue-50 rounded-lg p-4 mt-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">使用提示</h3>
        <p className="text-sm text-blue-800">
          • 请输入完整的简历文本，包含教育背景、工作经历、项目经验等<br />
          • 提供目标职位可以获得更精准的优化建议<br />
          • AI 将基于 STAR 法则和行业最佳实践进行优化<br />
          • 优化结果仅供参考，建议结合个人实际情况调整
        </p>
      </div>
    </div>
  );
};

export default ResumePolisher;