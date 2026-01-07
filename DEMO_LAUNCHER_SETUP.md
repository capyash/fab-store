# Demo Launcher Setup Guide

## Quick Start

### Option 1: Use Batch File Directly (Simplest)

1. **Double-click** `Start Demo.bat` in the project folder
2. That's it! The script handles everything automatically.

### Option 2: Create Desktop Shortcut with Icon

1. **Right-click** `Start Demo.bat` → **Send to** → **Desktop (create shortcut)**
2. **Right-click** the shortcut on your desktop → **Properties**
3. Click **"Change Icon"** button
4. Choose an icon:
   - Browse to `C:\Windows\System32\shell32.dll` for system icons
   - Or use any `.ico` file
   - Recommended icons: #137 (rocket), #238 (globe), #14 (computer)
5. Click **OK** → **Apply** → **OK**
6. **Rename** the shortcut to "Start Cogniclaim Demo" (optional)

### Option 3: Use VBScript Wrapper (For Custom Icons)

1. **Right-click** `Start Demo.vbs` → **Send to** → **Desktop (create shortcut)**
2. **Right-click** the shortcut → **Properties** → **Change Icon**
3. Choose your icon and apply
4. Double-click the shortcut to launch

## Troubleshooting

### "Nothing happens when I double-click"

**Possible causes:**
1. **Node.js not installed**
   - Install from: https://nodejs.org
   - Restart your computer after installation

2. **File association issue**
   - Right-click the file → **Open with** → **Command Prompt**
   - Or run from Command Prompt: `cd path\to\project` then `"Start Demo.bat"`

3. **Antivirus blocking**
   - Some antivirus software blocks batch files
   - Add an exception for the project folder

4. **PowerShell execution policy**
   - Open PowerShell as Administrator
   - Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### "Dev server fails to start"

**Check:**
- Port 5173 is not already in use
- Node.js and npm are properly installed
- Dependencies are installed (`npm install` completed)
- Check the dev server window for error messages

### "Ngrok doesn't work"

**Solutions:**
- Install ngrok from: https://ngrok.com/download
- Add ngrok.exe to your system PATH
- Or place ngrok.exe in the project folder
- The script will work with localhost if ngrok is unavailable

## First Time Setup

The script automatically:
- ✅ Checks for Node.js
- ✅ Installs npm dependencies if needed
- ✅ Detects if ngrok is installed
- ✅ Offers to install ngrok or continue with localhost
- ✅ Starts all services
- ✅ Opens your browser automatically

## Manual Start (If Script Fails)

If the launcher doesn't work, you can start manually:

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start ngrok (optional)
ngrok http 5173 --domain=india-pikelike-margurite.ngrok-free.dev
```

Then open: http://localhost:5173

## Icon Resources

You can download free icons from:
- https://www.iconfinder.com
- https://www.flaticon.com
- Use system icons from `C:\Windows\System32\shell32.dll`

Save as `.ico` format and assign to your shortcut.

