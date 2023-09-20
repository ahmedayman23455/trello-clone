import { ID, databases, storage } from "@/appwrite";
import { getTodosGroupedByColumns } from "@/lib/getTodosGroupedByColumns";
import { uploadImage } from "@/lib/uploadImage";
import { create } from "zustand";

interface BoardState {
  board: IBoard;
  getBoard: () => void;
  setBoardState: (board: IBoard) => void;
  updateTodoInDB: (todo: Itodo, columnId: TypedColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  deleteTask: (taskIndex: number, todo: Itodo, id: TypedColumn) => void;

  newTaskInput: string;
  setNewTaskInput: (input: string) => void;
  newTaskType: TypedColumn;
  setNewTaskType: (type: TypedColumn) => void;

  image: File | null;
  setImage: (file: File | null) => void;
  addTask: (todo: string, columnId: TypedColumn, image: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Icolumn>(),
  },

  getBoard: async () => {
    const board = await getTodosGroupedByColumns();
    set({ board });
  },

  setBoardState: (board) => set({ board }),

  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },

  searchString: "",
  setSearchString: (searchString) => set({ searchString }),

  deleteTask: async (taskIndex: number, todo: Itodo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);
    newColumns.get(id)?.todos.splice(taskIndex, 1);

    // Delete from global state
    set({ board: { columns: newColumns } });

    // Delete from appwrite DB and storage
    if (todo.image) {
      await storage.deleteFile(todo.image.buckedId, todo.image.fileId);
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },

  newTaskInput: "",
  setNewTaskInput: (input) => {
    set({ newTaskInput: input });
  },
  newTaskType: "todo",
  setNewTaskType: (type: TypedColumn) => {
    set({ newTaskType: type });
  },

  image: null,
  setImage: (image: File | null) => {
    set({ image });
  },

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Iimage | null;

    if (image) {
      // upload image to storage
      const fileUploaded = await uploadImage(image);

      // create image file to store in todo document
      if (fileUploaded) {
        file = {
          buckedId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }
    // create new todo document in db
    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file! && { image: JSON.stringify(file) }),
      }
    );
    //  edit global state
    set({ newTaskInput: "" });
    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Itodo = {
        $id,
        $createAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return { board: { columns: newColumns } };
    });
  },
}));
//   increasePopulation: () =>
//     set((state) => ({
//       bears: state.bears + 1,
//     })),
//   removeAllBears: () =>
//     set({ bears: 0 }),
