export interface ILead {
  name: string;
  price: number;
  id: string;
  closest_task_at: number;
}
export interface IContext {
  handleClick: (id: ILead["id"]) => void;
  leads: ILead[];
  store: IState;
  closeClick: () => void;
}

export interface IState {
  isLoading: boolean;
  isShow: boolean;
  data: ILead | null;
}

export interface IAction {
  type: string;
  payload?: ILead;
}
