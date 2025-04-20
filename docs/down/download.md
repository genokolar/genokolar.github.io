---
hide:
  - toc # Hide toc
---

相关下载
==========

!!! note "提示"

    - | [怎么升级2.4G无线功能](../keyboard/receiver.md) | [如何更新键盘主控固件?](../upgrade.md#更新键盘主控固件)  |  [如何更新USB固件?](../upgrade.md#更新USB固件) |  [固件名称命令规则？](../faq.md#固件名称命令规则)   |  

!!! info "下载固件之前，建议先查看[更新日志](../changelog.md)"

### 固件下载




=== "键盘主控固件"

    - 2025.03.18更新（建议完整擦除芯片数据后刷入完整固件）:

        - 支持 “hold on other key press” 模式
        - 当tapping term> 250 时自动启用“permissive hold” 与 “hold on other key pres” 模式
        - 重新启用看门狗增强键盘稳定性
        - 修正无线模式通道切换出错问题
        - 微调部分代码

      <a href="https://down.glab.online:5550/Glab3.2/" class="button2">🌍官网下载</a>
      <a href="https://down6.glab.online:5550/Glab3.2/" class="button2">🌏官方下载（IPv6）</a>
      <a href="https://github.com/genokolar/nrf52-keyboard/releases" class="button2">🧱Github发布页</a>

=== "USB固件" 

    - 2024.11.11更新：
        - 支持免工具USB改键
        - 建议配合2024年11月11日后键盘固件使用

      <a href="https://down.glab.online:5550/ch554" class="button2">🌍官方下载</a>
      <a href="https://down6.glab.online:5550/ch554" class="button2">🌏官方下载（IPv6）</a>
      <a href="https://github.com/genokolar/nrf52-keyboard/releases/" class="button2">🧱Github发布页</a>

=== "2.4G接收器固件"

    - 2025.01.22更新（需同步更新键盘固件）：
        - 2.4G接收器跳频优化
        - 修正2.4G无线配置键盘时，HID下发配置出错问题
        - 当无键盘连接时，由接收器响应HID命令
        - 优化多键盘同时连接的通讯能力

      <a href="https://down.glab.online:5550/receiver" class="button2">🌍官方下载</a>
      <a href="https://down6.glab.online:5550/receiver" class="button2">🌏官方下载（IPv6）</a>

###  烧录&配置工具

=== "烧录工具"

    - USB固件及键盘主控固件烧录工具1.2.3.0版。
    - 操作系统仅限Winodws，且需高于Windows 7 SP1。

      <a href="https://down.glab.online:5550/wch_nrf_burner_setup_1.2.3.0_x86.exe" class="button2">🌍32位官网下载</a>
      <a href="https://down.glab.online:5550/wch_nrf_burner_setup_1.2.3.0_x64.exe" class="button2">🌍64位官网下载</a>
      <a href="https://down6.glab.online:5550/wch_nrf_burner_setup_1.2.3.0_x86.exe" class="button2">🌏32位官网下载（IPv6）</a>
      <a href="https://down6.glab.online:5550/wch_nrf_burner_setup_1.2.3.0_x64.exe" class="button2">🌏64位官网下载（IPv6）</a><br>

=== "配置工具" 

    - 配置工具本地服务端 版本：1.0.7.0
    - 支持：Windows/Linux/Mac OS，支持离线使用
    - 2024年10月07日后键盘固件已支持免工具在线配置

      <a href="https://down.glab.online:5550/lkb-configurator" class="button2">🌍官方下载</a>
      <a href="https://down6.glab.online:5550/lkb-configurator" class="button2">🌏官方下载（IPv6）</a>
      <a href="https://github.com/Lotlab/lkb-configurator/releases" class="button2">🧱Github发布页</a>

### 开源文件

=== "定位板文件"

    - 各个键盘的定位板图纸，可用于自己定制定位板或外壳

      <a href="https://down.glab.online:5550/dxf" class="button2">🌍官方下载</a>
      <a href="https://down6.glab.online:5550/dxf" class="button2">🌍官方下载（IPv6）</a>
      <a href="https://pan.quark.cn/s/1d8c704f258b" class="button2">🗂️夸克网盘下载</a>

=== "GT PAD 开源文件" 

    - 定位板制造文件、外壳3D图纸等硬件开源文件
    - 定位板与外壳 Rev.A与Rev.B通用 


      <a href="https://pan.quark.cn/s/06f954c7961b" class="button2">🗂️夸克网盘下载</a>

=== "GT Volta9 开源文件" 

    - 定位板制造文件、外壳3D图纸等硬件开源文件

      <a href="https://pan.quark.cn/s/1083e26f2c6f" class="button2">🗂️夸克网盘下载</a>

