//设置过滤器
const filters = [{
    vendorId: 0x1209, // GT
    productId: 0x0514, // GT
}];

//设备信息表 定义设备数组及其供应商ID 和产品ID
const devices = [
    { name: 'BLE60 D', vendor: 0x4366, product: 0x0311 },
    { name: 'Omega45 C&D', vendor: 0x4366, product: 0x0312 },
    { name: 'Farad69 A', vendor: 0x4366, product: 0x0313 },
    { name: 'Omega50 A', vendor: 0x4366, product: 0x0314 },
    { name: 'BLE60 E', vendor: 0x4366, product: 0x0315 },
    { name: 'Farad69 B', vendor: 0x4366, product: 0x0316 },
    { name: 'Omega64', vendor: 0x4366, product: 0x0317 },
    { name: 'Omega84', vendor: 0x4366, product: 0x0318 },
    { name: 'Newhope64 A', vendor: 0x4366, product: 0x0319 },
    { name: 'GTPAD', vendor: 0x4366, product: 0x031A },
    { name: 'BLE60 F&G', vendor: 0x4366, product: 0x031B },
    { name: 'Omega50 B&C', vendor: 0x4366, product: 0x031C },
    { name: 'Farad69 C&D', vendor: 0x4366, product: 0x031D },
    { name: 'Omega45 E&F', vendor: 0x4366, product: 0x031E },
    { name: 'Planck A', vendor: 0x4366, product: 0x031F },
    { name: 'Omega40 A', vendor: 0x4366, product: 0x0320 },
    { name: 'Volta9', vendor: 0x4366, product: 0x0321 },
    { name: 'Newhope64 B', vendor: 0x4366, product: 0x0322 },
    { name: 'Planck B', vendor: 0x4366, product: 0x0323 },
    { name: 'HAL67 A', vendor: 0x4366, product: 0x0324 },
];

let refreshing = false;
let device_opened = false;
let layer = 1;
let Logenable = false;
let info;
const reportId = 0x3f;

var LINKCTRLElement = document.getElementById('linkctrl');


// 检查浏览器是否支持通知
if (!("Notification" in window)) {
    alert("此浏览器不支持桌面通知");
} else {
    consolelog("桌面通知是支持的。");
}

// 请求用户授权接收通知的函数
function requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            consolelog("通知权限已获得");
            // 用户已授权，可以发送通知
            showNotification('已授权', "通知权限已获得");
        } else {
            consolelog("通知权限被拒绝");
        }
    });
}

// 发送通知的函数
async function showNotification(title, tips) {
    const notification = new Notification(title, {
        body: tips,
        icon: "app.png" // 可以指定一个图标的路径
    });

    // 通知点击事件
    notification.onclick = function () {
        consolelog("通知被点击了");
        // 这里可以打开新页面或者执行其他操作
    };

    // 通知显示一段时间后自动关闭
    setTimeout(notification.close.bind(notification), 5000);
}

// 绑定按钮点击事件来请求通知权限
document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("notificationButton");
    if (button) {
        button.addEventListener("click", requestNotificationPermission);
    }
});

//===========================页面更新操作部分====================================

// 切换标签页内容的函数
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none"; // 隐藏所有标签页内容
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", ""); // 移除激活状态
    }
    document.getElementById(tabName).style.display = "block"; // 显示选中的标签页内容
    evt.currentTarget.className += " active"; // 为选中的标签页按钮添加激活状态

    // 根据tabName更新顶栏状态
    /* switch (tabName) {
        case 'Tab1':
            updateHeaderStatus('fas fa-cog', 'Tab 1 Active');
            break;
        case 'Tab2':
            updateHeaderStatus('fas fa-signal', 'Tab 2 Active');
            break;
        case 'Tab3':
            updateHeaderStatus('fas fa-trophy', 'Tab 3 Active');
            break;
        case 'Tab4':
            updateHeaderStatus('fas fa-inbox', 'Tab 4 Active');
            break;
    } */
}

// 切换主题的函数
function toggleTheme() {
    var themeIcon = document.getElementById('theme-icon');
    if (document.body.classList.contains("dark-theme")) {
        document.body.classList.remove("dark-theme");
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
        localStorage.setItem("theme", "light"); // 保存亮色主题到localStorage
    } else {
        document.body.classList.add("dark-theme");
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
        localStorage.setItem("theme", "dark"); // 保存暗色主题到localStorage
    }
}

