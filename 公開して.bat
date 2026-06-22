@echo off
cd /d "C:\Users\tosei\ai-glossary"
echo ===================================
echo   Publishing to GitHub Pages...
echo ===================================
echo.
git add -A
git commit -m "update"
git push
echo.
echo ===================================
echo   DONE! Live in 1-2 minutes.
echo ===================================
echo.
pause
