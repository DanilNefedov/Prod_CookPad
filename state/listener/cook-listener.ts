import { createListenerMiddleware } from "@reduxjs/toolkit";
import { deleteRecipe, setRedirect } from "../slices/cook-slice";
import { RootState } from "../store";
import { selectCookHistoryLinks } from "../selectors/cook";








export const cookListener = createListenerMiddleware();


cookListener.startListening({
    actionCreator: deleteRecipe.fulfilled,
    effect: async (action, api) => {
        const state = api.getState() as RootState;
        const history = selectCookHistoryLinks(state);
        const nextRoute = getNextRouteAfterDelete(history, action.payload.recipe_id);
        api.dispatch(setRedirect(nextRoute));
    },
});


export function getNextRouteAfterDelete(history: { recipe_id: string }[],deletedId: string): string {
    if (!history || history.length === 0) return '/home';

    const index = history.findIndex(item => item.recipe_id === deletedId);

    if (index === -1) return '/home';

    if (history[index + 1]) return `/cook/${history[index + 1].recipe_id}`;
    if (history[index - 1]) return `/cook/${history[index - 1].recipe_id}`;

    return '/home';
}