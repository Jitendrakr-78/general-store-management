const CUSTOMER_API =
    "http://localhost:5000/api/customers";

const PRODUCT_API =
    "http://localhost:5000/api/products";

const SALE_API =
    "http://localhost:5000/api/sales";


let customers = [];

let products = [];

let sales = [];


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        setSaleDate();

        await loadCustomers();

        await loadProducts();

        addSaleRow();

        await loadSales();

    }
);


// ========================================
// DATE
// ========================================

function setSaleDate() {

    const date =
        new Date()
            .toISOString()
            .split("T")[0];


    document.getElementById(
        "saleDate"
    ).value = date;

}


// ========================================
// LOAD CUSTOMERS
// ========================================

async function loadCustomers() {

    try {

        const response =
            await fetch(
                CUSTOMER_API
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                "Customer loading failed"
            );

        }


        customers =
            result.data;


        const select =
            document.getElementById(
                "customerSelect"
            );


        select.innerHTML = `

            <option value="">
                Walk-in Customer
            </option>

        `;


        customers.forEach(
            customer => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    customer.id;


                option.textContent =
                    customer.name;


                select.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load customers"
        );

    }

}


// ========================================
// LOAD PRODUCTS
// ========================================

async function loadProducts() {

    try {

        const response =
            await fetch(
                PRODUCT_API
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                "Product loading failed"
            );

        }


        products =
            result.data;


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load products"
        );

    }

}


// ========================================
// PRODUCT OPTIONS
// ========================================

function getProductOptions() {

    let options = `

        <option value="">
            Select Product
        </option>

    `;


    products.forEach(
        product => {

            options += `

                <option
                    value="${product.id}">

                    ${product.name}

                </option>

            `;

        }
    );


    return options;

}


// ========================================
// ADD SALE ROW
// ========================================

function addSaleRow() {

    const tbody =
        document.getElementById(
            "saleItemsBody"
        );


    const row =
        document.createElement(
            "tr"
        );


    row.innerHTML = `

        <td>

            <select
                class="product-select"
                onchange="productChanged(this)">

                ${getProductOptions()}

            </select>

        </td>


        <td>

            <span class="stock-value">
                0
            </span>

        </td>


        <td>

            <input
                type="number"
                class="quantity-input"
                value="1"
                min="0.01"
                step="0.01"
                oninput="calculateRow(this)">

        </td>


        <td>

            <input
                type="number"
                class="price-input"
                value="0"
                min="0"
                step="0.01"
                oninput="calculateRow(this)">

        </td>


        <td>

            <span class="item-total">
                Rs. 0.00
            </span>

        </td>


        <td>

            <button
                type="button"
                class="remove-button"
                onclick="removeSaleRow(this)">

                Remove

            </button>

        </td>

    `;


    tbody.appendChild(row);

}


// ========================================
// PRODUCT CHANGED
// ========================================

function productChanged(select) {

    const row =
        select.closest("tr");


    const productId =
        Number(select.value);


    const product =
        products.find(
            p =>
                Number(p.id) ===
                productId
        );


    if (!product) {

        row.querySelector(
            ".stock-value"
        ).textContent = "0";


        row.querySelector(
            ".price-input"
        ).value = "0";


        calculateRow(select);

        return;

    }


    const stock =
        Number(
            product.stock_quantity
        ) || 0;


    row.querySelector(
        ".stock-value"
    ).textContent =
        stock;


    row.querySelector(
        ".price-input"
    ).value =
        Number(
            product.selling_price
        ) || 0;


    calculateRow(select);

}


// ========================================
// CALCULATE ROW
// ========================================

function calculateRow(element) {

    const row =
        element.closest("tr");


    const quantity =
        Number(
            row.querySelector(
                ".quantity-input"
            ).value
        ) || 0;


    const price =
        Number(
            row.querySelector(
                ".price-input"
            ).value
        ) || 0;


    const total =
        quantity * price;


    row.querySelector(
        ".item-total"
    ).textContent =
        "Rs. " +
        total.toFixed(2);


    calculateTotals();

}


// ========================================
// REMOVE ROW
// ========================================

