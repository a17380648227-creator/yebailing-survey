# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个**野百灵餐厅用餐反馈页面**项目,用于收集顾客的用餐反馈意见。项目包含一个具有苗族刺绣主题风格的单页面表单应用。

## 核心文件

- `index.html` - 主反馈页面,包含完整的HTML/CSS/JavaScript代码
- `生成二维码.py` - Python脚本,用于生成访问页面的二维码
- `部署步骤.md` - 详细的GitHub Pages部署指南
- `二维码使用说明.md` - 本地测试和永久部署方案说明

## 技术栈

- **前端**: 纯HTML + CSS + JavaScript (无框架依赖)
- **样式**: 苗族刺绣主题设计,使用CSS渐变和动画
- **部署**: GitHub Pages / Netlify (静态网站托管)
- **工具**: Python 3 + qrcode库 (用于二维码生成)

## 开发命令

### 本地测试
```bash
# 启动本地HTTP服务器(Python 3)
python3 -m http.server 8888

# 或使用Python 2
python -m SimpleHTTPServer 8888

# 访问地址: http://localhost:8888/index.html
```

### 生成二维码
```bash
# 确保已安装qrcode库
pip3 install qrcode[pil]

# 运行二维码生成脚本
python3 生成二维码.py
```

### Git操作
```bash
# 查看当前状态
git status

# 提交修改
git add .
git commit -m "描述修改内容"
git push

# 推送到GitHub Pages后,等待1-2分钟自动部署
```

## 架构说明

### 页面结构
- 单页面应用,所有代码集中在`index.html`中
- CSS样式内嵌在`<style>`标签中
- JavaScript逻辑内嵌在`<script>`标签中
- 表单数据通过console.log输出和alert提示(无后端存储)

### 设计特点
- **黑色主题背景**:使用CSS渐变和径向渐变模拟苗族刺绣图案
- **多层装饰**:通过`::before`和`::after`伪元素创建复杂的视觉效果
- **颜色方案**:
  - 主色:#fbbf24(黄金色)
  - 辅色:#2563eb(蓝色)、#92400e(棕色)
  - 背景:#0a0a0a(黑色)
- **响应式设计**:适配移动设备(max-width:640px)

### 表单功能
1. **用餐同伴选择**:多选框(家人/朋友/对象)
2. **改进意见**:分类多选(菜品-口味/分量/价格,服务,环境)
3. **其他建议**:自由文本输入框
4. **提交处理**:前端验证和提示,数据暂存在console

## 部署方案

### 方案一:GitHub Pages(推荐)
- 创建GitHub仓库`yebailing-feedback`
- 推送代码到main分支
- 在Settings → Pages中开启服务
- 网址格式:`https://用户名.github.io/yebailing-feedback/`
- 详细步骤见`部署步骤.md`

### 方案二:Netlify(最简单)
- 访问https://app.netlify.com/drop
- 拖拽`index.html`文件上传
- 自动获得永久网址

### 方案三:本地测试
- 启动本地HTTP服务器
- 获取本机局域网IP地址
- 生成局域网访问二维码
- 限制:仅同WiFi可访问,电脑需保持开机

## 修改注意事项

### 修改页面内容
- 标题在`<h1>`标签中(index.html:478)
- 欢迎文字在`.welcome-text`中(index.html:480-482)
- 问题选项在`.feedback-section`中修改

### 修改样式
- 主题色修改搜索`#fbbf24`、`#2563eb`、`#92400e`并替换
- 苗族刺绣图案在`body::before`和`body::after`中定义(index.html:24-104)
- 边框效果在`.container`的box-shadow中(index.html:113-117)

### 添加后端存储
当前版本无后端,如需存储数据:
1. 集成Google Forms
2. 使用Formspree等第三方服务
3. 搭建Node.js/Python后端API
4. 使用腾讯云/阿里云云函数

## 二维码生成说明

`生成二维码.py`脚本功能:
- 检查qrcode库是否安装
- 交互式输入网址
- 自动添加https://前缀
- 生成高容错率二维码(ERROR_CORRECT_H)
- 自动在Finder中显示生成的文件
- 输出文件:`二维码.png`(粉色填充,白色背景)

## Git仓库状态

- 主分支:`main`
- 初始提交:"Initial commit: 野百灵用餐反馈页面"
- 未跟踪文件:部署文档和工具脚本(部分文件包含中文文件名)

## 典型工作流程

1. **本地开发** → 修改`index.html` → 本地浏览器测试
2. **提交代码** → `git add . && git commit -m "..." && git push`
3. **等待部署** → GitHub Pages自动更新(1-2分钟)
4. **生成二维码** → 运行`python3 生成二维码.py`
5. **测试验证** → 手机扫码测试功能
