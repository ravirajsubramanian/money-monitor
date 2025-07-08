import React from 'react';
import { useFinance } from '../context/FinanceContext';

function InvestmentForm() {
  const { state, dispatch } = useFinance();

  const handleInvestmentChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_INVESTMENT', field: name, value });
  };

  const handleDebtChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_DEBT', field: name, value });
  };

  return (
    <div className="investment-form">
      <h2>Update Investments</h2>
      <div className="form-section">
        <h3>Assets</h3>
        {Object.entries(state.investments).map(([key, value]) => (
          <div key={key} className="form-group">
            <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').trim()}:</label>
            <input
              type="number"
              id={key}
              name={key}
              value={value}
              onChange={handleInvestmentChange}
              disabled={!state.isEditing}
            />
          </div>
        ))}
      </div>

      <div className="form-section">
        <h3>Liabilities</h3>
        {Object.entries(state.debts).map(([key, value]) => (
          <div key={key} className="form-group">
            <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').trim()}:</label>
            <input
              type="number"
              id={key}
              name={key}
              value={value}
              onChange={handleDebtChange}
              disabled={!state.isEditing}
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => dispatch({ type: 'TOGGLE_EDIT' })}
        className="btn-edit"
      >
        {state.isEditing ? 'Save' : 'Edit'}
      </button>
    </div>
  );
}

export default InvestmentForm;
