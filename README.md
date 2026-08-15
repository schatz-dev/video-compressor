<div align="center">

  # Video Compressor

  **Fast, private, and effortless desktop video compression.**

  <p align="center">
    Reduce video file sizes in seconds without losing quality — 100% locally on your machine.
  </p>

</div>

---

## ✨ Features

- ⚡ **Local Processing:** Powered by embedded FFmpeg binaries. Your files never touch an external server or cloud service.
- 🎯 **Target File Size:** Specify an exact output size in MB (e.g., fit a video into 8 MB for Discord or 25 MB for Email).
- 🎛️ **Custom Modes:** Fine-tune resolution, CRF, or bitrates to achieve your preferred balance of quality and size.
- 🚀 **One-Click Presets:** Quick options for popular platforms (Discord, Email, Web).
- 📊 **Real-time Feedback:** Live progress bar with percentage tracking and inline status updates.
- 🎨 **Modern Dark UI:** Clean, responsive interface featuring custom window controls and dynamic file drop zones.

---

## 🛠️ Tech Stack

- **Framework:** [Electron](https://www.electronjs.org/)
- **Frontend:** HTML, CSS, JavaScript
- **Core Engine:** [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) with `ffmpeg-static` & `ffprobe-static`
- **Packaging:** [electron-builder](https://www.electron.build/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Development

   ```bash
   git clone https://github.com/schatz-dev/video-compressor.git
   cd video-compressor
   npm install
   npm run start
  ```

  To build the project :
  ```bash
  npm run build
