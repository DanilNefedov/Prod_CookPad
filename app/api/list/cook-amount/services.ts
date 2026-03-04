import ListIngredients from "@/app/models/list";
import { PatchCookAmountDTO } from "./schema";

export async function updateCookAmount({ name, connection_id, _id, amount }: PatchCookAmountDTO) {
    return ListIngredients.findOneAndUpdate(
        {
            connection_id,
            name,
            "units._id": _id,
        },
        {
            $set: {
                "units.$.amount": amount,
            },
        },
        { new: true }
    );
}
