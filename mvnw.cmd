@echo off
setlocal
if not defined JAVA_HOME set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.11"
set "PATH=%SystemRoot%\System32;%SystemRoot%;%SystemRoot%\System32\Wbem;%SystemRoot%\System32\WindowsPowerShell\v1.0\;C:\Program Files\Java\jdk-21.0.11\bin;D:\Utility\apache-maven-3.9.14\bin;D:\IntelliJ\IntelliJ IDEA 2025.3.1\plugins\maven\lib\maven3\bin;%PATH%"

where mvn >nul 2>nul
if %errorlevel% equ 0 (
    call mvn %*
    exit /b %errorlevel%
)

if exist "D:\Utility\apache-maven-3.9.14\bin\mvn.cmd" (
    call "D:\Utility\apache-maven-3.9.14\bin\mvn.cmd" %*
    exit /b %errorlevel%
)

if exist "D:\IntelliJ\IntelliJ IDEA 2025.3.1\plugins\maven\lib\maven3\bin\mvn.cmd" (
    call "D:\IntelliJ\IntelliJ IDEA 2025.3.1\plugins\maven\lib\maven3\bin\mvn.cmd" %*
    exit /b %errorlevel%
)

echo [ERROR] Maven not found. Please verify Maven installation.
exit /b 1