// 页面加载时应用保存的主题
document.addEventListener("DOMContentLoaded", function () {
    var savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        document.getElementById("theme-icon").classList.remove("fa-sun");
        document.getElementById("theme-icon").classList.add("fa-moon");
    } else {
        document.body.classList.remove("dark-theme");
        document.getElementById("theme-icon").classList.remove("fa-moon");
        document.getElementById("theme-icon").classList.add("fa-sun");
    }
});


// 更新头部状态的函数
function updateHeaderStatus(iconid, textid, iconClass, text) {
    var Icon = document.getElementById(iconid);
    var StatusText = document.getElementById(textid);

    if (Icon) {
        Icon.className = iconClass;
    }

    if (StatusText) {
        StatusText.textContent = text;
    }
}

//将状态栏设置为默认状态
async function default_status() {
    updateHeaderStatus('link-icon', 'link-text', 'fas fa-unlink', '未连接');
    updateHeaderStatus('', 'mode-text', '', '输出端');
    updateHeaderStatus('', 'layer-text', '', '激活层');
    updateHeaderStatus('battery-icon', 'battery-text', 'fas fa-battery-empty', '电量');
    updateHeaderStatus('device-icon', 'device-text', 'fas fa-sign-out-alt', '设备名称');
}

function consolelog(Logtxt, ...args) {
    if (Logenable) {
        console.log(Logtxt, ...args);
    }
}

//=======================================================================监听器部分=====================
document.addEventListener('DOMContentLoaded', async () => {
    // 默认打开第一个标签页
    var firstTabLink = document.getElementsByClassName("tablinks")[0];
    if (firstTabLink) {
        firstTabLink.click();
    }
    //==========================获取元素====================
    document.getElementsByName('grantdevice')[0].addEventListener('click', GrantDevice); //授权设备
    document.getElementsByName('systemoff')[0].addEventListener('click', SYSTEMOFF); //授权设备
    document.getElementsByName('sleep')[0].addEventListener('click', SLEEP); //授权设备
    document.getElementsByName('indicatorlight')[0].addEventListener('click', TOGGLE_INDICATOR_LIGHT); //授权设备
    document.getElementsByName('bootcheck')[0].addEventListener('click', BOOTCHECK); //授权设备
    //document.getElementById('list-button').addEventListener('click', ListDevices); //列出设备
    //document.getElementById('connect-button').addEventListener('click', OpenDevice); //连接设备
    document.getElementById('disconnect-button').addEventListener('click', CloseDevice); //断开连接

    document.getElementsByName('switchusb')[0].addEventListener('click', SWITCH_USB);
    document.getElementsByName('switchble')[0].addEventListener('click', SWITCH_BLE);
    document.getElementsByName('switchesb')[0].addEventListener('click', SWITCH_ESB);
    document.getElementsByName('switchesbtx')[0].addEventListener('click', SWITCH_ESB_TX);
    document.getElementsByName('switchesbrx')[0].addEventListener('click', SWITCH_ESB_RX);
    document.getElementsByName('readv')[0].addEventListener('click', READV);
    document.getElementsByName('rebond')[0].addEventListener('click', REBOND);
    document.getElementsByName('switchbt1')[0].addEventListener('click', SWITCH_BT1);
    document.getElementsByName('switchbt2')[0].addEventListener('click', SWITCH_BT2);
    document.getElementsByName('switchbt3')[0].addEventListener('click', SWITCH_BT3);
    document.getElementsByName('rgbtoggle')[0].addEventListener('click', RGBLIGHT_TOGGLE);
    document.getElementsByName('rgbmodeinc')[0].addEventListener('click', RGBLIGHT_MODE_INCREASE);
    document.getElementsByName('rgbmodedec')[0].addEventListener('click', RGBLIGHT_MODE_DECREASE);
    document.getElementsByName('rgbhueinc')[0].addEventListener('click', RGBLIGHT_HUE_INCREASE);
    document.getElementsByName('rgbhuedec')[0].addEventListener('click', RGBLIGHT_HUE_DECREASE);
    document.getElementsByName('rgbsatinc')[0].addEventListener('click', RGBLIGHT_SAT_INCREASE);
    document.getElementsByName('rgbsatdec')[0].addEventListener('click', RGBLIGHT_SAT_DECREASE);
    document.getElementsByName('rgbvalinc')[0].addEventListener('click', RGBLIGHT_VAL_INCREASE);
    document.getElementsByName('rgbvaldec')[0].addEventListener('click', RGBLIGHT_VAL_DECREASE);
    document.getElementsByName('defaultlayer1')[0].addEventListener('click', defaultlayer1);
    document.getElementsByName('defaultlayer2')[0].addEventListener('click', defaultlayer2);
    document.getElementsByName('defaultlayer3')[0].addEventListener('click', defaultlayer3);
    document.getElementsByName('defaultlayer4')[0].addEventListener('click', defaultlayer4);
    document.getElementsByName('defaultlayer5')[0].addEventListener('click', defaultlayer5);
    document.getElementsByName('defaultlayer6')[0].addEventListener('click', defaultlayer6);
    document.getElementsByName('defaultlayer7')[0].addEventListener('click', defaultlayer7);
    document.getElementsByName('defaultlayer8')[0].addEventListener('click', defaultlayer8);
    //document.getElementsByName('getkeyboardinfo')[0].addEventListener('click', GetKeyboardInfo); ：获取键盘信息
    consolelog("DOMContentLoaded");
    const devices_list = await navigator.hid.getDevices();
    if (devices_list.length) {
        for (var i = 0; i < devices_list.length; i++) {
            OpenDevice(devices_list[i]);
        }
    } else {
        consolelog("No Device online");
    }
});


