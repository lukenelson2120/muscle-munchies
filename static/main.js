
if(localStorage.getItem("orderFull") != null) {
    var orderFull = JSON.parse(localStorage.getItem("orderFull"));

} else {
    var orderFull = [];
}
window.onload = function () {
  updateCartIcon();
}

function updateCartIcon () {
  if(document.getElementById("orderCount") != null){
   var orderCount = document.getElementById('orderCount');
      orderCount.innerHTML = orderFull.length;
   }
}

const imageCycles = [
   // '/lemonlong.jpeg',
     '/breadlong.jpeg',
       '/rowofballs.jpeg'
 ];
var i=0;


// Start timer
if (z===1) {
var timer = setInterval(menuCycle, 3000);
}
// change images on home page
function menuCycle() {
  localStorage.getItem("orderFull");
if (i >= (imageCycles.length-1)) { i=-1};
 i = i+1;
 document.getElementById('image_imageCycle').style.backgroundImage = "url('/assets"+imageCycles[i]+"')";
}
function nextCycle () {
  if (i >= (imageCycles.length-1)) { i=-1};
   i = i+1;
   document.getElementById('image_imageCycle').style.backgroundImage = "url('/assets"+imageCycles[i]+"')";
   clearInterval(timer);

  }

function orderStart(i) {
var modal = document.getElementById('modal' + i),
    span = document.getElementById('span' + i);

    modal.style.display = "block";
// close button
   span.onclick = function() {
    modal.style.display = "none";
  }
}

// register an order
function registerOrder(b) {
  var orderProduct = document.getElementById("productName" +b).value,
      orderAmount = document.getElementById("amount" +b).value;
       orderImage =  document.getElementById("productImage" +b).value,
       orderPrice =  document.getElementById("productPrice" +b).value;
      if(orderAmount >0){
       orderFull.push({orderImage, orderProduct, orderAmount, orderPrice});
      document.getElementById('modal' + b).style.display = 'none';
        localStorage.setItem("orderFull", JSON.stringify(orderFull));
        updateCartIcon();
      } else {}
}

function displayCart(orderFull) {
  var totalCost = 0,
      a = -1;

var table = document.getElementById("orderTable");
  if(orderFull.length > 0 ) {
    orderFull.forEach((orderFull) => {
   if(orderFull.orderAmount > 0) {
    totalCost = (orderFull.orderPrice * orderFull.orderAmount) + totalCost;
     var tr = document.createElement('tr');
      var tdimage = document.createElement('td');
        var img = document.createElement('img');
            img.src = '/assets/productimages/balls/' +orderFull.orderImage;
            img.classList.add("orderImg");
          tdimage.appendChild(img);
          tr.appendChild(tdimage);
      var td1 = document.createElement('td');
              td1.innerHTML = orderFull.orderProduct +' x '+ orderFull.orderAmount;
           tr.appendChild(td1);

      var td3 = document.createElement('td');
          var changeAmount = document.createElement('input');
              changeAmount.type= 'number';
              changeAmount.value = orderFull.orderAmount;
          var button = document.createElement('button');
              button.innerHTML = "Change Order";
              button.classList.add('changeorderbutt');

        // Add price
        var td4 = document.createElement('td');
            td4.innerHTML = '$' + orderFull.orderPrice;
        // Add class
              td1.classList.add('cartValues');
              td3.classList.add('cartValues');
              td4.classList.add('cartValues');
            td3.appendChild(changeAmount);
            td3.appendChild(button);
          tr.appendChild(td3);
            tr.appendChild(td4);
              // change order quantity button
            button.onclick = function() {
              if(changeAmount.value != 0){
                  orderFull.orderAmount = changeAmount.value;
                  // updates the entire array in local storage
                    updateOrders();
              } else {
                // deletes just the part of the array we don't want
                    deleteOrders(a);
                    updateOrders();
              } } }

         table.appendChild(tr);
           a = a+1;


    });

  } else {
    alert("No Products in Cart");
   }
   document.getElementById("confirmOrderButton").innerHTML = "Confirm $" + totalCost + " order";
   document.getElementById("amount").value = totalCost;
}

function updateOrders() {
   localStorage.setItem("orderFull", JSON.stringify(orderFull));
   location.reload();
}
function deleteOrders(x) {
  orderFull.splice(x, 1);

}
function clearCart() {
  localStorage.clear('orderFull');
  alert("Cart has been cleared");
  location.reload();
}

function setOrder(orderFull) {
  var totalCost = 0;
  orderFull.forEach((orderFull) => {
    totalCost = (orderFull.orderPrice * orderFull.orderAmount) + totalCost;
    delete orderFull.orderImage;
    delete orderFull.orderPrice;
  });
  document.getElementById("finalOrder").value = JSON.stringify(orderFull);
  document.getElementById("finalOrderCost").value = totalCost;
  alert("Order is Confirmed");
  clearCart();
}

function submiteverything (orderFull){
  var totalCost = 0;
  orderFull.forEach((orderFull) => {
    totalCost = (orderFull.orderPrice * orderFull.orderAmount) + totalCost;
    delete orderFull.orderImage;
    delete orderFull.orderPrice;
  });
  document.getElementById("finalOrder").value = JSON.stringify(orderFull);
  document.getElementById("finalOrderCost").value = totalCost;
  alert("Order is Confirmed. Please dismiss this and wait while we redirect you to the payment page.");
    localStorage.clear('orderFull');
  console.log("jeff");
      setTimeout(function() {
        document.getElementById("orderForm").submit();
      }, 3000);
    setTimeout(function() {
            document.getElementById("paypalform").submit();
  }, 6000); console.log("test");


}
