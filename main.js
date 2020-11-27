// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, globalShortcut} = require('electron')
const path = require('path')
const prompt = require('electron-prompt');


let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  
globalShortcut.register('f5', function() {
	mainWindow.reload()
})

globalShortcut.register('CommandOrControl+R', function() {
	mainWindow.reload()
})
	
 prompt({
	title: 'Enter you back office address',
	label: 'URL:',
	value: 'https://demo.livehelperchat.com/index.php/site_admin',
	inputAttrs: { // attrs to be set if using 'input'
		type: 'url'
	},
	type: 'input', // 'select' or 'input, defaults to 'input'
})
.then((r) => {
	if(r === null) {
		console.log('user cancelled');
	} else {
		mainWindow.loadURL(r);
	}
})
.catch(console.error);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

function createMainMenu() {
  const template = [
    {
      label: "Menu",
      submenu: [
        {
          label: "Go to back office",
          click() {
            prompt({
				title: 'Enter you back office address',
				label: 'URL:',
				value: 'https://demo.livehelperchat.com/index.php/site_admin',
				inputAttrs: { // attrs to be set if using 'input'
					type: 'url'
				},
				type: 'input', // 'select' or 'input, defaults to 'input'
			})
			.then((r) => {
				if(r === null) {
					console.log('user cancelled');
				} else {
					mainWindow.loadURL(r);
				}
			})
			.catch(console.error);
          }
        },
		{
          label: "Dev tools",
          click() {
            mainWindow.webContents.openDevTools()
          }
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  createMainMenu();
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
