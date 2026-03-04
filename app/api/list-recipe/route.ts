import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import {
    DeleteListRecipeSchema,
    GetListRecipeQuerySchema,
    PostListRecipeSchema,
} from "./schema";
import {
    createListRecipe,
    deleteListRecipe,
    findRecipeForList,
    getListRecipesPage,
    transformRecipeForList,
} from "./services";





export async function POST(request: Request) {
    try{
        const body = await request.json();

        const parsed = PostListRecipeSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        const { connection_id, recipe_id } = parsed.data;

        await connectDB();

        const recipe = await findRecipeForList({ connection_id, recipe_id });

        if (!recipe) {
            return NextResponse.json(
                { message: "No recipes found for the provided connection_id" },
                { status: 404 }
            );
        }
        const transformedRecipe = transformRecipeForList(recipe);
        const returnData = await createListRecipe({ connection_id, transformedRecipe });

        return NextResponse.json(
            {data: returnData},
            { status: 201 }
        );

    }catch(error){
        console.log(error)
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}






export async function GET(request: Request) {
    try {   
        const { searchParams } = new URL(request.url);
        const rawQuery = {
            connection_id: searchParams.get("connection_id"),
            page: searchParams.get("page"),
        };

        const parsed = GetListRecipeQuerySchema.safeParse(rawQuery);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        const { connection_id, page } = parsed.data;

        await connectDB();

        const formattedRecipes = await getListRecipesPage({ connection_id, page });

        return NextResponse.json(formattedRecipes);

    }catch(error){
        console.log(error)
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }

}





export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const parsed = DeleteListRecipeSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { message: 'Invalid request data' }, 
            { status: 400 }
        );
    }

    const { connection_id, recipe_id } = parsed.data;

    await connectDB();

    const result = await deleteListRecipe({ connection_id, recipe_id });

    if (!result) {
        return NextResponse.json({ message: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json(recipe_id, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
