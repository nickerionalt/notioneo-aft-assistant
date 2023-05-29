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
    const page = await notion.pages.retrieve({ page_id: DATABASE_PAGE });
    
    // Find the embed block on the page
    const embedBlock = page.properties.embed as any;
    const embedUrl = embedBlock.url;

    // Replace the link in the embed with a different link
    const newEmbedUrl = "https://twitter.com/home";
    embedBlock.url = newEmbedUrl;

    // Update the page with the modified embed block
    await notion.blocks.update({
      block_id: embedBlock.id,
      type: embedBlock.type,
      [embedBlock.type]: embedBlock,
    });

    console.log("Embed link replaced successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}

findAndReplaceEmbedLink();
