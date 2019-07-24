export const set = ({ set: code }, _, { dataSources }) =>
  dataSources.Scryfall.setByCode({ code });

export const faces = parent =>
  parent.card_faces && parent.card_faces.length
    ? parent.card_faces.map(c => ({ card: parent, ...c }))
    : [];

export const printings = async ({ id, name }, _, { dataSources }) => {
  const { data } = await dataSources.Scryfall.searchCards({
    q: `!"${name}" unique:prints`,
  });
  return data.map(c => ({
    ...c,
    duplicate: c.id === id,
  }));
};
