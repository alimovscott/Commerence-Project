import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import '../css/app.css';

import { HomePage } from './screens/homePage';
import { OrdersPage } from './screens/ordersPage';
import { ProductsPage } from './screens/productsPage';
import { UsersPage } from './screens/userPage';


function App() {
  return (
   <div>
        <nav>
          <ul>
            <li>
              <Link to="/">HomePage</Link>
            </li>
            <li>
              <Link to="/products">ProductsPage</Link>
            </li>
            <li>
              <Link to="/orders">OrdersPage</Link>
            </li>
            <li>
              <Link to="/member-page">UserPage</Link>
            </li>
            
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/products">
            <ProductsPage />
          </Route>
          <Route path="/orders">
            <OrdersPage />
          </Route>
          <Route path="/member-page">
            <UsersPage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </div>
  );
}




export default App;
