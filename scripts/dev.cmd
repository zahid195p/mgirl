@echo off
rem Wrapper so the preview launcher can find Node (its PATH is otherwise stale).
set "PATH=C:\Program Files\nodejs;%PATH%"
call "C:\Program Files\nodejs\npm.cmd" run dev -- --host
