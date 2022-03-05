
使用Github Action自行编译固件
=====================

大家好，为了让大家能傻瓜式修改自己的键盘固件，我们今天来教大家通过Github Action自行编译固件。

??? faq "自己编译固件能干什么？"
    - 自己编译固件最简单的就是能修改配置文件，如修改你键盘的名字，增加所接灯带数量。
    - 当然还可以更进一步，比如开启某个功能，修改某个功能。

如何自行编译固件
-----------
简单来讲，你只需要四步操作就可以完成键盘固件的编译：

 1. Fork（克隆）仓库到自己的github账号（当然，首先你要有一个github账号）
 2. 修改你键盘的配置文件、或者是修改其他源码
 3. 进入Action执行编译
 4. 执行完成后就可以下载编译完成的固件了

详细的操作步骤可以观看演示视频：
<video id="video" width="360px" height="auto" controls="controls" preload="none" poster="https://wiki.glab.online/img/videoicon.png">
<source id="mp4" src="https://glab.online/down/Github_Action_compile_LotKB.mp4" type="video/mp4">
  您的浏览器不支持播放此视频
</video>

更改键盘名称
--------
进入keyboard目录，找到config.h，找到如下项：

    #define PRODUCT "Omega45C" /* 硬件名词，用于蓝牙显示 */

将其中的Omega45C修改为你中意的名字再编译固件，注意名字不要过长

更改灯带的灯数量
-----------
进入keyboard目录，找到config.h，找到如下项：

    #define RGBLED_NUM 8

将数字8，修改为你灯带上灯珠的正确数量再编译固件

更改功能按键
-------------
默认采用<kbd>Lshift</kbd>+<kbd>Rshift</kbd>做为功能键触发按键，可以通过自行编译更改为<kbd>Lctrl</kbd>+<kbd>Rctrl</kbd> 或 <kbd>Win</kbd>+<kbd>ESC</kbd>等做为触发按键

进入keyboard目录，找到config.h，找到如下项：

    /* key combination for command */
    #define IS_COMMAND() ( \
        keyboard_report->mods == (MOD_BIT(KC_LSHIFT) | MOD_BIT(KC_RSHIFT)))

将上面第三行，按照如下对应关系修改，再编译固件既可以更改为你想要的触发按键：

    双 SHIFT: keyboard_report->mods == (MOD_BIT(KC_LSHIFT) | MOD_BIT(KC_RSHIFT))
    双CTRL: keyboard_report->mods == (MOD_BIT(KC_LCTRL) | MOD_BIT(KC_RCTRL))
    WIN+ESC: keyboard_report->mods == (MOD_BIT(KC_LGUI)) && get_first_key() == KC_ESC

开启某项功能
-------------
默认有的键盘是没有开启一些功能的，需要自行编译开启。

比如OLED屏幕，默认固件未开启功能，但是有预留接口，我们可以自行开启

进入keyboard目录，找到rules.mk，找到如下项：

    RGB_LIGHT_ENABLE = yes     #启用RGB轴灯
    ROTARY_ENCODER = yes # 启用编码器
    # SSD1306_OLED = yes
    ACTIONMAP_ENABLE =yes

将上面# SSD1306_OLED = yes 前的# 去掉再编译固件，既可以开启OLED支持

    RGB_LIGHT_ENABLE = yes     #启用RGB轴灯
    ROTARY_ENCODER = yes # 启用编码器
    SSD1306_OLED = yes
    ACTIONMAP_ENABLE =yes

同理可以开启或者关闭某项其他功能

!!! tip "更多修改方式请自行探索！"



