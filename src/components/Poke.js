import React, { useState, useCallback, useRef } from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

function Poke({ classes, theme, poke, teamNum, lockMoves, deletePoke }) {
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
		!movesLocked && lockMoves([move1, move2, move3, move4], teamNum, localId);
	}, [lockMoves, move1, move2, move3, move4, teamNum, poke]);

	const onDelete = useCallback(() => {
		deletePoke(teamNum, poke.localId);
	}, [deletePoke, teamNum, poke.localId]);

	const showMoveDetails = useCallback(() => {
		attackDataRef.current.style.opacity = 1;
	}, []);

	const resetMoveDetails = useCallback(() => {
		attackDataRef.current.style.opacity = 0;
	}, []);

	// element creators
	const headerTitles = ['', 'hp', 'atk', 'def', 'sp.atk', 'sp.def', 'spd'];
	const headers = headerTitles.map(title => (
		<div key={title} className="box head bottom right">{title}</div>
	));

	const moves = poke.moves
		.map(move => <option key={move.name} value={JSON.stringify({ ...move })}>{move.name}</option>);
	moves.unshift(<option key="select" value="">Select</option>);

	const moveBg = index => ({
		background: `linear-gradient(to bottom, ${theme.colors.secondary} 80%, ${theme.colors[poke.moves[index].type]})`,
	});

	return (
		<div className={container_}>
			<section className={`${nameContainer_} top bottom left`}>{poke.name} ({poke.level})</section>

			<section className={`${titleContainerBg_} top right bottom`}>
				<div className={titleContainer_}>
					{!poke.movesLocked && <button onClick={setMoves}>Lock Moves</button>}
					<button onClick={onDelete}>X</button>
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
						<div className="box base bottom right">{moveDetails.damage_class.name}</div>
						<div className="box base bottom right">{moveDetails.power || '--'}</div>
						<div className="box base bottom right">{moveDetails.accuracy || '--'}</div>
						<div className="box base bottom right">{moveDetails.pp}</div>
						{/* description */}
						<div className="box desc base">{moveDetails.effect_entries[0].short_effect}</div>
					</div>
				</section>
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
				<section className={`${attackContainer_} left right bottom`} onMouseEnter={showMoveDetails} onMouseLeave={resetMoveDetails}>
					<div style={moveBg(0)} onMouseEnter={() => setMoveDetails(poke.moves[0])}>{poke.moves[0].name}</div>
					<div style={moveBg(1)} onMouseEnter={() => setMoveDetails(poke.moves[1])}>{poke.moves[1].name}</div>
					<div style={moveBg(2)} onMouseEnter={() => setMoveDetails(poke.moves[2])}>{poke.moves[2].name}</div>
					<div style={moveBg(3)} onMouseEnter={() => setMoveDetails(poke.moves[3])}>{poke.moves[3].name}</div>
				</section>
			)}
		</div>
	);
}

Poke.propTypes = {
	lockMoves: PropTypes.func,
	deletePoke: PropTypes.func,
	inCombat: PropTypes.bool,
	poke: PropTypes.object,
	teamNum: PropTypes.number,
};

Poke.defaultProps = {
	lockMoves: () => { },
	deletePoke: () => { },
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
			'& select, div': {
				width: '22%',
			},
			'& select': {
				background: theme.colors.secondary,
				color: 'white',
				border: 'none',
			},
			'& div': {
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				border: [[1, 'solid', theme.colors.secondary]],
				borderRadius: 3,
				textAlign: 'center',
				transition: [['.15s', 'all', 'ease-in-out']],
				fontSize: 12,
				'&:hover': {
					cursor: 'pointer',
					border: [[1, 'solid', 'white']],
				},
			},
		},
	};
};

export default injectSheet(styles)(Poke);
