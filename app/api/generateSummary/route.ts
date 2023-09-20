import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  //  TODOS IN THE BODY OF POST REQUEST
  const { todos } = await request.json();

  //   COMMUNICATE WITH OPEANAI GPT
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `When responsidng, say welcome to the TODO App!
           limit the response to 200 characters`,
      },
      {
        role: "user",
        content: `Hi there, Provide a summary of the following todos.
       Count how many todos are in each category such as todo, inprogress and done ,
        then tell the user to have a productive day! Here's the data: ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });

  return NextResponse.json(
    { message: response.choices[0].message.content },
    { status: 200 }
  );
}
