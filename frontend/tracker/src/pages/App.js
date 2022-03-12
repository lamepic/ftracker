import React, { useEffect } from "react";

import Login from "./Login/Login";
import { loadUser } from "../http/user";
import Dashboard from "./Dashboard/Dashboard";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "../utility/PrivateRoute";
import * as actionTypes from "../store/actionTypes";
import { useStateValue } from "../store/StateProvider";

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
