import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { createIngredients, searchIngredients, updateIngredients } from "./services";
import { PatchIngredientInput, PatchIngredientsArraySchema, PostIngredientsInput, PostIngredientsSchema, GetIngredientsQuerySchema } from "./schema";



export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = {input: searchParams.get('input')};

    const parsed = GetIngredientsQuerySchema.safeParse(rawQuery);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { input } = parsed.data;

    await connectDB();

    const result = await searchIngredients(input);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An internal error occurred" },
      { status: 500 }
    );
  }
}
// Settings for atlas search
// {
//     "mappings": {
//       "dynamic": false,
//       "fields": {
//         "name": {
//           "analyzer": "custom_analyzer",
//           "type": "string"
//         }
//       }
//     },
//     "analyzers": [
//       {
//         "charFilters": [],
//         "name": "custom_analyzer",
//         "tokenFilters": [
//           {
//             "type": "lowercase"
//           }
//         ],
//         "tokenizer": {
//           "maxGram": 200,
//           "minGram": 2,
//           "type": "edgeGram"
//         }
//       }
//     ]
// }





export async function POST(req: Request) {
  try {
    const raw = await req.json();

    const result = PostIngredientsSchema.safeParse(raw);

    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      );
    }

    const data: PostIngredientsInput = result.data;

    await connectDB();

    await createIngredients(data);

    return NextResponse.json({ message: 'Success' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An internal error occurred" },
      { status: 500 }
    );
  }
}





export async function PATCH(req: Request) {
  try {
    const raw = await req.json();

    const result = PatchIngredientsArraySchema.safeParse(raw);

    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      );
    }

    const data: PatchIngredientInput[] = result.data;

    await connectDB();

    const toUpdate = await updateIngredients(data);

    return NextResponse.json({ message: 'Success', body: toUpdate });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'An internal error occurred' },
      { status: 500 }
    );
  }
}