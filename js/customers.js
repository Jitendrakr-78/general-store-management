<<<<<<< HEAD
const CUSTOMER_API =
    "http://localhost:5000/api/customers";


let allCustomers = [];


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
                "Failed to load customers"
            );

        }


        allCustomers =
            result.data;


        displayCustomers(
            allCustomers
        );


    } catch (error) {

        console.error(error);


        document.getElementById(
            "customerTableBody"
        ).innerHTML = `

            <tr>

                <td colspan="7">

                    Failed to load customers

                </td>

            </tr>

        `;

    }

}


// ========================================
// DISPLAY CUSTOMERS
// ========================================

function displayCustomers(
    customers
) {

    const tableBody =
        document.getElementById(
            "customerTableBody"
        );


    if (customers.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="7">

                    No customers found

                </td>

            </tr>

        `;

        return;

    }


    tableBody.innerHTML = "";


    customers.forEach(
        customer => {

            const row =
                document.createElement(
                    "tr"
                );


            const balance =
                Number(
                    customer.opening_balance
                ).toFixed(2);


            row.innerHTML = `

                <td>
                    ${customer.id}
                </td>


                <td>

                    <strong>
                        ${customer.name}
                    </strong>

                </td>


                <td>
                    ${customer.phone || "-"}
                </td>


                <td>
                    ${customer.email || "-"}
                </td>


                <td>
                    ${customer.city || "-"}
                </td>


                <td>
                    Rs. ${balance}
                </td>


                <td>

                    <button
                        class="edit-button"
                        onclick="
                            editCustomer(
                                ${customer.id}
                            )
                        ">

                        Edit

                    </button>


                    <button
                        class="delete-button"
                        onclick="
                            deleteCustomer(
                                ${customer.id}
                            )
                        ">

                        Delete

                    </button>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


// ========================================
// ADD / UPDATE
// ========================================

document
    .getElementById(
        "customerForm"
    )
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const customerId =
                document.getElementById(
                    "customerId"
                ).value;


            const customerData = {

                name:
                    document.getElementById(
                        "customerName"
                    ).value.trim(),

                phone:
                    document.getElementById(
                        "phone"
                    ).value.trim(),

                email:
                    document.getElementById(
                        "email"
                    ).value.trim(),

                address:
                    document.getElementById(
                        "address"
                    ).value.trim(),

                city:
                    document.getElementById(
                        "city"
                    ).value.trim(),

                opening_balance:
                    document.getElementById(
                        "openingBalance"
                    ).value

            };


            try {

                let response;


                // UPDATE

                if (customerId) {

                    response =
                        await fetch(
                            `${CUSTOMER_API}/${customerId}`,
                            {

                                method:
                                    "PUT",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        customerData
                                    )

                            }
                        );

                }


                // CREATE

                else {

                    response =
                        await fetch(
                            CUSTOMER_API,
                            {

                                method:
                                    "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        customerData
                                    )

                            }
                        );

                }


                const result =
                    await response.json();


                if (!response.ok) {

                    alert(
                        result.message
                    );

                    return;

                }


                alert(
                    result.message
                );


                resetCustomerForm();


                loadCustomers();


            } catch (error) {

                console.error(error);


                alert(
                    "Server connection failed"
                );

            }

        }
    );


// ========================================
// EDIT
// ========================================

async function editCustomer(id) {

    try {

        const response =
            await fetch(
                `${CUSTOMER_API}/${id}`
            );


        const result =
            await response.json();


        if (!result.success) {

            alert(
                result.message
            );

            return;

        }


        const customer =
            result.data;


        document.getElementById(
            "customerId"
        ).value =
            customer.id;


        document.getElementById(
            "customerName"
        ).value =
            customer.name;


        document.getElementById(
            "phone"
        ).value =
            customer.phone || "";


        document.getElementById(
            "email"
        ).value =
            customer.email || "";


        document.getElementById(
            "address"
        ).value =
            customer.address || "";


        document.getElementById(
            "city"
        ).value =
            customer.city || "";


        document.getElementById(
            "openingBalance"
        ).value =
            customer.opening_balance || 0;


        document.getElementById(
            "formTitle"
        ).textContent =
            "Edit Customer";


        document.getElementById(
            "saveButton"
        ).textContent =
            "Update Customer";


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });


    } catch (error) {

        console.error(error);


        alert(
            "Unable to load customer"
        );

    }

}


// ========================================
// DELETE
// ========================================

