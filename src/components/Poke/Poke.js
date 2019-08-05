import React, { useState, useCallback, useRef } from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import startCase from 'lodash/startCase';

import Attack from './Attack';

function Poke({ classes, theme, poke, teamNum, actions, inCombat, canSelectAttack }) {
	const {
		container_, nameContainer_, titleContainerBg_, titleContainer_,
		imageContainer_, attackStatContainer_, statContainer_,
		attackContainer_,
	} = classes;
	// state
	const defaultMoveDetail = poke.movesLocked
		? { ...poke.moves[0] }
		: { name: '', damage_class: { name: '' }, pp: '', effect_entries: [{ short_effect: '' }] };
	const [move1, setMove1] = useState('');
	const [move2, setMove2] = useState('');
	const [move3, setMove3] = useState('');
	const [move4, setMove4] = useState('');
	const [moveDetails, setMoveDetails] = useState(defaultMoveDetail);

	// refs
	const attackDataRef = useRef();

	// callbacks
	const handleChangeMove = useCallback((e, id) => {
		const value = JSON.parse(e.target.value);
		if (id === 1) setMove1(value);
		if (id === 2) setMove2(value);
		if (id === 3) setMove3(value);
		if (id === 4) setMove4(value);
	}, []);

	const setMoves = useCallback(() => {
		const { movesLocked, localId } = poke;
		!movesLocked && actions.lockMoves([move1, move2, move3, move4], teamNum, localId, poke.name);
	}, [actions, move1, move2, move3, move4, teamNum, poke]);

	const onDelete = useCallback(() => {
		actions.deletePoke(teamNum, poke.localId);
		actions.pushDetailLog(`${poke.name} deleted from Team${teamNum}`);
	}, [actions, teamNum, poke.localId, poke.name]);

	const showMoveDetails = useCallback(() => {
		if( poke.movesLocked ) {
			attackDataRef.current.style.opacity = 1;
		}
	}, [poke.movesLocked]);

	const resetMoveDetails = useCallback(() => {
		if( poke.movesLocked ) {
			attackDataRef.current.style.opacity = 0;
		}
	}, [poke.movesLocked]);

	const saveToStorage = useCallback(() => {
		const concatName = poke.name + poke.level;
		let list = JSON.parse( window.localStorage.getItem('pokeList') );
		if( !list ) list = [];
		window.localStorage.setItem( concatName, JSON.stringify(poke) );

		const index = list.findIndex( name => name === concatName );
		if( index < 0 ) {
			list.push( concatName );
			window.localStorage.setItem( 'pokeList', JSON.stringify(list) );
		}

		actions.pushDetailLog(`${poke.name} saved to storage`);
	}, [actions, poke]);

	const deleteFromStorage = useCallback(() => {
		const concatName = poke.name + poke.level;
		let list = JSON.parse( window.localStorage.getItem('pokeList') );
		if( !list ) list = [];

		window.localStorage.removeItem(concatName);
		const index = list.findIndex( name => name === concatName );
		if( index >= 0 ) {
			list.splice( index, 1 );
			window.localStorage.setItem( 'pokeList', JSON.stringify(list) );
		}

		actions.pushDetailLog(`${poke.name} deleted from storage`);
	}, [actions, poke.name, poke.level]);

	const handleSelectAttack = useCallback(move => {
		if( inCombat && canSelectAttack ) {
			actions.setSelection(move);
		}
	}, [actions, inCombat, canSelectAttack]);

	// element creators
	const headerTitles = ['', 'hp', 'atk', 'def', 'sp.atk', 'sp.def', 'spd'];
	const headers = headerTitles.map(title => (
		<div key={title} className="box head bottom right">{title}</div>
	));

	const moves = poke.moves
		.map(move => <option key={move.name} value={JSON.stringify({ ...move })}>{move.name}</option>);
	moves.unshift(<option key="select" value="">Select</option>);

	const mappedAttacks = []
	for( let i = 1; i <= 4; i++ ) {
		const move = poke.moves[i - 1];
		mappedAttacks.push(
			<Attack
				key={i}
				moveLocked={poke.movesLocked}
				content={!poke.movesLocked ? moves : { name: move.name, type: move.type }}
				onChange={e => handleChangeMove(e, i)}
				onClick={() => handleSelectAttack(move)}
				onEnter={() => poke.movesLocked && setMoveDetails(move)}
			/>
		);
	}

	return (
		<div className={container_}>
			<section className={`${nameContainer_} top bottom left`}>{poke.name} ({poke.level})</section>

			<section className={`${titleContainerBg_} top right bottom`}>
				<div className={titleContainer_}>
					{!inCombat && (
						<>
							<button onClick={saveToStorage}>Store Poke</button>
							<button onClick={deleteFromStorage}>Delete from Storage</button>
							{!poke.movesLocked && <button onClick={setMoves}>Lock Moves</button>}
							<button onClick={onDelete}>X</button>
						</>
					)}
				</div>
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

				<section ref={attackDataRef} className={attackStatContainer_}>
					<div className="title" style={{ borderBottom: `1px solid ${theme.colors[moveDetails.type]}` }}>
						{moveDetails.name}
						<div className="type" style={{ color: theme.colors[moveDetails.type] }}>{moveDetails.type}</div>
					</div>
					<div className="body">
						{/* headers */}
						<div className="box bottom right">Class</div>
						<div className="box bottom right">Power</div>
						<div className="box bottom right">Acc</div>
						<div className="box bottom right">PP</div>
						{/* stats */}
						<div className="box base bottom right">{startCase(moveDetails.damage_class.name)}</div>
						<div className="box base bottom right">{moveDetails.power || '--'}</div>
						<div className="box base bottom right">{moveDetails.accuracy || '--'}</div>
						<div className="box base bottom right">{moveDetails.pp}</div>
						{/* description */}
						<div className="box desc base">{moveDetails.effect_entries[0].short_effect}</div>
					</div>
				</section>
			</section>

			<section
				className={`${attackContainer_} left right bottom`}
				onMouseEnter={showMoveDetails}
				onMouseLeave={resetMoveDetails}
			>
				{mappedAttacks}
			</section>
		</div>
	);
}

