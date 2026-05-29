// import { auth } from "@/auth";
// import User from "@/models/user.model";
// import { NextRequest, NextResponse } from "next/server";


// export async function GET(req:NextRequest) {
//     try {
//         const session = await auth()
//         if(!session || !session.user){
//             return NextResponse.json({message:"User is not authenticated"},{status:400})
//         }
//         const user = await User.findOne({email:session.user.email}).select("-password").populate("cart.product")
//         if(!user){
//             return NextResponse.json({message:"User is not found"},{status:400})
//         }
//         return NextResponse.json(user ,{status:200})

//     } catch (error) {
//          return NextResponse.json({message:`Get Current User error ${error}`},{status:500})
//     }
    
// }















import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const session = await auth();

    //console.log("SESSION =>", session);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "User is not authenticated" },
        { status: 401 }
      );
    }

    const user = await User.findOne({
      email: session.user.email,
    })
      .select("-password")
      .populate("cart.product");

    //console.log("USER =>", user);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error("Get Current User Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}