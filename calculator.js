// 更新颜值显示
function updateAppearanceValue(value) {
    document.getElementById('appearanceValue').textContent = value;
}

// 表单提交
document.getElementById('calculatorForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 获取表单数据
    const formData = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        income: document.getElementById('income').value,
        appearance: parseInt(document.getElementById('appearance').value),
        singleTime: document.getElementById('singleTime').value,
        weekend: document.getElementById('weekend').value
    };

    // 保存数据到 localStorage，供证书页面使用
    localStorage.setItem('userInfo', JSON.stringify(formData));

    // 切换到加载页面
    document.getElementById('formCard').style.display = 'none';
    document.getElementById('loadingCard').style.display = 'block';

    // 开始加载动画
    startLoading(formData);
});

// 加载动画
function startLoading(formData) {
    let progress = 0;
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;

        // 更新进度条
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('progressText').textContent = Math.floor(progress) + '%';

        // 更新步骤状态
        if (progress > 20 && currentStep < 1) {
            steps[0].classList.add('completed');
            steps[1].classList.add('active');
            currentStep = 1;
        } else if (progress > 40 && currentStep < 2) {
            steps[1].classList.remove('active');
            steps[1].classList.add('completed');
            steps[2].classList.add('active');
            currentStep = 2;
        } else if (progress > 60 && currentStep < 3) {
            steps[2].classList.remove('active');
            steps[2].classList.add('completed');
            steps[3].classList.add('active');
            currentStep = 3;
        } else if (progress > 80 && currentStep < 4) {
            steps[3].classList.remove('active');
            steps[3].classList.add('completed');
            steps[4].classList.add('active');
            currentStep = 4;
        }

        if (progress >= 100) {
            clearInterval(interval);
            steps[4].classList.remove('active');
            steps[4].classList.add('completed');

            // 延迟显示结果
            setTimeout(() => {
                showResult(formData);
            }, 500);
        }
    }, 200);
}

// 显示结果
function showResult(formData) {
    document.getElementById('loadingCard').style.display = 'none';
    document.getElementById('resultCard').style.display = 'block';

    // 设置用户名
    document.getElementById('userName').textContent = formData.name;

    // 生成搞笑的结果（永远很长时间）
    const result = generateFunnyResult(formData);

    // 显示倒计时
    document.getElementById('countdownResult').innerHTML = `
        <span class="countdown-number">${result.years}</span>
        <span class="countdown-unit">年</span>
        <span class="countdown-number">${result.months}</span>
        <span class="countdown-unit">个月</span>
        <span class="countdown-number">${result.days}</span>
        <span class="countdown-unit">天</span>
    `;

    // 显示消息
    document.getElementById('resultMessage').textContent = result.message;

    // 显示抽象建议
    const messagesContainer = document.getElementById('abstractMessages');
    messagesContainer.innerHTML = '';
    result.abstract.forEach((msg, index) => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.className = 'abstract-item';
            div.textContent = msg;
            messagesContainer.appendChild(div);
        }, index * 300);
    });
}

