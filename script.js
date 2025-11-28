// This script powers a full-featured mortgage calculator. It accepts key inputs: home value, down payment, interest rate, loan term, property tax, PMI, home insurance, 
// and HOA fees, and computes the monthly mortgage payment along with a detailed cost breakdown. In addition to the payment calculations, the script also generates 
// an amortization line graph and produces a complete amortization schedule table for deeper financial insight.


// Pagination settings 
let currentPage = 1
const rowsPerPage = 12
var amortizationTable = [] 
var months = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];
const dateObj = new Date();
const month   = dateObj.getUTCMonth() // months from 1-12
const day     = dateObj.getUTCDate()
const year    = dateObj.getUTCFullYear()
var monthly_payment = 0
var principal_and_interest = 0
var monthly_pmi = 0 
var monthly_property_tax = 0
var homeowners_insurance = 0
var hoa_fees = 0 
var balance = []
var years = [] 
let lineGraph = null 

// The calculateMortgage function takes the form data into an array and calculates the monthly payment breakdown. Afterwards, it builds it onscreen, along with the amortization table and graph. 
function calculateMortgage(){
    let temp_arr = $('#mortgageForm').serializeArray() 
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
    amortizationTable = calculateAmortization(monthlyMortgage,loanAmount, interestRate, loanTerm)
    buildTable(currentPage)
    buildGraph()
    // document.getElementById("table-container").appendChild(buildAmortizationTable(calculateAmortization(monthlyMortgage,loanAmount, interestRate, loanTerm)))
    return results
}

// The calculate Amortization function processes the monthly mortgage payment information and calculates the amortization for the term of the loan. 
function calculateAmortization(monthlyPayment, loanAmount, interestRate, loanTerm){

    let amortizationTable = [] 
    let totalNumberOfPayments = loanTerm * 12 
    let totalPrincipalPaid = 0
    let totalInterestPaid = 0 
    let remainingBalance = loanAmount 
    let monthlyInterest = 0 
    let currentMonth = month 
    let currentYear = year 
    let nextMonth = month + 1 
    balance = []
    years = [] 
    for(let i = 0; i < totalNumberOfPayments; i++){
        monthlyInterest = remainingBalance*(interestRate/12)
        totalInterestPaid = totalInterestPaid + monthlyInterest 
        totalPrincipalPaid = totalPrincipalPaid + (monthlyPayment - monthlyInterest) 
        remainingBalance = remainingBalance - (monthlyPayment - monthlyInterest)
        if(remainingBalance < 0){
            remainingBalance = 0
        }

        amortizationTable.push({
            "month": months[currentMonth],
            "year": currentYear.toString(),
            "interest":totalInterestPaid.toLocaleString('en-US',{style:'currency',currency:'USD'}), 
            "principal":totalPrincipalPaid.toLocaleString('en-US',{style:'currency',currency:'USD'}),
            "balance":remainingBalance.toLocaleString('en-US',{style:'currency',currency:'USD'})
        })

        balance.push(remainingBalance)
        years.push(i+1) 

        if(nextMonth == 12){
            currentMonth = 0 
            nextMonth = 1
            currentYear += 1
        }else{
            nextMonth += 1
            currentMonth += 1
        }
    }

    return amortizationTable
}

// The buildMonthlyPaymentBreakdown function takes the processed mortgage values and populates the entries in the Monthly Payment Breakdown. It also sets local values for the amortization calculations. 
function buildMonthlyPaymentBreakdown(){
    calculations = calculateMortgage()
    $('#principal-and-interest')[0].textContent = parseFloat(calculations[0]).toLocaleString('en')
    $('#results-pmi')[0].textContent = parseFloat(calculations[1]).toLocaleString('en')
    $('#property-tax')[0].textContent = parseFloat(calculations[4]).toLocaleString('en')
    $('#home-insurance')[0].textContent = parseFloat(calculations[5]).toLocaleString('en')
    $('#monthly-payment')[0].textContent = parseFloat(calculations[7]).toLocaleString('en')
    $('#hoa-fees')[0].textContent = parseFloat(calculations[6]).toLocaleString('en')
    monthly_payment = parseFloat(calculations[7]).toLocaleString('en')
    principal_and_interest = parseFloat(calculations[0]).toLocaleString('en')
    monthly_pmi = parseFloat(calculations[1]).toLocaleString('en')
    monthly_property_tax = parseFloat(calculations[4]).toLocaleString('en')
    homeowners_insurance = parseFloat(calculations[5]).toLocaleString('en')
    hoa_fees = parseFloat(calculations[6]).toLocaleString('en')
}

