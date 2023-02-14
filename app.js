const laptopsElement = document.getElementById("laptops")
const laptopNameElement = document.getElementById("laptopName")
const priceElement = document.getElementById("price")
const balanceElement = document.getElementById("balance")
const savingsFromWorkElement = document.getElementById("savingsFromWork")
const featuresElement = document.getElementById("features")
const descriptionElement = document.getElementById("description")
const imageElement = document.getElementById("image")
const loanDueElement = document.getElementById("loanDue")

const workElement = document.getElementById("work")
const depositElement = document.getElementById("deposit")
const getLoanElement = document.getElementById("getLoan")
const payLoanElement = document.getElementById("payLoan")
const buyElement = document.getElementById("buy")

let balance = 300
let workSavings = 0
let loanDue = 0

let laptops = []

fetch("https://hickory-quilled-actress.glitch.me/computers")
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => addLaptopsToMenu(laptops))

const addLaptopsToMenu = (laptops) => {
    laptops.forEach(l => addLaptopToMenu(l))
    featuresElement.innerText = laptops[0].specs
    laptopNameElement.innerText = laptops[0].title
    descriptionElement.innerText = laptops[0].description
    priceElement.innerText = laptops[0].price + "€"
    imageElement.setAttribute("src", "https://hickory-quilled-actress.glitch.me/" + laptops[0].image)
}

const addLaptopToMenu = (laptop) => {
    const laptopElement = document.createElement("option")
    laptopElement.value = laptop.id
    laptopElement.appendChild(document.createTextNode(laptop.title))
    laptopsElement.appendChild(laptopElement)

}

const handleLaptopMenuChange = e => {

    const selectedLaptop = laptops[e.target.selectedIndex]
    featuresElement.innerText = selectedLaptop.specs
    laptopNameElement.innerText = selectedLaptop.title
    descriptionElement.innerText = selectedLaptop.description
    priceElement.innerText = selectedLaptop.price + "€"
    imageElement.setAttribute("src", "https://hickory-quilled-actress.glitch.me/" + selectedLaptop.image)
}

const gettingALoan = () => {

    if (loanDue > 0) {
        alert("You have already a loan to be paid, cannot get another")
    } else {
        const loan = parseFloat(prompt("Please enter the sum of money you want for your loan: "))

        if (loan > balance * 2) {
            alert("You cannot borrow over " + 2 * balance + " euros")
        } else {
            loanDue = loan
            balance += loan
            balanceElement.innerText = balance + "€"
            loanDueElement.innerText = "\nLoan: " + loanDue + "€"
            payLoanElement.removeAttribute("hidden")
        }
    }

}

const increaseWorkSavings = e => {
    workSavings += 100
    savingsFromWorkElement.innerText = workSavings + "€"
}

const makeDeposit = e => {

    if (loanDue === 0) {
        balance += workSavings
    } else {
        balance += workSavings * 0.9

        if (loanDue > workSavings * 0.1) {
            loanDue -= workSavings * 0.1
            loanDueElement.innerText = "\nLoan: " + loanDue + "€"
        } else {
            balance += (workSavings * 0.1 - loanDue)
            payLoanElement.setAttribute("hidden", "hidden")
            loanDue = 0
            loanDueElement.innerText=""
        }
    }

    workSavings = 0

    savingsFromWorkElement.innerText = workSavings + "€"
    balanceElement.innerText = balance + "€"
}

const payLoan = e => {

    if (workSavings < loanDue) {
        loanDue -= workSavings
    } else {
        balance += (workSavings - loanDue)
        balanceElement.innerText = balance + "€"
        payLoanElement.setAttribute("hidden", "hidden")
        loanDue = 0
    }

    workSavings = 0

    savingsFromWorkElement.innerText = workSavings + "€"
    loanDueElement.innerText = "\nLoan: " + loanDue + "€"
}

const buyLaptop = e => {

    const currentLaptopPrice = parseFloat(priceElement.innerText)

    if (balance < currentLaptopPrice) {
        alert("According to your bank account, you cannot purchase this laptop")
    } else {
        alert("Congrats, " + laptopNameElement.innerText + " is yours")
        balance -= currentLaptopPrice
        balanceElement.innerText = balance + "€"
    }
}

getLoanElement.addEventListener("click", gettingALoan)
workElement.addEventListener("click", increaseWorkSavings)
depositElement.addEventListener("click", makeDeposit)
payLoanElement.addEventListener("click", payLoan)
buyElement.addEventListener("click", buyLaptop)

laptopsElement.addEventListener("change", handleLaptopMenuChange)