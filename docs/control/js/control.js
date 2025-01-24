// 是否启用日志输出
let Logenable = true;
// 是否刷新
//let refreshing = false;
let device_opened = false;
let layer = 1;
let info;
var s_device;
var is_receiver = false;
var cmsisdap = false;
const COMMAND_TIMEOUT = 100; // 命令超时时间（毫秒）
const reportId = 0x3f;
const commandPromises = new Map();


//设置过滤器
const filters = [
    {
        vendorId: 0x4366, // 接收器,必须放在首位
        productId: 0x1024, //
        usagePage: 0xffea,
        usage: 0x0072,
        productName: "Receiver"
    },
    {
        vendorId: 0x1209, //键盘
        productId: 0x0514,
        usagePage: 0xffea,
        usage: 0x0072,
    }
];

function checkFilters(device) {
    for (let i = 0; i < filters.length; i++) {
        const filter = filters[i];
        if (device.collections.length) {
            if (device.vendorId == filter.vendorId &&
                device.productId == filter.productId &&
                device.collections[0].usagePage == filter.usagePage &&
                device.collections[0].usage == filter.usage) {
                return true; // 符合过滤器要求
            }
        }
    }
    return false; // 不符合任何过滤器要求
}

function check_receiver(device) {
    if (device.collections.length) {
        if (device.vendorId == filters[0].vendorId &&
            device.productId == filters[0].productId &&
            device.collections[0].usagePage == filters[0].usagePage &&
            device.collections[0].usage == filters[0].usage &&
            device.productName.includes(filters[0].productName)) {
            consolelog("设备为接收器！");
            return true; // 符合过滤器要求
        }
    }
    return false; // 不符合任何过滤器要求
}

//设备信息表 定义设备数组及其供应商ID 和产品ID
const devices = [
    { name: 'BLE60 D', vendor: 0x4366, product: 0x0311, version: 0x0000 },
    { name: 'Omega45 C', vendor: 0x4366, product: 0x0312, version: 0x0002 },
    { name: 'Omega45 D', vendor: 0x4366, product: 0x0312, version: 0x0001 },
    { name: 'Farad69 A', vendor: 0x4366, product: 0x0313, version: 0x0000 },
    { name: 'Omega50 A', vendor: 0x4366, product: 0x0314, version: 0x0000 },
    { name: 'BLE60 E', vendor: 0x4366, product: 0x0315, version: 0x00 },
    { name: 'Farad69 B', vendor: 0x4366, product: 0x0316, version: 0x0000 },
    { name: 'Omega64', vendor: 0x4366, product: 0x0317, version: 0x0000 },
    { name: 'Omega84', vendor: 0x4366, product: 0x0318, version: 0x0000 },
    { name: 'Newhope64 A', vendor: 0x4366, product: 0x0319, version: 0x0000 },
    { name: 'GTPAD A', vendor: 0x4366, product: 0x031A, version: 0x0000 },
    { name: 'GTPAD B', vendor: 0x4366, product: 0x031A, version: 0x0001 },
    { name: 'GTPAD C', vendor: 0x4366, product: 0x031A, version: 0x0002 },
    { name: 'GTPAD D', vendor: 0x4366, product: 0x031A, version: 0x0003 },
    { name: 'BLE60 F', vendor: 0x4366, product: 0x031B, version: 0x0000 },
    { name: 'BLE60 G', vendor: 0x4366, product: 0x031B, version: 0x0001 },
    { name: 'Omega50 B', vendor: 0x4366, product: 0x031C, version: 0x0000 },
    { name: 'Omega50 C', vendor: 0x4366, product: 0x031C, version: 0x0001 },
    { name: 'Farad69 C', vendor: 0x4366, product: 0x031D, version: 0x0000 },
    { name: 'Farad69 D', vendor: 0x4366, product: 0x031D, version: 0x0001 },
    { name: 'Omega45 E', vendor: 0x4366, product: 0x031E, version: 0x0000 },
    { name: 'Omega45 F', vendor: 0x4366, product: 0x031E, version: 0x0001 },
    { name: 'Planck A', vendor: 0x4366, product: 0x031F, version: 0x0000 },
    { name: 'Omega40 A', vendor: 0x4366, product: 0x0320, version: 0x0000 },
    { name: 'Volta9', vendor: 0x4366, product: 0x0321, version: 0x0000 },
    { name: 'Newhope64 B', vendor: 0x4366, product: 0x0322, version: 0x0000 },
    { name: 'Planck B', vendor: 0x4366, product: 0x0323, version: 0x0000 },
    { name: 'HAL67 A', vendor: 0x4366, product: 0x0324, version: 0x0000 },
    { name: '2.4G接收器', vendor: 0x4366, product: 0x0500, version: 0x0000 },
];

