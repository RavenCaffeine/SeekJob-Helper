"""
数据库 CRUD 操作
实现对数据库的增删改查功能
"""
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas
import random

class QuestionCRUD:
    """
    面试题的 CRUD 操作类
    """

    @staticmethod
    def get_question(db: Session, question_id: int) -> Optional[models.Question]:
        """
        根据ID获取单个题目
        """
        return db.query(models.Question).filter(models.Question.id == question_id).first()

    @staticmethod
    def get_questions(db: Session, skip: int = 0, limit: int = 100,
                     tags: Optional[str] = None, difficulty: Optional[str] = None) -> List[models.Question]:
        """
        获取题目列表，支持分页和筛选
        """
        query = db.query(models.Question)

        if tags:
            # 支持按标签筛选，标签用逗号分隔
            tag_list = [tag.strip() for tag in tags.split(',')]
            query = query.filter(models.Question.tags.ilike(f"%{tag_list[0]}%"))
            for tag in tag_list[1:]:
                query = query.filter(models.Question.tags.ilike(f"%{tag}%"))

        if difficulty:
            query = query.filter(models.Question.difficulty == difficulty)

        return query.offset(skip).limit(limit).all()

    @staticmethod
    def create_question(db: Session, question: schemas.QuestionCreate) -> models.Question:
        """
        创建新题目
        """
        db_question = models.Question(**question.dict())
        db.add(db_question)
        db.commit()
        db.refresh(db_question)
        return db_question

    @staticmethod
    def update_question(db: Session, question_id: int,
                       question_update: schemas.QuestionUpdate) -> Optional[models.Question]:
        """
        更新题目信息
        """
        db_question = db.query(models.Question).filter(models.Question.id == question_id).first()
        if db_question:
            # 只更新提供的字段
            update_data = question_update.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_question, key, value)
            db.commit()
            db.refresh(db_question)
        return db_question

    @staticmethod
    def delete_question(db: Session, question_id: int) -> bool:
        """
        删除题目
        返回是否删除成功
        """
        db_question = db.query(models.Question).filter(models.Question.id == question_id).first()
        if db_question:
            db.delete(db_question)
            db.commit()
            return True
        return False

    @staticmethod
    def get_random_question(db: Session,
                           tags: Optional[str] = None,
                           difficulty: Optional[str] = None) -> Optional[models.Question]:
        """
        获取随机题目，支持按标签和难度筛选
        """
        query = db.query(models.Question)

        if tags:
            tag_list = [tag.strip() for tag in tags.split(',')]
            query = query.filter(models.Question.tags.ilike(f"%{tag_list[0]}%"))
            for tag in tag_list[1:]:
                query = query.filter(models.Question.tags.ilike(f"%{tag}%"))

        if difficulty:
            query = query.filter(models.Question.difficulty == difficulty)

        # 获取符合条件的所有题目ID
        question_ids = query.with_entities(models.Question.id).all()
        if not question_ids:
            return None

        # 随机选择一个ID
        random_id = random.choice(question_ids)[0]
        return db.query(models.Question).filter(models.Question.id == random_id).first()

# 创建 CRUD 实例供外部使用
question_crud = QuestionCRUD()