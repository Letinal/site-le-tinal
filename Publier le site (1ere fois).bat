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

echo   Nettoyage de la connexion GitHub precedente...
cmdkey /delete:git:https://github.com >nul 2>nul
cmdkey /delete:LegacyGeneric:target=git:https://github.com >nul 2>nul
echo url=https://github.com| "%GIT%" credential reject >nul 2>nul

echo   Liaison au depot GitHub du Tinal...
"%GIT%" remote remove origin 1>nul 2>nul
"%GIT%" remote add origin https://github.com/Letinal/site-le-tinal.git
"%GIT%" branch -M main
echo.
echo   Envoi du site vers GitHub...
echo.
echo   ^>^>^> IMPORTANT : quand la fenetre GitHub s'ouvre, connectez-vous
echo       avec le compte  Letinal  (PAS un compte perso), puis Authorize.
echo.
"%GIT%" push -u origin main
if errorlevel 1 (
  echo.
  echo   [!] L'envoi a echoue.
  echo       - Si le message parle de "Permission ... denied to <autre compte>",
  echo         c'est que la connexion s'est faite avec le mauvais compte.
  echo         Prevenez Claude, on corrige en 30 secondes.
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
