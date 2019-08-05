import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';

import { setInitiative, setSelection } from '../redux/d10gameReducer';
import { pushDetailLog } from '../redux/trackingActionsReducer';
import TurnTray from '../components/TurnTray';
import GameWindow from '../components/D10/D10Window';
import Log from '../components/Log';
import { bindActionCreators } from 'redux';

function BattlePage({
   classes,
   teams, d10, actions,
}) {
	const { battle_, gameArea_, bottomTray_ } = classes;
   // const actions = { setSelection, pushDetailLog };

   // effects
   useEffect(() => {
      actions.setInitiative(teams);
   }, [actions, teams]);

	return (
		<div className={battle_}>
         <section className={gameArea_}>
            <div className="window">
               <GameWindow
                  list={d10.initiative}
                  actions={actions}
                  selections={d10.selections}
               />
            </div>

            <div className="log">
               <Log log={d10.log} />
            </div>
         </section>

			<section className={bottomTray_}>
            <TurnTray list={d10.initiative} />
         </section>
      </div>
	);
}

const styles = theme => ({
	battle_: {
      height: '100vh',
      width: '100%',
      maxHeight: '100vh',
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
   },

   gameArea_: {
      height: '80%',
      width: '100%',
      display: 'flex',
      '& .window': {
         height: '100%',
         width: '80%',
      },
      '& .log': {
         height: '100%',
         width: '20%',
         borderLeft: [[1, 'solid', 'red']],
      },
   },

   bottomTray_: {
      height: '20%',
      width: '100%',
   },
});

function mapStateToProps({ teams, d10 }) {
	return { teams, d10 };
}

function mapDispatchToProps( dispatch ) {
   return {
      actions: bindActionCreators({
         setInitiative, setSelection, pushDetailLog
      }, dispatch),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectSheet(styles)(BattlePage));
