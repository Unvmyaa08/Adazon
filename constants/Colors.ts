/**
 * Amazon-themed color scheme
 * Maintains support for light and dark modes
 * Inspired by Amazon branding (notably their signature orange and dark backgrounds)
 */

const primaryLight = '#FF9900';  // Amazon Orange - primary brand color
const primaryDark = '#FFB84D';   // Slightly lighter orange for dark mode contrast

export const Colors = {
  light: {
    text: '#232F3E',        // Dark gray/blue (often used in Amazon UI)
    background: '#FFFFFF',  // Clean white background
    tint: primaryLight,     // Primary Amazon orange accent color
    icon: '#6B7280',        // Subtle medium gray for icons
    tabIconDefault: '#6B7280',
    tabIconSelected: primaryLight,
    
    // Additional colors inspired by Amazon branding:
    cardBackground: '#F3F4F6',  // Light gray for cards/sections
    border: '#D1D5DB',          // Subtle border color
    success: '#047857',         // Green for success states
    error: '#D70015',           // Bright red for errors
    warning: '#F59E0B',         // Amber for warnings
  },
  dark: {
    text: '#F9FAFB',        // Off-white for better readability on dark backgrounds
    background: '#131A22',  // Dark background (reminiscent of Amazon site header)
    tint: primaryDark,      // Slightly lighter Amazon orange accent
    icon: '#9CA3AF',        // Light gray for icons
    tabIconDefault: '#9CA3AF',
    tabIconSelected: primaryDark,
    
    // Additional colors inspired by Amazon branding:
    cardBackground: '#1E293B',  // Slightly lighter than background for cards
    border: '#374151',          // Subtle border color
    success: '#059669',         // Darker green for success
    error: '#EF4444',           // Lighter red for errors
    warning: '#D97706',         // Darker amber for warnings
  },
};
