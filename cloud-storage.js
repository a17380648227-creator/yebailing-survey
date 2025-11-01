// 🚀 云端数据同步方案 - 使用 GitHub Gist（完全免费）
// 无需注册额外服务，使用你的 GitHub 账号即可

const CLOUD_CONFIG = {
    // 🔧 配置说明：
    // 1. 访问 https://github.com/settings/tokens
    // 2. 点击 "Generate new token (classic)"
    // 3. 勾选 "gist" 权限
    // 4. 生成后复制token，填写在下方
    githubToken: 'YOUR_GITHUB_TOKEN',  // 替换为你的 GitHub token
    gistId: null,  // 自动创建，无需手动填写
};

// 云端存储类
class CloudStorage {
    constructor() {
        this.isConfigured = CLOUD_CONFIG.githubToken !== 'YOUR_GITHUB_TOKEN';
        this.syncInterval = null;
    }

    // 保存数据到云端
    async save(key, data) {
        if (!this.isConfigured) {
            return this.saveLocal(key, data);
        }

        try {
            const allData = await this.getAll();
            allData[key] = allData[key] || [];

            if (Array.isArray(data)) {
                allData[key] = [...allData[key], ...data];
            } else {
                allData[key].push(data);
            }

            await this.uploadToGist(allData);

            // 同时保存到本地作为备份
            this.saveLocal(key, allData[key]);

            console.log('✅ 数据已同步到云端');
            return { success: true };
        } catch (error) {
            console.error('❌ 云端保存失败，使用本地存储:', error);
            return this.saveLocal(key, data);
        }
    }

    // 从云端获取数据
    async get(key) {
        if (!this.isConfigured) {
            return this.getLocal(key);
        }

        try {
            const allData = await this.getAll();
            console.log(`✅ 从云端获取 ${key}:`, allData[key]?.length || 0, '条');

            // 同时更新本地缓存
            if (allData[key]) {
                localStorage.setItem(key, JSON.stringify(allData[key]));
            }

            return allData[key] || [];
        } catch (error) {
            console.error('❌ 云端读取失败，使用本地存储:', error);
            return this.getLocal(key);
        }
    }

    // 获取所有数据
    async getAll() {
        const gistId = localStorage.getItem('cloud_gist_id') || CLOUD_CONFIG.gistId;

        if (!gistId) {
            return {};
        }

        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: {
                'Authorization': `token ${CLOUD_CONFIG.githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch gist');
        }

        const gist = await response.json();
        const content = gist.files['yebailing-data.json'].content;
        return JSON.parse(content);
    }

    // 上传到 GitHub Gist
    async uploadToGist(data) {
        const gistId = localStorage.getItem('cloud_gist_id') || CLOUD_CONFIG.gistId;
        const content = JSON.stringify(data, null, 2);

        if (gistId) {
            // 更新已有的 Gist
            const response = await fetch(`https://api.github.com/gists/${gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${CLOUD_CONFIG.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: {
                        'yebailing-data.json': {
                            content: content
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update gist');
            }
        } else {
            // 创建新的 Gist
            const response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${CLOUD_CONFIG.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: '野百灵餐厅问卷数据 - 云端同步',
                    public: false,
                    files: {
                        'yebailing-data.json': {
                            content: content
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create gist');
            }

            const gist = await response.json();
            localStorage.setItem('cloud_gist_id', gist.id);
            console.log('✅ 云端存储已创建，Gist ID:', gist.id);
        }
    }

    // 本地存储（fallback）
    saveLocal(key, data) {
        if (Array.isArray(data)) {
            localStorage.setItem(key, JSON.stringify(data));
        } else {
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            existing.push(data);
            localStorage.setItem(key, JSON.stringify(existing));
        }
        return { success: true };
    }

    getLocal(key) {
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    // 启动自动同步（每30秒同步一次）
    startAutoSync() {
        if (!this.isConfigured) {
            console.warn('⚠️ 未配置云端存储，使用本地模式');
            return;
        }

        this.syncInterval = setInterval(async () => {
            try {
                // 从云端拉取最新数据
                const cloudData = await this.get('ybl_answers');
                console.log('🔄 自动同步完成');
            } catch (error) {
                console.error('🔄 自动同步失败:', error);
            }
        }, 30000); // 30秒

        console.log('✅ 自动同步已启动（每30秒）');
    }

    // 停止自动同步
    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            console.log('⏸️ 自动同步已停止');
        }
    }
}

// 创建全局实例
window.cloudStorage = new CloudStorage();

// 检查配置状态
if (!window.cloudStorage.isConfigured) {
    console.warn(`
⚠️ 云端同步未配置

要启用跨设备实时同步，请按以下步骤操作：

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 填写描述：野百灵餐厅数据同步
4. 勾选 "gist" 权限
5. 点击 "Generate token"
6. 复制生成的 token
7. 打开 cloud-storage.js
8. 将 token 填写在 githubToken 字段

配置完成后，所有设备的数据将实时同步！
    `);
}
