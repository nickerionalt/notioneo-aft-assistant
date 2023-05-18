export enum DatabaseType {
    Transactions = "Transactions",
    Month = "Month",
    Categories = "Categories",
}

export async function getDatabaseId(database: DatabaseType): Promise<string> {
  const results = (await notion.blocks.children.list({ block_id: DATABASE_PAGE, page_size: 200 })).results as BlockObjectResponse[];

  console.log('Filtered results:', results);

  const databaseId = results
    .filter(r =>
      r?.type === "child_database" &&
      r.child_database?.title?.[0]?.plain_text?.toLowerCase() === database.toLowerCase()
    )
    ?.map(r => r.id)[0] || '';

  console.log(`Database ID for ${database}:`, databaseId);

  if (!databaseId) {
    throw new Error(`Database ID not found for ${database}.`);
  }

  return databaseId;
}
