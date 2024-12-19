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
		vendorId: 0x4366, // Glab
		productId: 0x1024, // Glab
		usagePage: 0xff00,
		usage: 0x0001,
		productName: "Receiver"
	}
];
var cmsisdap = false;
var info;
const reportId = 0x3f;
var Logenable = false;
var device_opened = false;
var s_device;

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
        if (!device_opened) {
            await OpenDevice(devices_list[i]).then(GetKeyboardInfo);
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
	s_device = opendevice;
	await opendevice.open();
	device_opened = true;
	refreshdata();
	opendevice.oninputreport = ({ device, reportId, data }) => {
		const inputdata = new Uint8Array(data.buffer);
		consolelog(`Input report ${reportId} from ${device.productName}:`, inputdata);
		var builddata = parseInt("0x" + ("0" + inputdata[15].toString(16)).slice(-2) + ("0" + inputdata[14].toString(16)).slice(-2) + ("0" + inputdata[13].toString(16)).slice(-2) + ("0" + inputdata[12].toString(16)).slice(-2)).toString(10);
		var newDate = new Date();
		newDate.setTime(builddata * 1000);
		document.getElementById('consoleinfo').innerHTML = "📃" + device.productName + ' 的信息：<br>';
		if (cmsisdap) {
			document.getElementById('consoleinfo').innerHTML += "⚠️警告：设备CMSIS-DAP刷机功能开启" + '<br>';
		}
		document.getElementById('consoleinfo').innerHTML += "已绑定设备数量：" + inputdata[20] + '<br>';
		document.getElementById('consoleinfo').innerHTML += "已绑定管道索引值：" + (inputdata[21] / 2).toString(2).padStart(7, "0") + '<br>';
		document.getElementById('consoleinfo').innerHTML += "当前连接设备数量：" + inputdata[27] + '<br>';
		document.getElementById('consoleinfo').innerHTML += "当前无线通讯频道：" + inputdata[26] + '<br>';
		document.getElementById('consoleinfo').innerHTML += "接收器硬件信息：" + ("0" + inputdata[25].toString(16).toUpperCase()).slice(-2) + ":" + ("0" + inputdata[24].toString(16).toUpperCase()).slice(-2) + ":" + ("0" + inputdata[23].toString(16).toUpperCase()).slice(-2) + ":" + ("0" + inputdata[22].toString(16).toUpperCase()).slice(-2) + '<br>';
		document.getElementById('consoleinfo').innerHTML += "接收器固件日期：" + newDate.toLocaleString() + '<br>';
	};
	consolelog("OpenDevice():", opendevice);
	document.getElementById('consoleinfo').innerHTML += "已连接设备:" + opendevice.productName + '<br>';
	//return devices_list[i];
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
			await senddata(devices_list[i], outputReportData);
			consolelog("ResetKeyboard():", devices_list[i]);
			document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
			document.getElementById('consoleinfo').innerHTML += "重置接收器：" + devices_list[i].productName + '<br>';
			setTimeout(GetKeyboardInfo, 500);
			return null;
		}
	}
	consolelog("No Device Connected");
	document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
}

//发送数据处理函数：获取键盘信息
async function GetKeyboardInfo() {
	if (s_device != null) {
		const outputReportData = new Uint8Array([0x20, 0x00]);
		await senddata(s_device, outputReportData);
		consolelog("GetKeyboardInfo():",s_device);
		document.getElementById('consoleinfo').innerHTML = "📃" + s_device.productName + ' 的信息：<br>';
	}
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
			setTimeout(GetKeyboardInfo, 500);
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
async function refreshdata() {
	info = setInterval(GetKeyboardInfo, 5000);
}


//=======================================================================监听器部分=====================
document.addEventListener('DOMContentLoaded', async () => {
	let devices = await navigator.hid.getDevices();
	if (devices.length) {
		document.getElementById('consoleinfo').innerHTML += "已接入授权HID设备" + '<br>';
		for (var i = 0; i < devices.length; i++) {
			if (checkFilters(devices[i])) {
				OpenDevice(devices[i]).then(GetKeyboardInfo);
				consolelog("DOMContentLoaded & Opened Device :", devices[i]);
				document.getElementById('consoleinfo').innerHTML += "🔌自动连接设备: " + devices[i].productName + '<br>';
				refreshdata();
			}
		}

	}
});


if ("hid" in navigator) {
	//监听HID授权设备的接入，并连接设备
	navigator.hid.addEventListener('connect', ({ device }) => {
		consolelog(`HID设备连接:`, device);
		if (checkFilters(device)) {
			OpenDevice(device).then(GetKeyboardInfo);
			document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
			document.getElementById('consoleinfo').innerHTML += "🔌已授权HID设备接入" + '<br>';
			refreshdata();
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
		}
	});

	//监听授权设备的报告
} else {
	document.getElementById('consoleinfo').innerHTML = "🔺提示信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "您的浏览器不支持WebHID，请使用Chrome 89+ / Edge 89+ / Opera 75+" + '<br>';
}