if ("hid" in navigator) {
    //监听HID授权设备的接入，并连接设备
    navigator.hid.addEventListener('connect', ({ device }) => {
        consolelog(`HID设备连接: ${device.productName}`);
        //优先连接有线设备
        if (device.productName.includes("Lotlab")) {
            OpenDevice(device)
        } else if (device.productName == "") {
            OpenDevice(device)
        }
    });

    //监听HID授权设备的断开，并提示
    navigator.hid.addEventListener('disconnect', ({ device }) => {
        consolelog(`HID设备断开: ${device.productName}`);
        Check_Opend();
    });
} else {
    //document.getElementById('consoleinfo').innerHTML = "🔺提示信息：" + '<br>';
    //document.getElementById('consoleinfo').innerHTML += "您的浏览器不支持WebHID，请使用Chrome 89+ / Edge 89+ / Opera 75+" + '<br>';
}

//============================================连接键盘=========================================================
//授权设备
async function GrantDevice() {
    let devices_list = await navigator.hid.requestDevice({
        filters
    });

    //如果新选了设备，先断开所有设备
    if (devices_list) {
        const link_devices_list = await navigator.hid.getDevices();
        if (!link_devices_list) return null;
        for (var i = 0; i < link_devices_list.length; i++) {
            if (link_devices_list[i].opened) {
                await link_devices_list[i].close();
                device_opened = false;
                consolelog("Close Device:", link_devices_list[i]);
            }
        }

    }
    //遍历设备，并打开符合条件的设备
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].productName.includes("Lotlab") && !device_opened) {
            OpenDevice(devices_list[i]);
            consolelog("Grant & Open Device:", devices_list[i]);
        } else if (devices_list[i].productName == "" && !device_opened) {
            OpenDevice(devices_list[i]);
            consolelog("Grant & Open Device:", devices_list[i]);
        }
    }
}


//列出设备
async function ListDevices() {
    const devices_list = await navigator.hid.getDevices();
    if (!devices_list.length) {
        consolelog("No Device Connected");
        return null;
    }
    consolelog("ListDevices():", devices_list);
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].productName.includes("Lotlab") || (devices_list[i].productName == "")) { }
    }
}

//连接设备【先授权，后连接GT 2.4G Receiver】
async function OpenDevice(opendevice) {
    if (!device_opened) {
        const devices_list = await navigator.hid.getDevices();
        if (!devices_list.length) {
            consolelog("No Device Connected");
            default_status();
            return null;
        } else {
            if (opendevice.productName.includes("Lotlab") && !device_opened) {
                await opendevice.open();
                device_opened = true;
                refreshdata();
                updateHeaderStatus('link-icon', 'link-text', 'fas fa-link', 'USB');
                // 显示RGB控制元素
                LINKCTRLElement.style.display = 'block';
                consolelog("Open Device:", opendevice);
                opendevice.oninputreport = ({ device, reportId, data }) => {
                    const inputdata = new Uint8Array(data.buffer);
                    consolelog(`USB InputReport ${reportId} from ${device.productName}:`, inputdata);
                    update_statebar(inputdata);
                };
            } else if (opendevice.productName == "" && !device_opened) {
                await opendevice.open();
                device_opened = true;
                refreshdata();
                updateHeaderStatus('link-icon', 'link-text', 'fas fa-wifi', '蓝牙');
                // 隐藏RGB控制元素
                LINKCTRLElement.style.display = 'none';
                consolelog("Open Device:", opendevice);
                opendevice.oninputreport = ({ device, reportId, data }) => {
                    const inputdata = new Uint8Array(data.buffer);
                    consolelog(`USB InputReport ${reportId} from ${device.productName}:`, inputdata);
                    update_statebar(inputdata);
                };
            }
        }
    }
}

