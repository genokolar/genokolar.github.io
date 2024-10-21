var LINKCTRLElement = document.getElementById('Tab2');

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
document.addEventListener("DOMContentLoaded", function() {
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

// 默认打开第一个标签页
document.addEventListener("DOMContentLoaded", function() {
    var firstTabLink = document.getElementsByClassName("tablinks")[0];
    if (firstTabLink) {
        firstTabLink.click();
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


//设置过滤器
const filters = [{
    vendorId: 0x1209, // GT
    productId: 0x0514, // GT
}];

var info;
const reportId = 0x3f;


//============================================连接键盘=========================================================
//授权设备
async function GrantDevice() {
    let devices_list = await navigator.hid.requestDevice({
        filters
    });
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].productName.includes("Lotlab")) {
            console.log("GrantDevice():", devices_list[i]);
            OpenDevice().then(GetKeyboardInfo);
            refreshdata();
            return null;
        }
        if (devices_list[i].productName == "") {
            console.log("GrantDevice():", devices_list[i]);
            OpenDevice().then(GetKeyboardInfo);
            refreshdata();
            return null;
        }
    }
}


//列出设备
async function ListDevices() {
    const devices_list = await navigator.hid.getDevices();
    if (!devices_list.length) {
        console.log("No Device Connected");
        return null;
    }
    console.log("ListDevices():", devices_list);
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].productName.includes("Lotlab") || (devices_list[i].productName == "")) {}
    }
}

//连接设备【先授权，后连接GT 2.4G Receiver】
async function OpenDevice() {
    const devices_list = await navigator.hid.getDevices();
    if (!devices_list.length) {
        console.log("No Device Connected");
        updateHeaderStatus('link-icon', 'link-text', 'fas fa-unlink', '未连接');
        return null;
    } else {
        for (var i = 0; i < devices_list.length; i++) {
            if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
                updateHeaderStatus('link-icon', 'link-text', 'fas fa-link', '有线已连接');
                return devices_list[i];
            } else if (devices_list[i].opened && devices_list[i].productName == "") {
                updateHeaderStatus('link-icon', 'link-text', 'fas fa-link', '无线已连接');
                return devices_list[i];
            } else if (devices_list[i].productName.includes("Lotlab")) {
                await devices_list[i].open();
                // 显示RGB控制元素
                LINKCTRLElement.style.display = 'block';
                console.log("OpenDevice():", devices_list[i]);
            } else if (devices_list[i].productName == "") {
                await devices_list[i].open();
                // 隐藏RGB控制元素
                LINKCTRLElement.style.display = 'none';
                console.log("OpenDevice():", devices_list[i]);
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
            console.log("CloseDevice():", devices_list[i]);
            //document.getElementById('consoleinfo').innerHTML += "断开设备:" + devices_list[i].productName + '<br>';
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//====================================================================================键盘控制按键==================================
//发送数据处理函数：SYSTEMOFF
async function SYSTEMOFF() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x12, 0x00]);
            await senddata(devices_list[i], outputReportData);
            console.log("SYSTEMOFF", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x12, 0x00]);
            await senddata(devices_list[i], outputReportData);
            console.log("SYSTEMOFF", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：TOGGLE_INDICATOR_LIGHT
async function TOGGLE_INDICATOR_LIGHT() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x12, 0x01]);
            await senddata(devices_list[i], outputReportData);
            console.log("TOGGLE_INDICATOR_LIGHT", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x12, 0x01]);
            await senddata(devices_list[i], outputReportData);
            console.log("TOGGLE_INDICATOR_LIGHT", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：BOOTCHECK
async function BOOTCHECK() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x12, 0x02]);
            await senddata(devices_list[i], outputReportData);
            console.log("BOOTCHECK", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x12, 0x02]);
            await senddata(devices_list[i], outputReportData);
            console.log("BOOTCHECK", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}


