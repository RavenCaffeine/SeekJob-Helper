"""
FastAPI 主应用程序
配置应用和定义 API 路由
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import List, Optional
import random
import time

# 导入本地模块
import models, schemas, crud

# 数据库配置 - 使用 SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./seekjob.db"
# 注意：SQLite 不需要多线程，所以设置 check_same_thread=False
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建数据库表
models.Base.metadata.create_all(bind=engine)

# 初始化 FastAPI 应用
app = FastAPI(
    title="SeekJob Helper API",
    description="智能求职助手 API",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc"  # ReDoc
)

# CORS 配置 - 允许前端访问
origins = [
    "http://localhost:5173",  # Vite 默认端口
    "http://localhost:3000",  # React 默认端口（备选）
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据库依赖
def get_db():
    """
    获取数据库会话的依赖函数
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 模拟 LLM 调用的工具函数
def mock_llm_call(prompt: str, max_tokens: int = 1000) -> str:
    """
    模拟 LLM API 调用的函数
    在实际应用中，这里应该调用真实的 OpenAI API 或其他 LLM API
    """
    # 模拟处理延迟
    time.sleep(0.5)

    # 根据输入内容返回不同的模拟响应
    if "简历" in prompt or "resume" in prompt.lower():
        return """
**优化建议：**
1. **工作经历量化**：建议使用具体数字替代模糊描述，例如"负责项目开发"改为"参与3个企业级项目开发，提升系统性能25%"
2. **STAR 法则应用**：在描述项目经验时，采用 Situation-Task-Action-Result 结构
3. **关键词优化**：增加"微服务架构"、"持续集成"等技术关键词
4. **技能分类**：将技能按技术栈分类（前端、后端、数据库等）

**优化后简历片段：**
"在XX公司担任全栈开发工程师期间，参与3个企业级项目开发，采用微服务架构，使用React + Node.js技术栈，通过引入自动化测试，将BUG率降低30%，系统性能提升25%。"
        """.strip()

    elif "面试" in prompt or "interview" in prompt.lower():
        interview_questions = [
            "请详细描述你在项目中遇到的最大技术挑战是什么，你是如何解决的？",
            "你对RESTful API设计原则有什么理解？请举例说明。",
            "在团队协作中，你如何处理与其他成员的技术分歧？",
            "请解释什么是 closures（闭包），并说明它的使用场景和优缺点。"
        ]
        return random.choice(interview_questions)

    elif "回答" in prompt or "评估" in prompt or "answer" in prompt.lower():
        evaluations = [
            {
                "score": 8.5,
                "evaluation": "回答整体不错，涵盖了大部分要点，但在细节方面可以进一步优化。",
                "suggestions": ["可以增加具体的技术实现细节", "建议结合实际项目案例说明", "注意术语的准确性"]
            },
            {
                "score": 7.0,
                "evaluation": "回答基本正确，但深度不够，缺乏实践经验的体现。",
                "suggestions": ["需要更深入地解释技术原理", "建议增加项目中的实际应用场景", "注意回答的条理性"]
            }
        ]
        eval_result = random.choice(evaluations)
        return f"评分：{eval_result['score']}/10\n评价：{eval_result['evaluation']}\n建议：{eval_result['suggestions']}"

    else:
        return "这是一个模拟的LLM响应。在实际应用中，这里会返回真实的AI生成内容。"

# 简历优化 API
@app.post("/api/resume/optimize", response_model=schemas.ResumeOptimizeResponse)
def optimize_resume(request: schemas.ResumeOptimizeRequest, db: Session = Depends(get_db)):
    """
    简历优化接口
    - 接收简历文本和目标职位
    - 返回优化后的简历和建议
    """
    try:
        # 构建 LLM 提示词
        prompt = f"""
请分析以下简历并基于 STAR 法则提供优化建议：

目标职位：{request.position or '未指定'}

简历内容：
{request.resume_text}

请提供：
1. 优化后的简历文本
2. 具体的改进建议（至少3点）
3. 评分（0-10分）
        """.strip()

        # 调用 LLM（这里使用模拟函数）
        llm_response = mock_llm_call(prompt)

        # 解析 LLM 响应（这里简化处理，实际应用中需要更智能的解析）
        optimized_resume = request.resume_text  # 实际应用中应该是 LLM 生成的内容
        suggestions = [
            "建议使用具体数字量化工作成果",
            "采用 STAR 法则描述项目经验",
            "增加相关技术关键词",
            "优化技能列表的分类"
        ]
        score = round(random.uniform(6.5, 9.5), 1)

        return schemas.ResumeOptimizeResponse(
            original_resume=request.resume_text,
            optimized_resume=optimized_resume,
            suggestions=suggestions,
            score=score
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"简历优化失败：{str(e)}"
        )

