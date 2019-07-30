import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Teams from './views/TeamPage';

export default (
  <Switch>

    <Route exact path='/' component={Teams} />

  </Switch>
);
