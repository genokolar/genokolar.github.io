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
}
];
var cmsisdap=false;
var info;


//授权设备
async function GrantDevice() {
	let devices_list = await navigator.hid.requestDevice({
		filters
	});
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].productName.includes("Glab")) {
			console.log("GrantDevice():", devices_list[i]);
			document.getElementById('consoleinfo').innerHTML +="授权设备:" + devices_list[i].productName + '<br>';
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
		document.getElementById('consoleinfo').innerHTML ="🔹操作信息：" +'<br>';
		document.getElementById('consoleinfo').innerHTML +="无设备连接" + '<br>';
		return null;
	}
	console.log("ListDevices():", devices_list);
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].productName.includes("Glab")) {
		document.getElementById('consoleinfo').innerHTML +="已授权设备:" + devices_list[i].productName + '<br>';
		}
	}
}

//连接设备【先授权，后连接Glab 2.4G Receiver】
async function OpenDevice() {
	const devices_list = await navigator.hid.getDevices();
	if (!devices_list.length) {
		console.log("No Device Connected");
		document.getElementById('consoleinfo').innerHTML ="🔹操作信息：" +'<br>';
		document.getElementById('consoleinfo').innerHTML += "无设备连接" + '<br>';
		return null;
	} else {
		for (var i = 0; i < devices_list.length; i++) {
			if (devices_list[i].opened && devices_list[i].productName.includes("Glab")) {
				document.getElementById('consoleinfo').innerHTML += "设备已经连接，请勿重复点击" + '<br>';
				return devices_list[i];
			} else if (devices_list[i].productName.includes("Glab")) {
				await devices_list[i].open();
				console.log("OpenDevice():", devices_list[i]);
				document.getElementById('consoleinfo').innerHTML += "已连接设备:" + devices_list[i].productName + '<br>';
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
			document.getElementById('consoleinfo').innerHTML +="断开设备:" + devices_list[i].productName + '<br>';
			return null;
		}
	}
	console.log("No Device Connected");
	document.getElementById('consoleinfo').innerHTML ="🔹操作信息：" +'<br>';
	document.getElementById('consoleinfo').innerHTML +="无设备连接" + '<br>';
}

//发送数据处理函数：进入USB ISP
async function EnterUSBISP() {
	const devices_list = await navigator.hid.getDevices();
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].opened && devices_list[i].productName.includes("Glab")) {
			const outputReportData = new Uint8Array([0xf1]);
			await senddata(devices_list[i], outputReportData);
			console.log("EnterUSBISP():", devices_list[i]);
			document.getElementById('consoleinfo').innerHTML ="🔹操作信息：" +'<br>';
			document.getElementById('consoleinfo').innerHTML +="进入USB ISP:" + devices_list[i].productName + '<br>';
			return null;
		}
	}
	console.log("No Device Connected");
	document.getElementById('consoleinfo').innerHTML ="🔹操作信息：" +'<br>';
	document.getElementById('consoleinfo').innerHTML +="无设备连接" + '<br>';
}


//发送数据处理函数：重置键盘
async function ResetKeyboard() {
	const devices_list = await navigator.hid.getDevices();
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].opened && devices_list[i].productName.includes("Glab")) {
			const outputReportData = new Uint8Array([0x3f, 0x01, 0xff]);
			await senddata(devices_list[i], outputReportData);
			console.log("ResetKeyboard():", devices_list[i]);
			document.getElementById('consoleinfo').innerHTML ="🔹操作信息：" +'<br>';
			document.getElementById('consoleinfo').innerHTML +="重置接收器：" + devices_list[i].productName + '<br>';
			setTimeout(GetKeyboardInfo, 1000);
            return null;
		}
	}
	console.log("No Device Connected");
	document.getElementById('consoleinfo').innerHTML ="🔹操作信息：" +'<br>';
	document.getElementById('consoleinfo').innerHTML +="无设备连接" + '<br>';
}

//发送数据处理函数：获取键盘信息
async function GetKeyboardInfo() {
	const devices_list = await navigator.hid.getDevices();
	for (var i = 0; i < devices_list.length; i++) {
		if (devices_list[i].opened && devices_list[i].productName.includes("Glab")) {
			const outputReportData = new Uint8Array([0x20]);
			await senddata(devices_list[i], outputReportData);
			console.log("GetKeyboardInfo():", devices_list[i]);
			document.getElementById('consoleinfo').innerHTML ="📃" + devices_list[i].productName + ' 的信息：<br>';
		}
	}
    CheckCMSISDAP();
}

