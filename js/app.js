<<<<<<< HEAD
async function testBackend() {

    try {

        const response = await fetch("/api/products");

        const data = await response.json();

        document.getElementById("result").textContent =
            data.message || JSON.stringify(data);

    } catch (error) {

        console.error(error);

        document.getElementById("result").textContent =
            "Backend connection failed.";

    }
=======
async function testBackend() {

    try {

        const response = await fetch("/api/products");

        const data = await response.json();

        document.getElementById("result").textContent =
            data.message || JSON.stringify(data);

    } catch (error) {

        console.error(error);

        document.getElementById("result").textContent =
            "Backend connection failed.";

    }
>>>>>>> a473e3435407118240ea630d7a70313ef8388e7c
}