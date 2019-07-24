export class Ruling {
  constructor({ oracle_id, source, published_at, comment }) {
    this.oracleId = oracle_id;
    this.source = source;
    this.publishedAt = published_at;
    this.content = comment;
  }
}
