import React from 'react';

const PageLayout = ({ children, className = '', frame = 'default' }) => {
  const frameClass = frame === 'none' ? '' : frame === 'top' ? 'page-frame-top' : 'page-frame';

  return (
    <div className={`page-shell ${frameClass} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default PageLayout;
