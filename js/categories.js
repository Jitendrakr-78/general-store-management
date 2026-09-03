<<<<<<< HEAD
const CATEGORY_API =
    "http://localhost:5000/api/categories";


let allCategories = [];


// ========================================
// LOAD CATEGORIES
// ========================================

async function loadCategories() {

    try {

        const response =
            await fetch(CATEGORY_API);


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                "Failed to load categories"
            );

        }


        allCategories =
            result.data;


        displayCategories(
            allCategories
        );


    } catch (error) {

        console.error(error);

        document.getElementById(
            "categoryTableBody"
        ).innerHTML = `

            <tr>

                <td colspan="5">

                    Failed to load categories

                </td>

            </tr>

        `;

    }

}


// ========================================
// DISPLAY CATEGORIES
// ========================================

function displayCategories(
    categories
) {

    const tableBody =
        document.getElementById(
            "categoryTableBody"
        );


    if (categories.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="5">

                    No categories found

                </td>

            </tr>

        `;

        return;

    }


    tableBody.innerHTML = "";


    categories.forEach(category => {

        const row =
            document.createElement("tr");


        const createdDate =
            category.created_at
                ? new Date(
                    category.created_at
                ).toLocaleDateString()
                : "-";


        row.innerHTML = `

            <td>
                ${category.id}
            </td>


            <td>
                <strong>
                    ${category.name}
                </strong>
            </td>


            <td>
                ${category.description || "-"}
            </td>


            <td>
                ${createdDate}
            </td>


            <td>

                <button
                    class="edit-button"
                    onclick="
                        editCategory(
                            ${category.id}
                        )
                    ">

                    Edit

                </button>


                <button
                    class="delete-button"
                    onclick="
                        deleteCategory(
                            ${category.id}
                        )
                    ">

                    Delete

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ========================================
// ADD / UPDATE
// ========================================

document
    .getElementById("categoryForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const categoryId =
                document.getElementById(
                    "categoryId"
                ).value;


            const categoryData = {

                name:
                    document.getElementById(
                        "categoryName"
                    ).value.trim(),

                description:
                    document.getElementById(
                        "categoryDescription"
                    ).value.trim()

            };


            try {

                let response;


                if (categoryId) {

                    // UPDATE

                    response =
                        await fetch(
                            `${CATEGORY_API}/${categoryId}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        categoryData
                                    )
                            }
                        );

                } else {

                    // CREATE

                    response =
                        await fetch(
                            CATEGORY_API,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        categoryData
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


                resetCategoryForm();

                loadCategories();


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

async function editCategory(id) {

    try {

        const response =
            await fetch(
                `${CATEGORY_API}/${id}`
            );


        const result =
            await response.json();


        if (!result.success) {

            alert(
                result.message
            );

            return;

        }


        const category =
            result.data;


        document.getElementById(
            "categoryId"
        ).value =
            category.id;


        document.getElementById(
            "categoryName"
        ).value =
            category.name;


        document.getElementById(
            "categoryDescription"
        ).value =
            category.description || "";


        document.getElementById(
            "formTitle"
        ).textContent =
            "Edit Category";


        document.getElementById(
            "saveButton"
        ).textContent =
            "Update Category";


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load category"
        );

    }

}


// ========================================
// DELETE
// ========================================

async function deleteCategory(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this category?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${CATEGORY_API}/${id}`,
                {
                    method: "DELETE"
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


        loadCategories();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete category"
        );

    }

}


// ========================================
// RESET FORM
// ========================================

function resetCategoryForm() {

    document.getElementById(
        "categoryForm"
    ).reset();


    document.getElementById(
        "categoryId"
    ).value = "";


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add New Category";


    document.getElementById(
        "saveButton"
    ).textContent =
        "Save Category";

}


// ========================================
// SEARCH
// ========================================

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        function() {

            const searchText =
                this.value
                    .toLowerCase()
                    .trim();


            const filtered =
                allCategories.filter(
                    category =>

                        category.name
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                        ||

                        (
                            category.description
                            || ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            )
                );


            displayCategories(
                filtered
            );

        }
    );


// ========================================
// INITIAL LOAD
// ========================================

loadCategories();
=======
const CATEGORY_API =
    "http://localhost:5000/api/categories";


let allCategories = [];


// ========================================
// LOAD CATEGORIES
// ========================================

async function loadCategories() {

    try {

        const response =
            await fetch(CATEGORY_API);


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                "Failed to load categories"
            );

        }


        allCategories =
            result.data;


        displayCategories(
            allCategories
        );


    } catch (error) {

        console.error(error);

        document.getElementById(
            "categoryTableBody"
        ).innerHTML = `

            <tr>

                <td colspan="5">

                    Failed to load categories

                </td>

            </tr>

        `;

    }

}


// ========================================
// DISPLAY CATEGORIES
// ========================================

function displayCategories(
    categories
) {

    const tableBody =
        document.getElementById(
            "categoryTableBody"
        );


    if (categories.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="5">

                    No categories found

                </td>

            </tr>

        `;

        return;

    }


    tableBody.innerHTML = "";


    categories.forEach(category => {

        const row =
            document.createElement("tr");


        const createdDate =
            category.created_at
                ? new Date(
                    category.created_at
                ).toLocaleDateString()
                : "-";


        row.innerHTML = `

            <td>
                ${category.id}
            </td>


            <td>
                <strong>
                    ${category.name}
                </strong>
            </td>


            <td>
                ${category.description || "-"}
            </td>


            <td>
                ${createdDate}
            </td>


            <td>

                <button
                    class="edit-button"
                    onclick="
                        editCategory(
                            ${category.id}
                        )
                    ">

                    Edit

                </button>


                <button
                    class="delete-button"
                    onclick="
                        deleteCategory(
                            ${category.id}
                        )
                    ">

                    Delete

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ========================================
// ADD / UPDATE
// ========================================

document
    .getElementById("categoryForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const categoryId =
                document.getElementById(
                    "categoryId"
                ).value;


            const categoryData = {

                name:
                    document.getElementById(
                        "categoryName"
                    ).value.trim(),

                description:
                    document.getElementById(
                        "categoryDescription"
                    ).value.trim()

            };


            try {

                let response;


                if (categoryId) {

                    // UPDATE

                    response =
                        await fetch(
                            `${CATEGORY_API}/${categoryId}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        categoryData
                                    )
                            }
                        );

                } else {

                    // CREATE

                    response =
                        await fetch(
                            CATEGORY_API,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        categoryData
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


                resetCategoryForm();

                loadCategories();


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

async function editCategory(id) {

    try {

        const response =
            await fetch(
                `${CATEGORY_API}/${id}`
            );


        const result =
            await response.json();


        if (!result.success) {

            alert(
                result.message
            );

            return;

        }


        const category =
            result.data;


        document.getElementById(
            "categoryId"
        ).value =
            category.id;


        document.getElementById(
            "categoryName"
        ).value =
            category.name;


        document.getElementById(
            "categoryDescription"
        ).value =
            category.description || "";


        document.getElementById(
            "formTitle"
        ).textContent =
            "Edit Category";


        document.getElementById(
            "saveButton"
        ).textContent =
            "Update Category";


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load category"
        );

    }

}


// ========================================
// DELETE
// ========================================

async function deleteCategory(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this category?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${CATEGORY_API}/${id}`,
                {
                    method: "DELETE"
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


        loadCategories();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete category"
        );

    }

}


// ========================================
// RESET FORM
// ========================================

function resetCategoryForm() {

    document.getElementById(
        "categoryForm"
    ).reset();


    document.getElementById(
        "categoryId"
    ).value = "";


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add New Category";


    document.getElementById(
        "saveButton"
    ).textContent =
        "Save Category";

}


// ========================================
// SEARCH
// ========================================

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        function() {

            const searchText =
                this.value
                    .toLowerCase()
                    .trim();


            const filtered =
                allCategories.filter(
                    category =>

                        category.name
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                        ||

                        (
                            category.description
                            || ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            )
                );


            displayCategories(
                filtered
            );

        }
    );


// ========================================
// INITIAL LOAD
// ========================================

loadCategories();
>>>>>>> a473e3435407118240ea630d7a70313ef8388e7c
