import { capitalize } from '../../utils';

export class Set {
  constructor({ set_type, released_at, card_count, foil_only, icon_svg_uri, ...rest }) {
    this.type = set_type
      .split('_')
      .map(name => capitalize(name))
      .join('');

    this.releaseDate = released_at;
    this.cardCount = card_count;
    this.foil = foil_only;
    this.icon = icon_svg_uri || null;

    for (const [prop, value] of Object.entries(rest)) {
      this[prop] = value;
    }
  }
}
