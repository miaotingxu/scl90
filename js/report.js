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
        const element = document.getElementById('reportContent');
        const opt = {
            margin: 10,
            filename: `心理测评报告_${new Date().toLocaleDateString('zh-CN')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // 使用html2pdf.js库（需要在页面中引入）
        if (typeof html2pdf !== 'undefined') {
            html2pdf().set(opt).from(element).save();
        } else {
            // 备用方案：打印页面
            window.print();
        }
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