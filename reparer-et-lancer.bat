@echo off
REM Repare l installation (binaires Windows) puis lance l apercu local.
REM A double-cliquer UNE fois. Ensuite, dev.bat suffit.
cd /d "%~dp0"
echo.
echo === Nettoyage de l ancienne installation ===
if exist node_modules rmdir /s /q node_modules
if exist .astro rmdir /s /q .astro
if exist .wrangler rmdir /s /q .wrangler
if exist package-lock.json del /q package-lock.json
echo.
echo === Installation (Windows) - patientez quelques minutes ===
call npm install
echo.
echo === Demarrage du serveur ===
echo Ouvrez votre navigateur sur   http://localhost:4321
echo (laissez cette fenetre ouverte ; Ctrl+C pour arreter)
call npm run dev
pause
