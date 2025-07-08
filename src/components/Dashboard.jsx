import React from 'react';
import { useFinance } from '../context/FinanceContext';
import InvestmentForm from './InvestmentForm';
import Summary from './Summary';

function Dashboard() {
  const { state } = useFinance();

  return (
    <div className="dashboard">
      <h1>Financial Dashboard</h1>
      <Summary />
      <InvestmentForm />
    </div>
  );
}

export default Dashboard;
