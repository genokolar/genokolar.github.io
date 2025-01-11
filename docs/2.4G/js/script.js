// 2.4G Receiver Control

document.getElementsByName('grantdevice')[0].addEventListener('click', GrantDevice); //授权设备
//document.getElementById('list-button').addEventListener('click', ListDevices); //列出设备
//document.getElementById('connect-button').addEventListener('click', OpenDevice); //连接设备
//document.getElementById('disconnect-button').addEventListener('click', CloseDevice); //断开连接

document.getElementsByName('enterusbisp')[0].addEventListener('click', EnterUSBISP); //发送命令：进入USB ISP
document.getElementsByName('entercmsisdap')[0].addEventListener('click', EnterCMSISDAP); //发送命令：进入CMSIS-DAP
document.getElementsByName('resetkeyboard')[0].addEventListener('click', ResetKeyboard); //发送命令：重置键盘
//document.getElementsByName('getkeyboardinfo')[0].addEventListener('click', GetKeyboardInfo); //发送命令：获取键盘信息

//设置过滤器
const filters = [
	{
		vendorId: 0x4366, //新固件
		productId: 0x1024,
		usagePage: 0xffea,
		usage: 0x0072,
		productName: "Receiver"
	},
	{
		vendorId: 0x4366, // 老固件
		productId: 0x1024,
		usagePage: 0xff00,
		usage: 0x0001,
		productName: "Receiver"
	},
];
var cmsisdap = false;
var info;
const reportId = 0x3f;
var Logenable = false;
var device_opened = false;
var s_device;
var new_ver = false;
var firmwarever;
var formattedDate;
const commandPromises = new Map();

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

function consolelog(Logtxt, ...args) {
    if (Logenable) {
        console.log(Logtxt, ...args);
    }
}

function checkFilters(device) {
    for (let i = 0; i < filters.length; i++) {
        const filter = filters[i];
        if (device.collections.length) {
            if (device.vendorId == filter.vendorId &&
                device.productId == filter.productId &&
                device.collections[0].usagePage == filter.usagePage &&
                device.collections[0].usage == filter.usage &&
			    device.productName.includes(filter.productName)) {
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
            return true; // 符合过滤器要求
        }
    }
    return false; // 不符合任何过滤器要求
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
				document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
				document.getElementById('consoleinfo').innerHTML += "🔌已授权HID设备断开" + '<br>';
				s_device = null;
				clearInterval(info);
                consolelog("Close Device:", link_devices_list[i]);
            }
        }

    }
    //遍历设备，并打开符合条件的设备
    for (var i = 0; i < devices_list.length; i++) {
        if (!device_opened) {
            await OpenDevice(devices_list[i]);
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
		document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
		document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
		return null;
	}
	consolelog("ListDevices():", devices_list);
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].productName.includes("Receiver")) {
			document.getElementById('consoleinfo').innerHTML += "已授权设备:" + devices_list[i].productName + '<br>';
		}
	}
}

//连接设备【先授权，后连接Glab 2.4G Receiver】
async function OpenDevice(opendevice) {
    if (!device_opened) {
        try {
            await opendevice.open();
            s_device = opendevice;  // 存储打开的设备
            consolelog("Open Device:", opendevice);
			document.getElementById('consoleinfo').innerHTML += "已连接设备:" + opendevice.productName + '<br>';
            device_opened = true;

			if(check_receiver(opendevice)){
				new_ver = true;
			} else {
				new_ver = false;
			}
;

            opendevice.oninputreport = ({ device, reportId, data }) => {
                consolelog('Received data:', data);

                // 根据收到的数据找到对应的命令Promise并解析它
                for (const [command, resolve] of commandPromises) {
                    handleResponse(command, data, resolve);
                    commandPromises.delete(command);
                    break; // 假设每次只会有一个命令的响应
                }
            };

			reflushinfo();
            CheckCMSISDAP();
			consolelog("OpenDevice():", opendevice);
			refreshdata();

        } catch (error) {
            console.error('Failed to open device:', error);
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
			consolelog("CloseDevice():", devices_list[i]);
			document.getElementById('consoleinfo').innerHTML += "断开设备:" + devices_list[i].productName + '<br>';
			return null;
		}
	}
	consolelog("No Device Connected");
	document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
}

//====================================================================================控制按键==================================
//发送数据处理函数：进入USB ISP
async function EnterUSBISP() {
	const devices_list = await navigator.hid.getDevices();
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].opened && devices_list[i].productName.includes("Receiver")) {
			const outputReportData = new Uint8Array([0xf1]);
			await senddata(devices_list[i], outputReportData);
			consolelog("EnterUSBISP():", devices_list[i]);
			document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
			document.getElementById('consoleinfo').innerHTML += "进入USB ISP:" + devices_list[i].productName + '<br>';
			return null;
		}
	}
	consolelog("No Device Connected");
	document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
}


