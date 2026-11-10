@echo off
echo Starting Ignite App (Frontend + Backend)...

:: Start Backend
start "Ignite Backend" cmd /k "cd backend && npm run dev"

:: Start Frontend
start "Ignite Frontend" cmd /k "cd frontend && npm run dev"

echo Both services started!
