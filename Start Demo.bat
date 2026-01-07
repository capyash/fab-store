@echo off
REM Cogniclaim Demo Launcher for Windows
REM Author: Vinod Kumar V (VKV)
REM Handles first-time setup when ngrok is not installed

cd /d "%~dp0"
title Cogniclaim Demo Launcher
color 0B
mode con: cols=80 lines=30

REM Show splash screen
cls
echo.
echo.
echo     ╔═══════════════════════════════════════════════════════════╗
echo     ║                                                           ║
echo     ║          ╔═╗╔═╗╔╗╔╔═╗╔╦╗╔═╗╦  ╔═╗╦═╗╔╦╗╔═╗╦═╗            ║
echo     ║          ║  ║ ║║║║║╣ ║║║╠═╣║  ╠═╝╠╦╝║║║║╣ ╠╦╝            ║
echo     ║          ╚═╝╚═╝╝╚╝╚═╝╩ ╩╩ ╩╩═╝╩  ╩╚╝╩ ╩╚═╝╩╚╝            ║
echo     ║                                                           ║
echo     ║              TP FAB Agents - Demo Launcher               ║
echo     ║                                                           ║
echo     ╚═══════════════════════════════════════════════════════════╝
echo.
echo.
echo     [INFO] Initializing demo environment...
echo     [INFO] Please wait...
echo.
timeout /t 2 /nobreak >nul

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    cls
    echo.
    echo     ╔═══════════════════════════════════════════════════════════╗
    echo     ║                    ERROR                                 ║
    echo     ╚═══════════════════════════════════════════════════════════╝
    echo.
    echo     [ERROR] Node.js is not installed
    echo.
    echo     Please install Node.js from: https://nodejs.org
    echo     Then run this script again.
    echo.
    echo     Press any key to exit...
    pause >nul
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>&1
if %errorlevel% neq 0 (
    cls
    echo     [ERROR] npm is not installed
    echo.
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    cls
    echo.
    echo     ╔═══════════════════════════════════════════════════════════╗
    echo     ║              First Time Setup                            ║
    echo     ╚═══════════════════════════════════════════════════════════╝
    echo.
    echo     [INFO] Installing dependencies...
    echo     [INFO] This may take a few minutes...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo     [ERROR] Failed to install dependencies
        echo     [INFO] Check your internet connection and try again
        pause
        exit /b 1
    )
    cls
    echo.
    echo     [OK] Dependencies installed successfully!
    timeout /t 2 /nobreak >nul
)

REM Check if ngrok is installed
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    cls
    echo.
    echo     ╔═══════════════════════════════════════════════════════════╗
    echo     ║              Ngrok Not Found                               ║
    echo     ╚═══════════════════════════════════════════════════════════╝
    echo.
    echo     Ngrok allows external access to your demo.
    echo     Without it, the demo will only work on localhost.
    echo.
    echo     Options:
    echo       1. Continue with localhost only (recommended for first time)
    echo       2. Install ngrok now (requires Chocolatey)
    echo       3. Exit and install ngrok manually
    echo.
    choice /C 123 /N /M "Choose an option (1-3): "
    
    if errorlevel 3 (
        cls
        echo.
        echo     To install ngrok manually:
        echo       1. Download from: https://ngrok.com/download
        echo       2. Extract ngrok.exe to a folder in your PATH
        echo       3. Or add ngrok folder to your system PATH
        echo       4. Run this script again
        echo.
        pause
        exit /b 0
    )
    
    if errorlevel 2 (
        cls
        echo     [INFO] Attempting to install ngrok via Chocolatey...
        where choco >nul 2>&1
        if %errorlevel% equ 0 (
            choco install ngrok -y
            if %errorlevel% equ 0 (
                echo     [OK] Ngrok installed successfully
                call refreshenv >nul 2>&1
            ) else (
                echo     [WARN] Chocolatey installation failed
                echo     [INFO] Continuing with localhost only
                set NGROK_AVAILABLE=0
                goto :start_server
            )
        ) else (
            echo     [WARN] Chocolatey not found
            echo     [INFO] Please install ngrok manually from https://ngrok.com/download
            echo     [INFO] Continuing with localhost only for now
            set NGROK_AVAILABLE=0
            goto :start_server
        )
    )
    
    if errorlevel 1 (
        set NGROK_AVAILABLE=0
        goto :start_server
    )
)

REM Verify ngrok is accessible
where ngrok >nul 2>&1
if %errorlevel% equ 0 (
    set NGROK_AVAILABLE=1
) else (
    set NGROK_AVAILABLE=0
)

:start_server
cls
echo.
echo     ╔═══════════════════════════════════════════════════════════╗
echo     ║              Starting Services                            ║
echo     ╚═══════════════════════════════════════════════════════════╝
echo.

REM Check if dev server is already running
netstat -ano | findstr ":5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo     [INFO] Dev server already running on port 5173
    set DEV_URL=http://localhost:5173
    goto :start_ngrok
)

REM Start dev server
echo     [1/3] Starting dev server...
start "Cogniclaim Dev Server" cmd /k "title Cogniclaim Dev Server && color 0A && npm run dev"

