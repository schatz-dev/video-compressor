const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static').replace('app.asar', 'app.asar.unpacked');
const ffprobePath = require('ffprobe-static').path.replace('app.asar', 'app.asar.unpacked');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 700,
        resizable: false,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// IPC Handler for Compression
ipcMain.on('start-compression', (event, { inputPath, targetSizeMB }) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) {
            event.reply('compression-error', err.message);
            return;
        }

        const duration = metadata.format.duration;
        if (!duration) {
            event.reply('compression-error', 'Could not determine video duration.');
            return;
        }

        // Target size in bits / duration = total target bitrate (bps)
        const targetBitrateKbps = Math.floor(((targetSizeMB * 8 * 1024 * 1024) / duration) / 1024);
        const outputPath = path.join(
            path.dirname(inputPath),
            `${path.basename(inputPath, path.extname(inputPath))}_compressed.mp4`
        );

        ffmpeg(inputPath)
            .output(outputPath)
            .videoBitrate(`${targetBitrateKbps}k`)
            .on('progress', (progress) => {
                event.reply('compression-progress', progress.percent);
            })
            .on('end', () => {
                event.reply('compression-complete', outputPath);
            })
            .on('error', (err) => {
                event.reply('compression-error', err.message);
            })
            .run();
    });
});