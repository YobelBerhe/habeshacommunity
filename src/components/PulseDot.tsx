import React from "react";

type Props = { 
  count: number; 
  light?: boolean;
};

export default function PulseDot({ count, light }: Props) {
  return (
    <div className={`hc-dot ${light ? "hc-dot-light" : ""}`}>
      <span className="hc-badge">+{count}</span>
    </div>
  );
}