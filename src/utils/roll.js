export default (quantity = 1, sides = 10) => {
   const dice = [];
   for( let i = 1; i <= quantity; i++ ) {
      dice.push(Math.floor(Math.random() * sides) * quantity);
   };
}
