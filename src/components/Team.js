import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

import Poke from './Poke';
import { fetchPoke, setMoves, deletePoke } from '../redux/teamReducer';

function Team({
  classes, teamNum, team, fetching, limit,
  fetchPoke, setMoves, deletePoke,
}) {
  const { inputs_ } = classes;
  /// state
  const [newName, setNewName] = useState('');
  const [newLevel, setNewLevel] = useState(0);

  /// methods
  const handleChangeNewName = useCallback(e => setNewName( e.target.value.toLowerCase() ), [setNewName]);

  const addNew = useCallback(() => {
    if( newName && newLevel && team.length < limit ) {
      fetchPoke( newName, Math.floor(newLevel / 10) * 10, teamNum );
      setNewName('');
      setNewLevel(0);
    }
  }, [fetchPoke, newName, newLevel, teamNum, team.length, limit]);

  const handleChangeNewLevel = useCallback(e => {
    if( e.target.value > 100 )
      setNewLevel(100);
    else
      setNewLevel(e.target.value * 1);
  }, [setNewLevel]);

  const handleEnter = useCallback(e => {
    if( newName && newLevel )
      e.key === 'Enter' && addNew()
  }, [addNew, newName, newLevel]);

  const lockMoves = useCallback((moves, teamId, pokeId) => {
    setMoves(moves, teamId, pokeId);
  }, [setMoves]);

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
  const newPoke = (
    fetching
    ? <div key="fetching">Data retrieval in progress...</div>
    : (
      <div key="new-poke" className={inputs_}>
        <input value={newName} onKeyPress={handleEnter} onChange={handleChangeNewName} />
        <input type="number" step="10" value={newLevel} onKeyPress={handleEnter} onChange={handleChangeNewLevel} placeholder="Level" />
        <button onClick={addNew}>Add</button>
      </div>
    )
  );
  mappedTeam.push(newPoke);

  return <div>{mappedTeam}</div>
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
};

function mapStateToProps( state, ownProps ) {
  const { teams } = state;

  return {
    team: teams[`team${ownProps.teamNum}`],
    fetching: teams.fetching,
    limit: teams.limit,
  };
}

const actions = { fetchPoke, setMoves, deletePoke };
export default connect( mapStateToProps, actions )( injectSheet(styles)(Team) );
