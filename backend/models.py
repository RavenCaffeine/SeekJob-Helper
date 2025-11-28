"""
数据库模型定义
定义所有业务数据模型
"""
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Question(Base):
    """
    面试题数据库模型
    """
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False, comment="题目内容")
    answer = Column(Text, nullable=False, comment="标准答案")
    tags = Column(String(255), nullable=True, comment="标签，用逗号分隔")
    difficulty = Column(String(50), nullable=True, comment="难度级别：简单、中等、困难")
    created_at = Column(DateTime, default=datetime.utcnow, comment="创建时间")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, comment="更新时间")

    def __repr__(self):
        return f"<Question(id={self.id}, question={self.question[:50]}...)>"

# 如果需要其他模型，可以在这里继续添加
# 例如用户模型、简历模型、面试记录模型等