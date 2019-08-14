export default damage_class => damage_class === 'physical' ? 'defence'
   : damage_class === 'special' ? 'special-defence'
   : null;
