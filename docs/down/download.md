---
hide:
  - toc # Hide toc
---

相关下载
==========

下载固件之前，建议先查看[更新日志](../changelog.md)

### 固件下载

!!! note "提示"

    - | [怎么升级2.4G无线功能](../keyboard/receiver.md) | [如何更新键盘主控固件?](../upgrade.md#更新键盘主控固件)  |  [如何更新USB固件?](../upgrade.md#更新USB固件) |  [固件名称命令规则？](../faq.md#固件名称命令规则)   |  

| 下载内容   | 说明  | 下载地址 |
| :------------:|  ------------| :------------: |
| <b> 键盘主控完整固件</b> <br>（nRF52系列芯片）|  <b>2023.03.03更新：优化键盘2.4G配对流程，优化2.4G跳频算法</b> <br>此固件基于nRF SDK17.1 <br> 完整固件可在SDK之间切换 <br> 刷写包包含所有键盘完整固件，可直接升级或修复键盘 | <a href="https://down.glab.online:5550/Glab3.1/" class="button">📦官网下载页</a> <br> <a href="https://github.com/genokolar/nrf52-keyboard/releases" class="button">🧱Github发布页</a>|
| <b>USB固件</b><br>（CH55x芯片） | <b>2022.06.24更新：修正USB模式下无法唤醒睡眠的电脑的问题 </b> <br><b>2022.03.03更新：增强USB兼容性，解决部分电脑卡BIOS的问题 </b> <br> 部分电脑上存在兼容性问题，如联想小新air、惠普光影精灵5代等 <br> 建议存在上述问题的更新USB固件。 |<a href="https://down.glab.online:5550/ch554" class="button">📦官方下载页</a> <br> <a href="https://github.com/genokolar/nrf52-keyboard/releases/" class="button">🧱Github发布页</a>|
| <b>2.4G接收器固件</b><br>（含USB及主固件） | <b>2022.12.19更新：优化动态跳频算法 </b> <br> 建议及时更新固件获得更好体验。 |<a href="https://down.glab.online:5550/receiver" class="button">📦官方下载页</a> |



###  烧录&配置工具

| 下载内容   | 说明  | 下载地址 |
| :------------:|  ------------| :------------: |
| 烧录工具 | USB固件及键盘主控固件烧录工具。<br>操作系统仅限Winodws，且需高于Windows 7 SP1。 | <a href="https://down.glab.online:5550/wch_nrf_burner_setup_1.2.2.0.exe" class="button">📦1.2.2.0版</a><br><a href="https://pan.quark.cn/s/f522c75494dc" class="button">🗂️夸克网盘下载</a> |
| 配置工具（绿色版） | 配置工具本地服务端，必须开启才能配置键盘<br>版本：1.0.5.0 - 支持：Windows/Linux/Mac OS<br>支持离线使用（访问http://localhost:5000） | <a href="https://down.glab.online:5550/lkb-configurator" class="button">📦官方下载</a><br><a href="https://pan.quark.cn/s/5ad4827075c6" class="button">🗂️夸克网盘下载</a><br><a href="https://github.com/Lotlab/lkb-configurator/releases" class="button">🧱Github发布页</a> |
| CMSIS-DAP烧录工具 | 键盘主控完整固件的烧录脚本<br> 可更新整个键盘主控，可作为键盘修复工具| <a href="https://down.glab.online:5550/Glab3.1/cmsis" class="button" title="可直接刷写固件的刷写包">📦官方下载</a> |
| 接收器控制工具 | 2.4G接收器控制面板，用于无法访问在线网站时离线使用<br>仅限Windows 64位使用 |<a href="https://down.glab.online:5550/receiver//ControlPanel 1.0.0.exe" class="button">📦官方下载</a>|
| nRF Connect | DFU升级所需手机APP<br>Android版本 |<a href="https://down.glab.online:5550/nRF.Connect.4.26.0.apk" class="button">📦nRF Connect(Android)</a>|

### 定位板图纸

| 下载内容   | 说明  | 下载地址 |
| ------------|  ------------| ------------ |
| 键盘的定位板文件 | 各个键盘的定位板图纸，可用于自己定制定位板或外壳 |<a href="https://down.glab.online:5550/dxf" class="button">📦官方下载</a> <br> <a href="https://pan.quark.cn/s/1d8c704f258b" class="button">🗂️夸克网盘下载</a>|
| GT PAD 开源文件 | 定位板制造文件、外壳3D图纸等硬件开源文件 <br> 定位板与外壳 Rev.A与Rev.B通用|<a href="https://pan.quark.cn/s/06f954c" class="button">🗂️夸克网盘下载</a>|
| GT Volta9 开源文件 | 定位板制造文件、外壳3D图纸等硬件开源文件 | <a href="https://pan.quark.cn/s/1083e26f2c6f" class="button">🗂️夸克网盘下载</a>|

