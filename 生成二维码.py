#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
野百灵用餐反馈 - 二维码生成器
使用方法：python3 生成二维码.py
"""

import sys

def check_and_install_qrcode():
    """检查并提示安装qrcode库"""
    try:
        import qrcode
        return True
    except ImportError:
        print("=" * 60)
        print("⚠️  检测到系统缺少 qrcode 库")
        print("=" * 60)
        print("\n为了生成二维码，需要先安装这个库。")
        print("\n请在终端执行以下命令：")
        print("\n    pip3 install qrcode[pil]")
        print("\n安装完成后，再次运行本脚本即可。")
        print("\n" + "=" * 60)
        return False

def generate_qrcode():
    """生成二维码"""
    import qrcode
    from PIL import Image

    print("\n" + "=" * 60)
    print("🌾 野百灵用餐反馈 - 二维码生成器")
    print("=" * 60)

    # 获取用户输入的网址
    print("\n请输入你的GitHub Pages网址：")
    print("（格式：https://你的用户名.github.io/yebailing-feedback/）")
    url = input("\n网址：").strip()

    if not url:
        print("\n❌ 错误：网址不能为空！")
        return

    if not url.startswith('http'):
        print("\n⚠️  警告：网址应该以 http:// 或 https:// 开头")
        url = 'https://' + url
        print(f"已自动添加：{url}")

    print(f"\n正在为网址生成二维码：{url}")

    # 创建二维码
    qr = qrcode.QRCode(
        version=1,  # 二维码大小（1-40）
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # 高容错率
        box_size=10,  # 每个小格子的像素大小
        border=4,  # 边框大小
    )

    qr.add_data(url)
    qr.make(fit=True)

    # 生成图片
    img = qr.make_image(fill_color="#ff6a88", back_color="white")

    # 保存
    output_file = "二维码.png"
    img.save(output_file)

    print(f"\n✅ 成功！二维码已保存为：{output_file}")
    print(f"📱 用手机扫描这个二维码即可访问你的反馈页面")
    print(f"📍 文件位置：/Users/liuyun/Desktop/桌面二维码/{output_file}")

    # 尝试在Finder中显示文件
    try:
        import subprocess
        subprocess.run(['open', '-R', output_file])
        print(f"\n已在Finder中打开文件位置")
    except:
        pass

    print("\n" + "=" * 60)

def main():
    """主函数"""
    if not check_and_install_qrcode():
        sys.exit(1)

    try:
        generate_qrcode()
    except KeyboardInterrupt:
        print("\n\n⚠️  用户取消操作")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ 发生错误：{e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
