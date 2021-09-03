
使用Github Action自行编译固件
=====================

大家好，为了让大家能傻瓜式修改自己的键盘固件，我们今天来教大家通过Github Action自行编译固件。

??? faq "自己编译固件能干什么？"
    - 自己编译固件最简单的就是修改配置文件，如修改你键盘对名字，增加所接灯带数量。
    - 当然还可以更进一步，比如开启某个功能，修改某个功能。

如何自行编译固件
-----------
简单来讲，你只需要四步操作就可以完成键盘固件对编译：

 1. fork仓库到自己对github账号（当然，首先你要有一个github账号）
 2. 修改你键盘的配置文件、或者是修改其他源码
 3. 进入action执行编译
 4. 执行完成后下载编译完成的固件。

详细的操作步骤可以参考演示视频：
<video id="video" width="360px" height="auto" controls="controls" preload="none" poster="http://glab.online/wp-content/uploads/2019/10/favicon.png">
<source id="mp4" src="http://glab.online/down/Github_Action_compile_LotKB.mp4" type="video/mp4">
  您的浏览器不支持播放此视频
</video>

更改键盘名称
--------
进入keyboard目录，找到config.h，找到如下项：

    #define PRODUCT "Omega45C" /* 硬件名词，用于蓝牙显示 */

将其中的Omega45C修改为你中意的名字，注意不要过长

更改灯带的灯数量
-----------
进入keyboard目录，找到config.h，找到如下项：

    #define RGBLED_NUM 8

将数字8，修改为你灯带上灯珠的正确数量

更改功能按键
-------------
默认采用<kbd>Lshift</kbd>+<kbd>Rshift</kbd>做为功能键触发按键，可以通过自行编译更改<kbd>Lctrl</kbd>+<kbd>Rctrl</kbd> 或 <kbd>Win</kbd>+<kbd>ESC</kbd>等做为触发按键

进入keyboard目录，找到config.h，找到如下项：

    /* key combination for command */
    #define IS_COMMAND() ( \
        keyboard_report->mods == (MOD_BIT(KC_LSHIFT) | MOD_BIT(KC_RSHIFT)))

将上面第三行，按照如下对应关系修改：

    双 SHIFT: keyboard_report->mods == (MOD_BIT(KC_LSHIFT) | MOD_BIT(KC_RSHIFT))
    双CTRL: keyboard_report->mods == (MOD_BIT(KC_LCTRL) | MOD_BIT(KC_RCTRL))
    WIN+ESC: keyboard_report->mods == (MOD_BIT(KC_LGUI)) && get_first_key() == KC_ESC

!!! tip "更多修改方式请自行探索！"



