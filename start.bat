@echo off
title Cleaning Site Server
echo ====================================================
echo Starting Cleaning Services Website
echo ====================================================

rem Create data/db directory if missing
if not exist "data\db" mkdir "data\db"

rem Check if MongoDB is already listening on 27017
powershell -Command "$c = Test-NetConnection -ComputerName 127.0.0.1 -Port 27017 -WarningAction SilentlyContinue; if (!$c.TcpTestSucceeded) { exit 1 }"
if %ERRORLEVEL% NEQ 0 (
    echo Starting local MongoDB instance...
    start /min "MongoDB Service" "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "%~dp0data\db" --bind_ip 127.0.0.1
    timeout /t 3 /nobreak >nul
) else (
    echo MongoDB is already running.
)

echo Starting Express API and Website on http://localhost:5000...
start http://localhost:5000
npm --prefix server start
