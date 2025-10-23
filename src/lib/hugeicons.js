// HugeIcons utility file
// This file exports all available icons from @hugeicons/core-free-icons

import * as HugeIcons from '@hugeicons/core-free-icons';

// Get all icon names that end with 'Icon'
export const getAllIconNames = () => {
  return Object.keys(HugeIcons).filter(key => key.endsWith('Icon')).sort();
};

// Get icon object by name
export const getIconByName = (iconName) => {
  return HugeIcons[iconName];
};

// Format icon name for display (e.g., "AddCircleIcon" -> "Add Circle")
export const formatIconName = (iconName) => {
  return iconName
    .replace(/Icon$/, '') // Remove "Icon" suffix
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .trim();
};

// Export all icons namespace
export { HugeIcons };

