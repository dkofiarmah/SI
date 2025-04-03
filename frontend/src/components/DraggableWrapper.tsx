'use client';

import { useRef } from 'react';
import Draggable, { DraggableProps } from 'react-draggable';

interface DraggableWrapperProps {
  children: React.ReactNode;
}

export default function DraggableWrapper({ children }: DraggableWrapperProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <Draggable 
      nodeRef={nodeRef as unknown as React.RefObject<HTMLElement>} 
      handle=".drag-handle"
    >
      <div ref={nodeRef}>
        {children}
      </div>
    </Draggable>
  );
}