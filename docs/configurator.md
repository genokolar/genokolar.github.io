使用配置工具配置键盘
==========

!!! tip "配置工具可以配置键盘的按键、设定参数、自定义宏、重置键盘等"

确保固件为新版固件
-----------

如果PCB购买时间较早，自带固件较旧无法使用配置工具，请先 [更新固件](upgrade.md)。

1. 2020年4月后固件支持使用配置工具改键
2. 2024年11月11日后固件支持免服务端，通过Webhid使用配置工具

选择配置工具使用方式
-------
当前配置工具已可实现免启用服务端，通过WebHID实现USB连接和蓝牙连接状态下使用配置工具。

1. 如采用Chrome 89+ / Edge 89+ / Opera 75+ 等支持WebHID API的浏览器，可免服务端使用配置工具。
2. 如采用的浏览器不支持WebHID或需要离线使用等情况，请采用启用配置工具服务端的方式。

### 1.使用WebHID方式

WebHID API 在 所有桌面平台（ChromeOS、Linux、macOS 和 Windows）上均可用

支持的浏览器包括Chrome 89+ / Edge 89+ / Opera 75+ 以及采用Chrome浏览器内核的浏览器，如 QQ浏览器 / 360浏览器等

使用支持的浏览器访问[配置工具网站](https://keyboard.lotlab.org/)。

点击设备旁边列表的刷新按钮，等待弹出授权窗口。待授权对应的设备后，即可在设备列表内找到对应的可配置设备。

注意：当前 WebHID 配置尚处于测试阶段，只能在未启动本地服务器时使用。

WebHID 配置需要2024年11月11日及以后的新版 USB 固件和 蓝牙 固件。若在弹出设备列表中无法找到对应设备，可以先尝试更新设备固件。

#### Linux 需要授权

由于Linux系统对设备权限管理比较严格，需要手动修改权限才能使用配置工具。

在大多数 Linux 系统上，HID 设备默认映射为只读权限。如需正常使用配置工具，您需要添加新的 udev 规则。在 ```/etc/udev/rules.d/``` 下 中创建一个包含以下内容的文件，如```50-lotlab-keyboard.rules```：

```
KERNEL=="hidraw*", ATTRS{idVendor}=="1209", ATTRS{idProduct}=="0514", MODE="0664", GROUP="plugdev"
KERNEL=="hidraw*", KERNELS="uhid", MODE="0664", GROUP="plugdev"
```
确保您的 user 是 ```plugdev``` 群组的成员，或根据你的用户名所属群组进行修改，如修改为 ```users``` 。然后重启主机连接您的设备。


### 2.使用服务端方式

下载配置工具本地服务端

一、访问[下载页面](down/download.md)下载本地服务端。 

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
<source id="mp4" src="https://down.glab.online:5550/lkb-configurator.mp4" type="video/mp4">
  您的浏览器不支持播放此视频
</video>

离线使用
-------

1. 如果能联网，我们推荐使用在线页面，而不是使用离线页面，因为在线页面可以保证持续更新。
2. 如果您想离线使用，开启配置工具服务端后，请访问本地地址：http://127.0.0.1:5000。