//====================================================================================RGB控制按键==================================
//发送数据处理函数：RGBLIGHT_TOGGLE
async function RGBLIGHT_TOGGLE() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x05, 0x00]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_TOGGLE", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x05, 0x00]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_TOGGLE", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：RGBLIGHT_MODE_INCREASE
async function RGBLIGHT_MODE_INCREASE() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x05, 0x01]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_MODE_INCREASE", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x05, 0x01]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_MODE_INCREASE", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：RGBLIGHT_MODE_DECREASE
async function RGBLIGHT_MODE_DECREASE() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x05, 0x02]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_MODE_DECREASE", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x05, 0x02]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_MODE_DECREASE", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：RGBLIGHT_HUE_INCREASE
async function RGBLIGHT_HUE_INCREASE() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x05, 0x03]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_HUE_INCREASE", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x05, 0x03]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_HUE_INCREASE", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：RGBLIGHT_HUE_DECREASE
async function RGBLIGHT_HUE_DECREASE() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x05, 0x04]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_HUE_DECREASE", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x05, 0x04]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_HUE_DECREASE", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：RGBLIGHT_SAT_INCREASE
async function RGBLIGHT_SAT_INCREASE() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x05, 0x05]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_SAT_INCREASE", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x05, 0x05]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_SAT_INCREASE", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：RGBLIGHT_SAT_DECREASE
async function RGBLIGHT_SAT_DECREASE() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x05, 0x06]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_SAT_DECREASE", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x05, 0x06]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_SAT_DECREASE", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：RGBLIGHT_VAL_INCREASE
async function RGBLIGHT_VAL_INCREASE() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x05, 0x07]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_VAL_INCREASE", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x05, 0x07]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_VAL_INCREASE", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：RGBLIGHT_VAL_DECREASE
async function RGBLIGHT_VAL_DECREASE() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x05, 0x08]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_VAL_DECREASE", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x05, 0x08]);
            await senddata(devices_list[i], outputReportData);
            console.log("RGBLIGHT_VAL_DECREASE", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//=========================================================================模式控制按钮===============================================
//发送数据处理函数：SWITCH_ESB
async function SWITCH_ESB() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x13, 0x00]);
            await senddata(devices_list[i], outputReportData);
            console.log("SWITCH_ESB:", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x13, 0x00]);
            await senddata(devices_list[i], outputReportData);
            console.log("SWITCH_ESB:", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：SWITCH_BLE
async function SWITCH_BLE() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x13, 0x01]);
            await senddata(devices_list[i], outputReportData);
            console.log("SWITCH_BLE:", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x13, 0x01]);
            await senddata(devices_list[i], outputReportData);
            console.log("SWITCH_BLE:", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：SWITCH_ESB_TX
async function SWITCH_ESB_TX() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x14, 0x00]);
            await senddata(devices_list[i], outputReportData);
            console.log("SWITCH_ESB_TX:", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x14, 0x00]);
            await senddata(devices_list[i], outputReportData);
            console.log("SWITCH_ESB_TX:", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：SWITCH_ESB_RX
async function SWITCH_ESB_RX() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x14, 0x01]);
            await senddata(devices_list[i], outputReportData);
            console.log("SWITCH_ESB_RX:", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x14, 0x01]);
            await senddata(devices_list[i], outputReportData);
            console.log("SWITCH_ESB_RX:", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：READV
async function READV() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x01, 0x0B]);
            await senddata(devices_list[i], outputReportData);
            console.log("READV:", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x01, 0x0B]);
            await senddata(devices_list[i], outputReportData);
            console.log("READV:", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：REBOND
async function REBOND() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x01, 0x07]);
            await senddata(devices_list[i], outputReportData);
            console.log("REBOND:", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x01, 0x07]);
            await senddata(devices_list[i], outputReportData);
            console.log("REBOND:", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：SWITCH_BT1
async function SWITCH_BT1() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x01, 0x08]);
            await senddata(devices_list[i], outputReportData);
            console.log("SWITCH_BT1:", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x01, 0x08]);
            await senddata(devices_list[i], outputReportData);
            console.log("SWITCH_BT1:", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：SWITCH_BT2
async function SWITCH_BT2() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x01, 0x09]);
            await senddata(devices_list[i], outputReportData);
            console.log("SWITCH_BT2:", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x01, 0x09]);
            await senddata(devices_list[i], outputReportData);
            console.log("SWITCH_BT2:", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：SWITCH_BT3
async function SWITCH_BT3() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x40, 0x02, 0x01, 0x0A]);
            await senddata(devices_list[i], outputReportData);
            console.log("SWITCH_BT3:", devices_list[i]);
            return null;
        } else if (devices_list[i].opened && devices_list[i].productName == "") {
            const outputReportData = new Uint8Array([0x02, 0x01, 0x0A]);
            await senddata(devices_list[i], outputReportData);
            console.log("SWITCH_BT3:", devices_list[i]);
            return null;
        }
    }
    console.log("No Device Connected");
    //document.getElementById('consoleinfo').innerHTML = "无设备连接" + '<br>';
}

//发送数据处理函数：获取键盘信息
async function GetKeyboardInfo() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
            const outputReportData = new Uint8Array([0x20]);
            await senddata(devices_list[i], outputReportData);
            console.log("GetKeyboardInfo():", devices_list[i]);
            //document.getElementById('consoleinfo').innerHTML = "📃" + devices_list[i].productName + ' 的信息：<br>';
        }
    }
}


//发送数据
async function senddata(device, data) {
    if (!device) return;
    try {
        await device.sendReport(reportId, data);
        console.log('SendReport:', reportId, data);
    } catch (error) {
        console.error('SendReport: Failed:', error);
    }
}

//刷新数据任务
async function refreshdata() {
    info = setInterval(GetKeyboardInfo, 5000);
}