const CMD = {
    // 获取键盘信息
    HID_CMD_GET_INFORMATION: 0x20,
    // 获取单个按键键值
    HID_CMD_GET_SINGLE_KEY: 0x21,
    // 获取单个Fn的功能
    HID_CMD_GET_SINGLE_FN: 0x22,
    // 获取所有键值
    HID_CMD_GET_ALL_KEYS: 0x23,
    // 获取所有Fn功能
    HID_CMD_GET_ALL_FNS: 0x24,
    // 获取指定的配置项目的值
    HID_CMD_GET_SINGLE_CONFIG: 0x25,
    // 获取所有配置项目的值
    HID_CMD_GET_ALL_CONFIG: 0x26,
    // 获取所有宏的值
    HID_CMD_GET_ALL_MACRO: 0x27,

    // 设置单个按键键值
    HID_CMD_SET_SINGLE_KEY: 0x31,
    // 设置单个Fn功能
    HID_CMD_SET_SINGLE_FN: 0x32,
    // 设置所有键值
    HID_CMD_SET_ALL_KEYS: 0x33,
    // 设置所有Fn值
    HID_CMD_SET_ALL_FNS: 0x34,
    // 设置指定的配置项目的值
    HID_CMD_SET_SINGLE_CONFIG: 0x35,
    // 设置所有配置项目的值
    HID_CMD_SET_ALL_CONFIG: 0x36,
    // 设置所有宏的值
    HID_CMD_SET_ALL_MACRO: 0x37,

    // 放弃当前设置还未写入存储的数据
    HID_CMD_READ_CONFIG: 0x3D,
    // 将数据写入存储
    HID_CMD_WRITE_CONFIG: 0x3E,
    // 重置键盘
    HID_CMD_RESET_CONFIG: 0x3F,
    // 设置/获取当前层
    HID_CMD_ABOUT_LAYER: 0x40,
    // 执行 Action Code
    HID_CMD_EXECUTE_ACTION_CODE: 0x41,
    // 获取电量信息
    HID_CMD_GET_BATTERY_INFO: 0x42,
    // 获取/设置 USB 状态
    HID_CMD_ABOUT_USB: 0x43,
    // 获取/设置蓝牙状态
    HID_CMD_ABOUT_BLE: 0x44,
    // 获取/设置ESB状态
    HID_CMD_ABOUT_ESB: 0x45,
    // 获取当前输出模式
    HID_CMD_ABOUT_MODE: 0x80,
    // 获取接收器信息
    HID_CMD_GET_ESB_RX_INFO: 0x81,
    // 重置接收器模式配置
    HID_CMD_RESET_ESB_RX_CONFIG: 0x82,
    // 获取 接收器 信息
    HID_CMD_GET_RECEIVER_INFORMATION: 0xA0,
    // 获取 接收器 运行信息
    HID_CMD_GET_RECEIVER_RUN_INFORMATION: 0xA1,
    // 重置 接收器 信息
    HID_CMD_RESET_RECEIVER_CONFIG: 0xA2,
    // 进入USBISP
    HID_CMD_ENTER_USBISP: 0xF1,
    // 进入CMSIS-DAP
    HID_CMD_ENTER_CMSISDAP: 0xF2,
    // 禁用CMSIS-DAP
    HID_CMD_DISABLE_CMSISDAP: 0xF3,
};


//===================== 通知权限部分======================

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

// 创建Broadcast Channel并监听发送给它的消息
const broadcast = new BroadcastChannel('sw-update-channel');
broadcast.onmessage = (event) => {
    let UpdateElement = document.getElementById('update');
    if (event.data && event.data.type === 'CRITICAL_SW_UPDATE') {
        // 显示更新按钮
        console.log('有新版本，点击更新');
        UpdateElement.style.display = 'block';
    }
    if (event.data && event.data.type === 'HIDE_UPDATE_BUTTON') {
        // 隐藏更新按钮
        console.log('更新完成');
        UpdateElement.style.display = 'none';
        window.location.reload();
    }
};

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
    document.getElementById(tabName).style.display = "flex"; // 显示选中的标签页内容
    evt.currentTarget.className += " active"; // 为选中的标签页按钮添加激活状态
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

function update() {
    console.log("开始更新");
    broadcast.postMessage({ type: 'SKIP_WAITING' });
}

