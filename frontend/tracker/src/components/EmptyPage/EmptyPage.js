import React from "react";
import "./EmptyPage.css";

function EmptyPage({ type }) {
  return (
    <div className="empty">
      <div className="empty__content">
        <h3>No {type} Files</h3>
      </div>
    </div>
  );
}

export default EmptyPage;
