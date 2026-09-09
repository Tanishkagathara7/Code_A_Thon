import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface NavIconProps {
  size?: number;
  color?: string;
  focused?: boolean;
}

// Home Icon: sleek rounded house outline matching screenshot
export const NavHomeIcon: React.FC<NavIconProps> = ({ size = 24, color = '#787E92' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3.5 10.5L11.24 3.72C11.68 3.34 12.32 3.34 12.76 3.72L20.5 10.5C20.82 10.78 21 11.19 21 11.62V19C21 20.1 20.1 21 19 21H15C14.45 21 14 20.55 14 20V15H10V20C10 20.55 9.55 21 9 21H5C3.9 21 3 20.1 3 19V11.62C3 11.19 3.18 10.78 3.5 10.5Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Shield / Policies Icon with checkmark badge
export const NavShieldIcon: React.FC<NavIconProps> = ({ size = 26, color = '#787E92', focused }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {focused ? (
      <>
        <Path
          d="M12 2L4 5.5V11.5C4 16.5 7.5 21 12 22C16.5 21 20 16.5 20 11.5V5.5L12 2Z"
          fill={color}
        />
        <Path
          d="M9 11.5L11 13.5L15 9.5"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ) : (
      <>
        <Path
          d="M12 2L4 5.5V11.5C4 16.5 7.5 21 12 22C16.5 21 20 16.5 20 11.5V5.5L12 2Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M9 11.5L11 13.5L15 9.5"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
  </Svg>
);

// Benefits / Message soundwave icon
export const NavBenefitsIcon: React.FC<NavIconProps> = ({ size = 24, color = '#787E92' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 11.5C21 16.19 16.97 20 12 20C10.42 20 8.94 19.62 7.65 18.95L3 20L4.25 16.25C3.46 14.88 3 13.25 3 11.5C3 6.81 7.03 3 12 3C16.97 3 21 6.81 21 11.5Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 10V13M12 8V15M15 10V13"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Cart / Buy shopping trolley icon
export const NavBuyIcon: React.FC<NavIconProps> = ({ size = 24, color = '#787E92' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="9" cy="20" r="1.5" stroke={color} strokeWidth="1.8" />
    <Circle cx="18" cy="20" r="1.5" stroke={color} strokeWidth="1.8" />
    <Path
      d="M3 4H5.5L7.5 15H19L21 7H6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Plus Icon for center button
export const NavPlusIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19M5 12H19"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
