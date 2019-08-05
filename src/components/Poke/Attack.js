import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

function Attack({ classes, moveLocked, content, onEnter, onClick, onChange }) {
   const { select_, div_ } = classes;

   return !moveLocked
      ? <select className={select_} onChange={onChange}>{content}</select>
      : (
         <div className={div_} onMouseEnter={onEnter} onClick={onClick}>
            {content.name}
         </div>
      );
}

Attack.propTypes = {
   moveLocked: PropTypes.bool,
};

Attack.defaultProps = {
   moveLocked: false,
};

const styles = theme => ({
   select_: {
      width: '22%',
      background: theme.colors.secondary,
      color: 'white',
      border: 'none',
   },

   div_: {
      width: '22%',
      display: 'flex',
      background: props => `linear-gradient(to bottom, ${theme.colors.secondary} 80%, ${theme.colors[props.content.type]})`,
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
});

export default injectSheet(styles)(Attack);
