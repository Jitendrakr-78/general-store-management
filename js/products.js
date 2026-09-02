const API_URL =
    "http://localhost:5000/api/products";

let allProducts = [];


// ========================================
// LOAD PRODUCTS
// ========================================

async function loadProducts() {

    try {

        const response =
            await fetch(API_URL);

        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                "Unable to load products"
            );

        }


        allProducts = result.data;

        displayProducts(allProducts);


    } catch (error) {

        console.error(error);

        document.getElementById(
            "productTableBody"
        ).innerHTML = `
            <tr>
                <td colspan="9">
                    Failed to load products
                </td>
            </tr>
        `;

    }

}


// ========================================
// DISPLAY PRODUCTS
// ========================================

function displayProducts(products) {

    const tableBody =
        document.getElementById(
            "productTableBody"
        );


    if (products.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9">
                    No products found
                </td>
            </tr>
        `;

        return;

    }


    tableBody.innerHTML = "";


    products.forEach(product => {


        const stockClass =
            product.stock_quantity <=
            product.minimum_stock

            ? "stock-low"

            : "stock-good";


        const row = document.createElement("tr");


        row.innerHTML = `

            <td>${product.id}</td>

            <td>
                <strong>
                    ${product.name}
                </strong>
            </td>

            <td>${product.sku}</td>

            <td>
                ${product.category_name || "-"}
            </td>

            <td>
                Rs. ${product.purchase_price}
            </td>

            <td>
                Rs. ${product.selling_price}
            </td>

            <td class="${stockClass}">
                ${product.stock_quantity}
            </td>

            <td>
                ${product.unit}
            </td>

            <td>

                <button
                    class="edit-button"
                    onclick="editProduct(${product.id})">

                    Edit

                </button>


                <button
                    class="delete-button"
                    onclick="deleteProduct(${product.id})">

                    Delete

                </button>

            </td>
        `;


        tableBody.appendChild(row);

    });

}


// ========================================
// ADD / UPDATE PRODUCT
// ========================================

document
    .getElementById("productForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const productId =
                document.getElementById(
                    "productId"
                ).value;


            const productData = {

                category_id:
                    document.getElementById(
                        "category_id"
                    ).value || null,

                name:
                    document.getElementById(
                        "name"
                    ).value.trim(),

                sku:
                    document.getElementById(
                        "sku"
                    ).value.trim(),

                purchase_price:
                    document.getElementById(
                        "purchase_price"
                    ).value || 0,

                selling_price:
                    document.getElementById(
                        "selling_price"
                    ).value || 0,

                stock_quantity:
                    document.getElementById(
                        "stock_quantity"
                    ).value || 0,

                minimum_stock:
                    document.getElementById(
                        "minimum_stock"
                    ).value || 5,

                unit:
                    document.getElementById(
                        "unit"
                    ).value

            };


            try {

                let response;


                if (productId) {

                    // UPDATE

                    response =
                        await fetch(
                            `${API_URL}/${productId}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        productData
                                    )
                            }
                        );

                } else {

                    // CREATE

                    response =
                        await fetch(
                            API_URL,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        productData
                                    )
                            }
                        );

                }


                const result =
                    await response.json();


                if (!response.ok) {

                    alert(result.message);

                    return;

                }


                alert(result.message);


                resetForm();

                loadProducts();


            } catch (error) {

                console.error(error);

                alert(
                    "Server connection failed"
                );

            }

        }
    );


// ========================================
// EDIT PRODUCT
// ========================================

async function editProduct(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        const result =
            await response.json();


        if (!result.success) {

            alert(result.message);

            return;

        }


        const product =
            result.data;


        document.getElementById(
            "productId"
        ).value = product.id;


        document.getElementById(
            "name"
        ).value = product.name;


        document.getElementById(
            "sku"
        ).value = product.sku;


        document.getElementById(
            "category_id"
        ).value =
            product.category_id || "";


        document.getElementById(
            "purchase_price"
        ).value =
            product.purchase_price;


        document.getElementById(
            "selling_price"
        ).value =
            product.selling_price;


        document.getElementById(
            "stock_quantity"
        ).value =
            product.stock_quantity;


        document.getElementById(
            "minimum_stock"
        ).value =
            product.minimum_stock;


        document.getElementById(
            "unit"
        ).value =
            product.unit;


        document.getElementById(
            "formTitle"
        ).textContent =
            "Edit Product";


        document.getElementById(
            "saveButton"
        ).textContent =
            "Update Product";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load product"
        );

    }

}


// ========================================
// DELETE PRODUCT
// ========================================

async function deleteProduct(id) {


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(result.message);

            return;

        }


        alert(result.message);

        loadProducts();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete product"
        );

    }

}


// ========================================
// RESET FORM
// ========================================

function resetForm() {

    document.getElementById(
        "productForm"
    ).reset();


    document.getElementById(
        "productId"
    ).value = "";


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add New Product";


    document.getElementById(
        "saveButton"
    ).textContent =
        "Save Product";


    document.getElementById(
        "minimum_stock"
    ).value = 5;

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
                allProducts.filter(
                    product =>

                        product.name
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        product.sku
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        (
                            product.category_name || ""
                        )
                            .toLowerCase()
                            .includes(searchText)
                );


            displayProducts(filtered);

        }
    );



const CATEGORY_API =
    "http://localhost:5000/api/categories";
async function loadProductCategories() {

    try {

        const response =
            await fetch(CATEGORY_API);


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                "Unable to load categories"
            );

        }


        const categorySelect =
            document.getElementById(
                "category_id"
            );


        categorySelect.innerHTML = `

            <option value="">
                Select Category
            </option>

        `;


        result.data.forEach(
            category => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    category.id;


                option.textContent =
                    category.name;


                categorySelect.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(error);

    }

}
// ========================================
// INITIAL LOAD
// ========================================

loadProducts();

loadProductCategories();