//检测CMSIS-DAP是否开启
async function CheckCMSISDAP() {
    const devices_list = await navigator.hid.getDevices();
    for (var i = 0; i < devices_list.length; i++) {
        if (devices_list[i].productName == "CMSIS-DAP") {
            console.log("CMSIS-DAP启用 :", devices_list[i]);
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
		if (devices_list[i].opened && devices_list[i].productName.includes("Glab")) {
			if (cmsisdap) {
				const outputReportData = new Uint8Array([0xf3]);
				await senddata(devices_list[i], outputReportData)
			} else {
				const outputReportData = new Uint8Array([0xf2]);
				await senddata(devices_list[i], outputReportData)
			}
			console.log("EnterCMSISDAP():", devices_list[i])
			document.getElementById('consoleinfo').innerHTML ="🔹操作信息：" +'<br>';
			document.getElementById('consoleinfo').innerHTML +="固件刷写开关:" + devices_list[i].productName + '<br>';
			return null;
		}
	}
	console.log("No Device Connected");
	document.getElementById('consoleinfo').innerHTML ="🔹操作信息：" +'<br>';
	document.getElementById('consoleinfo').innerHTML +="无设备连接" + '<br>';
}

//发送数据
async function senddata(device, data) {
	if (!device) return;
	const reportId = 0x3f;
	try {
		await device.sendReport(reportId, data);
		device.oninputreport = ({device, reportId, data}) => {
			const inputdata = new Uint8Array(data.buffer);
			console.log(`Input report ${reportId} from ${device.productName}:`, inputdata);
			//console.log(`已绑定设备数量：`, inputdata[20]);
			//console.log(`绑定设备索引：`, inputdata[21]);
			var builddata = parseInt("0x" + ("0" + inputdata[15].toString(16)).slice(-2) + ("0" + inputdata[14].toString(16)).slice(-2) + ("0" + inputdata[13].toString(16)).slice(-2) + ("0" + inputdata[12].toString(16)).slice(-2)).toString(10);
			var newDate = new Date();
			newDate.setTime(builddata * 1000);
			document.getElementById('consoleinfo').innerHTML ="📃" + device.productName + ' 的信息：<br>';
			if (cmsisdap) {
				document.getElementById('consoleinfo').innerHTML += "⚠️警告：设备CMSIS-DAP刷机功能开启" + '<br>';
			}
			document.getElementById('consoleinfo').innerHTML +="已绑定设备数量：" + inputdata[20] + '<br>';
			document.getElementById('consoleinfo').innerHTML +="已绑定管道索引值：" + (inputdata[21]/2).toString(2).padStart(7, "0") + '<br>';
            document.getElementById('consoleinfo').innerHTML +="当前连接设备数量：" + inputdata[27] + '<br>';
			document.getElementById('consoleinfo').innerHTML +="当前无线通讯频道：" + inputdata[26] + '<br>';	
			document.getElementById('consoleinfo').innerHTML +="接收器硬件信息：" + ("0" + inputdata[25].toString(16).toUpperCase()).slice(-2) + ":" + ("0" + inputdata[24].toString(16).toUpperCase()).slice(-2) + ":" + ("0" + inputdata[23].toString(16).toUpperCase()).slice(-2) + ":" + ("0" + inputdata[22].toString(16).toUpperCase()).slice(-2) + '<br>';
			document.getElementById('consoleinfo').innerHTML +="接收器固件日期：" + newDate.toLocaleString () + '<br>';			
		};
	} catch (error) {
		console.error('SendReport: Failed:', error);
		document.getElementById('consoleinfo').innerHTML +='SendReport: Failed:' + error + '<br>';
	}
}

//刷新数据任务
async function refreshdata() {
	info = setInterval(GetKeyboardInfo,5000);
}

document.addEventListener('DOMContentLoaded', async () => {
    let devices = await navigator.hid.getDevices();
    if (devices.length) {
        document.getElementById('consoleinfo').innerHTML += "已接入授权HID设备" + '<br>';
        for (var i = 0; i < devices.length; i++) {
            if (devices[i].productName == "Glab 2.4G Receiver") {

                await devices[i].open();
                console.log("DOMContentLoaded & Opened Device :", devices[i]);
                document.getElementById('consoleinfo').innerHTML += "🔌自动连接设备: " + devices[i].productName + '<br>';
                setTimeout(GetKeyboardInfo, 100);
                refreshdata();
            }
        }

    }
});


if ("hid" in navigator) {
    //监听HID授权设备的接入，并连接设备
    navigator.hid.addEventListener('connect', ({ device }) => {
        console.log(`HID设备连接: ${device.productName}`);
        if (device.productName == "Glab 2.4G Receiver") {
            document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
            document.getElementById('consoleinfo').innerHTML += "🔌已授权HID设备接入" + '<br>';
            OpenDevice().then(GetKeyboardInfo)
            //setTimeout(GetKeyboardInfo, 1000);
            refreshdata();
        }
    });

    //监听HID授权设备的断开，并提示
    navigator.hid.addEventListener('disconnect', ({ device }) => {
        console.log(`HID设备断开: ${device.productName}`);
        document.getElementById('consoleinfo').innerHTML = "🔹操作信息：" + '<br>';
        document.getElementById('consoleinfo').innerHTML += "🔌已授权HID设备断开" + '<br>';
		clearInterval(info);
    });

    //监听授权设备的报告
    navigator.hid.addEventListener("inputreport", event => {
        const { data, device, reportId } = event;
        console.log(`收到inputreport数据: ${data}.`);
    });
} else {
    document.getElementById('consoleinfo').innerHTML = "🔺提示信息：" + '<br>';
    document.getElementById('consoleinfo').innerHTML += "您的浏览器不支持WebHID，请使用Chrome 89+ / Edge 89+ / Opera 75+" + '<br>';
}