// 页面加载时应用保存的主题
document.addEventListener("DOMContentLoaded", function () {
    var savedTheme = localStorage.getItem("theme");
    document.getElementsByClassName("tablinks")[0].click();
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
    //updateHeaderStatus('', 'mode-text', '', '输出端');
    //updateHeaderStatus('', 'layer-text', '', '激活层');
    updateHeaderStatus('battery-icon', 'battery-text', 'fas fa-battery-empty', '电量');
    updateHeaderStatus('device-icon', 'device-text', 'fas fa-sign-out-alt', '设备名称');
    document.getElementsByClassName("tablinks")[0].click();
}

//将设备为默认状态
async function default_device_info() {
    document.getElementById('device_name').innerHTML = "";
    document.getElementById('device_mac').innerHTML = "";
    document.getElementById('soc_model').innerHTML = "";
    document.getElementById('firmware_ver').innerHTML = "";
    document.getElementById('firmware_date').innerHTML = "";
    document.getElementById('firmware_date').setAttribute('title', "");
    document.getElementById('receiver_pipe_num').innerHTML = "";
    document.getElementById('receiver_pipe_index').innerHTML = "";
    document.getElementById('receiver_link_channel').innerHTML = "";
    document.getElementById('receiver_link_num').innerHTML = "";
    document.getElementById('receiver_hardware').innerHTML = "";
    document.getElementById('receiver_firmware').innerHTML = "";
    document.getElementById('receiver_firmware').setAttribute('title', "");
}

async function CheckCMSISDAP() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if ((devices_list[i].productName == "CMSIS-DAP") && (devices_list[i].productId == "0x1024") && (devices_list[i].vendorId == "0x4366")) {
            document.getElementsByName('entercmsisdap')[0].innerHTML = "禁用CMSSIS-DAP"
            document.getElementById('cmsis-dap').style.display = 'block';
            cmsisdap = true;
            return null;
        }
    }
    //如果没有找到CMSIS-DAP，则隐藏CMSIS-DAP警示信息，并显示为启用CMSIS-DAP按钮
    document.getElementsByName('entercmsisdap')[0].innerHTML = "启用CMSSIS-DAP"
    document.getElementById('cmsis-dap').style.display = 'none';
    cmsisdap = false;
}

function consolelog(Logtxt, ...args) {
    if (Logenable) {
        console.log(Logtxt, ...args);
    }
}

//=======================================================================监听器部分=====================
document.addEventListener('DOMContentLoaded', async () => {

    //==========================获取元素====================
    document.getElementsByName('grantdevice')[0].addEventListener('click', GrantDevice); //授权设备
    document.getElementsByName('systemoff')[0].addEventListener('click', SYSTEMOFF); //授权设备
    document.getElementsByName('sleep')[0].addEventListener('click', SLEEP); //授权设备
    document.getElementsByName('indicatorlight')[0].addEventListener('click', TOGGLE_INDICATOR_LIGHT); //授权设备
    document.getElementsByName('bootcheck')[0].addEventListener('click', BOOTCHECK); //授权设备
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
    consolelog("DOMContentLoaded");
    //DOM加载，获取已授权设备列表，并打开设备
    const devices_list = await navigator.hid.getDevices();
    if (devices_list.length) {
        for (var i = 0; i < devices_list.length; i++) {
            if (checkFilters(devices_list[i])) {
                consolelog(`重连设备: ${devices_list[i].productName}`, devices_list[i]);
                OpenDevice(devices_list[i])
                return;
            }
        }
    } else {
        consolelog("No Device online");
    }
});


if ("hid" in navigator) {
    //监听HID授权设备的接入，并连接设备
    navigator.hid.addEventListener('connect', ({ device }) => {
        consolelog(`HID设备连接: ${device.productName}`, device);
        if (checkFilters(device)) {
            OpenDevice(device)
        }
    });

    //监听HID授权设备的断开，并提示
    navigator.hid.addEventListener('disconnect', ({ device }) => {
        consolelog(`HID设备断开: ${device.productName}`, device);
        Check_Opend();
    });
} else {
    console.log("浏览器不支持WebHID");
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
                //断开设备后，重置状态
                device_opened = false;
                is_receiver = false;
                default_status();
                default_device_info();
                //重置完成,隐藏接收器标签
                document.getElementById('receiver-tab').style.display = 'none';
                consolelog("Close Device:", link_devices_list[i]);
            }
        }
    }
    //遍历设备，并打开符合条件的设备
    for (var i = 0; i < devices_list.length; i++) {
        if (!device_opened) {
            OpenDevice(devices_list[i]);
            consolelog("Grant Device:", devices_list[i]);
            return null;
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
    consolelog("ListDevices", devices_list);
}

//连接设备【先授权，后连接GT 2.4G Receiver】
async function OpenDevice(opendevice) {
    if (!device_opened) {
        try {
            await opendevice.open();
            s_device = opendevice;  // 存储打开的设备
            consolelog("Open Device:", opendevice);
            device_opened = true;

            if (check_receiver(opendevice)) {
                is_receiver = true;
                document.getElementById('receiver-tab').style.display = 'block';
            }

            opendevice.oninputreport = ({ device, reportId, data }) => {
                //consolelog('Received data:', data);

                // 根据收到的数据找到对应的命令Promise并解析它
                for (const [command, resolve] of commandPromises) {
                    handleResponse(command, data, resolve);
                    commandPromises.delete(command);
                    break; // 假设每次只会有一个命令的响应
                }
            };

            await GetKeyboardInfo();
            await CheckCMSISDAP();
            // refreshdata();

        } catch (error) {
            console.error('Failed to open device:', error);
            default_status();
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
            s_device = null;
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

function formatHex(value) {
    // 将整数转换为十六进制字符串
    let hexString = value.toString(16).toUpperCase();

    // 如果转换后的十六进制字符串长度小于4，则在前面补0以达到4位长度
    if (hexString.length < 4) {
        hexString = '0'.repeat(4 - hexString.length) + hexString;
    }

    // 添加0x前缀
    return '0x' + hexString;
}

function getDeviceName(vendorId, productId, versionID) {
    for (const device of devices) {
        if (device.vendor === vendorId && device.product === productId && device.version === versionID) {
            return device.name;
        }
    }
    return 'UNKNOW';
}
async function GetKeyboardInfo() {
    if (s_device.opened) {
        await GetInfo(s_device, CMD.HID_CMD_GET_INFORMATION);
        await GetSubInfo(s_device, CMD.HID_CMD_GET_INFORMATION);
        await GetInfo(s_device, CMD.HID_CMD_GET_BATTERY_INFO);
        if (is_receiver) {
            await GetInfo(s_device, CMD.HID_CMD_GET_RECEIVER_INFORMATION);
        }
    }
}

//发送数据处理函数：获取键盘信息
function GetInfo(device, command) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            commandPromises.delete(command);
            reject(new Error('Timeout: No response received'));
        }, COMMAND_TIMEOUT); // 设置超时时间

        device.sendReport(reportId, new Uint8Array([command, 0x00])).then(() => {
            consolelog('GetInfo:', command);
            const commandPromise = new Promise((innerResolve) => {
                commandPromises.set(command, (data) => {
                    clearTimeout(timeout);
                    innerResolve(data);
                });
            });
            resolve(commandPromise);
        }).catch(error => {
            clearTimeout(timeout);
            reject(error);
        });
    });
}

