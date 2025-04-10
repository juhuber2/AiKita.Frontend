// Datei: main.js (Electron Main Process)
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  //mainWindow.loadURL('http://localhost:4200'); // Angular Dev Server
  mainWindow.loadFile(path.join(__dirname, 'dist/ai-kita-electron/index.html'));

}

app.whenReady().then(() => {
  // SQLite DB erstellen (oder öffnen)
  db = new sqlite3.Database(path.join(app.getPath('userData'), 'localdata.db'), (err) => {
    if (err) console.error('DB Fehler:', err);
    else {
      console.log('SQLite DB verbunden.');
      db.run("CREATE TABLE IF NOT EXISTS personen (id INTEGER PRIMARY KEY, name TEXT)");
      db.run("CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY, personId INTEGER, inhalt TEXT, zeitpunkt TEXT)");
    }
  });
  app.whenReady().then(createWindow);
  //createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Event: Person speichern
ipcMain.handle('save-person', async (event, name) => {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO personen (name) VALUES (?)", [name], function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, name });
    });
  });
});

// IPC Event: Log speichern
ipcMain.handle('save-log', async (event, log) => {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO logs (personId, inhalt, zeitpunkt) VALUES (?, ?, ?)",
      [log.personId, log.inhalt, log.zeitpunkt], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...log });
      });
  });
});
