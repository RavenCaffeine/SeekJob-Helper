"""
Pydantic 数据验证模型
定义 API 请求和响应的数据结构
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class QuestionBase(BaseModel):
    """
    面试题基础模型，包含共享字段
    """
    question: str = Field(..., description="题目内容", min_length=1)
    answer: str = Field(..., description="标准答案", min_length=1)
    tags: Optional[str] = Field(None, description="标签，用逗号分隔")
    difficulty: Optional[str] = Field(None, description="难度级别")

class QuestionCreate(QuestionBase):
    """
    创建面试题请求模型
    """
    pass

class QuestionUpdate(QuestionBase):
    """
    更新面试题请求模型
    所有字段都是可选的，支持部分更新
    """
    question: Optional[str] = Field(None, description="题目内容", min_length=1)
    answer: Optional[str] = Field(None, description="标准答案", min_length=1)

class QuestionResponse(QuestionBase):
    """
    面试题响应模型
    包含数据库生成的字段
    """
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True  # 支持从 SQLAlchemy 模型直接转换

class ResumeOptimizeRequest(BaseModel):
    """
    简历优化请求模型
    """
    resume_text: str = Field(..., description="简历文本内容", min_length=10)
    position: Optional[str] = Field(None, description="目标职位")

class ResumeOptimizeResponse(BaseModel):
    """
    简历优化响应模型
    """
    original_resume: str
    optimized_resume: str
    suggestions: List[str]
    score: float  # 0-10分的评分

class InterviewChatRequest(BaseModel):
    """
    模拟面试对话请求模型
    """
    message: str = Field(..., description="用户消息内容")
    interview_topic: Optional[str] = Field(None, description="面试主题")
    conversation_history: Optional[List[dict]] = Field(None, description="对话历史")

class InterviewChatResponse(BaseModel):
    """
    模拟面试对话响应模型
    """
    ai_message: str
    conversation_history: List[dict]
    is_complete: bool  # 面试是否结束

class AnswerEvaluationRequest(BaseModel):
    """
    答案评估请求模型
    """
    question_id: int = Field(..., description="题目ID")
    user_answer: str = Field(..., description="用户答案内容")

class AnswerEvaluationResponse(BaseModel):
    """
    答案评估响应模型
    """
    question_id: int
    user_answer: str
    standard_answer: str
    score: float  # 0-10分的评分
    evaluation: str  # 详细评价
    suggestions: List[str]  # 改进建议