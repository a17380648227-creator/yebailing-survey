// 认证检查脚本
(function() {
    // 检查登录状态
    function checkAuth() {
        const session = localStorage.getItem('ybl_login_session');

        // 如果在登录页面，不需要检查
        if (window.location.pathname.endsWith('login.html') ||
            window.location.pathname.endsWith('survey.html')) {
            return;
        }

        if (!session) {
            // 未登录，跳转到登录页面
            window.location.href = 'login.html';
            return;
        }

        try {
            const loginData = JSON.parse(session);
            // 可以在这里添加更多验证逻辑，比如token过期检查

            // 验证通过，继续
            return loginData;
        } catch (e) {
            // session数据无效，跳转登录页
            localStorage.removeItem('ybl_login_session');
            window.location.href = 'login.html';
        }
    }

    // 退出登录
    window.logout = function() {
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('ybl_login_session');
            window.location.href = 'login.html';
        }
    };

    // 获取当前登录用户信息
    window.getCurrentUser = function() {
        const session = localStorage.getItem('ybl_login_session');
        if (session) {
            try {
                return JSON.parse(session);
            } catch (e) {
                return null;
            }
        }
        return null;
    };

    // 页面加载时立即检查
    checkAuth();
})();
