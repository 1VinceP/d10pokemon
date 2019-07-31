import React from 'react';
import injectSheet from 'react-jss';

import Sprite from './Sprite';

function D10Window({ classes, list }) {
	const { window_ } = classes;

	const renderTiles = () => {
		const tiles = [];
		for( let i = 1; i <= 6; i++ ) {
			for( let j = 1; j <= 10; j++ ) {
				const index = list.findIndex(poke => (poke.coords.row === i && poke.coords.col === j));
				if( index >= 0 )
					tiles.push(<Sprite key={`${j}, ${i}`} row={i} col={j} poke={list[index]} large />);
				else
					tiles.push(<Sprite key={`${j}, ${i}`} row={i} col={j} />);
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
