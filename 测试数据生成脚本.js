// 🧪 测试数据生成脚本
// 用途：快速生成测试数据，用于演示新功能
// 使用方法：在浏览器控制台（F12）中粘贴并运行

console.log('🚀 开始生成测试数据...');

// 1. 生成门店数据
function generateStores() {
    const stores = [
        {
            id: Date.now(),
            name: "朝阳店",
            tables: ["1", "2", "3", "4", "5"],
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 1,
            name: "三里屯店",
            tables: ["1", "2", "3"],
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 2,
            name: "测试店",
            tables: ["1", "2"],
            createdAt: new Date().toISOString()
        }
    ];

    localStorage.setItem('ybl_stores', JSON.stringify(stores));
    console.log('✅ 已生成 3 个门店');
    return stores;
}

// 2. 生成问卷反馈数据
function generateFeedbacks() {
    const stores = JSON.parse(localStorage.getItem('ybl_stores') || '[]');
    const feedbacks = [];

    const companions = ['家人', '朋友', '同事', '独自'];
    const improvements = [
        ['菜品-口味', '服务'],
        ['环境', '菜品-分量'],
        ['价格', '菜品-口味'],
        ['服务', '环境'],
        ['菜品-分量']
    ];
    const suggestions = [
        '希望增加素菜',
        '服务态度很好',
        '环境需要改善',
        '价格有点贵',
        '菜品很好吃',
        '希望优惠多一些',
        ''
    ];

    stores.forEach((store, storeIndex) => {
        store.tables.forEach((table, tableIndex) => {
            // 每个桌位生成 1-3 条反馈
            const feedbackCount = Math.floor(Math.random() * 3) + 1;

            for (let i = 0; i < feedbackCount; i++) {
                // 测试店多生成一些1星差评
                let rating;
                if (store.name === '测试店') {
                    rating = Math.random() > 0.6 ? 1 : Math.floor(Math.random() * 3) + 3;
                } else {
                    rating = Math.floor(Math.random() * 3) + 3; // 3-5星
                }

                const timestamp = Date.now() - (storeIndex * 100000) - (tableIndex * 10000) - (i * 1000);

                feedbacks.push({
                    store: store.name,
                    table: table,
                    companion: companions[Math.floor(Math.random() * companions.length)],
                    rating: rating,
                    improvements: improvements[Math.floor(Math.random() * improvements.length)],
                    suggestions: suggestions[Math.floor(Math.random() * suggestions.length)],
                    timestamp: timestamp,
                    date: new Date(timestamp).toLocaleString('zh-CN')
                });
            }
        });
    });

    localStorage.setItem('ybl_answers', JSON.stringify(feedbacks));
    console.log(`✅ 已生成 ${feedbacks.length} 条反馈`);
    return feedbacks;
}

// 3. 生成问卷配置（如果不存在）
function generateQuestionnaireConfig() {
    const existingConfig = localStorage.getItem('ybl_questionnaire_config');
    if (existingConfig) {
        console.log('ℹ️ 问卷配置已存在，跳过生成');
        return;
    }

    const config = {
        questions: [
            {
                id: 1,
                type: 'radio',
                title: '今天是和谁一起用餐的呢？',
                subtitle: '单选',
                options: ['家人', '朋友', '同事', '独自']
            },
            {
                id: 2,
                type: 'rating',
                title: '整体满意度如何？',
                subtitle: '请为我们打分',
                maxStars: 5
            },
            {
                id: 3,
                type: 'checkbox',
                title: '哪些方面需要改进？',
                subtitle: '可多选',
                options: [
                    '菜品-口味',
                    '菜品-分量',
                    '服务',
                    '环境',
                    '价格',
                    '其他'
                ]
            },
            {
                id: 4,
                type: 'text',
                title: '还有什么想对我们说的吗？',
                subtitle: '您的建议对我们很重要',
                placeholder: '请输入您的宝贵建议...'
            }
        ],
        completionPage: {
            title: '感谢您的反馈！',
            message: '您的意见对我们非常重要，我们会持续改进！'
        }
    };

    localStorage.setItem('ybl_questionnaire_config', JSON.stringify(config));
    console.log('✅ 已生成问卷配置');
}

