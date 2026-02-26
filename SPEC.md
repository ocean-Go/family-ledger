# Family Ledger V2 - 家庭财务管理 AI 应用

## 1. 功能需求

### 1.1 收据/小票智能识别
- 上传图片（收据、账单、小票）
- AI 提取：日期、商家、金额、类别、支付方式
- 判断收支类型（收入/支出）
- 支出分类：餐饮、超市、交通、房租、水电、孩子、医疗、娱乐、其他
- 异常提醒和优化建议

### 1.2 数据展示
- 总收入/支出/净流入
- 月度趋势图
- 分类占比饼图
- 最近交易列表

## 2. UI/UX 设计

### 视觉风格
- 深色主题 (#1a1a2e, #16213e)
- 卡片式布局
- 渐变强调色 (#e94560, #0f3460)
- 圆角 12px
- 字体: Inter, system-ui

### 布局
- 顶部导航
- 左侧：上传区域
- 右侧：数据展示
- 移动端响应式

## 3. 技术架构

### 前端
- 纯 HTML/CSS/JS
- Chart.js 可视化
- 拖拽上传

### 后端 (可选)
- Supabase 存储
- 或本地 LocalStorage

## 4. 数据存储

### 方案 A: Supabase (推荐)
- 表: family_ledger_transactions
- 原始图片存储: Supabase Storage bucket

### 方案 B: LocalStorage
- 无需后端
- 数据导出 JSON

## 5. 页面结构

```
├── index.html          # 主页面（上传+展示）
├── css/
│   └── style.css
├── js/
│   └── app.js
└── uploads/           # 本地存储（可选）
```
