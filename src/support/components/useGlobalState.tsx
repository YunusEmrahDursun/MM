import React, { createContext, useReducer, useContext, Dispatch, ReactNode } from 'react';

export interface StateType {
	sidebar: boolean;
  }
  
export type Action =
| { type: 'TOGGLE_SIDEBAR'; value: boolean };

const initialState: StateType = {
	sidebar: false,
};

const reducer = (state: StateType, action: Action): StateType => {
	switch (action.type) {
	  case 'TOGGLE_SIDEBAR':
		return { ...state, sidebar: action.value };
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