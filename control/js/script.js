// Part of https://todbot.github.io/blink1-webhid/

document.getElementsByName('grantdevice')[0].addEventListener('click', GrantDevice); //授权设备
//document.getElementById('list-button').addEventListener('click', ListDevices); //列出设备
//document.getElementById('connect-button').addEventListener('click', OpenDevice); //连接设备
//document.getElementById('disconnect-button').addEventListener('click', CloseDevice); //断开连接

document.getElementsByName('switchwireless')[0].addEventListener('click', SWITCH_WIRELESS); //发送命令
document.getElementsByName('switchesb')[0].addEventListener('click', SWITCH_ESB); //发送命令
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

//设置过滤器
const filters = [
	{
		vendorId: 0x1209, // GT
		productId: 0x0514, // GT
	}
];

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
			document.getElementById('consoleinfo').innerHTML += "授权设备:" + devices_list[i].productName + '<br>';
			OpenDevice().then(GetKeyboardInfo);
			refreshdata();
			return null;
		}
		if (devices_list[i].productName == "") {
			console.log("GrantDevice():", devices_list[i]);
			document.getElementById('consoleinfo').innerHTML = "⌨️授权无线设备" + '<br>';
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
		document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
		document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
		return null;
	}
	console.log("ListDevices():", devices_list);
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].productName.includes("Lotlab") || (devices_list[i].productName == "")) {
			document.getElementById('consoleinfo').innerHTML += "已授权设备:" + devices_list[i].productName + '<br>';
		}
	}
}

//连接设备【先授权，后连接GT 2.4G Receiver】
async function OpenDevice() {
	const devices_list = await navigator.hid.getDevices();
	if (!devices_list.length) {
		console.log("No Device Connected");
		document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
		document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
		return null;
	} else {
		for (var i = 0; i < devices_list.length; i++) {
			if (devices_list[i].opened && (devices_list[i].productName.includes("Lotlab") || (devices_list[i].productName == ""))) {
				document.getElementById('consoleinfo').innerHTML += "设备已经连接，请勿重复点击" + '<br>';
				return devices_list[i];
			} else if (devices_list[i].productName.includes("Lotlab")) {
				await devices_list[i].open();
				devices_list[i].oninputreport = ({ device, reportId, data }) => {
					const inputdata = new Uint8Array(data.buffer);
					console.log(`Input report ${reportId} from ${device.productName}:`, inputdata);
					//console.log(`已绑定设备数量：`, inputdata[20]);
					//console.log(`绑定设备索引：`, inputdata[21]);
					var builddata = parseInt("0x" + ("0" + inputdata[15].toString(16)).slice(-2) + ("0" + inputdata[14].toString(16)).slice(-2) + ("0" + inputdata[13].toString(16)).slice(-2) + ("0" + inputdata[12].toString(16)).slice(-2)).toString(10);
					var newDate = new Date();
					newDate.setTime(builddata * 1000);
					document.getElementById('consoleinfo').innerHTML = "📃" + device.productName + ' 的信息：<br>';

					document.getElementById('consoleinfo').innerHTML += "固件SDK版本：" + inputdata[11] + '<br>';
					document.getElementById('consoleinfo').innerHTML += "固件版本信息：" + (inputdata[11].toString(16).toUpperCase()).slice(-2) + ":" + ("0" + inputdata[10].toString(16).toUpperCase()).slice(-2) + ":" + ("0" + inputdata[9].toString(16).toUpperCase()).slice(-2) + ":" + ("0" + inputdata[8].toString(16).toUpperCase()).slice(-2) + '<br>';
					document.getElementById('consoleinfo').innerHTML += "固件编译日期：" + newDate.toLocaleString() + '<br>';
				};
				console.log("OpenDevice():", devices_list[i]);
				document.getElementById('consoleinfo').innerHTML += "已连接设备:" + devices_list[i].productName + '<br>';
				//return devices_list[i];
			} else if (devices_list[i].productName == "") {
				await devices_list[i].open();
				console.log("OpenDevice():", devices_list[i]);
				document.getElementById('consoleinfo').innerHTML = "⌨️已连接无线设备" + '<br>';
				//return devices_list[i];
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
			document.getElementById('consoleinfo').innerHTML += "断开设备:" + devices_list[i].productName + '<br>';
			return null;
		}
	}
	console.log("No Device Connected");
	document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
}


//====================================================================================控制按键==================================
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
	document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
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
	document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
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
	document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
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
	document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
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
	document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
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
	document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
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
	document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
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
	document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
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
	document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
}


