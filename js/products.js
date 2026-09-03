const API_URL = "/api/products";
const CATEGORY_API = "/api/categories";

let allProducts = [];

// ========================================
// LOAD PRODUCTS
// ========================================

async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Unable to load products");
        }

        allProducts = result.data || [];
        displayProducts(allProducts);

    } catch (error) {
        console.error(error);

        const tableBody = document.getElementById("productTableBody");

        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8">
                        Failed to load products
                    </td>
                </tr>
            `;
        }
    }
}

// ========================================
// DISPLAY PRODUCTS
// ========================================

function displayProducts(products) {
    const tableBody = document.getElementById("productTableBody");

    if (!tableBody) {
        return;
    }

    if (products.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    No products found
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = "";

    products.forEach(product => {

        const stockClass =
            Number(product.stock_quantity) <=
            Number(product.minimum_stock)
                ? "stock-low"
                : "stock-good";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.id}</td>

            <td>
                <strong>${product.name}</strong>
            </td>

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
                ${product.minimum_stock}
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

const productForm = document.getElementById("productForm");

if (productForm) {

    productForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const productIdElement =
            document.getElementById("productId");

        const productId =
            productIdElement ? productIdElement.value : "";

        const productData = {

            name:
                document.getElementById("name").value.trim(),

            category_id:
                document.getElementById("category_id").value || null,

            purchase_price:
                document.getElementById("purchase_price").value || 0,

            selling_price:
                document.getElementById("selling_price").value || 0,

            stock_quantity:
                document.getElementById("stock_quantity").value || 0,

            minimum_stock:
                document.getElementById("minimum_stock").value || 5
        };

        try {

            let response;

            if (productId) {

                response = await fetch(
                    `${API_URL}/${productId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(productData)
                    }
                );

            } else {

                response = await fetch(
                    API_URL,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(productData)
                    }
                );
            }

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Operation failed");
                return;
            }

            alert(result.message);

            resetForm();

            loadProducts();

        } catch (error) {

            console.error(error);

            alert("Server connection failed");
        }

    });
}

// ========================================
// EDIT PRODUCT
// ========================================

async function editProduct(id) {

    try {

        const response =
            await fetch(`${API_URL}/${id}`);

        const result =
            await response.json();

        if (!result.success) {
            alert(result.message);
            return;
        }

        const product = result.data;

        document.getElementById("productId").value =
            product.id;

        document.getElementById("name").value =
            product.name;

        document.getElementById("category_id").value =
            product.category_id || "";

        document.getElementById("purchase_price").value =
            product.purchase_price;

        document.getElementById("selling_price").value =
            product.selling_price;

        document.getElementById("stock_quantity").value =
            product.stock_quantity;

        document.getElementById("minimum_stock").value =
            product.minimum_stock;

        const formTitle =
            document.getElementById("formTitle");

        if (formTitle) {
            formTitle.textContent = "Edit Product";
        }

        const saveButton =
            document.getElementById("saveButton");

        if (saveButton) {
            saveButton.textContent = "Update Product";
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);

        alert("Unable to load product");
    }
}

// ========================================
// DELETE PRODUCT
// ========================================

async function deleteProduct(id) {

    if (!confirm(
        "Are you sure you want to delete this product?"
    )) {
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

        alert("Unable to delete product");
    }
}

// ========================================
// RESET FORM
// ========================================

function resetForm() {

    const form =
        document.getElementById("productForm");

    if (form) {
        form.reset();
    }

    const productId =
        document.getElementById("productId");

    if (productId) {
        productId.value = "";
    }

    const formTitle =
        document.getElementById("formTitle");

    if (formTitle) {
        formTitle.textContent = "Add New Product";
    }

    const saveButton =
        document.getElementById("saveButton");

    if (saveButton) {
        saveButton.textContent = "Save Product";
    }

    const minimumStock =
        document.getElementById("minimum_stock");

    if (minimumStock) {
        minimumStock.value = 5;
    }
}

// ========================================
// SEARCH
// ========================================

const searchInput =
    document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", function() {

        const searchText =
            this.value.toLowerCase().trim();

        const filtered =
            allProducts.filter(product =>

                product.name
                    .toLowerCase()
                    .includes(searchText)

                ||

                (product.category_name || "")
                    .toLowerCase()
                    .includes(searchText)
            );

        displayProducts(filtered);
    });
}

// ========================================
// LOAD CATEGORIES
// ========================================

async function loadProductCategories() {

    try {

        const response =
            await fetch(CATEGORY_API);

        const result =
            await response.json();

        if (!result.success) {
            throw new Error(
                result.message || "Unable to load categories"
            );
        }

        const categorySelect =
            document.getElementById("category_id");

        if (!categorySelect) {
            return;
        }

        categorySelect.innerHTML = `
            <option value="">
                Select Category
            </option>
        `;

        (result.data || []).forEach(category => {

            const option =
                document.createElement("option");

            option.value = category.id;
            option.textContent = category.name;

            categorySelect.appendChild(option);
        });

    } catch (error) {

        console.error(error);
    }
}

// ========================================
// INITIAL LOAD
// ========================================

loadProducts();
loadProductCategories();