//发送数据处理函数：重置键盘
async function ResetKeyboard() {
	const devices_list = await navigator.hid.getDevices();
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].opened && devices_list[i].productName.includes("Receiver")) {
			const outputReportData = new Uint8Array([0x3f, 0x01, 0xff]);
			//const outputReportData = new Uint8Array([0xA2, 0x00]);
			await senddata(devices_list[i], outputReportData);
			consolelog("ResetKeyboard():", devices_list[i]);
			document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
			document.getElementById('consoleinfo').innerHTML += "重置接收器：" + devices_list[i].productName + '<br>';
			setTimeout(reflushinfo, 500);
			return null;
		}
	}
	consolelog("No Device Connected");
	document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
}

async function reflushinfo() {
	if (new_ver) {
		await GetInfo(s_device, CMD.HID_CMD_GET_RECEIVER_INFORMATION);
		await GetInfo(s_device, CMD.HID_CMD_GET_RECEIVER_RUN_INFORMATION);
	} else {
		await GetInfo(s_device, CMD.HID_CMD_GET_INFORMATION);
	}
}

//发送数据处理函数：获取键盘信息
function GetInfo(device, command) {
    return new Promise((resolve, reject) => {
        device.sendReport(reportId, new Uint8Array([command, 0x00])).then(() => {
			consolelog("GetInfo():",s_device,command);
			document.getElementById('consoleinfo').innerHTML = "📃" + s_device.productName + ' 的信息：<br>';
            const commandPromise = new Promise((innerResolve) => {
                commandPromises.set(command, innerResolve);
            });
            resolve(commandPromise);
        }).catch(error => {
            reject(error);
        });
    });
	CheckCMSISDAP();
}

//检测CMSIS-DAP是否开启
async function CheckCMSISDAP() {
	const devices_list = await navigator.hid.getDevices();
	for (var i = 0; i < devices_list.length; i++) {
		if ((devices_list[i].productName == "CMSIS-DAP") && (devices_list[i].productId == "0x1024") && (devices_list[i].vendorId == "0x4366")) {
			consolelog("CMSIS-DAP启用 :", devices_list[i]);
			document.getElementById('consoleinfo').innerHTML = "⚠️警告：设备CMSIS-DAP刷机功能开启" + '<br>';
			document.getElementsByName('entercmsisdap')[0].innerHTML = "禁用CMSSIS-DAP"
			cmsisdap = true;
			return null;
		} else {
			document.getElementsByName('entercmsisdap')[0].innerHTML = "启用CMSSIS-DAP"
			cmsisdap = false;
		}
	}
}

//发送数据处理函数：允许CMSIS刷写
async function EnterCMSISDAP() {
	const devices_list = await navigator.hid.getDevices();
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].opened && devices_list[i].productName.includes("Receiver")) {
			if (cmsisdap) {
				const outputReportData = new Uint8Array([0xf3]);
				await senddata(devices_list[i], outputReportData)
			} else {
				const outputReportData = new Uint8Array([0xf2]);
				await senddata(devices_list[i], outputReportData)
			}
			consolelog("EnterCMSISDAP():", devices_list[i])
			document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
			document.getElementById('consoleinfo').innerHTML += "固件刷写开关:" + devices_list[i].productName + '<br>';
			setTimeout(reflushinfo, 500);
			return null;
		}
	}
	consolelog("No Device Connected");
	document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
}

//发送数据
async function senddata(device, data) {
	if (!device) return;
	try {
		await device.sendReport(reportId, data);
	} catch (error) {
		console.error('SendReport: Failed:', error);
	}
}

//刷新数据任务
function refreshdata() {
	info = setInterval(() => {
        reflushinfo();
    }, 10000);
}

function handleResponse(command, data, resolve) {
    switch (command) {
        case CMD.HID_CMD_GET_INFORMATION:
            update_device_info(data);
            break;
        case CMD.HID_CMD_GET_RECEIVER_INFORMATION:
            update_receiver_info(data);
            break;
        case CMD.HID_CMD_GET_RECEIVER_RUN_INFORMATION:
            update_receiver_run_info(data);
            break;
        default:
            consolelog('Unknown Data');
            break;
    }
    resolve(data);
}