// The buildTable function builds the amortization schedule breakdown
function buildTable(page){
    const tableContainer = document.getElementById("table-container")
    tableContainer.innerHTML = "" // Clear previous table
    const table = document.createElement("table")
    table.border = "1"
    table.style.borderCollapse = "collapse"
    table.style.width = "300px"

    // Header
    const header = document.createElement("tr")
    Object.keys(amortizationTable[0]).forEach(key => {
        const th = document.createElement("th")
        th.textContent = key.charAt(0).toUpperCase() + key.slice(1)
        th.style.padding = "8px"
        header.appendChild(th)
    })
    table.appendChild(header)

    // Calculate slice of data for this page
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage
    const paginatedData = amortizationTable.slice(start, end)

    // Rows
    paginatedData.forEach(row => {
        const tr = document.createElement("tr")
        Object.values(row).forEach(value => {
            const td = document.createElement("td")
            td.textContent = value
            td.style.padding = "8px"
            tr.appendChild(td)
        })
        table.appendChild(tr)
    })

    tableContainer.appendChild(table)

    updatePageInfo();
}

// The buildGraph function builds the amortization for a mortgage loan. It utilizes chart.js to build a responsive line graph. 
function buildGraph(){

    if(lineGraph){
        lineGraph.destroy() 
    }

    const ctx = document.getElementById('amortization-line-graph');

    const data = {
    labels: years,
    datasets: [{
        label: 'Loan Balance',
        data: balance,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
    };

    const startYear = 2025
    const monthsPerYear = 12
    const incrementYears = 10
    const incrementMonths = incrementYears * monthsPerYear

    lineGraph = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            animation: {
                duration: 1000,
                animateScale: true,
                animateRotate: true
            },
            scales: {
                x: {
                    ticks: {
                        callback: function(value, index) {

                            // Always show the FIRST label (start year)
                            if (index === 0) {
                                return startYear;
                            }
                            
                            if((index + 1) % incrementMonths == 0){
                                return startYear + ((index+1)/12)
                            }

                            // return ""; // hide all other labels
                        }
                    }
                }
            }
        }
    });

}

// Pagination 
function updatePageInfo() {
    const pageInfo = document.getElementById("pageInfo")
    const totalPages = Math.ceil(amortizationTable.length / rowsPerPage)
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Button function to reveal amortization information
function showAmortization(){
    if ($('.mpb')[0].classList.contains('hide')){
        return
    }else{
        $('.mpb')[0].classList.add('hide')
        $('.table-div')[0].classList.remove('hide')

    }
}

// Button fuction to reveal payment breakdown function 
function showMonthlyBreakdown(){
    if ($('.table-div')[0].classList.contains('hide')){
        return
    }else{
        $('.mpb')[0].classList.remove('hide')
        $('.table-div')[0].classList.add('hide')

    }
}

$('#mortgageForm')[0].addEventListener('submit', function(e){
    e.preventDefault() 
    buildMonthlyPaymentBreakdown()
})

// Buttons
document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--
        buildTable(currentPage)
    }
});

document.getElementById("nextBtn").addEventListener("click", () => {
    const totalPages = Math.ceil(amortizationTable.length / rowsPerPage)
    if (currentPage < totalPages) {
        currentPage++
        buildTable(currentPage)
    }
});

const tabs = document.querySelectorAll(".tab");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"))
        tab.classList.add("active")
    })
})

$('#calculate_btn')[0].click()
