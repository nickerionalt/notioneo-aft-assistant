import { Client } from "https://deno.land/x/notion_sdk@v2.2.3/src/mod.ts";
import { BlockObjectResponse, CreatePageParameters, QueryDatabaseResponse } from "https://deno.land/x/notion_sdk@v2.2.3/src/api-endpoints.ts";

// Set up your Notion API credentials
const NOTION_TOKEN = 'secret_6gzaAFMkmNi2yNIr67FkR2yEfh1rsZCn8hTbZe9weXe';
const DATABASE_PAGE = '124b6bb636394e72b43f120b030375e3';

const notion = new Client({
  auth: NOTION_TOKEN,
});

async function findAndReplaceEmbedLink() {
  try {
  const results = await notion.blocks.children.list({ block_id: DATABASE_PAGE }).results as BlockObjectResponse[];
    
  // Find the embed block and update the link
  for (const result of results) {
    if (result.type === 'embed') {
      const newProperties: EmbedBlock = {
        type: 'embed',
        embed: {
          url: 'https://twitter.com/'
        }
      };

      await notion.blocks.update({
        block_id: result.id,
        type: 'embed',
        [result.type]: newProperties
      });
    }
  }
    console.log("Embed link replaced successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}

findAndReplaceEmbedLink();
