const accountsBalanceBox = document.querySelectorAll('.account-balance');
const actualBlanceBox = document.getElementById('actual-balance');
const cashFlowBox = document.getElementById('cash-flow-amount');
const income = document.getElementById('income');
const expenses = document.getElementById('expenses');
const goalBox = document.getElementById('goal-savings');
const goalList = document.getElementById('goal-list');
const createGoalBtn = document.getElementById('create-goal-btn');
const addRecordBox = document.getElementById('record-box');
const recordBox = document.getElementById('transaction-record');
const recordCategoryBox = document.getElementById('record-category-box');
const recordCategoryList = document.getElementById('record-category-list');

let userFillDetails;

// Accounts Balance = Cash, Bank, Savings, Investment, Debt
let accountsBalance = [];
//Actual Balance = Cash + Bank + Savings + Investment - Debt
let actualBalance;
// Cash Flow = Tatal Income - Total Expense
let cashFlow;
let totalIncome;
let totalExpense;

const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const setUserFillDetails = () =>
    (userFillDetails = localStorage.setItem("userFillDetails", userFillDetails));
const getUserFillDetails = () =>
    (userFillDetails = localStorage.getItem("userFillDetails"));

const setAccountBalance = () =>
    (accounts = localStorage.setItem("accounts", accountsBalance));
const getAccountBalance = () => {
    accounts = localStorage.getItem("accounts");
    accountsBalance = accounts.split(',');
};

const setActualBalance = () =>
    (actualBalance = localStorage.setItem("actualBalance", actualBalance));
const getActualBalance = () =>
    (actualBalance = localStorage.getItem("actualBalance"));

const setTotalIncome = () =>
    (totalIncome = localStorage.setItem("totalIncome", totalIncome));
const getTotalIncome = () =>
    (totalIncome = localStorage.getItem("totalIncome"));

const setTotalExpense = () =>
    (totalExpense = localStorage.setItem("totalExpense", totalExpense));
const getTotalExpense = () =>
    (totalExpense = localStorage.getItem("totalExpense"));

const setCashFlow = () =>
    (cashFlow = localStorage.setItem("cashFlow", cashFlow));
const getCashFlow = () =>
    (cashFlow = localStorage.getItem("cashFlow"));

const setGoal = () =>
    (localStorage.setItem("goal", goalBox.innerHTML));
const getGoal = () =>
    (goalBox.innerHTML = localStorage.getItem("goal"));

const setRecord = () =>
    (localStorage.setItem("record", recordBox.innerHTML));
const getRecord = () =>
    (recordBox.innerHTML = localStorage.getItem("record"));

const setData = () => {
    setAccountBalance();
    setActualBalance();
    setTotalIncome();
    setTotalExpense();
    setCashFlow();
    setGoal();
    setRecord();
};

const getData = () => {
    getAccountBalance();
    getActualBalance();
    getTotalIncome();
    getTotalExpense();
    getCashFlow();
    getGoal();
    getRecord();
};

const calculateActualBalance = () => {
    actualBalance = 0;
    for (let i = 0; i < accountsBalance.length; i++) {
        if (i == 4) {
            actualBalance -= Number(accountsBalance[i]);
        } else {
            actualBalance += Number(accountsBalance[i]);
        }
    }

    return actualBalance;
};

const calculateCashFlow = () => cashFlow = Number(totalIncome) - Number(totalExpense);

const fillDetails = () => {
    accountsBalanceBox.forEach((balance, index) => {
        balance.innerText = `₹${accountsBalance[index]}`;
        if (index == 4) {
            balance.innerText = `- ₹${accountsBalance[index]}`;
        }
    });

    actualBalance = calculateActualBalance();
    if (actualBalance < 0) {
        const currentBalance = String(actualBalance).split('-');
        actualBlanceBox.innerText = `- ₹${currentBalance[1]}`;
        actualBlanceBox.style.color = '#ff3737';
    } else {
        actualBlanceBox.innerText = '₹' + actualBalance;
        actualBlanceBox.style.color = '#fff';
    }

    calculateCashFlow();
    if (cashFlow < 0) {
        const currentCashFlow = String(cashFlow).split('-');
        cashFlowBox.innerText = `- ₹${currentCashFlow[1]}`;
        cashFlowBox.style.color = '#ff3737';
    } else {
        cashFlowBox.innerText = '₹' + cashFlow;
        cashFlowBox.style.color = '#fff';
    }

    income.innerText = `+ ₹${totalIncome}`;

    expenses.innerText = `- ₹${totalExpense}`;
};

const updateData = () => {
    fillDetails();
    setData();
    getData();
};

const checkDetailsFilled = () => {
    if (getUserFillDetails() == null) {
        accountsBalance[0] = Number(prompt('Enter the amount do you have in Cash?', 0));
        accountsBalance[1] = Number(prompt('Enter the amount do you have in your Bank?', 0));
        accountsBalance[2] = Number(prompt('Enter the amount did you saved?', 0));
        accountsBalance[3] = Number(prompt('Enter the amount did you invested?', 0));
        accountsBalance[4] = Number(prompt('Enter the amount did you borrowed?', 0));
        userFillDetails = true;
        setUserFillDetails();
        totalIncome = 0;
        totalExpense = 0;
        updateData();
    } else {
        getData();
        updateData();
    }
};