//断开设备
async function CloseDevice() {
    const devices_list = await navigator.hid.getDevices();
    if (!devices_list) return null;
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened) {
            await devices_list[i].close();
            device_opened = false;
            consolelog("CloseDevice():", devices_list[i]);
        }
    }
    Check_Opend();
}

//===================================================状态处理、数据处理================================
// 返回数据为1的位号
function findSingleOneBit(data) {
    for (let i = 7; i > 0; i--) {
        if ((data & (1 << i)) !== 0) {
            return i; // 直接返回第一个找到的1的位置
        }
    }
    return 0; // 如果没有找到1，返回-1
}

function getDeviceName(vendorId, productId) {
    for (const device of devices) {
        if (device.vendor === vendorId && device.product === productId) {
            return device.name;
        }
    }
    return 'X Device';
}

//发送数据处理函数：获取键盘信息
async function GetKeyboardInfo() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && (devices_list[i].productName.includes("Lotlab") || devices_list[i].productName == "")) {
            const outputReportData = new Uint8Array([0x20]);
            try {
                await devices_list[i].sendReport(reportId, outputReportData);
                consolelog('SendReport:', reportId, outputReportData);
            } catch (error) {
                console.error('SendReport: Failed:', error);
            }
            consolelog("GetKeyboardInfo():", devices_list[i]);
        }
    }
}


//发送数据
async function sendcmd(data) {
    const devices_list = await navigator.hid.getDevices();
    for (let i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && (devices_list[i].productName.includes("Lotlab") || devices_list[i].productName == "")) {
            try {
                const newData = new Uint8Array([0x40, ...data]); // 创建一个新数组，包含0x40和原数组的所有元素
                await devices_list[i].sendReport(reportId, newData);
                consolelog('SendReport:', reportId, newData);
                GetKeyboardInfo(); //发送命令后及时获取信息
            } catch (error) {
                console.error('SendReport: Failed:', error);
            }
            return;
        }
    }
}
//检测是否打来设备
async function Check_Opend() {
    const devices_list = await navigator.hid.getDevices();
    device_opened = false;
    for (var i = 0; i < devices_list.length; i++) {
        // 有设备打开状态，检测断开的设备是什么
        if (devices_list[i].opened) {
            if (devices_list[i].productName.includes("Lotlab") && devices_list[i].opened) {
                updateHeaderStatus('link-icon', 'link-text', 'fas fa-link', 'USB');
                // 显示RGB控制元素
                LINKCTRLElement.style.display = 'block';
            } else if (devices_list[i].productName == "" && devices_list[i].opened) {
                updateHeaderStatus('link-icon', 'link-text', 'fas fa-wifi', '蓝牙');
                // 隐藏RGB控制元素
                LINKCTRLElement.style.display = 'none';
            }
            device_opened = true;
        }
    }
    if (!device_opened) {
        //所有设备断开，停掉定时刷新任务
        clearInterval(info);
        refreshing = false;
        //恢复状态栏
        default_status();
        consolelog("No Device Connected");
    }
}

