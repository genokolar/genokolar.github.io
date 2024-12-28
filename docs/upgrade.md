
固件更新教程
=====================

概述
---------------

您可能需要升级固件来获得新功能或者修复已有的BUG，请通过访问 [相关下载](down/download.md) 下载固件。

此系列键盘的固件分为 键盘主控固件 和 USB固件。

- 键盘主控固件 是无线SoC(nRF52810/nRF52811/nRF52832)的固件，主要实现键盘主体功能与蓝牙、2.4G无线通讯。
- USB固件 是刷入USB MCU(CH552/CH554)的固件，主要实现USB通讯、USB调试刷机。
- 一般情况下不需要也不推荐升级USB固件（当前USB固件为2024-11-11版本）。

键盘固件分为 键盘主控核心固件 和 键盘主控完整固件

- 键盘主控核心固件 指Application核心程序，这部分是程序的主体，只需要更新核心固件即可升级键盘功能。
- 键盘主控完整固件包括：键盘主控核心固件、Bootloader、SD协议栈。
- Bootloader 可实现DFU功能，现在已经不是必备功能。
- SD协议栈 指Nordic提供的nRF52系列芯片的协议栈，以实现蓝牙通讯。不同SDK版本固件的协议栈版本是不同的。

如何选择升级方式？

- 如果只需要更新功能，推荐使用线刷方式更新键盘主控核心固件。
- 跨SDK版本更新，只能通过更新键盘主控完整固件的方式来完成。
- 不支持线刷的版本，只能采用DFU方式更新固件 或 使用Jlink等调试工具进行更新（此方式自行学习）。
- 升级完整固件，建议采用CMSIS-DAP刷机包来完成。

<span id="更新键盘主控固件">更新键盘主控固件</span>
---------------

#### 线刷方式

