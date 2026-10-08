@echo off
REM Cree la base D1 "letinal" et applique le schema.
REM A lancer UNE SEULE FOIS au depart (puis recopier le database_id dans wrangler.toml).
cd /d "%~dp0"
echo.
echo === 1) Creation de la base D1 (si pas deja fait) ===
echo    Copiez le "database_id" affiche et collez-le dans wrangler.toml, puis relancez ce fichier.
call npx wrangler d1 create letinal
echo.
echo === 2) Application du schema en LOCAL ===
call npx wrangler d1 execute letinal --local --file=./schema.sql
echo.
echo === 3) Application du schema en PRODUCTION (Cloudflare) ===
call npx wrangler d1 execute letinal --remote --file=./schema.sql
echo.
echo === Termine ===
pause
