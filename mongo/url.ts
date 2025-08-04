export function getDbUrl() {
  const DB_URL =
    process.env.ENVIRONMENT === "local"
      ? process.env.MONGO_URI_LOCAL
      : `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.j9uiirp.mongodb.net/?retryWrites=true&w=majority`;
  return DB_URL;
}
