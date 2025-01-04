let assetsChart, debtsChart;

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format currency in Indian format
function formatIndianCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Input validation
function validateInput(input) {
    const value = Number(input.value);
    if (value < 0) {
        input.value = 0;
        showError('Negative values are not allowed');
        return false;
    }
    return true;
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 3000);
}

function updateCharts(assetData, debtData) {
    if (assetsChart) assetsChart.destroy();
    if (debtsChart) debtsChart.destroy();

    const assetChartData = {
        labels: Object.keys(assetData),
        datasets: [{
            data: Object.values(assetData),
            backgroundColor: [
                '#4CAF50', '#2196F3', '#FFC107', '#FF9800', '#F44336'
            ]
        }]
    };

    const debtChartData = {
        labels: Object.keys(debtData),
        datasets: [{
            data: Object.values(debtData),
            backgroundColor: ['#FF6B6B', '#FF8E72', '#FFB385']
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false
    };

    assetsChart = new Chart(document.getElementById('assetsChart'), {
        type: 'pie',
        data: assetChartData,
        options: chartOptions
    });

    debtsChart = new Chart(document.getElementById('debtsChart'), {
        type: 'pie',
        data: debtChartData,
        options: chartOptions
    });
}

function updateAllocationTable(categories, total) {
    const tbody = document.querySelector('#allocationTable tbody');
    tbody.innerHTML = '';
    let totalPercentage = 0;
    
    Object.entries(categories).forEach(([category, amount]) => {
        const percentage = ((amount / total) * 100).toFixed(2);
        totalPercentage += Number(percentage);
        const row = `
            <tr>
                <td>${category}</td>
                <td>${formatIndianCurrency(amount)}</td>
                <td>${percentage}%</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    document.getElementById('totalAssetsValue').textContent = formatIndianCurrency(total);
    document.getElementById('totalAssetsPercent').textContent = `${totalPercentage.toFixed(2)}%`;
}

function updateFloatingNetWorth(netWorth, totalDebts) {
    document.getElementById('floatingNetWorth').innerHTML = `
        Net Worth<br>
        <strong>${formatIndianCurrency(netWorth)}</strong><br>
        Debt<br>
        <strong>${formatIndianCurrency(totalDebts)}</strong>
    `;
}

// Calculate net worth with validation
const calculateNetWorth = debounce(() => {
    const assetFields = {
        cashEquivalents: ['cash', 'fixedDeposit', 'liquidFunds'],
        fixedIncome: ['epf', 'ppf'],
        equity: ['directEquity', 'equityMF'],
        gold: ['goldJewels', 'goldETF'],
        realEstate: ['realEstate']
    };

    let totalAssets = 0;
    for (const category in assetFields) {
        totalAssets += assetFields[category]
            .map(id => Number(document.getElementById(id).value) || 0)
            .reduce((a, b) => a + b, 0);
    }

    const debts = {
        mortgage: Number(document.getElementById('mortgage').value) || 0,
        nonMortgageLoans: Number(document.getElementById('nonMortgageLoans').value) || 0,
        creditCard: Number(document.getElementById('creditCard').value) || 0
    };
    const totalDebts = Object.values(debts).reduce((a, b) => a + b, 0);

    const netWorth = totalAssets - totalDebts;
    const targetNetWorth = Number(document.getElementById('targetNetWorth').value);
    const timeline = Number(document.getElementById('timeline').value);

    const assetCategories = {
        'Cash & Equivalents': assetFields.cashEquivalents.reduce((sum, id) => sum + (Number(document.getElementById(id).value) || 0), 0),
        'Fixed Income': assetFields.fixedIncome.reduce((sum, id) => sum + (Number(document.getElementById(id).value) || 0), 0),
        'Equity': assetFields.equity.reduce((sum, id) => sum + (Number(document.getElementById(id).value) || 0), 0),
        'Gold': assetFields.gold.reduce((sum, id) => sum + (Number(document.getElementById(id).value) || 0), 0),
        'Real Estate': assetFields.realEstate.reduce((sum, id) => sum + (Number(document.getElementById(id).value) || 0), 0)
    };

    const debtCategories = {
        'Mortgage': debts.mortgage,
        'Non-Mortgage Loans': debts.nonMortgageLoans,
        'Credit Card': debts.creditCard
    };

    updateCharts(assetCategories, debtCategories);
    updateAllocationTable(assetCategories, totalAssets);
    updateFloatingNetWorth(netWorth, totalDebts);

    // Display results with formatted currency
    document.getElementById('netWorthResult').innerHTML = 
        `Current Net Worth: ${formatIndianCurrency(netWorth)}`;

    if (targetNetWorth > netWorth) {
        const required = targetNetWorth - netWorth;
        const yearly = required / timeline;
        const monthly = yearly / 12;
        document.getElementById('goalAnalysis').innerHTML = 
            `To reach your goal of ${formatIndianCurrency(targetNetWorth)}, you need:<br>` +
            `• ${formatIndianCurrency(yearly)} per year<br>` +
            `• ${formatIndianCurrency(monthly)} per month<br>` +
            `for the next ${timeline} ${timeline === 1 ? 'year' : 'years'}.`;
    } else {
        document.getElementById('goalAnalysis').innerHTML = 
            'Congratulations! You have already reached your target net worth!';
    }
}, 500);

// Tab navigation
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to selected tab and content
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Initialize
window.onload = function() {
    setupTabNavigation();
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        const savedValue = localStorage.getItem(input.id);
        if (savedValue !== null) {
            input.value = savedValue;
        }
        
        input.addEventListener('input', function() {
            if (validateInput(this)) {
                localStorage.setItem(this.id, this.value);
                calculateNetWorth();
            }
        });
    });
    
    calculateNetWorth();
};

function resetAllValues() {
    if (confirm('Are you sure you want to reset all values to 0?')) {
        localStorage.clear();
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.value = 0;
        });
        calculateNetWorth();
    }
}