function removeSaleRow(button) {

    const tbody =
        document.getElementById(
            "saleItemsBody"
        );


    if (tbody.children.length === 1) {

        alert(
            "At least one product is required"
        );

        return;

    }


    button
        .closest("tr")
        .remove();


    calculateTotals();

}


// ========================================
// CALCULATE TOTALS
// ========================================

function calculateTotals() {

    const rows =
        document.querySelectorAll(
            "#saleItemsBody tr"
        );


    let subtotal = 0;


    rows.forEach(
        row => {

            const quantity =
                Number(
                    row.querySelector(
                        ".quantity-input"
                    ).value
                ) || 0;


            const price =
                Number(
                    row.querySelector(
                        ".price-input"
                    ).value
                ) || 0;


            subtotal +=
                quantity * price;

        }
    );


    const discount =
        Number(
            document.getElementById(
                "discount"
            ).value
        ) || 0;


    const grandTotal =
        Math.max(
            0,
            subtotal - discount
        );


    const paid =
        Number(
            document.getElementById(
                "paidAmount"
            ).value
        ) || 0;


    const due =
        Math.max(
            0,
            grandTotal - paid
        );


    document.getElementById(
        "subtotal"
    ).textContent =
        "Rs. " +
        subtotal.toFixed(2);


    document.getElementById(
        "grandTotal"
    ).textContent =
        "Rs. " +
        grandTotal.toFixed(2);


    document.getElementById(
        "dueAmount"
    ).textContent =
        "Rs. " +
        due.toFixed(2);

}


// ========================================
// TOTAL EVENTS
// ========================================

document
    .getElementById("discount")
    .addEventListener(
        "input",
        calculateTotals
    );


document
    .getElementById("paidAmount")
    .addEventListener(
        "input",
        calculateTotals
    );


// ========================================
// SAVE SALE
// ========================================

async function saveSale() {

    const customerId =
        document.getElementById(
            "customerSelect"
        ).value;


    const saleDate =
        document.getElementById(
            "saleDate"
        ).value;


    const discount =
        Number(
            document.getElementById(
                "discount"
            ).value
        ) || 0;


    const paidAmount =
        Number(
            document.getElementById(
                "paidAmount"
            ).value
        ) || 0;


    const paymentMethod =
        document.getElementById(
            "paymentMethod"
        ).value;


    if (!saleDate) {

        alert(
            "Please select sale date"
        );

        return;

    }


    const rows =
        document.querySelectorAll(
            "#saleItemsBody tr"
        );


    const items = [];


    rows.forEach(
        row => {

            const productId =
                row.querySelector(
                    ".product-select"
                ).value;


            const quantity =
                Number(
                    row.querySelector(
                        ".quantity-input"
                    ).value
                );


            const sellingPrice =
                Number(
                    row.querySelector(
                        ".price-input"
                    ).value
                );


            if (productId) {

                items.push({

                    product_id:
                        Number(productId),

                    quantity,

                    selling_price:
                        sellingPrice

                });

            }

        }
    );


    if (items.length === 0) {

        alert(
            "Please add at least one product"
        );

        return;

    }


    // --------------------------------
    // CHECK DUPLICATE PRODUCTS
    // --------------------------------

    const productIds =
        items.map(
            item => item.product_id
        );


    const uniqueIds =
        new Set(productIds);


    if (
        uniqueIds.size !==
        productIds.length
    ) {

        alert(
            "The same product cannot be added twice. Please combine the quantities."
        );

        return;

    }


    const saleData = {

        customer_id:
            customerId
                ? Number(customerId)
                : null,

        sale_date:
            saleDate,

        discount,

        paid_amount:
            paidAmount,

        payment_method:
            paymentMethod,

        items

    };


    try {

        const response =
            await fetch(
                SALE_API,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            saleData
                        )

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message
            );

            return;

        }


        alert(

            "Sale saved successfully\n\n" +

            "Invoice: " +
            result.invoiceNo +

            "\nGrand Total: Rs." +
            Number(
                result.grandTotal
            ).toFixed(2) +

            "\nPaid: Rs." +
            Number(
                result.paidAmount
            ).toFixed(2) +

            "\nDue: Rs." +
            Number(
                result.dueAmount
            ).toFixed(2)

        );


        resetSaleForm();

        await loadProducts();

        await loadSales();


    } catch (error) {

        console.error(error);


        alert(
            "Unable to save sale"
        );

    }

}


