import React, { useState, useCallback } from 'react';
import injectSheet from 'react-jss';
import './reset.css';

import TeamPage from './TeamPage';

function App({ classes }) {
  const { app_, header_ } = classes
  const [isHome, setIsHome] = useState(true)

  const changePage = useCallback(() => setIsHome(!isHome), [isHome])

  return (
    <div className={app_}>
      <header className={header_}>
        <button onClick={changePage}>{isHome ? 'To Battle' : 'To Home'}</button>
      </header>
      {isHome ? <TeamPage /> : null}
    </div>
  )
}

const styles = {
  app_: {
    height: '100vh',
    width: '100%',
    // padding: 10,
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
