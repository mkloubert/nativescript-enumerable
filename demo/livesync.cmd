@ECHO OFF
CLS

ECHO Remove old plugin...
CALL tns plugin remove nativescript-enumerable

CD ..
CD plugin
ECHO Rebuild plugin...
CALL tsc --declaration
ECHO Done

CD ..
CD demo

ECHO Readd plugin...
CALL tns plugin add ..\plugin

CALL tns livesync --watch
