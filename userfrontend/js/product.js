async function searchProduct(filters) {
    return fetch('https://ecommerce-fullstack-nine.vercel.app/api/products/by/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
    })
        .then(response => response.json())
        .then(data => {
            return data.data;
        })
        .catch(error => console.error('Error fetching data:', error));
}