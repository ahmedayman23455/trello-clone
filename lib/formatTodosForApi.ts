export const formatTodosForApi = (board: IBoard) => {
  const todos = Array.from(board.columns.entries());

  const flatArray = todos.reduce((map, [key, value]) => {
    map[key] = value.todos;
    return map;
  }, {} as { [key in TypedColumn]: Itodo[] });
  //Flat Array > {todo: Array(1), inprogress: Array(0), done: Array(2)}

  const flatArrayCounted = Object.entries(flatArray).reduce(
    (map, [key, value]) => {
      map[key as TypedColumn] = value.length;
      return map;
    },
    {} as { [key in TypedColumn]: number }
  );
  //flatArrayCounted > {todo: 1, inprogress: 0, done: 2}

  return flatArrayCounted;
};