// ========================================
// RESET FORM
// ========================================

function resetSaleForm() {

    document.getElementById(
        "customerSelect"
    ).value = "";


    setSaleDate();


    document.getElementById(
        "discount"
    ).value = "0";


    document.getElementById(
        "paidAmount"
    ).value = "0";


    document.getElementById(
        "paymentMethod"
    ).value = "Cash";


    document.getElementById(
        "saleItemsBody"
    ).innerHTML = "";


    document.getElementById(
        "subtotal"
    ).textContent =
        "Rs. 0.00";


    document.getElementById(
        "grandTotal"
    ).textContent =
        "Rs. 0.00";


    document.getElementById(
        "dueAmount"
    ).textContent =
        "Rs. 0.00";


    addSaleRow();

}


// ========================================
// LOAD SALES
// ========================================

async function loadSales() {

    try {

        const response =
            await fetch(
                SALE_API
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                "Sales loading failed"
            );

        }


        sales =
            result.data;


        displaySales(
            sales
        );


    } catch (error) {

        console.error(error);


        document.getElementById(
            "saleListBody"
        ).innerHTML = `

            <tr>

                <td colspan="8">

                    Failed to load sales

                </td>

            </tr>

        `;

    }

}


// ========================================
// DISPLAY SALES
// ========================================

function displaySales(
    saleList
) {

    const tbody =
        document.getElementById(
            "saleListBody"
        );


    if (saleList.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="8">

                    No sales found

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML = "";


    saleList.forEach(
        sale => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${sale.id}
                </td>


                <td>
                    <strong>
                        ${sale.invoice_no}
                    </strong>
                </td>


                <td>
                    ${sale.customer_name}
                </td>


                <td>
                    ${sale.sale_date}
                </td>


                <td>
                    Rs.
                    ${Number(
                        sale.grand_total
                    ).toFixed(2)}
                </td>


                <td>
                    Rs.
                    ${Number(
                        sale.paid_amount
                    ).toFixed(2)}
                </td>


                <td>
                    Rs.
                    ${Number(
                        sale.due_amount
                    ).toFixed(2)}
                </td>


                <td>

                    <button
                        class="view-button"
                        onclick="
                            viewSale(
                                ${sale.id}
                            )
                        ">

                        View

                    </button>

                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


// ========================================
// VIEW SALE
// ========================================

async function viewSale(id) {

    try {

        const response =
            await fetch(
                `${SALE_API}/${id}`
            );


        const result =
            await response.json();


        if (!result.success) {

            alert(
                result.message
            );

            return;

        }


        const sale =
            result.data.sale;


        const items =
            result.data.items;


        let message =

            "Invoice: " +
            sale.invoice_no +
            "\n\n";


        message +=

            "Customer: " +
            sale.customer_name +
            "\n";


        message +=

            "Date: " +
            sale.sale_date +
            "\n";


        message +=

            "Payment: " +
            sale.payment_method +
            "\n\n";


        message +=
            "Items:\n";


        items.forEach(
            item => {

                message +=

                    item.product_name +
                    " | Qty: " +
                    item.quantity +
                    " | Price: Rs." +
                    item.selling_price +
                    " | Total: Rs." +
                    item.total +
                    "\n";

            }
        );


        message +=

            "\nSubtotal: Rs." +
            sale.subtotal;


        message +=

            "\nDiscount: Rs." +
            sale.discount;


        message +=

            "\nGrand Total: Rs." +
            sale.grand_total;


        message +=

            "\nPaid: Rs." +
            sale.paid_amount;


        message +=

            "\nDue: Rs." +
            sale.due_amount;


        alert(message);


    } catch (error) {

        console.error(error);


        alert(
            "Unable to load sale"
        );

    }

}


// ========================================
// SEARCH
// ========================================

document
    .getElementById("searchSale")
    .addEventListener(
        "input",
        function() {

            const search =
                this.value
                    .toLowerCase()
                    .trim();


            const filtered =
                sales.filter(
                    sale =>

                        sale.invoice_no
                            .toLowerCase()
                            .includes(search)

                        ||

                        sale.customer_name
                            .toLowerCase()
                            .includes(search)
                );


            displaySales(
                filtered
            );

        }
    );
