// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, MenuItem, Tray, ipcMain} = require('electron')


var menu;

ipcMain.on('init-message', (event, arg) => {
  // console.log(arg) // prints "ping"
  event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('SERVICE_NAME', (event, arg) => {

  menu.destroy()
  tray.destroy()
  
  createTray(lastService=arg)

  // event.sender.send('asynchronous-reply', 'pong')
})

function createTray(lastService=null){
  tray = new Tray('./picksmall24x24.png')
  menu = new Menu()
    // const menu = Menu.buildFromTemplate([
  //   {label: 'Item1', type: 'radio'},
  //   {label: 'Item2', type: 'radio'},
  //   {label: 'Item3', type: 'radio', checked: true},
  //   {label: 'Item4', type: 'radio'}
   
  // ])
  menu.append(new MenuItem({id: 'lastService', label: lastService == null ? '--' : lastService }))
  menu.append(new MenuItem({type: 'separator'}))
  menu.append(new MenuItem({label: 'Quit', click() {
     app.quit()
    }}))
  

  tray.setToolTip('systemd Journeyman ----')
  tray.setContextMenu(menu)
}
let tray = null
app.on('ready', () => {
  
  createTray()

})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadFile('app/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)



// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
