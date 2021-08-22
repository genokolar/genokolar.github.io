
其他更新教程
=====================

<span id="Linux更新固件">Linux更新固件</span>
-------------

##### 环境配置

1.  打开终端，输入 ``sudo apt install python3`` ，然后回车（Arch系、RedHat系请自行修改命令）
2.  输入 ``sudo pip3 install pyocd`` ，然后回车，等待安装完毕
3.  输入 ``pyocd list`` 确认安装成功

##### 更新固件

1.  确保你下载的是调试器用的HEX格式的固件。
2.  将键盘接入电脑，输入 ``pyocd list`` 并回车，这时应该会见到你的键盘
3.  输入 ``pyocd flash -t nrf52 [filename.hex]`` （将 ``[filename.hex]`` 替换为你下载的固件的文件名）并回车，等待刷入完毕
4.  刷新完毕后，拔下电池和USB线，然后重新插上。

<span id="CMSIS-DAP烧录工具更新">CMSIS-DAP烧录工具更新</span>
-----------

（仅Windows X64）

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