function GetSubInfo(device, command) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            commandPromises.delete(command);
            reject(new Error('Timeout: No response received'));
        }, COMMAND_TIMEOUT); // 设置超时时间

        device.sendReport(reportId, new Uint8Array([command, 0x01, 0x01])).then(() => {
            consolelog('GetSubInfo:', command);
            const commandPromise = new Promise((innerResolve) => {
                commandPromises.set(command, (data) => {
                    clearTimeout(timeout);
                    innerResolve(data);
                });
            });
            resolve(commandPromise);
        }).catch(error => {
            clearTimeout(timeout);
            reject(error);
        });
    });
}

async function GetBatteryInfo() {
    if (s_device.opened) {
        return new Promise(async (resolve, reject) => {
            const timeout = setTimeout(() => {
                commandPromises.delete(CMD.HID_CMD_GET_BATTERY_INFO);
                reject(new Error('Timeout: No response received'));
            }, COMMAND_TIMEOUT); // 设置超时时间

            await s_device.sendReport(reportId, new Uint8Array([CMD.HID_CMD_GET_BATTERY_INFO, 0x00])).then(() => {
                consolelog('GetBatteryInfo:', s_device, CMD.HID_CMD_GET_BATTERY_INFO);
                const commandPromise = new Promise((innerResolve) => {
                    commandPromises.set(CMD.HID_CMD_GET_BATTERY_INFO, (data) => {
                        clearTimeout(timeout);
                        innerResolve(data);
                    });
                });
                resolve(commandPromise);
            }).catch(error => {
                clearTimeout(timeout);
                reject(error);
            });
        });
    }
}

async function GetRXInfo() {
    if (s_device.opened) {
        return new Promise(async (resolve, reject) => {
            const command = is_receiver ? CMD.HID_CMD_GET_RECEIVER_RUN_INFORMATION : CMD.HID_CMD_GET_ESB_RX_INFO;
            const timeout = setTimeout(() => {
                commandPromises.delete(command);
                reject(new Error('Timeout: No response received'));
            }, COMMAND_TIMEOUT); // 设置超时时间

            await s_device.sendReport(reportId, new Uint8Array([command, 0x00])).then(() => {
                consolelog('GetRXInfo:', s_device, command);
                const commandPromise = new Promise((innerResolve) => {
                    commandPromises.set(command, (data) => {
                        clearTimeout(timeout);
                        innerResolve(data);
                    });
                });
                resolve(commandPromise);
            }).catch(error => {
                clearTimeout(timeout);
                reject(error);
            });
        });
    }
}

async function GetModeInfo() {
    if (s_device.opened) {
        return new Promise(async (resolve, reject) => {
            const timeout = setTimeout(() => {
                commandPromises.delete(CMD.HID_CMD_ABOUT_MODE);
                reject(new Error('Timeout: No response received'));
            }, COMMAND_TIMEOUT); // 设置超时时间

            await s_device.sendReport(reportId, new Uint8Array([CMD.HID_CMD_ABOUT_MODE, 0x00])).then(() => {
                consolelog('GetModeInfo:', s_device, CMD.HID_CMD_ABOUT_MODE);
                const commandPromise = new Promise((innerResolve) => {
                    commandPromises.set(CMD.HID_CMD_ABOUT_MODE, (data) => {
                        clearTimeout(timeout);
                        innerResolve(data);
                    });
                });
                resolve(commandPromise);
            }).catch(error => {
                clearTimeout(timeout);
                reject(error);
            });
        });
    }
}