# 模拟面试 API
@app.post("/api/interview/chat", response_model=schemas.InterviewChatResponse)
def interview_chat(request: schemas.InterviewChatRequest, db: Session = Depends(get_db)):
    """
    模拟面试对话接口
    - 接收用户消息和对话历史
    - 返回 AI 的面试问题或反馈
    """
    try:
        # 构建对话历史上下文
        context = "\n".join([f"用户：{msg['user']}\nAI：{msg['ai']}" for msg in request.conversation_history or []])

        prompt = f"""
你现在正在扮演一个技术面试官，正在面试候选人。
面试主题：{request.interview_topic or '全栈开发工程师'}

对话历史：
{context}

用户当前消息：{request.message}

请继续面试，根据对话历史和用户回答提出下一个相关的技术问题，或者给出反馈。
        """.strip()

        # 调用 LLM
        ai_message = mock_llm_call(prompt)

        # 更新对话历史
        conversation_history = request.conversation_history or []
        conversation_history.append({
            "user": request.message,
            "ai": ai_message,
            "timestamp": time.time()
        })

        # 模拟面试结束的判断（实际应用中可以根据对话轮次或内容判断）
        is_complete = len(conversation_history) >= 5

        return schemas.InterviewChatResponse(
            ai_message=ai_message,
            conversation_history=conversation_history,
            is_complete=is_complete
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"面试对话失败：{str(e)}"
        )

# 题库管理 API

@app.get("/api/questions/", response_model=List[schemas.QuestionResponse])
def get_questions(skip: int = 0, limit: int = 10, tags: Optional[str] = None,
                 difficulty: Optional[str] = None, db: Session = Depends(get_db)):
    """
    获取题目列表
    """
    try:
        questions = crud.question_crud.get_questions(db, skip=skip, limit=limit,
                                                  tags=tags, difficulty=difficulty)
        return questions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取题目列表失败：{str(e)}"
        )

@app.get("/api/questions/random/", response_model=schemas.QuestionResponse)
def get_random_question(tags: Optional[str] = None, difficulty: Optional[str] = None,
                       db: Session = Depends(get_db)):
    """
    获取随机题目
    """
    try:
        question = crud.question_crud.get_random_question(db, tags=tags, difficulty=difficulty)
        if not question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="没有找到符合条件的题目"
            )
        return question
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取随机题目失败：{str(e)}"
        )

@app.get("/api/questions/{question_id}", response_model=schemas.QuestionResponse)
def get_question(question_id: int, db: Session = Depends(get_db)):
    """
    根据ID获取题目
    """
    try:
        question = crud.question_crud.get_question(db, question_id)
        if not question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="题目不存在"
            )
        return question
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取题目失败：{str(e)}"
        )

@app.post("/api/questions/", response_model=schemas.QuestionResponse, status_code=status.HTTP_201_CREATED)
def create_question(question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    """
    创建新题目
    """
    try:
        return crud.question_crud.create_question(db, question)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"创建题目失败：{str(e)}"
        )

@app.put("/api/questions/{question_id}", response_model=schemas.QuestionResponse)
def update_question(question_id: int, question_update: schemas.QuestionUpdate,
                   db: Session = Depends(get_db)):
    """
    更新题目
    """
    try:
        updated_question = crud.question_crud.update_question(db, question_id, question_update)
        if not updated_question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="题目不存在"
            )
        return updated_question
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"更新题目失败：{str(e)}"
        )

@app.delete("/api/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(question_id: int, db: Session = Depends(get_db)):
    """
    删除题目
    """
    try:
        success = crud.question_crud.delete_question(db, question_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="题目不存在"
            )
        return None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"删除题目失败：{str(e)}"
        )

# 答案评估 API
@app.post("/api/questions/{question_id}/evaluate", response_model=schemas.AnswerEvaluationResponse)
def evaluate_answer(question_id: int, request: schemas.AnswerEvaluationRequest,
                   db: Session = Depends(get_db)):
    """
    评估用户答案
    """
    try:
        # 获取题目信息
        question = crud.question_crud.get_question(db, question_id)
        if not question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="题目不存在"
            )

        # 构建 LLM 提示词
        prompt = f"""
请评估用户对以下面试题的回答：

题目：{question.question}

标准答案：{question.answer}

用户回答：{request.user_answer}

请提供：
1. 评分（0-10分）
2. 详细的评价
3. 具体的改进建议（至少2点）
        """.strip()

        # 调用 LLM
        llm_response = mock_llm_call(prompt)

        # 解析 LLM 响应（这里简化处理）
        score = round(random.uniform(5.0, 9.5), 1)
        evaluation = "回答基本符合要求，但在深度和细节上还有提升空间。建议结合实际项目案例进行说明，同时注意技术术语的准确性。"
        suggestions = [
            "建议增加具体的技术实现细节",
            "可以结合实际项目案例说明",
            "注意回答的条理性和逻辑性",
            "某些技术概念的解释可以更深入"
        ]

        return schemas.AnswerEvaluationResponse(
            question_id=question_id,
            user_answer=request.user_answer,
            standard_answer=question.answer,
            score=score,
            evaluation=evaluation,
            suggestions=suggestions[:2]  # 返回2条建议
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"答案评估失败：{str(e)}"
        )

# 根路由 - 健康检查
@app.get("/")
def root():
    """
    服务健康检查
    """
    return {
        "message": "SeekJob Helper API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    # 开发模式下运行
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)