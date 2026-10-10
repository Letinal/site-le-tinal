@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Le Tinal - Envoyer sur GitHub
set "GIT=git"
where git >nul 2>nul || set "GIT=%ProgramFiles%\Git\bin\git.exe"
echo.
echo   Envoi des dernieres modifications vers GitHub...
echo.
"%GIT%" push origin main
if errorlevel 1 (
  echo.
  echo   [!] Echec de l'envoi. Verifiez la connexion / le compte GitHub Letinal.
  echo.
  pause
  exit /b
)
echo.
echo   ============================================================
echo      ENVOYE ! Cloudflare reconstruit le site automatiquement
echo      (1 a 2 minutes). Rechargez ensuite l'adresse du site.
echo   ============================================================
echo.
pause
