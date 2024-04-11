document.addEventListener('DOMContentLoaded', function() {
    const totalPrice = localStorage.getItem('total_price');
    if (totalPrice) {
      document.getElementById('cart-price').innerText = `$${(+totalPrice).toFixed(2)}`;
    } else {
      document.getElementById('cart-price').innerText = '$0';
    }

    const token = localStorage.getItem('token');
    const login = document.getElementById('login');

    var headerNavOption = document.querySelector('.header__nav__option');
    var links = headerNavOption.getElementsByTagName('a');

    for (var i = 1; i < links.length ; i++) {

        links[i].style.cursor = 'pointer';
        links[i].setAttribute('href', "shopping-cart.html");
    }

   
    login.style.cursor = 'pointer';
    if (token) {
      login.setAttribute('onclick', "logout()") ;
      login.innerText = 'Logout';
      login.removeAttribute("href");

    }else{
        login.removeAttribute('onclick') ;
        login.innerText = 'Login';
        login.setAttribute("href", "./login.html");
    }
  });

  const logout = () => {

    fetch('http://localhost:9000/api/signout/' + localStorage.getItem('token'));
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('total_price');
    window.location.href = './login.html';
}


function showMessage(id, messageText, duration) {
  var messageElement = document.getElementById(id);
  messageElement.textContent = messageText;
  messageElement.style.display = 'block';

  setTimeout(function() {
    messageElement.style.display = 'none';
  }, duration);
}