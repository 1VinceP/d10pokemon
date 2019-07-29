import React, { useState, useCallback } from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

function Poke({ classes, poke, teamNum, lockMoves, deletePoke }) {
  const {
    container_, nameContainer_, titleContainer_,
    imageContainer_, statContainer_, attackContainer_,
  } = classes;
  const [move1, setMove1] = useState('');
  const [move2, setMove2] = useState('');
  const [move3, setMove3] = useState('');
  const [move4, setMove4] = useState('');

  const handleChangeMove = useCallback(( e, id ) => {
    const value = JSON.parse(e.target.value);
    console.log(value);
    if( id === 1 ) setMove1(value);
    if( id === 2 ) setMove2(value);
    if( id === 3 ) setMove3(value);
    if( id === 4 ) setMove4(value);
  }, []);

  const setMoves = useCallback(() => {
    const { movesLocked, localId } = poke;
    !movesLocked && lockMoves([move1, move2, move3, move4], teamNum, localId);
  }, [lockMoves, move1, move2, move3, move4, teamNum, poke]);

  const onDelete = useCallback(() => {
    deletePoke(teamNum, poke.localId);
  }, [deletePoke, teamNum, poke.localId]);

  const headerTitles = ['', 'hp', 'atk', 'def', 'sp.atk', 'sp.def', 'spd'];
  const headers = headerTitles.map(title => (
    <div key={title} className="box head bottom right">{title}</div>
  ));

  const moves = poke.moves
    .map(move => <option key={move.name} value={JSON.stringify({ ...move })}>{move.name}</option>);
  moves.unshift(<option key="select" value="">Select</option>);

  return (
    <div className={container_}>
      <section className={`${nameContainer_} top bottom left`}>{poke.name} ({poke.level})</section>

      <section className={`${titleContainer_} top right bottom`}>
        <button onClick={setMoves}>Lock Moves</button>
        Stats
        <button onClick={onDelete}>X</button>
      </section>

      <section className={`${imageContainer_} right bottom left`}>
        <img src={poke.image.front} alt="poke" />
      </section>

      <section className={statContainer_}>
        {headers}
        {/* base stats */}
        <div className="box label bottom right">BASE</div>
        <div className="box base bottom right">{poke.baseStats.hp}</div>
        <div className="box base bottom right">{poke.baseStats.attack}</div>
        <div className="box base bottom right">{poke.baseStats.defense}</div>
        <div className="box base bottom right">{poke.baseStats['special-attack']}</div>
        <div className="box base bottom right">{poke.baseStats['special-defense']}</div>
        <div className="box base bottom right">{poke.baseStats.speed}</div>
        {/* stats at level */}
        <div className="box label bottom right">LEVEL</div>
        <div className="box level bottom right">{poke.statsAtLevel.hp}</div>
        <div className="box level bottom right">{poke.statsAtLevel.attack}</div>
        <div className="box level bottom right">{poke.statsAtLevel.defense}</div>
        <div className="box level bottom right">{poke.statsAtLevel['special-attack']}</div>
        <div className="box level bottom right">{poke.statsAtLevel['special-defense']}</div>
        <div className="box level bottom right">{poke.statsAtLevel.speed}</div>
      </section>

      {!poke.movesLocked ? (
        <section className={`${attackContainer_} left right bottom`}>
          <select onChange={e => handleChangeMove(e, 1)}>{moves}</select>
          <select onChange={e => handleChangeMove(e, 2)}>{moves}</select>
          <select onChange={e => handleChangeMove(e, 3)}>{moves}</select>
          <select onChange={e => handleChangeMove(e, 4)}>{moves}</select>
        </section>
      )
      : (
        <section className={`${attackContainer_} left right bottom`}>
          <div>{poke.moves[0].name}</div>
          <div>{poke.moves[1].name}</div>
          <div>{poke.moves[2].name}</div>
          <div>{poke.moves[3].name}</div>
        </section>
      )}
    </div>
  );
}

Poke.propTypes = {
  lockMoves: PropTypes.func,
  deletePoke: PropTypes.func,
  poke: PropTypes.object,
  teamNum: PropTypes.number,
};

Poke.defaultProps = {
  lockMoves: () => {},
  deletePoke: () => {},
  poke: { name: '', image: {}, moves: [], types: [] },
  teamNum: 0,
};

const styles = theme => {
  const gradientBg = props => {
    const first = theme.colors[props.poke.types[0]];
    const second = props.poke.types.length > 1 ? theme.colors[props.poke.types[1]] : first;
    return `linear-gradient(to right, ${first}, ${second})`;
  }

  return {
    container_: {
      width: '100%',
      display: 'grid',
      gridTemplateRows: '30px 100px 30px',
      gridTemplateColumns: '120px auto',
      marginBottom: 20,
      '& .top': { borderTop: [[1, 'solid', theme.colors.secondary]] },
      '& .right': { borderRight: [[1, 'solid', theme.colors.secondary]] },
      '& .bottom': { borderBottom: [[1, 'solid', theme.colors.secondary]] },
      '& .left': { borderLeft: [[1, 'solid', theme.colors.secondary]] },
    },

    titleContainer_: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: [[0, 20]],
      background: props => gradientBg(props),
    },

    nameContainer_: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: props => theme.colors[props.poke.types[0]],
    },

    imageContainer_: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: theme.colors.secondary,
      '& img': {
        maxHeight: '100%',
        maxWidth: '100%',
        transform: 'scale(1.2)',
      },
    },

    statContainer_: {
      width: '100%',
      background: theme.colors.secondary,
      display: 'grid',
      gridTemplateRows: '1fr 1fr 2fr',
      gridTemplateColumns: '40px repeat(6, 1fr)',
      color: 'white',
      '& .box': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        margin: 1,
      },
      '& .label': {
        fontSize: 10,
        background: theme.colors.secondary,
      },
      '& .head': { background: theme.colors.secondary },
      '& .base': { background: '#646464' },
      '& .level': { background: 'green' },
    },

    attackContainer_: {
      width: '100%',
      background: props => gradientBg(props),
      gridColumn: '1 / span 2',
      display: 'flex',
      justifyContent: 'space-around',
      padding: [[4, 0]],
      color: 'white',
      '& select, div': {
        width: '22%',
      },
      '& select': {
        background: theme.colors.secondary,
        color: 'white',
        border: 'none',
      },
      '& div': {
        textAlign: 'center',
        transition: [['.15s', 'all', 'ease-in-out']],
        '&:hover': {
          cursor: 'pointer',
          border: [[1, 'solid', 'lightblue']],
        },
      },
    },
  };
};

export default injectSheet( styles )( Poke );
