import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

function Sprite({ classes, poke, row, col }) {
   const { empty_, sprite_ } = classes;

   return !poke.id ? <div onClick={() => console.log({ row, col })} className={empty_} />
   : (
      <div className={sprite_}>
         <img src={poke.teamNum === 1 ? poke.image.back : poke.image.front} />
      </div>
   );
}

Sprite.propTypes = {
   poke: PropTypes.object,
   large: PropTypes.bool,
   col: PropTypes.number,
   row: PropTypes.number,
};

Sprite.defaultProps = {
   poke: { id: null },
   large: false,
   col: 0,
   row: 0,
};

const styles = {
   empty_: {
      background: 'red',
      // gridColumn: props => `${props.col} / span ${props.large ? 2 : 1}`,
      // gridRow: props => `${props.row} / span ${props.large ? 2 : 1}`,
      gridColumn: props => `${props.col} / span 1`,
      gridRow: props => `${props.row} / span 1`,
      '&:hover': {
         border: [[2, 'solid', 'blue']],
      },
   },

   sprite_: {
      '& img': {
         maxHeight: '100%',
         maxWidth: '100%',
      },
      '&:hover': {
         border: [[2, 'solid', 'blue']],
      },
   },
};

export default injectSheet(styles)(Sprite);
