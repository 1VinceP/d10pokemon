export const superEffectiveChart = {
   fire: ['bug', 'grass', 'ice', 'steel'],
};

export const notEffectiveChart = {
   fire: ['dragon', 'water'],
};

export const noEffectChart = {
   fire: [],
   electric: ['ground'],
   ground: ['flying'],
};

export function diceBonus(attackDice, bonus = null) {
   let increase = 0;
   if( attackDice <= 3 ) increase = 1;
   if( attackDice <= 8 ) increase = 2;
   else increase = 3;

   if( bonus !== null ) {
      if( bonus === 0.25 ) return increase - 2;
      else if( bonus === 0.5 ) return increase - 1;
      else if( bonus === 0 ) return -20;
      else if( bonus === 1 ) return 0;
      else if( bonus === 2 ) return increase;
      else if( bonus === 4 ) return increase + 1;
   }

   return increase;
};

export default (attack, target) => {
   const bonus = 1;
   const attackType = attack.type.toLowerCase();
   const defenceTypes = target.types.map(type => type.toLowerCase());
   let phrase;

   defenceTypes.forEach(type => {
      if( superEffectiveChart[attackType].includes(type) )
         bonus *= 2;
      else if( notEffectiveChart[attackType].includes(type) )
         bonus /= 2;
      else if( noEffectChart[attackType].includes(type) )
         bonus = 0;
   });

   if( bonus === 0 ) phrase = 'not effective';
   else if( bonus === 0.25 ) phrase = 'barely effective';
   else if( bonus === 0.5 ) phrase = 'not very effective';
   else if( bonus === 1 ) phrase = 'effictive';
   else if( bonus === 2 ) phrase = 'super effective';
   else if( bonus === 4 ) phrase = 'ultra effective';

   return [bonus, phrase];
};
