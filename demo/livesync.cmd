@ECHO OFF
CLS

CALL tns plugin remove nativescript-enumerable
CALL tns plugin add ..\plugin

CALL tns livesync --watch