//刷新数据任务
async function update_statebar(inputdata) {
    if (inputdata[0] == 0) {
        //var builddata = parseInt("0x" + ("0" + inputdata[15].toString(16)).slice(-2) + ("0" + inputdata[14].toString(16)).slice(-2) + ("0" + inputdata[13].toString(16)).slice(-2) + ("0" + inputdata[12].toString(16)).slice(-2)).toString(10);
        //var newDate = new Date();
        //newDate.setTime(builddata * 1000);
        //var formattedDate = newDate.getFullYear() + '/' + (newDate.getMonth() + 1).toString().padStart(2, '0') + '/' + newDate.getDate().toString().padStart(2, '0');
        let battery_icon = 'fas fa-battery-full'
        if (inputdata[20] < 90 && inputdata[20] >= 75) {
            battery_icon = 'fas fa-battery-three-quarters'
        } else if (inputdata[20] < 75 && inputdata[20] >= 50) {
            battery_icon = 'fas fa-battery-half'
        } else if (inputdata[20] < 50 && inputdata[20] >= 25) {
            battery_icon = 'fas fa-battery-quarter'
        } else if (inputdata[20] < 25) {
            battery_icon = 'fas fa-battery-empty'
        }
        let mode_info = '输出端'
        if ((inputdata[31] & (1 << 6)) && (inputdata[31] & (1 << 5))) {
            mode_info = '无线接收'
        } else if ((inputdata[31] & (1 << 6)) && !(inputdata[31] & (1 << 5))) {
            if ((inputdata[31] & (1 << 0))) {
                mode_info = '无线一'
            } else if ((inputdata[31] & (1 << 1))) {
                mode_info = '无线二'
            } else if ((inputdata[31] & (1 << 2))) {
                mode_info = '无线三'
            }
        } else if (!(inputdata[31] & (1 << 6))) {
            if ((inputdata[31] & (1 << 0))) {
                mode_info = '蓝牙一'
            } else if ((inputdata[31] & (1 << 1))) {
                mode_info = '蓝牙二'
            } else if ((inputdata[31] & (1 << 2))) {
                mode_info = '蓝牙三'
            }
        }
        const vendorId = parseInt("0x" + ("0" + inputdata[3].toString(16)).slice(-2) + ("0" + inputdata[2].toString(16)).slice(-2));
        const productId = parseInt("0x" + ("0" + inputdata[5].toString(16)).slice(-2) + ("0" + inputdata[4].toString(16)).slice(-2));
        const deviceName = getDeviceName(vendorId, productId);

        updateHeaderStatus('', 'mode-text', '', mode_info);
        updateHeaderStatus('device-icon', 'device-text', 'fas fa-sign-in-alt', deviceName);
        updateHeaderStatus('battery-icon', 'battery-text', battery_icon, inputdata[20].toLocaleString() + '%');
        updateHeaderStatus('', 'layer-text', '', findSingleOneBit(inputdata[21] | inputdata[22]) + 1);
        if ((findSingleOneBit(inputdata[21] | inputdata[22]) + 1) != layer) {
            layer = (findSingleOneBit(inputdata[21] | inputdata[22]) + 1);
            showNotification('激活层更改', '当前激活层为层' + layer);
        }
    } else if (inputdata[0] == 0x05) {  //收到键盘接收出错错误的数据包
        GetKeyboardInfo();             //立刻重新获取键盘信息
    }
}

//刷新数据任务
async function refreshdata() {
    if (!refreshing) {
        GetKeyboardInfo();
        info = setInterval(GetKeyboardInfo, 5000);
        refreshing = true;
    }
}

//====================================================================================键盘控制按键==================================
//发送数据处理函数：SYSTEMOFF
async function SYSTEMOFF() {
    cmd = new Uint8Array([0x02, 0x12, 0x00]);
    sendcmd(cmd);
}

//发送数据处理函数：SLEEP
async function SLEEP() {
    cmd = new Uint8Array([0x02, 0x00, 0x00]);
    sendcmd(cmd);
}

//发送数据处理函数：TOGGLE_INDICATOR_LIGHT
async function TOGGLE_INDICATOR_LIGHT() {
    cmd = new Uint8Array([0x02, 0x12, 0x01]);
    sendcmd(cmd);
}

//发送数据处理函数：BOOTCHECK
async function BOOTCHECK() {
    cmd = new Uint8Array([0x02, 0x12, 0x02]);
    sendcmd(cmd);
}


//====================================================================================RGB控制按键==================================
//发送数据处理函数：RGBLIGHT_TOGGLE
async function RGBLIGHT_TOGGLE() {
    cmd = new Uint8Array([0x02, 0x05, 0x00]);
    sendcmd(cmd);
}

//发送数据处理函数：RGBLIGHT_MODE_INCREASE
async function RGBLIGHT_MODE_INCREASE() {
    cmd = new Uint8Array([0x02, 0x05, 0x01]);
    sendcmd(cmd);
}

//发送数据处理函数：RGBLIGHT_MODE_DECREASE
async function RGBLIGHT_MODE_DECREASE() {
    cmd = new Uint8Array([0x02, 0x05, 0x02]);
    sendcmd(cmd);
}

//发送数据处理函数：RGBLIGHT_HUE_INCREASE
async function RGBLIGHT_HUE_INCREASE() {
    cmd = new Uint8Array([0x02, 0x05, 0x03]);
    sendcmd(cmd);
}

