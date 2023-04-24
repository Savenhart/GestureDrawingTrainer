import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
import { viewer } from "./viewer";

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true, // protect against prototype pollution
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  selectFolder(mainWindow);
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

function selectFolder(mainWindow: BrowserWindow): void {
  ipcMain.on("select-dirs", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory", "openFile", "multiSelections"],
      filters: [{ name: "Images", extensions: ["jpg", "png", "gif", "svg", "webp"] }],
    });
    //console.log('directories selected', result.filePaths);
    let imageViewer = new viewer(result.filePaths, ["jpg", "png", "gif", "svg", "webp"]);
    //console.log("getfiles : ", imageViewer.getFiles());
    mainWindow.webContents.send("imagesToDisplay", imageViewer.getFiles());
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
