// ==================== 配置 ====================
const CONFIG = {
    // Supabase 配置 (可选)
    supabaseUrl: '',
    supabaseKey: '',
    
    // AI API 配置 (使用 OpenAI 或 MiniMax)
    aiApiKey: '',  // 你的 API Key
    aiProvider: 'minimax',  // 'openai' 或 'minimax'
    
    // 分类图标映射
    categoryIcons: {
        '餐饮': 'fa-utensils',
        '超市': 'fa-shopping-cart',
        '交通': 'fa-car',
        '房租': 'fa-home',
        '水电': 'fa-bolt',
        '孩子': 'fa-child',
        '医疗': 'fa-hospital',
        'fa-film': 'fa-film',
        '娱乐': 'fa-gamepad',
        '其他': 'fa-ellipsis-h'
    }
};

// ==================== 状态 ====================
let currentTransaction = null;
let transactions = [];

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    initUpload();
    loadFromStorage();
    renderDashboard();
});

// ==================== 上传处理 ====================
function initUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');

    uploadZone.addEventListener('click', () => fileInput.click());
    
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length) handleFile(files[0]);
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });
}

async function handleFile(file) {
    const loading = document.getElementById('loading');
    const resultSection = document.getElementById('resultSection');
    
    loading.classList.add('active');
    resultSection.style.display = 'none';
    
    try {
        // 方式1: 使用 AI 识别 (需要配置 API Key)
        if (CONFIG.aiApiKey) {
            const result = await analyzeWithAI(file);
            displayResult(result);
        } else {
            // 方式2: 模拟识别结果 (演示用)
            const result = simulateAnalysis(file.name);
            displayResult(result);
        }
    } catch (error) {
        alert('识别失败: ' + error.message);
    } finally {
        loading.classList.remove('active');
    }
}

