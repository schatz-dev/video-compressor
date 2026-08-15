const { ipcRenderer } = require('electron');

let selectedFilePath = null;

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const dropZoneContent = document.getElementById('dropZoneContent');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFileBtn = document.getElementById('removeFileBtn');

const targetSizeSlider = document.getElementById('targetSizeSlider');
const targetSizeInput = document.getElementById('targetSizeInput');
const presetPills = document.querySelectorAll('.pill');
const compressBtn = document.getElementById('compressBtn');

const statusTitle = document.getElementById('statusTitle');
const statusPercentage = document.getElementById('statusPercentage');
const progressFill = document.getElementById('progressFill');
const statusSubtext = document.getElementById('statusSubtext');

// File Selection & Drag-and-Drop
dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleFile(e.target.files[0]);
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
});

function handleFile(file) {
    selectedFilePath = file.path;
    fileName.textContent = file.name;
    fileSize.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    dropZoneContent.classList.add('hidden');
    fileInfo.classList.remove('hidden');
    compressBtn.disabled = false;
    statusSubtext.textContent = `Ready to compress ${file.name}`;
}

removeFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    selectedFilePath = null;
    fileInput.value = '';
    dropZoneContent.classList.remove('hidden');
    fileInfo.classList.add('hidden');
    compressBtn.disabled = true;
    statusSubtext.textContent = 'Select a video file to begin compression.';
});

// Controls Syncing
targetSizeSlider.addEventListener('input', (e) => {
    targetSizeInput.value = e.target.value;
    updateActivePill(e.target.value);
});

targetSizeInput.addEventListener('input', (e) => {
    targetSizeSlider.value = e.target.value;
    updateActivePill(e.target.value);
});

presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
        const val = pill.getAttribute('data-size');
        targetSizeInput.value = val;
        targetSizeSlider.value = val;
        updateActivePill(val);
    });
});

function updateActivePill(value) {
    presetPills.forEach(p => {
        p.classList.toggle('active', p.getAttribute('data-size') === String(value));
    });
}

// Start Compression
compressBtn.addEventListener('click', () => {
    if (!selectedFilePath) return;

    compressBtn.disabled = true;
    statusTitle.textContent = 'Compressing...';
    statusSubtext.textContent = 'Processing video file with FFmpeg...';

    ipcRenderer.send('start-compression', {
        inputPath: selectedFilePath,
        targetSizeMB: parseFloat(targetSizeInput.value)
    });
});

// IPC Listeners
ipcRenderer.on('compression-progress', (event, percent) => {
    const currentPercent = Math.min(Math.round(percent || 0), 100);
    progressFill.style.width = `${currentPercent}%`;
    statusPercentage.textContent = `${currentPercent}%`;
});

ipcRenderer.on('compression-complete', (event, outputPath) => {
    progressFill.style.width = '100%';
    statusPercentage.textContent = '100%';
    statusTitle.textContent = 'Complete!';
    statusSubtext.textContent = `Saved to: ${outputPath}`;
    compressBtn.disabled = false;
});

ipcRenderer.on('compression-error', (event, errorMsg) => {
    statusTitle.textContent = 'Error';
    statusSubtext.textContent = errorMsg;
    compressBtn.disabled = false;
});