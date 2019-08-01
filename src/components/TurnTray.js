import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

import Poke from '../components/Poke';

function TurnTray({ classes, list }) {
   const { tray_ } = classes;

   const pokes = list.map(poke => <Poke key={poke.localId} poke={poke} teamNum={poke.teamNum} inCombat />)
   return (
      <div className={tray_}>
         {pokes}
      </div>
   );
}

TurnTray.propTypes = {
   list: PropTypes.array,
};

TurnTray.defaultProps = {
   list: [],
};

const styles = theme => ({
   tray_: {
      height: '100%',
      width: '100%',
      display: 'flex',
      overflowX: 'scroll',
      boxShadow: [['inset', 0, 0, 16, '#000']],
   },
});

export default injectSheet(styles)(TurnTray);
