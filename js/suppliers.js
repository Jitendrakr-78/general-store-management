const SUPPLIER_API =
    "http://localhost:5000/api/suppliers";


let allSuppliers = [];


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
                "Failed to load suppliers"
            );

        }


        allSuppliers =
            result.data;


        displaySuppliers(
            allSuppliers
        );


    } catch (error) {

        console.error(error);


        document.getElementById(
            "supplierTableBody"
        ).innerHTML = `

            <tr>

                <td colspan="7">

                    Failed to load suppliers

                </td>

            </tr>

        `;

    }

}


// ========================================
// DISPLAY SUPPLIERS
// ========================================

function displaySuppliers(
    suppliers
) {

    const tableBody =
        document.getElementById(
            "supplierTableBody"
        );


    if (suppliers.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="7">

                    No suppliers found

                </td>

            </tr>

        `;

        return;

    }


    tableBody.innerHTML = "";


    suppliers.forEach(
        supplier => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${supplier.id}
                </td>


                <td>

                    <strong>
                        ${supplier.name}
                    </strong>

                </td>


                <td>
                    ${supplier.company_name || "-"}
                </td>


                <td>
                    ${supplier.phone || "-"}
                </td>


                <td>
                    ${supplier.email || "-"}
                </td>


                <td>
                    ${supplier.city || "-"}
                </td>


                <td>

                    <button
                        class="edit-button"
                        onclick="
                            editSupplier(
                                ${supplier.id}
                            )
                        ">

                        Edit

                    </button>


                    <button
                        class="delete-button"
                        onclick="
                            deleteSupplier(
                                ${supplier.id}
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
// ADD / UPDATE SUPPLIER
// ========================================

document
    .getElementById(
        "supplierForm"
    )
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const supplierId =
                document.getElementById(
                    "supplierId"
                ).value;


            const supplierData = {

                name:
                    document.getElementById(
                        "supplierName"
                    ).value.trim(),

                company_name:
                    document.getElementById(
                        "companyName"
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
                    ).value.trim()

            };


            try {

                let response;


                // UPDATE

                if (supplierId) {

                    response =
                        await fetch(
                            `${SUPPLIER_API}/${supplierId}`,
                            {

                                method:
                                    "PUT",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        supplierData
                                    )

                            }
                        );

                }

                // CREATE

                else {

                    response =
                        await fetch(
                            SUPPLIER_API,
                            {

                                method:
                                    "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        supplierData
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


                resetSupplierForm();


                loadSuppliers();


            } catch (error) {

                console.error(error);


                alert(
                    "Server connection failed"
                );

            }

        }
    );


// ========================================
// EDIT SUPPLIER
// ========================================

async function editSupplier(id) {

    try {

        const response =
            await fetch(
                `${SUPPLIER_API}/${id}`
            );


        const result =
            await response.json();


        if (!result.success) {

            alert(
                result.message
            );

            return;

        }


        const supplier =
            result.data;


        document.getElementById(
            "supplierId"
        ).value =
            supplier.id;


        document.getElementById(
            "supplierName"
        ).value =
            supplier.name;


        document.getElementById(
            "companyName"
        ).value =
            supplier.company_name || "";


        document.getElementById(
            "phone"
        ).value =
            supplier.phone || "";


        document.getElementById(
            "email"
        ).value =
            supplier.email || "";


        document.getElementById(
            "address"
        ).value =
            supplier.address || "";


        document.getElementById(
            "city"
        ).value =
            supplier.city || "";


        document.getElementById(
            "formTitle"
        ).textContent =
            "Edit Supplier";


        document.getElementById(
            "saveButton"
        ).textContent =
            "Update Supplier";


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });


    } catch (error) {

        console.error(error);


        alert(
            "Unable to load supplier"
        );

    }

}


// ========================================
// DELETE SUPPLIER
// ========================================

async function deleteSupplier(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this supplier?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${SUPPLIER_API}/${id}`,
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


        loadSuppliers();


    } catch (error) {

        console.error(error);


        alert(
            "Unable to delete supplier"
        );

    }

}


// ========================================
// RESET FORM
// ========================================

function resetSupplierForm() {

    document.getElementById(
        "supplierForm"
    ).reset();


    document.getElementById(
        "supplierId"
    ).value = "";


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add New Supplier";


    document.getElementById(
        "saveButton"
    ).textContent =
        "Save Supplier";

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
                allSuppliers.filter(
                    supplier =>

                        supplier.name
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                        ||

                        (
                            supplier.company_name
                            || ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                        ||

                        (
                            supplier.phone
                            || ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                        ||

                        (
                            supplier.city
                            || ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            )
                );


            displaySuppliers(
                filtered
            );

        }
    );


// ========================================
// INITIAL LOAD
// ========================================

loadSuppliers();
