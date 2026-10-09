@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Le Tinal - Installer les boutons sur le Bureau
echo.
echo   Creation des boutons du Tinal sur le Bureau...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws=New-Object -ComObject WScript.Shell; $dsk=[Environment]::GetFolderPath('Desktop'); $dir='%~dp0'.TrimEnd('\'); $ico=Join-Path $dir 'tinal.ico'; function mk($n,$b){ $s=$ws.CreateShortcut((Join-Path $dsk ($n+'.lnk'))); $s.TargetPath=(Join-Path $dir $b); $s.WorkingDirectory=$dir; $s.IconLocation=$ico; $s.Save() }; mk 'Le Tinal - Mettre a jour le site' 'Mettre a jour le site.bat'; mk 'Le Tinal - Apercu du site' 'Apercu local du site.bat'"
echo.
echo   Termine ! Deux boutons avec l'icone du Tinal sont sur le Bureau :
echo     - "Le Tinal - Mettre a jour le site"
echo     - "Le Tinal - Apercu du site"
echo.
pause
