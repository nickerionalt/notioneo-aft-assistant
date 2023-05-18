import { BlockObjectResponse, CreatePageParameters, QueryDatabaseResponse } from "https://deno.land/x/notion_sdk@v1.0.4/src/api-endpoints.ts";
import { Client } from "https://deno.land/x/notion_sdk@v1.0.4/src/mod.ts";
import { getSecretValueFromLink, secretValue } from './links.ts';

const NOTION_TOKEN = Deno.env.get("NOTION_TOKEN");
const DATABASE_PAGE = secretValue;

if (!NOTION_TOKEN || !DATABASE_PAGE) {
    throw new Error("Notion token or database IDs not found. Please, re-check the values again or write a support request to contact@notioneo.com.");
}

// Initialize a new Notion API client
const notion = new Client({
    auth: NOTION_TOKEN,
});

export enum DatabaseType {
    Transactions = "transactions",
    Month = "month",
    Categories = "categories",
}

export async function getDatabaseId(database: DatabaseType): Promise<string> {
  const results = (await notion.blocks.children.list({ block_id: DATABASE_PAGE })).results as BlockObjectResponse[];
    const databaseId = (results).filter(r =>
        r?.type === "child_database" &&
        r.child_database?.title.toLowerCase() === database.toLowerCase()
    )?.[0].id || ''
    
  console.log(`Database ID for ${database}:`, databaseId);

  if (!databaseId) {
    throw new Error(`Database ID not found for ${database}.`);
  }

  return databaseId;
}
