import React, { useCallback } from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

import Sprite from './Sprite';

function D10Window({ classes, list, actions, selections }) {
	const { window_ } = classes;

	// callbacks
	const handleClick = useCallback((isSprite, coords, poke) => {
		actions.pushDetailLog(`Tile at [${coords.x}, ${coords.y}] clicked`);
		isSprite && actions.setSelection(poke);
	}, [actions]);

	const disabled = selections.attacker && !selections.attack;
	// element creators
	const renderTiles = () => {
		const tiles = [];
		for( let i = 1; i <= 6; i++ ) {
			for( let j = 1; j <= 10; j++ ) {
				const index = list.findIndex(poke => (poke.coords.row === i && poke.coords.col === j));
				if( index >= 0 ) {
					let isAttacker = false;
					if( typeof selections.attacker !== 'string' ) {
						isAttacker = selections.attacker.coords.col === j && selections.attacker.coords.row === i;
					}
					tiles.push(
						<Sprite
							key={`${j}, ${i}`}
							row={i}
							col={j}
							poke={list[index]}
							onClick={handleClick}
							disabled={disabled}
							isAttacker={isAttacker}
						/>
					);
				}
				else {
					tiles.push(
						<Sprite
							key={`${j}, ${i}`}
							row={i}
							col={j}
							onClick={handleClick}
							disabled={disabled}
						/>
					);
				}
			}
		}

		return tiles;
	}

	return (
		<div className={window_}>
			{renderTiles()}
		</div>
	);
}

D10Window.propTypes = {
	actions: PropTypes.objectOf(PropTypes.func),
	disabled: PropTypes.bool,
	list: PropTypes.arrayOf(PropTypes.object),
};

D10Window.defaultProps = {
	actions: {},
	disabled: PropTypes.bool,
	list: [],
};

const styles = {
	window_: {
		height: '100%',
		width: '100%',
		display: 'grid',
		gridTemplateRows: 'repeat(5, 1fr)',
		gridTemplateColumns: 'repeat(10, 1fr)',
	},
};

export default injectSheet(styles)(D10Window);
