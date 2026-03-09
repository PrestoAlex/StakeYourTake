// Utility for loading custom icons
export const CUSTOM_ICONS_BASE_PATH = '/icons/custom/';

// Predefined custom icons (add your filenames here)
export const CUSTOM_ICONS = [
  'avatar-01.png',
  'avatar-02.png', 
  'avatar-03.png',
  'avatar-04.png',
  'avatar-05.png',
  'avatar-06.png',
  'avatar-07.png',
  'avatar-08.png',
  'avatar-09.png',
  'avatar-10.png',
  'avatar-11.png',
  'avatar-12.png',
  'avatar-13.png',
  'avatar-14.png',
  'avatar-15.png',
  'avatar-16.png',
  'avatar-17.png',
  'avatar-18.png',
  'avatar-19.png',
  'avatar-20.png',
  'avatar-21.png',
  'avatar-22.png',
  'avatar-23.png',
  'avatar-24.png',
];

// Load custom icon URLs (filter only existing ones)
export const getCustomIcons = (): string[] => {
  // For now, return all icons - the frontend will handle missing images
  return CUSTOM_ICONS.map(icon => `${CUSTOM_ICONS_BASE_PATH}${icon}`);
};

// Get available icons that actually exist
export const getExistingCustomIcons = async (): Promise<string[]> => {
  const icons = getCustomIcons();
  const available = await Promise.all(
    icons.map(async icon => {
      try {
        const response = await fetch(icon, { method: 'HEAD' });
        return response.ok ? icon : null;
      } catch {
        return null;
      }
    })
  );
  return available.filter(Boolean) as string[];
};

// Check if icon exists (basic validation)
export const iconExists = async (iconPath: string): Promise<boolean> => {
  try {
    const response = await fetch(iconPath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Get available custom icons (filter out missing ones)
export const getAvailableCustomIcons = async (): Promise<string[]> => {
  const icons = getCustomIcons();
  const available = await Promise.all(
    icons.map(async icon => {
      const exists = await iconExists(icon);
      return exists ? icon : null;
    })
  );
  return available.filter(Boolean) as string[];
};
