import { useEffect } from "react";
import { loadUser } from "../http/user";
import { useStateValue } from "../store/StateProvider";
import * as actionTypes from "../store/actionTypes";

function useFetchUser() {
  const [store, dispatch] = useStateValue();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await loadUser(store.token);
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

  return store.user;
}

export default useFetchUser;
