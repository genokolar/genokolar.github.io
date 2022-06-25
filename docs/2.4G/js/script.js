// Part of https://todbot.github.io/blink1-webhid/

document.getElementById('grant-button').addEventListener('click', grantDevice); //授权设备
//document.getElementById('list-button').addEventListener('click', listDevices); //列出设备
//document.getElementById('connect-button').addEventListener('click', openDevice); //连接设备
//document.getElementById('disconnect-button').addEventListener('click', closeDevice); //断开连接

document.getElementById('send-button1').addEventListener('click', handleSendClick1); //发送命令：进入USB ISP
document.getElementById('send-button4').addEventListener('click', handleSendClick4); //发送命令：进入USB ISP
document.getElementById('send-button2').addEventListener('click', handleSendClick2); //发送命令：重置键盘
document.getElementById('send-button3').addEventListener('click', handleSendClick3); //发送命令：获取键盘信息

//设置过滤器
const filters = [
{
	vendorId: 0x4366, // Glab
	productId: 0x1024, // Glab
	productName: "Glab 2.4G Receiver",
}
];


//授权设备
async function grantDevice() {
	let devices_list = await navigator.hid.requestDevice({
		filters
	});
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].productName == "Glab 2.4G Receiver") {
			console.log("Grant Device:", devices_list[i]);
			document.getElementById('consoleinfo').innerHTML +="授权设备:" + devices_list[i].productName + '<br>';
			openDevice();
			return null;
		}
	}
}


//列出设备
async function listDevices() {
	const devices_list = await navigator.hid.getDevices();
	if (!devices_list.length) {
		console.log("No Device Connected");
		document.getElementById('consoleinfo').innerHTML +="无设备连接" + '<br>';
		return null;
	}
	console.log("Devices list:", devices_list);
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].productName == "Glab 2.4G Receiver") {
		document.getElementById('consoleinfo').innerHTML +="已授权设备:" + devices_list[i].productName + '<br>';
		}
	}
}

//连接设备【先授权，后连接Glab 2.4G Receiver】
async function openDevice() {
	const devices_list = await navigator.hid.getDevices();
	if (!devices_list.length) {
		console.log("No Device Connected");
		document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
		return null;
	} else {
		for (var i = 0; i < devices_list.length; i++) {
			if (devices_list[i].opened && devices_list[i].productName == "Glab 2.4G Receiver") {
				document.getElementById('consoleinfo').innerHTML += "设备已经连接，请勿重复点击" + '<br>';
				return devices_list[i];
			} else if (devices_list[i].productName == "Glab 2.4G Receiver") {
				await devices_list[i].open();
				console.log("Device Opened:", devices_list[i]);
				document.getElementById('consoleinfo').innerHTML += "已连接设备:" + devices_list[i].productName + '<br>';
				//return devices_list[i];
			}
		}
	}
}


//断开设备
async function closeDevice() {

	const devices_list = await navigator.hid.getDevices();
	if (!devices_list) return null;
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].opened) {
			await devices_list[i].close();
			console.log("Device Close:", devices_list[i]);
			document.getElementById('consoleinfo').innerHTML +="断开设备:" + devices_list[i].productName + '<br>';
			return null;
		}
	}
	console.log("No Device Connected");
	document.getElementById('consoleinfo').innerHTML +="无设备连接" + '<br>';
}

//发送数据处理函数：进入USB ISP
async function handleSendClick1() {
	const devices_list = await navigator.hid.getDevices();
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].opened && devices_list[i].productName == "Glab 2.4G Receiver") {
			const outputReportData = new Uint8Array([0xf1]);
			await senddata(devices_list[i], outputReportData)
			console.log("Sent to Devices:", devices_list[i])
			document.getElementById('consoleinfo').innerHTML ="操作信息：" +'<br>';
			document.getElementById('consoleinfo').innerHTML +="进入USB ISP:" + devices_list[i].productName + '<br>';
			return null;
		}
	}
	console.log("No Device Connected");
	document.getElementById('consoleinfo').innerHTML +="无设备连接" + '<br>';
}


