@echo off
echo Deploying smart contracts...
call npx hardhat run scripts/deploy.js --network localhost

echo Switching to frontend directory...
cd frontend

echo Starting React frontend in a new window...
start cmd /k "npm start"

echo Going back to root...
cd ..

pause
