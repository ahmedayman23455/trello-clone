import { formatTodosForApi } from "./formatTodosForApi";

export const fetchSuggestion = async (board: IBoard) => {
  const todos = await formatTodosForApi(board);

  const res = await fetch("/api/generateSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todos }),
  });

  const { message } = await res.json();
  return message;
};
