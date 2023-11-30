
相关概述
=====================

:fontawesome-solid-book: 阅读指引
----------

大家好，欢迎大家前来了解GT系列无线键盘的相关产品，请耐心的阅读相关内容。

首次使用我们的键盘，请先阅读 [使用说明](manual.md) 和 [产品信息](keyboard/volta9.md)

需要配置键盘的按键及设定，请参阅 [配置键盘](configurator.md)

需要更新键盘的固件时，请参照 [固件更新](upgrade.md)

使用中遇到疑难问题，可以参阅 [故障排除](trouble.md) 和 [常见问答](faq.md)，或 [联系我们](summary.md#联系我们)


:fontawesome-solid-sun: GT系列无线键盘特点
------------

- 支持蓝牙5.0、2.4G无线和USB三种连接模式。
- 支持轴体热拔插，不用焊接快速更换轴体。
- 键线分离，越来越普及的TYPE-C接口，数据线更易获得。
- 低功耗无线连接，续航超长。1000mah电池续航100天[^1]，待机超过一年。
- 支持USB和蓝牙、2.4G之间无缝切换，支持最多同时连接7台设备（3个蓝牙+3个无线+1个USB）
- 全键自定义，支持多平台更新配置按键，按键设定想怎么改怎么改。
- 按键自定义功能丰富，最高8层按键，可自定义宏，支持全键无冲
- 支持旋钮、RGB底灯、RGB轴灯、OLED屏幕[^2]
- 固件开源并不断更新完善,可自行编译固件

??? faq "LotKB是什么？"

    LotKB是[Jim Kirisame](https://github.com/jim-kirisame/)开发的一个基于nRF52芯片的无线三模键盘的固件。

    硬件上采用无线SoC(nRF52810/nRF52811/nRF52832) + USB MCU(CH552/CH554)的组合，实现蓝牙、2.4G与USB三模，使用了nRF SDK 15.3/17.1作为底层硬件驱动，并使用TMK键盘库作为键盘功能的上部实现。

    LotKB是一个开源项目，其软件源码与硬件设计都是开源的，您可以从[Github](https://github.com/genokolar/nrf52-keyboard)上获得。

:fontawesome-solid-fan: 蓝牙兼容性说明
-----

- GT系列三模键盘采用的低功耗蓝牙：Bluetooth Low Energy 5.0
- BLE5.0 可向下兼容蓝牙4.0，硬件设备需支持蓝牙4.0以上才行。
- 广泛支持Windows|Linux|Mac OS|Android|iOS
- 操作系统版本：iOS 6以上；Android 4.3以上；Windows 8.1以上；Windows Phone 8.1；较新的Mac OS

:fontawesome-solid-fan: 2.4G特性说明
-----

- 基于Nordic Semiconductor ESB协议实现2.4G无线功能
- 一个接收器支持配对7个键盘，支持最高7个键盘同时在线
- 一个键盘支持配对3个接收器，可快速无缝切换
- 接收器配对采用开放模式，不需要特别设定，不需要程序干预
- 所有PCB升级固件后，都可以购买2.4G接收器后实现2.4G功能


:fontawesome-regular-comments: <span id="联系我们">联系我们</span>
----------------

:fontawesome-brands-qq: QQ群：[38491793 ](https://jq.qq.com/?_wv=1027&k=wO76pWWU) | [619175701 ](https://jq.qq.com/?_wv=1027&k=PErENtHj)

:fontawesome-solid-bag-shopping: 淘宝店铺: [https://glab.taobao.com/](https://glab.taobao.com/)

:fontawesome-brands-discourse: 淘宝客服 [联系客服](https://amos.alicdn.com/getcid.aw?site=cntaobao&uid=genokolar:售前)


[^1]: 续航数据为关闭轴灯等耗电功能在仅无线状态每天使用8小时测得
[^2]: 此处为固件支持功能，因键盘硬件设计不同，支持的功能各有不同