async function GetLayerInfo() {
    if (s_device.opened) {
        return new Promise(async (resolve, reject) => {
            const timeout = setTimeout(() => {
                commandPromises.delete(CMD.HID_CMD_ABOUT_LAYER);
                reject(new Error('Timeout: No response received'));
            }, COMMAND_TIMEOUT); // 设置超时时间

            await s_device.sendReport(reportId, new Uint8Array([CMD.HID_CMD_ABOUT_LAYER, 0x00])).then(() => {
                consolelog('GetLayerInfo:', s_device, CMD.HID_CMD_ABOUT_LAYER);
                const commandPromise = new Promise((innerResolve) => {
                    commandPromises.set(CMD.HID_CMD_ABOUT_LAYER, (data) => {
                        clearTimeout(timeout);
                        innerResolve(data);
                    });
                });
                resolve(commandPromise);
            }).catch(error => {
                clearTimeout(timeout);
                reject(error);
            });
        });
    }
}


function CleanReceiverDate() {
    if (s_device.opened) {
        s_device.sendReport(reportId, new Uint8Array([CMD.HID_CMD_RESET_RECEIVER_CONFIG, 0x00])).then(() => {
            consolelog('CleanReceiverDate:', s_device, CMD.HID_CMD_RESET_RECEIVER_CONFIG);
        }).catch(error => {
            reject(error);
        });
    }
}

function ResetKeyboard() {
    if (s_device.opened) {
        s_device.sendReport(reportId, new Uint8Array([CMD.HID_CMD_RESET_CONFIG, 0x01, 0x0F])).then(() => {
            consolelog('ResetKeyboard:', s_device, CMD.HID_CMD_RESET_CONFIG);
        }).catch(error => {
            reject(error);
        });
    }
}

function EnterUSBISP() {
    if (s_device.opened) {
        s_device.sendReport(reportId, new Uint8Array([CMD.HID_CMD_ENTER_USBISP, 0x00])).then(() => {
            consolelog('EnterUSBISP:', s_device, CMD.HID_CMD_ENTER_USBISP);
        }).catch(error => {
            reject(error);
        });
    }
}

function EnterCMSISDAP() {
    if (s_device.opened && cmsisdap) {
        s_device.sendReport(reportId, new Uint8Array([CMD.HID_CMD_DISABLE_CMSISDAP, 0x00])).then(() => {
            consolelog('DISABLECMSISDAP:', s_device, CMD.HID_CMD_DISABLE_CMSISDAP);
        }).catch(error => {
            reject(error);
        });
    }
    if (s_device.opened && !cmsisdap) {
        s_device.sendReport(reportId, new Uint8Array([CMD.HID_CMD_ENTER_CMSISDAP, 0x00])).then(() => {
            consolelog('EnterCMSISDAP:', s_device, CMD.HID_CMD_ENTER_CMSISDAP);
        }).catch(error => {
            reject(error);
        });
    }
}

//检测是否打开设备
async function Check_Opend() {
    const devices_list = await navigator.hid.getDevices();
    device_opened = false;
    for (var i = 0; i < devices_list.length; i++) {
        // 有设备打开状态，设定已有设备打开标识
        if (devices_list[i].opened) {
            device_opened = true;
        }
    }
    if (!device_opened) {
        //所有设备断开，停掉定时刷新任务
        clearInterval(info);
        //停止刷新
        //refreshing = false;
        s_device = null;
        document.getElementById('receiver-tab').style.display = 'none';
        document.getElementById('cmsis-dap').style.display = 'none';
        //恢复状态栏
        default_status();
        default_device_info();
        consolelog("No Device Connected");
    }
}
//============================================================================页面更新=========================================================
function handleResponse(command, data, resolve) {
    switch (command) {
        case CMD.HID_CMD_GET_INFORMATION:
            const inputdata = new Uint8Array(data.buffer);
            if (inputdata[1] == 8) {
                update_device_subinfo(data);
            } else {
                update_device_info(data);
            }
            break;
        case CMD.HID_CMD_GET_RECEIVER_INFORMATION:
            update_receiver_info(data);
            break;
        case CMD.HID_CMD_GET_BATTERY_INFO:
            update_statebar_battery(data);
            break;
        case CMD.HID_CMD_GET_ESB_RX_INFO:
            update_device_esb_rx_info(data);
            break;
        case CMD.HID_CMD_GET_RECEIVER_RUN_INFORMATION:
            update_receiver_run_info(data);
            break;
        case CMD.HID_CMD_ABOUT_MODE:
            update_device_mode(data);
            break;
        case CMD.HID_CMD_ABOUT_LAYER:
            update_device_layer(data);
            break;
        case CMD.HID_CMD_EXECUTE_ACTION_CODE:
            if (data[0] == 0) {
                consolelog('Action Code Executed');
            }
            break;
        default:
            consolelog('Unknown Data');
            break;
    }
    resolve(data);
}


