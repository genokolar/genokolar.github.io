
固件更新教程
=====================

概述
---------------

您可能需要升级固件来获得新功能或者修复已有的BUG，请通过访问 [相关下载](down/download.md) 下载固件。

此系列键盘的固件分为 蓝牙固件 和 USB固件。

- 蓝牙固件 是蓝牙SoC(nRF52810/nRF52811/nRF52832)的固件，主要实现键盘主体功能与蓝牙、2.4G无线通讯。
- USB固件 是刷入USB MCU(CH552/CH554)的固件，主要实现USB通讯、USB调试刷机。
- 一般情况下不需要也不推荐升级USB固件（当前USB固件为2020-08-16版本）。

蓝牙固件分为 蓝牙核心固件 和 蓝牙完整固件

- 蓝牙核心固件 指Application核心程序，这部分是程序的主体，只需要更新核心固件即可升级键盘功能。
- 蓝牙完整固件包括：蓝牙核心固件、Bootloader、SD协议栈。
- Bootloader 可实现DFU功能，现在已经不是必备功能。
- SD协议栈 指Nordic提供的nRF52系列芯片的协议栈，以实现蓝牙通讯。不同SDK版本固件的协议栈版本是不同的。

如何选择升级方式？

- 如果只需要更新功能，推荐使用线刷方式更新蓝牙核心固件。
- 跨SDK版本更新，只能通过更新蓝牙完整固件的方式来完成。
- 不支持线刷的版本，只能采用DFU方式更新固件 或 使用Jlink等调试工具进行更新（此方式自行学习）。
- 升级完整固件，建议采用CMSIS-DAP刷机包来完成。

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

    <video id="video" width="360px" height="auto" controls="controls" preload="none" poster="https://wiki.glab.online/img/videoicon.png">
      <source id="mp4" src="http://glab.online/down/wch_nrf_burner.mp4" type="video/mp4">
      您的浏览器不支持播放此视频
    </video>

    !!! tip
        由于烧录工具已经更新，此视频只做为烧录演示。

=== "Linux系统更新固件"

    环境配置

    1.  打开终端，输入 ``sudo apt install python3`` ，然后回车（Arch系、RedHat系请自行修改命令）
    2.  输入 ``sudo pip3 install pyocd`` ，然后回车，等待安装完毕
    3.  输入 ``pyocd list`` 确认安装成功

    更新固件

    1.  确保你下载的是调试器用的HEX格式的固件。
    2.  将键盘接入电脑，输入 ``pyocd list`` 并回车，这时应该会见到你的键盘
    3.  输入 ``pyocd flash -t nrf52 [filename.hex]`` （将 ``[filename.hex]`` 替换为你下载的固件的文件名）并回车，等待刷入完毕
    4.  刷新完毕后，拔下电池和USB线，然后重新插上。

=== "刷写警示"
    !!! warning "警告"     
        刷写`蓝牙核心固件`时，请勿勾选"烧录时擦除蓝牙固件"，勾选会导致Bootloader、SD协议栈丢失，键盘不可用
    
        刷写`蓝牙完整固件`时, 可勾选"烧录时擦除蓝牙固件"
    
        当前蓝牙固件在逐步更新到SDK17.1，请勿将nRF SDK15.3的固件与nRF SDK17.1的固件混刷
    
        跨SDK版本升级(如从SDK15版本升级到SDK17版本)，一定先刷完整固件，刷的时候建议勾选“烧录时擦除蓝牙固件”

#### DFU升级方式

!!! tip "提示"
    - 老版PCB仅支持DFU升级方式。新版PCB`线刷`和DFU方式均支持
    - DFU升级，请下载ZIP格式的蓝牙DFU升级包，且不要解压

=== "文字说明"

    1. 使用手机安装并打开 nRF Connect 程序
        - 可以到[官方下载页面](https://www.nordicsemi.com/Software-and-tools/Development-Tools/nRF-Connect-for-mobile)或者应用商店搜索下载。
    2. 使键盘进入DFU模式（参见 [如何进入DFU模式](faq.md#如何进入DFU模式)）
    3. 点击nRF Connect右上角的Scan扫描蓝牙设备，找到`DFUTarg`标识的蓝牙设备
    4. 点击CONNCET按钮，等待连接成功
    5. 点击右上角的DFU按钮，选择第一个Distribution packet(ZIP)，然后选择下载的蓝牙DFU升级包（ZIP格式）
    6. 等待升级进度100%即可

    如果您刷入了错误的程序而无法进入DFU模式，请 [强制进入DFU](faq.md#如何进入DFU模式) 然后更新。

=== "图文PDF" 

    1. [怎么升级蓝牙主控固件(android)](pdf/怎么升级蓝牙主控固件-android–GT系列蓝牙双模键盘官网.pdf)  
    2. [怎么升级蓝牙主控固件(iOS)](pdf/怎么升级蓝牙主控固件-iOS–GT系列蓝牙双模键盘官网.pdf)

=== "演示视频"

    <video id="video" width="360px" height="auto" controls="controls" preload="none" poster="https://wiki.glab.online/img/videoicon.png">
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

    <video id="video" width="360px" height="auto" controls="controls" preload="none" poster="https://wiki.glab.online/img/videoicon.png">
      <source id="mp4" src="http://glab.online/down/wch_nrf_burner.mp4" type="video/mp4">
      您的浏览器不支持播放此视频
    </video>

    !!! tip
        由于烧录工具已经更新，此视频只做为烧录演示。

<span id="CMSIS-DAP烧录工具更新">CMSIS-DAP烧录</span>
-----------

!!! tip "硬件损坏的可能性极小，99%的问题都可以通过刷写完整固件修复"

CMSIS-DAP烧录工具包自带完整蓝牙固件，适合快速刷写完整固件 或 用于修复键盘。

=== "文字说明"
    （仅Windows）

    1. 下载CMSIS-DAP烧录工具 [官方地址下载](http://glab.online/down/Glab3.0)

    2. 下载后解压，双击运行其中的`#开始烧录.bat`文件

    3. 将键盘接入电脑，输入`L`选择`显示烧录器列表`功能，如果正常显示烧录器可进行下一步

    4. 输入对应的数字，选择烧录对应的键盘固件功能，等待完成即可

    如果第3步中无法正常显示烧录器，那么可能是您接入电脑不正确，USB未更新到新版本或者键盘并不支持板载调试器功能。

=== "视频演示"

    <video id="video" width="360px" height="auto" controls="controls" preload="none" poster="https://wiki.glab.online/img/videoicon.png">
    <source id="mp4" src="https://glab.online/down/CMSIS-DAP.mp4" type="video/mp4">
    您的浏览器不支持播放此视频
    </video>