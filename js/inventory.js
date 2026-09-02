const API =
    "http://localhost:5000/api/inventory";

const PRODUCT_API =
    "http://localhost:5000/api/products";


let inventoryData = [];


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadInventory();

        await loadMovements();

        await loadProducts();

    }
);


// ========================================
// LOAD INVENTORY
// ========================================

async function loadInventory() {

    try {

        const response =
            await fetch(API);


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message
            );

        }


        inventoryData =
            result.data;


        updateSummary();

        renderInventory();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to load inventory"
        );

    }

}


// ========================================
// UPDATE SUMMARY
// ========================================

function updateSummary() {

    const totalProducts =
        inventoryData.length;


    const totalStock =
        inventoryData.reduce(
            (sum, product) =>
                sum +
                Number(
                    product.stock_quantity
                ),
            0
        );


    const stockValue =
        inventoryData.reduce(
            (sum, product) =>
                sum +
                Number(
                    product.stock_value
                ),
            0
        );


    const lowStock =
        inventoryData.filter(
            product =>
                product.stock_status ===
                "LOW STOCK"
        ).length;


    const outOfStock =
        inventoryData.filter(
            product =>
                product.stock_status ===
                "OUT OF STOCK"
        ).length;


    document.getElementById(
        "totalProducts"
    ).textContent =
        totalProducts;


    document.getElementById(
        "totalStock"
    ).textContent =
        totalStock;


    document.getElementById(
        "stockValue"
    ).textContent =
        formatCurrency(stockValue);


    document.getElementById(
        "lowStock"
    ).textContent =
        lowStock;


    document.getElementById(
        "outOfStock"
    ).textContent =
        outOfStock;

}


// ========================================
// RENDER INVENTORY
// ========================================

function renderInventory() {

    const tbody =
        document.getElementById(
            "inventoryBody"
        );


    const search =
        document.getElementById(
            "searchInput"
        ).value
        .toLowerCase();


    const filter =
        document.getElementById(
            "stockFilter"
        ).value;


    const filtered =
        inventoryData.filter(
            product => {

                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(search);


                const matchesFilter =
                    filter === "ALL" ||
                    product.stock_status ===
                    filter;


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );


    tbody.innerHTML = "";


    if (filtered.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="8">

                    No products found.

                </td>

            </tr>

        `;

        return;

    }


    filtered.forEach(
        product => {

            const row =
                document.createElement(
                    "tr"
                );


            let statusClass =
                "";


            if (
                product.stock_status ===
                "IN STOCK"
            ) {

                statusClass =
                    "status-in";

            }


            else if (
                product.stock_status ===
                "LOW STOCK"
            ) {

                statusClass =
                    "status-low";

            }


            else {

                statusClass =
                    "status-out";

            }


            row.innerHTML = `

                <td>
                    <strong>
                        ${product.name}
                    </strong>
                </td>


                <td>
                    ${product.category_name || "-"}
                </td>


                <td>
                    ${formatCurrency(
                        product.purchase_price
                    )}
                </td>


                <td>
                    ${formatCurrency(
                        product.selling_price
                    )}
                </td>


                <td>
                    ${product.stock_quantity}
                </td>


                <td>
                    ${product.reorder_level}
                </td>


                <td>
                    ${formatCurrency(
                        product.stock_value
                    )}
                </td>


                <td>

                    <span
                        class="status ${statusClass}">

                        ${product.stock_status}

                    </span>

                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


// ========================================
// LOAD PRODUCTS
// ========================================

async function loadProducts() {

    try {

        const response =
            await fetch(PRODUCT_API);


        const result =
            await response.json();


        const select =
            document.getElementById(
                "productId"
            );


        if (
            !result.success
        ) {

            return;

        }


        result.data.forEach(
            product => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    product.id;


                option.textContent =
                    `${product.name}
                     (Stock:
                     ${product.stock_quantity})`;


                select.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(error);

    }

}


// ========================================
// STOCK ADJUSTMENT
// ========================================

document.getElementById(
    "adjustmentForm"
).addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const data = {

            product_id:
                document.getElementById(
                    "productId"
                ).value,

            quantity:
                document.getElementById(
                    "quantity"
                ).value,

            adjustment_type:
                document.getElementById(
                    "adjustmentType"
                ).value,

            remarks:
                document.getElementById(
                    "remarks"
                ).value

        };


        try {

            const response =
                await fetch(
                    `${API}/adjust`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(data)

                    }
                );


            const result =
                await response.json();


            if (!result.success) {

                alert(
                    result.message
                );

                return;

            }


            alert(
                "Stock updated successfully"
            );


            closeAdjustmentModal();


            document.getElementById(
                "adjustmentForm"
            ).reset();


            await loadInventory();

            await loadMovements();

        } catch (error) {

            console.error(error);

            alert(
                "Server error"
            );

        }

    }
);


// ========================================
// LOAD MOVEMENTS
// ========================================

async function loadMovements() {

    try {

        const response =
            await fetch(
                `${API}/movements`
            );


        const result =
            await response.json();


        if (!result.success) {

            return;

        }


        const tbody =
            document.getElementById(
                "movementBody"
            );


        tbody.innerHTML = "";


        result.data.forEach(
            movement => {

                const row =
                    document.createElement(
                        "tr"
                    );


                const movementClass =
                    movement.movement_type ===
                    "IN"

                        ? "movement-in"

                        : "movement-out";


                row.innerHTML = `

                    <td>
                        ${formatDate(
                            movement.movement_date
                        )}
                    </td>


                    <td>
                        ${movement.product_name}
                    </td>


                    <td class="${movementClass}">

                        ${movement.movement_type}

                    </td>


                    <td>
                        ${movement.quantity}
                    </td>


                    <td>
                        ${movement.previous_stock}
                    </td>


                    <td>
                        ${movement.new_stock}
                    </td>


                    <td>
                        ${movement.remarks || "-"}
                    </td>

                `;


                tbody.appendChild(
                    row
                );

            }
        );


    } catch (error) {

        console.error(error);

    }

}


// ========================================
// MODAL
// ========================================

function openAdjustmentModal() {

    document.getElementById(
        "adjustmentModal"
    ).style.display =
        "flex";

}


function closeAdjustmentModal() {

    document.getElementById(
        "adjustmentModal"
    ).style.display =
        "none";

}


// ========================================
// SEARCH
// ========================================

document.getElementById(
    "searchInput"
).addEventListener(
    "input",
    renderInventory
);


document.getElementById(
    "stockFilter"
).addEventListener(
    "change",
    renderInventory
);


// ========================================
// HELPERS
// ========================================

function formatCurrency(
    amount
) {

    return "Rs. " +
        Number(amount || 0)
            .toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 2
                }
            );

}


function formatDate(
    date
) {

    return new Date(date)
        .toLocaleString(
            "en-IN"
        );

}
