// 段位配置
const ranks = {
    '1': { name: '青铜光棍', class: 'bronze' },
    '3': { name: '白银光棍', class: 'silver' },
    '6': { name: '黄金光棍', class: 'gold' },
    '11': { name: '铂金光棍', class: 'platinum' },
    '21': { name: '钻石光棍', class: 'diamond' },
    '99': { name: '王者光棍', class: 'king' }
};

// 单身年限映射（从测算页面传来的）
const singleTimeMap = {
    'half': '1',
    'one': '1',
    'three': '3',
    'five': '6',
    'forever': '99'
};

// 生成证书编号
function generateCertNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `GJRZ-${year}-${random}`;
}

// 生成防伪码
function generateSecurityCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 16; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
        if ((i + 1) % 4 === 0 && i < 15) code += '-';
    }
    return code;
}

// 获取今天日期
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
}

// 页面加载时检查是否有传来的数据
window.addEventListener('load', () => {
    const userInfo = localStorage.getItem('userInfo');

    if (userInfo) {
        try {
            const data = JSON.parse(userInfo);
            // 自动填充表单
            autoFillForm(data);
            // 显示提示
            showToast('已自动填充您的信息，可直接生成证书！');
        } catch (e) {
            console.error('解析用户数据失败:', e);
        }
    }
});

// 自动填充表单
function autoFillForm(data) {
    // 填充姓名
    if (data.name) {
        document.getElementById('fullName').value = data.name;
    }

    // 填充性别
    if (data.gender) {
        const genderMap = {
            'male': '男',
            'female': '女',
            'other': '男' // 默认男
        };
        document.getElementById('gender').value = genderMap[data.gender] || '男';
    }

    // 填充出生年份（通过年龄计算）
    if (data.age) {
        const currentYear = new Date().getFullYear();
        const birthYear = currentYear - data.age;
        document.getElementById('birthYear').value = birthYear;
    }

    // 填充单身年限
    if (data.singleTime) {
        const singleYears = singleTimeMap[data.singleTime] || '3';
        document.getElementById('singleYears').value = singleYears;
    }

    // 填充态度（根据周末活动推测）
    const attitudeMap = {
        'game': '已放弃治疗',
        'sleep': '佛系等待中',
        'work': '佛系等待中',
        'study': '积极寻找中',
        'sport': '积极寻找中',
        'social': '积极寻找中'
    };
    if (data.weekend) {
        document.getElementById('attitude').value = attitudeMap[data.weekend] || '佛系等待中';
    }
}

// 表单提交
document.getElementById('certForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 获取表单数据
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        gender: document.getElementById('gender').value,
        birthYear: document.getElementById('birthYear').value,
        singleYears: document.getElementById('singleYears').value,
        attitude: document.getElementById('attitude').value,
        slogan: document.getElementById('slogan').value.trim()
    };

    // 验证数据
    if (!formData.fullName || !formData.gender || !formData.birthYear ||
        !formData.singleYears || !formData.attitude) {
        alert('请填写所有必填项！');
        return;
    }

    // 生成证书
    generateCertificate(formData);

    // 切换显示
    document.getElementById('inputCard').style.display = 'none';
    document.getElementById('certificateCard').style.display = 'block';

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 生成证书
function generateCertificate(data) {
    // 设置证书编号
    document.getElementById('certNumber').textContent = generateCertNumber();

    // 设置防伪码
    document.getElementById('securityCode').textContent = generateSecurityCode();

    // 设置日期
    document.getElementById('certDate').textContent = getTodayDate();

    // 设置姓名
    document.getElementById('certName').textContent = data.fullName;

    // 设置性别
    document.getElementById('certGender').textContent = data.gender;

    // 设置出生年份
    document.getElementById('certBirthYear').textContent = data.birthYear;

    // 设置单身年限文本
    const singleYearsText = {
        '1': '1-2年',
        '3': '3-5年',
        '6': '6-10年',
        '11': '11-20年',
        '21': '20年以上',
        '99': '母胎单身（传说级）'
    };
    document.getElementById('certSingleYears').textContent = singleYearsText[data.singleYears];

    // 设置态度
    document.getElementById('certAttitude').textContent = data.attitude;

    // 设置段位徽章
    const rank = ranks[data.singleYears];
    const rankBadge = document.getElementById('rankBadge');
    rankBadge.textContent = rank.name;
    rankBadge.className = 'rank-badge ' + rank.class;

    // 设置宣言
    const sloganElement = document.getElementById('certSlogan');
    if (data.slogan) {
        sloganElement.textContent = `「 ${data.slogan} 」`;
        sloganElement.style.display = 'block';
    } else {
        sloganElement.style.display = 'none';
    }
}

// 下载证书
function downloadCertificate() {
    const certificate = document.getElementById('certificate');
    const button = event.target;

    // 禁用按钮
    button.disabled = true;
    button.textContent = '📸 生成中...';

    // 使用 html2canvas 生成图片
    html2canvas(certificate, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
    }).then(canvas => {
        // 创建下载链接
        const link = document.createElement('a');
        const name = document.getElementById('certName').textContent;
        link.download = `资深光棍证书-${name}-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // 恢复按钮
        button.disabled = false;
        button.textContent = '📥 下载证书';

        // 显示提示
        showToast('证书已保存到下载文件夹！');
    }).catch(error => {
        console.error('生成图片失败:', error);
        button.disabled = false;
        button.textContent = '📥 下载证书';
        alert('生成失败，请重试！');
    });
}

// 重新生成
function regenerate() {
    document.getElementById('certificateCard').style.display = 'none';
    document.getElementById('inputCard').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 返回测算页面
function goBack() {
    window.location.href = 'index.html';
}

// 显示提示
function showToast(message) {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 16px;
        z-index: 9999;
        animation: fadeInOut 2s ease-in-out;
    `;
    toast.textContent = message;

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            10%, 90% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // 添加到页面
    document.body.appendChild(toast);

    // 2秒后移除
    setTimeout(() => {
        toast.remove();
        style.remove();
    }, 2000);
}
