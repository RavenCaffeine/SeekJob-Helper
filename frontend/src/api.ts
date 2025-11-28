/**
 * API 请求封装
 * 使用 Axios 封装所有后端 API 调用
 */

import axios from 'axios';
import {
  Question,
  QuestionCreate,
  QuestionUpdate,
  ResumeOptimizeRequest,
  ResumeOptimizeResponse,
  InterviewChatRequest,
  InterviewChatResponse,
  AnswerEvaluationRequest,
  AnswerEvaluationResponse
} from './types';

// 创建 Axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8001/api',  // 后端 API 基础地址
  timeout: 30000,  // 30秒超时
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 可以在这里添加认证信息等
api.interceptors.request.use(
  (config) => {
    // 可以添加认证 token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一处理响应
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 统一处理错误
    let errorMessage = '请求失败';

    if (error.response) {
      // 服务器返回错误
      errorMessage = error.response.data.detail || error.response.statusText;
    } else if (error.request) {
      // 请求发送但没有收到响应
      errorMessage = '网络连接失败，请检查网络设置';
    } else {
      // 请求配置错误
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

// 简历优化相关 API
export const resumeApi = {
  /**
   * 优化简历
   */
  optimizeResume: (data: ResumeOptimizeRequest): Promise<ResumeOptimizeResponse> => {
    return api.post('/resume/optimize', data);
  },
};

// 模拟面试相关 API
export const interviewApi = {
  /**
   * 面试对话
   */
  chat: (data: InterviewChatRequest): Promise<InterviewChatResponse> => {
    return api.post('/interview/chat', data);
  },
};

// 题库管理相关 API
export const questionApi = {
  /**
   * 获取题目列表
   */
  getQuestions: (params?: {
    skip?: number;
    limit?: number;
    tags?: string;
    difficulty?: string;
  }): Promise<Question[]> => {
    return api.get('/questions/', { params });
  },

  /**
   * 获取随机题目
   */
  getRandomQuestion: (params?: {
    tags?: string;
    difficulty?: string;
  }): Promise<Question> => {
    return api.get('/questions/random/', { params });
  },

  /**
   * 根据ID获取题目
   */
  getQuestion: (id: number): Promise<Question> => {
    return api.get(`/questions/${id}`);
  },

  /**
   * 创建题目
   */
  createQuestion: (data: QuestionCreate): Promise<Question> => {
    return api.post('/questions/', data);
  },

  /**
   * 更新题目
   */
  updateQuestion: (id: number, data: QuestionUpdate): Promise<Question> => {
    return api.put(`/questions/${id}`, data);
  },

  /**
   * 删除题目
   */
  deleteQuestion: (id: number): Promise<void> => {
    return api.delete(`/questions/${id}`);
  },

  /**
   * 评估答案
   */
  evaluateAnswer: (id: number, data: AnswerEvaluationRequest): Promise<AnswerEvaluationResponse> => {
    return api.post(`/questions/${id}/evaluate`, data);
  },
};

// 健康检查 API
export const healthApi = {
  checkHealth: (): Promise<{ message: string; version: string; docs: string }> => {
    return api.get('/');
  },
};

export default api;