import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setInitiative } from '../redux/d10gameReducer';
import injectSheet from 'react-jss';

import TurnTray from '../components/TurnTray';

function BattlePage({
   classes,
   teams, d10, setInitiative,
}) {
	const { battle_, gameArea_, bottomTray_ } = classes;

   // effects
   useEffect(() => {
      setInitiative(teams);
   }, []);

	return (
		<div className={battle_}>
         <section className={gameArea_}></section>

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

const actions = { setInitiative };
export default connect(mapStateToProps, actions)(injectSheet(styles)(BattlePage));
