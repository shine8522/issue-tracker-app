import React from "react";
import "./skeletonLoader.css";

const SkeletonLoader = () => (
  <div className="skeleton-card">
    <div className="skeleton-title"></div>
    <div className="skeleton-line"></div>
    <div className="skeleton-line short"></div>
  </div>
);

export default SkeletonLoader;