//=======================================================================监听器部分=====================
document.addEventListener('DOMContentLoaded', async() => {
    //==========================获取元素====================
    document.getElementsByName('grantdevice')[0].addEventListener('click', GrantDevice); //授权设备
    document.getElementsByName('systemoff')[0].addEventListener('click', SYSTEMOFF); //授权设备
    document.getElementsByName('indicatorlight')[0].addEventListener('click', TOGGLE_INDICATOR_LIGHT); //授权设备
    document.getElementsByName('bootcheck')[0].addEventListener('click', BOOTCHECK); //授权设备
    //document.getElementById('list-button').addEventListener('click', ListDevices); //列出设备
    //document.getElementById('connect-button').addEventListener('click', OpenDevice); //连接设备
    //document.getElementById('disconnect-button').addEventListener('click', CloseDevice); //断开连接

    document.getElementsByName('switchble')[0].addEventListener('click', SWITCH_BLE); //发送命令
    document.getElementsByName('switchesb')[0].addEventListener('click', SWITCH_ESB); //发送命令
    document.getElementsByName('switchesbtx')[0].addEventListener('click', SWITCH_ESB_TX); //发送命令
    document.getElementsByName('switchesbrx')[0].addEventListener('click', SWITCH_ESB_RX); //发送命令
    document.getElementsByName('readv')[0].addEventListener('click', READV); //发送命令
    document.getElementsByName('rebond')[0].addEventListener('click', REBOND); //发送命令
    document.getElementsByName('switchbt1')[0].addEventListener('click', SWITCH_BT1); //发送命令
    document.getElementsByName('switchbt2')[0].addEventListener('click', SWITCH_BT2); //发送命令
    document.getElementsByName('switchbt3')[0].addEventListener('click', SWITCH_BT3); //发送命令
    document.getElementsByName('rgbtoggle')[0].addEventListener('click', RGBLIGHT_TOGGLE); //发送命令
    document.getElementsByName('rgbmodeinc')[0].addEventListener('click', RGBLIGHT_MODE_INCREASE); //发送命令
    document.getElementsByName('rgbmodedec')[0].addEventListener('click', RGBLIGHT_MODE_DECREASE); //发送命令
    document.getElementsByName('rgbhueinc')[0].addEventListener('click', RGBLIGHT_HUE_INCREASE); //发送命令
    document.getElementsByName('rgbhuedec')[0].addEventListener('click', RGBLIGHT_HUE_DECREASE); //发送命令
    document.getElementsByName('rgbsatinc')[0].addEventListener('click', RGBLIGHT_SAT_INCREASE); //发送命令
    document.getElementsByName('rgbsatdec')[0].addEventListener('click', RGBLIGHT_SAT_DECREASE); //发送命令
    document.getElementsByName('rgbvalinc')[0].addEventListener('click', RGBLIGHT_VAL_INCREASE); //发送命令
    document.getElementsByName('rgbvaldec')[0].addEventListener('click', RGBLIGHT_VAL_DECREASE); //发送命令
    //document.getElementsByName('getkeyboardinfo')[0].addEventListener('click', GetKeyboardInfo); //发送命令：获取键盘信息
    // 获取元素

    let devices = await navigator.hid.getDevices();
    if (devices.length) {
        for (var i = 0; i < devices.length; i++) {
            if (devices[i].productName.includes("Lotlab")) {
                OpenDevice().then(GetKeyboardInfo);
                console.log("DOMContentLoaded & Opened Device :", devices[i]);
                updateHeaderStatus('link-icon', 'link-text', 'fas fa-link', '有线已连接');
                refreshdata();
            }
            if (devices[i].productName == "") {
                OpenDevice().then(GetKeyboardInfo);
                console.log("DOMContentLoaded & Opened Device :", devices[i]);
                updateHeaderStatus('link-icon', 'link-text', 'fas fa-link', '无线已连接');
                refreshdata();
            }
        }

    }
});


if ("hid" in navigator) {
    //监听HID授权设备的接入，并连接设备
    navigator.hid.addEventListener('connect', ({ device }) => {
        console.log(`HID设备连接: ${device.productName}`);
        if (device.productName.includes("Lotlab")) {
            updateHeaderStatus('link-icon', 'link-text', 'fas fa-link', '有线已连接');
            OpenDevice().then(GetKeyboardInfo)
            refreshdata();
        }
        if (device.productName == "") {
            updateHeaderStatus('link-icon', 'link-text', 'fas fa-link', '无线已连接');
            OpenDevice().then(GetKeyboardInfo)
            refreshdata();
        }
    });

    //监听HID授权设备的断开，并提示
    navigator.hid.addEventListener('disconnect', ({ device }) => {
        console.log(`HID设备断开: ${device.productName}`);
        if (device.productName.includes("Lotlab") || (device.productName == "")) {
            updateHeaderStatus('link-icon', 'link-text', 'fas fa-unlink', '未连接');
            clearInterval(info);
        }
        if (device.productName == "") {
            updateHeaderStatus('link-icon', 'link-text', 'fas fa-unlink', '未连接');
            clearInterval(info);
        }
    });
} else {
    //document.getElementById('consoleinfo').innerHTML = "🔺提示信息：" + '<br>';
    //document.getElementById('consoleinfo').innerHTML += "您的浏览器不支持WebHID，请使用Chrome 89+ / Edge 89+ / Opera 75+" + '<br>';
}