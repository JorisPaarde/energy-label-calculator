/**
 * Energy label color mapping utility
 * Provides consistent color mapping across components
 */

export const ENERGY_LABEL_COLORS = {
  'A++++': '#1B5E20',
  'A+++': '#2E7D32',
  'A++': '#388E3C',
  'A+': '#43A047',
  'A': '#4CAF50',
  'B': '#7CB342',
  'C': '#9CCC65',
  'D': '#FDD835',
  'E': '#FFB300',
  'F': '#FB8C00',
  'G': '#E64A19'
};

export const getLabelColor = (label) => {
  return ENERGY_LABEL_COLORS[label] || '#000000';
};

export const ENERGY_LABELS_ORDERED = ['F', 'E', 'D', 'C', 'B', 'A', 'A+', 'A++', 'A+++', 'A++++'];
