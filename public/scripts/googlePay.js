const allowedCardNetworks = [
  "AMEX",
  "DISCOVER",
  "INTERAC",
  "JCB",
  "MASTERCARD",
  "VISA"
];
const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];
if (window.PaymentRequest) {
  const request = createPaymentRequest();
  request
    .canMakePayment()
    .then(function (result) {
      if (result) {
        // Display PaymentRequest dialog on interaction with the existing checkout button
        document
          .getElementById("buyButton")
          .addEventListener("click", onBuyClicked);
      }
    })
    .catch(function (err) {
      console.log(
        "canMakePayment() error! " + err.name + " error: " + err.message
      );
    });
} else {
  console.log("PaymentRequest API not available.");
}
/**
 * Show a PaymentRequest dialog after a user clicks the checkout button
 */
function onBuyClicked() {
  createPaymentRequest()
    .show()
    .then(function (response) {
      // Dismiss payment dialog.
      response.complete("success");
      // handlePaymentResponse(response);
      $("#checkout").css("display", "none");
      $("#completeOrd").css("display", "block");
      $('#placeOrder').css("display", "inline");
    })
    .catch(function (err) {
      console.log("show() error! " + err.name + " error: " + err.message);
    });
}
/**
 * Define your unique Google Pay API configuration
 *
 * @returns {object} data attribute suitable for PaymentMethodData
 */
function getGooglePaymentsConfiguration() {
  return {
    environment: "TEST",
    apiVersion: 2,
    apiVersionMinor: 0,
    merchantInfo: {
      // A merchant ID is available after approval by Google.
      // 'merchantId':'01234567890123456789',
      merchantName: "Example Merchant"
    },
    allowedPaymentMethods: [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: allowedCardAuthMethods,
          allowedCardNetworks: allowedCardNetworks
        },
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          // Check with your payment gateway on the parameters to pass.
          // @see {@link https://developers.google.com/pay/api/web/reference/object#Gateway}
          parameters: {
            gateway: "example",
            gatewayMerchantId: "exampleGatewayMerchantId"
          }
        }
      }
    ]
  };
}
/**
 * Create a PaymentRequest
 *
 * @returns {PaymentRequest}
 */
function createPaymentRequest() {
  // Add support for the Google Pay API.
  const methodData = [
    {
      supportedMethods: "https://google.com/pay",
      data: getGooglePaymentsConfiguration()
    }
  ];
  // Add other supported payment methods.
  methodData.push({
    supportedMethods: "basic-card",
    data: {
      supportedNetworks: Array.from(allowedCardNetworks, network =>
        network.toLowerCase()
      )
    }
  });


  let foodItems = $('.food-item')
    .map(() => {
      return $(this)
        .text()
    }).prevObject

  let quantities = $('.quantity')
    .map(() => {
      return Number($(this)
        .text())
    }).prevObject

  let prices = $('.item-price')
    .map(() => {
      return Number($(this)
        .text())
    }).prevObject

  let output = [];

  for (let i = 0; i < foodItems.length; i++) {
    let obj = {};
    if (Number(quantities[i].innerHTML) !== 0) {
      obj.label = foodItems[i].innerHTML;
      obj.amount = {
        currency: "CAD",
        value: (Number(prices[i].innerHTML) * Number(quantities[i].innerHTML)).toFixed(2)
      };
      output.push(obj);
    }
  }

  output.push({
    label: "Tax",
    amount: {
      currency: "CAD",
      value: $("#grandTax")
        .html()
        .trim()
    }
  });

  const details = {
    total: {
      label: 'Sprig Order Total',
      amount: {
        currency: "CAD",
        value: Number($('#grandTotal').html())
      }
    },
    displayItems: output
  };
  const options = {
    requestPayerEmail: true,
    requestPayerName: true
  };
  return new PaymentRequest(methodData, details, options);
}
/**
 * Process a PaymentResponse
 *
 * @param {PaymentResponse} response returned when a user approves the payment request
 */
function handlePaymentResponse(response) {
  const formattedResponse = document.createElement("pre");
  formattedResponse.appendChild(
    document.createTextNode(JSON.stringify(response.toJSON(), null, 2))
  );
  document
    .getElementById("checkout")
    .insertAdjacentElement("afterend", formattedResponse);
}