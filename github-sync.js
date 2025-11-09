// GitHub自动同步脚本 - 无需Token,直接读取GitHub仓库数据

class GitHubSync {
    constructor() {
        this.owner = 'a17380648227-creator';
        this.repo = 'yebailing-survey';
        this.branch = 'main';
        this.baseUrl = `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}`;
    }

    // 从GitHub读取数据
    async fetchFromGitHub(filename) {
        try {
            const url = `${this.baseUrl}/data/${filename}`;
            console.log('📡 从GitHub读取:', url);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log(`✅ 成功读取 ${filename}:`, data.length, '条');
            return data;
        } catch (error) {
            console.warn(`⚠️ 读取 ${filename} 失败:`, error.message);
            return null;
        }
    }

    // 从GitHub同步所有数据到localStorage
    async syncFromGitHub() {
        try {
            console.log('🔄 开始从GitHub同步数据...');

            // 读取三个数据文件
            const brands = await this.fetchFromGitHub('brands.json');
            const stores = await this.fetchFromGitHub('stores.json');
            const answers = await this.fetchFromGitHub('answers.json');

            // 保存到localStorage
            if (brands !== null) {
                localStorage.setItem('ybl_brands', JSON.stringify(brands));
            }
            if (stores !== null) {
                localStorage.setItem('ybl_stores', JSON.stringify(stores));
            }
            if (answers !== null) {
                localStorage.setItem('ybl_answers', JSON.stringify(answers));
            }

            console.log('✅ GitHub数据同步完成!');
            return true;
        } catch (error) {
            console.error('❌ 同步失败:', error);
            return false;
        }
    }

    // 自动同步(页面加载时)
    async autoSync() {
        const lastSync = localStorage.getItem('last_github_sync');
        const now = Date.now();
        const syncInterval = 5 * 60 * 1000; // 5分钟

        // 如果超过5分钟没同步,或者是首次访问
        if (!lastSync || (now - parseInt(lastSync)) > syncInterval) {
            console.log('⏰ 自动同步触发...');
            const success = await this.syncFromGitHub();
            if (success) {
                localStorage.setItem('last_github_sync', now.toString());
            }
        } else {
            console.log('⏭️ 距离上次同步不到5分钟,跳过');
        }
    }
}

// 创建全局实例
const githubSync = new GitHubSync();

// 导出
if (typeof window !== 'undefined') {
    window.githubSync = githubSync;
}
