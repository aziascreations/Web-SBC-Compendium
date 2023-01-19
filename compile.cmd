@echo off

cd /D "%~dp0"

:clean
rmdir /S /Q build

:prepare-folders
mkdir build
mkdir build\resources
mkdir build\resources\sbc-compendium\css
mkdir build\resources\sbc-compendium\data
mkdir build\resources\sbc-compendium\js

:compile-typescript
echo Compiling TypeScript for ".js" files...
call node_modules\.bin\tsc

:fix-typescript-imports
echo Fixing import paths for ".js" files...
node .\tools\fix-import-paths.js "build/resources/sbc-compendium/js"

:combine-js
echo Combining JS modules into a bundle...
node .\node_modules\rollup\dist\bin\rollup ./build/resources/sbc-compendium/js/app.js --file ./build/resources/sbc-compendium/js/bundle.js --format umd --name "SBC-Compendium"

:minify-js
echo Minifying JS...
pushd %CD%
cd "build\resources\sbc-compendium\js"
call :minify-js-subroutine
popd
goto :minify-js-end
:minify-js-subroutine
for %%f in (*.js) do (
    call "%~dp0node_modules\.bin\terser" %%f --ecma 2017 --mangle -o %%~nf.min.js
)
:: TODO: Find a way to simplify templates names from the enums !
:: TODO: Remove: --keep-classnames --keep-fnames
for /D %%d in (*) do (
    cd %%d
    call :minify-js-subroutine
    cd ..
)
exit /b
:minify-js-end

:compile-json-data
echo Combining JSON data into a single blob...
python ./tools/merge-json.py "./src/data" "./build/resources/sbc-compendium/data" "data.json"
:: TODO: Minify JSON further !

:compile-sass
echo Compiling SASS...
call node_modules\.bin\sass ./src/scss/app.scss ./build/resources/sbc-compendium/css/app.css

:minify-css
echo Minifying CSS...
call node_modules\.bin\minify ./build/resources/sbc-compendium/css/app.css > ./build/resources/sbc-compendium/css/app.min.css

:copy-images
echo Copying images...
xcopy src\images build\imgs /e /i /s /Y > nul

:copy-html
echo Copying HTML files...
xcopy src\html build /e /i /s /Y > nul

:minify-html
echo Minifying HTML...
call node_modules\.bin\minify ./build/index.html > ./build/index.min.html
del /Q build\index.html
move /Y build\index.min.html build\index.html > nul
python ./tools/clean-htaccess.py "./build/.htaccess" "./build/.htaccess"

:copy-bootstrap-temp
echo Copying bootstrap files...
mkdir build\resources\bootstrap
mkdir build\resources\bootstrap\5.3.0-alpha1
xcopy resources\bootstrap\5.3.0-alpha1 build\resources\bootstrap\5.3.0-alpha1 /e /i /s /Y > nul

:end
echo Done !
echo 
::pause
