
import React from 'react';
import IcomoonReact from 'icomoon-react';
import iconSet from './selection.json';

interface FptIconProps {
  color?: string;
  size?: number;
  icon: string;
  className?: string;
}

const FptIcon: React.FC<FptIconProps> = ({ color = '#555', size = 20, icon, className }) => {
  return (
    <IcomoonReact iconSet={iconSet} color={color} size={size} icon={icon} className={className} />
  );
};

export default FptIcon;