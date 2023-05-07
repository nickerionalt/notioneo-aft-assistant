import { Client } from "https://deno.land/x/notion_sdk@v1.0.4/src/mod.ts";

const NOTION_TOKEN = Deno.env.get("NOTION_TOKEN") as string

const DATABASE_1 = Deno.env.get("DATABASE_1");
const DATABASE_2 = Deno.env.get("DATABASE_2");

if (!NOTION_TOKEN) {
    throw new Error("Notion token id not found")
}

// Initialize a new Notion API client
const notion = new Client({
    auth: NOTION_TOKEN,
})

// Set the IDs of the two databases
const database1Id = DATABASE_1;
const database2Id = DATABASE_2;

// Set up a filter for database_1 to find RT Income and RT Expense items with empty Month relation
const database1Filter = {
  property: 'Month',
  relation: {
    is_empty: true,
  },
};

// Set up a filter for database_2 to find items with a matching Month Text formula
const database2Filter = {
  property: 'Month Text',
  formula: {
    string: {
      equals: '',
    },
  },
};

// Define a function to update the Month property in database_1 if it is empty
async function updateMonthPropertyIfEmpty(database1ItemId, database2ItemId) {
  const page = await notion.pages.retrieve({ page_id: database1ItemId });
  const monthRelation = page.properties.Month.relation;
  if (monthRelation.length === 0) {
    const response = await notion.pages.update({
      page_id: database1ItemId,
      properties: {
        Month: {
          type: 'relation',
          relation: [
            {
              id: database2ItemId,
            },
          ],
        },
      },
    });
    console.log(`Updated Month property for "Transactions" DB item ${database1ItemId}`);
  }
}

// Define the main function to watch database_1 and update the Month property when needed
async function watchDatabase1() {
  console.log('Watching "Transactions" DB Database...');

  const response = await notion.databases.query({
    database_id: database1Id,
    filter: database1Filter,
  });

  console.log(`Found ${response.results.length} items in "Transactions" DB.`);

  for (const database1Item of response.results) {
    // Get the Month Text formula from the database_1 item
    const monthTextFormula = database1Item.properties['Month Text'].formula.string;

    console.log(`Checking for matching Month in "Months" DB for "Transactions" DB item ${database1Item.id}...`);

    // Update the filter for database_2 to use the Month Text formula from database_1
    database2Filter.formula.string.equals = monthTextFormula;

    // Query database_2 with the updated filter
    const response2 = await notion.databases.query({
      database_id: database2Id,
      filter: database2Filter,
    });

    if (response2.results.length > 0) {
      // Update the Month property in database_1 with the first matching database_2 item if it is empty
      await updateMonthPropertyIfEmpty(database1Item.id, response2.results[0].id);
      console.log(`Linked "Transactions" DB item ${database1Item.id} with "Month" DB item ${response2.results[0].id}.`);
    } else {
      console.log(`No matching Month found in "Month" DB for "Transactions" DB item ${database1Item.id}.`);
    }
  }

  console.log('Done.');
}

// Call the main function
// watchDatabase1();

setInterval(watchDatabase1, 5000);
