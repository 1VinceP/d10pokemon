import React from 'react';
import injectSheet from 'react-jss';

function Log({ classes, log }) {
   const { log_ } = classes;

   const display = log.map(item => <p key={item.id}>{item.entry}</p>);
   return (
      <div className={log_}>{display}</div>
   );
}

const styles = {
   log_: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: [[10, 6]],
      fontSize: 12,
   },
};

export default injectSheet(styles)(Log);