REM Wait for server to be ready
echo     [2/3] Waiting for server to be ready...
set /a attempts=0
:wait_server
timeout /t 2 /nobreak >nul

REM Try multiple methods to check if server is ready
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 goto :server_ready

REM Alternative: check if port is listening
netstat -ano | findstr ":5173" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    timeout /t 3 /nobreak >nul
    curl -s http://localhost:5173 >nul 2>&1
    if %errorlevel% equ 0 goto :server_ready
)

set /a attempts+=1
if %attempts% geq 20 (
    cls
    echo.
    echo     ╔═══════════════════════════════════════════════════════════╗
    echo     ║                    ERROR                                 ║
    echo     ╚═══════════════════════════════════════════════════════════╝
    echo.
    echo     [ERROR] Dev server failed to start after 40 seconds
    echo.
    echo     Possible issues:
    echo     - Port 5173 is already in use
    echo     - Check the dev server window for errors
    echo     - Try closing other applications using port 5173
    echo.
    pause
    exit /b 1
)
echo            Still waiting... (%attempts%/20)
goto :wait_server

:server_ready
echo     [OK] Dev server ready at http://localhost:5173
set DEV_URL=http://localhost:5173

:start_ngrok
REM Try to start ngrok if available
if "%NGROK_AVAILABLE%"=="0" (
    echo.
    echo     [INFO] Skipping ngrok (not installed or unavailable)
    set FINAL_URL=%DEV_URL%
    goto :open_browser
)

echo.
echo     [3/3] Attempting to start ngrok...

REM Check if ngrok is already running
netstat -ano | findstr ":4040" >nul 2>&1
if %errorlevel% equ 0 (
    echo     [INFO] Ngrok already running, checking URL...
    timeout /t 3 /nobreak >nul
    
    REM Try to get ngrok URL using PowerShell
    for /f "delims=" %%i in ('powershell -NoProfile -Command "try { $tunnels = Invoke-RestMethod -Uri 'http://localhost:4040/api/tunnels' -ErrorAction Stop; if ($tunnels.tunnels.Count -gt 0) { Write-Output $tunnels.tunnels[0].public_url } } catch { }"') do set NGROK_URL=%%i
    
    if defined NGROK_URL (
        echo     [OK] Using existing ngrok tunnel
        set FINAL_URL=%NGROK_URL%
        goto :open_browser
    )
)

REM Start ngrok in new window
echo     [INFO] Starting ngrok tunnel...
start "Ngrok Tunnel" cmd /k "title Ngrok Tunnel && color 0E && ngrok http 5173 --domain=india-pikelike-margurite.ngrok-free.dev"
timeout /t 5 /nobreak >nul

REM Try to get ngrok URL
set NGROK_URL=
for /f "delims=" %%i in ('powershell -NoProfile -Command "Start-Sleep -Seconds 3; try { $tunnels = Invoke-RestMethod -Uri 'http://localhost:4040/api/tunnels' -ErrorAction Stop; if ($tunnels.tunnels.Count -gt 0) { Write-Output $tunnels.tunnels[0].public_url } } catch { }"') do set NGROK_URL=%%i

if defined NGROK_URL (
    echo     [OK] Ngrok tunnel active
    set FINAL_URL=%NGROK_URL%
) else (
    echo     [WARN] Ngrok may not have started properly
    echo     [INFO] Using localhost fallback
    set FINAL_URL=%DEV_URL%
)

:open_browser
cls
echo.
echo.
echo     ╔═══════════════════════════════════════════════════════════╗
echo     ║                                                           ║
echo     ║              ✅ Demo is Ready!                            ║
echo     ║                                                           ║
echo     ╚═══════════════════════════════════════════════════════════╝
echo.
echo.

if "%FINAL_URL%"=="%DEV_URL%" (
    echo     Local URL:  %FINAL_URL%
    echo.
    echo     [INFO] Demo is running on localhost only
    echo     [INFO] To enable external access, install ngrok:
    echo            https://ngrok.com/download
) else (
    echo     Public URL: %FINAL_URL%
    echo     Local URL:  %DEV_URL%
    echo.
    echo     [INFO] Demo is accessible externally via ngrok
)

echo.
echo     [INFO] Opening browser...
echo.
timeout /t 2 /nobreak >nul

REM Open browser
start "" "%FINAL_URL%"

echo.
echo     ╔═══════════════════════════════════════════════════════════╗
echo     ║              Demo Running                                ║
echo     ╚═══════════════════════════════════════════════════════════╝
echo.
echo     [INFO] Two windows are open:
echo            - Cogniclaim Dev Server (don't close)
echo            - Ngrok Tunnel (if ngrok is running)
echo.
echo     [INFO] Press any key to stop all services and exit...
echo.

pause >nul

REM Cleanup
cls
echo.
echo     [INFO] Stopping services...
taskkill /FI "WINDOWTITLE eq Cogniclaim Dev Server*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Ngrok Tunnel*" /T /F >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM ngrok.exe >nul 2>&1

echo     [OK] All services stopped
timeout /t 2 /nobreak >nul
exit
