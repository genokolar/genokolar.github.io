
让我们开始阅读文档
=====================

<div class="text-center">
<a href="getting-started/" class="btn btn-primary" role="button">Getting Started</a>
<a href="user-guide/" class="btn btn-primary" role="button">User Guide</a>
</div>

<div class="jumbotron">
<h2 class="display-4 text-center">Features</h2>

<div class="row">
  <div class="col-sm-6">
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">Great themes available</h3>
        <p class="card-text">
            There's a stack of good looking <a
            href="user-guide/choosing-your-theme">themes</a> available for
            MkDocs. Choose between the built in themes: <a
            href="user-guide/choosing-your-theme/#mkdocs">mkdocs</a> and <a
            href="user-guide/choosing-your-theme/#readthedocs">readthedocs</a>,
            select one of the third-party themes listed on the <a
            href="">MkDocs Themes</a> wiki page, or <a href="">build your
            own</a>.
        </p>
      </div>
    </div>
  </div>
  <div class="col-sm-6">
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">Easy to customize</h3>
        <p class="card-text">
            Get your project documentation looking just the way you want it by
            <a href="user-guide/customizing-your-theme/">customizing your
            theme</a> and/or installing some <a
            href="user-guide/configuration/#plugins">plugins</a>. Modify
            Markdown's behavior with <a
            href="user-guide/configuration/#markdown_extensions">Markdown
            extensions</a>. Many <a
            href="user-guide/configuration/">configuration options</a> are
            available.
        </p>
      </div>
    </div>
  </div>
</div>

<div class="row">
  <div class="col-sm-6">
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">Preview your site as you work</h3>
        <p class="card-text">
            The built-in dev-server allows you to preview your documentation
            as you're writing it. It will even auto-reload and refresh your
            browser whenever you save your changes.
        </p>
      </div>
    </div>
  </div>
  <div class="col-sm-6">
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">Host anywhere</h3>
        <p class="card-text">
            MkDocs builds completely static HTML sites that you can host on
            GitHub pages, Amazon S3, or <a
            href="user-guide/deploying-your-docs/">anywhere</a> else you
            choose.
        </p>
      </div>
    </div>
  </div>
</div>
</div>

公告
------

📢 部分新键盘已经提供基于nRF SDK17.0.2的固件，请进入对应产品页面进行下载。

📢 基于nRF SDK17.0.2的固件不能与基于nRF SDK15.3的固件混用，如需两者间切换，请刷写蓝牙完整固件进行切换。

📢 因USB无需更新，USB固件不再提供下载，如确需下载的请[联系我们](introduce.md#联系我们)。

📢 受缺芯潮影响，部分PCB已经断货。


GT系列蓝牙键盘介绍
-----
大家好，欢迎大家前来了解GT系列蓝牙键盘的相关产品，如果您已经购买或者想要购买相关产品请耐心的往后看。

### 我们是客制化产品

请使用包容的态度看待客制化产品。

**如果您完全是抱着想省钱的态度来组装键盘，其实我建议您直接买一把量产键盘。**

**如果您没有折腾的态度，仅仅需要一把即刻能用的键盘，其实我建议您直接买一把量产键盘。**

**如果您无法忍受客制化键盘可能出现的小BUG，其实我建议您直接买一把量产键盘。**


其实键盘客制化包含非常多的内容，比如自己组装一把属于自己的键盘、比如购买一个心仪的键盘套件、比如购买换搭不同的风格的漂亮键帽，都是客制化。

**GT系列产品主要是帮助大家组装一把属于自己的键盘，当然还是一把蓝牙双模的键盘 ：）**

客制化可能比您想象的花钱，定制、小批量、个性化都决定了价格不会便宜，和一些低价量产键盘比，客制化机械键盘明显更贵。

但客制化享受的是个性的设定、完全符合自己的手感、漂亮独特的外观等，所以，预祝您DIY出自己心喜的键盘。

### 什么是Lotkb

GT系列键盘采用了开源的Lotkb源码，什么是Lotkb呢？

Lotkb是[Jim](https://lotlab.org/)开发的一个基于nRF52芯片的蓝牙键盘的固件。

硬件上采用nRF52系列蓝牙主控（nrf52810或nrf52832）+ CH552 USB单片机芯片的组合，实现蓝牙与USB双模，使用了nRF SDK 15.3作为底层硬件驱动，并使用TMK键盘库作为键盘功能的上部实现。

Lotkb是一个开源项目，其软件源码与硬件设计都是开源的，您可以从github上获得。



键盘特点
-----
- Lotkb代码开源
- 蓝牙和USB，无线和有线一体的双模。
- 支持轴体热拔插，不用焊接快速更换轴体。
- 键线分离，越来越普及的TYPE-C接口，数据线更易获得。
- 低功耗蓝牙 BLE 5.0，续航超长。1000mah电池续航100天，待机超过一年。
- 多设备切换，支持最多三台设备之间一键切换，并支持USB和蓝牙无缝切换。
- 全键自定义，支持多平台更新配置按键，按键设定想怎么改怎么改。
- 按键自定义功能丰富，最高8层按键，可自定义宏，支持全键无冲
- 支持旋钮、OLED屏幕、RGB底灯、轴灯
- 固件开源并不断更新完善。

蓝牙兼容性说明
-----
GT系列蓝牙双模键盘采用的低功耗蓝牙：Bluetooth Low Energy 5.0，可向下兼容蓝牙4.0，但不支持蓝牙3.0及以下，也就是至少要硬件设备支持蓝牙4.0以上才行。

操作系统方面广泛支持Windows、Linux、Mac OS，也支持Android及iOS，但由于采用的较新的协议，需要较新的系统才能支持。如： iOS 6以上；Android 4.3以上；Windows 8.1以上；Windows Phone 8.1；较新的Mac os


联系我们
----------------

QQ交流群：38491793

淘宝店铺: http://shop.glab.online/
