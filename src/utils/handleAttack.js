import roll from './roll';
import calcAttackDice from '../lookups/attackDiceChart.lookup';

export default (type) => {
   switch( type ) {
      case 'd10':
         return (...args) => d10Fight(args);

      default:
         return () => response({ error: 'Attack failed by default', status: 40 });
   }
};

function response({
   attacker = {}, attack = {}, targets = [],
   error = '', status = 20, totalDamage = 0,
   STAB = 0,
}) {
   return {
      attacker,
      attack,
      targets,
      error,
      status,
      totalDamage,
      STAB,
   };
};

function d10Fight( { attacker, attack, targets }, settings ) {
   const { autoRoll } = settings;
   let attackDice = 0;
   let STAB = 0;

   const attackerPower = attack.damage_class === 'physical' ? attacker.currentStats.attack
      : attack.damage_class === 'special' ? attacker.currentStats['special-attack']
      : null;
   const attackPower = attackerPower
      ? (attackerPower + attack.power) / 2
      : null;
   attackDice += calcAttackDice(attackPower);

   // STAB
   if( attacker.types.findIndex(type => type === attack.type.name) >= 0 ) {
      if( attackDice <= 3 ) STAB = 1;
      else if( attackDice <= 8 ) STAB = 2;
      else STAB = 3;

      attackDice += STAB;
   }

   function dealDamage( target ) {}

   if( attack.target === 'selected-pokemon' ) {}
   else if( attack.target === 'all-other-pokemon' ) {}
   else if( attack.target === 'all-pokemon' ) {}
   else if( attack.target === 'user' ) {}
   else {
      return response({
         attacker, attack, targets,
         error: `Target selection "${attack.target}" is not handled...`,
         status: 41,
      });
   }
}
