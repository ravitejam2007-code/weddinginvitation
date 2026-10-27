import React from 'react';

interface FloralSprigsProps {
  className?: string;
}

export const FloralSprigs: React.FC<FloralSprigsProps> = ({ className = '' }) => {
  return (
    <div className={`floral-sprigs-container ${className}`} aria-hidden="true">
      <img
        className="botanical-branch botanical-top-left"
        src="/images/illustrations/floral-corner.svg"
        alt=""
      />
      <img
        className="botanical-branch botanical-bottom-right"
        src="/images/illustrations/floral-corner.svg"
        alt=""
      />
    </div>
  );
};
