import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Teams from './views/TeamPage';
import Battle from './views/BattlePage';

export default (
   <Switch>

      <Route exact path='/' component={Teams} />
      <Route path='/battle' component={Battle} />

   </Switch>
);
