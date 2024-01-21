const server = "http://127.0.0.1:3000/"

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

var data = []
var controlData = []
var showData = []
var listSize = [
    { size: 's', info: "48-54" },
    { size: 'm', info: "55-63" },
    { size: 'l', info: "64-72" },
    { size: 'xl', info: "70-80" },
    { size: '2xl', info: "75-85" },
    { size: '3xl', info: "80-90" },
]

Render = async () => {
    var controlBox = document.getElementById("filter_sale_product")
    var show = document.getElementById("box_new_products");
    controlBox.innerHTML = ""
    show.innerHTML = ''

    controlBox.innerHTML = `
    <h3>Giảm giá:</h3>
                <div class="filter_size_product" id="filter_size_product">
                    <p>Lọc theo kích cỡ:</p>
                </div>
                <div class="filter_orther_product col_12">
                    <select name="" id="category_select" onchange="ChosenCate()">
                    </select>
                    <select name="" id="price_select" onchange="ChosenPrice()">
                        <option value="" hidden>Giá sản phẩm</option>
                        <option value="1">Thấp đến cao</option>
                        <option value="2">Cao đến thấp</option>
                    </select>
                    <button onclick="window.location.reload()">Xóa lọc</button>
                </div>
    `
    var controlSize = document.getElementById("filter_size_product")
    listSize.forEach((v, i) => {
        controlSize.innerHTML += `
        <button class="btn_size_choose" onclick="ChosenSize('${v.size}','${i}')">
            <p><b>Size ${v.size.toLocaleUpperCase()}</b></p>
            <p>${v.info} kg</p>
        </button>
        `
    });
    const resCate = await fetch(server + 'categories/',
        {
            method: 'GET',
        },
    );
    const resDataCategory = await resCate.json();
    var controlCate = document.getElementById("category_select")
    controlCate.innerHTML = "<option value='' hidden>Loại sản phẩm</option>"
    resDataCategory.categories.forEach((v, i) => {
        controlCate.innerHTML += `
        <option value="${v.id_category}">${v.name_category}</option>
        `
    });
    

    // try {
    const res = await fetch(server + 'products/',
        {
            method: 'GET',
        },
    );
    const resData = await res.json()
    resData.products.forEach((pro, i) => {
        let discount = pro.discount / 100 || 0
        if (discount > 0) {
            data = [...data, pro]

            show.innerHTML += `
                    <div class="product d_flex col_3">
                        <div class="box_img">
                            <div class="img_product">
                                <img onclick="InfoProductFromNav('${pro._id}')" src="${server}${pro.main_img_product}" alt="">
                                <img onclick="InfoProductFromNav('${pro._id}')" src="${server}${pro.sub_img_product}" alt="">
                                <div class="cart_size_product">
                                    <div class="box_cart_size_product">
                                        <h3>Thêm vào giỏ hàng</h3>
                                        <div class="box_size_product">
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div onclick="InfoProductFromNav('${pro._id}')" class="content_product">
                            <h3>${pro.name_product}</h3>
                            <p>${pro.describe}</p>
                            <h3>${ConvertNum(pro.price - (pro.price * discount))}đ</h3>
                            <del>${ConvertNum(pro.price)}đ</del>
                        </div>
                    </div>
                `
        }
    });
    controlData = data
    let count = 0
    resData.products.forEach((pro, i) => {
        let discount = pro.discount / 100 || 0
        if (discount > 0) {
            let boxSizeProduct = document.querySelectorAll(".box_size_product")
            pro.list_size.forEach((lsSize, index) => {
                boxSizeProduct[count].innerHTML += `
                    <button onclick="AddCart('${pro._id}','${lsSize.size}')">${lsSize.size.toLocaleUpperCase()}</button>
                `
            });
            count++
        }
    })

    // } catch (err) {
    //     console.log(err.message);
    // }
}

ReRender = () => {
    var show = document.getElementById("box_new_products");
    show.innerHTML = ''
    // try {

    var result_show = document.getElementById("result_show");
    // console.log(resData);
    showData.forEach((pro, i) => {
        let discount = pro.discount / 100 || 0
        show.innerHTML += `
        <div class="product d_flex col_3">
            <div class="box_img">
                <div class="img_product">
                    <img onclick="InfoProductFromNav('${pro._id}')" src="${server}${pro.main_img_product}" alt="">
                    <img onclick="InfoProductFromNav('${pro._id}')" src="${server}${pro.sub_img_product}" alt="">
                    <div class="cart_size_product">
                        <div class="box_cart_size_product">
                            <h3>Thêm vào giỏ hàng</h3>
                            <div class="box_size_product">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div onclick="InfoProductFromNav('${pro._id}')" class="content_product">
                <h3>${pro.name_product}</h3>
                <p>${pro.describe}</p>
                <h3>${ConvertNum(pro.price - (pro.price * discount))}đ</h3>
                <del>${ConvertNum(pro.price)}đ</del>
            </div>
        </div>
    `
    });
    let count = 0
    showData.forEach((pro, i) => {
        let discount = pro.discount / 100 || 0
        if (discount > 0) {
            let boxSizeProduct = document.querySelectorAll(".box_size_product")
            pro.list_size.forEach((lsSize, index) => {
                boxSizeProduct[count].innerHTML += `
                    <button onclick="AddCart('${pro._id}','${lsSize.size}')">${lsSize.size.toLocaleUpperCase()}</button>
                `
            });
            count++
        }
    })

    // } catch (err) {
    //     console.log(err.message);
    // }
}

ChosenCate = () => {
    var id = document.getElementById("category_select").value
    controlData = data.filter(m => {
        return m.id_category.toLowerCase().includes(id.toLowerCase().trim())
    })
    showData = controlData
    console.log(controlData);
    ReRender()
}
ChosenPrice = () => {
    var id = document.getElementById("price_select").value
    showData.length > 0 ? showData : showData = controlData
    if (id == 1) {
        showData = showData.sort(function (a, b) { return a.price - b.price });
    } else if (id == 2) {
        showData = showData.sort(function (a, b) { return b.price - a.price })
    }
    ReRender()
}
ChosenSize = (size, i) => {
    let btn_chosen = document.querySelectorAll(".btn_size_choose.select_active")
    let btn_choose = document.querySelectorAll(".btn_size_choose")
    btn_chosen.forEach((btn) => {
        btn.classList.remove("select_active")
    });
    btn_choose[i].classList.add("select_active")
    showData = []
    // showData = controlData.forEach(m => {
    //     m.list_size.filter((sz, i) => {
    //         return sz.size.toLowerCase().includes(size.toLowerCase().trim())
    //     })
    // })
    controlData.forEach(m => {
        m.list_size.forEach((sz, i) => {
            if (sz.size.toLowerCase() == size.toLowerCase().trim()) {
                showData = [...showData, m]
            }
        })
    })
    ReRender()

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


InfoProductFromNav = (id_product) => {
    window.location.href = `./info_product.html?id_product=${id_product}`
}

ConvertNum = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}