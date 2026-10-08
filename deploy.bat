@echo off
REM Deploiement : commit + push -> Cloudflare rebuild automatiquement.
REM Double-cliquez sur ce fichier depuis l'Explorateur Windows.
cd /d "%~dp0"
echo.
echo === Mise a jour des dependances si besoin ===
if not exist node_modules ( call npm install )
echo.
echo === git add ===
git add -A
echo === git status ===
git status --short
echo === git commit ===
git commit -m "Mise a jour du site"
echo === git push ===
git push
echo.
echo === Termine : Cloudflare relance le build automatiquement ===
pause