!!! tip "仅新的硬件支持`线刷`，部分PCB可能需要你更新USB固件以启用此功能。 [如何确认PCB支持线刷？](faq.md#如何确认PCB支持线刷)"

    
=== "文字说明"

    1. 下载LotKB专属 [烧录工具](https://down.glab.online:5550/wch_nrf_burner_setup_1.2.2.0.exe)，并安装。
    2. 下载键盘对应的 `键盘主控核心固件` 或 `键盘主控完整固件` [🌍蓝牙固件下载地址](https://down.glab.online:5550/Glab3.2/)
    3. 打开烧录工具`wch_nrf_burner.exe`。
    4. 直接通过USB连接键盘。
        - 选择配置文件，一般为`nRF52系列(CH552)`
        - 刷新当前设备列表，并下拉选择连接的键盘。
        - 选择设备列表中`Lotlab Configurator` 或 `CMSIS-DAP` 选项。
    5. 在“蓝牙固件”栏选择你第2步下载的键盘主控核心固件或键盘主控完整固件
    6. 点击烧录按钮，等待烧录完成即可。
    7. 如传输出错导致更新失败，重新刷新即可。
    8. 刷写时只能接入一个USB设备，多余的键盘或2.4G接收器请先拔出。

=== "升级演示视频"

    <video id="video" width="360px" height="auto" controls="controls" preload="none" poster="https://wiki.glab.online/img/videoicon.png">
      <source id="mp4" src="https://down.glab.online:5550/wch_nrf_burner.mp4" type="video/mp4">
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
        刷写`键盘主控核心固件`时，请勿勾选"擦除蓝牙芯片"，勾选会导致Bootloader、SD协议栈丢失，键盘不可用
    
        刷写`键盘主控完整固件`时, 可勾选"擦除蓝牙芯片"
    
        当前键盘主控固件在逐步更新到SDK17.1，请勿将nRF SDK15.3的固件与nRF SDK17.1的固件混刷
    
        跨SDK版本升级(如从SDK15版本升级到SDK17版本)，一定先刷完整固件，刷的时候建议勾选“擦除蓝牙芯片”

#### CMSIS-DAP烧录


!!! tip "硬件损坏的可能性极小，99%的问题都可以通过刷写完整固件修复"

CMSIS-DAP烧录工具包自带键盘主控完整固件，适合快速刷写完整固件 或 用于修复键盘。

=== "文字说明"
    （仅Windows）

    1. 下载CMSIS-DAP烧录工具 [🌍官方地址下载](https://down.glab.online:5550/Glab3.2)

    2. 下载后解压，双击运行其中的`#开始烧录.bat`文件

    3. 将键盘接入电脑，输入`L`选择`显示烧录器列表`功能，如果正常显示烧录器可进行下一步

    4. 输入对应的数字，选择烧录对应的键盘固件功能，等待完成即可

    如果第3步中无法正常显示烧录器，那么可能是您接入电脑不正确，USB未更新到新版本或者键盘并不支持板载调试器功能。

    5. 刷写时只能接入一个USB设备，多余的键盘或2.4G接收器请先拔出。

=== "视频演示"

    <video id="video" width="360px" height="auto" controls="controls" preload="none" poster="https://wiki.glab.online/img/videoicon.png">
    <source id="mp4" src="https://down.glab.online:5550/CMSIS-DAP.mp4" type="video/mp4">
    您的浏览器不支持播放此视频
    </video>

#### DFU升级方式

!!! tip "提示"
    - 老版PCB仅支持DFU升级方式。新版PCB`线刷`和DFU方式均支持
    - DFU升级，请下载ZIP格式的蓝牙DFU升级包，且不要解压
    - DFU升级方式预计会逐步淘汰

=== "文字说明"

    1. 使用手机安装并打开 nRF Connect 程序
        - 可以到[🌍官方下载页面](https://www.nordicsemi.com/Software-and-tools/Development-Tools/nRF-Connect-for-mobile)或者应用商店搜索下载。
        - [🌍本站下载：4.26版本](https://down.glab.online:5550/nRF.Connect.4.26.0.apk")
    2. 使键盘进入DFU模式（参见 [如何进入DFU模式](faq.md#如何进入DFU模式)）
    3. 点击nRF Connect右上角的Scan扫描蓝牙设备，找到`DFUTarg`标识的蓝牙设备
    4. 点击蓝牙设备旁CONNECT按钮，等待连接成功
    5. 点击右上角的DFU按钮，选择第一个Distribution packet(ZIP)，然后选择下载的蓝牙DFU升级包（ZIP格式）
    6. 等待升级进度100%即可

    如果您刷入了错误的程序而无法进入DFU模式，请 [强制进入DFU](faq.md#如何进入DFU模式) 然后更新。

=== "图文PDF" 

    1. [怎么升级键盘主控固件(android)](pdf/怎么升级蓝牙主控固件-android–GT系列蓝牙双模键盘官网.pdf)  
    2. [怎么升级蓝牙主控固件(iOS)](pdf/怎么升级蓝牙主控固件-iOS–GT系列蓝牙双模键盘官网.pdf)

=== "演示视频"

    <video id="video" width="360px" height="auto" controls="controls" preload="none" poster="https://wiki.glab.online/img/videoicon.png">
       <source id="mp4" src="https://down.glab.online:5550//DFU升级演示.mp4" type="video/mp4">
       您的浏览器不支持播放此视频
    </video>


<span id="更新USB固件">更新USB固件</span>
-----------

!!! danger "警示: 出厂后一般不需要更新USB固件,非必要请勿更新USB"
!!! tip "USB固件 2024-11-11 更新 ：<br><b>支持免工具USB改键 </b>"


=== "文字说明"

    1. 下载LotKB专属 [烧录工具](https://down.glab.online:5550/wch_nrf_burner_setup_1.2.2.0.exe)，并安装。
    2. 下载最新的USB固件 [🌍USB固件下载地址](https://down.glab.online:5550/ch554/)
    3. 打开烧录工具`wch_nrf_burner.exe`。
    4. 如已经刷入2020年8月16日后的USB固件：
        - 直接通过USB连接键盘。刷新当前设备列表，并下拉选择连接的键盘。
        - 选择设备列表中`Lotlab Configurator`选项。
    5. 如USB固件较老，无法自动进入USB ISP刷写模式：
        - 需要参考 [如何进入USB刷写模式](faq.md#如何进入USB刷写模式) 手动使键盘进入USB ISP刷写模式
        - 刷新当前设备列表，并下拉选择连接的键盘。
        - 选择设备列表中`USB ISP 设备`选项。
    6. 在“USB固件”栏选择你下载的USB新版固件。
    7. 点击烧录按钮，等待烧录完成即可。
    8. 刷写时只能接入一个USB设备，多余的键盘或2.4G接收器请先拔出。

    上述方法只支持Windows,若你在使用Linux，则可以使用三方的[🌍WCHISP](https://github.com/rgwan/librech551)来更新。

=== "升级演示视频"

    <video id="video" width="360px" height="auto" controls="controls" preload="none" poster="https://wiki.glab.online/img/videoicon.png">
      <source id="mp4" src="https://down.glab.online:5550/wch_nrf_burner.mp4" type="video/mp4">
      您的浏览器不支持播放此视频
    </video>

    !!! tip
        由于烧录工具已经更新，此视频只做为烧录演示。

<span id="更新2.4G接收器固件">更新2.4G接收器固件</span>
-----------

接收器长期插在电脑USB口上，为避免为键盘刷机时误刷入接收器，接收器默认是不能刷写USB固件和主控固件的。

=== "文字说明"

    在刷写固件之前，需要先通过[接收器控制面板](./2.4G/index.html) 启用刷写功能，刷写时只能接入一个USB设备，多余的键盘或2.4G接收器请先拔出。

    1. 将接收器插入电脑USB口，并使用浏览器[^2]访问[接收器控制面板](./2.4G/index.html)
    2. 首次使用需授权：点击 <kbd>授权设备</kbd> 按钮，弹出授权面板，选择设备，点击<kbd>连接</kbd>授权连接接收器
    3. 授权成功后，每次插入接收器，访问[接收器控制面板](./2.4G/index.html)会自动连接接收器
    4. 需要刷写USB固件的话，点击<kbd>进入 USB ISP模式</kbd> 按钮，启用USB ISP模式，随后通过烧录工具，参照键盘刷写USB固件的方法刷写USB固件
    5. 需要刷写主控固件的话，点击<kbd>启用CMSIS-DAP</kbd> 按钮，启用CMSIS-DAP刷写功能，随后通过烧录工具，参照键盘刷写键盘主控固件的方法刷写主控固件
    6. 刷写固件后，请重新拔插接收器或点击<kbd>禁用CMSIS-DAP</kbd> 按钮，以便恢复默认禁止刷写状态

=== "视频演示"

    <video id="video" width="640px" height="auto" controls="controls" preload="none" poster="../img/videoicon_640.png">
    <source id="mp4" src="https://down.glab.online:5550//2.4G接收器刷写.mp4" type="video/mp4">
    您的浏览器不支持播放此视频
    </video>
