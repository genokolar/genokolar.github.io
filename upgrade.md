
固件更新教程
=====================

概述
---------------

您可能需要升级固件来获得新功能或者修复已有的BUG，请通过访问 [相关下载](download.md) 下载固件。

此系列键盘的固件分为蓝牙固件和USB固件，USB固件和蓝牙固件虽然有一一对应的关系，但一般情况下可以不升级USB固件，只有固件改动较大时才需要对应更新（最新USB固件为0816版本）。

警告:USB芯片可刷写更新次数上限为200次，请谨慎频繁更新USB，超过更新次数后可能导致无法再正常更新USB固件。

更新蓝牙固件
---------------

#### 线刷方式

注: 仅新的硬件支持`线刷`，部分PCB可能需要你更新USB固件以启用此功能。 [如何确认PCB支持线刷？](faq.md#如何确认PCB支持线刷)

1. 下载LotKB专属 [烧录工具](http://glab.online/down/wch_nrf_burner_setup.exe)，并安装。
2. 下载键盘对应的 [蓝牙核心固件](https://eyun.baidu.com/s/3bpVmTzx) 
3. 打开烧录工具`wch_nrf_burner.exe`。
4. 直接通过USB连接键盘。刷新当前设备列表，并下拉选择连接的键盘。
   - 此时设备列表名称有`Lotlab`字样。
5. 在“蓝牙固件”栏选择你第2步下载的蓝牙完整固件
6. 点击烧录按钮，等待烧录完成即可。

如果更新中出现传输问题等故障导致更新失败，上述方法无法更新时，可采用[CMSIS-DAP烧录](upgrade2.md#使用板载调试器强制更新蓝牙完整固件)更新整个蓝牙固件修复。

#### DFU升级方式

注: 老版PCB仅支持DFU升级方式。新版PCB`线刷`和DFU方式均支持

1. 使用手机安装并打开 nRF Connect 程序
   - 可以到[官方下载页面](https://www.nordicsemi.com/Software-and-tools/Development-Tools/nRF-Connect-for-mobile)或者应用商店搜索下载。
2. 使键盘进入DFU模式（参见 [如何进入DFU模式](faq.md#如何进入DFU模式)）
3. 点击nRF Connect右上角的Scan扫描蓝牙设备，找到`DFUTarg`标识的蓝牙设备
4. 点击CONNCET按钮，等待连接成功
4. 点击右上角的DFU按钮，选择第一个Distribution packet(ZIP)，然后选择下载的蓝牙固件包
5. 等待升级进度100%即可

如果您刷入了错误的程序而无法进入DFU模式，请 [强制进入DFU](faq.md#如何进入DFU模式) 然后更新。

具体可以参看图文PDF
    - [怎么升级蓝牙主控固件(android)](pdf/怎么升级蓝牙主控固件-android–GT系列蓝牙双模键盘官网.pdf)  
    - [怎么升级蓝牙主控固件(iOS)](pdf/怎么升级蓝牙主控固件-iOS–GT系列蓝牙双模键盘官网.pdf)


更新USB固件
-----------

警告: **刷入不正确的USB固件可能使你的键盘的USB功能工作不正常！** 请在更新前确认升级包是由可信的人员提供的。
   
1. 下载LotKB专属 [烧录工具](http://glab.online/down/wch_nrf_burner_setup.exe)，并安装。
2. 打开烧录工具`wch_nrf_burner.exe`。
3. 如已经刷入2020年8月16日后的USB固件：
   - 直接通过USB连接键盘。刷新当前设备列表，并下拉选择连接的键盘。
   - 此时设备列表名称有`Lotlab`字样。
4. 如USB固件较老，无法自动进入USB ISP刷写模式：
   - 需要参考 [如何进入USB刷写模式](faq.md#如何进入USB刷写模式) 手动使键盘进入USB ISP刷写模式
   - 刷新当前设备列表，并下拉选择连接的键盘。
   - 此时设备列表显示`USB ISP 设备`字样。
4. 在“USB固件”栏选择你要更新的USB固件。
5. 点击烧录按钮，等待烧录完成即可。

上述方法只支持Windows,若你在使用Linux，则可以使用三方的`WCHISP <https://github.com/rgwan/librech551>`来更新。

升级演示视频
----------

<video id="video" width="360px" height="auto" controls="controls" preload="none" poster="http://glab.online/wp-content/uploads/2019/10/favicon.png">
  <source id="1" src="http://glab.online/down/wch_nrf_burner.mp4" type="video/mp4">
  <source id="2" src="https://glab.online/wp-content/uploads/2020/01/DFU升级演示.mp4" type="video/mp4">
  您的浏览器不支持播放此视频
</video>

其他更新方法
-------------

如果您的硬件已经支持板载调试器升级(既`线刷`)，建议采用上述方式 进行蓝牙固件的升级。

如果您的PCB较老无法使用板载调试器升级(既`线刷`)，请采用[DFU升级方式](upgrade2.md#使用_DFU_模式更新蓝牙固件)进行升级。

如果遇到疑难问题，可以采用[CMSIS-DAP烧录](upgrade2.md#使用板载调试器强制更新蓝牙完整固件)更新整个蓝牙固件修复问题。

Linux系统下更新固件，请参考[旧版页面](upgrade2.md)