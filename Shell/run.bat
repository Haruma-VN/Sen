@echo off

taskkill /f /im Sen.exe >nul 2>&1

echo Start building
dotnet publish 


set "makelink="
set "startsen="
set "rebuildscript="
set mypath=%~dp0

for %%x in (%*) do (
	if %%x == l ( set makelink=y )
	if %%x == s ( set startsen=y )
	if %%x == b ( set rebuildscript=y )
)

if defined rebuildscript (
	call :BUILD
)

if not exist bin\Release\net8.0\win-x64\publish\Scripts\ (
	:BUILD
	echo Building scripts
	xcopy ..\Script bin\Release\net8.0\win-x64\publish\Script\ /e /h /y >NUL
	cd bin\Release\net8.0\win-x64\publish\Script
	call link.bat >NUL
	cd %mypath:~0,-1%
	EXIT /B 0
) 

set SCRIPT="%TEMP%\%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
echo sLinkFile = "%USERPROFILE%\Desktop\Sen.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%mypath:~0,-1%\bin\Release\net8.0\win-x64\publish\Sen.exe" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%

if defined makelink (
echo Creating Sen shortcut to desktop
cscript /nologo %SCRIPT%
del %SCRIPT%
)

if defined startsen (
echo Starting Sen
start %mypath:~0,-1%\bin\Release\net8.0\win-x64\publish\Sen.exe
)

