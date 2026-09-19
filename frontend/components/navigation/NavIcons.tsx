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

// Shield / Incidents Icon with checkmark badge
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

// AI Sparkles Copilot Icon
export const NavCopilotIcon: React.FC<NavIconProps> = ({ size = 24, color = '#787E92', focused }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {focused ? (
      <>
        <Path
          d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
          fill={color}
        />
        <Path
          d="M19 3L19.8 5.2L22 6L19.8 6.8L19 9L18.2 6.8L16 6L18.2 5.2L19 3Z"
          fill={color}
        />
      </>
    ) : (
      <>
        <Path
          d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M19 3L19.8 5.2L22 6L19.8 6.8L19 9L18.2 6.8L16 6L18.2 5.2L19 3Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
  </Svg>
);

export const NavBenefitsIcon = NavCopilotIcon;

// Profile / User Account Icon
export const NavProfileIcon: React.FC<NavIconProps> = ({ size = 24, color = '#787E92', focused }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={focused ? '2.2' : '1.8'} />
    <Path
      d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21"
      stroke={color}
      strokeWidth={focused ? '2.2' : '1.8'}
      strokeLinecap="round"
    />
  </Svg>
);

// Settings Gear Icon
export const NavSettingsIcon: React.FC<NavIconProps> = ({ size = 24, color = '#787E92' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
    <Path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Bell / Alerts notification icon
export const NavBellIcon: React.FC<NavIconProps> = ({ size = 24, color = '#787E92', focused }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {focused ? (
      <>
        <Path
          d="M12 2C8.68629 2 6 4.68629 6 8V12.1585C6 12.6973 5.78595 13.2141 5.40493 13.5951L4 15H20L18.5951 13.5951C18.2141 13.2141 18 12.6973 18 12.1585V8C18 4.68629 15.3137 2 12 2Z"
          fill={color}
        />
        <Path
          d="M10 19C10 20.1046 10.8954 21 12 21C13.1046 21 14 20.1046 14 19"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ) : (
      <>
        <Path
          d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
          stroke={color}
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
  </Svg>
);

export const NavBuyIcon = NavBellIcon;

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
