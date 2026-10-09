@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Le Tinal - Publier le site (1ere fois)
echo.
echo   ============================================================
echo      PREMIERE PUBLICATION DU SITE LE TINAL
echo   ============================================================
echo.
set "GIT=git"
where git >nul 2>nul || set "GIT=%ProgramFiles%\Git\bin\git.exe"
echo   Liaison au depot GitHub du Tinal...
"%GIT%" remote remove origin 1>nul 2>nul
"%GIT%" remote add origin https://github.com/Letinal/site-le-tinal.git
"%GIT%" branch -M main
echo.
echo   Envoi du site vers GitHub...
echo   (Si une fenetre GitHub s'ouvre : connectez-vous au compte du Tinal
echo    puis cliquez Authorize. Une seule fois.)
echo.
"%GIT%" push -u origin main
if errorlevel 1 (
  echo.
  echo   [!] L'envoi a echoue.
  echo       - Verifiez que le depot "site-le-tinal" existe bien sur GitHub.
  echo       - Ou terminez la connexion GitHub dans la fenetre ouverte, puis relancez.
  echo.
  pause
  exit /b
)
echo.
echo   ============================================================
echo      C'EST EN LIGNE SUR GITHUB !
echo      Prevenez Claude : on branche Cloudflare ensuite.
echo   ============================================================
echo.
pause