async function deleteCustomer(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this customer?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${CUSTOMER_API}/${id}`,
                {

                    method:
                        "DELETE"

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
            result.message
        );


        loadCustomers();


    } catch (error) {

        console.error(error);


        alert(
            "Unable to delete customer"
        );

    }

}


// ========================================
// RESET FORM
// ========================================

function resetCustomerForm() {

    document.getElementById(
        "customerForm"
    ).reset();


    document.getElementById(
        "customerId"
    ).value = "";


    document.getElementById(
        "openingBalance"
    ).value = "0";


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add New Customer";


    document.getElementById(
        "saveButton"
    ).textContent =
        "Save Customer";

}


// ========================================
// SEARCH
// ========================================

document
    .getElementById(
        "searchInput"
    )
    .addEventListener(
        "input",
        function() {

            const searchText =
                this.value
                    .toLowerCase()
                    .trim();


            const filtered =
                allCustomers.filter(
                    customer =>

                        customer.name
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                        ||

                        (
                            customer.phone
                            || ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                        ||

                        (
                            customer.city
                            || ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                        ||

                        (
                            customer.email
                            || ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            )
                );


            displayCustomers(
                filtered
            );

        }
    );


// ========================================
// INITIAL LOAD
// ========================================

loadCustomers();
=======
const CUSTOMER_API =
    "http://localhost:5000/api/customers";


let allCustomers = [];


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
                "Failed to load customers"
            );

        }


        allCustomers =
            result.data;


        displayCustomers(
            allCustomers
        );


    } catch (error) {

        console.error(error);


        document.getElementById(
            "customerTableBody"
        ).innerHTML = `

            <tr>

                <td colspan="7">

                    Failed to load customers

                </td>

            </tr>

        `;

    }

}


// ========================================
// DISPLAY CUSTOMERS
// ========================================

function displayCustomers(
    customers
) {

    const tableBody =
        document.getElementById(
            "customerTableBody"
        );


    if (customers.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="7">

                    No customers found

                </td>

            </tr>

        `;

        return;

    }


    tableBody.innerHTML = "";


    customers.forEach(
        customer => {

            const row =
                document.createElement(
                    "tr"
                );


            const balance =
                Number(
                    customer.opening_balance
                ).toFixed(2);


            row.innerHTML = `

                <td>
                    ${customer.id}
                </td>


                <td>

                    <strong>
                        ${customer.name}
                    </strong>

                </td>


                <td>
                    ${customer.phone || "-"}
                </td>


                <td>
                    ${customer.email || "-"}
                </td>


                <td>
                    ${customer.city || "-"}
                </td>


                <td>
                    Rs. ${balance}
                </td>


                <td>

                    <button
                        class="edit-button"
                        onclick="
                            editCustomer(
                                ${customer.id}
                            )
                        ">

                        Edit

                    </button>


                    <button
                        class="delete-button"
                        onclick="
                            deleteCustomer(
                                ${customer.id}
                            )
                        ">

                        Delete

                    </button>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


// ========================================
// ADD / UPDATE
// ========================================

document
    .getElementById(
        "customerForm"
    )
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const customerId =
                document.getElementById(
                    "customerId"
                ).value;


            const customerData = {

                name:
                    document.getElementById(
                        "customerName"
                    ).value.trim(),

                phone:
                    document.getElementById(
                        "phone"
                    ).value.trim(),

                email:
                    document.getElementById(
                        "email"
                    ).value.trim(),

                address:
                    document.getElementById(
                        "address"
                    ).value.trim(),

                city:
                    document.getElementById(
                        "city"
                    ).value.trim(),

                opening_balance:
                    document.getElementById(
                        "openingBalance"
                    ).value

            };


            try {

                let response;


                // UPDATE

                if (customerId) {

                    response =
                        await fetch(
                            `${CUSTOMER_API}/${customerId}`,
                            {

                                method:
                                    "PUT",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        customerData
                                    )

                            }
                        );

                }


                // CREATE

                else {

                    response =
                        await fetch(
                            CUSTOMER_API,
                            {

                                method:
                                    "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        customerData
                                    )

                            }
                        );

                }


                const result =
                    await response.json();


                if (!response.ok) {

                    alert(
                        result.message
                    );

                    return;

                }


                alert(
                    result.message
                );


                resetCustomerForm();


                loadCustomers();


            } catch (error) {

                console.error(error);


                alert(
                    "Server connection failed"
                );

            }

        }
    );


// ========================================
// EDIT
// ========================================

async function editCustomer(id) {

    try {

        const response =
            await fetch(
                `${CUSTOMER_API}/${id}`
            );


        const result =
            await response.json();


        if (!result.success) {

            alert(
                result.message
            );

            return;

        }


        const customer =
            result.data;


        document.getElementById(
            "customerId"
        ).value =
            customer.id;


        document.getElementById(
            "customerName"
        ).value =
            customer.name;


        document.getElementById(
            "phone"
        ).value =
            customer.phone || "";


        document.getElementById(
            "email"
        ).value =
            customer.email || "";


        document.getElementById(
            "address"
        ).value =
            customer.address || "";


        document.getElementById(
            "city"
        ).value =
            customer.city || "";


        document.getElementById(
            "openingBalance"
        ).value =
            customer.opening_balance || 0;


        document.getElementById(
            "formTitle"
        ).textContent =
            "Edit Customer";


        document.getElementById(
            "saveButton"
        ).textContent =
            "Update Customer";


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });


    } catch (error) {

        console.error(error);


        alert(
            "Unable to load customer"
        );

    }

}


// ========================================
// DELETE
// ========================================

async function deleteCustomer(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this customer?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${CUSTOMER_API}/${id}`,
                {

                    method:
                        "DELETE"

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
            result.message
        );


        loadCustomers();


    } catch (error) {

        console.error(error);


        alert(
            "Unable to delete customer"
        );

    }

}


// ========================================
// RESET FORM
// ========================================

function resetCustomerForm() {

    document.getElementById(
        "customerForm"
    ).reset();


    document.getElementById(
        "customerId"
    ).value = "";


    document.getElementById(
        "openingBalance"
    ).value = "0";


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add New Customer";


    document.getElementById(
        "saveButton"
    ).textContent =
        "Save Customer";

}


// ========================================
// SEARCH
// ========================================

document
    .getElementById(
        "searchInput"
    )
    .addEventListener(
        "input",
        function() {

            const searchText =
                this.value
                    .toLowerCase()
                    .trim();


            const filtered =
                allCustomers.filter(
                    customer =>

                        customer.name
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                        ||

                        (
                            customer.phone
                            || ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                        ||

                        (
                            customer.city
                            || ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                        ||

                        (
                            customer.email
                            || ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            )
                );


            displayCustomers(
                filtered
            );

        }
    );


// ========================================
// INITIAL LOAD
// ========================================

loadCustomers();
>>>>>>> a473e3435407118240ea630d7a70313ef8388e7c
