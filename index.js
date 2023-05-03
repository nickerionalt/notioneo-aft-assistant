import { Client } from "https://github.com/makenotion/notion-sdk-js"

// Initialize a new Notion API client
const notion = new Client({
  auth: "secret_1znQ6olMQsv4LAUmiDUWxrZlAJ2hibu5Rut4LOVU0VB",
});

// Set the IDs of the two databases
const database1Id = '3a8fae42-9cc4-40b2-a322-724a4fe34918';
const database2Id = '30238b71ba5246fdb159ca24d25b0414';

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
    console.log(`Updated Month property for database_1 item ${database1ItemId}`);
  }
}

// Define the main function to watch database_1 and update the Month property when needed
async function watchDatabase1() {
  console.log('Watching database_1...');

  const response = await notion.databases.query({
    database_id: database1Id,
    filter: database1Filter,
  });

  console.log(`Found ${response.results.length} RT Income/Expense items in database_1.`);

  for (const database1Item of response.results) {
    // Get the Month Text formula from the database_1 item
    const monthTextFormula = database1Item.properties['Month Text'].formula.string;

    console.log(`Checking for matching Month in database_2 for database_1 item ${database1Item.id}...`);

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
      console.log(`Linked database_1 item ${database1Item.id} with database_2 item ${response2.results[0].id}.`);
    } else {
      console.log(`No matching Month found in database_2 for database_1 item ${database1Item.id}.`);
    }
  }

  console.log('Done.');
}

// Call the main function
watchDatabase1();
