# SeekJob Helper - 智能求职助手

![SeekJob Helper](https://img.shields.io/badge/React-18.2.0-blue)
![FastAPI-0.104.1](https://img.shields.io/badge/FastAPI-0.104.1-green)
![TypeScript-5.2.2](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![TailwindCSS-3.3.6](https://img.shields.io/badge/TailwindCSS-3.3.6-purple)

SeekJob Helper 是一款专为 IT 计算机类学生打造的智能求职助手应用，提供简历优化、模拟面试和八股题库三大核心功能，帮助求职者提升求职竞争力。

## 🚀 核心功能

### 1. 简历深度优化 (Resume Polish)
- 📝 支持文本输入或文件上传简历
- 🤖 基于 AI 的智能分析和优化建议
- ⭐ 遵循 STAR 法则进行结构化优化
- 📊 提供详细的优化评分和改进方向
- 🔄 优化前后简历对比展示

### 2. 模拟技术面试 (Mock Interview)
- 💬 与 AI 面试官进行实时对话
- 💻 支持代码考核和 Markdown 格式
- 🎯 可自定义面试主题和难度
- 📚 覆盖全栈开发、算法、系统设计等多个领域
- 🌓 支持深色模式，保护视力

### 3. 八股文题库 (Q&A Bank)
- 📖 丰富的 IT 面试题目库
- 🎲 随机刷题模式，模拟真实考试
- ✅ AI 智能评分和详细解析
- 🏷️ 支持标签和难度筛选
- ➕ 支持用户自定义添加和管理题目

## 🏗️ 技术架构

### 前端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.2.0 | 用户界面框架 |
| TypeScript | 5.2.2 | 类型安全的 JavaScript |
| Vite | 5.0.8 | 快速的构建工具 |
| Tailwind CSS | 3.3.6 | 原子化 CSS 框架 |
| ShadcnUI | - | UI 组件库 |
| Lucide React | 0.294.0 | 图标库 |
| Axios | 1.6.2 | HTTP 客户端 |
| react-markdown | 9.0.1 | Markdown 渲染 |
| react-syntax-highlighter | 15.5.0 | 代码高亮 |

### 后端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| FastAPI | 0.104.1 | 现代 Web 框架 |
| Python | 3.10+ | 后端开发语言 |
| SQLite | - | 轻量级数据库 |
| SQLAlchemy | 2.0.23 | ORM 框架 |
| Pydantic | 2.5.0 | 数据验证 |
| OpenAI SDK | 1.6.1 | AI 接口集成 |

## 📁 项目结构

```
SeekJob-Helper/
├── backend/                    # 后端服务
│   ├── main.py                # FastAPI 主应用
│   ├── models.py              # 数据库模型
│   ├── schemas.py             # Pydantic 模式
│   ├── crud.py                # 数据库操作
│   └── requirements.txt       # Python 依赖
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── components/        # React 组件
│   │   ├── types.ts           # TypeScript 类型
│   │   ├── api.ts             # API 封装
│   │   ├── App.tsx            # 主应用组件
│   │   └── main.tsx           # 应用入口
│   ├── package.json           # Node.js 依赖
│   ├── vite.config.ts         # Vite 配置
│   └── tailwind.config.js     # Tailwind CSS 配置
├── README.md                   # 项目说明文档
└── 需求文档.md                 # 详细需求说明
```

## 🚀 快速开始

### 环境要求

- Python 3.10+
- Node.js 18+
- npm 或 yarn

### 1. 克隆项目

```bash
git clone <repository-url>
cd SeekJob-Helper
```

### 2. 启动后端服务

```bash
cd backend
# 创建虚拟环境
python -m venv venv
# 激活虚拟环境
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
# 安装依赖
pip install -r requirements.txt
# 启动后端服务
uvicorn main:app --reload
```

后端服务将在 `http://localhost:8000` 启动。

### 3. 启动前端应用

```bash
cd frontend
# 安装依赖
npm install
# 启动开发服务器
npm run dev
```

前端应用将在 `http://localhost:5173` 启动。

### 4. 访问应用

在浏览器中访问 `http://localhost:5173` 即可使用 SeekJob Helper。

## 📖 API 文档

后端提供完整的 RESTful API，文档可通过以下方式访问：

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🧪 功能演示

### 简历优化
1. 进入"简历优化"页面
2. 输入简历文本和目标职位
3. 点击"开始优化"
4. 查看优化建议和评分

### 模拟面试
1. 进入"模拟面试"页面
2. 设置面试主题（如：全栈开发工程师）
3. 点击"开始新面试"
4. 与 AI 面试官进行对话

### 八股题库
1. 进入"八股题库"页面
2. 选择"随机刷题"模式
3. 回答题目后点击"提交答案"
4. 查看 AI 评分和详细解析

## ⚙️ 配置说明

### 后端配置

在 `backend/.env` 文件中可以配置以下参数：

```env
# OpenAI API 配置
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-3.5-turbo

# 数据库配置
DATABASE_URL=sqlite:///./seekjob.db

# CORS 配置
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 前端配置

在 `frontend/.env` 文件中可以配置以下参数：

```env
VITE_API_URL=http://localhost:8000/api
```

## 🚀 部署

### 前端部署

```bash
cd frontend
npm run build
# 将 dist 目录部署到静态服务器
```

### 后端部署

```bash
# 使用 uvicorn 部署
uvicorn main:app --host 0.0.0.0 --port 8000

# 或使用 Docker
docker build -t seekjob-helper .
docker run -p 8000:8000 seekjob-helper
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 License

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://reactjs.org/) - 用户界面框架
- [FastAPI](https://fastapi.tiangolo.com/) - Web 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [OpenAI](https://openai.com/) - AI 技术支持

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](../../issues)
- 发送邮件至 [your-email@example.com]

---

**祝您求职顺利！ 🎉**