//刷新电池状态
async function update_statebar_battery(data) {
    const inputdata = new Uint8Array(data.buffer);
    if (inputdata[0] == 0 || inputdata[0] == CMD.HID_CMD_GET_BATTERY_INFO) {
        consolelog(`update_statebar_battery:`, inputdata);
        let battery_icon = 'fas fa-battery-full'
        if (inputdata[2] < 90 && inputdata[2] >= 75) {
            battery_icon = 'fas fa-battery-three-quarters'
        } else if (inputdata[2] < 75 && inputdata[2] >= 50) {
            battery_icon = 'fas fa-battery-half'
        } else if (inputdata[2] < 50 && inputdata[2] >= 25) {
            battery_icon = 'fas fa-battery-quarter'
        } else if (inputdata[2] < 25) {
            battery_icon = 'fas fa-battery-empty'
        }
        updateHeaderStatus('battery-icon', 'battery-text', battery_icon, inputdata[2].toLocaleString() + '%');
    }
}
async function update_device_info(data) {
    const inputdata = new Uint8Array(data.buffer);
    if (inputdata[0] == 0 || inputdata[0] == CMD.HID_CMD_GET_INFORMATION) {
        consolelog(`update_device_info:`, inputdata);
        //data
        const timestamp = data.getUint32(12, true); // 使用true表示小端字节序（如果适用）
        const date = new Date(timestamp * 1000); // 转换为毫秒并创建Date对象
        const formattedDate = date.toLocaleDateString(); // 使用内置方法格式化日期
        document.getElementById('firmware_date').innerHTML = formattedDate;
        document.getElementById('firmware_date').setAttribute('title', date.toLocaleString());
        //name
        const vendorId = parseInt(formatHex(data.getUint16(2, true)));
        const productId = parseInt(formatHex(data.getUint16(4, true)));
        const versionID = parseInt(formatHex(data.getUint8(6)));
        const deviceName = getDeviceName(vendorId, productId, versionID);
        updateHeaderStatus('device-icon', 'device-text', 'fas fa-sign-in-alt', deviceName);
        document.getElementById('device_name').innerHTML = deviceName;
        //firmware
        const firmwarever = data.getUint32(8, 1).toString(16).padStart(8, '0');
        document.getElementById('firmware_ver').innerHTML = firmwarever.toUpperCase();
        //soc
        if (deviceName == '2.4G接收器') {  //兼容接收器芯片信息
            document.getElementById('soc_model').innerHTML = "nRF" + data.getUint32(24, 1).toString(16).padStart(5, '0');
        } else {
            document.getElementById('soc_model').innerHTML = "nRF" + data.getUint32(20, 1).toString(16).padStart(5, '0');
        }


    } else {  //收到键盘接收出错错误的数据包
        console.error('update_device_info：Received an error packet', inputdata);
    }
}

async function update_device_subinfo(data) {
    const inputdata = new Uint8Array(data.buffer);
    if (inputdata[0] == 0 || inputdata[0] == CMD.HID_CMD_GET_INFORMATION) {
        consolelog(`update_device_subinfo:`, inputdata);
        //device_mac
        document.getElementById('device_mac').innerHTML = ("0" + inputdata[5].toString(16).toUpperCase()).slice(-2) + ":" + ("0" + inputdata[4].toString(16).toUpperCase()).slice(-2) + ":" + ("0" + inputdata[3].toString(16).toUpperCase()).slice(-2) + ":" + ("0" + inputdata[2].toString(16).toUpperCase()).slice(-2);


    } else {  //收到键盘接收出错错误的数据包
        console.error('update_device_subinfo：Received an error packet', inputdata);
    }
}


async function update_receiver_info(data) {
    const inputdata = new Uint8Array(data.buffer);
    if (inputdata[0] == 0 || inputdata[0] == CMD.HID_CMD_GET_RECEIVER_INFORMATION) {
        consolelog(`update_receiver_info:`, inputdata);
        //receiver mac
        const firmwarever = data.getUint32(20, 1).toString(16).padStart(8, '0');
        document.getElementById('receiver_hardware').innerHTML = firmwarever.toUpperCase();
        //receiver firmware data
        const timestamp = data.getUint32(12, true); // 使用true表示小端字节序（如果适用）
        const date = new Date(timestamp * 1000); // 转换为毫秒并创建Date对象
        const formattedDate = date.toLocaleDateString(); // 使用内置方法格式化日期
        document.getElementById('receiver_firmware').innerHTML = formattedDate;
        document.getElementById('receiver_firmware').setAttribute('title', date.toLocaleString());
    } else {  //收到键盘接收出错错误的数据包
        console.error('update_receiver_info：Received an error packet', inputdata);
    }
}