const addDeleteGoal = () => {
    const goal = event.target.closest('.goal');
    if (event.target.classList.contains('delete-goal')) {
        goal.remove();
    } else if (event.target.classList.contains('add-savings')) {
        const saved = Number(prompt('How much did you save more?', 0));
        const savedAmount = goal.querySelector('.saved-amount');
        const goalAmount = goal.querySelector('.goal-amount');
        savedAmount.innerText = Number(savedAmount.innerText) + saved;
        if (savedAmount.innerText == goalAmount.innerText) {
            event.target.classList.remove('add-savings', 'fa-check');
            event.target.classList.add('fa-check', 'achieved-goal');
        }
    }
    setGoal();
};

const createGoal = () => {
    goalList.style.display = 'block';

    goalList.addEventListener('click', () => {
        goalList.style.display = 'none';
        const icon = event.target.closest('div').querySelector('i');
        icon.classList.add('goal-icon');
        const iconHTML = icon.outerHTML;
        const name = event.target.closest('div').querySelector('p');
        const goalAmount = prompt('Enter goal amount', 0);
        const savedAmount = prompt('Enter saved amount', 0);
        const goal = `
        <div class="goal">
            ${iconHTML}
            <div class="goal-name">${name.innerText}</div>
            <div class="amount">₹
                <span class="saved-amount">${savedAmount}</span>/ ₹
                <span class="goal-amount">${goalAmount}</span>
            </div>
            <i class="fa-solid fa-plus add-savings"></i>
            <i class="fa-solid fa-xmark delete-goal"></i>
        </div>
        `;
        goalBox.insertAdjacentHTML("beforeend", goal);
        setGoal();
    });
};

const addRecord = () => {
    const e = event.target;
    const currDate = new Date();
    const month = currDate.getMonth();
    const date = currDate.getDate();
    if (e.closest('.add-income') || e.closest('.add-expense')) {
        const recordAccount = prompt('Type in which account you want to record transaction? \n Cash / Bank / Savings / Investment', "Cash");
        const recordAmount = prompt('Enter the amount you want to record?', 1);

        recordCategoryBox.style.display = 'block';

        recordCategoryList.addEventListener('click', () => {
            recordCategoryBox.style.display = 'none';
            const icon = event.target.closest('.category').querySelector('i');
            const iconHTML = icon.outerHTML;
            const recordCategory = event.target.closest('.category').querySelector('span');

            if (e.closest('.add-income')) {
                const incomeRecord = `
                <div class="record">
                    ${iconHTML}
                    <div class="details">
                        <div class="category-amount">
                            <div class="record-category">${recordCategory.innerText}</div>
                            <div class="record-amount income">₹${recordAmount}</div>
                        </div>
                        <div class="account-date">
                            <div class="record-account">${recordAccount}</div>
                            <div class="record-date"><span>${date}</span> <span>${monthName[month]}</span></div>
                        </div>
                    </div>
                </div>
                `;
                recordBox.insertAdjacentHTML("afterbegin", incomeRecord);
                setRecord();
            } else {
                const expenseRecord = `
                <div class="record">
                ${iconHTML}
                <div class="details">
                <div class="category-amount">
                <div class="record-category">${recordCategory.innerText}</div>
                <div class="record-amount expense">- ₹${recordAmount}</div>
                </div>
                <div class="account-date">
                <div class="record-account">${recordAccount}</div>
                <div class="record-date"><span>${date}</span> <span>${monthName[month]}</span></div>
                </div>
                </div>
                </div>
                `;
                recordBox.insertAdjacentHTML("afterbegin", expenseRecord);
                setRecord();
            }
        });
    } else if (e.closest('.transfer')) {
        const fromAccount = prompt('Enter from which account to transfer? Cash / Bank / Savings / Investment', 'Cash');
        const toAccount = prompt('Enter which account to transfer? \n Cash / Bank / Savings / Investment', 'Bank', 'Bank');
        const transferAmount = prompt('Enter the amount you want to transfer?', 1);
        const transferRecord = `
        <div class="record">
            <i class="fa-solid fa-arrow-right-arrow-left" style="background: #19f16f;"></i>
            <div class="details">
                <div class="category-amount">
                    <div class="record-category">Transfer</div>
                    <div class="record-amount income">₹${transferAmount}</div>
                </div>
                <div class="account-date">
                    <div class="record-account">from ${fromAccount}</div>
                    <div class="record-date"><span>${date}</span> <span>${monthName[month]}</span></div>
                </div>
            </div>
        </div>
        <div class="record">
            <i class="fa-solid fa-arrow-right-arrow-left" style="background: #19f16f;"></i>
            <div class="details">
                <div class="category-amount">
                    <div class="record-category">Transfer</div>
                    <div class="record-amount expense">- ₹${transferAmount}</div>
                </div>
                <div class="account-date">
                    <div class="record-account">to ${toAccount}</div>
                    <div class="record-date"><span>${date}</span> <span>${monthName[month]}</span></div>
                </div>
            </div>
        </div>
        `;
        recordBox.insertAdjacentHTML("afterbegin", transferRecord);
        setRecord();
    }
};

createGoalBtn.addEventListener('click', createGoal);

goalBox.addEventListener('click', addDeleteGoal);

addRecordBox.addEventListener('click', addRecord);

checkDetailsFilled();