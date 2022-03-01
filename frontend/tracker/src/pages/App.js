import React, { useEffect } from "react";

import { Route, Switch } from "react-router-dom";
import { loadUser } from "../http/user";
import { useStateValue } from "../store/StateProvider";
import PrivateRoute from "../utility/PrivateRoute";
import Dashboard from "./Dashboard/Dashboard";
import * as actionTypes from "../store/actionTypes";

import Login from "./Login/Login";

function App() {
  const [store, dispatch] = useStateValue();

  const token = store.token;

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await loadUser(token);
      dispatch({
        type: actionTypes.USER_LOADED,
        payload: res.data,
      });
    } catch {
      dispatch({
        type: actionTypes.AUTH_ERROR,
      });
    }
  };
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Login} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
      </Switch>
    </div>
  );
}

export default App;
