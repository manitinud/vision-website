document.addEventListener('DOMContentLoaded', function () {
  const calculateBtn = document.getElementById('calculateBtn');
  const grossIncomeEl = document.getElementById('grossIncome');
  const ageEl = document.getElementById('age');
  const deduction80CEl = document.getElementById('deduction80C');
  const deduction80DEl = document.getElementById('deduction80D');
  const homeLoanInterestEl = document.getElementById('homeLoanInterest');
  const otherDeductionsEl = document.getElementById('otherDeductions');
  const resultEl = document.getElementById('result');
  const verdictEl = document.getElementById('verdict');
  let taxChart = null;

  const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  const calculateTaxOld = (taxableIncome, age) => {
      let tax = 0;
      let exemptionLimit = 250000;
      if (age === '60to80') exemptionLimit = 300000;
      if (age === 'above80') exemptionLimit = 500000;
      if (taxableIncome <= exemptionLimit) return 0;
      if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.30;
      if (taxableIncome > 500000) tax += (Math.min(taxableIncome, 1000000) - 500000) * 0.20;
      if (taxableIncome > exemptionLimit) tax += (Math.min(taxableIncome, 500000) - exemptionLimit) * 0.05;
      if (taxableIncome <= 500000) tax = Math.max(0, tax - 12500);
      return tax > 0 ? tax + (tax * 0.04) : 0;
  };
  
  const calculateTaxNew = (taxableIncome) => {
      let tax = 0;
      if (taxableIncome <= 400000) tax = 0;
      else if (taxableIncome <= 800000) tax = (taxableIncome - 400000) * 0.05;
      else if (taxableIncome <= 1200000) tax = 20000 + (taxableIncome - 800000) * 0.10;
      else if (taxableIncome <= 1600000) tax = 60000 + (taxableIncome - 1200000) * 0.15;
      else if (taxableIncome <= 2000000) tax = 120000 + (taxableIncome - 1600000) * 0.20;
      else if (taxableIncome <= 2400000) tax = 200000 + (taxableIncome - 2000000) * 0.25;
      else tax = 300000 + (taxableIncome - 2400000) * 0.30;
      return tax > 0 ? tax + (tax * 0.04) : 0;
  };

  calculateBtn.addEventListener('click', () => {
    const grossIncome = parseFloat(grossIncomeEl.value) || 0;
    if (grossIncome <= 0) {
      resultEl.innerHTML = `<p class="text-red-500 font-semibold">Please enter a valid income.</p>`;
      verdictEl.innerHTML = ''; verdictEl.className = 'text-center mt-4 font-bold text-lg p-3 rounded-md';
      if(taxChart) taxChart.destroy();
      return;
    }
    const age = ageEl.value;
    const deduction80C = Math.min(parseFloat(deduction80CEl.value) || 0, 150000);
    const deduction80D = parseFloat(deduction80DEl.value) || 0;
    const homeLoanInterest = Math.min(parseFloat(homeLoanInterestEl.value) || 0, 200000);
    const otherDeductions = parseFloat(otherDeductionsEl.value) || 0;
    
    const standardDeductionOld = 50000;
    const totalDeductions = standardDeductionOld + deduction80C + deduction80D + homeLoanInterest + otherDeductions;
    const oldRegimeTaxableIncome = Math.max(0, grossIncome - totalDeductions);
    const oldRegimeTax = calculateTaxOld(oldRegimeTaxableIncome, age);
    
    const standardDeductionNew = 75000; 
    const newRegimeTaxableIncome = Math.max(0, grossIncome - standardDeductionNew);
    const newRegimeTax = calculateTaxNew(newRegimeTaxableIncome);

    resultEl.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left"><div class="p-4 bg-blue-100 rounded-lg"><h4 class="font-bold text-blue-800">Old Regime</h4><p class="text-sm text-blue-600">Taxable: ${formatCurrency(oldRegimeTaxableIncome)}</p><p class="text-lg font-bold text-blue-900 mt-1">Tax: ${formatCurrency(oldRegimeTax)}</p></div><div class="p-4 bg-green-100 rounded-lg"><h4 class="font-bold text-green-800">New Regime</h4><p class="text-sm text-green-600">Taxable: ${formatCurrency(newRegimeTaxableIncome)}</p><p class="text-lg font-bold text-green-900 mt-1">Tax: ${formatCurrency(newRegimeTax)}</p></div></div>`;
    
    const savings = Math.abs(oldRegimeTax - newRegimeTax);
    verdictEl.className = 'text-center mt-4 font-bold text-lg p-3 rounded-md';
    if (newRegimeTax < oldRegimeTax) { verdictEl.innerHTML = `The New Regime saves you ${formatCurrency(savings)}!`; verdictEl.classList.add('bg-green-200', 'text-green-800'); }
    else if (oldRegimeTax < newRegimeTax) { verdictEl.innerHTML = `The Old Regime saves you ${formatCurrency(savings)}!`; verdictEl.classList.add('bg-blue-200', 'text-blue-800'); }
    else { verdictEl.innerHTML = `Both regimes have the same tax liability.`; verdictEl.classList.add('bg-slate-200', 'text-slate-800'); }
    
    const ctx = document.getElementById('taxChart').getContext('2d');
    if (taxChart) taxChart.destroy();
    taxChart = new Chart(ctx, { type: 'bar', data: { labels: ['Old Regime', 'New Regime'], datasets: [{ label: 'Tax Liability', data: [oldRegimeTax, newRegimeTax], backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(16, 185, 129, 0.7)'], borderColor: ['rgba(59, 130, 246, 1)', 'rgba(16, 185, 129, 1)'], borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `Tax: ${formatCurrency(c.raw)}` } } }, scales: { y: { beginAtZero: true, ticks: { callback: (v) => formatCurrency(v).replace('₹', '₹ ') } } } } });
  });

  const q1 = document.getElementById('q1'), q2 = document.getElementById('q2'), q3 = document.getElementById('q3');
  const q2_container = document.getElementById('q2_container'), q3_container = document.getElementById('q3_container');
  const formResult = document.getElementById('formResult');
  
  function updateFormFinder() {
    const hasBusinessIncome = q1.value, isPresumptive = q2.value, hasCapitalGains = q3.value;
    q2_container.classList.add('hidden'); q3_container.classList.add('hidden'); formResult.textContent = '';
    if (hasBusinessIncome === 'yes') {
      q2_container.classList.remove('hidden');
      if(isPresumptive === 'yes') formResult.textContent = 'You should file ITR-4 (Sugam).';
      else if (isPresumptive === 'no') formResult.textContent = 'You should file ITR-3.';
    } else if (hasBusinessIncome === 'no') {
      q3_container.classList.remove('hidden');
      if(hasCapitalGains === 'yes') formResult.textContent = 'You should file ITR-2.';
      else if (hasCapitalGains === 'no') formResult.textContent = 'You should file ITR-1 (Sahaj).';
    }
  }
  [q1, q2, q3].forEach(el => el.addEventListener('change', updateFormFinder));
  updateFormFinder();
});