//发送数据处理函数：SWITCH_ESB
async function SWITCH_ESB() {
	const devices_list = await navigator.hid.getDevices();
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
			const outputReportData = new Uint8Array([0x40, 0x02, 0x14, 0x02]);
			await senddata(devices_list[i], outputReportData);
			console.log("SWITCH_ESB:", devices_list[i]);
			return null;
		} else if (devices_list[i].opened && devices_list[i].productName == "") {
			const outputReportData = new Uint8Array([0x02, 0x14, 0x02]);
			await senddata(devices_list[i], outputReportData);
			console.log("SWITCH_ESB:", devices_list[i]);
			return null;
		}
	}
	console.log("No Device Connected");
	document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
}

//发送数据处理函数：SWITCH_WIRELESS
async function SWITCH_WIRELESS() {
	const devices_list = await navigator.hid.getDevices();
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
			const outputReportData = new Uint8Array([0x40, 0x02, 0x13, 0x02]);
			await senddata(devices_list[i], outputReportData);
			console.log("SWITCH_WIRELESS:", devices_list[i]);
			return null;
		} else if (devices_list[i].opened && devices_list[i].productName == "") {
			const outputReportData = new Uint8Array([0x02, 0x13, 0x02]);
			await senddata(devices_list[i], outputReportData);
			console.log("SWITCH_WIRELESS:", devices_list[i]);
			return null;
		}
	}
	console.log("No Device Connected");
	document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
}

//发送数据处理函数：获取键盘信息
async function GetKeyboardInfo() {
	const devices_list = await navigator.hid.getDevices();
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].opened && devices_list[i].productName.includes("Lotlab")) {
			const outputReportData = new Uint8Array([0x20]);
			await senddata(devices_list[i], outputReportData);
			console.log("GetKeyboardInfo():", devices_list[i]);
			document.getElementById('consoleinfo').innerHTML = "📃" + devices_list[i].productName + ' 的信息：<br>';
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
document.addEventListener('DOMContentLoaded', async () => {
	let devices = await navigator.hid.getDevices();
	if (devices.length) {
		document.getElementById('consoleinfo').innerHTML += "已接入授权HID设备" + '<br>';
		for (var i = 0; i < devices.length; i++) {
			if (devices[i].productName.includes("Lotlab")) {
				OpenDevice().then(GetKeyboardInfo);
				console.log("DOMContentLoaded & Opened Device :", devices[i]);
				document.getElementById('consoleinfo').innerHTML += "🔌自动连接有线设备: " + devices[i].productName + '<br>';
				refreshdata();
			}
			if (devices[i].productName == "") {
				OpenDevice().then(GetKeyboardInfo);
				console.log("DOMContentLoaded & Opened Device :", devices[i]);
				document.getElementById('consoleinfo').innerHTML += "🔌自动连接无线设备: " + devices[i].productName + '<br>';
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
			document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
			document.getElementById('consoleinfo').innerHTML += "🔌已授权HID设备接入" + '<br>';
			OpenDevice().then(GetKeyboardInfo)
			refreshdata();
		}
		if (device.productName == "") {
			document.getElementById('consoleinfo').innerHTML = "🔌已授权无线设备接入" + '<br>';
			OpenDevice().then(GetKeyboardInfo)
			refreshdata();
		}
	});

	//监听HID授权设备的断开，并提示
	navigator.hid.addEventListener('disconnect', ({ device }) => {
		console.log(`HID设备断开: ${device.productName}`);
		if (device.productName.includes("Lotlab") || (device.productName == "")) {
			document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
			document.getElementById('consoleinfo').innerHTML += "🔌已授权HID设备断开" + '<br>';
			clearInterval(info);
		}
		if (device.productName == "") {
			document.getElementById('consoleinfo').innerHTML = "🔌已授权无线设备断开" + '<br>';
			clearInterval(info);
		}
	});
} else {
	document.getElementById('consoleinfo').innerHTML = "🔺提示信息：" + '<br>';
	document.getElementById('consoleinfo').innerHTML += "您的浏览器不支持WebHID，请使用Chrome 89+ / Edge 89+ / Opera 75+" + '<br>';
}