async function update_device_mode(data) {
    const inputdata = new Uint8Array(data.buffer);
    if (inputdata[0] == 0 || inputdata[0] == CMD.HID_CMD_ABOUT_MODE) {
        consolelog(`update_device_mode:`, inputdata);
        let mode_info = '输出端'
        if ((inputdata[2] & (1 << 7))) {
            mode_info = 'USB'
        } else if ((inputdata[2] & (1 << 6)) && (inputdata[2] & (1 << 5))) {
            mode_info = '无线接收'
        } else if ((inputdata[2] & (1 << 6)) && !(inputdata[2] & (1 << 5))) {
            if ((inputdata[2] & (1 << 0))) {
                mode_info = '无线一'
            } else if ((inputdata[2] & (1 << 1))) {
                mode_info = '无线二'
            } else if ((inputdata[2] & (1 << 2))) {
                mode_info = '无线三'
            }
        } else if (!(inputdata[2] & (1 << 6))) {
            if ((inputdata[2] & (1 << 0))) {
                mode_info = '蓝牙一'
            } else if ((inputdata[2] & (1 << 1))) {
                mode_info = '蓝牙二'
            } else if ((inputdata[2] & (1 << 2))) {
                mode_info = '蓝牙三'
            }
        }
        document.getElementById('link_mode_info').innerHTML = mode_info;

    } else {  //收到键盘接收出错错误的数据包
        console.error('update_device_mode：Received an error packet', inputdata);
    }
}

async function update_device_layer(data) {
    const inputdata = new Uint8Array(data.buffer);
    if (inputdata[0] == 0 || inputdata[0] == CMD.HID_CMD_ABOUT_LAYER) {
        consolelog(`update_device_layer:`, inputdata);
        document.getElementById('layer_info').innerHTML = findSingleOneBit(inputdata[21] | inputdata[22]) + 1;

    } else {  //收到键盘接收出错错误的数据包
        console.error('update_device_layer：Received an error packet', inputdata);
    }
    /*    if ((findSingleOneBit(inputdata[21] | inputdata[22]) + 1) != layer) {
            layer = (findSingleOneBit(inputdata[21] | inputdata[22]) + 1);
            showNotification('激活层更改', '当前激活层为层' + layer);
        }
    */
}

async function update_device_esb_rx_info(data) {
    const inputdata = new Uint8Array(data.buffer);
    if (inputdata[0] == 0 || inputdata[0] == CMD.HID_CMD_GET_ESB_RX_INFO) {
        consolelog(`update_device_esb_rx_info:`, inputdata);
        //pipe num
        document.getElementById('pipe_num').innerHTML = inputdata[2];
        //pipe index
        document.getElementById('pipe_index').innerHTML = (inputdata[3] / 2).toString(2).padStart(7, "0");
        //link channel
        document.getElementById('link_channel').innerHTML = inputdata[4];
        //link num
        document.getElementById('link_num').innerHTML = inputdata[5];

    } else {  //收到键盘接收出错错误的数据包
        console.error('update_device_esb_rx_info：Received an error packet', inputdata);
    }
}

async function update_receiver_run_info(data) {
    const inputdata = new Uint8Array(data.buffer);
    if (inputdata[0] == 0 || inputdata[0] == CMD.HID_CMD_GET_RECEIVER_RUN_INFORMATION) {
        consolelog(`update_receiver_run_info:`, inputdata);
        //pipe num
        document.getElementById('receiver_pipe_num').innerHTML = inputdata[2];
        //pipe index
        document.getElementById('receiver_pipe_index').innerHTML = (inputdata[3] / 2).toString(2).padStart(7, "0");
        //link channel
        document.getElementById('receiver_link_channel').innerHTML = inputdata[4];
        //link num
        document.getElementById('receiver_link_num').innerHTML = inputdata[5];

    } else {  //收到键盘接收出错错误的数据包
        console.error('update_receiver_run_info：Received an error packet', inputdata);
    }
}

//刷新数据任务
/*
async function refreshdata() {
    if (!refreshing) {
        info = setInterval(GetBatteryInfo, 60000 * 5); //5分钟刷新一次电池电量
        refreshing = true;
    }
}
*/

//====================================================================================键盘控制按键==================================
//发送action命令
async function ExecuteActionCode(data) {
    if (s_device.opened) {
        try {
            const newData = new Uint8Array([CMD.HID_CMD_EXECUTE_ACTION_CODE, ...data]); // 创建一个新数组，包含0x40和原数组的所有元素
            await s_device.sendReport(reportId, newData);
            consolelog('SendReport:', s_device, newData);
        } catch (error) {
            console.error('SendReport: Failed:', error);
        }
        return;
    }
}


//发送数据处理函数：SYSTEMOFF
function SYSTEMOFF() {
    ExecuteActionCode([0x02, 0x12, 0x00]);
}

//发送数据处理函数：SLEEP
function SLEEP() {
    ExecuteActionCode([0x02, 0x00, 0x00]);
}

//发送数据处理函数：TOGGLE_INDICATOR_LIGHT
function TOGGLE_INDICATOR_LIGHT() {
    ExecuteActionCode([0x02, 0x12, 0x01]);
}

//发送数据处理函数：BOOTCHECK
function BOOTCHECK() {
    ExecuteActionCode([0x02, 0x12, 0x02]);
}


//====================================================================================RGB控制按键==================================
//发送数据处理函数：RGBLIGHT_TOGGLE
function RGBLIGHT_TOGGLE() {
    ExecuteActionCode([0x02, 0x05, 0x00]);
}

