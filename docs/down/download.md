相关下载
==========

下载固件之前，建议先查看[更新日志](../changelog.md)

=== "蓝牙固件"

    📢基于nRF SDK17.0.2的固件，请进入对应产品页面进行下载
    ??? faq "当前固件名称命令规则?"

        如：Omega50-b-nrf52_kbd_sign-20210817-e35fd41.hex 

        依次为：型号-子型号-固件类型-编译日期-固件版本.文件类型 

        上面文件命名代表：
        
        型号：Omega50，子型号：B版本，固件类型：nrf_kbd_sign，编译日期：20210817，固件版本：e35fd41，文件类型：hex

        其中固件类型说明： 
        
        nrf52_kbd_sign ：已签名蓝牙核心固件；nrf52_all : 蓝牙完整固件；nrf52_dfu ：DFU升级包；ch554 ：USB固件

    | 下载内容       | 说明          | 下载地址 |
    | ------------|  ------------| ------------ |
    | 蓝牙核心固件 | 此固件基于nRF SDK15.3<br>需使用烧录工具进行烧录的蓝牙核心固件<br>仅新版硬件支持此方式更新<br>不可与SDK17的固件混刷 | <a href="https://eyun.baidu.com/s/3bpVmTzx" class="button">百度网盘下载</a> </br> <a href="https://github.com/genokolar/nrf52-keyboard/releases" class="button">Github发布页</a> |
    | 蓝牙完整固件 | 此固件基于nRF SDK15.3<br>需使用烧录工具进行烧录<br>仅新版硬件支持此方式更新<br>可用于返回SDK15固件 | <a href="https://eyun.baidu.com/s/3ghoXQDX" class="button">百度网盘下载</a> </br> <a href="https://github.com/genokolar/nrf52-keyboard/releases" class="button">Github发布页</a> |
    | 蓝牙DFU升级包 | 此固件基于nRF SDK15.3<br>需使用nRF Connect程序通过DFU升级<br>新老硬件均支持此方式更新<br>升级到SDK17的固件后，用此固件DFU升级会失败|<a href="https://eyun.baidu.com/s/3jJpXwG2" class="button">百度网盘下载</a> </br> <a href="https://github.com/genokolar/nrf52-keyboard/releases" class="button">Github发布页</a>|

=== "烧录&配置工具"

    | 下载内容       | 说明          | 下载地址 |
    | ------------|  ------------| ------------ |
    | 烧录工具 | USB固件及完整蓝牙固件烧录工具。</br>操作系统仅限Winodws，且需高于Windows 7 SP1。 | <a href="http://glab.online/down/wch_nrf_burner_setup_1.1.0.2.exe" class="button">1.1.0.2版</a><br><a href="http://glab.online/down/wch_nrf_burner_setup_1.2.1.1.exe" class="button">1.2.1.1版</a><br> <a href="https://eyun.baidu.com/s/3c2Tjcsg" class="button">百度网盘下载</a> |
    | 配置工具（安装包） | 配置工具本地服务端，必须开启才能配置键盘<br>版本：1.1.0.2安装版 - 支持：Windows 64位 ❤️。<br>不支持离线使用 | <a href="http://glab.online/down/lkb_configurator_setup_1.0.2.0.exe" class="button">官方下载地址一</a><br><a href="http://lotkb.cn/down/lkb_configurator_setup_1.0.2.0.exe" class="button">官方下载地址二</a><br><a href="https://eyun.baidu.com/s/3dmjVfK" class="button">百度网盘下载</a> |
    | 配置工具（绿色版） | 配置工具本地服务端，必须开启才能配置键盘<br>版本：1.1.0.2 - 支持：Windows 32位/Linux/Mac OS<br>支持离线使用（访问http://localhost:5000） | <a href="https://eyun.baidu.com/s/3c3X2Zmw" class="button">百度网盘下载</a> |
    | CMSIS-DAP烧录工具 | 完整蓝牙固件的烧录工具<br> 可更新整个蓝牙主控，可作为键盘修复工具| <a href="https://eyun.baidu.com/s/3smnHnI1" class="button">百度网盘下载</a> |
    | nRF Connect | DFU升级所需手机APP<br>Android版本 |<a href="http://glab.online/down/nRF.Connect.apk" class="button">nRF Connect(Android)</a>|


=== "定位板图纸"

    | 下载内容       | 说明          | 下载地址 |
    | ------------|  ------------| ------------ |
    | 键盘的定位板文件 | 各个键盘的定位板图纸，可用于自己定制定位板或外壳 |<a href="https://eyun.baidu.com/s/3kWhhSeb" class="button">百度网盘下载</a>|


=== "USB固件"

    !!! danger "警示"
        出厂后一般不需要更新USB固件,非必要请勿更新USB
        针对老款键盘我们提供了USB固件下载，新版键盘无需更新USB，不提USB下载
    
    | 键盘        | 说明          | 下载地址 |
    | ------------| --            |---- |
    | Farad69 Rev.A     | 较老的版本        |<a href="http://lotkb.cn/down/ch554/farad69-a-ch554.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/farad69-a-ch554.bin" class="button">下载地址二</a> |
    | Farad69 Rev.B     | 不支持轴灯，较新的版本        |<a href="http://lotkb.cn/down/ch554/farad69-b-ch554.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/farad69-b-ch554.bin" class="button">下载地址二</a> |        | Farad69 Rev.C     | 轴灯版本        |<a href="http://lotkb.cn/down/ch554/farad69-c-ch554.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/farad69-c-ch554.bin" class="button">下载地址二</a> |
    | Omega64 Rev.A & B     | 左移64与非左移64均采用同一个固件        |<a href="http://lotkb.cn/down/ch554/Omega64-ch554.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/Omega64-ch554.bin" class="button">下载地址二</a> |
    | GT BLE60 Rev.D     | 老旧版，支持焊接轴体        |<a href="http://lotkb.cn/down/ch554/gt-ble60-d-ch554.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/gt-ble60-d-ch554.bin" class="button">下载地址二</a> |
    | GT BLE60 Rev.E     | 不支持轴灯的版本        |<a href="http://lotkb.cn/down/ch554/gt-ble60-e-ch554.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/gt-ble60-e-ch554.bin" class="button">下载地址二</a> |
    | Omega50 Rev.A    | 不支持轴灯的版本      |<a href="http://lotkb.cn/down/ch554/Omega50-a-ch554.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/Omega50-a-ch554.bin" class="button">下载地址二</a> |
    | Omega84    | 当前仅一个版本        |<a href="http://lotkb.cn/down/ch554/Omega84-ch554.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/Omega84-ch554.bin" class="button">下载地址二</a> |
    | Omega45 Rev.C    | 不支持轴灯的版本        |<a href="http://lotkb.cn/down/ch554/Omega45-c-ch554.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/Omega45-c-ch554.bin" class="button">下载地址二</a> |
    | GT PAD Rev.A    | 标准数字小键盘        |<a href="http://lotkb.cn/down/ch554/gt-pad-a-ch554.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/gt-pad-a-ch554.bin" class="button">下载地址二</a> |