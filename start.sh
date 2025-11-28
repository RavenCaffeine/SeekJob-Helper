#!/bin/bash

# SeekJob Helper 启动脚本
# 自动安装依赖并启动前后端服务

echo "🚀 启动 SeekJob Helper..."

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误：未找到 Python3，请先安装 Python 3.10+"
    exit 1
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误：未找到 npm，请先安装 npm"
    exit 1
fi

echo "📦 安装后端依赖..."
cd backend

# 创建虚拟环境
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ 虚拟环境创建成功"
fi

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
echo "✅ 后端依赖安装完成"

echo "🚀 启动后端服务..."
# 在后台启动后端
uvicorn main:app --reload &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 检查后端是否启动成功
if curl -s http://localhost:8000/ > /dev/null; then
    echo "✅ 后端服务启动成功 (http://localhost:8000)"
else
    echo "❌ 后端服务启动失败，请检查错误日志"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "📦 安装前端依赖..."
cd ../frontend

# 安装前端依赖
npm install
echo "✅ 前端依赖安装完成"

echo "🚀 启动前端服务..."
# 在后台启动前端
npm run dev &
FRONTEND_PID=$!

# 等待前端启动
sleep 5

# 检查前端是否启动成功
if curl -s http://localhost:5173/ > /dev/null; then
    echo "✅ 前端服务启动成功 (http://localhost:5173)"
else
    echo "❌ 前端服务启动失败，请检查错误日志"
    kill $FRONTEND_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 SeekJob Helper 启动完成！"
echo ""
echo "🌐 前端应用: http://localhost:5173"
echo "🔗 后端API: http://localhost:8000"
echo "📖 API文档: http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待用户中断
trap 'echo "🛑 正在停止服务..."; kill $FRONTEND_PID 2>/dev/null; kill $BACKEND_PID 2>/dev/null; exit 0' INT
wait