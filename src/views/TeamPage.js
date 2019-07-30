import React from 'react';
import injectSheet from 'react-jss';

import Team from '../components/Team';

function TeamPage({ classes }) {
  const { team_, section_, left_ } = classes;

  return (
    <div className={team_}>
      <section className={`${section_} ${left_}`}><Team teamNum={1} /></section>
      <section className={section_}><Team teamNum={2} /></section>
    </div>
  );
}

const styles = {
  team_: {
    height: '100%',
    width: '100%',
    display: 'flex',
  },

  section_: {
    height: '100%',
    width: '50%',
    padding: 10,
  },

  left_: { borderRight: [[1, 'solid', 'blue']] }
};

export default injectSheet(styles)(TeamPage);
