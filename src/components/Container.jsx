import React from 'react';

export const Container = ({ children, className = '', size = 'base', as: Element = 'div' }) => {
  const sizeClass = size === 'narrow' ? 'layout-container--narrow' : '';

  return (
    <Element className={`layout-container ${sizeClass} ${className}`.trim()}>
      {children}
    </Element>
  );
};

export default Container;