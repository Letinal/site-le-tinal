@echo off
REM Apercu du site en local. Il s'ouvre tout seul dans le navigateur.
REM LAISSEZ CETTE FENETRE OUVERTE tant que vous regardez le site.
cd /d "%~dp0"
if not exist node_modules ( echo Installation... & call npm install )
echo.
echo === Demarrage du site... il s'ouvre tout seul dans quelques secondes ===
echo === (Laissez cette fenetre ouverte. Fermez-la pour arreter.) ===
call npm run dev -- --open
pause
