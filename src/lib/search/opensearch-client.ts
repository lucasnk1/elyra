import { Client } from "@opensearch-project/opensearch";

export function createOpenSearchClient() {
  const node = process.env.OPENSEARCH_URL || "http://localhost:9200";
  return new Client({ node });
}
