import roll from './roll';
import calcAttackDice from '../lookups/attackDiceChart.lookup';
import calcDefence from '../lookups/defence.lookup';
import calcEffectiveness, { diceBonus } from '../lookups/effectiveness.lookup';
import mapDamageType from '../lookups/mapDamageType.lookup';

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

   // const attackerPower = attack.damage_class === 'physical' ? attacker.currentStats.attack
   //    : attack.damage_class === 'special' ? attacker.currentStats['special-attack']
   //    : null;
   const attackerPower = attacker.currentStats[mapDamageType(attack.damage_class.name)];
   const attackPower = attackerPower
      ? (attackerPower + attack.power) / 2
      : null;
   attackDice += calcAttackDice(attackPower);

   // STAB
   if( attacker.types.findIndex(type => type === attack.type.name) >= 0 ) {
      STAB = diceBonus(attackDice);
      attackDice += STAB;
   }

   function dealTargetDamage( target ) {
      const reduction = calcDefence(target.currentStats[mapDamageType(attack.damage_class.name)]);
      const [effectivenessBonus, effectivePhrase] = calcEffectiveness(attack, target);
      // add effectivenessBonus to current attackDice
      attackDice += diceBonus(attackDice, effectivenessBonus);

      // get dice rolls
      const damageDice = roll(attackDice);
      const critDice = damageDice.filter(die => die === 10).map(die => roll());
      // calc total damage numbers and then calc crit damage numbers
      const damage = damageDice.reduce((total, next) => total += next, 0);
      const critDamage = critDice.reduce((total, next) => total += next, 0);
      // combine damage and crit
      const combinedDamage = damage + critDamage;
      // reduce damage by target defence
      const totalDamage = combinedDamage - reduction;

      return {
         target: {
            ...target,
            currentStats: { ...target.currentStats, hp: target.currentStats.hp - totalDamage },
         },
         crit: critDamage > 0;
         STAB,
         reduction,
         critDamage,
         totalDamage,
         effectivPhrase,
      };
   }

   const responseData = {};
   if( attack.target === 'selected-pokemon' ) {
      responseData.targets = dealDamage(targets[0]);
   }
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
