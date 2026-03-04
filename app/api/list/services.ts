import ListIngredients from "@/app/models/list";
import { GetListQueryDTO } from "./schema";











export async function getListByConnection({ connection_id, page_list }: GetListQueryDTO) {
    const limit = 20;
    const skip = (page_list - 1) * limit;

    const [result, totalCount] = await Promise.all([
        ListIngredients.find({ connection_id })
            .select("-createdAt -updatedAt -__v -connection_id")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        ListIngredients.countDocuments({ connection_id }),
    ]);

    const hasMore = skip + result.length < totalCount;
    const nextPage = hasMore ? page_list + 1 : NaN;

    return {
        connection_id,
        list_ingr: result,
        page_list: nextPage,
    };
}


