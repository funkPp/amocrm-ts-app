import { ILead, IState, IAction } from "./types";

export const reducer = (state: IState, action: IAction): IState => {
  const { type } = action;
  switch (type) {
    case "Loading":
      return { ...state, isLoading: true, isShow: true };
    case "Response":
      return {
        ...state,
        isLoading: false,
        data: action.payload as ILead,
        isShow: true,
      };
    case "Close":
      return { ...state, isLoading: false, isShow: false };
    default:
      return state;
  }
};
