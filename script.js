const products = [
    { id: 1, name: "Coca cola", price: 50, quantity: 50 },
    { id: 2, name: "Chips", price: 30, quantity: 50 },
    { id: 3, name: "Water", price: 20, quantity: 50 }
];

let balance = 0;
let selectedProducts = [];

// Add money to the balance
document.getElementById('add-money').addEventListener('click', () => {
    const amountInput = document.getElementById('amount');
    const amount = parseFloat(amountInput.value);
    if (amount > 0) {
        balance += amount;
        document.getElementById('balance').innerText = balance;
        amountInput.value = '';
    } else {
        alert("Please enter a valid amount.");
    }
});

// Select a product
document.querySelectorAll('.select-product').forEach(button => {
    button.addEventListener('click', (e) => {
        const productDiv = e.target.closest('.product');
        const productId = parseInt(productDiv.dataset.id);
        const product = products.find(p => p.id === productId);

        if (product && product.quantity > 0) {
            selectedProducts.push(product);
            product.quantity--; // Decrease available quantity
            updateSelectedProducts();
        } else {
            alert("This product is sold out.");
        }
    });
});

// Update the selected products list
function updateSelectedProducts() {
    const selectedProductsList = document.getElementById('selected-products');
    selectedProductsList.innerHTML = ''; // Clear the list
    selectedProducts.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.name} = ₹${product.price}`; // Show price here
        selectedProductsList.appendChild(li);
    });
}

// Purchase the selected products
document.getElementById('purchase').addEventListener('click', () => {
    // Check if any items are selected
    if (selectedProducts.length === 0) {
        alert("Please add items to purchase.");
        return; // Exit the function if no items are selected
    }

    const totalCost = selectedProducts.reduce((total, product) => total + product.price, 0);
    if (balance >= totalCost) {
        balance -= totalCost;
        document.getElementById('balance').innerText = balance;

        const purchasedItemsList = document.getElementById('purchased-items');
        purchasedItemsList.innerHTML = ''; // Clear previous purchases

        selectedProducts.forEach(product => {
            const li = document.createElement('li');
            li.textContent = `${product.name} = ₹${product.price}`; // Show price here
            purchasedItemsList.appendChild(li);
        });

        // Generate PDF
        generatePDF(totalCost, balance);

        selectedProducts = []; // Clear selected products after purchase
        updateSelectedProducts(); // Refresh the list
    } else {
        alert("Insufficient balance.");
    }
});

// Mask Aadhar number
function maskAadhar(aadhaar) {
    return "XXXX-XXXX-" + aadhaar.slice(-4);
}

// Generate PDF
function generatePDF(totalCost, remainingBalance) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const username = document.getElementById('username').value;
    const mobile = document.getElementById('mobile').value;
    const aadhaar = document.getElementById('aadhaar').value;
    const gender = document.getElementById('gender').value;
    const address = document.getElementById('address').value;

    // Header
    doc.text(`Vending Machine Receipt`, 20, 10);
    doc.text(`S.No: 001`, 20, 30); // Serial number
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);

    // User Information
    doc.text(`Name: ${username}`, 20, 50);
    doc.text(`Mobile No: ${mobile}`, 20, 60);
    doc.text(`Aadhaar No: ${maskAadhar(aadhaar)}`, 20, 70);
    doc.text(`Gender: ${gender}`, 20, 80);
    doc.text(`Address: ${address}`, 20, 90);

    // Purchased Items
    doc.text(`\nPurchased Items:`, 20, 100);
    doc.setFontSize(10);
    let yPosition = 110;

    // Table Header
    doc.text(`Item Name`, 20, yPosition);
    doc.text(`Price`, 120, yPosition);
    yPosition += 10;

    selectedProducts.forEach((product) => {
        doc.text(`${product.name}`, 20, yPosition);
        doc.text(`₹${product.price}`, 120, yPosition);
        yPosition += 10;
    });

    // Total and Remaining Balance
    doc.text(`\nTotal: ₹${totalCost}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Remaining Balance: ₹${remainingBalance}`, 20, yPosition);

    // Save PDF
    doc.save('receipt.pdf');
}

// Cancel the purchase
document.getElementById('cancel').addEventListener('click', () => {
    selectedProducts = []; // Clear selected products
    updateSelectedProducts(); // Refresh the list
});
