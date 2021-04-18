硬件移植教程
==============

准备工作
--------

首先，你需要准备一份按键阵列表格，用于确定各个按键的位置。然后需要规划好各个IO口的用途。

注: 需要注意的是，P21是Reset口，若需要使用硬件Reset按钮，则可以使用此口；

然后将keyboard内的任意一个文件夹（建议使用template或lkb-core）作为移植模板复制一份，接下来的所有操作都在此文件夹内进行。

移植按键阵列IO和配置
--------

使用你喜欢的文本编辑器编辑`config.h` ，编辑以下关键配置

```
- MATRIX_ROWS：按键阵列的行数
- MATRIX_COLS：按键阵列的列数
- row_pin_array[MATRIX_ROWS]：按键行阵列的对应IO口
- column_pin_array[MATRIX_COLS]：按键列阵列对应的IO口
- #define ROW_IN：如果按键防反冲二极管是由列流向行的，启用这个FLAG；否则将其禁用
- #define MATRIX_HAS_GHOST：如果没有按键防反冲二极管，则启用这个FLAG；否则将其禁用
```

移植按键阵列对应表
--------

使用文本编辑器打开`keymap_common.h`，你可以看到有一个名为KEYMAP的宏。

这个宏可以使用QMK的builder工具生成。如果你想要手写的话可以继续往下面看。

我们以GH60的宏为例，讲解如何编写这个宏。

```

   /* GH60 keymap definition macro
    * K2C, K31 and  K3C are extra keys for ISO
    */
   #define KEYMAP( \
       K00, K01, K02, K03, K04, K05, K06, K07, K08, K09, K0A, K0B, K0C, K0D, \
       K10, K11, K12, K13, K14, K15, K16, K17, K18, K19, K1A, K1B, K1C, K1D, \
       K20, K21, K22, K23, K24, K25, K26, K27, K28, K29, K2A, K2B, K2C, K2D, \
       K30, K31, K32, K33, K34, K35, K36, K37, K38, K39, K3A, K3B, K3C, K3D, \
       K40, K41, K42,           K45,                K49, K4A, K4B, K4C, K4D  \
   ) { \
       { KC_##K00, KC_##K01, KC_##K02, KC_##K03, KC_##K04, KC_##K05, KC_##K06, KC_##K07, KC_##K08, KC_##K09, KC_##K0A, KC_##K0B, KC_##K0C, KC_##K0D }, \
       { KC_##K10, KC_##K11, KC_##K12, KC_##K13, KC_##K14, KC_##K15, KC_##K16, KC_##K17, KC_##K18, KC_##K19, KC_##K1A, KC_##K1B, KC_##K1C, KC_##K1D }, \
       { KC_##K20, KC_##K21, KC_##K22, KC_##K23, KC_##K24, KC_##K25, KC_##K26, KC_##K27, KC_##K28, KC_##K29, KC_##K2A, KC_##K2B, KC_##K2C, KC_##K2D }, \
       { KC_##K30, KC_##K31, KC_##K32, KC_##K33, KC_##K34, KC_##K35, KC_##K36, KC_##K37, KC_##K38, KC_##K39, KC_##K3A, KC_##K3B, KC_##K3C, KC_##K3D }, \
       { KC_##K40, KC_##K41, KC_##K42, KC_NO,    KC_NO,    KC_##K45, KC_NO,    KC_NO,    KC_NO,    KC_##K49, KC_##K4A, KC_##K4B, KC_##K4C, KC_##K4D }  \
   }
```

首先，我们很容易注意到，这个宏分为上下两个部分：上部分是键盘按键形状的，下部分是阵列形状的。这个宏的作用是，将键盘按键的一维数组转换为按键阵列的二维数组，也就是定义每个按键在对应的哪个按键阵列的位置。

我们先来看K00按键。在这是GH60的第一个按键，也就是ESC；这个按键在下部分的第一个数组的第一个位置，说明其是第一行第一列的按键；再看K49，这是空格右边的Alt按键，它在下部分的第五个数组的第10个位置，说明了其是第5行第10列的按键。下面的写着KC_NO的按键位置表示这个位置没有放置按键。

下面这一部分，行数和前面定义的按键阵列的行数相等，每一行的元素的数目，也和前面定义的列数相等。

注: 上面这一部分中，反斜杠表示换行。上面的这一部分本质上是一维数组，只不过为了好看而将其转换为了键盘实际的样式。

编辑默认配列
--------

用文本编辑器打开`keymap_plain.c`，你会发现有两个部分：一部分是keymaps，定义了默认的键盘配列；一部分是fn_actions，定义了默认的键盘fn功能。

这部分的代码也可以使用QMK的工具生成。

对于keymaps部分，使用了前面提到的KEYMAP的宏，将键盘上的各个按键键值转换为对应按键阵列的键值。我们仅需按照键盘的样式对其编辑即可。

其他配置项目
--------

#### 常用config配置

`config.h`内有一些可以配置的项目，这里写出一些比较常用的：

```
   #define MANUFACTURER "Lotlab" /* 蓝牙显示的硬件制造商名称 */
   #define PRODUCT "LKB-Core" /* USB和蓝牙显示的硬件名称。USB的需要重新烧录固件 */
   #define MACADDR_SEPRATOR '_' /* 蓝牙名称后地址的分隔符。若不设置则不显示蓝牙名称后面的地址 */
   #define BOOTMAGIC_KEY_BOOT KC_U /* 开机Bootmagic按键 */
   #define BOOTMAGIC_KEY_ERASE_BOND KC_E /* 删除所有绑定Bootmagic按键 */
   #define LED_NUM 22 /* 小键盘锁定灯 */
   #define LED_CAPS 23 /* 大小写锁定灯 */
   // #define LED_SCLK 23 /* 滚动锁定灯, 注释掉代表不使用此灯 */
   #define LED_POSITIVE /* LED 使用上拉驱动，即二极管的正极接IO口。注释掉代表下拉驱动，即二极管的正极接电源正极 */
   #define SLEEP_OFF_TIMEOUT 3600 // 键盘闲置多久后转入自动关机 (s)
   #define DYNAMIC_TX_POWER /* 启用自动发射功率调整 */
   #define LED_AUTOOFF_TIME 60000 /* LED自动熄灭时长(ms)，设为0则不自动熄灭 */
   #define PASSKEY_REQUIRED /* 启用蓝牙加密连接，在连接时需要输入配对码 */
```
#### 蓝牙、USB、充电状态显示

如果想要启用USB、蓝牙、充电指示灯，则需要编辑Makefile，加入一行

```
   THREE_LED_STATUS_EVT = yes
```
并在config.h内添加：

```
   #define LED_STATUS_BLE 22 // 蓝牙连接指示灯
   #define LED_STATUS_CHARGING 23 // 充电指示灯
   #define LED_STATUS_USB 24 // USB连接状态指示灯
```

#### 禁用软件开机功能

如果需要禁用Space+U的软件开机功能，请参考`lkb-core/custom.c`文件内的`hook_bootmagic`函数，将默认的检测Space+U再开机的代码使用这段代码覆盖掉。
