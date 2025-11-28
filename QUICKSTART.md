# 快速开始指南

本文档提供 SeekJob Helper 的快速启动说明，帮助您在几分钟内运行项目。

## 🚀 一键启动（推荐）

### 方式一：使用启动脚本（Linux/macOS）

```bash
# 克隆项目
git clone <repository-url>
cd SeekJob-Helper

# 运行启动脚本
chmod +x start.sh
./start.sh
```

### 方式二：手动启动

#### 1. 启动后端服务

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate     # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

#### 2. 启动前端应用（新终端窗口）

```bash
cd frontend
npm install
npm run dev
```

## 📱 访问应用

启动完成后，在浏览器中访问：

- 前端应用: http://localhost:5173
- 后端API文档: http://localhost:8000/docs
- 后端健康检查: http://localhost:8000/

## 🎯 功能测试

### 测试简历优化功能

1. 打开 http://localhost:5173
2. 点击"简历优化"标签
3. 输入一些简历内容（例如："我是一名软件工程师，有2年开发经验..."）
4. 点击"开始优化"
5. 查看 AI 生成的优化建议

### 测试模拟面试功能

1. 点击"模拟面试"标签
2. 设置面试主题（例如："全栈开发工程师"）
3. 点击"开始新面试"
4. 与 AI 面试官进行对话

### 测试八股题库功能

1. 点击"八股题库"标签
2. 切换到"题库管理"模式
3. 点击"+ 添加题目"
4. 填写题目信息并保存
5. 切换到"随机刷题"模式开始练习

## 🔧 常见问题

### 端口被占用

如果端口 5173 或 8000 被占用，可以修改配置：

**前端端口修改：**
编辑 `frontend/vite.config.ts`
```typescript
server: {
  port: 5174,  // 修改为其他端口
}
```

**后端端口修改：**
启动时指定端口：
```bash
uvicorn main:app --reload --port 8001
```

### 依赖安装失败

**Python 依赖失败：**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Node.js 依赖失败：**
```bash
npm install --legacy-peer-deps
# 或
yarn install
```

### AI 功能不工作

项目默认使用模拟的 AI 响应。如需使用真实的 OpenAI API：

1. 注册 OpenAI 账号并获取 API Key
2. 在 `backend/.env` 文件中添加：
```env
OPENAI_API_KEY=your_actual_api_key_here
```
3. 修改 `backend/main.py` 中的 LLM 调用部分

## 📚 下一步

- 查看完整的 [README.md](README.md) 了解详细功能
- 查看 [API 文档](http://localhost:8000/docs) 了解后端接口
- 阅读 [需求文档.md](需求文档.md) 了解产品设计

## 🆘 技术支持

如果遇到问题：

1. 查看控制台错误信息
2. 检查网络连接
3. 确认 Python 和 Node.js 版本
4. 查看 [FAQ](docs/FAQ.md)（待完善）
5. 提交 Issue 或联系开发团队

---

**祝您好运！🎊**