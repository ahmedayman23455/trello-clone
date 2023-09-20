import { databases } from "@/appwrite";

export const getTodosGroupedByColumns = async () => {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
  );

  const todos = data.documents;

  /* reduce 
    > accumulator function 
    > it take an array and you are going to reduce it down into another 
    form 
    > we will transform data ( come from db ) to map  
    */

  const columns = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      // create first key , value for status
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }

    acc.get(todo.status)?.todos.push({
      $id: todo.$id,
      $createAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      // get the image if it exists on the todo
      ...(todo.image && {
        image: JSON.parse(todo.image),
      }),
    });

    return acc;
  }, new Map<TypedColumn, Icolumn>());

  // if columns doesn't have inprogress, todo and done , add them with empty todos
  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];

  columnTypes.forEach((columnType) => {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  });

  // sort columns by columnTypes
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    ) // all keys , values of map in array format
  );

  const board: IBoard = {
    columns: sortedColumns,
  };

  return board;
};
