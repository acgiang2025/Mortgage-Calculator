// Calculate Mortgage Function    
    // 0. Home Value
    // 1. Down Payment
    // 2. Loan Amount
    // 3. Interest Rate
    // 4. Loan Term
    // 5. Property Tax
    // 6. PMI
    // 7. Home Insurance
    // 8. HOA

    // https://www.mortgagecalculator.org/

    // Mortgage Repayment Summary
    
    // 1. Monthly Mortgage
    // 2. PMI 
    // 3. Down Payment Amount
    // 4. Down Payment %
    // 5. Loan Payoff Date 
    // 6. Total Interest Paid
    // 7. Monthly Tax Paid
    // 9. Monthly Home Insurance
    // 11. Total Payment


    // Downpayment % = downpayment / home value 
    // Monthly PMI = (pmi % * loan value) / 12  
    // Mortgage Payment (mp) = P(r/n) / [1-(1+r/n)^(-nt)]
    // ex: (400000*(.05/12))/(1-(1+.05/12)^(-12*30))
    // Mortgage Payment with PMI = mp + monthly pmi 
    // Total Interest Paid = mp * (n*t) - loan amount
    // Property Tax = property tax % * home value 
    // monthly Property Tax = Property Tax / 12
    // Monthly HOA = HOA (yearly) / 12
    // Monthly Home Insurance = Home Insurance (yearly) / 12
    // Total Monthly Payment = mp + monthly pmi + monthly property tax + monthly home insurance + monthly hoa 

function calculateMortgage(){
    let temp_arr = $('#mortgageForm').serializeArray() 
    console.log(temp_arr)
    let homeValue = parseInt(temp_arr[0].value)
    let downPayment = parseInt(temp_arr[1].value)
    let interestRate = parseFloat(temp_arr[2].value/100)
    let loanTerm = parseInt(temp_arr[3].value)
    let propertyTax = parseFloat(temp_arr[4].value/100)
    let pmi = (parseFloat(temp_arr[5].value/100)) ? parseFloat(temp_arr[5].value/100) : 0 
    let homeInsurance = (parseInt(temp_arr[6].value)) ? parseInt(temp_arr[6].value) : 0 
    let hoa = (parseInt(temp_arr[7].value)) ? parseInt(temp_arr[7].value) : 0 
    let loanAmount = homeValue - downPayment

    let results = []

    // Calculate Monthly Mortgage Payment 
    // Mortgage Payment (mp) = loan value(interest rate/loan term) / [1-(1+interest rate/loan term)^(-#payments*loan term)]
    let monthlyMortgage = (loanAmount*(interestRate/12)) / (1-(1+(interestRate/12))**-(12*loanTerm))

    // Calculate PMI if downpayment is less than 20% 
    let monthlyPmi = 0 
    if(downPayment/homeValue < .2){
        monthlyPmi = (pmi * loanAmount)/12
    }
    // Calculate Monthly Mortgage with PMI 
    let monthlyMortgagePmi = monthlyMortgage + monthlyPmi 
    // Calculate Total Interest Paid 
    let totalInterest = (monthlyMortgage * 12 * loanTerm) - loanAmount
    // Calculate Monthly Property Tax 
    let monthlyPropertyTax = (propertyTax * homeValue) / 12 
    // Calculate Monthly Home Insurance
    let monthlyHomeInsurance = homeInsurance / 12
    // Calculate Monthly HOA Fees
    let monthlyHoa = hoa / 12
    // Calculate Total Monthly Payment 
    let totalPayment = monthlyMortgagePmi + monthlyPropertyTax + monthlyHomeInsurance + monthlyHoa

    results.push(monthlyMortgage.toFixed(2), monthlyPmi.toFixed(2), monthlyMortgagePmi.toFixed(2), totalInterest.toFixed(2), monthlyPropertyTax.toFixed(2), monthlyHomeInsurance.toFixed(2), monthlyHoa.toFixed(2), totalPayment.toFixed(2))
    console.log(results)
    return results
   
    
}

function getMortgageCalculations(){
    calculations = calculateMortgage()
    console.log(calculations[0].toLocaleString())
    console.log(
        "Monthly Mortgage: $" + parseFloat(calculations[0]).toLocaleString('en') + "\n" + 
        "Monthly PMI: $" + parseFloat(calculations[1]).toLocaleString('en') + "\n" + 
        "Monthly Mortgage with PMI: $" + parseFloat(calculations[2]).toLocaleString('en') + "\n" + 
        "Total Interest Paid: $" + parseFloat(calculations[3]).toLocaleString('en') + "\n" + 
        "Monthly Property Tax: $" + parseFloat(calculations[4]).toLocaleString('en') + "\n" + 
        "Monthly Home Insurance: $" + parseFloat(calculations[5]).toLocaleString('en') + "\n" + 
        "Monthly HOA Fees: $" + parseFloat(calculations[6]).toLocaleString('en') + "\n" + 
        "Total Monthly Payment: $" + parseFloat(calculations[7]).toLocaleString('en') 
    ) 


    // $('#monthlyMortgage')[0].textContent = "$" + parseFloat(calculations[0]).toLocaleString('en')
    // $('#monthlypmi')[0].textContent = "$" + parseFloat(calculations[1]).toLocaleString('en')
    // $('#monthlyMortgagepmi')[0].textContent = "$" + parseFloat(calculations[2]).toLocaleString('en')
    // $('#totalInterest')[0].textContent = "$" + parseFloat(calculations[3]).toLocaleString('en')
    // $('#monthlyPropertyTax')[0].textContent = "$" + parseFloat(calculations[4]).toLocaleString('en')
    // $('#monthlyHomeInsurance')[0].textContent = "$" + parseFloat(calculations[5]).toLocaleString('en')
    // $('#monthlyhoaFees')[0].textContent = "$" + parseFloat(calculations[6]).toLocaleString('en')
    // $('#monthlyPayment')[0].textContent = "$" + parseFloat(calculations[7]).toLocaleString('en')
    $('#principal-and-interest')[0].textContent = parseFloat(calculations[7]).toLocaleString('en')
    $('#property-tax')[0].textContent = parseFloat(calculations[4]).toLocaleString('en')
    $('#home-insurance')[0].textContent = parseFloat(calculations[5]).toLocaleString('en')
    $('#monthly-payment')[0].textContent = parseFloat(calculations[6]).toLocaleString('en')
}

$('#mortgageForm')[0].addEventListener('submit', function(e){
    e.preventDefault() 
    getMortgageCalculations()
})