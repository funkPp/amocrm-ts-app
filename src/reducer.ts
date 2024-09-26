import { ILead, IState, IAction } from "./types";

export const reducer = (state: IState, action: IAction): IState => {
  const { type } = action;
  switch (type) {
    case "Loading":
      console.log("loading");
      return { ...state, isLoading: true, isShow: true };
    case "Response":
      console.log("response", action.payload);
      return {
        ...state,
        isLoading: false,
        data: action.payload as ILead,
        isShow: true,
      };
    case "Close":
      console.log("close X");
      return { ...state, isLoading: false, isShow: false };
    default:
      return state;
  }
};
