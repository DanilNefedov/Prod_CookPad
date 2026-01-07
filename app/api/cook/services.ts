import CookHistory from "@/app/models/cook-history";


interface DeleteHistory{
    connection_id: string,
    recipe_id: string
}


export async function deleteHistory({connection_id, recipe_id}:DeleteHistory) {
    const result = await CookHistory.updateOne(
        { connection_id },
        {
            $pull: {
                history_links: { recipe_id }
            }
        }
    );

    if (result.modifiedCount === 0) {
        // return NextResponse.json(
        //     { message: 'Recipe not found in history' },
        //     { status: 404 }
        // );
        return { status: 404 }
    }

    return { status: 404 }
}