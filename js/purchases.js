const SUPPLIER_API =
    "http://localhost:5000/api/suppliers";

const PRODUCT_API =
    "http://localhost:5000/api/products";

const PURCHASE_API =
    "http://localhost:5000/api/purchases";


let suppliers = [];

let products = [];

let purchases = [];


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        setPurchaseDate();

        await loadSuppliers();

        await loadProducts();

        addPurchaseRow();

        await loadPurchases();

    }
);


// ========================================
// DEFAULT DATE
// ========================================

function setPurchaseDate() {

    const date =
        new Date()
            .toISOString()
            .split("T")[0];


    document.getElementById(
        "purchaseDate"
    ).value = date;

}


// ========================================
// LOAD SUPPLIERS
// ========================================

async function loadSuppliers() {

    try {

        const response =
            await fetch(
                SUPPLIER_API
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                "Supplier loading failed"
            );

        }


        suppliers =
            result.data;


        const select =
            document.getElementById(
                "supplierSelect"
            );


        select.innerHTML = `
            <option value="">
                Select Supplier
            </option>
        `;


        suppliers.forEach(
            supplier => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    supplier.id;


                option.textContent =
                    supplier.name +
                    (
                        supplier.company_name
                            ? " - " +
                              supplier.company_name
                            : ""
                    );


                select.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load suppliers"
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
// ADD PURCHASE ROW
// ========================================

function addPurchaseRow() {

    const tbody =
        document.getElementById(
            "purchaseItemsBody"
        );


    const row =
        document.createElement(
            "tr"
        );


    row.innerHTML = `

        <td>

            <select
                class="product-select"
                onchange="calculateRow(this)">

                ${getProductOptions()}

            </select>

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
                onclick="removePurchaseRow(this)">

                Remove

            </button>

        </td>

    `;


    tbody.appendChild(
        row
    );

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

function removePurchaseRow(button) {

    const tbody =
        document.getElementById(
            "purchaseItemsBody"
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
            "#purchaseItemsBody tr"
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

}


// ========================================
// DISCOUNT EVENT
// ========================================

document
    .getElementById(
        "discount"
    )
    .addEventListener(
        "input",
        calculateTotals
    );


// ========================================
// SAVE PURCHASE
// ========================================

async function savePurchase() {

    const supplierId =
        document.getElementById(
            "supplierSelect"
        ).value;


    const purchaseDate =
        document.getElementById(
            "purchaseDate"
        ).value;


    const discount =
        Number(
            document.getElementById(
                "discount"
            ).value
        ) || 0;


    if (!supplierId) {

        alert(
            "Please select a supplier"
        );

        return;

    }


    if (!purchaseDate) {

        alert(
            "Please select purchase date"
        );

        return;

    }


    const rows =
        document.querySelectorAll(
            "#purchaseItemsBody tr"
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


            const purchasePrice =
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

                    purchase_price:
                        purchasePrice

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


    for (const item of items) {

        if (
            item.quantity <= 0 ||
            item.purchase_price < 0
        ) {

            alert(
                "Please enter valid quantity and price"
            );

            return;

        }

    }


    const purchaseData = {

        supplier_id:
            Number(supplierId),

        purchase_date:
            purchaseDate,

        discount,

        items

    };


    try {

        const response =
            await fetch(
                PURCHASE_API,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            purchaseData
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
            "Purchase saved successfully\n\n" +
            "Invoice: " +
            result.invoice_Number +
            "\n" +
            "Grand Total: Rs. " +
            Number(
                result.grandTotal
            ).toFixed(2)
        );


        resetPurchaseForm();

        await loadPurchases();


    } catch (error) {

        console.error(error);


        alert(
            "Unable to save purchase"
        );

    }

}


// ========================================
// RESET FORM
// ========================================

function resetPurchaseForm() {

    document.getElementById(
        "supplierSelect"
    ).value = "";


    setPurchaseDate();


    document.getElementById(
        "discount"
    ).value = "0";


    document.getElementById(
        "purchaseItemsBody"
    ).innerHTML = "";


    document.getElementById(
        "subtotal"
    ).textContent =
        "Rs. 0.00";


    document.getElementById(
        "grandTotal"
    ).textContent =
        "Rs. 0.00";


    addPurchaseRow();

}


// ========================================
// LOAD PURCHASE HISTORY
// ========================================

async function loadPurchases() {

    try {

        const response =
            await fetch(
                PURCHASE_API
            );


        const result =
            await response.json();

        console.log(
            "PURCHASE API RESPONSE:",
            result
        );

        if (!response.ok) {

            throw new Error(
                result.message || "Failed to load purchases"
            );

        }


        if (!result.success) {

            throw new Error(
                "Purchase loading failed"
            );

        }


// Support both { data: [] } and { purchases: [] }
        purchases = Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.purchases)
                ? result.purchases
                : [];

        displayPurchases(purchases);

    } catch (error) {

        console.error(
            "loadPurchases:",
            error
        );

        document.getElementById(
            "purchaseListBody"
        ).innerHTML = `

            <tr>

                <td colspan="8">

                    Failed to load purchases

                </td>

            </tr>

        `;

    }

}

// ========================================
// DISPLAY PURCHASES
// ========================================

function displayPurchases(purchaseList) {

    const tbody =
        document.getElementById(
            "purchaseListBody"
        );

    // Safety check
    if (!Array.isArray(purchaseList)) {

        purchaseList = [];

    }

    if (purchaseList.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="8">

                    No purchases found

                </td>

            </tr>

        `;

        return;

    }

    tbody.innerHTML = "";

    purchaseList.forEach(
        purchase => {

            const row =
                document.createElement(
                    "tr"
                );

            row.innerHTML = `

                <td>
                    ${purchase.id}
                </td>

                <td>
                    <strong>
                        ${purchase.invoice_number || "N/A"}
                    </strong>
                </td>

                <td>
                    ${purchase.supplier_name || "N/A"}
                </td>

                <td>
                    ${purchase.purchase_date || "N/A"}
                </td>

                <td>
                    Rs.
                    ${Number(
                        purchase.subtotal || 0
                    ).toFixed(2)}
                </td>

                <td>
                    Rs.
                    ${Number(
                        purchase.discount || 0
                    ).toFixed(2)}
                </td>

                <td>
                    <strong>
                        Rs.
                        ${Number(
                            purchase.grand_total || 0
                        ).toFixed(2)}
                    </strong>
                </td>

                <td>

                    <button
                        class="view-button"
                        onclick="viewPurchase(${purchase.id})">

                        View

                    </button>

                </td>

            `;

            tbody.appendChild(row);

        }
    );

}

// ========================================
// VIEW PURCHASE
// ========================================

async function viewPurchase(id) {

    try {

        const response =
            await fetch(
                `${PURCHASE_API}/${id}`
            );


        const result =
            await response.json();


        if (!result.success) {

            alert(
                result.message
            );

            return;

        }


        const purchase =
            result.data.purchase;


        const items =
            result.data.items;


        let message =
            "Invoice: " +
            purchase.invoice_number +
            "\n\n";


        message +=
            "Supplier: " +
            purchase.supplier_name +
            "\n";


        message +=
            "Date: " +
            purchase.purchase_date +
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
                    item.purchase_price +
                    " | Total: Rs." +
                    item.total +
                    "\n";

            }
        );


        message +=
            "\nSubtotal: Rs." +
            purchase.subtotal;


        message +=
            "\nDiscount: Rs." +
            purchase.discount;


        message +=
            "\nGrand Total: Rs." +
            purchase.grand_total;


        alert(message);


    } catch (error) {

        console.error(error);


        alert(
            "Unable to load purchase"
        );

    }

}


// ========================================
// SEARCH PURCHASE
// ========================================

document
    .getElementById(
        "searchPurchase"
    )
    .addEventListener(
        "input",
        function() {

            const search =
                this.value
                    .toLowerCase()
                    .trim();


            const filtered =
                purchases.filter(
                    purchase =>

                        purchase.invoice_number
                            .toLowerCase()
                            .includes(search)

                        ||

                        purchase.supplier_name
                            .toLowerCase()
                            .includes(search)
                );


            displayPurchases(
                filtered
            );

        }
    );
