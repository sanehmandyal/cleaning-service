@echo off
title Cleaning Site Development Server
echo ====================================================
echo Starting Cleaning Services Site in Development Mode
echo ====================================================

if not exist "data\db" mkdir "data\db"

powershell -Command "$c = Test-NetConnection -ComputerName 127.0.0.1 -Port 27017 -WarningAction SilentlyContinue; if (!$c.TcpTestSucceeded) { exit 1 }"
if %ERRORLEVEL% NEQ 0 (
    echo Starting local MongoDB instance...
    start /min "MongoDB Service" "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "%~dp0data\db" --bind_ip 127.0.0.1
    timeout /t 3 /nobreak >nul
) else (
    echo MongoDB is already running.
)

echo Starting backend API server (:5000)...
start "Backend Dev Server" cmd /k "npm --prefix server run dev"

timeout /t 2 /nobreak >nul

echo Starting frontend Vite dev server (:5173)...
start http://localhost:5173
npm --prefix client run dev
