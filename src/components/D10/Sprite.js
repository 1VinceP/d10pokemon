import React, { useCallback } from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

import defaultPoke from '../../constants/defaultPoke';

function Sprite({ classes, poke, row, col, onClick, disabled, isAttacker }) {
   const { empty_, sprite_, name_, healthBar_ } = classes;

   // callbacks
   const handleEmptyClick = useCallback(() => {
      !disabled && onClick(false, { x: col, y: row });
   }, [onClick, col, row, disabled]);

   const handleSpriteClick = useCallback(() => {
      (!disabled || isAttacker) && onClick(true, { x: col, y: row }, poke);
   }, [onClick, col, row, poke, disabled, isAttacker]);

   // element creators
   const Name = () => <div className={name_}>{poke.name} ({poke.level})</div>;
   const HealthBar = () => <div className={healthBar_}><div /></div>;

   return !poke.id ? <div onClick={handleEmptyClick} className={empty_} />
   : (
      <div className={sprite_} onClick={handleSpriteClick}>
         {Name()}
         { poke.image.back && poke.teamNum === 1 ? <img src={poke.image.back} alt="sprite" />
            : poke.image.front && poke.teamNum === 2 ? <img src={poke.image.front} alt="sprite" />
            : <div>
               <p>(No image found)</p>
            </div>
         }
         {HealthBar()}
      </div>
   );
}

Sprite.propTypes = {
   onClick: PropTypes.func,
   poke: PropTypes.object,
   col: PropTypes.number,
   row: PropTypes.number,
};

Sprite.defaultProps = {
   onClick: () => {},
   poke: { ...defaultPoke },
   col: 0,
   row: 0,
};

const styles = theme =>  ({
   empty_: {
      background: 'white',
      gridColumn: props => `${props.col} / span 1`,
      gridRow: props => `${props.row} / span 1`,
      '&:hover': {
         border: props => !props.disabled && [[2, 'solid', 'blue']],
      },
   },

   sprite_: {
      height: '100%',
      width: '100%',
      background: props => props.poke.currentStats.hp > 0 ? '#fff' : theme.colors.secondary,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      border: props => props.isAttacker && [[2, 'solid', 'green']],
      '& img': {
         maxHeight: '100%',
         maxWidth: '100%',
      },
      '& div': {
         fontSize: 12,
         textAlign: 'center',
      },
      '&:hover': {
         border: props => !props.disabled && [[2, 'solid', 'blue']],
      },
   },

   name_: {
      width: '100%',
      position: 'absolute',
      top: 1,
      left: 1,
      fontSize: 13,
      color: props => props.poke.currentStats.hp > 0 ? '#444' : '#fff',
   },

   healthBar_: {
      height: 3,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      border: [[1, 'solid', 'black']],
      position: 'absolute',
      bottom: 1,
      left: 0,
      '& div': {
         height: 1,
         width: props => `${Math.round((props.poke.currentStats.hp / props.poke.statsAtLevel.hp) * 100)}%`,
         background: props => {
            const { statsAtLevel: { hp: maxHp }, currentStats: { hp } } = props.poke;
            return hp >= maxHp * .66 ? 'green'
               : hp >= maxHp * .33 ? 'orange'
               : 'red';
         },
         display: props => props.poke.currentStats.hp <= 0 && 'none',
      },
   },
});

export default injectSheet(styles)(Sprite);
