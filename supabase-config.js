// Supabase 云端数据库配置
// 使用免费版本，支持无限设备实时同步

const SUPABASE_CONFIG = {
    // 🔧 待配置：访问 https://supabase.com 创建免费项目
    url: 'YOUR_SUPABASE_URL',  // 替换为你的 Supabase URL
    key: 'YOUR_SUPABASE_ANON_KEY',  // 替换为你的 anon key
};

// 如果未配置，则使用 localStorage（本地模式）
const useCloudStorage = SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL';

// 初始化 Supabase 客户端
let supabase = null;

if (useCloudStorage) {
    // 加载 Supabase 客户端库
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
        supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
        console.log('✅ 云端数据库已连接');
    };
    document.head.appendChild(script);
}

// 统一的数据存储接口
const DataStorage = {
    // 保存问卷反馈
    async saveFeedback(data) {
        if (useCloudStorage && supabase) {
            try {
                const { error } = await supabase
                    .from('feedbacks')
                    .insert([{
                        store: data.store,
                        table: data.table,
                        companion: data.companion,
                        rating: data.rating,
                        improvements: data.improvements,
                        suggestions: data.suggestions,
                        timestamp: data.timestamp,
                        date: data.date
                    }]);

                if (error) throw error;
                console.log('✅ 数据已保存到云端');
                return { success: true };
            } catch (error) {
                console.error('❌ 云端保存失败，使用本地存储:', error);
                return this.saveToLocal('ybl_answers', data);
            }
        } else {
            return this.saveToLocal('ybl_answers', data);
        }
    },

    // 获取所有反馈
    async getFeedbacks() {
        if (useCloudStorage && supabase) {
            try {
                const { data, error } = await supabase
                    .from('feedbacks')
                    .select('*')
                    .order('timestamp', { ascending: false });

                if (error) throw error;
                console.log(`✅ 从云端获取 ${data.length} 条反馈`);
                return data;
            } catch (error) {
                console.error('❌ 云端读取失败，使用本地存储:', error);
                return this.getFromLocal('ybl_answers');
            }
        } else {
            return this.getFromLocal('ybl_answers');
        }
    },

    // 本地存储（fallback）
    saveToLocal(key, data) {
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push(data);
        localStorage.setItem(key, JSON.stringify(existing));
        return { success: true };
    },

    getFromLocal(key) {
        return JSON.parse(localStorage.getItem(key) || '[]');
    },

    // 订阅实时更新
    subscribeToFeedbacks(callback) {
        if (useCloudStorage && supabase) {
            supabase
                .channel('feedbacks')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'feedbacks' }, payload => {
                    console.log('🔔 收到新反馈:', payload);
                    callback(payload.new);
                })
                .subscribe();
        }
    }
};
