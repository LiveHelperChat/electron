// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, globalShortcut, dialog, shell} = require('electron')
const path = require('path')
const prompt = require('electron-prompt');
const Store = require('./store.js');

const contextMenu = require('electron-context-menu');

contextMenu({
	showCopyImage: true,
	showCopyImageAddress: true,
	showSaveImage: true,
	showSaveImageAs: true,
	showSaveLinkAs: true,
	showInspectElement: true
});
 
let mainWindow;

// First instantiate the class
const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    // 800x600 is the default size of our window
	defaultURL: "",
    windowBounds: { width: 1024, height: 768 }
  }
});


function createWindow () {
  
	let { width, height } = store.get('windowBounds');

	// Create the browser window.
	mainWindow = new BrowserWindow({
	backgroundColor: '#2e2c29', 
	width: width,
	height: height,
	icon: __dirname + '/favicon.ico',
		webPreferences: {
		  spellcheck: true,
		  preload: path.join(__dirname, 'preload.js')
		}
	})
	
	const webContents = mainWindow.webContents;
  
	var handleRedirect = (e, url) => {
		if (require('url').parse(url).hostname != require('url').parse(webContents.getURL()).hostname ) {
			e.preventDefault()
			require('electron').shell.openExternal(url)
		}
	}

	webContents.on('will-navigate', handleRedirect)
	webContents.on('new-window', handleRedirect)

	globalShortcut.register('f5', function() {
		mainWindow.reload()
	})

	globalShortcut.register('CommandOrControl+R', function() {
		mainWindow.reload()
	})

	globalShortcut.register('CommandOrControl+Shift+H', function() {
		prompt({
			title: 'Enter you back office address',
			label: 'URL:',
			icon: __dirname + '/logo.png',
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
				store.set('defaultURL', r);
				mainWindow.loadURL(r);
			}
		})
		.catch(console.error);
	})

	globalShortcut.register('CommandOrControl+H', function() {
		dialog.showMessageBox({
			buttons: ["OK"],
			icon: __dirname + '/logo.png',
			title : "Live Helper Chat",
			message: "Change back office URL click Control+Shift+H\nOpen dev tools Control+Shift+J"
		})
	})

	globalShortcut.register('CommandOrControl+Shift+J', function() {
		mainWindow.webContents.openDevTools()
	})

  // The BrowserWindow class extends the node.js core EventEmitter class, so we use that API
  // to listen to events on the BrowserWindow. The resize event is emitted when the window size changes.
  mainWindow.on('resize', () => {
    // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
    // the height, width, and x and y coordinates.
    let { width, height } = mainWindow.getBounds();
    // Now that we have them, save them using the `set` method.
    store.set('windowBounds', { width, height });
  });
  
  if (store.get('defaultURL') == "")
  {
	prompt({
	title: 'Enter you back office address',
	label: 'URL:',
	icon: __dirname + '/logo.png',
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
			store.set('defaultURL', r);
			mainWindow.loadURL(r);
		}
	})
	.catch(console.error);
  } else {
  	  mainWindow.loadURL(store.get('defaultURL'));
  }
  
  
  
}

function createMainMenu() {
  Menu.setApplicationMenu(null);
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