//发送数据处理函数：RGBLIGHT_HUE_DECREASE
async function RGBLIGHT_HUE_DECREASE() {
    cmd = new Uint8Array([0x02, 0x05, 0x04]);
    sendcmd(cmd);
}

//发送数据处理函数：RGBLIGHT_SAT_INCREASE
async function RGBLIGHT_SAT_INCREASE() {
    cmd = new Uint8Array([0x02, 0x05, 0x05]);
    sendcmd(cmd);
}

//发送数据处理函数：RGBLIGHT_SAT_DECREASE
async function RGBLIGHT_SAT_DECREASE() {
    cmd = new Uint8Array([0x02, 0x05, 0x06]);
    sendcmd(cmd);
}

//发送数据处理函数：RGBLIGHT_VAL_INCREASE
async function RGBLIGHT_VAL_INCREASE() {
    cmd = new Uint8Array([0x02, 0x05, 0x07]);
    sendcmd(cmd);
}

//发送数据处理函数：RGBLIGHT_VAL_DECREASE
async function RGBLIGHT_VAL_DECREASE() {
    cmd = new Uint8Array([0x02, 0x05, 0x08]);
    sendcmd(cmd);
}

//=========================================================================模式控制按钮===============================================
//发送数据处理函数：SWITCH_USB
async function SWITCH_USB() {
    cmd = new Uint8Array([0x02, 0x01, 0x00]);
    sendcmd(cmd);
}

//发送数据处理函数：SWITCH_ESB
async function SWITCH_ESB() {
    cmd = new Uint8Array([0x02, 0x13, 0x00]);
    sendcmd(cmd);
}

//发送数据处理函数：SWITCH_BLE
async function SWITCH_BLE() {
    cmd = new Uint8Array([0x02, 0x13, 0x01]);
    sendcmd(cmd);
}

//发送数据处理函数：SWITCH_ESB_TX
async function SWITCH_ESB_TX() {
    cmd = new Uint8Array([0x02, 0x14, 0x00]);
    sendcmd(cmd);
}

//发送数据处理函数：SWITCH_ESB_RX
async function SWITCH_ESB_RX() {
    cmd = new Uint8Array([0x02, 0x14, 0x01]);
    sendcmd(cmd);
}

//发送数据处理函数：READV
async function READV() {
    cmd = new Uint8Array([0x02, 0x01, 0x0B]);
    sendcmd(cmd);
}

//发送数据处理函数：REBOND
async function REBOND() {
    cmd = new Uint8Array([0x02, 0x01, 0x07]);
    sendcmd(cmd);
}

//发送数据处理函数：SWITCH_BT1
async function SWITCH_BT1() {
    cmd = new Uint8Array([0x02, 0x01, 0x08]);
    sendcmd(cmd);
}

//发送数据处理函数：SWITCH_BT2
async function SWITCH_BT2() {
    cmd = new Uint8Array([0x02, 0x01, 0x09]);
    sendcmd(cmd);
}

//发送数据处理函数：SWITCH_BT3
async function SWITCH_BT3() {
    cmd = new Uint8Array([0x02, 0x01, 0x0A]);
    sendcmd(cmd);
}

//==========================层操作===============================
//发送数据处理函数：LAYER1
async function defaultlayer1() {
    cmd = new Uint8Array([0x02, 0x12, 0x03]);
    sendcmd(cmd);
}

//发送数据处理函数：LAYER2
async function defaultlayer2() {
    cmd = new Uint8Array([0x02, 0x12, 0x04]);
    sendcmd(cmd);
}

//发送数据处理函数：LAYER3
async function defaultlayer3() {
    cmd = new Uint8Array([0x02, 0x12, 0x05]);
    sendcmd(cmd);
}

//发送数据处理函数：LAYER4
async function defaultlayer4() {
    cmd = new Uint8Array([0x02, 0x12, 0x06]);
    sendcmd(cmd);
}

//发送数据处理函数：LAYER5
async function defaultlayer5() {
    cmd = new Uint8Array([0x02, 0x12, 0x07]);
    sendcmd(cmd);
}

//发送数据处理函数：LAYER6
async function defaultlayer6() {
    cmd = new Uint8Array([0x02, 0x12, 0x08]);
    sendcmd(cmd);
}

//发送数据处理函数：LAYER7
async function defaultlayer7() {
    cmd = new Uint8Array([0x02, 0x12, 0x09]);
    sendcmd(cmd);
}

//发送数据处理函数：LAYER8
async function defaultlayer8() {
    cmd = new Uint8Array([0x02, 0x12, 0x0A]);
    sendcmd(cmd);
}