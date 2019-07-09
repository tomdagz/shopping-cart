const PRODUCTS_URL = 'http://test.oneclean.mx/test.php';
const STORAGE_LEY = 'shopping_cart';
let storage = null;

window.addEventListener('load', init, false);

function listProducts(data) {
    let list = '';

    for(let product of data.products) {
        colors = '<option selected>Selecciona el color</option>';

        product.colors.forEach(function(color) {
            colors += `<option value="${ color.nameColor }">${ color.nameColor }</option>`
        });

        list += `
            <div class="col-sm-6 col-md-4 col-lg-3 product-info">
                <div class="card">
                    <div class="card-body">
                        <h5>${ product.name }</h5>
                        <form class="product-form" data-product-id=${ product.id }>
                            <div class="form-group">
                                <label for="quantity">Cantidad</label>
                                <input type="number" max="${ product.available }" id="quantity" class="form-control" required data-stock=${ product.available }>
                                <small id="" class="text-muted">${ product.available } disponibles</small>
                            </div>
                            <div class="form-group">
                                <label for="color">Color</label>
                                <select class="custom-select" id="color">
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
    console.log(this)
}

function init() {
    showProducts()
    storage = new StorageController(STORAGE_LEY);

    $(document).on('submit', '.product-form', addToCart);

}