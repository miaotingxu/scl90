// SCL90专用首页交互逻辑

document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动
    setupSmoothScroll();
    
    // 导航激活状态
    setupNavigation();
    
    // 开始测评按钮
    setupStartButtons();
    
    // 滚动动画
    setupScrollAnimations();
    
    // 统计数字动画
    setupCounterAnimation();
});

// 设置平滑滚动
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
            }
        });
    });
}

// 设置导航激活状态
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // 滚动时更新激活状态
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// 设置开始测评按钮
function setupStartButtons() {
    const startBtn = document.getElementById('startTestBtn');
    const ctaBtn = document.getElementById('ctaStartBtn');
    
    function startAssessment() {
        // 显示精美的确认对话框
        showAssessmentModal();
    }
    
    if (startBtn) {
        startBtn.addEventListener('click', startAssessment);
    }
    
    if (ctaBtn) {
        ctaBtn.addEventListener('click', startAssessment);
    }
}

// 显示测评确认模态框
function showAssessmentModal() {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'assessment-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="assessment-modal">
            <div class="modal-header">
                <div class="modal-icon">🧠</div>
                <h3 class="modal-title">SCL90心理健康测评</h3>
                <button class="modal-close" aria-label="关闭">×</button>
            </div>
            
            <div class="modal-content">
                <div class="assessment-info">
                    <div class="info-item">
                        <span class="info-icon">📋</span>
                        <div class="info-text">
                            <span class="info-label">题目数量</span>
                            <span class="info-value">90道题</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">⏱️</span>
                        <div class="info-text">
                            <span class="info-label">预计用时</span>
                            <span class="info-value">15-20分钟</span>
                        </div>
                    </div>
                </div>
                
                <div class="assessment-description">
                    <p>SCL90症状自评量表是国际公认的心理健康评估工具，将从10个维度全面评估您的心理健康状况。</p>
                    <div class="assessment-tips">
                        <h4>💡 测评小提示</h4>
                        <ul>
                            <li>请根据最近一周的真实感受作答</li>
                            <li>选择安静舒适的环境进行测评</li>
                            <li>确保有足够的时间完成全部题目</li>
                            <li>没有对错之分，请如实回答</li>
                            <li>测评结果仅供参考，不能替代专业诊断</li>
                        </ul>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-secondary modal-cancel">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        稍后再说
                    </button>
                    <button class="btn btn-primary modal-confirm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        开始测评
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalOverlay);
    
    // 添加动画
    setTimeout(() => {
        modalOverlay.classList.add('show');
    }, 10);
    
    // 事件处理
    const closeModal = () => {
        modalOverlay.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modalOverlay);
        }, 300);
    };
    
    const confirmAssessment = () => {
        // 保存测评信息
        localStorage.setItem('currentAssessment', JSON.stringify({
            type: 'scl90',
            title: 'SCL90心理健康测评',
            startTime: new Date().toISOString()
        }));
        
        // 跳转到测评页面
        window.location.href = 'assessment.html?type=scl90';
    };
    
    // 绑定事件
    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
    modalOverlay.querySelector('.modal-cancel').addEventListener('click', closeModal);
    modalOverlay.querySelector('.modal-confirm').addEventListener('click', confirmAssessment);
    
    // 点击背景关闭
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // ESC键关闭
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// 设置滚动动画
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察特性卡片
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // 观察FAQ项目
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
    
    // 观察维度卡片
    const dimensionItems = document.querySelectorAll('.dimension-item');
    dimensionItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        item.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
        observer.observe(item);
    });
}

// 统计数字动画
function setupCounterAnimation() {
    const statCards = document.querySelectorAll('.stat-card');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const number = card.querySelector('.stat-number');
                const finalValue = number.textContent.trim();
                
                // 只对纯数字进行动画
                if (/^\d+$/.test(finalValue)) {
                    animateNumber(number, 0, parseInt(finalValue), 1500);
                }
                
                observer.unobserve(card);
            }
        });
    }, observerOptions);
    
    statCards.forEach(card => {
        observer.observe(card);
    });
}

// 数字动画函数
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = end;
        }
    };
    
    requestAnimationFrame(animate);
}

// 添加模态框CSS样式
const style = document.createElement('style');
style.textContent = `
    .assessment-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .assessment-modal-overlay.show {
        opacity: 1;
    }
    
    .assessment-modal {
        background: white;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.9) translateY(20px);
        transition: transform 0.3s ease;
        border: 1px solid rgba(25, 118, 210, 0.2);
    }
    
    .assessment-modal-overlay.show .assessment-modal {
        transform: scale(1) translateY(0);
    }
    
    .modal-header {
        background: linear-gradient(135deg, #1976D2 0%, #2E7D32 100%);
        color: white;
        padding: 2rem;
        border-radius: 20px 20px 0 0;
        text-align: center;
        position: relative;
    }
    
    .modal-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        animation: pulse 2s infinite;
    }
    
    .modal-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0;
    }
    
    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s ease;
    }
    
    .modal-close:hover {
        background: rgba(255, 255, 255, 0.3);
    }
    
    .modal-content {
        padding: 2rem;
    }
    
    .assessment-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .info-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #E3F2FD;
        border-radius: 12px;
        transition: transform 0.2s ease;
    }
    
    .info-item:hover {
        transform: translateY(-2px);
    }
    
    .info-icon {
        font-size: 1.5rem;
    }
    
    .info-text {
        display: flex;
        flex-direction: column;
    }
    
    .info-label {
        font-size: 0.85rem;
        color: #546E7A;
    }
    
    .info-value {
        font-size: 1.1rem;
        font-weight: 600;
        color: #1976D2;
    }
    
    .assessment-description p {
        color: #546E7A;
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }
    
    .assessment-tips {
        background: #E8F5E8;
        border-radius: 12px;
        padding: 1.5rem;
        border-left: 4px solid #2E7D32;
    }
    
    .assessment-tips h4 {
        color: #2E7D32;
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
    }
    
    .assessment-tips ul {
        margin: 0;
        padding-left: 1.5rem;
        color: #546E7A;
    }
    
    .assessment-tips li {
        margin-bottom: 0.5rem;
        line-height: 1.5;
    }
    
    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
    }
    
    .modal-actions .btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
    }
    
    @media (max-width: 640px) {
        .assessment-modal {
            width: 95%;
            margin: 1rem;
        }
        
        .modal-content {
            padding: 1.5rem;
        }
        
        .assessment-info {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .modal-actions {
            flex-direction: column;
            gap: 0.75rem;
        }
        
        .modal-actions .btn {
            width: 100%;
            justify-content: center;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);
