import { NextResponse } from "next/server";
import axios from "axios";

const API_URL = "http://localhost:3001/api/users";

export async function POST(req: Request) {
  try {
    const { email, password, action } = await req.json();

    if (action === "register") {
      const response = await axios.post(`${API_URL}/register`, { email, password });
      return NextResponse.json({ message: response.data.message }, { status: 201 });
    }

    if (action === "login") {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return NextResponse.json({ message: response.data.message }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.response?.data || "Server Error" }, { status: 500 });
  }
}
