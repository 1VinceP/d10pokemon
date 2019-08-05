import React, { useCallback } from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

function Sprite({ classes, poke, row, col, onClick, disabled, isAttacker }) {
   const { empty_, sprite_ } = classes;

   const handleEmptyClick = useCallback(() => {
      !disabled && onClick(false, { x: col, y: row });
   }, [onClick, col, row, disabled]);

   const handleSpriteClick = useCallback(() => {
      (!disabled || isAttacker) && onClick(true, { x: col, y: row }, poke);
   }, [onClick, col, row, poke, disabled, isAttacker]);

   return !poke.id ? <div onClick={handleEmptyClick} className={empty_} />
   : (
      <div className={sprite_} onClick={handleSpriteClick}>
         <img src={poke.teamNum === 1 ? poke.image.back : poke.image.front} alt="sprite" />
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
   poke: { id: null, localId: null, teamNum: null },
   col: 0,
   row: 0,
};

const styles = {
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
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: props => props.isAttacker && [[2, 'solid', 'green']],
      '& img': {
         maxHeight: '100%',
         maxWidth: '100%',
      },
      '&:hover': {
         border: props => !props.disabled && [[2, 'solid', 'blue']],
      },
   },
};

export default injectSheet(styles)(Sprite);
