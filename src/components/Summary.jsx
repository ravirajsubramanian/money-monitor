import React from 'react';
import { useFinance } from '../context/FinanceContext';

function Summary() {
  const { state } = useFinance();

  const totalAssets = Object.values(state.investments).reduce((a, b) => a + b, 0);
  const totalLiabilities = Object.values(state.debts).reduce((a, b) => a + b, 0);
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="summary">
      <div className="summary-card">
        <h3>Total Assets</h3>
        <p>₹{totalAssets.toLocaleString()}</p>
      </div>
      <div className="summary-card">
        <h3>Total Liabilities</h3>
        <p>₹{totalLiabilities.toLocaleString()}</p>
      </div>
      <div className="summary-card">
        <h3>Net Worth</h3>
        <p>₹{netWorth.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default Summary;
