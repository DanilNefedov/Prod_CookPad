import { RootState } from "../store";


export const selectCookHistoryLinks = (state: RootState) =>
  state.cookHistory.history_links;
