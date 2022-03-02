import React, { useState } from "react";
import { Tabs } from "antd";
import Loading from "../../components/Loading/Loading";
import "./Flow.css";
import CreateFlow from "./CreateFlow";
import FlowList from "./FlowList";

const { TabPane } = Tabs;

function Flow() {
  const callback = (key) => {
    // console.log(key);
  };

  return (
    <div className="flow">
      <>
        <h2 className="flow__header">Create Document Flow</h2>
        <hr className="divider" />
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Create" key="1">
            <CreateFlow />
          </TabPane>
          <TabPane tab="Manage" key="2">
            <FlowList />
          </TabPane>
        </Tabs>
      </>
    </div>
  );
}

export default Flow;
