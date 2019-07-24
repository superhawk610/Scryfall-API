export const set = ({ set: code }, _, { dataSources }) =>
  dataSources.Scryfall.setByCode({ code });

export const faces = parent =>
  parent.card_faces && parent.card_faces.length
    ? parent.card_faces.map(c => ({ card: parent, ...c }))
    : [];
