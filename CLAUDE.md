# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个**野百灵餐厅问卷管理系统**，包含顾客反馈问卷和完整的后台管理功能。

### 系统特点
- 🎯 **零后端**：纯前端实现，数据存储在 localStorage
- 💰 **零成本**：可免费部署到 GitHub Pages
- 📱 **响应式**：支持手机和电脑访问
- 🏪 **多门店**：支持多个门店和桌位管理
- 📊 **数据分析**：实时统计、筛选、导出功能

## 核心文件

### 管理后台
- `admin.html` - 后台首页，显示统计数据和功能入口
- `stores.html` - 门店管理，添加门店、设置桌位范围
- `data.html` - 数据统计，查看反馈、筛选、导出Excel
- `qrcode.html` - 二维码生成，为每张桌子生成专属二维码

### 顾客端
- `survey.html` - 问卷页面，顾客扫码后填写反馈
- `pic/` - 图片资源文件夹（轮播图背景等）

### 文档
- `【新手必看】完整部署教程.md` - 超详细的白话文部署指南

### 已弃用
- `style1-sunset-glow.html` - 旧版问卷页面（可删除）

## 技术栈

- **前端**: 纯 HTML + CSS + JavaScript（无框架依赖）
- **样式**: 渐变色设计，毛玻璃效果（backdrop-filter）
- **数据存储**: localStorage（浏览器本地存储）
- **二维码**: QRCode.js 库（CDN引入）
- **部署**: GitHub Pages / Netlify（静态托管）

## 数据结构

### localStorage 存储键

1. **ybl_stores** - 门店信息
```javascript
[
  {
    id: 1234567890,
    name: "朝阳店",
    tableStart: 1,
    tableEnd: 20,
    createdAt: "2024-01-01T00:00:00.000Z"
  }
]
```

2. **ybl_answers** - 问卷回答
```javascript
[
  {
    store: "朝阳店",
    table: "8",
    companion: "家人",
    rating: 5,
    improvements: ["菜品-口味", "服务"],
    suggestions: "希望增加素菜",
    timestamp: "2024-01-01T12:00:00.000Z",
    date: "2024/1/1 12:00:00"
  }
]
```

## 工作流程

### 管理员操作流程
1. 访问 `admin.html` 进入后台
2. 在 `stores.html` 添加门店和桌位
3. 在 `qrcode.html` 生成二维码
4. 打印二维码并放置在对应桌子上
5. 在 `data.html` 查看顾客反馈数据

### 顾客操作流程
1. 扫描桌上的二维码
2. 打开 `survey.html?store=朝阳店&table=8`
3. 观看轮播图（3张图片，每张1秒）
4. 填写4个问题的问卷
5. 提交反馈（数据保存到 localStorage）

### 二维码工作原理
每个二维码包含门店和桌号参数：
```
https://用户名.github.io/仓库名/survey.html?store=朝阳店&table=8
```

JavaScript 从 URL 解析参数，提交时自动关联门店和桌号。

## 部署方案

### 推荐方案：GitHub Pages（完全免费）

1. 创建 GitHub 仓库
2. 上传所有 `.html` 文件和 `pic/` 文件夹
3. 开启 GitHub Pages（Settings → Pages → Branch: main）
4. 访问 `https://用户名.github.io/仓库名/admin.html`

**详细步骤**：见 `【新手必看】完整部署教程.md`

### 替代方案：Netlify

1. 访问 https://app.netlify.com/drop
2. 拖拽所有文件到页面
3. 自动获得网址

## 修改指南

### 修改问卷问题

编辑 `survey.html`：

- **问题1**（单选）：line 922-946
- **问题2**（星级评分）：line 950-964
- **问题3**（多选）：line 968-997
- **问题4**（文本输入）：line 1001-1010

### 修改轮播图

替换 `pic/` 文件夹中的图片：
- `product1.jpg` - 第1张轮播图
- `product2.jpg` - 第2张轮播图
- `product3.jpg` - 第3张轮播图