// 生成搞笑结果 - 无论什么条件都给很长时间
function generateFunnyResult(data) {
    const results = [];

    // 颜值很高也不行
    if (data.appearance >= 9) {
        results.push({
            years: 88,
            months: 8,
            days: 8,
            message: '系统检测：颜值过高易遭嫉妒，需等待88年消灾',
            abstract: [
                '你长得太好看了，别人都不敢追你，建议戴口罩出门',
                '颜值巅峰往往伴随感情低谷，这是宇宙的平衡法则',
                '建议每天丑一点，给别人一点接近你的勇气'
            ]
        });
    } else if (data.appearance >= 7) {
        results.push({
            years: 66,
            months: 6,
            days: 6,
            message: '颜值中上但气场太强，需要66年修炼亲和力',
            abstract: [
                '你的脸写满了"生人勿近"四个大字',
                '长得还行但是给人感觉不好接近，建议多笑',
                '可能你的颜值让人觉得配不上你，建议降低标准到地心'
            ]
        });
    }

    // 收入高也不行
    if (data.income === 'very-high') {
        results.push({
            years: 99,
            months: 9,
            days: 9,
            message: '财富等级过高，系统判定：别人都是为了你的钱',
            abstract: [
                '你这么有钱，谁敢保证不是看上你的钱呢？',
                '建议先把钱花光，体验一下纯粹的爱情',
                '富贵险中求，但爱情富贵里找不到'
            ]
        });
    } else if (data.income === 'low') {
        results.push({
            years: 77,
            months: 7,
            days: 7,
            message: '经济基础薄弱，系统建议：先搞钱再搞对象',
            abstract: [
                '钱包空空，爱情也跟着飞走了',
                '建议先赚他一个亿，再来考虑脱单的事',
                '贫贱夫妻百事哀，但你连贫贱夫妻都没有'
            ]
        });
    }

    // 年龄
    if (data.age < 22) {
        results.push({
            years: 55,
            months: 5,
            days: 5,
            message: '年龄太小心智不成熟，需要55年历练',
            abstract: [
                '你还是个宝宝，先把奶喝完再想谈恋爱的事',
                '年轻人要以学业/事业为重，恋爱会让你堕落',
                '等你成熟了再来，现在的你只配玩泥巴'
            ]
        });
    } else if (data.age > 35) {
        results.push({
            years: 111,
            months: 11,
            days: 11,
            message: '年龄较大思想固化，系统预判：下辈子见',
            abstract: [
                '你都这个年纪了还想脱单？建议直接养老',
                '人生已经走过了三分之一，该接受现实了',
                '建议购买猫猫狗狗作为精神寄托'
            ]
        });
    }

    // 性别
    if (data.gender === 'male') {
        results.push({
            years: 100,
            months: 0,
            days: 0,
            message: '男性竞争压力大，需要100年才能排到你',
            abstract: [
                '全国男性比女性多3000万，你排在第3000万零1位',
                '建议学习唱跳rap篮球，增加竞争力',
                '或者考虑移民到女多男少的国家'
            ]
        });
    } else if (data.gender === 'female') {
        results.push({
            years: 99,
            months: 11,
            days: 11,
            message: '女性眼光太高，系统检测：没有完美的人',
            abstract: [
                '你的择偶标准已经超出人类范畴',
                '建议降低标准，或者等待外星人入侵地球',
                '完美的爱人只存在于小说和梦里'
            ]
        });
    }

    // 单身时长
    if (data.singleTime === 'forever') {
        results.push({
            years: 999,
            months: 11,
            days: 11,
            message: '恭喜解锁"永恒单身"成就，请领取终身荣誉证书',
            abstract: [
                '你已经单身这么久了，说明单身才是你的本命',
                '从未脱单代表你是被上天选中的单身战士',
                '建议接受现实，单身其实也没那么糟（真的吗？）'
            ]
        });
    } else if (data.singleTime === 'five') {
        results.push({
            years: 88,
            months: 8,
            days: 8,
            message: '长期单身已形成惯性，系统无法破解',
            abstract: [
                '你已经习惯了一个人，现在让你找对象反而不适应了',
                '单身5-10年，身体已经产生了抗恋爱抗体',
                '建议继续保持，孤独是一种修行'
            ]
        });
    }

    // 周末活动
    if (data.weekend === 'game') {
        results.push({
            years: 77,
            months: 7,
            days: 7,
            message: '重度宅属性，脱单难度系数：MAX',
            abstract: [
                '游戏不会背叛你，但也不会给你生孩子',
                '建议把游戏卸载，去外面看看真实的世界',
                '二次元老婆再香，也给不了你一个拥抱'
            ]
        });
    } else if (data.weekend === 'sleep') {
        results.push({
            years: 66,
            months: 6,
            days: 6,
            message: '生活作息混乱，建议先调整生物钟',
            abstract: [
                '你睡觉的时候别人在社交，你醒来的时候别人在睡觉',
                '时间错位导致你永远遇不到对的人',
                '建议调整作息，或者找个同样爱睡觉的'
            ]
        });
    } else if (data.weekend === 'work') {
        results.push({
            years: 55,
            months: 5,
            days: 5,
            message: '工作狂人，系统提示：过劳死风险99%',
            abstract: [
                '你把所有时间都给了工作，哪来时间谈恋爱',
                '等你升职加薪买房买车，头发都掉光了',
                '建议找个同样996的人，一起加班一起秃'
            ]
        });
    } else if (data.weekend === 'study') {
        results.push({
            years: 44,
            months: 4,
            days: 4,
            message: '学习虽好但不能当饭吃，更不能当对象',
            abstract: [
                '你以为学历高就能找到好对象？图样图森破',
                '书中自有颜如玉是骗人的，书里只有考试题',
                '建议放下书本，抬头看看周围有没有心动的人'
            ]
        });
    } else if (data.weekend === 'sport') {
        results.push({
            years: 33,
            months: 3,
            days: 3,
            message: '运动健身很棒，但你锻炼的是肌肉不是社交能力',
            abstract: [
                '你有八块腹肌但是没有八个好友',
                '身材再好，不会聊天也白搭',
                '建议去参加集体运动，比如广场舞'
            ]
        });
    } else if (data.weekend === 'social') {
        results.push({
            years: 22,
            months: 2,
            days: 2,
            message: '社交达人为何单身？系统判定：你是中央空调',
            abstract: [
                '对谁都好就等于对谁都不好',
                '你的朋友太多了，别人以为你已经有对象了',
                '建议减少社交，专注一个人试试'
            ]
        });
    }

    // 如果没有匹配到，返回默认超长时间
    if (results.length === 0) {
        results.push({
            years: 99,
            months: 9,
            days: 9,
            message: '系统综合分析：你的条件太过完美，不属于人间',
            abstract: [
                '你可能是从天上掉下来的，人间不配拥有你',
                '建议等待缘分从天而降（字面意思）',
                '或许你的真命天子/天女还没有出生'
            ]
        });
    }

    // 随机返回一个结果
    return results[Math.floor(Math.random() * results.length)];
}

// 跳转到证书页面
function goToCertificate() {
    window.location.href = 'certificate.html';
}

// 重新测算
function retry() {
    // 重置所有步骤状态
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.classList.remove('active', 'completed');
    });

    // 重置表单
    document.getElementById('calculatorForm').reset();
    document.getElementById('appearanceValue').textContent = '5';

    // 切换回表单页面
    document.getElementById('resultCard').style.display = 'none';
    document.getElementById('formCard').style.display = 'block';
}

// 页面加载完成后的动画
window.addEventListener('load', () => {
    document.querySelector('.card').style.animation = 'slideIn 0.5s ease-out';
});
