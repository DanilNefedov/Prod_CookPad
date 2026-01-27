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

        const deletedId = action.payload.recipe_id;

        const index = history.findIndex(
            (item) => item.recipe_id === deletedId
        );

        let nextRoute: string | null = null;

        if (index !== -1) {
            if (history[index + 1]) {
                nextRoute = `/cook/${history[index + 1].recipe_id}`;//?name=${history[index + 1].recipe_name}
            } else if (history[index - 1]) {
                nextRoute = `/cook/${history[index - 1].recipe_id}`;//?name=${history[index - 1].recipe_name}
            }
        }

        if (!nextRoute) {
            nextRoute = '/home';
        }

        api.dispatch(setRedirect(nextRoute));

    },
});