轮播设置在 `survey.html` line 1077（每张显示1秒）

### 修改主题色

搜索并替换以下颜色值：
- `#667eea` 和 `#764ba2` - 主渐变色（紫色）
- `#3b82f6` - 蓝色强调色
- `#e5e7eb` - 边框颜色

### 修改品牌信息

- 餐厅名称：搜索 `野百灵` 全局替换
- Logo：修改各 HTML 文件中的 `.logo` 内容

## 系统限制

### ⚠️ 重要限制

1. **数据本地化**
   - 数据保存在浏览器 localStorage
   - 不同设备、不同浏览器数据不互通
   - 清除浏览器数据会丢失

2. **推荐使用方式**
   - 在店内准备专用平板/iPad
   - 所有顾客用同一设备扫码填写
   - 这样数据集中在一台设备上

3. **数据备份**
   - 必须定期导出数据到 Excel
   - 建议每周备份一次

### 如需真正的多设备同步

需要搭建后端服务器：
- 后端：Node.js / Python / PHP
- 数据库：MySQL / MongoDB
- 服务器：阿里云 / 腾讯云（需付费）

## 开发命令

### 本地测试
```bash
# 启动本地服务器
python3 -m http.server 8888

# 访问地址
http://localhost:8888/admin.html
http://localhost:8888/survey.html
```

### Git操作
```bash
# 查看状态
git status

# 提交修改
git add .
git commit -m "描述修改内容"
git push

# 推送后等待1-2分钟，GitHub Pages 自动部署
```

## 浏览器兼容性

- ✅ Chrome / Edge（推荐）
- ✅ Safari（iOS、macOS）
- ✅ Firefox
- ⚠️ IE 11 及以下不支持（backdrop-filter 等特性）

## 安全说明

- 无用户认证系统（任何人知道网址都能访问后台）
- 适合内部使用，不建议公开后台网址
- 如需安全保护，建议：
  - 使用 GitHub Private 仓库（需付费）
  - 添加简单的密码验证页面

## 性能优化

- 轮播图使用懒加载
- 二维码使用 CDN 库（QRCode.js）
- 数据导出使用 Blob 下载（无需服务器）

## 典型问题排查

### 问题1：二维码扫不出来
- 检查网址是否正确
- 确认 `survey.html` 已上传
- 二维码可能太小，建议打印 10cm x 10cm

### 问题2：后台看不到数据
- 检查是否在同一台设备/浏览器
- 顾客需要在管理设备上填写问卷

### 问题3：轮播图不显示
- 确认 `pic/` 文件夹已上传
- 检查图片文件名是否正确（product1.jpg 等）
- 打开浏览器控制台查看错误信息

### 问题4：导出Excel打开乱码
- 使用 Excel 打开（不要用记事本）
- 如果还是乱码，用 Excel 的"导入数据"功能，选择 UTF-8 编码

## 扩展功能建议

### 可以自己添加的功能
1. 简单密码保护（JavaScript 实现）
2. 更多问题类型（下拉框、日期选择等）
3. 自定义轮播图数量
4. 数据可视化图表（使用 Chart.js）
5. 打印友好的二维码排版页面

### 需要后端支持的功能
1. 多设备数据同步
2. 实时推送通知
3. 用户权限管理
4. 自动备份
5. API 接口

## 更新日志

### v2.0 (2024-10-31)
- ✨ 新增完整的后台管理系统
- ✨ 新增门店和桌位管理
- ✨ 新增数据统计和导出功能
- ✨ 新增二维码批量生成
- 🔄 重构数据存储结构
- 📚 新增超详细部署教程

### v1.0 (2024-10-23)
- 🎉 初始版本：基础问卷页面

## 联系方式

如有技术问题，可以：
1. 查看 `【新手必看】完整部署教程.md`
2. 在 GitHub 仓库提 Issue
3. 联系开发者

---

**📌 快速开始**：直接阅读 `【新手必看】完整部署教程.md`