//发送数据处理函数：重置键盘
async function handleSendClick2() {
	const devices_list = await navigator.hid.getDevices();
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].opened && devices_list[i].productName == "Glab 2.4G Receiver") {
			const outputReportData = new Uint8Array([0x3f, 0x01, 0xff]);
			await senddata(devices_list[i], outputReportData)
			console.log("Sent to Devices:", devices_list[i])
			document.getElementById('consoleinfo').innerHTML ="操作信息：" +'<br>';
			document.getElementById('consoleinfo').innerHTML +="重置接收器:" + devices_list[i].productName + '<br>';
			document.getElementById('consoleinfo').innerHTML +="5秒后,请重新拔插接收器以便完成重置" + '<br>';
			return null;
		}
	}
	console.log("No Device Connected");
	document.getElementById('consoleinfo').innerHTML +="无设备连接" + '<br>';
}

//发送数据处理函数：获取键盘信息
async function handleSendClick3() {
	const devices_list = await navigator.hid.getDevices();
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].opened && devices_list[i].productName == "Glab 2.4G Receiver") {
			const outputReportData = new Uint8Array([0x20]);
			await senddata(devices_list[i], outputReportData)
			console.log("Sent to Devices:", devices_list[i])
			document.getElementById('consoleinfo').innerHTML ="操作信息：" +'<br>';
			document.getElementById('consoleinfo').innerHTML +="获取接收器信息:" + devices_list[i].productName + '<br>';
			return null;
		}
	}
	console.log("No Device Connected");
	document.getElementById('consoleinfo').innerHTML +="无设备连接" + '<br>';
}

//发送数据处理函数：允许CMSIS刷写
async function handleSendClick4() {
	const devices_list = await navigator.hid.getDevices();
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].opened && devices_list[i].productName == "Glab 2.4G Receiver") {
			const outputReportData = new Uint8Array([0xf2]);
			await senddata(devices_list[i], outputReportData)
			console.log("Sent to Devices:", devices_list[i])
			document.getElementById('consoleinfo').innerHTML ="操作信息：" +'<br>';
			document.getElementById('consoleinfo').innerHTML +="允许固件刷写:" + devices_list[i].productName + '<br>';
			document.getElementById('consoleinfo').innerHTML +="刷写完成后，请重新拔插接收器以便重置状态" + '<br>';
			return null;
		}
	}
	console.log("No Device Connected");
	document.getElementById('consoleinfo').innerHTML +="无设备连接" + '<br>';
}

//发送数据
async function senddata(device, data) {
	if (!device) return;
	const reportId = 0x3f;
	try {
		await device.sendReport(reportId, data);
		device.oninputreport = ({device, reportId, data}) => {
			console.log(`Input report ${reportId} from ${device.productName}:`,
						new Uint8Array(data.buffer));
		};
	} catch (error) {
		console.error('SendReport: Failed:', error);
		document.getElementById('consoleinfo').innerHTML +='SendReport: Failed:' + error + '<br>';
	}
}

document.addEventListener('DOMContentLoaded', async () => {
	if ("hid" in navigator) {
		//监听HID授权设备的接入，并连接设备
		navigator.hid.addEventListener('connect', ({device}) => {
			console.log(`HID connected: ${device.productName}`);
			if (device.productName == "Glab 2.4G Receiver") {
				document.getElementById('consoleinfo').innerHTML ="操作信息：" +'<br>';
				document.getElementById('consoleinfo').innerHTML +="已授权HID设备接入" + '<br>';
				openDevice();
			}
		});
  
		//监听HID授权设备的断开，并提示
		navigator.hid.addEventListener('disconnect', ({device}) => {
			console.log(`HID disconnected: ${device.productName}`);
			document.getElementById('consoleinfo').innerHTML ="操作信息：" +'<br>';
			document.getElementById('consoleinfo').innerHTML +="已授权HID设备断开" +'<br>';
		});

		//监听授权设备的报告
		navigator.hid.addEventListener("inputreport", event => {
			const { data, device, reportId } = event;
			console.log(`DATA: ${data}.`);
		});

		let devices = await navigator.hid.getDevices();
		devices.forEach(device => {
			if (device.productName == "Glab 2.4G Receiver") {
				document.getElementById('consoleinfo').innerHTML += "已授权HID设备已接入" + '<br>';
				openDevice();
			}
		});
	} else {
				document.getElementById('consoleinfo').innerHTML += "浏览器不支持WebHID，使用Chrome 89+ / Edge 89+ / Opera 75+" + '<br>';
	}
});
