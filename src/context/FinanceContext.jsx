import React, { createContext, useContext, useReducer, useEffect } from 'react';

const FinanceContext = createContext();

const initialState = {
  investments: {
    cash: 0,
    savingsAccount: 0,
    fixedDeposit: 0,
    epf: 0,
    ppf: 0,
    liquidFunds: 0,
    postOfficeSavings: 0,
    ssy: 0,
    directEquity: 0,
    equityMF: 0,
    goldJewels: 0,
    goldETF: 0,
    realEstate: 0,
    crypto: 0,
    p2p: 0
  },
  debts: {
    mortgage: 0,
    nonMortgageLoans: 0,
    creditCard: 0
  },
  goals: {
    targetNetWorth: 0,
    timeline: 1
  },
  otherInvestments: [],
  isEditing: false
};

function financeReducer(state, action) {
  switch (action.type) {
    case 'SET_INVESTMENT':
      return {
        ...state,
        investments: {
          ...state.investments,
          [action.field]: Number(action.value)
        }
      };
    case 'SET_DEBT':
      return {
        ...state,
        debts: {
          ...state.debts,
          [action.field]: Number(action.value)
        }
      };
    case 'SET_GOAL':
      return {
        ...state,
        goals: {
          ...state.goals,
          [action.field]: Number(action.value)
        }
      };
    case 'TOGGLE_EDIT':
      return {
        ...state,
        isEditing: !state.isEditing
      };
    case 'RESET_ALL':
      return initialState;
    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('financeData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.entries(parsedData.investments).forEach(([field, value]) => {
        dispatch({ type: 'SET_INVESTMENT', field, value });
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('financeData', JSON.stringify(state));
  }, [state]);

  return (
    <FinanceContext.Provider value={{ state, dispatch }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
