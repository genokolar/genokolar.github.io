相关下载
==========

下载固件之前，建议先查看[更新日志](../changelog.md)

=== "蓝牙固件"

    📢建议更新到基于SDK17.1的固件

    - [怎么切换SDK版本？](../faq.md#怎样切换不同SDK版本的固件)
    - [固件名称命令规则？](../faq.md#固件名称命令规则)

    | 下载内容       | 说明          | 下载地址 |
    | ------------|  ------------| ------------ |
    | SDK17.1 蓝牙完整固件 | 此固件基于nRF SDK17.1<br>需使用烧录工具进行烧录<br>仅新版硬件支持此方式更新<br>可在SDK之间切换 <br> 刷写包包含刷写程序与所有键盘完整固件，可直接升级键盘 | <a href="https://eyun.baidu.com/s/3jKqTC7k" class="button">百度网盘下载</a> </br> <a href="https://github.com/genokolar/nrf52-keyboard/releases" class="button">Github发布页</a> </br> <a href="http://glab.online/down/sdk17/CMSIS-DAP线刷包20220118-11f8fcbc-SDK17.1.zip" class="button" title="可直接刷写固件的刷写包">CMSIS-DAP刷写包</a> |
    | SDK15.3 蓝牙核心固件 | 此固件基于nRF SDK15.3<br>需使用烧录工具进行烧录的蓝牙核心固件<br>仅新版硬件支持此方式更新<br>不可与SDK17的固件混刷 | <a href="https://eyun.baidu.com/s/3bpVmTzx" class="button">百度网盘下载</a> </br> <a href="https://github.com/genokolar/nrf52-keyboard/releases" class="button">Github发布页</a> |
    | SDK15.3 蓝牙DFU升级包 | 此固件基于nRF SDK15.3<br>需使用nRF Connect程序通过DFU升级<br>新老硬件均支持此方式更新<br>升级到SDK17的固件后，用此固件DFU升级会失败|<a href="https://eyun.baidu.com/s/3jJpXwG2" class="button">百度网盘下载</a> </br> <a href="https://github.com/genokolar/nrf52-keyboard/releases" class="button">Github发布页</a>|
    | SDK15.3 蓝牙完整固件 | 此固件基于nRF SDK15.3<br>需使用烧录工具进行烧录<br>仅新版硬件支持此方式更新<br>可用于返回SDK15固件 | <a href="https://eyun.baidu.com/s/3ghoXQDX" class="button">百度网盘下载</a> </br> <a href="https://github.com/genokolar/nrf52-keyboard/releases" class="button">Github发布页</a> |

=== "烧录&配置工具"

    | 下载内容       | 说明          | 下载地址 |
    | ------------|  ------------| ------------ |
    | 烧录工具 | USB固件及完整蓝牙固件烧录工具。</br>操作系统仅限Winodws，且需高于Windows 7 SP1。 | <a href="http://glab.online/down/wch_nrf_burner_setup_1.2.2.0.exe" class="button">1.2.2.0版</a><br><a href="https://eyun.baidu.com/s/3c2Tjcsg" class="button">百度网盘下载</a> |
    | 配置工具（绿色版） | 配置工具本地服务端，必须开启才能配置键盘<br>版本：1.0.3.0 - 支持：Windows/Linux/Mac OS<br>支持离线使用（访问http://localhost:5000） | <a href="http://glab.online/down/lkb-configurator/lkb-configurator-win-x64-2021-11-13_1.0.3.0-0-g86cdcae.tar.gz" class="button">官方下载(Win X64)</a><br><a href="http://glab.online/down/lkb-configurator/lkb-configurator-osx-x64-2021-11-13_1.0.3.0-0-g86cdcae.tar.gz" class="button">官方下载(OSX)</a><br> <a href="http://glab.online/down/lkb-configurator/lkb-configurator-linux-x64-2021-11-13_1.0.3.0-0-g86cdcae.tar.gz" class="button">官方下载(Linux)</a><br><a href="http://glab.online/down/lkb-configurator/lkb-configurator-universal-2021-11-13_1.0.3.0-0-g86cdcae.tar.gz" class="button">官方下载(其他系统)</a><br><a href="https://eyun.baidu.com/s/3c3X2Zmw" class="button">百度网盘下载</a><br><a href="https://github.com/genokolar/lkb-configurator-keyboards/releases" class="button">Github发布页</a> |
    | CMSIS-DAP烧录工具 | 完整蓝牙固件的烧录工具<br> 可更新整个蓝牙主控，可作为键盘修复工具| <a href="http://glab.online/down/sdk17/CMSIS-DAP线刷包20220118-11f8fcbc-SDK17.1.zip" class="button" title="可直接刷写固件的刷写包">官方下载</a><br><a href="https://eyun.baidu.com/s/3smnHnI1" class="button">百度网盘下载</a> |
    | nRF Connect | DFU升级所需手机APP<br>Android版本 |<a href="http://glab.online/down/nRF.Connect.apk" class="button">nRF Connect(Android)</a>|

=== "定位板图纸"

    | 下载内容       | 说明          | 下载地址 |
    | ------------|  ------------| ------------ |
    | 键盘的定位板文件 | 各个键盘的定位板图纸，可用于自己定制定位板或外壳 |<a href="https://eyun.baidu.com/s/3kWhhSeb" class="button">百度网盘下载</a>|
    | GT PAD 开源文件 | 定位板制造文件、外壳3D图纸等硬件开源文件 <br> 定位板与外壳 Rev.A与Rev.B通用|<a href="https://eyun.baidu.com/s/3brmyk0n" class="button">百度网盘下载</a>|
    | GT Volta9 开源文件 | 定位板制造文件、外壳3D图纸等硬件开源文件 | <a href="https://eyun.baidu.com/s/3bqA4ywZ" class="button">百度网盘下载</a>|

=== "USB固件"

    !!! danger "警示"

        出厂后一般不需要更新USB固件,非必要请勿更新

    
    | 键盘        | 说明          | 下载地址 |
    | ------------| --            |---- |
    | Farad69 Rev.A     | 较老的版本        |<a href="http://lotkb.cn/down/ch554/farad69-a-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/farad69-a-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
    | Farad69 Rev.B     | 不支持轴灯，较新的版本        |<a href="http://lotkb.cn/down/ch554/farad69-b-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/farad69-b-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
    | Farad69 Rev.C     | 轴灯版本        |<a href="http://lotkb.cn/down/ch554/farad69-c-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/farad69-c-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
    | Omega64 Rev.A & B     | 左移64与非左移64均采用同一个固件        |<a href="http://lotkb.cn/down/ch554/Omega64-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/Omega64-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
    | GT BLE60 Rev.D     | 老旧版，支持焊接轴体        |<a href="http://lotkb.cn/down/ch554/gt-ble60-d-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/gt-ble60-d-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
    | GT BLE60 Rev.E     | 不支持轴灯的版本        |<a href="http://lotkb.cn/down/ch554/gt-ble60-e-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/gt-ble60-e-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
    | GT BLE60 Rev.F     | 轴灯版本        |<a href="http://lotkb.cn/down/ch554/gt-ble60-f-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/gt-ble60-f-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
    | NewHope64     | 特殊64版本        |<a href="http://lotkb.cn/down/ch554/newhope64-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/newhope64-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
    | Omega50 Rev.A    | 不支持轴灯的版本      |<a href="http://lotkb.cn/down/ch554/Omega50-a-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/Omega50-a-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
    | Omega50 Rev.B    | 不支持轴灯的版本      |<a href="http://lotkb.cn/down/ch554/Omega50-b-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/Omega50-b-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
    | Omega84    | 当前仅一个版本        |<a href="http://lotkb.cn/down/ch554/Omega84-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/Omega84-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
    | Omega45 Rev.C    | 不支持轴灯的版本        |<a href="http://lotkb.cn/down/ch554/Omega45-c-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/Omega45-c-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
    | Omega45 Rev.D    | 不支持轴灯的版本        |<a href="http://lotkb.cn/down/ch554/Omega45-d-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/Omega45-d-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
    | Omega45 Rev.E    | 轴灯的版本        |<a href="http://lotkb.cn/down/ch554/Omega45-e-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/Omega45-e-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
    | Omega45 Rev.F    | RGB轴灯的版本        |<a href="http://lotkb.cn/down/ch554/Omega45-f-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/Omega45-f-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
    | GT PAD Rev.A    | 带轴灯标准数字小键盘       |<a href="http://lotkb.cn/down/ch554/gt-pad-a-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/gt-pad-a-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
    | GT PAD Rev.B    | RGB轴灯标准数字小键盘       |<a href="http://lotkb.cn/down/ch554/gt-pad-b-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/gt-pad-b-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
    | GT Planck Rev.A   | 直列40%键盘       |<a href="http://lotkb.cn/down/ch554/gt-planck-a-ch554-20211105-11d28f72.bin" class="button">下载地址一</a><br><a href="http://glab.online/down/ch554/gt-planck-a-ch554-20211105-11d28f72.bin" class="button">下载地址二</a> |
