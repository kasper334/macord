const { app, BrowserWindow, Tray, Menu, nativeImage, shell } = require('electron');
const windowStateKeeper = require('electron-window-state');
const md5 = require('md5');
const discordIcon = require('../assets/discord-icon');
const settings = require('./settings');
const logger = require('./logger');

let tray;
let trayIconHash;

const createMainWindow = () => {
    const windowState = windowStateKeeper(settings.windowDimensions);

    const mainWindow = new BrowserWindow({
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
    });

    windowState.manage(mainWindow);

    mainWindow.loadURL('https://discord.com/login')
        .then(() => {
            mainWindow.webContents.setWindowOpenHandler(({ url }) => {
                shell.openExternal(url).then();
                return { action: 'deny' };
            });

            setInterval(() => {
                mainWindow.webContents.executeJavaScript(`document.querySelector('head link[rel="icon"]').href`)
                    .then((base64Img) => {
                        if (!base64Img) {
                            return;
                        }

                        const imgHash = md5(base64Img);

                        if (!tray || trayIconHash === imgHash) {
                            return;
                        }

                        const newImage = nativeImage.createFromDataURL(base64Img);
                        tray.setImage(newImage.resize(settings.trayIconResizeOptions));

                        trayIconHash = imgHash;
                        logger.log('Tray icon updated');
                    });
            }, 500);
        });

    return mainWindow;
}

app.whenReady().then(() => {
    const initialTrayIcon = nativeImage.createFromDataURL(discordIcon);

    tray = new Tray(initialTrayIcon.resize(settings.trayIconResizeOptions));

    if (process.platform === 'darwin') {
        app.dock.setIcon(nativeImage.createFromPath('./assets/discord-white.png'));
    }

    const mainWindow = createMainWindow();

    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Show Macord",
            type: "normal",
            click() {
                mainWindow.show();
            }
        },
        {
            label: "Exit",
            type: "normal",
            role: "quit",
        },
    ]);

    tray.setToolTip('Macord');
    tray.setContextMenu(contextMenu);
});

app.on('window-all-closed', () => {
    app.quit();
});
