import React from 'react';
import injectSheet from 'react-jss';
import { Link } from 'react-router-dom';
import './reset.css';

import routes from './routes';

function App({ classes }) {
	const { app_, header_ } = classes;

	return (
		<div className={app_}>
			<header className={header_}>
				<Link to="/"><button>Home</button></Link>
				<Link to="/battle"><button>To Battle</button></Link>
			</header>
			{routes}
		</div>
	);
}

const styles = {
	app_: {
		height: '100vh',
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
	},

	header_: {
		width: '100%',
		height: 30,
		boxShadow: [[0, 4, 4, '#0004']],
		marginBottom: 30,
	},
};

export default injectSheet(styles)(App);
