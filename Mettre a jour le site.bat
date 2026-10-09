@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Le Tinal - Mettre a jour le site
echo.
echo   ============================================================
echo      MISE A JOUR DU SITE LE TINAL
echo   ============================================================
echo.
where git >nul 2>nul
if errorlevel 1 (
  echo   [X] Git n'est pas installe sur cet ordinateur.
  echo       Telechargez "Git pour Windows" : https://git-scm.com/download/win
  echo       Installez-le ^(tout par defaut^), puis relancez ce bouton.
  echo.
  pause
  exit /b
)
echo   Enregistrement de vos modifications...
git add -A
git diff --cached --quiet
if %errorlevel%==0 (
  echo.
  echo   Rien de nouveau a publier : le site est deja a jour.
  echo.
  pause
  exit /b
)
echo.
set "MSG="
set /p "MSG=  En deux mots, qu'avez-vous change ^(ou Entree^) : "
if "%MSG%"=="" set "MSG=Mise a jour du site"
git commit -m "%MSG%" >nul
echo.
echo   Envoi en ligne...
git push
if errorlevel 1 (
  echo.
  echo   [!] L'envoi a echoue.
  echo       - 1ere utilisation ^? Une fenetre de connexion GitHub a pu
  echo         s'ouvrir : connectez-vous avec le compte du Tinal, puis
  echo         relancez ce bouton.
  echo       - Sinon verifiez votre connexion Internet.
  echo.
  pause
  exit /b
)
echo.
echo   ============================================================
echo      C'EST PUBLIE !
echo      Le site se met a jour tout seul en 1 a 2 minutes.
echo   ============================================================
echo.
pause
