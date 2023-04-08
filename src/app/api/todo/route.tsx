import { TodoType } from "@/app/types";
import { RequestCookies, ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";

function getTodos(cookies: RequestCookies): TodoType[] {
    const cookie = cookies.get("todos");
    return cookie ? JSON.parse(cookie.value) : [];
}

async function setTodos(req_cookies: RequestCookies, res_cookies: ResponseCookies, value: string) {
    const todos = getTodos(req_cookies);
    todos.push({value: value, id: Math.floor(Math.random() * 100000)});
    res_cookies.set("todos", JSON.stringify(todos));
}

export async function GET(req: NextRequest) {
    return NextResponse.json(getTodos(req.cookies));

}

export async function POST(req: NextRequest) {
    const res = NextResponse.json({});
    await setTodos(req.cookies, res.cookies, (await req.json())["value"]);
    return res;
}

export async function DELETE(req: NextRequest) {
    let todos = getTodos(req.cookies);
    const id = (await req.json())["id"];
    todos = todos.filter((e) => e.id !== id);
    const res = NextResponse.json({id: id});
    res.cookies.set("todos", JSON.stringify(todos));
    return res;
} 