// 4. 生成网站配置
function generateSiteConfig() {
    const siteUrl = 'https://a17380648227-creator.github.io/yebailing-survey';
    localStorage.setItem('ybl_site_url', siteUrl);
    console.log('✅ 已配置网站URL');
}

// 5. 主函数：生成所有测试数据
function generateAllTestData() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🧪 野百灵餐厅 - 测试数据生成器');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    generateStores();
    generateFeedbacks();
    generateQuestionnaireConfig();
    generateSiteConfig();

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ 测试数据生成完成！');
    console.log('');
    console.log('📊 数据统计:');
    console.log(`   门店: ${JSON.parse(localStorage.getItem('ybl_stores')).length} 个`);
    console.log(`   反馈: ${JSON.parse(localStorage.getItem('ybl_answers')).length} 条`);
    console.log('');
    console.log('💡 提示:');
    console.log('   1. 刷新页面查看数据');
    console.log('   2. 访问"数据备份"可以导出数据');
    console.log('   3. 访问"数据统计"可以查看和删除数据');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// 6. 清空所有测试数据
function clearAllTestData() {
    if (!confirm('⚠️ 确定要清空所有测试数据吗？')) {
        return;
    }

    localStorage.removeItem('ybl_stores');
    localStorage.removeItem('ybl_answers');
    localStorage.removeItem('ybl_questionnaire_config');

    console.log('🗑️ 所有测试数据已清空');
    console.log('💡 刷新页面查看效果');
}

// 7. 生成特定场景的测试数据
function generateScenario(scenario) {
    console.log(`🎬 生成场景: ${scenario}`);

    switch(scenario) {
        case 'empty':
            // 场景1: 空数据
            clearAllTestData();
            console.log('✅ 场景1: 空数据（用于测试导入功能）');
            break;

        case 'basic':
            // 场景2: 基础数据（少量门店和反馈）
            const basicStores = [{
                id: Date.now(),
                name: "朝阳店",
                tables: ["1", "2", "3"],
                createdAt: new Date().toISOString()
            }];
            localStorage.setItem('ybl_stores', JSON.stringify(basicStores));

            const basicFeedbacks = [
                {
                    store: "朝阳店",
                    table: "1",
                    companion: "家人",
                    rating: 5,
                    improvements: ["服务"],
                    suggestions: "很好",
                    timestamp: Date.now(),
                    date: new Date().toLocaleString('zh-CN')
                }
            ];
            localStorage.setItem('ybl_answers', JSON.stringify(basicFeedbacks));
            console.log('✅ 场景2: 基础数据（1个门店，1条反馈）');
            break;

        case 'lowrating':
            // 场景3: 大量低分反馈（用于测试批量删除）
            generateStores();
            const lowRatingFeedbacks = [];
            for (let i = 0; i < 20; i++) {
                lowRatingFeedbacks.push({
                    store: "测试店",
                    table: "1",
                    companion: "独自",
                    rating: 1,
                    improvements: ["菜品-口味", "服务", "环境"],
                    suggestions: "不满意",
                    timestamp: Date.now() - (i * 1000),
                    date: new Date(Date.now() - (i * 1000)).toLocaleString('zh-CN')
                });
            }
            localStorage.setItem('ybl_answers', JSON.stringify(lowRatingFeedbacks));
            console.log('✅ 场景3: 大量低分反馈（20条1星差评）');
            break;

        default:
            console.log('❌ 未知场景');
    }
}

// 8. 导出测试脚本使用说明
function showHelp() {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📖 测试数据生成脚本 - 使用说明');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('可用命令:');
    console.log('');
    console.log('  generateAllTestData()');
    console.log('    → 生成完整的测试数据（门店+反馈+配置）');
    console.log('');
    console.log('  clearAllTestData()');
    console.log('    → 清空所有测试数据');
    console.log('');
    console.log('  generateScenario("场景名")');
    console.log('    → 生成特定场景的数据');
    console.log('    可选场景:');
    console.log('      "empty"      - 空数据');
    console.log('      "basic"      - 基础数据');
    console.log('      "lowrating"  - 大量低分反馈');
    console.log('');
    console.log('  showHelp()');
    console.log('    → 显示本帮助信息');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
}

// 自动执行：生成完整测试数据
generateAllTestData();

console.log('');
console.log('💡 输入 showHelp() 查看更多命令');
console.log('');
