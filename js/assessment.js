// 测评页面核心逻辑

class AssessmentManager {
    constructor() {
        this.currentType = null;
        this.currentQuestion = 0;
        this.answers = [];
        this.startTime = null;
        this.assessmentData = null;
        this.isCompleted = false;
        
        this.init();
    }
    
    init() {
        this.loadAssessmentType();
        this.setupEventListeners();
        this.checkSavedProgress();
        this.updateUI();
    }
    
    // 加载测评类型
    loadAssessmentType() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentType = urlParams.get('type') || 'scl90';
        this.assessmentData = getAssessmentConfig(this.currentType);
        
        // 设置页面标题
        document.title = `${this.assessmentData.title} - 心理测评中心`;
        
        // 更新页面头部信息
        const titleElement = document.getElementById('assessmentTitle');
        if (titleElement) {
            titleElement.textContent = this.assessmentData.title;
        }
        
        // 更新欢迎页面信息
        this.updateWelcomeScreen();
    }
    
    // 更新欢迎页面
    updateWelcomeScreen() {
        const welcomeIcon = document.getElementById('welcomeIcon');
        const welcomeTitle = document.getElementById('welcomeTitle');
        const welcomeDescription = document.getElementById('welcomeDescription');
        const estimatedTime = document.getElementById('estimatedTime');
        const questionCount = document.getElementById('questionCount');
        const assessmentDetails = document.getElementById('assessmentDetails');
        const welcomeNotice = document.getElementById('welcomeNotice');
        
        if (welcomeTitle) {
            welcomeTitle.textContent = `欢迎参加${this.assessmentData.title}`;
        }
        
        if (welcomeDescription) {
            welcomeDescription.textContent = this.assessmentData.description;
        }
        
        if (estimatedTime) {
            estimatedTime.textContent = this.assessmentData.estimatedTime;
        }
        
        if (questionCount) {
            questionCount.textContent = `${this.assessmentData.questionCount}道题`;
        }
        
        // 根据测评类型更新图标和说明
        if (this.currentType === 'scl90') {
            if (welcomeNotice) {
                welcomeNotice.innerHTML = `
                    <h4>测评说明:</h4>
                    <ul>
                        <li>请根据您最近一周的实际感受作答</li>
                        <li>没有对错之分，请选择最真实的答案</li>
                        <li>测评结果仅供参考，不能替代专业诊断</li>
                        <li>您的所有数据将保存在本地，不会上传到服务器</li>
                    </ul>
                `;
            }
        } else {
            // 其他测评类型的特殊说明
            if (welcomeNotice) {
                welcomeNotice.innerHTML = `
                    <h4>测评说明:</h4>
                    <ul>
                        <li>请根据您的实际情况和真实感受作答</li>
                        <li>没有对错之分，请选择最符合您的答案</li>
                        <li>测评结果仅供参考，用于自我了解和成长</li>
                        <li>您的所有数据将保存在本地，保护您的隐私</li>
                    </ul>
                `;
            }
        }
    }
    
    // 设置事件监听器
    setupEventListeners() {
        // 开始测评按钮
        const startBtn = document.getElementById('startAssessment');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startAssessment());
        }
        
        // 返回首页按钮
        const backBtn = document.getElementById('backToHome');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        
        // 导航按钮
        const prevBtn = document.getElementById('prevQuestion');
        const nextBtn = document.getElementById('nextQuestion');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        // 功能按钮
        const saveBtn = document.getElementById('saveProgress');
        const clearBtn = document.getElementById('clearAnswer');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveProgress());
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearCurrentAnswer());
        }
        
        // 完成页面按钮
        const generateReportBtn = document.getElementById('generateReport');
        const reviewAnswersBtn = document.getElementById('reviewAnswers');
        
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', () => this.generateReport());
        }
        
        if (reviewAnswersBtn) {
            reviewAnswersBtn.addEventListener('click', () => this.reviewAnswers());
        }
        
        // 悬浮按钮
        this.setupFabButtons();
        
        // 键盘导航
        this.setupKeyboardNavigation();
        
        // 自动保存
        this.setupAutoSave();
    }
    
    // 设置悬浮按钮
    setupFabButtons() {
        const fabMain = document.getElementById('fabMain');
        const fabMenu = document.getElementById('fabMenu');
        const fabHelp = document.getElementById('fabHelp');
        const fabSave = document.getElementById('fabSave');
        const fabExit = document.getElementById('fabExit');
        
        if (fabMain) {
            fabMain.addEventListener('click', () => {
                if (fabMenu.style.display === 'none') {
                    fabMenu.style.display = 'flex';
                    setTimeout(() => fabMenu.classList.add('show'), 10);
                    fabMain.classList.add('active');
                } else {
                    fabMenu.classList.remove('show');
                    setTimeout(() => {
                        fabMenu.style.display = 'none';
                        fabMain.classList.remove('active');
                    }, 300);
                }
            });
        }
        
        if (fabHelp) {
            fabHelp.addEventListener('click', () => this.showHelp());
        }
        
        if (fabSave) {
            fabSave.addEventListener('click', () => this.saveProgress());
        }
        
        if (fabExit) {
            fabExit.addEventListener('click', () => this.exitAssessment());
        }
    }
    
    // 设置键盘导航
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.isCompleted) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousQuestion();
                    break;
                case 'ArrowRight':
                case 'Enter':
                    e.preventDefault();
                    if (this.hasCurrentAnswer()) {
                        this.nextQuestion();
                    }
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                    e.preventDefault();
                    this.selectAnswer(parseInt(e.key));
                    break;
                case 's':
                case 'S':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.saveProgress();
                    }
                    break;
            }
        });
    }
    
    // 设置自动保存
    setupAutoSave() {
        // 每30秒自动保存一次
        this.autoSaveInterval = setInterval(() => {
            if (this.answers.length > 0 && !this.isCompleted) {
                this.saveProgress();
            }
        }, 30000);
    }
    
    // 开始测评
    startAssessment() {
        this.startTime = new Date();
        this.currentQuestion = 0;
        this.answers = new Array(this.assessmentData.questionCount).fill(null);
        
        // 保存测评状态
        this.saveAssessmentState();
        
        // 显示题目界面
        this.showQuestionScreen();
        this.updateQuestion();
        
        // 显示悬浮按钮
        document.getElementById('fabContainer').style.display = 'block';
    }
    
    // 显示题目界面
    showQuestionScreen() {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('questionScreen').style.display = 'block';
        document.getElementById('completionScreen').style.display = 'none';
    }
    
    // 更新题目
    updateQuestion() {
        const question = this.assessmentData.questions[this.currentQuestion];
        const category = getQuestionCategory(this.currentType, this.currentQuestion);
        
        // 更新题目信息
        document.getElementById('questionNumber').textContent = `第${this.currentQuestion + 1}题`;
        document.getElementById('questionCategory').textContent = category;
        document.getElementById('questionText').textContent = question;
        
        // 更新答案选项
        this.updateAnswerOptions();
        
        // 更新进度
        this.updateProgress();
        
        // 更新导航按钮状态
        this.updateNavigationButtons();
        
        // 保存当前状态
        this.saveAssessmentState();
    }
    
    // 更新答案选项
    updateAnswerOptions() {
        const container = document.getElementById('answerOptions');
        container.innerHTML = '';
        
        this.assessmentData.answerOptions.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'answer-option';
            optionElement.dataset.value = option.value;
            
            const isSelected = this.answers[this.currentQuestion] === option.value;
            if (isSelected) {
                optionElement.classList.add('selected');
            }
            
            optionElement.innerHTML = `
                <input type="radio" name="answer" value="${option.value}" ${isSelected ? 'checked' : ''}>
                <span class="answer-label">${option.label}</span>
                <span class="answer-value">${option.description}</span>
            `;
            
            optionElement.addEventListener('click', () => {
                this.selectAnswer(option.value);
            });
            
            container.appendChild(optionElement);
        });
    }
    
    // 选择答案
    selectAnswer(value) {
        this.answers[this.currentQuestion] = value;
        
        // 更新UI
        const options = document.querySelectorAll('.answer-option');
        options.forEach(option => {
            option.classList.remove('selected');
            if (parseInt(option.dataset.value) === value) {
                option.classList.add('selected');
                option.querySelector('input[type="radio"]').checked = true;
            }
        });
        
        // 自动进入下一题（延迟一点让用户看到选择效果）
        setTimeout(() => {
            if (this.currentQuestion < this.assessmentData.questionCount - 1) {
                this.nextQuestion();
            } else {
                this.completeAssessment();
            }
        }, 500);
    }
    
    // 下一题
    nextQuestion() {
        if (this.currentQuestion < this.assessmentData.questionCount - 1) {
            this.currentQuestion++;
            this.updateQuestion();
        } else {
            this.completeAssessment();
        }
    }
    
    // 上一题
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.updateQuestion();
        }
    }
    
    // 更新进度
    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.assessmentData.questionCount) * 100;
        
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('currentQuestion').textContent = this.currentQuestion + 1;
        document.getElementById('totalQuestions').textContent = this.assessmentData.questionCount;
        document.getElementById('progressPercentage').textContent = `${Math.round(progress)}%`;
    }
    
    // 更新导航按钮状态
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevQuestion');
        const nextBtn = document.getElementById('nextQuestion');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentQuestion === 0;
        }
        
        if (nextBtn) {
            nextBtn.textContent = this.currentQuestion === this.assessmentData.questionCount - 1 ? 
                '完成测评' : '下一题 →';
        }
    }
    
    // 检查当前题目是否已回答
    hasCurrentAnswer() {
        return this.answers[this.currentQuestion] !== null;
    }
    
    // 清除当前答案
    clearCurrentAnswer() {
        this.answers[this.currentQuestion] = null;
        this.updateAnswerOptions();
    }
    
    // 完成测评
    completeAssessment() {
        this.isCompleted = true;
        this.endTime = new Date();
        
        // 清除自动保存
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        // 计算用时
        const duration = Math.round((this.endTime - this.startTime) / 1000 / 60); // 分钟
        
        // 显示完成页面
        this.showCompletionScreen(duration);
        
        // 保存完成状态
        this.saveCompletionState(duration);
        
        // 清理进度保存
        localStorage.removeItem(`assessment_${this.currentType}_progress`);
    }
    
    // 显示完成页面
    showCompletionScreen(duration) {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('questionScreen').style.display = 'none';
        document.getElementById('completionScreen').style.display = 'block';
        
        // 更新完成信息
        document.getElementById('completedQuestions').textContent = this.assessmentData.questionCount;
        document.getElementById('completionTime').textContent = `${duration}分钟`;
        document.getElementById('completionDate').textContent = new Date().toLocaleDateString('zh-CN');
    }
    
    // 生成报告
    generateReport() {
        // 保存答案数据用于报告生成
        const reportData = {
            type: this.currentType,
            title: this.assessmentData.title,
            answers: this.answers,
            startTime: this.startTime,
            endTime: this.endTime,
            duration: Math.round((this.endTime - this.startTime) / 1000 / 60)
        };
        
        localStorage.setItem('currentReport', JSON.stringify(reportData));
        
        // 跳转到报告页面
        window.location.href = 'report.html';
    }
    
    // 查看答案
    reviewAnswers() {
        // 实现答案查看功能
        alert('答案查看功能开发中...');
    }
    
    // 保存进度
    saveProgress() {
        this.saveAssessmentState();
        
        // 显示保存成功提示
        this.showNotification('进度已保存', 'success');
    }
    
    // 保存测评状态
    saveAssessmentState() {
        const state = {
            type: this.currentType,
            currentQuestion: this.currentQuestion,
            answers: this.answers,
            startTime: this.startTime,
            isCompleted: this.isCompleted
        };
        
        localStorage.setItem(`assessment_${this.currentType}_progress`, JSON.stringify(state));
    }
    
    // 保存完成状态
    saveCompletionState(duration) {
        const completion = {
            type: this.currentType,
            title: this.assessmentData.title,
            answers: this.answers,
            startTime: this.startTime,
            endTime: this.endTime,
            duration: duration,
            completedAt: new Date().toISOString()
        };
        
        localStorage.setItem(`assessment_${this.currentType}_completed`, JSON.stringify(completion));
    }
    
    // 检查保存的进度
    checkSavedProgress() {
        const savedState = localStorage.getItem(`assessment_${this.currentType}_progress`);
        const completedState = localStorage.getItem(`assessment_${this.currentType}_completed`);
        
        if (savedState) {
            const state = JSON.parse(savedState);
            
            // 询问是否继续上次的进度
            if (confirm(`检测到您有未完成的${this.assessmentData.title}，是否继续？`)) {
                this.currentQuestion = state.currentQuestion;
                this.answers = state.answers;
                this.startTime = new Date(state.startTime);
                this.isCompleted = state.isCompleted;
                
                if (this.isCompleted) {
                    this.showCompletionScreen();
                } else {
                    this.showQuestionScreen();
                    this.updateQuestion();
                    document.getElementById('fabContainer').style.display = 'block';
                }
            } else {
                // 清除保存的进度
                localStorage.removeItem(`assessment_${this.currentType}_progress`);
            }
        } else if (completedState) {
            // 已完成测评，询问是否重新测评
            if (confirm(`您已完成${this.assessmentData.title}，是否重新测评？`)) {
                localStorage.removeItem(`assessment_${this.currentType}_completed`);
            } else {
                // 跳转到报告页面
                window.location.href = 'report.html';
            }
        }
    }
    
    // 显示帮助
    showHelp() {
        const helpContent = `
            键盘快捷键：
            • 数字键 1-5：选择对应答案
            • 左右箭头：切换题目
            • Enter：进入下一题
            • Ctrl+S：保存进度
            
            答题建议：
            • 根据您的实际感受作答
            • 没有对错之分
            • 选择最符合您的答案
        `;
        
        alert(helpContent);
    }
    
    // 退出测评
    exitAssessment() {
        if (confirm('确定要退出测评吗？您的进度将自动保存。')) {
            this.saveProgress();
            window.location.href = 'index.html';
        }
    }
    
    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48BB78' : '#4A90E2'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // 更新UI
    updateUI() {
        // 这里可以添加更多UI更新逻辑
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        font-weight: 500;
        font-size: 0.9rem;
    }
`;
document.head.appendChild(style);

// 初始化测评管理器
document.addEventListener('DOMContentLoaded', function() {
    new AssessmentManager();
});