import connectDB from "@/app/lib/mongoose";
import RecipePopularConfig from "@/app/models/popular-config";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import { categoryUser } from "../../functions";










export async function PATCH(request: Request) {
    try {
        await connectDB();

        const {config_id, id_author} = await request.json();

        if (!config_id || !id_author ) {
            return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
        }

        const popular = await RecipePopularConfig.findById(config_id);
        if (!popular || !popular.categories) {
            return NextResponse.json({ message: "Popular config not found" }, { status: 404 });
        }

        const user = await User.findOne({ connection_id: id_author });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const updatedConfig = categoryUser(user.popular_config, true, 1.2, popular.categories);

        if (updatedConfig.length > 0) {
            await User.updateOne(
                { connection_id: id_author },
                { $set: { popular_config: updatedConfig } }
            );
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