Poke.propTypes = {
	actions: PropTypes.shape({
		lockMoves: PropTypes.func,
		deletePoke: PropTypes.func,
		pushDetailLog: PropTypes.func,
		selectAttack: PropTypes.func,
	}),
	canSelectAttack: PropTypes.bool,
	inCombat: PropTypes.bool,
	poke: PropTypes.object,
	teamNum: PropTypes.number,
};

Poke.defaultProps = {
	actions: {
		lockMoves: () => {},
		deletePoke: () => {},
		pushDetailLog: () => {},
		setSelection: () => {},
	},
	canSelectAttack: false,
	inCombat: false,
	poke: {
		name: '',
		image: {},
		moves: [],
		types: [],
	},
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
			maxWidth: props => props.inCombat ? 600 : '100%',
			minWidth: props => props.inCombat ? 600 : 'auto',
			display: 'grid',
			gridTemplateRows: '30px 100px 30px',
			gridTemplateColumns: '120px auto',
			marginBottom: 20,
			position: 'relative',
			transform: props => `scale(${props.inCombat ? .8 : 1})`,
			'& .top': { borderTop: [[1, 'solid', theme.colors.secondary]] },
			'& .right': { borderRight: [[1, 'solid', theme.colors.secondary]] },
			'& .bottom': { borderBottom: [[1, 'solid', theme.colors.secondary]] },
			'& .left': { borderLeft: [[1, 'solid', theme.colors.secondary]] },
			'& .box': {
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				borderRadius: 3,
				margin: 1,
			},
			'& .base': { background: '#646464' },
		},

		nameContainer_: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			background: theme.colors.secondary,
			color: 'white',
		},

		titleContainerBg_: {
			width: '100%',
			background: theme.colors.secondary,
		},

		titleContainer_: {
			height: '100%',
			width: '100%',
			display: 'flex',
			justifyContent: 'flex-end',
			alignItems: 'center',
			padding: [[0, 20]],
			borderRadius: [[25, 0, 0, 25]],
			background: props => gradientBg(props),
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

		attackStatContainer_: {
			height: '100%',
			width: '100%',
			background: theme.colors.secondary,
			opacity: 0,
			position: 'absolute',
			top: 0,
			left: 0,
			zIndex: 10,
			display: 'flex',
			flexDirection: 'column',
			padding: 3,
			color: 'white',
			fontSize: 13,
			transition: [['.15s', 'opacity', 'ease-in-out']],
			'& .title': {
				width: '100%',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				paddingRight: 10,
				paddingBottom: 2,
				fontSize: 18,
				'& .type': { fontSize: 16 },
			},
			'& .body': {
				height: '80%',
				width: '100%',
				display: 'grid',
				gridTemplateRows: '1fr 1fr 2fr',
				gridTemplateColumns: 'repeat(4, 1fr)',
				'& .desc': {
					justifyContent: 'flex-start',
					alignItems: 'flex-start',
					gridColumn: '1 / span 4',
					padding: [[3, 6]],
				},
			},
		},

		statContainer_: {
			width: '100%',
			background: theme.colors.secondary,
			display: 'grid',
			gridTemplateRows: '1fr 1fr 2fr',
			gridTemplateColumns: '40px repeat(6, 1fr)',
			color: 'white',
			position: 'relative',
			zIndex: 8,
			'& .label': {
				fontSize: 10,
				background: theme.colors.secondary,
			},
			'& .head': { background: theme.colors.secondary },
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
		},
	};
};

export default injectSheet(styles)(Poke);
