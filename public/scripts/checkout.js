let restaurantName = document.getElementById('restaurantName').innerHTML;
let orderItems = document.getElementsByClassName('order-items');
let prices = document.getElementsByClassName('price-items');
let quantities = document.getElementsByClassName('quantity-items');
let cartInfo = document.getElementById('form');

// Checks if sessionStorage exists, if not, creates it. Otherwise, it updates it with the new order items.
if (!sessionStorage.orderObj) {
  let orderObj = {};
  orderObj[restaurantName] = {};
  for (let i = 0; i < orderItems.length; i++) {
    orderObj[restaurantName][orderItems[i].innerHTML] = {
      price: prices[i].innerHTML,
      quantity: quantities[i].innerHTML
    };
    sessionStorage.setItem('orderObj', JSON.stringify(orderObj));
  }
} else {
  let orderObj = JSON.parse(sessionStorage.orderObj);
  orderObj[restaurantName] = {};
  for (let i = 0; i < orderItems.length; i++) {
    orderObj[restaurantName][orderItems[i].innerHTML] = {
      price: prices[i].innerHTML,
      quantity: quantities[i].innerHTML
    };
  }
  sessionStorage.setItem('orderObj', JSON.stringify(orderObj));
}

localStorage.clear();

// Setting the innerHTML for the cart page
// Creating an array of keys for each layer of the object, then rendering to screen
let combinedOrder = JSON.parse(sessionStorage.orderObj);
let combinedOrderKeys = Object.keys(combinedOrder);

for (let key of combinedOrderKeys) {
  let total = 0;
  $('#form').append(`<h1>${key}</h1>`);
  $('#form').append(`<ul>`)
  let combinedRestaurantKeys = Object.keys(combinedOrder[key]);
  for (let restaurantKey of combinedRestaurantKeys) {
    $('#form').append(`<li>${restaurantKey}</li>`);
    $('#form').append(`<li>${combinedOrder[key][restaurantKey].price}</li>`);
    $('#form').append(`<li>${combinedOrder[key][restaurantKey].quantity}</li>`);
    total += Number(combinedOrder[key][restaurantKey].price);
  }
  $('#form').append(`<li>${total}</li>`);
  $('#form').append('</ul>');
}

// Sends info of the order to the confirmation page
$('#form').append(`<input type='hidden' name='orderInfo' value='${JSON.stringify(combinedOrder)}'/>`);