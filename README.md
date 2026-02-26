# 🏠 家庭账本 | Family Ledger AI

> 智能家庭财务管理应用 - 支持 AI 收据识别

## ✨ 功能特点

### 🤖 AI 智能识别
- 上传收据/小票图片，AI 自动提取关键信息
- 智能分类（餐饮、超市、交通、房租、水电、孩子、医疗、娱乐等）
- 异常支出提醒和优化建议

### 📊 数据可视化
- 总收入/支出/净流入统计
- 月度趋势图
- 分类占比饼图
- 最近交易列表

### 💾 数据存储
- 本地存储 (LocalStorage) - 默认
- Supabase 云端存储 - 可选配置

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/ocean-Go/family-ledger.git
cd family-ledger
```

### 2. 在浏览器打开
```bash
# 直接打开
open index.html

# 或使用本地服务器
npx serve .
```

### 3. 配置 AI 识别 (可选)

编辑 `js/app.js` 中的配置：

```javascript
const CONFIG = {
    // OpenAI API Key (用于收据识别)
    aiApiKey: 'your-api-key',
    aiProvider: 'openai',  // 或 'minimax'
    
    // Supabase 配置 (可选)
    supabaseUrl: 'https://your-project.supabase.co',
    supabaseKey: 'your-anon-key'
};
```

## 📱 使用说明

1. **上传收据**: 拖拽或点击上传收据图片
2. **AI 识别**: 系统自动提取日期、商家、金额等信息
3. **确认保存**: 检查识别结果，保存到账本
4. **查看报表**: 浏览统计图表和交易记录

## 🖥️ 页面预览

![Dashboard](https://via.placeholder.com/800x400?text=Family+Ledger+Dashboard)

## 📁 项目结构

```
family-ledger/
├── index.html          # 主页面
├── js/
│   └── app.js         # 应用逻辑
├── SPEC.md            # 设计规范
└── README.md
```

## 🔧 技术栈

- **前端**: HTML5, CSS3, JavaScript (Vanilla)
- **可视化**: Chart.js
- **图标**: Font Awesome
- **字体**: Inter
- **AI**: OpenAI GPT-4o / MiniMax

## 📜 许可证

MIT License

---

**Powered by AI** 🤖
