import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from './pages/Travel/index';
import ItineraryPage from './pages/Travel/itinerary';

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/itinerary" component={ItineraryPage} />
    </Switch>
  );
};

export default Routes; 