import os

# 获取当前目录
current_dir = os.getcwd()

chars = set()

targets = [
    "./"  # 从当前目录开始遍历
]

# 接受的文件扩展名列表
accept = [
    "md", "html", "js", "css", "toml",
]

def check_ext(filename):
    """检查文件扩展名是否被接受"""
    return any(filename.endswith(ext) for ext in accept)

def solve_file(filepath):
    """读取文件并更新字符集合"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        chars.update(c for c in content if c.isprintable())  # 只添加可打印字符
    except Exception as e:
        print(f"Error reading file {filepath}: {e}")

# 遍历目录和子目录
for target in targets:
    for dirpath, dirnames, filenames in os.walk(target):
        for filename in filenames:
            if check_ext(filename):
                filepath = os.path.join(dirpath, filename)  # 使用os.path.join确保路径正确
                solve_file(filepath)

listed_chars = sorted(chars)  # 直接排序
char_count = len(listed_chars)

# 输出字符数量和字符列表
print(f"Total unique characters: {char_count}")
print("".join(listed_chars))

# 将字符写入文件
with open('words.txt', 'w', encoding='utf-8') as file:
    file.write(' '.join(listed_chars))

# 打印完成信息
print("Characters have been written to 'words.txt'.")