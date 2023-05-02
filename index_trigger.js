const { Client } = require("@notionhq/client");

const notion = new Client({ auth: "secret_1znQ6olMQsv4LAUmiDUWxrZlAJ2hibu5Rut4LOVU0VB" });

async function listenForNewPages(databaseId) {
  const result = await notion.databases.retrieve({
    database_id: databaseId,
  });

  const { url, title } = result;
  console.log(`Listening for new pages in ${title} (${url})`);

  const cursor = await notion.databases.query({
    database_id: databaseId,
  });

  const initialPages = cursor.results;

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 seconds before checking for new pages

    const newCursor = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor.next_cursor,
    });

    const newPages = newCursor.results;

    if (newPages.length > 0) {
      console.log(`Found ${newPages.length} new pages:`);
      newPages.forEach((page) => {
        console.log(`${page.properties.Name.title[0].text.content}`);
        // perform your desired action on the new page here
      });
    }

    cursor.next_cursor = newCursor.next_cursor;

    if (!cursor.next_cursor) {
      console.log(`No more pages in ${title}`);
      break;
    }
  }
}

listenForNewPages("3a8fae429cc440b2a322724a4fe34918"); // replace DATABASE_ID with the ID of your Notion database