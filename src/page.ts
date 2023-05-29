import { Client } from '@notionhq/client';

// Initialize the Notion API client
const notion = new Client({
  auth: 'secret_6gzaAFMkmNi2yNIr67FkR2yEfh1rsZCn8hTbZe9weXe',
});

// Function to find the "Databases" page in a Notion workspace
async function findDatabasesPage(): Promise<string | null> {
  try {
    // Get a list of pages in the workspace
    const response = await notion.databases.list();
    const databases = response.results;

    // Search for the "Databases" page
    for (const database of databases) {
      if (database.title[0].text.content === 'Databases') {
        return database.id;
      }
    }

    return null; // Return null if the page is not found
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Usage
findDatabasesPage().then((pageId) => {
  if (pageId) {
    console.log(`Found the "Databases" page! Page ID: ${pageId}`);
  } else {
    console.log('The "Databases" page was not found.');
  }
});
