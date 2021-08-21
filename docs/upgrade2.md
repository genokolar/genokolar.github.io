
其他更新教程
=====================

使用 DFU 模式更新蓝牙固件
---------------

!!! warning "警告" 
    **刷入不正确的固件可能会使得你的键盘无法正常使用！** 请在更新前确认升级包是由可信的人员提供的。
   
   如果您刷入了错误的程序而无法进入DFU模式，请 [强制进入DFU](faq.md#如何进入DFU模式) 然后更新。

#### 更新方法


1. 使用手机安装并打开 nRF Connect 程序
   - 可以到[官方下载页面](https://www.nordicsemi.com/Software-and-tools/Development-Tools/nRF-Connect-for-mobile)或者应用商店搜索下载。
2. 使键盘进入DFU模式（参见 [如何进入DFU模式](faq.md#如何进入DFU模式)）
3. 点击nRF Connect右上角的Scan扫描蓝牙设备，找到`DFUTarg`标识的蓝牙设备
4. 点击CONNCET按钮，等待连接成功
4. 点击右上角的DFU按钮，选择第一个Distribution packet(ZIP)，然后选择下载的蓝牙固件包
5. 等待升级进度100%即可

具体可以参看图文PDF
    - [怎么升级蓝牙主控固件(android)](pdf/怎么升级蓝牙主控固件-android–GT系列蓝牙双模键盘官网.pdf)  
    - [怎么升级蓝牙主控固件(iOS)](pdf/怎么升级蓝牙主控固件-iOS–GT系列蓝牙双模键盘官网.pdf)

#### DFU升级演示视频

<video id="video" width="360px" height="auto" controls="controls" preload="none" poster="http://glab.online/wp-content/uploads/2019/10/favicon.png">
  <source id="mp4" src="https://glab.online/wp-content/uploads/2020/01/DFU升级演示.mp4" type="video/mp4">
  您的浏览器不支持播放此视频
</video>

更新USB固件
-----------

!!! warning "警告" 
    **刷入不正确的USB固件可能使你的键盘的USB功能工作不正常！** 请在更新前确认升级包是由可信的人员提供的。
   
   若在更新蓝牙固件后发现USB功能不可用，可以参考下面更新USB固件。

#### WCH芯片官方工具更新

1. 至WCH官网下载 [固件更新工具](http://www.wch.cn/downloads/WCHISPTool_Setup_exe.html)
2. 打开固件更新工具，切换至“8位ch55x系列”，将芯片型号改为“CH552”，并在底下的“用户程序文件中”选择你要更新的USB固件
3. 参考 [如何进入USB刷写模式](faq.md#如何进入USB刷写模式) 使键盘进入USB ISP刷写模式，此时，设备列表中会出现一个可选择的设备并会自动选中。
4. 点击下载按钮。下载完毕后，将键盘的USB断开并重新连接，即可升级完毕。
5. 升级USB后建议删除电脑上的USB键盘设备，然后重新连接以确保电脑正确识别并安装驱动。

具体可以参看图文PDF：[怎么升级USB芯片的固件](pdf/怎么升级USB芯片的固件–GT系列蓝牙双模键盘官网.pdf)

若你在使用Linux，则可以使用三方的`WCHISP <https://github.com/rgwan/librech551>`来更新。


使用板载调试器强制更新蓝牙完整固件
---------------

注意:仅新的硬件配备了板载调试器，部分PCB可能需要你更新USB固件以启用板载调试器。

!!! warning "警告"
    使用板载调试器更新键盘完整固件，将丢失包括自定义按键配置、蓝牙绑定信息等所有的数据

 [如何确认PCB支持线刷](faq.md#如何确认PCB支持线刷)


#### Linux 更新固件

##### 环境配置

```bash
1.  打开终端，输入 ``sudo apt install python3`` ，然后回车（Arch系、RedHat系请自行修改命令）
2.  输入 ``sudo pip3 install pyocd`` ，然后回车，等待安装完毕
3.  输入 ``pyocd list`` 确认安装成功
```
##### 更新固件

1.  确保你下载的是调试器用的HEX格式的固件。
2.  将键盘接入电脑，输入 ``pyocd list`` 并回车，这时应该会见到你的键盘
3.  输入 ``pyocd flash -t nrf52 [filename.hex]`` （将 ``[filename.hex]`` 替换为你下载的固件的文件名）并回车，等待刷入完毕
4.  刷新完毕后，拔下电池和USB线，然后重新插上。

#### Windows 更新固件


##### 方法一：CMSIS-DAP烧录工具（仅Windows X64）：

1. 下载CMSIS-DAP烧录工具 [百度网盘下载](https://eyun.baidu.com/s/3smnHnI1)

2. 下载后解压，双击运行其中的`#开始烧录.bat`文件

3. 将键盘接入电脑，输入`L`选择`显示烧录器列表`功能，如果正常显示烧录器可进行下一步

4. 输入对应的数字，选择烧录对应的键盘固件功能，等待完成即可

如果第3步中无法正常显示烧录器，那么可能是您接入电脑不正确，USB未更新到新版本或者键盘并不支持板载调试器功能。

##### CMSIS-DAP烧录视频演示

<video id="video" width="360px" height="auto" controls="controls" preload="none" poster="http://glab.online/wp-content/uploads/2019/10/favicon.png">
  <source id="mp4" src="https://glab.online/down/CMSIS-DAP.mp4" type="video/mp4">
  您的浏览器不支持播放此视频
</video>

##### 方法二：烧录工具烧录

1. 下载LotKB专属 [烧录工具](http://glab.online/down/wch_nrf_burner_setup.exe)，并安装。
2. 下载键盘对应的 [蓝牙完整固件](https://eyun.baidu.com/s/3ghoXQDX)  
3. 打开烧录工具`wch_nrf_burner.exe`。
4. 直接通过USB连接键盘。刷新当前设备列表，并下拉选择连接的键盘。
   - 此时设备列表名称有`Lotlab`字样。
5. 在“蓝牙固件”栏选择你第2步下载的蓝牙完整固件
6. 点击烧录按钮，等待烧录完成即可。

