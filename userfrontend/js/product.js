async function searchProduct(filters) {
    return fetch('http://localhost:9000/api/products/by/search', {
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