
固件更新教程
=====================

概述
---------------

您可能需要升级固件来获得新功能或者修复已有的BUG，请通过访问 [相关下载](down/download.md) 下载固件。

此系列键盘的固件分为 蓝牙固件 和 USB固件，USB固件和蓝牙固件虽然有一一对应的关系，但一般情况下可以不升级USB固件，只有固件改动较大时才需要对应更新（最新USB固件为0816版本）。

蓝牙固件分为 蓝牙核心固件 和 蓝牙完整固件，一般仅需要更新蓝牙核心固件。蓝牙完整固件包括：蓝牙核心固件、Bootloader、SD协议栈。

<span id="更新蓝牙固件">更新蓝牙固件</span>
---------------

#### 线刷方式

!!! tip "仅新的硬件支持`线刷`，部分PCB可能需要你更新USB固件以启用此功能。 [如何确认PCB支持线刷？](faq.md#如何确认PCB支持线刷)"

    
=== "文字说明"

    1. 下载LotKB专属 [烧录工具](http://glab.online/down/wch_nrf_burner_setup_1.2.1.1.exe)，并安装。
    2. 下载键盘对应的 `蓝牙核心固件` 或 `蓝牙完整固件` 
    3. 打开烧录工具`wch_nrf_burner.exe`。
    4. 直接通过USB连接键盘。
        - 选择配置文件，一般为`nRF52系列(CH552)`
        - 刷新当前设备列表，并下拉选择连接的键盘。
        - 选择设备列表中`Lotlab Configurator` 或 `CMSIS-DAP` 选项。
    5. 在“蓝牙固件”栏选择你第2步下载的蓝牙核心固件或蓝牙完整固件
    6. 点击烧录按钮，等待烧录完成即可。
    7. 如传输出错导致更新失败，重新刷新即可。

=== "升级演示视频"

    <video id="video" width="360px" height="auto" controls="controls" preload="none" poster="http://glab.online/wp-content/uploads/2019/10/favicon.png">
      <source id="mp4" src="http://glab.online/down/wch_nrf_burner.mp4" type="video/mp4">
      您的浏览器不支持播放此视频
    </video>

    !!! tip
        由于烧录工具已经更新，此视频只做为烧录演示。

=== "刷写警示"
    !!! warning "警告"     
        刷写`蓝牙核心固件`时，请勿勾选"烧录时擦除蓝牙固件"，勾选会导致Bootloader、SD协议栈丢失，键盘不可用
    
        刷写`蓝牙完整固件`时, 可勾选"烧录时擦除蓝牙固件"
    
        当前蓝牙固件在逐步更新到SDK17.0.2，请勿将nRF SDK15.3的固件与nRF SDK17.0.2的固件混刷
    
        跨SDK版本升级(如从SDK15版本升级到SDK17版本)，一定先刷完整固件，刷的时候建议勾选“烧录时擦除蓝牙固件”

#### DFU升级方式

!!! tip "老版PCB仅支持DFU升级方式。新版PCB`线刷`和DFU方式均支持"

=== "文字说明"

    1. 使用手机安装并打开 nRF Connect 程序
        - 可以到[官方下载页面](https://www.nordicsemi.com/Software-and-tools/Development-Tools/nRF-Connect-for-mobile)或者应用商店搜索下载。
    2. 使键盘进入DFU模式（参见 [如何进入DFU模式](faq.md#如何进入DFU模式)）
    3. 点击nRF Connect右上角的Scan扫描蓝牙设备，找到`DFUTarg`标识的蓝牙设备
    4. 点击CONNCET按钮，等待连接成功
    5. 点击右上角的DFU按钮，选择第一个Distribution packet(ZIP)，然后选择下载的蓝牙固件包
    6. 等待升级进度100%即可

    如果您刷入了错误的程序而无法进入DFU模式，请 [强制进入DFU](faq.md#如何进入DFU模式) 然后更新。

=== "图文PDF" 

    1. [怎么升级蓝牙主控固件(android)](pdf/怎么升级蓝牙主控固件-android–GT系列蓝牙双模键盘官网.pdf)  
    2. [怎么升级蓝牙主控固件(iOS)](pdf/怎么升级蓝牙主控固件-iOS–GT系列蓝牙双模键盘官网.pdf)

=== "演示视频"

    <video id="video" width="360px" height="auto" controls="controls" preload="none" poster="http://glab.online/wp-content/uploads/2019/10/favicon.png">
       <source id="mp4" src="https://glab.online/wp-content/uploads/2020/01/DFU升级演示.mp4" type="video/mp4">
       您的浏览器不支持播放此视频
    </video>


<span id="更新USB固件">更新USB固件</span>
-----------

!!! danger "警示: 出厂后一般不需要更新USB固件,非必要请勿更新USB"

=== "文字说明"

    1. 下载LotKB专属 [烧录工具](http://glab.online/down/wch_nrf_burner_setup_1.2.1.1.exe)，并安装。
    2. 打开烧录工具`wch_nrf_burner.exe`。
    3. 如已经刷入2020年8月16日后的USB固件：
        - 直接通过USB连接键盘。刷新当前设备列表，并下拉选择连接的键盘。
        - 选择设备列表中`Lotlab Configurator`选项。
    4. 如USB固件较老，无法自动进入USB ISP刷写模式：
        - 需要参考 [如何进入USB刷写模式](faq.md#如何进入USB刷写模式) 手动使键盘进入USB ISP刷写模式
        - 刷新当前设备列表，并下拉选择连接的键盘。
        - 选择设备列表中`USB ISP 设备`选项。
    5. 在“USB固件”栏选择你要更新的USB固件。
    6. 点击烧录按钮，等待烧录完成即可。

    上述方法只支持Windows,若你在使用Linux，则可以使用三方的[WCHISP](https://github.com/rgwan/librech551)来更新。

=== "升级演示视频"

    <video id="video" width="360px" height="auto" controls="controls" preload="none" poster="http://glab.online/wp-content/uploads/2019/10/favicon.png">
      <source id="mp4" src="http://glab.online/down/wch_nrf_burner.mp4" type="video/mp4">
      您的浏览器不支持播放此视频
    </video>

    !!! tip
        由于烧录工具已经更新，此视频只做为烧录演示。

<span id="其他更新方法">其他更新方法</span>
-------------

如果遇到疑难问题，可以采用[CMSIS-DAP烧录](upgrade2.md#CMSIS-DAP烧录工具更新)更新整个蓝牙固件修复问题。

Linux系统下更新固件，请参考[Linux更新固件](upgrade2.md#Linux更新固件)