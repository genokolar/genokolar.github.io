NewHope64 键盘
=====================

NewHope64 Rev.B
------------

### 描述

- 5x14的60%键盘
- 支持RGB轴灯（同QMK灯效）
- Type-C接口,引出外接USB接口
- 键盘主控为nRF52810（芯片+贴片天线）
- 采用热拔插方式（佳达隆轴座）
- 支持旋转编码器
- 共引出4个针脚可自行添加外设
- RGB轴灯兼容指示灯
- PCB尺寸：285mm×95.3mm

![](../img/newhope64_b.jpg "NewHope64 Rev.b PCB")

### RGB轴灯说明

此版轴灯采用WS2812 RGB灯，支持各种丰富绚丽的灯效（同QMK灯效），支持Caps指示灯、USB与蓝牙状态指示灯。

可采用<kbd>Lshift</kbd>+<kbd>Rshift</kbd>+<kbd>Z</kbd> <kbd>X</kbd> <kbd>C</kbd> <kbd>V</kbd>等RGB控制功能调整RGB轴灯。

或 接入配置工具，找到 灯光 功能，将RGB阵列相关按键设定到你指定的按键上控制RGB灯光。

由于WS2812的静态耗电非常大，哪怕是Keypress类灯效（只有按键后才会亮灯），耗电也很大。所以在使用电池供电时，请尽量关闭RGB以便节电。需要使用灯效的情况，建议采用USB供电。

### 指示灯说明

由第三排左起第一颗灯指示Capslock状态；由第一排左起第二颗灯指示键盘输出状态；

- 绿色-USB输出
- 蓝色-蓝牙通道1️⃣输出
- 红色-蓝牙通道2️⃣输出
- 橙色-蓝牙通道3️⃣输出
- 青色-2.4G无线1️⃣输出
- 紫色-2.4G无线2️⃣输出
- 粉色-2.4G无线3️⃣输出
- 黄色-2.4G无线接收器接收模式启用

指示灯可通过<kbd>Lshift</kbd>+<kbd>Rshift</kbd>+<kbd>L</kbd> 或 通过配置工具设置一颗<kbd>状态灯开关</kbd>按键 开关

指示灯支持独立运行，建议在使用电池时，关闭RGB轴灯，开启指示灯，指示灯将可自动关闭节能

### 如何启用旋钮编码器

只需要将旋钮编码器焊接到ESC位置，然后接入配置工具，找到键盘设置--布局配置--编码器选项，将按键更改成编码器。

顶部出现的两颗按钮就是旋转功能，下面第一颗按键，就是旋钮按键功能。

![](../img/rotary.png "按键示意图")

NewHope64 Rev.A
------------


- 5x14的60%键盘，双空格64的布局
- Type-C接口
- 键盘主控为nRF52832（信驰达RF-BM-ND04蓝牙模块）
- 采用热拔插方式（佳达隆轴座）
- 状态指示灯3颗
- Caps指示灯1颗
- 预留WS2812 RGB灯带焊接位
- PCB尺寸：285mm×95.3mm



下载及说明
----------

[:fontawesome-solid-download:  下载固件](https://down.glab.online:5550/Glab3.2/){ .md-button}

[:fontawesome-solid-screwdriver-wrench:  获取更多下载](../down/download.md){ .md-button}

访问 [使用说明](../manual.md) / [常见问答](../faq.md) / [故障排除](../trouble.md)