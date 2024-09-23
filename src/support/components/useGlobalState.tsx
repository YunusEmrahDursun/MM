import React, { createContext, useReducer, useContext, Dispatch, ReactNode } from 'react';

export interface StateType {
	sidebar: boolean;
  admin: boolean;
}

export type Action =
| { type: 'TOGGLE_SIDEBAR'; value: boolean } | { type: 'ADMIN'; value: boolean } ;

const initialState: StateType = {
  sidebar: false,
  admin:true
};

const reducer = (state: StateType, action: Action): StateType => {
	switch (action.type) {
	  case 'TOGGLE_SIDEBAR':
		  return { ...state, sidebar: action.value };
    case 'ADMIN':
      return { ...state, admin: true };
	  default:
		  return state;
	}

};

interface StateContextType {
	state: StateType;
	dispatch: Dispatch<Action>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const Provider = ({ children }: ProviderProps) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
	  <StateContext.Provider value={{ state, dispatch }}>
		{children}
	  </StateContext.Provider>
	);
};

export const useGlobalState = () => {
	const context = useContext(StateContext);
	if (context === undefined) {
		throw new Error('useGlobalState must be used within a Provider');
	}
	return context;
};
