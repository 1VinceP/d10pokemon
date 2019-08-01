import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';

import { setInitiative, setSelection, pushDetailLog } from '../redux/d10gameReducer';
import TurnTray from '../components/TurnTray';
import GameWindow from '../components/D10/D10Window';
import Log from '../components/Log';

function BattlePage({
   classes,
   teams, d10, setInitiative, setSelection, pushDetailLog,
}) {
	const { battle_, gameArea_, bottomTray_ } = classes;
   const actions = { setSelection, pushDetailLog };

   // effects
   useEffect(() => {
      setInitiative(teams);
   }, [setInitiative, teams]);

	return (
		<div className={battle_}>
         <section className={gameArea_}>
            <div className="window">
               <GameWindow
                  list={d10.initiative}
                  actions={actions}
                  selections={d10.selections}
                  // disabled={d10.selections.attacker && !d10.selections.attack}
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

function mapStateToProps( state ) {
	const { teams, d10 } = state;

	return {
      teams,
      d10,
	};
}

const actions = { setInitiative, setSelection, pushDetailLog };
export default connect(mapStateToProps, actions)(injectSheet(styles)(BattlePage));
