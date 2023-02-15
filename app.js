//loading all DOM elements
const laptopsElement = document.getElementById("laptops")
const laptopNameElement = document.getElementById("laptopName")
const priceElement = document.getElementById("price")
const balanceElement = document.getElementById("balance")
const savingsFromWorkElement = document.getElementById("savingsFromWork")
const featuresElement = document.getElementById("features")
const descriptionElement = document.getElementById("description")
const imageElement = document.getElementById("image")
const loanDueElement = document.getElementById("loanDue")

//loading all button type DOM elements
const workElement = document.getElementById("work")
const depositElement = document.getElementById("deposit")
const getLoanElement = document.getElementById("getLoan")
const payLoanElement = document.getElementById("payLoan")
const buyElement = document.getElementById("buy")

let balance = 300       //balance initialized at 300euros
let workSavings = 0
let loanDue = 0

let laptops = []

//fetching the laptops' data from the given API, using promises to add every laptop to the menu
fetch("https://hickory-quilled-actress.glitch.me/computers")
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => addLaptopsToMenu(laptops))

//add every laptop to the menu, and initializing the price, specs, description, image and laptop name areas with values of the first laptop
const addLaptopsToMenu = (laptops) => {
    laptops.forEach(l => addLaptopToMenu(l))
    featuresElement.innerText = laptops[0].specs
    laptopNameElement.innerText = laptops[0].title
    descriptionElement.innerText = laptops[0].description
    priceElement.innerText = laptops[0].price + "€"
    imageElement.setAttribute("src", "https://hickory-quilled-actress.glitch.me/" + laptops[0].image)
}

//adding every laptop to the menu as options, by creating a laptopElement for every laptop
const addLaptopToMenu = (laptop) => {
    const laptopElement = document.createElement("option")
    laptopElement.value = laptop.id
    laptopElement.appendChild(document.createTextNode(laptop.title))
    laptopsElement.appendChild(laptopElement)

}

//when we go through laptop options, we have to make changes so that the right specs, image, price etc. appear on screen
const handleLaptopMenuChange = e => {

    const selectedLaptop = laptops[e.target.selectedIndex]
    featuresElement.innerText = selectedLaptop.specs
    laptopNameElement.innerText = selectedLaptop.title
    descriptionElement.innerText = selectedLaptop.description
    priceElement.innerText = selectedLaptop.price + "€"
    imageElement.setAttribute("src", "https://hickory-quilled-actress.glitch.me/" + selectedLaptop.image)
}

//handling the "get a loan" request
const gettingALoan = () => {

    if (loanDue > 0) {                                                                                              //checking if there is a loan to be paid
        alert("You have already a loan to be paid, cannot get another")
    } else {
        const loan = parseFloat(prompt("Please enter the sum of money you want for your loan: "))                   //asking for the user's input

        if(isNaN(loan))                                                                                             //checking if the input is a number, if not it returns from the function
            return;

        if (loan > balance * 2) {                                                                                   //checking if the amount of money requested is too large
            alert("You cannot borrow over " + 2 * balance + " euros")
        } else {
            loanDue = loan                                                                                          //making changes to our account's balance, and making the "pay loan" button visible
            balance += loan
            balanceElement.innerText = balance + "€"
            loanDueElement.innerText = "\nLoan: " + loanDue + "€"
            payLoanElement.removeAttribute("hidden")
        }
    }

}

//increase our savings by 100 at every click of "work" button
const increaseWorkSavings = e => {
    workSavings += 100
    savingsFromWorkElement.innerText = workSavings + "€"
}

//handling the "deposit" request
const makeDeposit = () => {

    if (loanDue === 0) {                                                //if there is no loan due, we just add the money to our account's balance
        balance += workSavings
    } else {
        balance += workSavings * 0.9                                    //else, we add the 90% of our savings

        if (loanDue > workSavings * 0.1) {                              //and we diminish our loan to be paid by 10%
            loanDue -= workSavings * 0.1
            loanDueElement.innerText = "\nLoan: " + loanDue + "€"
        } else {
            balance += (workSavings * 0.1 - loanDue)                    //if the 10% of our deposit overpays our loan, we add the rest to our balance and we make the "pay loan" button disappear
            payLoanElement.setAttribute("hidden", "hidden")
            loanDue = 0
            loanDueElement.innerText=""
        }
    }

    workSavings = 0                                                     //our savings are back to 0

    savingsFromWorkElement.innerText = workSavings + "€"
    balanceElement.innerText = balance + "€"
}

//handles the "pay loan" request
const payLoan = () => {

    if (workSavings < loanDue) {                                        //our debt is diminished
        loanDue -= workSavings
        loanDueElement.innerText = "\nLoan: " + loanDue + "€"
    } else {
        balance += (workSavings - loanDue)                              //but if our savings are more than our debt, the rest are added to our account's balance and the "pay loan" button disappears
        balanceElement.innerText = balance + "€"
        payLoanElement.setAttribute("hidden", "hidden")
        loanDue = 0
        loanDueElement.innerText=""
    }

    workSavings = 0                                                     //our savings are back to 0

    savingsFromWorkElement.innerText = workSavings + "€"
}

//handles the "buy now" request
const buyLaptop = () => {

    const currentLaptopPrice = parseFloat(priceElement.innerText)

    if (balance < currentLaptopPrice) {                                             //if we cannot afford the laptop, according to our bank account, we get the appropriate message
        alert("According to your bank account, you cannot purchase this laptop")
    } else {
        alert("Congrats, " + laptopNameElement.innerText + " is yours")             //else, the laptop is ours, and our money is reduced
        balance -= currentLaptopPrice
        balanceElement.innerText = balance + "€"
    }
}

getLoanElement.addEventListener("click", gettingALoan)                              //on click listener to get a loan
workElement.addEventListener("click", increaseWorkSavings)                          //on click listener to work and get 100euros
depositElement.addEventListener("click", makeDeposit)                               //on click listener to make a deposit
payLoanElement.addEventListener("click", payLoan)                                   //on click listener to pay the loan
buyElement.addEventListener("click", buyLaptop)                                     //on click listener to buy a laptop

laptopsElement.addEventListener("change", handleLaptopMenuChange)                   //on change listener when we change the laptop menu option