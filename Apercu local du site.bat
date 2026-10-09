@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Le Tinal - Apercu local du site
if not exist node_modules (
  echo   Premiere utilisation : installation en cours ^(quelques minutes^)...
  call npm install
)
echo.
echo   Le site va s'ouvrir dans votre navigateur.
echo   LAISSEZ CETTE FENETRE OUVERTE tant que vous regardez le site.
echo   Fermez-la ^(ou Ctrl+C^) pour arreter l'apercu.
echo.
call npm run dev -- --open
pause
