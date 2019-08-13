declare module "MyTypes" {
  import { StateType, ActionType } from "typesafe-actions";
  export type Store = StateType<typeof import("./index").default>;
  export type ReducerState = StateType<typeof import("../reducers").default>;
  export type RootAction = ActionType<typeof import("../actions")>;
}