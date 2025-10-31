#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
图片自动处理器
功能：压缩图片、调整尺寸、批量处理
作者：刘运
"""

import os
import sys
from pathlib import Path

def check_pillow():
    """检查并安装Pillow库"""
    try:
        from PIL import Image
        print("✓ Pillow库已安装")
        return True
    except ImportError:
        print("× 未安装Pillow库")
        print("正在安装Pillow...")
        os.system(f"{sys.executable} -m pip install Pillow")
        try:
            from PIL import Image
            print("✓ Pillow安装成功！")
            return True
        except ImportError:
            print("✗ Pillow安装失败，请手动执行: pip3 install Pillow")
            return False

def get_file_size_mb(file_path):
    """获取文件大小(MB)"""
    size_bytes = os.path.getsize(file_path)
    return size_bytes / (1024 * 1024)

def optimize_image(input_path, output_path=None, max_size_mb=1.0, max_width=1920, quality=85):
    """
    优化图片

    参数:
        input_path: 输入图片路径
        output_path: 输出路径(None则覆盖原文件)
        max_size_mb: 最大文件大小(MB)
        max_width: 最大宽度(像素)
        quality: 压缩质量(1-100)
    """
    from PIL import Image

    # 打开图片
    img = Image.open(input_path)
    original_size = get_file_size_mb(input_path)

    # 获取原始尺寸
    width, height = img.size

    print(f"\n处理: {os.path.basename(input_path)}")
    print(f"  原始尺寸: {width}x{height}")
    print(f"  原始大小: {original_size:.2f} MB")

    # 转换为RGB模式(如果是PNG/RGBA)
    if img.mode in ('RGBA', 'LA', 'P'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
        img = background

    # 调整尺寸(如果宽度超过max_width)
    if width > max_width:
        ratio = max_width / width
        new_width = max_width
        new_height = int(height * ratio)
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        print(f"  调整尺寸: {new_width}x{new_height}")

    # 设置输出路径
    if output_path is None:
        path_obj = Path(input_path)
        output_path = str(path_obj.parent / f"{path_obj.stem}_optimized{path_obj.suffix}")

    # 保存优化后的图片
    img.save(output_path, "JPEG", quality=quality, optimize=True)
    new_size = get_file_size_mb(output_path)

    # 如果还是太大，降低质量重新保存
    if new_size > max_size_mb and quality > 50:
        quality = 70
        img.save(output_path, "JPEG", quality=quality, optimize=True)
        new_size = get_file_size_mb(output_path)

    print(f"  优化后大小: {new_size:.2f} MB")
    print(f"  压缩率: {((original_size - new_size) / original_size * 100):.1f}%")
    print(f"  保存到: {output_path}")

    return output_path

def batch_optimize(folder_path, max_size_mb=1.0, max_width=1920, quality=85):
    """批量处理文件夹中的所有图片"""
    from PIL import Image

    # 支持的图片格式
    supported_formats = {'.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff', '.webp'}

    folder = Path(folder_path)
    image_files = [f for f in folder.iterdir()
                   if f.is_file() and f.suffix.lower() in supported_formats]

    if not image_files:
        print("未找到支持的图片文件")
        return

    print(f"\n找到 {len(image_files)} 个图片文件")

    # 创建输出文件夹
    output_folder = folder / "optimized"
    output_folder.mkdir(exist_ok=True)

    success_count = 0
    for img_file in image_files:
        try:
            output_path = output_folder / f"{img_file.stem}_optimized.jpg"
            optimize_image(str(img_file), str(output_path), max_size_mb, max_width, quality)
            success_count += 1
        except Exception as e:
            print(f"  ✗ 处理失败: {e}")

    print(f"\n批量处理完成！成功: {success_count}/{len(image_files)}")
    print(f"输出文件夹: {output_folder}")

    # 在Finder中打开输出文件夹
    os.system(f'open "{output_folder}"')

def interactive_mode():
    """交互式模式"""
    print("=" * 60)
    print("图片自动处理器 - 压缩优化工具".center(60))
    print("=" * 60)
    print("\n请选择处理模式:")
    print("1. 单个图片处理")
    print("2. 批量处理文件夹")
    print("3. 退出")

    choice = input("\n请输入选项(1/2/3): ").strip()

    if choice == '1':
        # 单个图片处理
        file_path = input("\n请输入图片路径(或拖拽图片到终端): ").strip().strip('"').strip("'")

        if not os.path.exists(file_path):
            print("✗ 文件不存在！")
            return

        print("\n高级设置(直接回车使用默认值):")
        max_size = input("  最大文件大小(MB) [默认: 1.0]: ").strip() or "1.0"
        max_width = input("  最大宽度(像素) [默认: 1920]: ").strip() or "1920"
        quality = input("  压缩质量(1-100) [默认: 85]: ").strip() or "85"

        try:
            optimize_image(
                file_path,
                max_size_mb=float(max_size),
                max_width=int(max_width),
                quality=int(quality)
            )
            print("\n✓ 处理完成！")
        except Exception as e:
            print(f"\n✗ 处理失败: {e}")

    elif choice == '2':
        # 批量处理
        folder_path = input("\n请输入文件夹路径(或拖拽文件夹到终端): ").strip().strip('"').strip("'")

        if not os.path.exists(folder_path):
            print("✗ 文件夹不存在！")
            return

        print("\n高级设置(直接回车使用默认值):")
        max_size = input("  最大文件大小(MB) [默认: 1.0]: ").strip() or "1.0"
        max_width = input("  最大宽度(像素) [默认: 1920]: ").strip() or "1920"
        quality = input("  压缩质量(1-100) [默认: 85]: ").strip() or "85"

        try:
            batch_optimize(
                folder_path,
                max_size_mb=float(max_size),
                max_width=int(max_width),
                quality=int(quality)
            )
        except Exception as e:
            print(f"\n✗ 批量处理失败: {e}")

    elif choice == '3':
        print("\n再见！")
        return

    else:
        print("\n无效选项！")

def main():
    """主函数"""
    # 检查Pillow库
    if not check_pillow():
        return

    print()

    # 检查命令行参数
    if len(sys.argv) > 1:
        # 命令行模式
        input_path = sys.argv[1]
        if os.path.isfile(input_path):
            optimize_image(input_path)
        elif os.path.isdir(input_path):
            batch_optimize(input_path)
        else:
            print(f"✗ 路径不存在: {input_path}")
    else:
        # 交互式模式
        interactive_mode()

if __name__ == "__main__":
    main()