//发送数据处理函数：RGBLIGHT_MODE_INCREASE
function RGBLIGHT_MODE_INCREASE() {
    ExecuteActionCode([0x02, 0x05, 0x01]);
}

//发送数据处理函数：RGBLIGHT_MODE_DECREASE
function RGBLIGHT_MODE_DECREASE() {
    ExecuteActionCode([0x02, 0x05, 0x02]);
}

//发送数据处理函数：RGBLIGHT_HUE_INCREASE
function RGBLIGHT_HUE_INCREASE() {
    ExecuteActionCode([0x02, 0x05, 0x03]);
}

//发送数据处理函数：RGBLIGHT_HUE_DECREASE
function RGBLIGHT_HUE_DECREASE() {
    ExecuteActionCode([0x02, 0x05, 0x04]);
}

//发送数据处理函数：RGBLIGHT_SAT_INCREASE
function RGBLIGHT_SAT_INCREASE() {
    ExecuteActionCode([0x02, 0x05, 0x05]);
}

//发送数据处理函数：RGBLIGHT_SAT_DECREASE
function RGBLIGHT_SAT_DECREASE() {
    ExecuteActionCode([0x02, 0x05, 0x06]);
}

//发送数据处理函数：RGBLIGHT_VAL_INCREASE
function RGBLIGHT_VAL_INCREASE() {
    ExecuteActionCode([0x02, 0x05, 0x07]);
}

//发送数据处理函数：RGBLIGHT_VAL_DECREASE
function RGBLIGHT_VAL_DECREASE() {
    ExecuteActionCode([0x02, 0x05, 0x08]);
}

//=========================================================================模式控制按钮===============================================
//发送数据处理函数：SWITCH_USB
function SWITCH_USB() {
    ExecuteActionCode([0x02, 0x01, 0x00]);
    setTimeout(GetModeInfo, 1000); // 延迟1秒执行GetModeInfo
}

//发送数据处理函数：SWITCH_ESB
function SWITCH_ESB() {
    ExecuteActionCode([0x02, 0x13, 0x00]);
    setTimeout(GetModeInfo, 1000); // 延迟1秒执行GetModeInfo
}

//发送数据处理函数：SWITCH_BLE
function SWITCH_BLE() {
    ExecuteActionCode([0x02, 0x13, 0x01]);
    setTimeout(GetModeInfo, 1000); // 延迟1秒执行GetModeInfo
}

//发送数据处理函数：SWITCH_ESB_TX
function SWITCH_ESB_TX() {
    ExecuteActionCode([0x02, 0x14, 0x00]);
    setTimeout(GetModeInfo, 1000); // 延迟1秒执行GetModeInfo
}

//发送数据处理函数：SWITCH_ESB_RX
function SWITCH_ESB_RX() {
    ExecuteActionCode([0x02, 0x14, 0x01]);
    setTimeout(GetModeInfo, 1000); // 延迟1秒执行GetModeInfo
}

//发送数据处理函数：READV
function READV() {
    ExecuteActionCode([0x02, 0x01, 0x0B]);
}

//发送数据处理函数：REBOND
function REBOND() {
    ExecuteActionCode([0x02, 0x01, 0x07]);
}

//发送数据处理函数：SWITCH_BT1
function SWITCH_BT1() {
    ExecuteActionCode([0x02, 0x01, 0x08]);
    setTimeout(GetModeInfo, 1000); // 延迟1秒执行GetModeInfo
}

//发送数据处理函数：SWITCH_BT2
function SWITCH_BT2() {
    ExecuteActionCode([0x02, 0x01, 0x09]);
    setTimeout(GetModeInfo, 1000); // 延迟1秒执行GetModeInfo
}

//发送数据处理函数：SWITCH_BT3
function SWITCH_BT3() {
    ExecuteActionCode([0x02, 0x01, 0x0A]);
    setTimeout(GetModeInfo, 1000); // 延迟1秒执行GetModeInfo
}

//==========================层操作===============================
//发送数据处理函数：LAYER1
function defaultlayer1() {
    ExecuteActionCode([0x02, 0x12, 0x03]);
}

//发送数据处理函数：LAYER2
function defaultlayer2() {
    ExecuteActionCode([0x02, 0x12, 0x04]);
}

//发送数据处理函数：LAYER3
function defaultlayer3() {
    ExecuteActionCode([0x02, 0x12, 0x05]);
}

//发送数据处理函数：LAYER4
function defaultlayer4() {
    ExecuteActionCode([0x02, 0x12, 0x06]);
}

//发送数据处理函数：LAYER5
function defaultlayer5() {
    ExecuteActionCode([0x02, 0x12, 0x07]);
}

//发送数据处理函数：LAYER6
function defaultlayer6() {
    ExecuteActionCode([0x02, 0x12, 0x08]);
}

//发送数据处理函数：LAYER7
function defaultlayer7() {
    ExecuteActionCode([0x02, 0x12, 0x09]);
}

//发送数据处理函数：LAYER8
function defaultlayer8() {
    ExecuteActionCode([0x02, 0x12, 0x0A]);
}

//=============================无线接收器控制================================

