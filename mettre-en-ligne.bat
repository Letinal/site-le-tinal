@echo off
REM === Mettre le site en ligne (Cloudflare Pages) — double-cliquez ===
cd /d "%~dp0"
if not exist node_modules ( echo Installation... & call npm install )
echo.
echo === 1/2 Construction du site ===
call npm run build
echo.
echo === 2/2 Mise en ligne ===
echo (La 1ere fois, une page Cloudflare s'ouvre dans le navigateur : cliquez sur "Allow".)
call npx wrangler pages deploy dist --project-name=le-tinal --commit-dirty=true
echo.
echo ================================================================
echo   TERMINE.  L'adresse de votre site est affichee juste au-dessus
echo   (quelque chose comme  https://le-tinal.pages.dev )
echo   Ouvrez-la dans votre navigateur.
echo ================================================================
pause
