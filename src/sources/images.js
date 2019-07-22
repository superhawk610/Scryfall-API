import { DataSource } from 'apollo-datasource';
import * as Vibrant from 'node-vibrant';
import { Potrace } from 'potrace';
import SVGO from 'svgo';
import DataURI from 'datauri';
import { debug, error } from 'winston';
import { memoize } from '../utils';

export class Images extends DataSource {
  baseURL = 'https://img.scryfall.com/cards/';

  initialize({ cache }) {
    this.cachedColor = memoize(this.extractColor, cache);
  }

  url = (size, id) => `${this.baseURL}${size}/f/0/${id}`;

  svg = (id, size, color, base64) => this.getSVG(id, size, color, base64);

  custom = (id, size, svg, color, base64) =>
    svg ? this.svg(id, size, color, base64) : this.url(size, id);

  original = (id, svg, color, base64) => this.custom(id, 'original', svg, color, base64);

  w45 = (id, svg, color, base64) => this.custom(id, 'w45', svg, color, base64);
  w92 = (id, svg, color, base64) => this.custom(id, 'w92', svg, color, base64);
  w154 = (id, svg, color, base64) => this.custom(id, 'w154', svg, color, base64);
  w185 = (id, svg, color, base64) => this.custom(id, 'w185', svg, color, base64);
  w300 = (id, svg, color, base64) => this.custom(id, 'w300', svg, color, base64);
  w342 = (id, svg, color, base64) => this.custom(id, 'w342', svg, color, base64);
  w500 = (id, svg, color, base64) => this.custom(id, 'w500', svg, color, base64);
  w780 = (id, svg, color, base64) => this.custom(id, 'w780', svg, color, base64);
  w1280 = (id, svg, color, base64) => this.custom(id, 'w1280', svg, color, base64);

  h632 = (id, svg, color) => this.custom(id, 'h632', svg, color);

  colors = id => this.cachedColor(this.url('original', id));

  extractColor = async url => {
    const extracted = await Vibrant.from(url);
    const palette = await extracted.getPalette();
    return {
      vibrant: palette?.Vibrant?.getRgb() || null,
      lightVibrant: palette?.LightVibrant?.getRgb() || null,
      darkVibrant: palette?.DarkVibrant?.getRgb() || null,
      muted: palette?.Muted?.getRgb() || null,
      lightMuted: palette?.LightMuted?.getRgb() || null,
      darkMuted: palette?.DarkMuted?.getRgb() || null,
    };
  };

  svgPath = (filename, size, color) =>
    `${size}/${color}${filename.replace(/\.[^/.]+$/, '.svg')}`;

  getSVG = async (filename, size, color, base64) => {
    const path = this.svgPath(filename, size, color);

    try {
      throw 'TODO: grab and return local cached file';
    } catch (err) {
      debug('Existing file not found, creating...');
    }

    try {
      const image = await this.traceImg(`${size}${filename}`, color);
      await this.saveImage(path, image);
      return base64
        ? this.encodeSvgDataUri(image)
        : `${this.s3Base}/${this.bucket}/${path}`;
    } catch (err) {
      error('An error occured while attempting to save an image', err);
      return null;
    }
  };

  saveImage = (path, image) => {
    // TODO: save image locally
    return null;
  };

  traceImg = async (path, color) => {
    const svg = await this.traceSvg(`${this.baseURL}${path}`, color);
    return this.optimizeSvg(svg);
  };

  traceSvg = (url, color) =>
    new Promise(async (resolve, reject) => {
      const colors = await this.extractColor(url);
      const trace = new Potrace({
        turdSize: 150,
        color: `rgb(${colors[color] || [0, 0, 0]})`,
      });
      trace.loadImage(url, err => (err ? reject(err) : resolve(trace.getSVG())));
    });

  optimizeSvg = async svg => {
    const svgo = new SVGO({ floatPrecision: 0 });
    const { data } = await svgo.optimize(svg);
    return data;
  };

  encodeSvgDataUri = svg => {
    const datauri = new DataURI();
    datauri.format('.svg', svg);
    return datauri.content;
  };
}
