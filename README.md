# 🏠 家庭账本 | Family Ledger Dashboard

> 简洁的纯看板式家庭财务管理工具

## 特点

- 📊 **纯数据展示** - 仅从 Supabase 读取，不做数据录入
- 🎨 **极简设计** - 深色主题，专注于可视化呈现
- 🚀 **实时刷新** - 一键刷新获取最新数据
- 📱 **响应式布局** - 适配各种屏幕尺寸

## 页面结构

```
family-ledger/
├── index.html          # 首页 - 总览仪表板
├── january-2026.html   # 月度详细报表
└── README.md
```

## 首页功能

- 💰 总收入/支出/净流入统计
- 📈 月度趋势图
- 🥗 分类占比饼图
- 🕐 最近交易列表
- 🏷️ 分类排行
- 📅 月度报表入口

## 技术栈

- **前端**: HTML5 + CSS3 + Chart.js + FontAwesome
- **后端**: Supabase (PostgreSQL)
- **部署**: GitHub Pages

## 快速开始

```bash
# 克隆
git clone https://github.com/ocean-Go/family-ledger.git
cd family-ledger

# 在浏览器打开
open index.html
```

## 配置

在 `index.html` 中修改 Supabase 配置：

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
```

## 数据结构

表名: `family_ledger_transactions`

| 字段 | 类型 | 说明 |
|------|------|------|
| 日期 | DATE | 交易日期 |
| 商家 | TEXT | 商家名称 |
| 金额_eur | NUMERIC | 金额（欧元） |
| 收支 | TEXT | 收入/支出 |
| 分类 | TEXT | 消费分类 |
| 支付方式 | TEXT | 支付渠道 |
| 备注 | TEXT | 备注 |

## 访问地址

- 🌐 GitHub Pages: https://ocean-go.github.io/family-ledger/
- 📦 GitHub: https://github.com/ocean-Go/family-ledger

---

**Powered by Supabase** 🚀
