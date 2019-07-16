const { app, BrowserWindow } = require('electron')


// Enable live reload for Electron too
require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
});


function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    // fullscreen: true,
    backgroundColor: '#828aff',
    // frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html');

  
  // Show window when page is ready
  win.once('ready-to-show', () => {
    win.show()
  });
}

app.on('ready', createWindow);