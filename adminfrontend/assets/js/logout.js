document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    if (token === null) {
        window.location.href = './login.html';
    }
});


const logout = () => {

    fetch('https://ecommerce-fullstack-6weystx9o-zeumowebs-projects.vercel.app/api/signout/' + localStorage.getItem('token'));
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    window.location.href = './login.html';
}