async function update_device_info(data) {
    const inputdata = new Uint8Array(data.buffer);
    if (inputdata[0] == 0 || inputdata[0] == CMD.HID_CMD_GET_INFORMATION) {
		consolelog(`Input report ${reportId} from ${s_device.productName}:`, inputdata);
        const timestamp = data.getUint32(12, true); // 使用true表示小端字节序（如果适用）
        const date = new Date(timestamp * 1000); // 转换为毫秒并创建Date对象
        formattedDate = date.toLocaleString(); // 使用内置方法格式化日期
		firmwarever = data.getUint32(22, 1).toString(16).padStart(8, '0');
		if (cmsisdap) {
			document.getElementById('consoleinfo').innerHTML += "⚠️警告：设备CMSIS-DAP刷机功能开启" + '<br>';
		}
		document.getElementById('consoleinfo').innerHTML += "已绑定设备数量：" + inputdata[20] + '<br>';
		document.getElementById('consoleinfo').innerHTML += "已绑定管道索引值：" + (inputdata[21] / 2).toString(2).padStart(7, "0") + '<br>';
		document.getElementById('consoleinfo').innerHTML += "当前连接设备数量：" + inputdata[27] + '<br>';
		document.getElementById('consoleinfo').innerHTML += "当前无线通讯频道：" + inputdata[26] + '<br>';
		document.getElementById('consoleinfo').innerHTML += "接收器硬件信息：" + firmwarever + '<br>';
		document.getElementById('consoleinfo').innerHTML += "接收器固件日期：" + formattedDate + '<br>';
    } else if (inputdata[0] == 0x05) {  //收到键盘接收出错错误的数据包
        console.error('update_device_info：Received an error packet');
    }
}

async function update_receiver_info(data) {
    const inputdata = new Uint8Array(data.buffer);
    if (inputdata[0] == 0 || inputdata[0] == CMD.HID_CMD_GET_RECEIVER_INFORMATION) {
		consolelog(`Input report ${reportId} from ${s_device.productName}:`, inputdata);
        //receiver mac
        firmwarever = data.getUint32(20, 1).toString(16).padStart(8, '0');
        //receiver firmware data
        const timestamp = data.getUint32(12, true); // 使用true表示小端字节序（如果适用）
        const date = new Date(timestamp * 1000); // 转换为毫秒并创建Date对象
        formattedDate = date.toLocaleString(); // 使用内置方法格式化日期
    } else if (inputdata[0] == 0x05) {  //收到键盘接收出错错误的数据包
        console.error('update_device_esb_rx_info：Received an error packet');
    }
}

async function update_receiver_run_info(data) {
    const inputdata = new Uint8Array(data.buffer);
    if (inputdata[0] == 0 || inputdata[0] == CMD.HID_CMD_GET_RECEIVER_RUN_INFORMATION) {
		consolelog(`Input report ${reportId} from ${s_device.productName}:`, inputdata);
		document.getElementById('consoleinfo').innerHTML += "已绑定设备数量：" + inputdata[2] + '<br>';
		document.getElementById('consoleinfo').innerHTML += "已绑定管道索引值：" + (inputdata[3] / 2).toString(2).padStart(7, "0") + '<br>';
		document.getElementById('consoleinfo').innerHTML += "当前连接设备数量：" + inputdata[4] + '<br>';
		document.getElementById('consoleinfo').innerHTML += "当前无线通讯频道：" + inputdata[5] + '<br>';
		document.getElementById('consoleinfo').innerHTML += "接收器硬件信息：" + firmwarever + '<br>';
		document.getElementById('consoleinfo').innerHTML += "接收器固件日期：" + formattedDate + '<br>';
    } else if (inputdata[0] == 0x05) {  //收到键盘接收出错错误的数据包
        console.error('update_receiver_run_info：Received an error packet');
    }
}

//=======================================================================监听器部分=====================
document.addEventListener('DOMContentLoaded', async () => {
	let devices = await navigator.hid.getDevices();
	if (devices.length) {
		document.getElementById('consoleinfo').innerHTML += "已接入授权HID设备" + '<br>';
		for (var i = 0; i < devices.length; i++) {
			if (checkFilters(devices[i])) {
				OpenDevice(devices[i]);
				consolelog("DOMContentLoaded & Opened Device :", devices[i]);
				document.getElementById('consoleinfo').innerHTML += "🔌自动连接设备: " + devices[i].productName + '<br>';
			}
		}

	}
});


if ("hid" in navigator) {
	//监听HID授权设备的接入，并连接设备
	navigator.hid.addEventListener('connect', ({ device }) => {
		consolelog(`HID设备连接:`, device);
		if (checkFilters(device)) {
			OpenDevice(device);
			document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
			document.getElementById('consoleinfo').innerHTML += "🔌已授权HID设备接入" + '<br>';
		}
	});

	//监听HID授权设备的断开，并提示
	navigator.hid.addEventListener('disconnect', ({ device }) => {
		consolelog(`HID设备断开:`, device);
		if (checkFilters(device)) {
			document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
			document.getElementById('consoleinfo').innerHTML += "🔌已授权HID设备断开" + '<br>';
			s_device = null;
			clearInterval(info);
			device_opened = false;
		}
	});

	//监听授权设备的报告
} else {
	document.getElementById('consoleinfo').innerHTML = "🔺提示信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "您的浏览器不支持WebHID，请使用Chrome 89+ / Edge 89+ / Opera 75+" + '<br>';
}