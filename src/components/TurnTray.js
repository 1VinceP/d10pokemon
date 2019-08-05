import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

import Poke from './Poke/Poke';
import { setSelection } from '../redux/d10gameReducer';

function TurnTray({ classes, list, canSelectAttack, actions }) {
   const { tray_ } = classes;

   const pokes = list.map(poke => (
      <Poke
         key={poke.localId}
         poke={poke}
         teamNum={poke.teamNum}
         canSelectAttack={canSelectAttack && !!poke.movesLocked}
         actions={actions}
         inCombat
      />
   ));
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

const styles = {
   tray_: {
      height: '100%',
      width: '100%',
      display: 'flex',
      overflowX: 'scroll',
      boxShadow: [['inset', 0, 0, 16, '#000']],
   },
};

function mapStateToProps({ d10: { selections } }) {
   const canSelectAttack = !!selections.attacker && !selections.targets.length;
   return { canSelectAttack };
}

function mapDispatchToProps( dispatch ) {
   return {
      actions: bindActionCreators({ setSelection }, dispatch),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectSheet(styles)(TurnTray));
