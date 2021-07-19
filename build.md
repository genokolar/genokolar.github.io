LotKB固件编译指南
====================
环境搭建
------------

此固件在Windows（Msys2）和Linux下编译通过。

#### Linux下环境的搭建

使用终端运行以下命令

```bash
   sudo apt install git make sdcc # 安装git make和sdcc编译工具。注意Ubuntu 18.04及之前的SDCC版本较旧，无法成功编译
   wget https://developer.arm.com/-/media/Files/downloads/gnu-rm/7-2018q2/gcc-arm-none-eabi-7-2018-q2-update-linux.tar.bz2 # 下载GCC
   tar xf gcc-arm-none-eabi-7-2018-q2-update-linux.tar.bz2 # 解压gcc
   mv gcc-arm-none-eabi-7-2018-q2-update/ ~/.local/ # 将GCC移动到用户目录
   rm gcc-arm-none-eabi-7-2018-q2-update-linux.tar.bz2 # 删除压缩包

   sudo apt install python3 python3-pip
   pip3 install nrfutil # 安装 nrfutil
```
注意:
   若无法正常使用 pip 安装nrfutil，请直接到项目主页 `下载 nrfutil <https://github.com/NordicSemiconductor/pc-nrfutil/releases>` 并放置于 ``[你的msys2安装目录]/usr/bin`` 目录下。

#### Windows下环境的搭建

下载安装下列程序

下载安装 `SDCC`  [点击进入官网下载地址](https://sourceforge.net/projects/sdcc/files/)

下载安装或解压 `GNU Arm Embedded Toolchain`  [gcc-arm-none-eabi下载地址](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm/downloads)

直接到项目主页 `下载 nrfutil.exe <https://github.com/NordicSemiconductor/pc-nrfutil/releases>` 并放置于 ``任意PATH`` 目录下。

下载并安装`Msys2`  [下载Msys2](https://sourceforge.net/projects/msys2/files/latest/download)

注: 你也可以访问：https://gitee.com/genokolar/nrf52_keyboard_compile_tools 根据说明文档快速建立Windows编译环境。


下载SDK
------------

下载Nordic nRF SDK 15.3
```bash
   wget http://developer.nordicsemi.com/nRF5_SDK/nRF5_SDK_v15.x.x/nRF5_SDK_15.3.0_59ac345.zip
   unzip -q nRF5_SDK_15.3.0_59ac345.zip
```
注: 本站采用源码为 ：https://gitee.com/genokolar/nrf52-keyboard 无需单独下载SDK

克隆源码并准备源码
------------

```bash
   git clone https://github.com/Lotlab/nrf52-keyboard # 克隆源码

   cd nrf52-keyboard

   # Linux 下修改这个
   cp template/Makefile.posix.template template/Makefile.posix
   nano template/Makefile.posix # 将里面的 GNU_INSTALL_ROOT 变量值改为 ~/.local/gcc-arm-none-eabi-7-2018-q2-update/bin/

   # Windows 下修改这个
   cp template/Makefile.windows.template template/Makefile.windows
   nano template/Makefile.windows # 将里面的 GNU_INSTALL_ROOT 变量值改为你的GCC安装目录

   # 将解压的nrf sdk复制到源码的SDK目录下，形成类似于SDK/components, SDK/config 的目录结构
```
注: 本站采用源码为 ：https://gitee.com/genokolar/nrf52-keyboard

测试编译
------------

```bash
   cd keyboard/template
   make -j
```
如果一切正常，则会编译出一个能用的固件。编译好的固件放置在对应键盘目录下的_build文件夹内。

Bootloader的编译
------------

```bash
   git submodule init -- # 初始化子模块，用于构建microecc库
   cd SDK/external/micro-ecc/nrf52nf_armgcc/armgcc
   make # 编译microecc库
   cd ../../../../../

   # 方法1：
   cd application/bootloader/project/armgcc/
   make SOFTDEVICE=S132 NRF_CHIP=nrf52832 NRF52_DISABLE_FPU=yes -j # nrf52832的编译命令
   make SOFTDEVICE=S112 NRF_CHIP=nrf52810 -j # nrf52810的编译命令

   # 方法2：
   cd keyboard/template
   make bootloader -j
```
如果一切正常，则Bootloader就编译完毕了。你可以在``_build`` 目录下找到编译好的Bootloader的hex文件。

主程序编译
------------

```bash
   cd keyboard/lkb-core
   make package -j # 生成用于DFU升级的升级包
   make ch554 -j # 生成USB固件
```

如果一切正常，就能够编译出一个固件升级包了。
你可以在``_build``目录下找到对应的``nrf52_kbd_XXXXXXXX.zip``升级包文件和``ch554.hex``USB固件文件。参照刷固件相关教程将其刷入键盘即可。

