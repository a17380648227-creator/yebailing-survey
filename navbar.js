// 统一导航栏组件
function createNavbar(currentPage) {
    const currentUser = JSON.parse(localStorage.getItem('ybl_current_user') || 'null');
    const username = currentUser ? currentUser.username : '游客';

    const navItems = [
        { name: '首页', url: 'admin.html', icon: '🏠' },
        { name: '门店管理', url: 'stores.html', icon: '🏪' },
        { name: '数据统计', url: 'data.html', icon: '📊' },
        { name: '二维码生成', url: 'qrcode.html', icon: '📱' },
        { name: '账号管理', url: 'accounts.html', icon: '👥' }
    ];

    return `
        <nav class="navbar">
            <div class="navbar-container">
                <div class="navbar-brand">
                    <a href="admin.html" class="brand-link">
                        <span class="brand-icon">🍴</span>
                        <span class="brand-text">野百灵餐厅</span>
                    </a>
                </div>
                <div class="navbar-menu">
                    ${navItems.map(item => `
                        <a href="${item.url}" class="nav-item ${currentPage === item.url ? 'active' : ''}">
                            <span class="nav-icon">${item.icon}</span>
                            <span class="nav-text">${item.name}</span>
                        </a>
                    `).join('')}
                </div>
                <div class="navbar-user">
                    <span class="user-name">${username}</span>
                    <button class="logout-btn" onclick="logout()">退出</button>
                </div>
            </div>
        </nav>
    `;
}

// 导航栏样式
const navbarStyles = `
    <style>
        .navbar {
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%);
            backdrop-filter: blur(20px);
            border-bottom: 2px solid rgba(59, 130, 246, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .navbar-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 70px;
        }

        .navbar-brand .brand-link {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            transition: all 0.3s;
        }

        .navbar-brand .brand-link:hover {
            transform: scale(1.05);
        }

        .brand-icon {
            font-size: 32px;
            filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.6));
        }

        .brand-text {
            font-size: 20px;
            font-weight: 800;
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .navbar-menu {
            display: flex;
            gap: 8px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            border-radius: 12px;
            text-decoration: none;
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }

        .nav-item::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #2563eb);
            border-radius: 3px 3px 0 0;
            transition: width 0.3s;
        }

        .nav-item:hover {
            color: white;
            background: rgba(59, 130, 246, 0.15);
        }

        .nav-item:hover::before {
            width: 80%;
        }

        .nav-item.active {
            color: white;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.3) 100%);
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .nav-item.active::before {
            width: 100%;
        }

        .nav-icon {
            font-size: 18px;
        }

        .navbar-user {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .user-name {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            font-weight: 600;
        }

        .logout-btn {
            padding: 8px 20px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .logout-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
        }

        .logout-btn:active {
            transform: translateY(0);
        }

        @media (max-width: 768px) {
            .navbar-menu {
                display: none;
            }

            .nav-text {
                display: none;
            }
        }
    </style>
`;

// 退出登录函数
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('ybl_current_user');
        window.location.href = 'index.html';
    }
}

// 插入导航栏
function insertNavbar(currentPage) {
    const currentUser = JSON.parse(localStorage.getItem('ybl_current_user') || 'null');
    if (!currentUser && currentPage !== 'index.html') {
        window.location.href = 'index.html';
        return;
    }

    document.head.insertAdjacentHTML('beforeend', navbarStyles);
    document.body.insertAdjacentHTML('afterbegin', createNavbar(currentPage));
}
