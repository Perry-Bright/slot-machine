// Here is a small slot-machine game
// it must be noted that i do not promote gambling in any way


const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
   A : 2,
   B : 4,
   C : 6,
   D : 8
}

const SYMBOL_VALUES = {
   A : 5,
   B : 4,
   C : 3,
   D : 2
}


const deposit = () => {

   while (true) {
   const depositAmount = prompt("Enter a deposit amount: "); 

   // we then convert the input into and integer
   const numberDepositAmount = parseFloat(depositAmount);

   if (isNaN(numberDepositAmount) || numberDepositAmount <= 0 ) {
      console.log("invalid deposit amount, please try again");
      } 
      else {
         return numberDepositAmount;
      }  
   }

};


const getNumberOfLines = () => {
   while (true) {
      const lines = prompt("enter the number of lines to bet on (1-3): ");
      const numberOfLines = parseInt(lines);

      if (isNaN(numberOfLines) || numberOfLines <=0 || numberOfLines > 3) {
         console.log("Invalid number of lines, please try again ");

      } else {
         return numberOfLines;
      }
   }

};


const getBet = (balance, lines) => {
   while (true) {
      const bet = prompt("Enter the bet per line: ");
      const numberBet = parseFloat(bet);

      if(isNaN(numberBet) || numberBet <= 0 || numberBet >= (balance/lines)) {
         console.log("You don't have enough balance to bet ");
      } else {
         return numberBet;
      }
   }
};

// function to spin the wheel
const spin = () => {
   const symbols = [];
   for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
      // console.log(symbol, count);
      for (let i=0; i<count; i++){
         symbols.push(symbol);
      }
      
   }
   // console.log(symbols);

   const reels = [];
   for (let i=0; i<COLS ; i++) {
      reels.push([]);
      const reelSymbols = [...symbols];
      for (let j=0; j<ROWS ; j++) {
         const randomIndex = Math.floor(Math.random()*reelSymbols.length);
         const selectedSymbol = reelSymbols[randomIndex];
         reels[i].push(selectedSymbol);
         reelSymbols.splice(randomIndex, 1);
      }
   }

   return reels;
};


// now we transpose the arrays since we need column arrays 
const transpose = (reels) => {
   const rows = [];
   for (let i=0; i<ROWS; i++) {
      rows.push([]);
      for (let j=0; j<COLS; j++) {
         rows[i].push(reels[j][i]);
      }
   }

   return rows;

};

const printRows = (rows) => {
   for (const row of rows) {
      let rowString = "";

      for(const[i, symbol] of row.entries()) {
         rowString += symbol;

         if(i != row.length - 1){
            rowString += " | ";
         }
      }
      console.log(rowString);
   }
};


// now we determining if the player won
const getWinnings = (rows, bet, lines) => {
   let winnings = 0;

   for (let row = 0; row < lines; row++) {
      const symbols = rows[row];
      let allSame = true;  

      for(const symbol of symbols){
         if (symbol != symbols[0]){
            allSame = false;
            break;
         }
   
      }
      if (allSame){
         winnings += bet * SYMBOL_VALUES[symbols[0]];
      }
   }

   return winnings;
};


// here is the overall game function 
const game = () => {
   let balance = deposit();

   while (true) {
      // console.log(reels);
      console.log("Your balance is $" + balance);
   const numberOfLines = getNumberOfLines();
   const bet = getBet(balance, numberOfLines);
   balance -= bet*numberOfLines;
   const reels = spin();
   const rows = transpose(reels);
   // console.log(reels);
   // console.log(rows);
   printRows(rows);
   const winnings = getWinnings(rows, bet, numberOfLines);
   balance += winnings;
   
   console.log("you won $", + winnings.toString());

   if (balance <= 0) {
      console.log("You ran out of money");
      break;
   } 
   console.log("your balance is : $" + balance);
   const playAgain = prompt("do you want to play again(y/n)?");

   if(playAgain != "y") break;
   }
};

game();