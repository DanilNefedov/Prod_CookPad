import { RootState } from "@/state/store";
import { ERROR_MESSAGES_LIST_RECIPE, LOADING_MESSAGES_LIST_RECIPE, SUCCESS_MESSAGES_LIST_RECIPE } from "./dictionaries";
import { closeErrorWindow } from "@/state/slices/list-recipe-slice";






export const SLICE_CONFIGS = {
    listRecipe: {
        sliceSelector: (state: RootState) => state.listRecipe.operations,
        successMessages: SUCCESS_MESSAGES_LIST_RECIPE,
        errorMessages: ERROR_MESSAGES_LIST_RECIPE,
        loadingMessages: LOADING_MESSAGES_LIST_RECIPE,
        closeErrorAction: closeErrorWindow,
    },
//   userProfile: {
//     sliceSelector: (state: RootState) => state.userProfile.operations,
//     successMessages: SUCCESS_MESSAGES_PROFILE,
//     errorMessages: ERROR_MESSAGES_PROFILE,
//     loadingMessages: LOADING_MESSAGES_PROFILE,
//     closeErrorAction: closeProfileError,
//   },
} as const;

export type SliceKey = keyof typeof SLICE_CONFIGS;
