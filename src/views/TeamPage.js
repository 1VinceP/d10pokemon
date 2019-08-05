import React, { useEffect, useCallback } from 'react';
import injectSheet from 'react-jss';
// import useLocalStorage from 'react-use-localstorage';
import axios from 'axios';

import Team from '../components/Team';

function TeamPage({ classes }) {
  const { team_, section_, left_ } = classes;
  // const [allNameList, setAllNameList] = useLocalStorage([]);

  // callbacks
  const fetchNames = useCallback(async () => {
    const list = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=9999');
    const sortList = list.data.results.map(poke => poke.name).sort();
    window.localStorage.setItem('allNameList', JSON.stringify(sortList));
  }, []);

  // effects
  useEffect(() => {
    const list = JSON.parse(window.localStorage.getItem('allNameList'));
    if( list === null || !list.length ) fetchNames();
  }, [fetchNames]);

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
