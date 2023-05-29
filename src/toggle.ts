import { Client } from "https://deno.land/x/notion_sdk@v2.2.3/src/mod.ts";

// Set up your Notion API credentials
const NOTION_TOKEN = 'secret_6gzaAFMkmNi2yNIr67FkR2yEfh1rsZCn8hTbZe9weXe';
const DATABASE_PAGE = '124b6bb636394e72b43f120b030375e3';

// Create a new Notion client
const notion = new Client({ auth: NOTION_TOKEN });

// Find the toggle block on the page and modify the embed link
async function updateToggleBlock() {
  try {
    // Fetch the Notion page
    const page = await notion.pages.retrieve({ page_id: DATABASE_PAGE });

    // Find the toggle block within the page
    const toggleBlock = findToggleBlock(page);

    if (toggleBlock) {
      // Modify the embed link
      toggleBlock.embed.link = "your-new-embed-link";

      // Update the page with the modified toggle block
      await notion.blocks.update({
        block_id: toggleBlock.id,
        type: "toggle",
        toggle: { text: [{ type: "text", text: { content: toggleBlock.toggle.text.content } }], embed: toggleBlock.embed },
      });

      console.log("Toggle block updated successfully.");
    } else {
      console.log("Toggle block not found.");
    }
  } catch (error) {
    console.error("Error updating toggle block:", error);
  }
}

// Helper function to find a toggle block on the page
function findToggleBlock(page: any) {
  const blocks = page.properties.blocks;
  for (const block of blocks) {
    if (block.type === "toggle" && block.embed) {
      return block;
    }
  }
  return null;
}

// Run the updateToggleBlock function
updateToggleBlock();
