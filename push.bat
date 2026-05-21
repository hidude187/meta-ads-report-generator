@echo off
cd /d C:\Users\Wahid\Desktop\claude\projects\metriquill-free
git add -A
git commit -m "fix: security + logic audit - weighted ROAS, file size limits, CSV injection, filename sanitization, name truncation, negative number clamping"
git push
