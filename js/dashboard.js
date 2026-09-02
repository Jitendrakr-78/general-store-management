<<<<<<< HEAD
const DASHBOARD_API =
    "http://localhost:5000/api/dashboard";


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        showCurrentDate();

        await loadDashboard();

        await loadRecentSales();

        await loadLowStock();

    }
);


// ========================================
// CURRENT DATE
// ========================================

function showCurrentDate() {

    const now =
        new Date();


    const formatted =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );


    document.getElementById(
        "currentDate"
    ).textContent =
        formatted;

}


// ========================================
// DASHBOARD SUMMARY
// ========================================

async function loadDashboard() {

    try {

        const response =
            await fetch(
                `${DASHBOARD_API}/summary`
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message
            );

        }


        const data =
            result.data;


        document.getElementById(
            "totalProducts"
        ).textContent =
            data.totalProducts;


        document.getElementById(
            "totalCustomers"
        ).textContent =
            data.totalCustomers;


        document.getElementById(
            "todaySales"
        ).textContent =
            formatCurrency(
                data.todaySales
            );


        document.getElementById(
            "todayPurchases"
        ).textContent =
            formatCurrency(
                data.todayPurchases
            );


        document.getElementById(
            "stockValue"
        ).textContent =
            formatCurrency(
                data.stockValue
            );


        document.getElementById(
            "customerDue"
        ).textContent =
            formatCurrency(
                data.customerDue
            );


        document.getElementById(
            "supplierDue"
        ).textContent =
            formatCurrency(
                data.supplierDue
            );


        document.getElementById(
            "lowStock"
        ).textContent =
            data.lowStock;


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


// ========================================
// RECENT SALES
// ========================================

async function loadRecentSales() {

    try {

        const response =
            await fetch(
                `${DASHBOARD_API}/recent-sales`
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message
            );

        }


        const tbody =
            document.getElementById(
                "recentSalesBody"
            );


        if (
            result.data.length === 0
        ) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="5">

                        No sales found

                    </td>

                </tr>

            `;

            return;

        }


        tbody.innerHTML = "";


        result.data.forEach(
            sale => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

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
                        ${formatCurrency(
                            sale.grand_total
                        )}
                    </td>


                    <td class="${
                        Number(
                            sale.due_amount
                        ) > 0
                            ? "due-value"
                            : ""
                    }">

                        ${formatCurrency(
                            sale.due_amount
                        )}

                    </td>

                `;


                tbody.appendChild(
                    row
                );

            }
        );


    } catch (error) {

        console.error(
            "Recent sales error:",
            error
        );

    }

}


// ========================================
// LOW STOCK
// ========================================

async function loadLowStock() {

    try {

        const response =
            await fetch(
                `${DASHBOARD_API}/low-stock`
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message
            );

        }


        const tbody =
            document.getElementById(
                "lowStockBody"
            );


        if (
            result.data.length === 0
        ) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="3">

                        All products have
                        sufficient stock.

                    </td>

                </tr>

            `;

            return;

        }


        tbody.innerHTML = "";


        result.data.forEach(
            product => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${product.name}
                    </td>


                    <td class="low-stock-value">

                        ${product.stock_quantity}

                    </td>


                    <td>

                        ${product.reorder_level}

                    </td>

                `;


                tbody.appendChild(
                    row
                );

            }
        );


    } catch (error) {

        console.error(
            "Low stock error:",
            error
        );

    }

}


// ========================================
// CURRENCY
// ========================================

function formatCurrency(
    amount
) {

    return "Rs. " +
        Number(amount || 0)
            .toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

}
=======
const DASHBOARD_API =
    "http://localhost:5000/api/dashboard";


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        showCurrentDate();

        await loadDashboard();

        await loadRecentSales();

        await loadLowStock();

    }
);


// ========================================
// CURRENT DATE
// ========================================

function showCurrentDate() {

    const now =
        new Date();


    const formatted =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );


    document.getElementById(
        "currentDate"
    ).textContent =
        formatted;

}


// ========================================
// DASHBOARD SUMMARY
// ========================================

async function loadDashboard() {

    try {

        const response =
            await fetch(
                `${DASHBOARD_API}/summary`
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message
            );

        }


        const data =
            result.data;


        document.getElementById(
            "totalProducts"
        ).textContent =
            data.totalProducts;


        document.getElementById(
            "totalCustomers"
        ).textContent =
            data.totalCustomers;


        document.getElementById(
            "todaySales"
        ).textContent =
            formatCurrency(
                data.todaySales
            );


        document.getElementById(
            "todayPurchases"
        ).textContent =
            formatCurrency(
                data.todayPurchases
            );


        document.getElementById(
            "stockValue"
        ).textContent =
            formatCurrency(
                data.stockValue
            );


        document.getElementById(
            "customerDue"
        ).textContent =
            formatCurrency(
                data.customerDue
            );


        document.getElementById(
            "supplierDue"
        ).textContent =
            formatCurrency(
                data.supplierDue
            );


        document.getElementById(
            "lowStock"
        ).textContent =
            data.lowStock;


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


// ========================================
// RECENT SALES
// ========================================

async function loadRecentSales() {

    try {

        const response =
            await fetch(
                `${DASHBOARD_API}/recent-sales`
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message
            );

        }


        const tbody =
            document.getElementById(
                "recentSalesBody"
            );


        if (
            result.data.length === 0
        ) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="5">

                        No sales found

                    </td>

                </tr>

            `;

            return;

        }


        tbody.innerHTML = "";


        result.data.forEach(
            sale => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

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
                        ${formatCurrency(
                            sale.grand_total
                        )}
                    </td>


                    <td class="${
                        Number(
                            sale.due_amount
                        ) > 0
                            ? "due-value"
                            : ""
                    }">

                        ${formatCurrency(
                            sale.due_amount
                        )}

                    </td>

                `;


                tbody.appendChild(
                    row
                );

            }
        );


    } catch (error) {

        console.error(
            "Recent sales error:",
            error
        );

    }

}


// ========================================
// LOW STOCK
// ========================================

async function loadLowStock() {

    try {

        const response =
            await fetch(
                `${DASHBOARD_API}/low-stock`
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message
            );

        }


        const tbody =
            document.getElementById(
                "lowStockBody"
            );


        if (
            result.data.length === 0
        ) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="3">

                        All products have
                        sufficient stock.

                    </td>

                </tr>

            `;

            return;

        }


        tbody.innerHTML = "";


        result.data.forEach(
            product => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${product.name}
                    </td>


                    <td class="low-stock-value">

                        ${product.stock_quantity}

                    </td>


                    <td>

                        ${product.reorder_level}

                    </td>

                `;


                tbody.appendChild(
                    row
                );

            }
        );


    } catch (error) {

        console.error(
            "Low stock error:",
            error
        );

    }

}


// ========================================
// CURRENCY
// ========================================

function formatCurrency(
    amount
) {

    return "Rs. " +
        Number(amount || 0)
            .toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

}
>>>>>>> a473e3435407118240ea630d7a70313ef8388e7c
