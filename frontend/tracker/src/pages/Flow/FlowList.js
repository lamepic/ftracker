import React, { useEffect } from "react";
import { fetchFlow } from "../../http/document";
import { useStateValue } from "../../store/StateProvider";
import { openNotificationWithIcon } from "../../utility/helper";

function FlowList() {
  const [store, dispatch] = useStateValue();
  useEffect(() => {
    getFlow();
  }, []);

  const getFlow = async () => {
    try {
      const res = await fetchFlow(store.token);
      console.log(res.data);
    } catch (e) {
      openNotificationWithIcon("error", "Error", e.response.data.detail);
    }
  };
  return <div>FlowList</div>;
}

export default FlowList;
