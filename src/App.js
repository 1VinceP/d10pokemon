import React, { useCallback } from 'react';
import injectSheet from 'react-jss';
import { Link } from 'react-router-dom';
import './reset.css';

import routes from './routes';

const synth = window.speechSynthesis;
let voice;
synth.onvoiceschanged = () => {
	/**
	 * 3: English (US)
	 * 4: English (UK) Female
	 * 5: English (UK) Male
	 */
	voice = synth.getVoices()[3];
}

function App({ classes }) {
	const { app_, header_ } = classes;

	const handleSpeak = useCallback(() => {
		if( synth.speaking )
			return console.log('is currently speaking');

		const utterThis = new SpeechSynthesisUtterance('Bulbasaur used tackle. It was super effective!');
		utterThis.voice = voice;
		// utterThis.rate = 0.9;
		// utterThis.pitch = 0.9;
		synth.speak(utterThis);
	}, []);

	return (
		<div className={app_}>
			<header className={header_}>
				<Link to="/"><button>Home</button></Link>
				<Link to="/battle"><button>To Battle</button></Link>
				<button onClick={handleSpeak}>Speak</button>
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
		position: 'relative',
		top: 0,
		left: 0,
		zIndex: 10,
		boxShadow: [[0, 4, 4, '#0004']],
	},
};

export default injectSheet(styles)(App);
