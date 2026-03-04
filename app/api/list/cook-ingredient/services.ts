import ListIngredients from "@/app/models/list";
import { PatchCookIngredientDTO, PostCookIngredientDTO } from "./schema";

export async function findCookIngredient({ connection_id, name }: Pick<PatchCookIngredientDTO, "connection_id" | "name">) {
    return ListIngredients.findOne({ connection_id, name });
}

export async function appendUnitToCookIngredient({ connection_id, name, units }: PatchCookIngredientDTO) {
    return ListIngredients.findOneAndUpdate(
        { connection_id, name: name.trim() },
        { $push: { units } },
        { new: true }
    );
}

export async function createCookIngredient(data: PostCookIngredientDTO) {
    const newIngredient = await ListIngredients.create(data);

    const filteredData = await ListIngredients.findById(newIngredient._id)
        .select("-connection_id -updatedAt -createdAt -__v")
        .lean();

    return filteredData
}
