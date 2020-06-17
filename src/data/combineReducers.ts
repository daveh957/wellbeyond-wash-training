export function combineReducers<R extends any>(reducers: R) {
  type keys = keyof typeof reducers;
  // @ts-ignore
  type returnType = { [K in keys]: ReturnType<typeof reducers[K]> }
  const combinedReducer = (state: any, action: any) => {
    const newState: returnType = {} as any;
    // @ts-ignore
    const keys = Object.keys(reducers);
    keys.forEach(key => {
      // @ts-ignore
      const result = reducers[key](state[key], action);
      newState[key as keys] = result || state[key];
    });
    return newState;
  }
  return combinedReducer;
}
