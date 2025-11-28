/**
 * 前端 TypeScript 类型定义
 * 统一管理所有接口和数据类型
 */

// 面试题相关类型
export interface Question {
  id: number;
  question: string;
  answer: string;
  tags?: string;
  difficulty?: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionCreate {
  question: string;
  answer: string;
  tags?: string;
  difficulty?: string;
}

export interface QuestionUpdate {
  question?: string;
  answer?: string;
  tags?: string;
  difficulty?: string;
}

// 简历优化相关类型
export interface ResumeOptimizeRequest {
  resume_text: string;
  position?: string;
}

export interface ResumeOptimizeResponse {
  original_resume: string;
  optimized_resume: string;
  suggestions: string[];
  score: number;
}

// 模拟面试相关类型
export interface InterviewMessage {
  user: string;
  ai: string;
  timestamp: number;
}

export interface InterviewChatRequest {
  message: string;
  interview_topic?: string;
  conversation_history?: InterviewMessage[];
}

export interface InterviewChatResponse {
  ai_message: string;
  conversation_history: InterviewMessage[];
  is_complete: boolean;
}

// 答案评估相关类型
export interface AnswerEvaluationRequest {
  question_id: number;
  user_answer: string;
}

export interface AnswerEvaluationResponse {
  question_id: number;
  user_answer: string;
  standard_answer: string;
  score: number;
  evaluation: string;
  suggestions: string[];
}

// API 响应通用类型
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

// 应用状态相关类型
export interface AppState {
  currentTab: 'resume' | 'interview' | 'questions';
  isLoading: boolean;
  error: string | null;
}

// 对话状态相关类型
export interface ChatState {
  messages: InterviewMessage[];
  currentQuestion: string;
  isInterviewComplete: boolean;
  interviewTopic: string;
}

// 题库状态相关类型
export interface QuestionBankState {
  questions: Question[];
  currentQuestion: Question | null;
  isLoading: boolean;
  filter: {
    tags: string;
    difficulty: string;
  };
}