// 报告页面逻辑

class ReportGenerator {
    constructor() {
        this.reportData = null;
        this.assessmentType = null;
        this.aiAnalysis = null;
        
        this.init();
    }
    
    init() {
        this.loadReportData();
        this.setupEventListeners();
        this.startAIAnalysis();
    }
    
    // 加载报告数据
    loadReportData() {
        const savedReport = localStorage.getItem('currentReport');
        const savedCompletion = localStorage.getItem(`assessment_${this.getAssessmentType()}_completed`);
        
        if (savedReport) {
            this.reportData = JSON.parse(savedReport);
        } else if (savedCompletion) {
            this.reportData = JSON.parse(savedCompletion);
        } else {
            // 如果没有找到数据，返回首页
            window.location.href = 'index.html';
            return;
        }
        
        this.assessmentType = this.reportData.type;
        this.updateReportHeader();
    }
    
    // 获取测评类型
    getAssessmentType() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('type') || 'scl90';
    }
    
    // 更新报告头部信息
    updateReportHeader() {
        const assessmentData = getAssessmentConfig(this.assessmentType);
        
        document.getElementById('reportTitle').textContent = `${assessmentData.title}报告`;
        document.getElementById('reportSubtitle').textContent = `基于${assessmentData.title}的专业分析`;
        
        // 格式化日期
        const completedDate = new Date(this.reportData.completedAt || this.reportData.endTime);
        document.getElementById('reportDate').textContent = completedDate.toLocaleDateString('zh-CN');
        
        // 用时
        document.getElementById('reportDuration').textContent = `${this.reportData.duration}分钟`;
        
        // 报告编号
        const reportId = `PSY-${completedDate.getFullYear()}${String(completedDate.getMonth() + 1).padStart(2, '0')}${String(completedDate.getDate()).padStart(2, '0')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        document.getElementById('reportId').textContent = reportId;
    }
    
    // 设置事件监听器
    setupEventListeners() {
        document.getElementById('downloadReport').addEventListener('click', () => this.downloadReport());
        document.getElementById('shareReport').addEventListener('click', () => this.shareReport());
        document.getElementById('retakeAssessment').addEventListener('click', () => this.retakeAssessment());
        document.getElementById('backToHome').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    // 开始AI分析
    startAIAnalysis() {
        // 模拟AI分析过程
        this.simulateAIAnalysis().then(() => {
            this.generateReport();
        });
    }
    
    // 模拟AI分析
    async simulateAIAnalysis() {
        const steps = [
            '正在分析测评数据...',
            '正在生成心理健康评估...',
            '正在准备个性化建议...'
        ];
        
        for (let i = 0; i < steps.length; i++) {
            // 更新步骤状态
            document.querySelectorAll('.step').forEach((step, index) => {
                step.classList.toggle('active', index <= i);
            });
            
            // 模拟处理时间
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // 隐藏加载界面，显示报告内容
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('reportContent').style.display = 'block';
    }
    
    // 生成报告
    generateReport() {
        if (this.assessmentType === 'scl90') {
            this.generateSCL90Report();
        } else if (this.assessmentType === 'mbti') {
            this.generateMBTIReport();
        } else {
            this.generateGenericReport();
        }
    }
    
    // 生成SCL90专用报告
    generateSCL90Report() {
        const scores = this.calculateSCL90Scores();
        const analysis = this.generateSCL90Analysis(scores);
        
        // 更新总体评分
        this.updateOverallScore(scores);
        
        // 生成维度评分
        this.generateDimensionScores(scores);
        
        // 生成雷达图
        this.generateRadarChart(scores);
        
        // 生成详细分析
        this.generateDetailedAnalysis(analysis);
        
        // 生成建议
        this.generateRecommendations(analysis);
        
        // 生成风险评估
        this.generateRiskAssessment(analysis);
    }
    
    // 计算SCL90分数
    calculateSCL90Scores() {
        const data = getAssessmentConfig('scl90');
        const scores = {};
        let totalScore = 0;
        let positiveSymptomCount = 0;
        
        // 计算各维度分数
        for (const [dimension, info] of Object.entries(data.dimensions)) {
            let dimensionScore = 0;
            let validQuestions = 0;
            
            info.questions.forEach(questionNum => {
                const answerIndex = questionNum - 1;
                const answer = this.reportData.answers[answerIndex];
                if (answer !== null) {
                    dimensionScore += answer;
                    if (answer >= 2) positiveSymptomCount++;
                    validQuestions++;
                    totalScore += answer;
                }
            });
            
            scores[dimension] = {
                total: dimensionScore,
                average: validQuestions > 0 ? dimensionScore / validQuestions : 0,
                questionCount: validQuestions
            };
        }
        
        // 计算总体分数
        scores.totalScore = totalScore;
        scores.positiveSymptomCount = positiveSymptomCount;
        scores.averageScore = this.reportData.answers.length > 0 ? totalScore / this.reportData.answers.filter(a => a !== null).length : 0;
        
        return scores;
    }
    
    // 生成SCL90分析
    generateSCL90Analysis(scores) {
        const analysis = {
            overall: '',
            dimensions: {},
            recommendations: [],
            riskLevel: 'low',
            concerns: []
        };
        
        // 总体分析
        if (scores.averageScore < 1.5) {
            analysis.overall = '您的心理健康状况良好，各项症状表现都在正常范围内。';
            analysis.riskLevel = 'low';
        } else if (scores.averageScore < 2.5) {
            analysis.overall = '您的心理健康状况基本正常，但某些方面可能需要适当关注。';
            analysis.riskLevel = 'moderate';
        } else {
            analysis.overall = '您的心理健康状况需要关注，建议寻求专业心理健康支持。';
            analysis.riskLevel = 'high';
        }
        
        // 各维度分析
        const chineseNames = {
            '躯体化': '身体不适感',
            '强迫症状': '强迫性行为和思维',
            '人际关系敏感': '人际交往敏感性',
            '抑郁': '抑郁情绪',
            '焦虑': '焦虑水平',
            '敌对': '敌对情绪',
            '恐怖': '恐惧感',
            '偏执': '偏执思维',
            '精神病性': '精神病性症状',
            '其他': '睡眠和饮食'
        };
        
        for (const [dimension, data] of Object.entries(scores)) {
            if (dimension === 'totalScore' || dimension === 'positiveSymptomCount' || dimension === 'averageScore') continue;
            
            let level = 'good';
            let description = '';
            
            if (data.average < 1.5) {
                level = 'good';
                description = `您的${chineseNames[dimension]}处于正常范围。`;
            } else if (data.average < 2.5) {
                level = 'warning';
                description = `您的${chineseNames[dimension]}有轻度表现，建议适当关注。`;
                analysis.concerns.push(dimension);
            } else {
                level = 'concern';
                description = `您的${chineseNames[dimension]}需要重点关注，建议寻求专业帮助。`;
                analysis.concerns.push(dimension);
            }
            
            analysis.dimensions[dimension] = {
                level: level,
                score: data.average.toFixed(2),
                description: description
            };
        }
        
        // 生成建议
        if (analysis.concerns.length > 0) {
            analysis.recommendations.push({
                title: '专业咨询建议',
                description: '基于您的测评结果，建议寻求专业心理健康医生的评估和指导。',
                priority: 'high',
                tags: ['专业建议', '心理咨询']
            });
        }
        
        analysis.recommendations.push({
            title: '保持健康生活方式',
            description: '规律作息、适量运动、均衡饮食有助于维护心理健康。',
            priority: 'medium',
            tags: ['生活方式', '健康习惯']
        });
        
        analysis.recommendations.push({
            title: '压力管理',
            description: '学习有效的压力管理技巧，如深呼吸、冥想、放松训练等。',
            priority: 'medium',
            tags: ['压力管理', '放松技巧']
        });
        
        return analysis;
    }
    
    // 更新总体评分
    updateOverallScore(scores) {
        const overallScore = Math.max(0, 10 - scores.averageScore * 2);
        const scoreText = overallScore >= 7 ? '良好' : overallScore >= 5 ? '一般' : '需要关注';
        
        // 更新文本内容
        document.getElementById('overallScore').textContent = scoreText;
        document.getElementById('overallRating').textContent = `${overallScore.toFixed(1)}/10`;
        document.getElementById('overallDescription').textContent = 
            `您的心理健康状况${scoreText}，在大多数维度上表现${overallScore >= 7 ? '正常' : '需要关注'}。${overallScore >= 7 ? '建议继续保持积极的生活方式。' : '建议适当关注心理健康，必要时寻求专业支持。'}`;
        
        // 更新关键指标
        document.getElementById('positiveItems').textContent = scores.positiveSymptomCount;
        document.getElementById('avgScore').textContent = scores.averageScore.toFixed(1);
        
        // 更新仪表盘
        this.updateGaugeChart(overallScore);
    }
    
    // 生成维度评分
    generateDimensionScores(scores) {
        const container = document.getElementById('scoresGrid');
        const analysis = this.generateSCL90Analysis(scores);
        
        container.innerHTML = '';
        
        for (const [dimension, data] of Object.entries(analysis.dimensions)) {
            const scoreCard = document.createElement('div');
            scoreCard.className = `score-card ${data.level}`;
            
            const progressPercentage = Math.min(100, (parseFloat(data.score) / 5) * 100);
            
            scoreCard.innerHTML = `
                <div class="score-header">
                    <div>
                        <h4 class="score-name">${dimension}</h4>
                        <span class="score-level ${data.level}">${data.level === 'good' ? '正常' : data.level === 'warning' ? '轻度' : '关注'}</span>
                    </div>
                    <div class="score-value">${data.score}</div>
                </div>
                <p class="score-description">${data.description}</p>
                <div class="score-progress">
                    <div class="progress-bar">
                        <div class="progress-fill ${data.level}" style="width: ${progressPercentage}%"></div>
                    </div>
                    <div class="progress-text">
                        <span>1.0 (低)</span>
                        <span>5.0 (高)</span>
                    </div>
                </div>
            `;
            
            container.appendChild(scoreCard);
        }
    }
    
    // 生成详细分析
    generateDetailedAnalysis(analysis) {
        const container = document.getElementById('analysisContent');
        
        const analysisSections = [
            {
                title: '整体心理健康评估',
                icon: '🧠',
                content: analysis.overall + ' 根据您的测评结果，我们建议您关注以下几个方面：'
            },
            {
                title: '重点关注维度',
                icon: '🎯',
                content: analysis.concerns.length > 0 
                    ? `您在以下维度需要特别关注：${analysis.concerns.join('、')}。这些维度的得分相对较高，建议您采取相应的改善措施。`
                    : '您在各维度表现良好，没有特别需要关注的方面。'
            },
            {
                title: '心理状态分析',
                icon: '📊',
                content: '您的测评结果显示整体心理健康状况' + (analysis.riskLevel === 'low' ? '良好' : analysis.riskLevel === 'moderate' ? '基本正常' : '需要关注') + 
                    '。建议您根据具体情况采取相应的维护或改善措施。'
            }
        ];
        
        container.innerHTML = analysisSections.map(section => `
            <div class="analysis-section">
                <h3 class="analysis-title">
                    <span class="analysis-icon">${section.icon}</span>
                    ${section.title}
                </h3>
                <div class="analysis-text">${section.content}</div>
            </div>
        `).join('');
    }
    
    // 生成建议
    generateRecommendations(analysis) {
        const container = document.getElementById('recommendationsGrid');
        
        // 基础建议
        const baseRecommendations = [
            {
                title: '保持规律作息',
                description: '建立规律的作息时间，保证充足的睡眠，有助于维护心理健康。',
                icon: '🕐',
                priority: 'medium',
                tags: ['作息规律', '睡眠质量']
            },
            {
                title: '适量运动锻炼',
                description: '定期进行适量的体育锻炼，可以有效缓解压力，改善情绪状态。',
                icon: '🏃‍♂️',
                priority: 'medium',
                tags: ['体育锻炼', '压力缓解']
            },
            {
                title: '健康饮食',
                description: '保持均衡的饮食习惯，避免过度摄入咖啡因和糖分，有助于情绪稳定。',
                icon: '🥗',
                priority: 'medium',
                tags: ['健康饮食', '情绪稳定']
            },
            {
                title: '社交支持',
                description: '与家人朋友保持良好的社交关系，在需要时寻求情感支持。',
                icon: '👥',
                priority: 'medium',
                tags: ['社交支持', '情感交流']
            }
        ];
        
        const allRecommendations = [...analysis.recommendations, ...baseRecommendations];
        
        container.innerHTML = allRecommendations.map(rec => `
            <div class="recommendation-card">
                <div class="recommendation-header">
                    <div class="recommendation-icon">${rec.icon}</div>
                    <h4 class="recommendation-title">${rec.title}</h4>
                </div>
                <p class="recommendation-description">${rec.description}</p>
                <div class="recommendation-actions">
                    <span class="recommendation-tag ${rec.priority}">${rec.priority === 'high' ? '高优先级' : rec.priority === 'medium' ? '中优先级' : '低优先级'}</span>
                    ${rec.tags.map(tag => `<span class="recommendation-tag">${tag}</span>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
    
    // 生成风险评估
    generateRiskAssessment(analysis) {
        const container = document.getElementById('riskContent');
        
        const riskLevels = {
            low: {
                text: '低风险',
                color: 'low',
                description: '您的心理健康风险较低，整体状况良好。建议继续保持现有的健康生活方式，定期进行心理健康评估。'
            },
            moderate: {
                text: '中等风险',
                color: 'moderate',
                description: '您存在一定程度的心理健康风险，建议适当关注相关症状，必要时寻求专业支持。通过积极的自我调节和生活方式改善，可以有效降低风险。'
            },
            high: {
                text: '高风险',
                color: 'high',
                description: '您的心理健康风险较高，建议及时寻求专业心理健康医生的评估和指导。早期干预可以有效预防问题的进一步发展。'
            }
        };
        
        const risk = riskLevels[analysis.riskLevel];
        
        // 获取分数数据
        const scores = this.calculateSCL90Scores();
        
        container.innerHTML = `
            <div class="risk-level ${risk.color}">
                <span>⚠️</span>
                心理健康风险等级: ${risk.text}
            </div>
            <p class="risk-description">${risk.description}</p>
            <div class="risk-indicators">
                <div class="risk-indicator">
                    <div class="indicator-label">关注维度</div>
                    <div class="indicator-value">${analysis.concerns.length}个</div>
                </div>
                <div class="risk-indicator">
                    <div class="indicator-label">平均得分</div>
                    <div class="indicator-value">${scores.averageScore.toFixed(2)}</div>
                </div>
                <div class="risk-indicator">
                    <div class="indicator-label">阳性项目</div>
                    <div class="indicator-value">${scores.positiveSymptomCount}个</div>
                </div>
                <div class="risk-indicator">
                    <div class="indicator-label">建议措施</div>
                    <div class="indicator-value">${analysis.recommendations.length}项</div>
                </div>
            </div>
        `;
    }
    
    // 生成MBTI专用报告
    generateMBTIReport() {
        const mbtiType = this.calculateMBTIType();
        const analysis = this.generateMBTIAnalysis(mbtiType);
        
        // 更新总体评分
        this.updateMBTIOverallScore(mbtiType, analysis);
        
        // 生成维度评分
        this.generateMBTIDimensionScores(mbtiType);
        
        // 生成详细分析
        this.generateMBTIDetailedAnalysis(mbtiType, analysis);
        
        // 生成建议
        this.generateMBTIRecommendations(mbtiType, analysis);
        
        // 生成风险评估
        this.generateMBTIRiskAssessment(mbtiType, analysis);
    }
    
    // 计算MBTI类型
    calculateMBTIType() {
        const answers = this.reportData.answers;
        let eCount = 0, iCount = 0;  // 外向/内向
        let sCount = 0, nCount = 0;  // 感觉/直觉
        let tCount = 0, fCount = 0;  // 思考/情感
        let jCount = 0, pCount = 0;  // 判断/知觉
        
        // 简化的MBTI计算逻辑
        for (let i = 0; i < Math.min(answers.length, 60); i++) {
            const answer = answers[i];
            if (answer !== null) {
                // 根据题目索引判断维度
                if (i % 4 === 0) {  // E/I 维度
                    if (answer >= 3) eCount++; else iCount++;
                } else if (i % 4 === 1) {  // S/N 维度
                    if (answer >= 3) sCount++; else nCount++;
                } else if (i % 4 === 2) {  // T/F 维度
                    if (answer >= 3) tCount++; else fCount++;
                } else {  // J/P 维度
                    if (answer >= 3) jCount++; else pCount++;
                }
            }
        }
        
        const mbtiType = 
            (eCount > iCount ? 'E' : 'I') +
            (sCount > nCount ? 'S' : 'N') +
            (tCount > fCount ? 'T' : 'F') +
            (jCount > pCount ? 'J' : 'P');
            
        return {
            type: mbtiType,
            dimensions: {
                'EI': eCount > iCount ? 'E' : 'I',
                'SN': sCount > nCount ? 'S' : 'N',
                'TF': tCount > fCount ? 'T' : 'F',
                'JP': jCount > pCount ? 'J' : 'P'
            },
            scores: {
                '外向(E)': eCount,
                '内向(I)': iCount,
                '感觉(S)': sCount,
                '直觉(N)': nCount,
                '思考(T)': tCount,
                '情感(F)': fCount,
                '判断(J)': jCount,
                '知觉(P)': pCount
            }
        };
    }
    
    // 生成MBTI分析
    generateMBTIAnalysis(mbtiType) {
        const mbtiDescriptions = {
            'INTJ': {
                title: '建筑师',
                description: '富有想象力和战略性的思想家',
                strengths: ['战略思维', '独立自主', '追求完美'],
                challenges: ['过于理想化', '缺乏耐心', '社交困难']
            },
            'INTP': {
                title: '逻辑学家',
                description: '具有创新精神的发明家，对知识有着止不住的渴望',
                strengths: ['逻辑思维', '创新能力', '好奇心强'],
                challenges: ['拖延倾向', '不善于表达', '过于理性']
            },
            'ENTJ': {
                title: '指挥官',
                description: '大胆、富有想象力和意志强烈的领导者',
                strengths: ['领导能力', '目标导向', '决策果断'],
                challenges: ['过于强势', '缺乏耐心', '忽视他人感受']
            },
            'ENTP': {
                title: '辩论家',
                description: '聪明好奇的思想家，不会放弃智力挑战',
                strengths: ['创新思维', '适应性强', '善于辩论'],
                challenges: ['注意力分散', '缺乏执行力', '争强好胜']
            },
            'INFJ': {
                title: '提倡者',
                description: '安静而神秘，同时鼓舞他人并充满热情',
                strengths: ['洞察力强', '富有同理心', '追求意义'],
                challenges: ['过于理想化', '容易倦怠', '过度敏感']
            },
            'INFP': {
                title: '调停者',
                description: '诗意、善良和利他的人，总是热切地帮助正义事业',
                strengths: ['创造力强', '价值观坚定', '善解人意'],
                challenges: ['过于理想化', '决策困难', '容易受伤']
            },
            'ENFJ': {
                title: '主人公',
                description: '有魅力、鼓舞人心的领导者，有感化他人的能力',
                strengths: ['领导能力', '同理心强', '善于沟通'],
                challenges: ['过度关心他人', '缺乏自我关注', '决策情绪化']
            },
            'ENFP': {
                title: '竞选者',
                description: '热情、有创造力和有社交能力的真正自由精神',
                strengths: ['热情洋溢', '创造力强', '人际交往'],
                challenges: ['注意力分散', '缺乏条理', '过度承诺']
            },
            'ISTJ': {
                title: '物流师',
                description: '实用且注重事实的个人，可靠性不容怀疑',
                strengths: ['责任心强', '注重细节', '可靠稳定'],
                challenges: ['缺乏灵活性', '过于传统', '不善变通']
            },
            'ISFJ': {
                title: '守护者',
                description: '非常专注和温暖的守护者，时刻准备保护爱的人',
                strengths: ['细心体贴', '忠诚可靠', '服务精神'],
                challenges: ['过度自我牺牲', '抗拒改变', '过度保护']
            },
            'ESTJ': {
                title: '总经理',
                description: '出色的管理者，在管理事物或事情方面无与伦比',
                strengths: ['组织能力强', '务实高效', '领导能力'],
                challenges: ['过于严格', '缺乏灵活性', '传统保守']
            },
            'ESFJ': {
                title: '执政官',
                description: '极其有同理心、受欢迎和有社交能力的人，总是热心帮助他人',
                strengths: ['社交能力强', '关心他人', '责任感强'],
                challenges: ['过度关心他人', '缺乏自我关注', '抗拒改变']
            },
            'ISTP': {
                title: '鉴赏家',
                description: '大胆而实用的实验家，擅长使用各种工具',
                strengths: ['实践能力强', '冷静沉着', '适应性强'],
                challenges: ['缺乏长期规划', '不善表达', '冒险倾向']
            },
            'ISFP': {
                title: '探险家',
                description: '灵活而有魅力的艺术家，时刻准备探索新的可能性',
                strengths: ['艺术天赋', '温和友善', '热爱生活'],
                challenges: ['缺乏计划性', '过于敏感', '避免冲突']
            },
            'ESTP': {
                title: '企业家',
                description: '聪明、精力充沛的感知者，真心享受生活在边缘',
                strengths: ['适应性强', '务实高效', '乐观开朗'],
                challenges: ['缺乏长远规划', '冲动行事', '缺乏耐心']
            },
            'ESFP': {
                title: '娱乐家',
                description: '自发的、精力充沛和热情的表演者，生活在他们周围从不缺少',
                strengths: ['热情开朗', '人际交往', '活在当下'],
                challenges: ['缺乏计划性', '注意力分散', '避免冲突']
            }
        };
        
        const typeInfo = mbtiDescriptions[mbtiType.type] || {
            title: '独特个性',
            description: '您具有独特的人格特质组合',
            strengths: ['适应性强', '学习能力', '自我认知'],
            challenges: ['需要发展', '平衡生活', '持续成长']
        };
        
        return {
            ...typeInfo,
            mbtiType: mbtiType,
            riskLevel: 'low'
        };
    }
    
    // 更新MBTI总体评分
    updateMBTIOverallScore(mbtiType, analysis) {
        // 更新文本内容
        document.getElementById('overallScore').textContent = `${mbtiType.type} - ${analysis.title}`;
        document.getElementById('overallRating').textContent = '人格类型';
        document.getElementById('overallDescription').textContent = 
            `您的MBTI人格类型是${mbtiType.type}（${analysis.title}）。${analysis.description}`;
        
        // 更新关键指标
        document.getElementById('positiveItems').textContent = '4个维度';
        document.getElementById('avgScore').textContent = '60道题';
        
        // 更新仪表盘
        this.updateGaugeChart(8.5);
    }
    
    // 生成MBTI维度评分
    generateMBTIDimensionScores(mbtiType) {
        const container = document.getElementById('scoresGrid');
        container.innerHTML = '';
        
        const dimensions = [
            {
                name: '外向(E) - 内向(I)',
                value: mbtiType.dimensions.EI,
                description: mbtiType.dimensions.EI === 'E' ? '您更偏向外向，从社交中获得能量' : '您更偏内向，从独处中获得能量'
            },
            {
                name: '感觉(S) - 直觉(N)',
                value: mbtiType.dimensions.SN,
                description: mbtiType.dimensions.SN === 'S' ? '您更关注具体事实和细节' : '您更关注可能性和模式'
            },
            {
                name: '思考(T) - 情感(F)',
                value: mbtiType.dimensions.TF,
                description: mbtiType.dimensions.TF === 'T' ? '您更基于逻辑和客观分析做决定' : '您更基于价值观和他人感受做决定'
            },
            {
                name: '判断(J) - 知觉(P)',
                value: mbtiType.dimensions.JP,
                description: mbtiType.dimensions.JP === 'J' ? '您更喜欢有计划、有组织的生活方式' : '您更喜欢灵活、随性的生活方式'
            }
        ];
        
        dimensions.forEach(dimension => {
            const scoreCard = document.createElement('div');
            scoreCard.className = 'score-card good';
            
            scoreCard.innerHTML = `
                <div class="score-header">
                    <div>
                        <h4 class="score-name">${dimension.name}</h4>
                        <span class="score-level good">偏向${dimension.value}</span>
                    </div>
                    <div class="score-value">${dimension.value}</div>
                </div>
                <p class="score-description">${dimension.description}</p>
            `;
            
            container.appendChild(scoreCard);
        });
    }
    
    // 生成MBTI详细分析
    generateMBTIDetailedAnalysis(mbtiType, analysis) {
        const container = document.getElementById('analysisContent');
        
        const analysisSections = [
            {
                title: `${mbtiType.type} - ${analysis.title}`,
                icon: '🧠',
                content: `${analysis.description}。您在四个维度上的偏好组合形成了独特的人格特质。`
            },
            {
                title: '核心优势',
                icon: '💪',
                content: `您的主要优势包括：${analysis.strengths.join('、')}。这些特质使您在特定的环境和情境中表现出色。`
            },
            {
                title: '发展建议',
                icon: '🎯',
                content: `您可以关注以下方面的成长：${analysis.challenges.join('、')}。认识到这些潜在挑战有助于您的个人发展。`
            }
        ];
        
        container.innerHTML = analysisSections.map(section => `
            <div class="analysis-section">
                <h3 class="analysis-title">
                    <span class="analysis-icon">${section.icon}</span>
                    ${section.title}
                </h3>
                <div class="analysis-text">${section.content}</div>
            </div>
        `).join('');
    }
    
    // 生成MBTI建议
    generateMBTIRecommendations(mbtiType, analysis) {
        const container = document.getElementById('recommendationsGrid');
        
        const recommendations = [
            {
                title: '了解您的优势',
                description: '深入了解并发挥您的${analysis.strengths[0]}特质，在工作和生活中找到适合发挥这些优势的领域。',
                icon: '🎯',
                priority: 'high',
                tags: ['优势发展', '自我认知']
            },
            {
                title: '平衡发展',
                description: '关注您的${analysis.challenges[0]}倾向，尝试在保持本色的同时发展相对薄弱的方面。',
                icon: '⚖️',
                priority: 'medium',
                tags: ['个人成长', '平衡发展']
            },
            {
                title: '适合的职业方向',
                description: '基于您的${mbtiType.type}人格类型，考虑选择与您天性相符的职业发展路径。',
                icon: '💼',
                priority: 'medium',
                tags: ['职业规划', '发展方向']
            },
            {
                title: '人际关系建议',
                description: '了解您的人格特质如何影响人际交往，建立更和谐的社交关系。',
                icon: '👥',
                priority: 'medium',
                tags: ['人际关系', '沟通技巧']
            }
        ];
        
        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-card">
                <div class="recommendation-header">
                    <div class="recommendation-icon">${rec.icon}</div>
                    <h4 class="recommendation-title">${rec.title}</h4>
                </div>
                <p class="recommendation-description">${rec.description}</p>
                <div class="recommendation-actions">
                    <span class="recommendation-tag ${rec.priority}">${rec.priority === 'high' ? '高优先级' : rec.priority === 'medium' ? '中优先级' : '低优先级'}</span>
                    ${rec.tags.map(tag => `<span class="recommendation-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }
    
    // 生成MBTI风险评估
    generateMBTIRiskAssessment(mbtiType, analysis) {
        const container = document.getElementById('riskContent');
        
        container.innerHTML = `
            <div class="risk-level low">
                <span>🟢</span>
                风险等级: 低风险
            </div>
            <p class="risk-description">
                MBTI人格测试是性格评估工具，不存在心理健康风险。您的${mbtiType.type}人格类型代表您的自然偏好和倾向，没有好坏之分。
                建议您将测试结果作为自我了解和发展的参考，而不是评判自己的标准。
            </p>
            <div class="risk-indicators">
                <div class="risk-indicator">
                    <div class="indicator-label">人格类型</div>
                    <div class="indicator-value">${mbtiType.type}</div>
                </div>
                <div class="risk-indicator">
                    <div class="indicator-label">核心优势</div>
                    <div class="indicator-value">${analysis.strengths.length}项</div>
                </div>
                <div class="risk-indicator">
                    <div class="indicator-label">发展建议</div>
                    <div class="indicator-value">${analysis.challenges.length}项</div>
                </div>
                <div class="risk-indicator">
                    <div class="indicator-label">风险等级</div>
                    <div class="indicator-value">低风险</div>
                </div>
            </div>
        `;
    }
    
    // 生成通用报告（非SCL90）
    generateGenericReport() {
        // 这里可以实现其他测评类型的报告生成逻辑
        const container = document.getElementById('scoresGrid');
        container.innerHTML = '<p>该测评类型的详细报告功能正在开发中...请查看总体分析。</p>';
        
        // 生成基础分析
        this.generateBasicAnalysis();
    }
    
    // 生成基础分析
    generateBasicAnalysis() {
        const container = document.getElementById('analysisContent');
        
        const assessmentData = getAssessmentConfig(this.assessmentType);
        const avgScore = this.reportData.answers.reduce((sum, answer) => sum + (answer || 0), 0) / this.reportData.answers.filter(a => a !== null).length;
        
        container.innerHTML = `
            <div class="analysis-section">
                <h3 class="analysis-title">
                    <span class="analysis-icon">📊</span>
                    测评结果分析
                </h3>
                <div class="analysis-text">
                    <p>您已完成${assessmentData.title}，平均得分为${avgScore.toFixed(2)}分。\u003c/p>
                    <p>测评用时${this.reportData.duration}分钟，完成${this.reportData.answers.filter(a => a !== null).length}道题目。\u003c/p>
                    <p>详细的分析报告功能正在开发中，敬请期待。\u003c/p>
                </div>
            </div>
        `;
    }
    
    // 下载报告
    downloadReport() {
        this.generatePDFReport();
    }
    
    // 生成PDF报告
    generatePDFReport() {
        const assessmentData = getAssessmentConfig(this.assessmentType);
        const reportTitle = `${assessmentData.title}报告`;
        
        // 创建打印样式
        this.setupPrintStyles();
        
        // 准备报告数据
        const reportData = this.preparePDFData();
        
        // 创建新窗口用于打印
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('请允许弹出窗口以生成PDF报告');
            return;
        }
        
        // 生成打印内容
        const printContent = this.generatePrintHTML(reportTitle, reportData);
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // 等待内容加载完成后触发打印
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 1000);
    }
    
    // 设置打印样式
    setupPrintStyles() {
        const printStyles = `
            @media print {
                body * {
                    visibility: hidden;
                }
                #reportContent, #reportContent * {
                    visibility: visible;
                }
                #reportContent {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
                .report-actions, .dashboard-header {
                    display: none !important;
                }
                .loading-screen {
                    display: none !important;
                }
                .section-title {
                    page-break-after: avoid;
                    margin-top: 20px;
                }
                .score-card, .recommendation-card {
                    page-break-inside: avoid;
                }
            }
        `;
        
        // 检查是否已存在打印样式
        let printStyleElement = document.getElementById('print-styles');
        if (!printStyleElement) {
            printStyleElement = document.createElement('style');
            printStyleElement.id = 'print-styles';
            printStyleElement.type = 'text/css';
            printStyleElement.innerHTML = printStyles;
            document.head.appendChild(printStyleElement);
        }
    }
    
    // 准备PDF数据
    preparePDFData() {
        const now = new Date();
        const reportData = {
            reportTitle: document.getElementById('reportTitle')?.textContent || '心理测评报告',
            reportSubtitle: document.getElementById('reportSubtitle')?.textContent || '',
            reportDate: document.getElementById('reportDate')?.textContent || now.toLocaleDateString('zh-CN'),
            reportDuration: document.getElementById('reportDuration')?.textContent || '未知',
            reportId: document.getElementById('reportId')?.textContent || 'N/A',
            overallScore: document.getElementById('overallScore')?.textContent || '未知',
            overallDescription: document.getElementById('overallDescription')?.textContent || '',
            assessmentType: this.assessmentType,
            sections: []
        };
        
        // 收集各部分内容
        const scoreCards = document.querySelectorAll('.score-card');
        if (scoreCards.length > 0) {
            reportData.sections.push({
                title: '维度评分',
                items: Array.from(scoreCards).map(card => {
                    const title = card.querySelector('.score-name')?.textContent || '';
                    const value = card.querySelector('.score-value')?.textContent || '';
                    const description = card.querySelector('.score-description')?.textContent || '';
                    return { title, value, description };
                })
            });
        }
        
        const analysisSections = document.querySelectorAll('.analysis-section');
        if (analysisSections.length > 0) {
            reportData.sections.push({
                title: '详细分析',
                items: Array.from(analysisSections).map(section => {
                    const title = section.querySelector('.analysis-title')?.textContent || '';
                    const content = section.querySelector('.analysis-text')?.textContent || '';
                    return { title, content };
                })
            });
        }
        
        const recommendationCards = document.querySelectorAll('.recommendation-card');
        if (recommendationCards.length > 0) {
            reportData.sections.push({
                title: '个性化建议',
                items: Array.from(recommendationCards).map(card => {
                    const title = card.querySelector('.recommendation-title')?.textContent || '';
                    const description = card.querySelector('.recommendation-description')?.textContent || '';
                    return { title, description };
                })
            });
        }
        
        const riskContent = document.querySelector('.risk-description');
        const riskLevel = document.querySelector('.risk-level');
        if (riskContent && riskLevel) {
            reportData.sections.push({
                title: '风险评估',
                items: [
                    { title: '风险等级', content: riskLevel?.textContent || '' },
                    { title: '详细说明', content: riskContent?.textContent || '' }
                ]
            });
        }
        
        return reportData;
    }
    
    // 生成打印HTML
    generatePrintHTML(reportTitle, reportData) {
        const currentDate = new Date().toLocaleDateString('zh-CN');
        const assessmentType = this.assessmentType;
        const isMBTI = assessmentType === 'mbti';
        
        return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportTitle}</title>
    <style>
        /* 复制HTML页面的CSS变量和样式 */
        :root {
            --report-primary: #1976D2;
            --report-secondary: #2E7D32;
            --report-accent: #FF9800;
            --report-success: #4CAF50;
            --report-warning: #F59E0B;
            --report-error: #E57373;
            --report-bg: #F8FBF9;
            --report-card: #FFFFFF;
            --report-text: #263238;
            --report-text-secondary: #546E7A;
            --report-border: rgba(25, 118, 210, 0.1);
            --report-shadow: 0 4px 16px rgba(25, 118, 210, 0.08);
        }
        
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif;
            line-height: 1.6;
            color: var(--report-text);
            margin: 0;
            padding: 0;
            background: var(--report-bg);
        }
        
        .report-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1.5rem;
        }
        
        .report-content {
            background: var(--report-card);
            border-radius: 16px;
            box-shadow: var(--report-shadow);
            overflow: hidden;
            border: 1px solid var(--report-border);
        }
        
        /* 报告头部 */
        .report-header {
            background: linear-gradient(135deg, var(--report-primary) 0%, var(--report-secondary) 100%);
            color: white;
            padding: 3rem 2rem 2.5rem;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .report-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
            opacity: 0.1;
        }
        
        .report-title-section {
            margin-bottom: 1.5rem;
            position: relative;
            z-index: 1;
            padding: 0 3rem;
        }
        
        .report-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            line-height: 1.2;
            letter-spacing: -0.025em;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .report-subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
            margin-bottom: 0;
            font-weight: 400;
            letter-spacing: 0.5px;
        }
        
        .report-meta {
            display: flex;
            justify-content: center;
            gap: 3rem;
            flex-wrap: wrap;
            margin-top: 1.5rem;
            padding: 0 2rem;
            position: relative;
            z-index: 1;
        }
        
        .meta-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }
        
        .meta-label {
            font-size: 1rem;
            opacity: 0.8;
            font-weight: 500;
        }
        
        .meta-value {
            font-size: 1.2rem;
            font-weight: 600;
        }
        
        /* 区块样式 */
        .assessment-overview, .dimension-scores, .detailed-analysis, .recommendations, .risk-assessment {
            padding: 2rem 1.5rem;
            margin: 1rem 0;
        }
        
        .assessment-overview {
            background: linear-gradient(135deg, var(--report-bg) 0%, var(--report-card) 100%);
        }
        
        .dimension-scores, .recommendations {
            background: var(--report-bg);
        }
        
        .detailed-analysis, .risk-assessment {
            background: #F8FAFC;
        }
        
        .section-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--report-text);
            margin-bottom: 1.5rem;
            text-align: center;
            padding: 0 1rem;
        }
        
        /* 评分卡片 */
        .score-card {
            background: var(--report-card);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: var(--report-shadow);
            border: 1px solid var(--report-border);
            page-break-inside: avoid;
        }
        
        .score-card.good {
            border-left: 4px solid var(--report-success);
            background: linear-gradient(135deg, #ffffff 0%, #f0fff4 100%);
        }
        
        .score-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .score-name {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--report-text);
            margin-bottom: 0.25rem;
        }
        
        .score-level {
            font-size: 0.9rem;
            font-weight: 500;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .score-level.good {
            background: #D1FAE5;
            color: #065F46;
        }
        
        .score-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--report-text);
        }
        
        .score-description {
            color: var(--report-text-secondary);
            font-size: 0.9rem;
            line-height: 1.4;
            margin-top: 0.5rem;
        }
        
        /* 分析区块 */
        .analysis-section {
            margin-bottom: 2rem;
            page-break-inside: avoid;
        }
        
        .analysis-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--report-text);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .analysis-text {
            color: var(--report-text-secondary);
            line-height: 1.7;
            font-size: 1rem;
        }
        
        /* 建议卡片 */
        .recommendation-card {
            background: var(--report-card);
            border: 1px solid var(--report-border);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            page-break-inside: avoid;
            transition: all 0.3s ease;
        }
        
        .recommendation-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1rem;
        }
        
        .recommendation-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--report-text);
            margin-bottom: 0;
        }
        
        .recommendation-description {
            color: var(--report-text-secondary);
            line-height: 1.6;
            margin-bottom: 1rem;
        }
        
        .recommendation-tag {
            background: #F3F4F6;
            color: #6B7280;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
            display: inline-block;
            margin-right: 0.5rem;
            margin-bottom: 0.5rem;
        }
        
        /* 风险评估 */
        .risk-level {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            margin-bottom: 1.5rem;
        }
        
        .risk-level.low {
            background: #D1FAE5;
            color: #065F46;
        }
        
        .risk-description {
            color: var(--report-text-secondary);
            line-height: 1.7;
            margin-bottom: 2rem;
        }
        
        .risk-indicators {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .risk-indicator {
            background: var(--report-card);
            border-radius: 8px;
            padding: 1rem;
            text-align: center;
            border: 1px solid var(--report-border);
        }
        
        .indicator-label {
            font-size: 0.9rem;
            color: var(--report-text-secondary);
            margin-bottom: 0.5rem;
        }
        
        .indicator-value {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--report-text);
        }
        
        /* 总体评估 */
        .overview-card {
            background: var(--report-card);
            border-radius: 16px;
            padding: 2rem 1.5rem;
            box-shadow: var(--report-shadow);
            border: 1px solid var(--report-border);
            margin-bottom: 2rem;
        }
        
        .overview-content {
            margin-top: 1.5rem;
        }
        
        .key-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 1.5rem;
            padding: 1.5rem;
            background: linear-gradient(135deg, var(--report-bg) 0%, var(--report-card) 100%);
            border-radius: 12px;
            border: 1px solid var(--report-border);
            margin: 1rem 0;
        }
        
        .metric-item {
            text-align: center;
            padding: 1rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .metric-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--report-primary);
            margin-bottom: 0.25rem;
        }
        
        .metric-label {
            font-size: 0.85rem;
            color: var(--report-text-secondary);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* 页脚 */
        .disclaimer {
            padding: 2rem 1.5rem;
            background: #FEF3C7;
            border-top: 1px solid #F59E0B;
            margin: 1rem 0;
        }
        
        .disclaimer-content h4 {
            color: #92400E;
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }
        
        .disclaimer-content ul {
            margin: 0;
            padding-left: 1.5rem;
            color: #92400E;
        }
        
        .disclaimer-content li {
            margin-bottom: 0.5rem;
            line-height: 1.5;
        }
        
        /* 打印优化 */
        @media print {
            body {
                background: white;
            }
            
            .report-container {
                padding: 0;
                max-width: none;
            }
            
            .assessment-overview, .dimension-scores, .detailed-analysis, .recommendations, .risk-assessment {
                margin: 0;
                page-break-inside: avoid;
            }
            
            .score-card, .recommendation-card, .overview-card {
                page-break-inside: avoid;
                page-break-after: auto;
            }
            
            .section-title {
                page-break-after: avoid;
            }
            
            .disclaimer {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <div class="report-content">
            <!-- 报告头部 -->
            <div class="report-header">
                <div class="report-title-section">
                    <h1 class="report-title">${reportData.reportTitle}</h1>
                    <p class="report-subtitle">${reportData.reportSubtitle}</p>
                </div>
                <div class="report-meta">
                    <div class="meta-item">
                        <span class="meta-label">测评时间</span>
                        <span class="meta-value">${reportData.reportDate}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">完成用时</span>
                        <span class="meta-value">${reportData.reportDuration}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">报告编号</span>
                        <span class="meta-value">${reportData.reportId}</span>
                    </div>
                </div>
            </div>
            
            <!-- 总体评估 -->
            <div class="assessment-overview">
                <div class="overview-card">
                    <h2 class="section-title">测评结果概述</h2>
                    <div class="overview-content">
                        <div class="key-metrics">
                            <div class="metric-item">
                                <div class="metric-value">${isMBTI ? '4' : '90'}</div>
                                <div class="metric-label">${isMBTI ? '维度' : '测评项目'}</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${isMBTI ? '60' : reportData.positiveItems || '0'}</div>
                                <div class="metric-label">${isMBTI ? '道题' : '阳性项目'}</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${reportData.avgScore || 'N/A'}</div>
                                <div class="metric-label">${isMBTI ? '道题' : '平均得分'}</div>
                            </div>
                        </div>
                        <div class="analysis-text">
                            <strong>${reportData.overallScore}</strong><br><br>
                            ${reportData.overallDescription}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 维度评分 -->
            ${reportData.sections.find(s => s.title === '维度评分') ? `
            <div class="dimension-scores">
                <h2 class="section-title">各维度评估</h2>
                ${reportData.sections.find(s => s.title === '维度评分').items.map(item => `
                    <div class="score-card good">
                        <div class="score-header">
                            <div>
                                <h4 class="score-name">${item.title}</h4>
                                <span class="score-level good">${item.value || '正常'}</span>
                            </div>
                            <div class="score-value">${item.value || '正常'}</div>
                        </div>
                        <p class="score-description">${item.description}</p>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <!-- 详细分析 -->
            ${reportData.sections.find(s => s.title === '详细分析') ? `
            <div class="detailed-analysis">
                <h2 class="section-title">AI深度分析</h2>
                ${reportData.sections.find(s => s.title === '详细分析').items.map(item => `
                    <div class="analysis-section">
                        <h3 class="analysis-title">
                            ${item.title.includes('🧠') || item.title.includes('💪') || item.title.includes('🎯') ? item.title : `🧠 ${item.title}`}
                        </h3>
                        <div class="analysis-text">${item.content}</div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <!-- 个性化建议 -->
            ${reportData.sections.find(s => s.title === '个性化建议') ? `
            <div class="recommendations">
                <h2 class="section-title">个性化建议</h2>
                ${reportData.sections.find(s => s.title === '个性化建议').items.map(item => `
                    <div class="recommendation-card">
                        <div class="recommendation-header">
                            <div class="recommendation-icon">💡</div>
                            <h4 class="recommendation-title">${item.title}</h4>
                        </div>
                        <p class="recommendation-description">${item.description}</p>
                        <div class="recommendation-actions">
                            <span class="recommendation-tag">个人发展</span>
                            <span class="recommendation-tag">成长建议</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <!-- 风险评估 -->
            ${reportData.sections.find(s => s.title === '风险评估') ? `
            <div class="risk-assessment">
                <h2 class="section-title">风险评估</h2>
                ${reportData.sections.find(s => s.title === '风险评估').items.map(item => `
                    ${item.title === '风险等级' ? `
                        <div class="risk-level low">
                            <span>🟢</span>
                            ${item.content}
                        </div>
                    ` : ''}
                    ${item.title === '详细说明' ? `
                        <p class="risk-description">${item.content}</p>
                    ` : ''}
                `).join('')}
            </div>
            ` : ''}
            
            <!-- 重要声明 -->
            <div class="disclaimer">
                <div class="disclaimer-content">
                    <h4>重要声明</h4>
                    <ul>
                        <li>本报告基于您提供的测评数据生成，仅供参考，不能替代专业医疗诊断</li>
                        <li>如测评结果显示需要关注的心理健康问题，建议咨询专业心理健康医生</li>
                        <li>测评结果可能受到多种因素影响，包括测试时的情绪状态、环境等</li>
                        <li>建议您定期进行心理健康评估，持续关注心理健康状况</li>
                        <li>如需紧急心理援助，请拨打心理危机干预热线</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // 自动触发打印
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 500);
        };
    </script>
</body>
</html>
        `;
    }
    
    // 分享报告
    shareReport() {
        if (navigator.share) {
            navigator.share({
                title: '我的心理健康测评报告',
                text: '我刚刚完成了心理健康测评，查看我的测评结果和建议！',
                url: window.location.href
            }).then(() => {
                console.log('分享成功');
            }).catch((error) => {
                console.log('分享失败:', error);
                this.copyShareLink();
            });
        } else {
            this.copyShareLink();
        }
    }
    
    // 复制分享链接
    copyShareLink() {
        const shareText = `我刚刚完成了心理健康测评，查看我的测评结果和建议！ ${window.location.href}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('分享链接已复制到剪贴板！');
            }).catch(() => {
                this.fallbackCopyText(shareText);
            });
        } else {
            this.fallbackCopyText(shareText);
        }
    }
    
    // 备用复制文本方法
    fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            alert('分享链接已复制到剪贴板！');
        } catch (err) {
            console.error('复制失败:', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    // 重新测评
    retakeAssessment() {
        if (confirm('确定要重新进行测评吗？当前报告数据将被清除。')) {
            // 清除当前报告数据
            localStorage.removeItem('currentReport');
            localStorage.removeItem(`assessment_${this.assessmentType}_completed`);
            
            // 跳转到测评页面
            window.location.href = `assessment.html?type=${this.assessmentType}`;
        }
    }
    
    // 获取SCL90分数解释
    getSCL90ScoreInterpretation(score) {
        if (score < 1.5) return '正常范围';
        if (score < 2.5) return '轻度异常';
        if (score < 3.5) return '中度异常';
        return '重度异常';
    }
    
    // 获取风险等级颜色
    getRiskLevelColor(level) {
        switch (level) {
            case 'low': return '#48BB78';
            case 'moderate': return '#F59E0B';
            case 'high': return '#EF4444';
            default: return '#6B7280';
        }
    }
    
    // 更新仪表盘图表
    updateGaugeChart(score) {
        const gaugeScore = document.getElementById('gaugeScore');
        const gaugeProgress = document.getElementById('gaugeProgress');
        
        if (gaugeScore && gaugeProgress) {
            // 动画更新分数
            this.animateNumber(gaugeScore, 0, score, 1500);
            
            // 计算进度角度 (0-180度)
            const progressAngle = (score / 10) * 180;
            
            // 动画更新进度
            setTimeout(() => {
                gaugeProgress.style.transform = `rotate(${-90 + progressAngle}deg)`;
            }, 300);
        }
    }
    
    // 数字动画
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (end - start) * easeOutQuart;
            
            element.textContent = current.toFixed(1);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // 生成雷达图
    generateRadarChart(scores) {
        // 先创建雷达图区域
        this.createRadarChartSection();
        
        // 等待DOM更新后获取雷达图容器
        setTimeout(() => {
            const radarContainer = document.querySelector('.radar-chart');
            if (!radarContainer) {
                console.error('雷达图容器创建失败');
                return;
            }
            
            // 准备雷达图数据
            const dimensions = [];
            const values = [];
            const maxValue = 5;
            
            for (const [dimension, data] of Object.entries(scores)) {
                if (dimension !== 'totalScore' && dimension !== 'positiveSymptomCount' && dimension !== 'averageScore') {
                    dimensions.push(dimension);
                    values.push(data.average);
                }
            }
            
            // 确保有数据才绘制
            if (dimensions.length > 0 && values.length > 0) {
                this.drawRadarChart(radarContainer, dimensions, values, maxValue);
            }
        }, 100);
    }
    
    // 创建雷达图区域
    createRadarChartSection() {
        const dimensionScores = document.querySelector('.dimension-scores');
        if (!dimensionScores) return;
        
        // 检查是否已经存在雷达图区域
        if (document.querySelector('.radar-section')) {
            return;
        }
        
        const radarSection = document.createElement('div');
        radarSection.className = 'radar-section';
        radarSection.innerHTML = `
            <h3 class="section-title">多维度心理健康雷达图</h3>
            <div class="radar-container">
                <div class="radar-chart-container">
                    <canvas class="radar-chart" width="400" height="400"></canvas>
                </div>
                <div class="radar-legend">
                    <h4 class="legend-title">维度说明</h4>
                    <div class="legend-items" id="radarLegend">
                        <!-- 动态生成图例 -->
                    </div>
                </div>
            </div>
        `;
        
        // 插入到维度评分之后
        dimensionScores.parentNode.insertBefore(radarSection, dimensionScores.nextSibling);
    }
    
    // 绘制雷达图
    drawRadarChart(canvas, dimensions, values, maxValue) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('无法获取2D渲染上下文');
            return;
        }
        
        // 设置canvas实际尺寸
        const displayWidth = 400;
        const displayHeight = 400;
        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';
        canvas.width = displayWidth * 2; // 高DPI支持
        canvas.height = displayHeight * 2;
        ctx.scale(2, 2);
        
        const centerX = displayWidth / 2;
        const centerY = displayHeight / 2;
        const radius = Math.min(centerX, centerY) - 50;
        const angleStep = (2 * Math.PI) / dimensions.length;
        
        // 清空画布
        ctx.clearRect(0, 0, displayWidth, displayHeight);
        
        // 绘制背景网格
        this.drawRadarGrid(ctx, centerX, centerY, radius, dimensions.length, maxValue);
        
        // 绘制数据区域
        this.drawRadarData(ctx, centerX, centerY, radius, values, maxValue, angleStep);
        
        // 绘制标签
        this.drawRadarLabels(ctx, centerX, centerY, radius, dimensions, angleStep);
        
        // 生成图例
        this.generateRadarLegend(dimensions, values);
    }
    
    // 绘制雷达图网格
    drawRadarGrid(ctx, centerX, centerY, radius, sides, maxValue) {
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        
        // 绘制同心圆
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI);
            ctx.stroke();
        }
        
        // 绘制射线
        const angleStep = (2 * Math.PI) / sides;
        for (let i = 0; i < sides; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
    
    // 绘制雷达图数据
    drawRadarData(ctx, centerX, centerY, radius, values, maxValue, angleStep) {
        // 填充区域
        ctx.fillStyle = 'rgba(25, 118, 210, 0.1)';
        ctx.strokeStyle = '#1976D2';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        for (let i = 0; i < values.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const distance = (values[i] / maxValue) * radius;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 绘制数据点
        ctx.fillStyle = '#1976D2';
        for (let i = 0; i < values.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const distance = (values[i] / maxValue) * radius;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    
    // 绘制雷达图标签
    drawRadarLabels(ctx, centerX, centerY, radius, dimensions, angleStep) {
        ctx.fillStyle = '#374151';
        ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i < dimensions.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const labelRadius = radius + 25;
            const x = centerX + Math.cos(angle) * labelRadius;
            const y = centerY + Math.sin(angle) * labelRadius;
            
            // 调整文本对齐方式
            if (Math.cos(angle) > 0.1) {
                ctx.textAlign = 'start';
            } else if (Math.cos(angle) < -0.1) {
                ctx.textAlign = 'end';
            } else {
                ctx.textAlign = 'center';
            }
            
            // 添加背景以提高可读性
            ctx.save();
            const textWidth = ctx.measureText(dimensions[i]).width;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(x - textWidth/2 - 2, y - 8, textWidth + 4, 16);
            ctx.restore();
            
            ctx.fillStyle = '#374151';
            ctx.fillText(dimensions[i], x, y);
        }
    }
    
    // 生成雷达图图例
    generateRadarLegend(dimensions, values) {
        const legendContainer = document.getElementById('radarLegend');
        if (!legendContainer) return;
        
        const colors = ['#48BB78', '#F59E0B', '#EF4444'];
        
        legendContainer.innerHTML = dimensions.map((dimension, index) => {
            const value = values[index];
            let level = 'good';
            let levelText = '正常';
            
            if (value >= 2.5) {
                level = 'concern';
                levelText = '需关注';
            } else if (value >= 1.5) {
                level = 'warning';
                levelText = '轻度';
            }
            
            return `
                <div class="legend-item">
                    <div class="legend-color" style="background-color: ${colors[level === 'good' ? 0 : level === 'warning' ? 1 : 2]}"></div>
                    <span class="legend-text">${dimension}</span>
                    <span class="legend-value">${value.toFixed(1)} (${levelText})</span>
                </div>
            `;
        }).join('');
    }
}

// 初始化报告生成器
document.addEventListener('DOMContentLoaded', function() {
    new ReportGenerator();
});