使用配置工具配置键盘
==========

!!! tip "配置工具可以配置键盘的按键、设定参数、自定义宏、重置键盘等"

确保固件为新版固件
-----------

如果PCB购买时间较早，自带固件较旧无法使用配置工具，请先 [更新固件](upgrade.md)。

注：从2020年9月后购买的PCB均为新版固件，无需升级

下载安装配置工具
------------

### Windows 64位系统

推荐下载安装版本：

访问 [相关下载](down/download.md) 下载 配置工具安装版，并安装、运行。


### Linux/MacOS等系统

一、访问[百度网盘](https://eyun.baidu.com/s/3c3X2Zmw)下载本地服务端。 

二、请根据您使用的操作系统下载对应的配置工具：

- 若您正在使用64位的Windows，请下载文件名中带有 win-x64字样的压缩包
- 若您正在使用x86-64的Linux，请下载文件名中带有linux-x64字样的压缩包
- 若您正在使用64位的macOS，请下载文件名中带有osx-x64字样的压缩包
- 若您正在使用32位的上述操作系统，或ARM平台的上述操作系统，请下载文件名中带有universal字样的压缩包

三、下载完毕后解压，并运行本地服务端程序。各版本运行方法：

- Windows 64位: 
    - 直接双击打开lkb-configurator-server.exe
- macOS 64位: 

    1. 在解压后文件夹中打开终端，输入```chmod +x ./lkb-configurator-server``` 然后回车，为此文件添加可执行权限
    2. 输入```./lkb-configurator-server```然后回车，运行本地服务端
    3.  如不是在解压后文件夹中打开的终端，上述命令中请加入完整路径，如
    ```
      chmod +x /users/name/lkb-configurator-server
      sudo /users/name/lkb-configurator-server
    ```

- Linux 64位: 
    1. 在解压后文件夹中打开终端，输入```chmod +x ./lkb-configurator-server``` 然后回车，为此文件添加可执行权限
    2. 输入```sudo ./lkb-configurator-server``` 然后回车，运行本地服务端
    3. 如不是在解压后文件夹中打开的终端，上述命令中请加入完整路径，如
    ```
    chmod +x /home/user/lkb-configurator-server
    sudo /home/user/lkb-configurator-server
    ```

- Universal: 
    
    1. 安装 [.net core 运行环境](https://dotnet.microsoft.com/download/dotnet-core/current/runtime)，选择download hosting bundle
    2. 在命令行环境（终端）下输入 dotnet lkb-configurator-server.dll 然后回车

四、用USB线连接键盘，访问配置工具网址：keyboard.lotlab.org

按键配置方法
----------

请参考配置工具的[帮助页面](https://keyboard.lotlab.org/help)

使用演示视频：
<video id="video" width="360px" height="auto" controls="controls" preload="none" poster="https://wiki.glab.online/img/videoicon.png">
<source id="mp4" src="http://glab.online/down/lkb-configurator.mp4" type="video/mp4">
  您的浏览器不支持播放此视频
</video>

离线使用
-------

1. Windows 64位安装版本无法离线访问，如需离线访问功能，请下载绿色版。
2. 如果能联网，我们推荐使用在线页面，而不是使用离线页面，因为在线页面可以保证持续更新。
3. 如果您想离线使用，开启配置工具后，请访问本地地址：http://127.0.0.1:5000。