const server = "http://127.0.0.1:3000/"
var productData = []

function getCookie(name) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(name + '=') === 0) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}
function setCookie(name, value, daysToExpire) {
    var cookie = name + "=" + encodeURIComponent(value);
    if (daysToExpire) {
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + daysToExpire);
        cookie += "; expires=" + expirationDate.toUTCString();
    }
    cookie += "; path=/";
    document.cookie = cookie;
}


var id_user;
Render = async () => {
    const boxShowUser = document.getElementById("box_show_info_user")
    // boxShowUser.innerHTML
    var token = getCookie("token")
    if (token == null) {
        return window.location.href = "./sign_in.html";
    }

    try {
        const res = await fetch('http://127.0.0.1:3000/user/check-login',
            {
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + token,
                },
            },
        );
        res.status != 200 && setTimeout(() => {
            window.location.href = "./sign_in.html"

        }, 50);
        const resData = await res.json()
        id_user = resData.userData.userId
    } catch (err) {
        console.log(err.message);
    }

    try {
        const res = await fetch('http://127.0.0.1:3000/user/' + id_user,
            {
                method: 'GET',
            },
        );
        const resData = await res.json()
        boxShowUser.innerHTML = `
                <h2>Thông tin vận chuyển</h2>
                <div class="info">
                    <label for="full_name">Họ tên người nhận:</label>
                    <input id="full_name" type="text" value="${resData.info.full_name}">
                </div>
                <div class="info">
                    <label for="phone">Số điện thoại:</label>
                    <input id="phone" type="text" value="${resData.info.phone}">
                </div>
                <div class="info">
                    <label for="location">Địa chỉ:</label>
                    <input id="location" type="text" value="${resData.info.location}">
                </div>
                <button onclick="SubmitOrder()" class="btn_order">Đặt hàng</button>
        `
        RenderProductCart()
    } catch (err) {
        console.log(err.message);
    }
}

RenderProductCart = async () => {
    let sessionData = sessionStorage.getItem('cartProduct');
    let cartProduct = {};

    const boxShowProduct = document.getElementById("cart_user")
    if (sessionData) {
        cartProduct = JSON.parse(sessionData);
        boxShowProduct.innerHTML = '<h2>Giỏ hàng</h2>'
    }
    if (!sessionData) {
        return boxShowProduct.innerHTML = '<h2>Giỏ hàng: Chưa được thêm.</h2>'
    }
    var discountMoney = 0;
    var totalMoney = 0;
    Object.keys(cartProduct).forEach((key) => {
        cartProduct[key].forEach(async (product, i) => {
            const res = await fetch(server + 'products/' + product.id,
                {
                    method: 'GET',
                },
            );
            const resData = await res.json()
            let discount = resData.product.discount / 100 || 0;
            discountMoney += resData.product.price * discount;
            totalMoney += (resData.product.price - (resData.product.price * discount)) * product.quantity;
            productData = [...productData, {
                productId: resData.product._id,
                name: resData.product.name_product,
                size: product.size,
                cost: totalMoney,
                quantity: product.quantity
            }]
            boxShowProduct.innerHTML += `
            <div class="product_cart col_12">
                        <img class="col_3" src="${server}${resData.product.main_img_product}" alt="">
                        <div class="info_product">
                            <div class="info_product_top d_flex">
                                <div class="name_size_product">
                                    <a href="./info_product.html?id_product=${resData.product._id}">
                                        <h3>${resData.product.name_product}</h3>
                                    </a>
                                    <p>Size ${product.size.toLocaleUpperCase()}</p>
                                </div>
                                <button onclick="DeleteProduct('${i}','${key}')" class="delete_cart">X</button>
                            </div>
                            <div class="info_product_bottom d_flex">
                                <div class="amount_product">
                                    <button class="reduce">-</button>
                                    <p class="amount">${product.quantity}</p>
                                    <button class="increase">+</button>
                                </div>
                                <div class="price_product">
                                    <p><b>${ConvertNum(resData.product.price - (resData.product.price * discount))}đ</b></p>
                                    <del style="opacity: 0.6;">${ConvertNum(resData.product.price)}đ</del>
                                </div>
                            </div>
                        </div>
                    </div>
            `
        });
    })

    const boxShowPrice = document.getElementById("total_price")
    setTimeout(function () {
        console.log(productData);

        boxShowPrice.innerHTML = `
                <div class="price_info">
                <p>Tạm tính:</p>
                <div>
                    <p>${ConvertNum(totalMoney)}đ</p>
                    <p><i>(Tiết kiệm <span>${Math.floor(discountMoney / 1000)}K</span>)</i></p>
                </div>
                </div>
                <div class="price_info">
                    <p>Phí giao hàng:</p>
                    <div>
                        <p>Miễn phí</p>
                    </div>
                </div>
                <div class="price_info total_bill">
                    <p>Tổng</p>
                    <p><b>${ConvertNum(totalMoney)}đ</b></p>
                </div>
        `
    }, 2000)
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

SubmitOrder = async () => {
    var fullName = document.getElementById("full_name")
    var phone = document.getElementById("phone")
    var location = document.getElementById("location")
    if (fullName.value.length == 0 || phone.value.length == 0 || location.value.length == 0) {
        const content_popup = document.getElementById("content_popup")
        content_popup.innerHTML = `
        <h2 style="color: red;">Vui lòng nhập đầy đủ thông tin</h2>
            <div>
            <button class="__confirm">Đóng</button>
            </div>`
        ShowPopUp()
        return
    }
    if (phone.value.length < 10 || phone.value.length > 12) {
        console.log(1);
        const content_popup = document.getElementById("content_popup")
        content_popup.innerHTML = `
        <h2 style="color: red;">Vui lòng nhập đúng số điện thoại</h2>
            <div>
            <button class="__confirm">Đóng</button>
            </div>`
        ShowPopUp()
        return
    }
    let data = {
        user_id: id_user,
        products: productData,
        name: fullName.value,
        phone: phone.value,
        location: location.value,
    }
    console.log(data);

    try {
        const res = await fetch('http://127.0.0.1:3000/orders/',
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            },
        );
        const resData = await res.json();
        res.status == 201 ? color = "green" : color = "red"
        const content_popup = document.getElementById("content_popup")
        content_popup.innerHTML = `
        <h2 style="color: ${color};">${resData.message}</h2>
            <div>
            <a href="./user.html"><button class="__confirm">Đóng</button></a>
            </div>`
        ShowPopUp()
        sessionStorage.setItem('cartProduct', '');

        // res.status == 201 && setTimeout(() => {
        //     window.location.href = "./category.html"
        // }, 500);
        console.log(resData);
    } catch (err) {
        console.log(err.message);
    }
}

DeleteProduct = (i, keyId) => {
    let sessionData = sessionStorage.getItem('cartProduct');
    let cartProduct = {};

    if (sessionData) {
        cartProduct = JSON.parse(sessionData);
    }

    if (cartProduct[keyId].length == 1) {
        delete cartProduct[keyId];
    }
    if (cartProduct[keyId]) {
        cartProduct[keyId].splice(i, 1)
    }
    sessionStorage.setItem('cartProduct', JSON.stringify(cartProduct));
    RenderProductCart()
}


ConvertNum = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}