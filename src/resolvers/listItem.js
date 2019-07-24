export const __resolveType = ({ object }) => {
  switch (object) {
    case 'card':
      return 'Card';
    case 'set':
      return 'Set';
  }
};
