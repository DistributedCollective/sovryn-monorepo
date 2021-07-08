import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type PortalProps = {
  parentId: string;
};

const Portal: React.FC<PortalProps> = ({ parentId, children }) => {
  const [portal, setPortal] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let parentElement = document.getElementById(parentId);
    if (!parentElement) {
      console.error(
        `Portal: Could not find element with id "${parentId}"! Can't mount children!`,
      );
      return;
    }

    let portalElement = document.createElement('div');
    setPortal(portalElement);

    parentElement.appendChild(portalElement);
    return () => {
      if (parentElement && portalElement) {
        parentElement.removeChild(portalElement);
      }
    };
  }, [parentId]);

  if (portal && children) {
    return ReactDOM.createPortal(children, portal);
  }
  return null;
};

export default Portal;
