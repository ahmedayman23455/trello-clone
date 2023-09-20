/* 
    Map object :  
    - it is very simple consider like a bunch of entries , so you have got
    basicallly a list  
    -  each item in that list has an key and value   
    - key and value  can be actually anything  (object- hash -string -number -....)

*/

interface IBoard {
  columns: Map<TypedColumn, Icolumn>;
}

type TypedColumn = "todo" | "inprogress" | "done";

interface Icolumn {
  id: TypedColumn;
  todos: Itodo[];
}

// interface Itodo depend on the resonse i will receive from appwrite
interface Itodo {
  $id: string;
  $createAt: string;
  title: string;
  status: TypedColumn;
  image?: Iimage;
}

interface Iimage {
  buckedId: string;
  fileId: string;
}