// ==================== AI 分析 ====================
async function analyzeWithAI(file) {
    const base64 = await fileToBase64(file);
    
    const prompt = `你是一个家庭财务管理助手。请分析这张收据图片，提取以下信息：
1. 日期 (格式: YYYY-MM-DD)
2. 商家名称
3. 金额 (数字)
4. 收支类型 (收入/支出)
5. 分类 (餐饮/超市/交通/房租/水电/孩子/医疗/娱乐/其他)
6. 支付方式 (现金/信用卡/借记卡/支付宝/微信)

请以 JSON 格式返回：
{"date": "...", "merchant": "...", "amount": 0, "type": "支出", "category": "...", "payment": "..."}`;

    const messages = [
        {
            type: "text",
            text: prompt
        },
        {
            type: "image_url",
            image_url: {
                url: `data:${file.type};base64,${base64}`
            }
        }
    ];

    let response;
    if (CONFIG.aiProvider === 'minimax') {
        response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_pro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.aiApiKey}`
            },
            body: JSON.stringify({
                model: 'abab6.5s-chat',
                messages: [{ role: 'user', content: messages }]
            })
        });
    } else {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.aiApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: messages }]
            })
        });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // 解析 JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    throw new Error('无法解析 AI 返回结果');
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 模拟分析 (演示用)
function simulateAnalysis(filename) {
    const categories = ['餐饮', '超市', '交通', '房租', '水电', '孩子', '医疗', '娱乐', '其他'];
    const merchants = ['Mercadona', 'Carrefour', 'Lidl', '家乐福', 'Aldi', 'El Corte Inglés', 'Decathlon'];
    const payments = ['现金', '信用卡', '借记卡', '支付宝', '微信'];
    
    const result = {
        date: new Date().toISOString().split('T')[0],
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        amount: (Math.random() * 100 + 5).toFixed(2),
        type: '支出',
        category: categories[Math.floor(Math.random() * categories.length)],
        payment: payments[Math.floor(Math.random() * payments.length)]
    };
    
    // 生成智能提醒
    result.alert = generateAlert(result);
    
    return result;
}

function generateAlert(transaction) {
    const alerts = [];
    
    if (transaction.amount > 100) {
        alerts.push('这笔支出较高，请确认是否必要');
    }
    if (transaction.category === '餐饮' && transaction.amount > 50) {
        alerts.push('餐饮支出偏多，注意控制饮食开支');
    }
    if (transaction.category === '超市' && transaction.amount > 150) {
        alerts.push('大额超市采购，可考虑比价或等待促销');
    }
    
    return alerts.length > 0 ? alerts.join('；') : null;
}

// ==================== 显示结果 ====================
function displayResult(result) {
    currentTransaction = result;
    
    document.getElementById('resultDate').textContent = result.date;
    document.getElementById('resultMerchant').textContent = result.merchant;
    document.getElementById('resultAmount').textContent = '€' + parseFloat(result.amount).toFixed(2);
    
    const typeTag = document.getElementById('resultType');
    typeTag.textContent = result.type;
    typeTag.className = 'tag ' + (result.type === '收入' ? 'tag-income' : 'tag-expense');
    
    document.getElementById('resultCategory').textContent = result.category;
    document.getElementById('resultPayment').textContent = result.payment;
    
    const alertDiv = document.getElementById('resultAlert');
    const alertText = document.getElementById('alertText');
    if (result.alert) {
        alertDiv.style.display = 'flex';
        alertText.textContent = result.alert;
    } else {
        alertDiv.style.display = 'none';
    }
    
    document.getElementById('resultSection').style.display = 'block';
}

// ==================== 保存交易 ====================
function saveTransaction() {
    if (!currentTransaction) return;
    
    const transaction = {
        id: Date.now(),
        ...currentTransaction,
        createdAt: new Date().toISOString()
    };
    
    transactions.unshift(transaction);
    saveToStorage();
    renderDashboard();
    
    // 重置
    document.getElementById('resultSection').style.display = 'none';
    currentTransaction = null;
    
    alert('✅ 记录已保存！');
}

function saveManualTransaction() {
    const transaction = {
        id: Date.now(),
        date: document.getElementById('inputDate').value || new Date().toISOString().split('T')[0],
        merchant: document.getElementById('inputMerchant').value || '未知',
        amount: parseFloat(document.getElementById('inputAmount').value) || 0,
        type: document.getElementById('inputType').value,
        category: document.getElementById('inputCategory').value,
        payment: document.getElementById('inputPayment').value,
        createdAt: new Date().toISOString()
    };
    
    if (!transaction.amount) {
        alert('请输入金额');
        return;
    }
    
    transactions.unshift(transaction);
    saveToStorage();
    renderDashboard();
    
    // 重置表单
    document.querySelectorAll('.manual-form input, .manual-form select').forEach(el => {
        if (el.type !== 'select-one') el.value = '';
    });
    
    alert('✅ 记录已添加！');
}

// ==================== 数据存储 ====================
function saveToStorage() {
    localStorage.setItem('family_ledger_transactions', JSON.stringify(transactions));
}

function loadFromStorage() {
    const stored = localStorage.getItem('family_ledger_transactions');
    if (stored) {
        transactions = JSON.parse(stored);
    }
}

// ==================== 仪表盘渲染 ====================
function renderDashboard() {
    renderStats();
    renderCharts();
    renderTransactions();
}

function renderStats() {
    const income = transactions
        .filter(t => t.type === '收入')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expense = transactions
        .filter(t => t.type === '支出')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    document.getElementById('totalIncome').textContent = '€' + income.toFixed(2);
    document.getElementById('totalExpense').textContent = '€' + expense.toFixed(2);
    document.getElementById('totalNet').textContent = '€' + (income - expense).toFixed(2);
}

function renderCharts() {
    renderTrendChart();
    renderCategoryChart();
}

let trendChart, categoryChart;

function renderTrendChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');
    
    // 按月汇总
    const monthlyData = {};
    transactions.forEach(t => {
        const month = t.date.substring(0, 7);
        if (!monthlyData[month]) {
            monthlyData[month] = { income: 0, expense: 0 };
        }
        if (t.type === '收入') {
            monthlyData[month].income += parseFloat(t.amount);
        } else {
            monthlyData[month].expense += parseFloat(t.amount);
        }
    });
    
    const labels = Object.keys(monthlyData).sort().slice(-6);
    const incomeData = labels.map(m => monthlyData[m].income);
    const expenseData = labels.map(m => monthlyData[m].expense);
    
    if (trendChart) trendChart.destroy();
    
    trendChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: '收入',
                    data: incomeData,
                    backgroundColor: '#00d26a'
                },
                {
                    label: '支出',
                    data: expenseData,
                    backgroundColor: '#f85149'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#eee' } }
            },
            scales: {
                x: { ticks: { color: '#a0a0a0' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                y: { ticks: { color: '#a0a0a0' }, grid: { color: 'rgba(255,255,255,0.1)' } }
            }
        }
    });
}

function renderCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    const categoryData = {};
    transactions.filter(t => t.type === '支出').forEach(t => {
        categoryData[t.category] = (categoryData[t.category] || 0) + parseFloat(t.amount);
    });
    
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    
    const colors = [
        '#ff9f43', '#ff6384', '#36a2eb', '#4bc0c0', 
        '#ff9f40', '#9966ff', '#ffcd56', '#c9c9cf'
    ];
    
    if (categoryChart) categoryChart.destroy();
    
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors.slice(0, labels.length)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'right',
                    labels: { color: '#eee' }
                }
            }
        }
    });
}

function renderTransactions() {
    const container = document.getElementById('transactionsList');
    
    if (transactions.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">暂无交易记录</p>';
        return;
    }
    
    const html = transactions.slice(0, 10).map(t => {
        const icon = CONFIG.categoryIcons[t.category] || 'fa-ellipsis-h';
        const isIncome = t.type === '收入';
        
        return `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-icon cat-${t.category}">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="transaction-details">
                        <h4>${t.merchant}</h4>
                        <p>${t.date} · ${t.category} · ${t.payment}</p>
                    </div>
                </div>
                <div class="transaction-amount">
                    <div class="amount ${isIncome ? 'stat-income' : 'stat-expense'}">
                        ${isIncome ? '+' : '-'}€${parseFloat(t.amount).toFixed(2)}
                    </div>
                    <div class="date">${t.type}</div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// ==================== 其他功能 ====================
function refreshData() {
    loadFromStorage();
    renderDashboard();
    alert('🔄 数据已刷新');
}

function exportData() {
    const data = JSON.stringify(transactions, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family-ledger-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// ==================== Supabase 同步 (可选) ====================
async function syncToSupabase() {
    if (!CONFIG.supabaseUrl || !CONFIG.supabaseKey) return;
    
    const response = await fetch(`${CONFIG.supabaseUrl}/rest/v1/family_ledger_transactions`, {
        headers: {
            'apikey': CONFIG.supabaseKey,
            'Authorization': `Bearer ${CONFIG.supabaseKey}`,
            'Content-Type': 'application/json'
        }
    });
    
    const remoteData = await response.json();
    // 合并数据逻辑...
}
