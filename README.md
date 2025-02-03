# To run:

### In the folder of the project type in the cmd:
### npm install
### npx hardhat node
### Open another cmd and write
### .\run.bat






# **Partea 1:** *Implementarea smart-contractelor*:

## ${\color{red}Cerințe \space obligatorii:}$

1.**Utilizarea tipurilor de date specifice Solidity (mappings, address)**.

https://github.com/Bogosanu/ProiectBlockchain/blob/32723a4d3d66428947c7261b235acb25d423849a/Contracts/Twoerr.sol#L8-L17

2.**înregistrarea de events**.

https://github.com/Bogosanu/ProiectBlockchain/blob/32723a4d3d66428947c7261b235acb25d423849a/Contracts/Twoerr.sol#L44-L49

3.**Utilizarea de modifiers**.

https://github.com/Bogosanu/ProiectBlockchain/blob/32723a4d3d66428947c7261b235acb25d423849a/Contracts/Twoerr.sol#L57-L61
https://github.com/Bogosanu/ProiectBlockchain/blob/32723a4d3d66428947c7261b235acb25d423849a/Contracts/Twoerr.sol#L63-L76

4. **Exemple pentru toate tipurile de funcții (external, pure, view etc.)**

https://github.com/Bogosanu/ProiectBlockchain/blob/32723a4d3d66428947c7261b235acb25d423849a/Contracts/Twoerr.sol#L63-L76
https://github.com/Bogosanu/ProiectBlockchain/blob/32723a4d3d66428947c7261b235acb25d423849a/Contracts/Twoerr.sol#L108-L122
https://github.com/Bogosanu/ProiectBlockchain/blob/32723a4d3d66428947c7261b235acb25d423849a/Contracts/Twoerr.sol#L143-L153
https://github.com/Bogosanu/ProiectBlockchain/blob/b8e50f9078023b6a5fdc3167f4822e7737dd0cad/Contracts/Twoerr.sol#L120-L132

5.**Exemple de transfer de eth.**

https://github.com/Bogosanu/ProiectBlockchain/blob/32723a4d3d66428947c7261b235acb25d423849a/Contracts/Twoerr.sol#L84-L107
https://github.com/Bogosanu/ProiectBlockchain/blob/32723a4d3d66428947c7261b235acb25d423849a/Contracts/Twoerr.sol#L108-L122

6.**Ilustrarea interacțiunii dintre smart contracte.**
https://github.com/Bogosanu/ProiectBlockchain/blob/32723a4d3d66428947c7261b235acb25d423849a/Contracts/Twoerr.sol#L40-L42

7.**Deploy pe o rețea locală sau pe o rețea de test Ethereum.**
https://github.com/Bogosanu/ProiectBlockchain/blob/32723a4d3d66428947c7261b235acb25d423849a/scripts/deploy.js#L1-L78

## ${\color{green}Cerințe \space opționale:}$
1.Utilizare librării 
https://github.com/Bogosanu/ProiectBlockchain/blob/32723a4d3d66428947c7261b235acb25d423849a/Contracts/TwoerrCoin.sol#L4-L6

2.Implementarea de teste (cu tool-uri la alegerea echipelor).
https://github.com/Bogosanu/ProiectBlockchain/blob/32723a4d3d66428947c7261b235acb25d423849a/test/App.test.js#L1-L120

3.Implementarea de standarde ERC.
https://github.com/Bogosanu/ProiectBlockchain/blob/32723a4d3d66428947c7261b235acb25d423849a/Contracts/TwoerrCoin.sol#L4-L6

4.Utilizarea de Oracles.
https://github.com/Bogosanu/ProiectBlockchain/blob/32723a4d3d66428947c7261b235acb25d423849a/Contracts/Conversion.sol#L2-L39

# **Partea 2:** *Interacțiunea cu blockchain printr-o aplicație web3*

## ${\color{red}Cerințe \space obligatorii:}$

1.Utilizarea unei librării web3 (exemple web3 sau ethersjs) și conectarea cu un
Web3 Provider pentru accesarea unor informații generale despre conturi
(adresa, balance)

https://github.com/Bogosanu/ProiectBlockchain/blob/e923de75b0627210c770b97c0e7408972fd2628a/frontend/src/App.js#L2
https://github.com/Bogosanu/ProiectBlockchain/blob/e923de75b0627210c770b97c0e7408972fd2628a/frontend/src/App.js#L22
https://github.com/Bogosanu/ProiectBlockchain/blob/e923de75b0627210c770b97c0e7408972fd2628a/frontend/src/App.js#L44-L45

2.Inițierea tranzacțiilor de transfer sau de apel de funcții, utilizând clase din
librăriile web3.
https://github.com/Bogosanu/ProiectBlockchain/blob/e923de75b0627210c770b97c0e7408972fd2628a/frontend/src/RegisterClient.js#L42-L78
https://github.com/Bogosanu/ProiectBlockchain/blob/e923de75b0627210c770b97c0e7408972fd2628a/frontend/src/ServiceDetail.js#L96-L112

## ${\color{green}Cerințe \space opționale:}$
1.Tratare events (Observer Pattern).
https://github.com/Bogosanu/ProiectBlockchain/blob/e923de75b0627210c770b97c0e7408972fd2628a/frontend/src/App.js#L122-L141

2.Analiza gas-cost (estimare cost și fixare limită de cost).
https://github.com/Bogosanu/ProiectBlockchain/blob/e923de75b0627210c770b97c0e7408972fd2628a/scripts/deploy.js#L12-L16

3.Control al stării tranzacțiilor (tratare excepții)
https://github.com/Bogosanu/ProiectBlockchain/blob/e923de75b0627210c770b97c0e7408972fd2628a/Contracts/Twoerr.sol#L114-L119
