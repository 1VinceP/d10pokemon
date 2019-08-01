import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import Pokemon from 'pokemon';

import Poke from './Poke';
import { fetchPoke, setMoves, deletePoke, loadPoke } from '../redux/teamReducer';
import useLocalStorage from 'react-use-localstorage';

function Team({
   classes, teamNum, team, fetching, limit,
   fetchPoke, setMoves, deletePoke, loadPoke,
}) {
   const { inputs_, loadFromStorage_ } = classes;
   /// state
   const [newName, setNewName] = useState('');
   const [newLevel, setNewLevel] = useState(0);
   const [selectedFromStorage, setSelected] = useState('');
   const [storedList] = useLocalStorage('pokeList', []);

   /// methods
   const handleChangeNewName = useCallback(e => setNewName(e.target.value.toLowerCase()), [setNewName]);

   const addNew = useCallback(() => {
      if (newName && newLevel && team.length < limit) {
         fetchPoke(newName, newLevel, teamNum);
         setNewName('');
         setNewLevel(0);
      }
   }, [fetchPoke, newName, newLevel, teamNum, team.length, limit]);

   const handleChangeNewLevel = useCallback(e => {
      if (e.target.value > 100)
         setNewLevel(100);
      else
         setNewLevel(e.target.value * 1);
   }, [setNewLevel]);

   const handleEnter = useCallback(e => {
      if (newName && newLevel)
         e.key === 'Enter' && addNew()
   }, [addNew, newName, newLevel]);

   const lockMoves = useCallback((moves, teamId, pokeId) => {
      setMoves(moves, teamId, pokeId);
   }, [setMoves]);

   const selectFromStorage = useCallback(e => {
      setSelected(e.target.value);
   }, [setSelected]);

   const getFromStorage = useCallback(() => {
      const loadedPoke = JSON.parse( window.localStorage.getItem(selectedFromStorage) );
      if( loadedPoke ) loadPoke( teamNum, loadedPoke );
      setSelected('');
   }, [loadPoke, teamNum, selectedFromStorage]);

   /// element creators
   const mappedTeam = team.map(poke => (
      <Poke
         key={poke.localId}
         poke={poke}
         teamNum={teamNum}
         lockMoves={lockMoves}
         deletePoke={deletePoke}
      />
   ));

   const pokeOptions = Pokemon.all().sort().map(poke => <option key={poke} value={poke}>{poke}</option>);
   pokeOptions.unshift(<option key="select" value="">Select</option>);

   const newPoke = (
      fetching
         ? <div key="fetching">Data retrieval in progress...</div>
         : (
            <div key="new-poke" className={inputs_}>
               {/* <input value={newName} onKeyPress={handleEnter} onChange={handleChangeNewName} /> */}
               <select onChange={handleChangeNewName}>{pokeOptions}</select>
               <input type="number" step="10" value={newLevel} onKeyPress={handleEnter} onChange={handleChangeNewLevel} placeholder="Level" />
               <button onClick={addNew}>Add</button>
            </div>
         )
   );
   mappedTeam.push(newPoke);

   const storedOptions = JSON.parse(storedList).map(poke => <option key={poke} value={poke}>{poke}</option>);
   storedOptions.unshift(<option key="select" value="">Select</option>);

   return <div>
      {mappedTeam}
      <div className={loadFromStorage_}>
         <select value={selectedFromStorage} onChange={selectFromStorage}>{storedOptions}</select>
         <button onClick={getFromStorage}>Get from storage</button>
         <div>Refresh page to see storage changes</div>
      </div>
   </div>
}

Team.propTypes = {
   teamNum: PropTypes.number,
   team: PropTypes.array,
   limit: PropTypes.number,
};

Team.defaultProps = {
   teamNum: 0,
   team: [],
   limit: 6,
};

const styles = {
   inputs_: {
      width: '100%',
      display: 'flex',
      '& input:nth-child(2)': {
         width: 40,
         textAlign: 'center',
      },
      '& input[type=number]::-webkit-inner-spin-button': {
         '-webkit-appearance': 'none',
         margin: 0,
      },
      '& input[type=number]::-webkit-outer-spin-button': {
         '-webkit-appearance': 'none',
         margin: 0,
      },
   },

   loadFromStorage_: {
      width: '100%',
      '& div': { color: '#666' },
   },
};

function mapStateToProps(state, ownProps) {
   const { teams } = state;

   return {
      team: teams[`team${ownProps.teamNum}`],
      fetching: teams.fetching,
      limit: teams.limit,
   };
}

const actions = { fetchPoke, setMoves, deletePoke, loadPoke };
export default connect(mapStateToProps, actions)(injectSheet(styles)(Team));
