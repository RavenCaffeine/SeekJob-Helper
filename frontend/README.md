# SeekJob Helper Frontend

智能求职助手的前端应用，基于 React 18 + TypeScript + Vite 构建。

## 技术栈

- **框架**: React 18
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS v3 + ShadcnUI
- **组件库**: Lucide React (图标)
- **状态管理**: Zustand (待实现)
- **Markdown 渲染**: react-markdown + remark-gfm + rehype-katex
- **代码高亮**: react-syntax-highlighter
- **HTTP 客户端**: Axios

## 功能模块

### 1. 简历优化 (ResumePolisher)
- 简历文本输入
- AI 优化建议生成
- 优化前后对比
- 评分系统

### 2. 模拟面试 (ChatInterface)
- 实时聊天界面
- Markdown 支持
- 代码高亮
- 深色模式
- 对话历史管理

### 3. 八股题库 (QuestionBank)
- 题目列表管理
- 随机刷题
- 答案评估
- 标签和难度筛选
- CRUD 操作

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 3. 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录。

### 4. 预览生产构建

```bash
npm run preview
```

## 项目结构

```
src/
├── components/           # React 组件
│   ├── ResumePolisher.tsx   # 简历优化组件
│   ├── ChatInterface.tsx    # 聊天界面组件
│   └── QuestionBank.tsx     # 题库组件
├── types.ts              # TypeScript 类型定义
├── api.ts                # API 请求封装
├── App.tsx               # 主应用组件
├── main.tsx              # 应用入口
└── index.css             # 全局样式
```

## 配置文件

- `vite.config.ts` - Vite 配置
- `tsconfig.json` - TypeScript 配置
- `tailwind.config.js` - Tailwind CSS 配置
- `postcss.config.js` - PostCSS 配置

## 开发规范

### 代码风格
- 使用 TypeScript 进行类型检查
- 遵循 React Hooks 规范
- 使用 Tailwind CSS 进行样式开发
- 组件采用 PascalCase 命名
- 文件采用 kebab-case 命名

### 提交规范
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 样式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建或工具更新

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## License

MIT