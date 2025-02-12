


import connectDB from "@/app/lib/mongoose"
import CookHistory from "@/app/models/cook-history";
import Recipe from "@/app/models/recipe"
import { NextResponse } from "next/server"




// export async function GET(request: Request) {
//     try {
//         const { searchParams } = new URL(request.url);
//         const connection_id = searchParams.get("connection_id");
//         const recipe_id = searchParams.get("recipe");
//         const recipeExists = searchParams.get("recipeExists") === "true"; 

//         if (!connection_id || !recipe_id) {
//             return NextResponse.json(
//                 { message: "Missing required parameters" },
//                 { status: 400 }
//             );
//         }
        
//         await connectDB();

//         const selectedFields = recipeExists
//             ? "instruction ingredients -_id"
//             : "recipe_id name time media recipe_type description favorite sorting instruction ingredients -_id";

//         const cookHistory = await CookHistory.findOne({
//             connection_id,
//             "history_links.recipe_id": recipe_id
//         }).select("_id").lean();

//         const isInHistory = !!cookHistory; // for new header cook

//         const dataCook = await Recipe.findOne({ recipe_id, connection_id })
//             .select(selectedFields)
//             .lean(); 

//         if (!dataCook) {
//             return NextResponse.json(
//                 { message: "Recipe not found" },
//                 { status: 404 }
//             );
//         }
//         console.log('13123123123123123123123123123123123123123123123')
//         return NextResponse.json({dataCook, isInHistory}, { status: 200 });

//     } catch (error) {
//         console.error("GET /api/cook/recipe error:", error);
//         return NextResponse.json(
//             { message: "Internal Server Error", error },
//             { status: 500 }
//         );
//     }
// }


export async function GET(request: Request) {
    // console.trace("API /api/cook called");
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[${requestId}] API request started`, new Date().toISOString());

    console.log("API /api/cook called"); // Логгирование вызова API
    try {
      const { searchParams } = new URL(request.url);
      const connection_id = searchParams.get("connection_id");
      const recipe_id = searchParams.get("recipe");
      const recipeExists = searchParams.get("recipeExists") === "true";
  
      if (!connection_id || !recipe_id) {
        return NextResponse.json(
          { message: "Missing required parameters" },
          { status: 400 }
        );
      }
  
      await connectDB();
  
      const selectedFields = recipeExists
        ? "instruction ingredients -_id"
        : "recipe_id name time media recipe_type description favorite sorting instruction ingredients -_id";
  
    //   const cookHistory = await CookHistory.findOne({
    //     connection_id,
    //     "history_links.recipe_id": recipe_id
    //   }).select("_id").lean();
  
    //   const isInHistory = !!cookHistory;
  
      const dataCook = await Recipe.findOne({ recipe_id, connection_id })
        .select(selectedFields)
        .lean();
  
      if (!dataCook) {
        return NextResponse.json(
          { message: "Recipe not found" },
          { status: 404 }
        );
      }
      console.log(`[${requestId}] API request completed`, new Date().toISOString());
      console.log("API /api/cook response sent"); // Логгирование успешного ответа
      return NextResponse.json({ dataCook }, { status: 200 });
  
    } catch (error) {
      console.log(`[${requestId}] API request failed`, new Date().toISOString());

      console.error("GET /api/cook/recipe error:", error);
      return NextResponse.json(
        { message: "Internal Server Error", error },
        { status: 500 }
      );
    }
  }








//   GET /api/cook?connection_id=101625596288293490906&recipe=762dca58-496e-432a-9df3-cc0f73043c03 200 in 115ms
//   GET /cook/7137a7fd-14ab-454e-a3a1-e3f302b11323 200 in 31ms
//  API /api/cook called
//  Connected
//  API /api/cook response sent
//   GET /api/cook?connection_id=101625596288293490906&recipe=7137a7fd-14ab-454e-a3a1-e3f302b11323 200 in 77ms
//  API /api/cook called
//  Connected
//  API /api/cook response sent
//   GET /api/cook?connection_id=101625596288293490906&recipe=7137a7fd-14ab-454e-a3a1-e3f302b11323 200 in 86ms
 