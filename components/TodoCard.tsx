"use client";

import { getUrl } from "@/lib/getUrl";
import { useBoardStore } from "@/store/BoardStore";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

interface IProps {
  todo: Itodo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: IProps) {
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const [imageUrl, setImageUrl] = useState<string | null>();

  useEffect(() => {  
    console.log(todo.image) ;
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getUrl(todo.image!);
        if (url) {
          setImageUrl(url.toString());
        }
      };
      fetchImage();
    }
  }, [todo]);

  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      className="bg-white rouned-md mx-2 space-y-2 drop-shadow-md"
    >
      <div className="flex items-center justify-between p-4 px-2">
        <p>{todo.title}</p>

        <button className="text-red-500 hover:text-red-600">
          <XCircleIcon
            className="h-8 w-8"
            onClick={() => deleteTask(index, todo, id)}
          />
        </button>
      </div>

      {/* Add Image Here  */}

      {imageUrl && (
        <div className="relative w-full rounded-b-md">
          <Image
            src={imageUrl}
            alt="task image"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
          />
        </div>
      )}
    </div>
  );
}

export default TodoCard;
