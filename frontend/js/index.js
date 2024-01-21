const server = "http://127.0.0.1:3000/"

Render = async () => {
    var show = document.getElementById("box_new_products");

    try {
        const res = await fetch(server + 'products/new_products/',
            {
                method: 'GET',
            },
        );
        const resData = await res.json()

        resData.products.forEach((pro, i) => {
            let discount = pro.discount / 100 || 0
            if (i < 4) {
                show.innerHTML += `
                    <div class="product d_flex col_3">
                        <div class="box_img">
                            <div class="img_product">
                                <img onclick="InfoProductFromIndex('${pro._id}')" src="${server}${pro.main_img_product}" alt="">
                                <img onclick="InfoProductFromIndex('${pro._id}')" src="${server}${pro.sub_img_product}" alt="">
                                <div class="cart_size_product">
                                    <div class="box_cart_size_product">
                                        <h3>Thêm vào giỏ hàng</h3>
                                        <div class="box_size_product">
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div onclick="InfoProductFromIndex('${pro._id}')" class="content_product">
                            <h3>${pro.name_product}</h3>
                            <p>${pro.describe}</p>
                            <h3>${ConvertNum(pro.price - (pro.price * discount))}đ</h3>
                        </div>
                    </div>
                `
            }
        });
        resData.products.forEach((pro, i) => {
            if (i < 4) {
                let boxSizeProduct = document.querySelectorAll(".box_size_product")
                pro.list_size.forEach((lsSize, index) => {
                    boxSizeProduct[i].innerHTML += `
                <button onclick="AddCart('${pro._id}','${lsSize.size}')">${lsSize.size.toLocaleUpperCase()}</button>
            `
                });
            }
        })

    } catch (err) {
        console.log(err.message);
    }
}

AddCart = (id, size) => {

    let sessionData = sessionStorage.getItem('cartProduct');
    let cartProduct = {};

    if (sessionData) {
        cartProduct = JSON.parse(sessionData);
    }

    if (cartProduct[id]) {
        cartProduct[id].forEach((pro, i) => {
            if (pro.size == size) {
                pro.quantity += 1;
            } else {
                cartProduct[id] = [...cartProduct[id], { id: id, size: size, quantity: 1 }];
            }
        });
    } else {
        cartProduct[id] = [{ id: id, size: size, quantity: 1 }];
    }
    sessionStorage.setItem('cartProduct', JSON.stringify(cartProduct));
    let check = sessionStorage.getItem('cartProduct');
    check = JSON.parse(check)
    let amountProduct = document.getElementById("amount_product_cart")
    let count = 0
    Object.keys(check).forEach(key => {
        check[key].forEach((product, i) => {
            count += product.quantity;
        });
    });
    amountProduct.innerHTML = count
}

InfoProductFromIndex = (id_product) => {
    window.location.href = `./nav/info_product.html?id_product=${id_product}`
}

ConvertNum = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}