// 首页交互逻辑

document.addEventListener('DOMContentLoaded', function() {
    // 模块导航
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach(card => {
        const moduleType = card.dataset.module;
        const button = card.querySelector('.btn');
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 添加点击动画
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            // 导航到对应模块
            navigateToModule(moduleType);
        });
        
        // 卡片悬停效果
        card.addEventListener('mouseenter', function() {
            const icon = card.querySelector('.module-icon');
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = card.querySelector('.module-icon');
            icon.style.transform = '';
        });
    });
    
    // 平滑滚动
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // 更新活跃导航链接
                    navLinks.forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
    // 滚动动画
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
    
    // 观察模块卡片
    moduleCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // 观察特性项目
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    // 统计数字动画
    animateStats();
    
    // 搜索功能
    setupSearchFunctionality();
    
    // 键盘导航支持
    setupKeyboardNavigation();
    
    // 关于我们模块动画
    setupAboutUsAnimations();
});

// 关于我们模块动画
function setupAboutUsAnimations() {
    const aboutSection = document.querySelector('.about-us');
    if (!aboutSection) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 统计卡片动画
                const statCards = entry.target.querySelectorAll('.stat-card');
                statCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                
                // 团队成员动画
                const teamMembers = entry.target.querySelectorAll('.team-member');
                teamMembers.forEach((member, index) => {
                    setTimeout(() => {
                        member.style.opacity = '1';
                        member.style.transform = 'translateY(0)';
                    }, index * 150);
                });
                
                // 价值观项目动画
                const valueItems = entry.target.querySelectorAll('.value-item');
                valueItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 初始化动画状态
    const animatedElements = aboutSection.querySelectorAll('.stat-card, .team-member, .value-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    observer.observe(aboutSection);
    
    // 团队头像悬停效果
    const memberAvatars = aboutSection.querySelectorAll('.member-avatar');
    memberAvatars.forEach(avatar => {
        avatar.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        avatar.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // 统计卡片数字动画
    const statNumbers = aboutSection.querySelectorAll('.stat-card .stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                let targetNumber = 0;
                
                if (text.includes('万')) {
                    targetNumber = parseInt(text) * 10000;
                } else if (text.includes('%')) {
                    targetNumber = parseInt(text);
                } else if (text.includes('/')) {
                    // 忽略 "24/7" 格式
                    return;
                } else {
                    targetNumber = parseInt(text);
                }
                
                if (targetNumber > 0) {
                    animateNumber(target, 0, targetNumber, 2000);
                }
                
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => {
        if (!num.textContent.includes('/')) {
            statsObserver.observe(num);
        }
    });
}

// 导航到对应模块
function navigateToModule(moduleType) {
    const moduleInfo = {
        scl90: {
            title: 'SCL90心理健康测评',
            description: '国际通用的心理健康评估工具',
            url: 'assessment.html?type=scl90',
            confirmation: 'SCL90测评包含90道题目，预计需要15-20分钟完成。请确保您有足够的时间和安静的环境。',
            icon: '🧠',
            duration: '15-20分钟',
            questions: '90道题目'
        },
        mbti: {
            title: 'MBTI16人格测试',
            description: '了解您的MBTI人格类型，发现性格特征和行为偏好',
            url: 'assessment.html?type=mbti',
            confirmation: 'MBTI16人格测试包含60道题目，预计需要10-15分钟完成。请根据您的真实感受作答。',
            icon: '🔮',
            duration: '10-15分钟',
            questions: '60道题目'
        },
        bipolar: {
            title: '双向情感障碍测试',
            description: '评估情绪波动和双向情感障碍倾向，了解情绪健康状态',
            url: 'assessment.html?type=bipolar',
            confirmation: '双向情感障碍测试包含45道题目，预计需要8-12分钟完成。',
            icon: '🌊',
            duration: '8-12分钟',
            questions: '45道题目'
        },
        darktriad: {
            title: '黑暗三角人格测试',
            description: '探索马基雅维利主义、自恋和精神病态特质倾向',
            url: 'assessment.html?type=darktriad',
            confirmation: '黑暗三角人格测试包含50道题目，预计需要12-18分钟完成。',
            icon: '🌑',
            duration: '12-18分钟',
            questions: '50道题目'
        },
        attachment: {
            title: '成人依恋类型测试',
            description: '了解您的依恋类型，探索人际关系和情感连接模式',
            url: 'assessment.html?type=attachment',
            confirmation: '成人依恋类型测试包含55道题目，预计需要10-15分钟完成。',
            icon: '💝',
            duration: '10-15分钟',
            questions: '55道题目'
        },
        bem: {
            title: '贝姆心理性别测试',
            description: '评估您的心理性别特征，了解男性化和女性化特质倾向',
            url: 'assessment.html?type=bem',
            confirmation: '贝姆心理性别测试包含40道题目，预计需要8-12分钟完成。',
            icon: '⚧️',
            duration: '8-12分钟',
            questions: '40道题目'
        }
    };
    
    const info = moduleInfo[moduleType];
    if (info) {
        // 显示精美的确认对话框
        showAssessmentModal(info, moduleType);
    }
}

// 显示精美的测评确认模态框
function showAssessmentModal(info, moduleType) {
    // 创建模态框背景
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'assessment-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="assessment-modal">
            <div class="modal-header">
                <div class="modal-icon">${info.icon}</div>
                <h3 class="modal-title">${info.title}</h3>
                <button class="modal-close" aria-label="关闭">×</button>
            </div>
            
            <div class="modal-content">
                <div class="assessment-info">
                    <div class="info-item">
                        <span class="info-icon">📋</span>
                        <div class="info-text">
                            <span class="info-label">题目数量</span>
                            <span class="info-value">${info.questions}</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">⏱️</span>
                        <div class="info-text">
                            <span class="info-label">预计用时</span>
                            <span class="info-value">${info.duration}</span>
                        </div>
                    </div>
                </div>
                
                <div class="assessment-description">
                    <p>${info.description}</p>
                    <div class="assessment-tips">
                        <h4>💡 测评小提示</h4>
                        <ul>
                            <li>请根据您的真实感受作答</li>
                            <li>选择安静舒适的环境</li>
                            <li>确保有足够的时间完成</li>
                            <li>没有对错之分，请放心作答</li>
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
    
    // 添加到页面
    document.body.appendChild(modalOverlay);
    
    // 添加CSS动画类
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
        // 保存当前选择的模块信息
        localStorage.setItem('currentAssessment', JSON.stringify({
            type: moduleType,
            title: info.title,
            startTime: new Date().toISOString()
        }));
        
        // 添加确认动画
        const confirmBtn = modalOverlay.querySelector('.modal-confirm');
        confirmBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> 正在进入...';
        confirmBtn.disabled = true;
        
        setTimeout(() => {
            window.location.href = info.url;
        }, 500);
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

// 数字动画函数（移到全局作用域）
function animateNumber(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // 格式化数字显示
        if (target >= 10000) {
            element.textContent = Math.floor(current / 1000) + '万+';
        } else if (target >= 100) {
            element.textContent = Math.floor(current) + '%';
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// 统计数字动画
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // 当统计区域进入视口时开始动画
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numbers = entry.target.querySelectorAll('.stat-number');
                numbers.forEach(num => {
                    const text = num.textContent;
                    let target = 0;
                    
                    if (text.includes('万')) {
                        target = parseInt(text) * 10000;
                    } else if (text.includes('%')) {
                        target = parseInt(text);
                    } else {
                        target = parseInt(text);
                    }
                    
                    animateNumber(num, target);
                });
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
}

// 搜索功能
function setupSearchFunctionality() {
    // 创建搜索容器
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-box">
            <input type="text" class="search-input" placeholder="搜索心理测评..." />
            <button class="search-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
            </button>
        </div>
        <div class="search-results"></div>
    `;
    
    // 添加到section header
    const sectionHeader = document.querySelector('.test-modules .section-header');
    if (sectionHeader) {
        sectionHeader.appendChild(searchContainer);
    }
    
    const searchInput = searchContainer.querySelector('.search-input');
    const searchResults = searchContainer.querySelector('.search-results');
    
    // 搜索逻辑（支持所有模块）
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length === 0) {
            searchResults.style.display = 'none';
            return;
        }
        
        const moduleCards = document.querySelectorAll('.module-card');
        const matches = Array.from(moduleCards).filter(card => {
            const title = card.querySelector('.module-title').textContent.toLowerCase();
            const description = card.querySelector('.module-description').textContent.toLowerCase();
            return title.includes(query) || description.includes(query);
        });
        
        if (matches.length > 0) {
            searchResults.innerHTML = matches.map(card => {
                const title = card.querySelector('.module-title').textContent;
                const description = card.querySelector('.module-description').textContent;
                return `
                    <div class="search-result-item" data-module-id="${card.dataset.module}">
                        <div class="search-result-title">${title}</div>
                        <div class="search-result-description">${description}</div>
                    </div>
                `;
            }).join('');
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<div class="search-no-results">未找到相关测评</div>';
            searchResults.style.display = 'block';
        }
    });
    
    // 搜索结果点击（支持所有模块）
    searchResults.addEventListener('click', function(e) {
        const resultItem = e.target.closest('.search-result-item');
        if (resultItem) {
            const moduleId = resultItem.dataset.moduleId;
            const targetCard = document.querySelector(`[data-module="${moduleId}"]`);
            if (targetCard) {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetCard.style.animation = 'highlight 2s ease';
                searchInput.value = '';
                searchResults.style.display = 'none';
            }
        }
    });
    
    // 点击外部关闭搜索结果
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

// 键盘导航支持（支持所有模块）
function setupKeyboardNavigation() {
    const moduleCards = document.querySelectorAll('.module-card');
    let currentFocus = -1;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            // Tab键导航
            if (e.shiftKey) {
                // Shift+Tab 向前导航
                currentFocus = currentFocus <= 0 ? moduleCards.length - 1 : currentFocus - 1;
            } else {
                // Tab 向后导航
                currentFocus = currentFocus >= moduleCards.length - 1 ? 0 : currentFocus + 1;
            }
            
            if (currentFocus >= 0 && currentFocus < moduleCards.length) {
                moduleCards[currentFocus].focus();
                e.preventDefault();
            }
        } else if (e.key === 'Enter' && currentFocus >= 0) {
            // Enter键开始测评
            const focusedCard = moduleCards[currentFocus];
            const button = focusedCard.querySelector('.btn');
            if (button) {
                button.click();
            }
        }
    });
    
    // 使卡片可聚焦
    moduleCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `${card.querySelector('.module-title').textContent}测评模块`);
    });
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    .search-container {
        position: relative;
        max-width: 500px;
        margin: 2rem auto 0;
    }
    
    .search-box {
        position: relative;
        display: flex;
        align-items: center;
        background: var(--bg-secondary);
        border-radius: 25px;
        box-shadow: var(--shadow-soft);
        overflow: hidden;
        border: 1px solid rgba(25, 118, 210, 0.1);
    }
    
    .search-input {
        flex: 1;
        padding: 1rem 1.5rem;
        border: none;
        outline: none;
        font-size: 1rem;
        background: transparent;
    }
    
    .search-btn {
        padding: 1rem;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--primary-blue);
        transition: color 0.2s ease;
    }
    
    .search-btn:hover {
        color: var(--primary-green);
    }
    
    .search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-secondary);
        border: 1px solid rgba(25, 118, 210, 0.15);
        border-radius: 12px;
        box-shadow: var(--shadow-medium);
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
        margin-top: 0.5rem;
    }
    
    .search-result-item {
        padding: 1rem 1.5rem;
        cursor: pointer;
        border-bottom: 1px solid #E2E8F0;
        transition: background-color 0.2s ease;
    }
    
    .search-result-item:hover {
        background: #F7FAFC;
    }
    
    .search-result-item:last-child {
        border-bottom: none;
    }
    
    .search-result-title {
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.25rem;
    }
    
    .search-result-description {
        font-size: 0.9rem;
        color: var(--text-secondary);
        line-height: 1.4;
    }
    
    .search-no-results {
        padding: 2rem;
        text-align: center;
        color: var(--text-tertiary);
    }
    
    @keyframes highlight {
        0% { background-color: transparent; }
        50% { background-color: var(--primary-light); }
        100% { background-color: transparent; }
    }
    
    .module-card:focus {
        outline: 2px solid var(--primary-blue);
        outline-offset: 2px;
    }
`;
document.head.appendChild(style);