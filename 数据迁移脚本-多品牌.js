// 🔄 数据迁移脚本 - 升级到多品牌系统
// 使用方法：在浏览器控制台（F12）中粘贴并运行

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔄 多品牌系统数据迁移工具');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

// 主迁移函数
function migrateTo MultiBrand() {
    console.log('📊 开始检查现有数据...');

    // 1. 检查是否已有品牌数据
    const existingBrands = JSON.parse(localStorage.getItem('ybl_brands') || '[]');

    if (existingBrands.length > 0) {
        console.log(`ℹ️ 已存在 ${existingBrands.length} 个品牌，跳过品牌初始化`);
    } else {
        console.log('🏢 初始化默认品牌: 野百灵、宁桂杏、邦兰埔');
        const defaultBrands = [
            { id: Date.now(), name: '野百灵', createdAt: new Date().toISOString() },
            { id: Date.now() + 1, name: '宁桂杏', createdAt: new Date().toISOString() },
            { id: Date.now() + 2, name: '邦兰埔', createdAt: new Date().toISOString() }
        ];
        localStorage.setItem('ybl_brands', JSON.stringify(defaultBrands));
        console.log('✅ 品牌创建成功');
    }

    // 2. 迁移门店数据
    const stores = JSON.parse(localStorage.getItem('ybl_stores') || '[]');
    console.log(`\n📦 检查到 ${stores.length} 个门店`);

    if (stores.length === 0) {
        console.log('ℹ️ 没有需要迁移的门店数据');
    } else {
        let migratedCount = 0;
        let skippedCount = 0;

        const brands = JSON.parse(localStorage.getItem('ybl_brands') || '[]');
        const defaultBrand = brands[0]; // 使用第一个品牌作为默认品牌

        stores.forEach((store, index) => {
            if (!store.brandId || !store.brandName) {
                // 需要迁移：分配到默认品牌
                console.log(`   迁移: ${store.name} → ${defaultBrand.name}`);
                store.brandId = defaultBrand.id;
                store.brandName = defaultBrand.name;
                migratedCount++;
            } else {
                // 已经有品牌信息
                skippedCount++;
            }
        });

        if (migratedCount > 0) {
            localStorage.setItem('ybl_stores', JSON.stringify(stores));
            console.log(`✅ 成功迁移 ${migratedCount} 个门店到品牌"${defaultBrand.name}"`);
        }

        if (skippedCount > 0) {
            console.log(`ℹ️ ${skippedCount} 个门店已有品牌信息，跳过`);
        }
    }

    // 3. 迁移问卷反馈数据
    const answers = JSON.parse(localStorage.getItem('ybl_answers') || '[]');
    console.log(`\n💬 检查到 ${answers.length} 条反馈`);

    if (answers.length === 0) {
        console.log('ℹ️ 没有需要迁移的反馈数据');
    } else {
        let migratedCount = 0;
        let skippedCount = 0;

        const stores = JSON.parse(localStorage.getItem('ybl_stores') || '[]');

        answers.forEach((answer, index) => {
            if (!answer.brand || answer.brand === '') {
                // 需要迁移：根据门店查找品牌
                const store = stores.find(s => s.name === answer.store);
                if (store && store.brandName) {
                    console.log(`   迁移反馈: ${answer.store} → 品牌: ${store.brandName}`);
                    answer.brand = store.brandName;
                    migratedCount++;
                } else {
                    // 找不到对应门店，标记为未知品牌
                    answer.brand = '未知品牌';
                    console.warn(`   ⚠️ 反馈关联的门店"${answer.store}"不存在，标记为"未知品牌"`);
                    migratedCount++;
                }
            } else {
                skippedCount++;
            }
        });

        if (migratedCount > 0) {
            localStorage.setItem('ybl_answers', JSON.stringify(answers));
            console.log(`✅ 成功迁移 ${migratedCount} 条反馈`);
        }

        if (skippedCount > 0) {
            console.log(`ℹ️ ${skippedCount} 条反馈已有品牌信息，跳过`);
        }
    }

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ 数据迁移完成！');
    console.log('');
    console.log('📋 迁移摘要:');

    const finalBrands = JSON.parse(localStorage.getItem('ybl_brands') || '[]');
    const finalStores = JSON.parse(localStorage.getItem('ybl_stores') || '[]');
    const finalAnswers = JSON.parse(localStorage.getItem('ybl_answers') || '[]');

    console.log(`   品牌数量: ${finalBrands.length}`);
    console.log(`   门店数量: ${finalStores.length}`);
    console.log(`   反馈数量: ${finalAnswers.length}`);
    console.log('');

    // 显示品牌分布
    console.log('📊 品牌分布:');
    finalBrands.forEach(brand => {
        const brandStores = finalStores.filter(s => s.brandId === brand.id || s.brandName === brand.name);
        const brandAnswers = finalAnswers.filter(a => a.brand === brand.name);
        console.log(`   ${brand.name}: ${brandStores.length} 个门店, ${brandAnswers.length} 条反馈`);
    });

    console.log('');
    console.log('💡 提示:');
    console.log('   1. 刷新页面查看效果');
    console.log('   2. 访问"品牌管理"页面查看所有品牌');
    console.log('   3. 在"门店管理"中可以调整门店的品牌归属');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// 检查数据状态
function checkMigrationStatus() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 多品牌系统数据检查');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    const brands = JSON.parse(localStorage.getItem('ybl_brands') || '[]');
    const stores = JSON.parse(localStorage.getItem('ybl_stores') || '[]');
    const answers = JSON.parse(localStorage.getItem('ybl_answers') || '[]');

    console.log(`🏢 品牌: ${brands.length} 个`);
    brands.forEach(b => console.log(`   - ${b.name} (ID: ${b.id})`));

    console.log(`\n🏪 门店: ${stores.length} 个`);
    const storesWithBrand = stores.filter(s => s.brandId && s.brandName).length;
    const storesWithoutBrand = stores.length - storesWithBrand;
    console.log(`   ✅ 已关联品牌: ${storesWithBrand}`);
    console.log(`   ❌ 未关联品牌: ${storesWithoutBrand}`);

    console.log(`\n💬 反馈: ${answers.length} 条`);
    const answersWithBrand = answers.filter(a => a.brand && a.brand !== '').length;
    const answersWithoutBrand = answers.length - answersWithBrand;
    console.log(`   ✅ 已关联品牌: ${answersWithBrand}`);
    console.log(`   ❌ 未关联品牌: ${answersWithoutBrand}`);

    console.log('');

    if (storesWithoutBrand > 0 || answersWithoutBrand > 0) {
        console.log('⚠️ 发现未迁移的数据，建议运行: migrateToMultiBrand()');
    } else {
        console.log('✅ 所有数据已迁移到多品牌系统');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// 手动分配品牌
function assignBrandToStore(storeName, brandName) {
    const stores = JSON.parse(localStorage.getItem('ybl_stores') || '[]');
    const brands = JSON.parse(localStorage.getItem('ybl_brands') || '[]');

    const store = stores.find(s => s.name === storeName);
    const brand = brands.find(b => b.name === brandName);

    if (!store) {
        console.error(`❌ 门店"${storeName}"不存在`);
        return false;
    }

    if (!brand) {
        console.error(`❌ 品牌"${brandName}"不存在`);
        return false;
    }

    store.brandId = brand.id;
    store.brandName = brand.name;

    localStorage.setItem('ybl_stores', JSON.stringify(stores));

    // 同步更新该门店的所有反馈
    const answers = JSON.parse(localStorage.getItem('ybl_answers') || '[]');
    let updatedCount = 0;

    answers.forEach(answer => {
        if (answer.store === storeName) {
            answer.brand = brandName;
            updatedCount++;
        }
    });

    if (updatedCount > 0) {
        localStorage.setItem('ybl_answers', JSON.stringify(answers));
    }

    console.log(`✅ 已将门店"${storeName}"分配给品牌"${brandName}"`);
    if (updatedCount > 0) {
        console.log(`✅ 同步更新了 ${updatedCount} 条反馈数据`);
    }

    return true;
}

// 显示帮助
function showMigrationHelp() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📖 多品牌迁移工具 - 使用说明');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('可用命令:');
    console.log('');
    console.log('  migrateToMultiBrand()');
    console.log('    → 自动迁移所有数据到多品牌系统');
    console.log('    → 将现有门店分配给默认品牌（野百灵）');
    console.log('');
    console.log('  checkMigrationStatus()');
    console.log('    → 检查当前数据状态');
    console.log('    → 显示哪些数据需要迁移');
    console.log('');
    console.log('  assignBrandToStore("门店名", "品牌名")');
    console.log('    → 手动将门店分配给指定品牌');
    console.log('    → 例: assignBrandToStore("朝阳店", "宁桂杏")');
    console.log('');
    console.log('  showMigrationHelp()');
    console.log('    → 显示本帮助信息');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// 自动执行检查
console.log('💡 输入以下命令使用迁移工具:');
console.log('');
console.log('   migrateToMultiBrand()     - 开始迁移');
console.log('   checkMigrationStatus()     - 检查状态');
console.log('   showMigrationHelp()        - 查看帮助');
console.log('');
