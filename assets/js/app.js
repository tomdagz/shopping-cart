const PRODUCTS_URL = 'http://test.oneclean.mx/test.php';
const BUY_URL = 'http://test.oneclean.mx/try.php';
const STORAGE_LEY = 'shopping_cart';
let storage = null;

window.addEventListener('load', init, false);

function listProducts(data) {
    let list = '';

    for(let product of data.products) {
        let colors = '<option selected value="">Seleccione</option>';

        product.colors.forEach(function(color) {
            let sizes = '';

            color.size.forEach(function(size) {
                sizes += `<option value="${ size.name }" data-price="${ size.quantity }">${ size.name } $${ size.quantity }</option>`;
            });

            colors += `<optgroup label="${ color.nameColor }" data-color="${ color.nameColor }">
                ${ sizes }
            </optgroup>`
        });

        list += `
            <div class="col-sm-6 col-md-4 col-lg-3 product-info">
                <div class="card">
                    <div class="card-body">
                        <form class="product-form" data-product-id=${ product.id }>
                            <h5>${ product.name }</h5>
                            <div class="form-group">
                                <label for="quantity">Cantidad</label>
                                <input name="quantity" type="number" min="1" max="${ product.available }" id="quantity" class="form-control" required data-stock=${ product.available }>
                                <small id="" class="text-muted">${ product.available } disponibles</small>
                            </div>
                            <div class="form-group">
                                <label for="color">Color y talla</label>
                                <select class="custom-select" id="color" name="color" required>
                                    ${ colors }
                                </select>
                            </div>
                            <input type="submit" value="Agregar al carrito" class="btn btn-primary btn-product">
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    document.getElementsByClassName('loading')[0].innerHTML = '';
    document.getElementById('products').innerHTML = list;
}

function showProducts() {
    fetch(PRODUCTS_URL)
    .then(response => response.json())
    .then(data => {
        listProducts(data);
    })
    .catch(error => console.error(error))
}

function addToCart(e) {
    e.preventDefault();
    const colorSize =  $(this).find('select[name="color"]');
    const option = colorSize.find('option:selected');

    const order_info = {
        id: $(this).attr('data-product-id'),
        amount: $(this).find('input[name="quantity"]').val(),
        size: colorSize.val(),
        color: option.closest('optgroup').attr('data-color'),
        price: option.attr('data-price'),
        name: $(this).find('h5').text(),
    }
    if (storage.addProduct(order_info)) {
        updateShoppingCart();
    }
}

function updateShoppingCart() {
    const products = storage.getProducts();
    let rows = '';
    let total = 0;

    if (products) {
        products.forEach(function(product) {
            const price = parseFloat(product.amount) * parseFloat(product.price);
            total += price;

            rows += `<tr>
                <td>${ product.amount }</td>
                <td>${ product.name } ${ product.size } ${ product.color }</td>
                <td>$${ price }</td>
            </tr>`
        });
    }

    rows += `<tr>
        <td colspan="2">Total</td>
        <td>$${ total }</td>
    </tr>`

    document.getElementById('cart-table').innerHTML = rows;
    document.getElementById('shoppig-cart-total').innerHTML = `Comprar $${total}`;
}

function clearShoppingCart() {
    storage.resetStorage();
    updateShoppingCart();
}

function buy() {
    const products = storage.getProducts();
    const productsArray = []

    if (!products) return;
 
    products.map((product) => {
        const dictionary = {};
        dictionary.id = product.id;
        dictionary.amount = product.amount;
        dictionary.color = product.color;
        dictionary.size = product.size;
        productsArray.push(dictionary)
    });

    const data = JSON.stringify({products: productsArray});

    fetch(
        BUY_URL,
        {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then(res => res.json())
    .catch(error => console.error('Error:', error))
}

function init() {
    showProducts()
    storage = new StorageController(STORAGE_LEY);

    $(document).on('submit', '.product-form', addToCart);
    document.getElementById('clear-cart').addEventListener('click', clearShoppingCart);
    document.getElementById('shoppig-cart-total').addEventListener('click', buy);
    updateShoppingCart();
}