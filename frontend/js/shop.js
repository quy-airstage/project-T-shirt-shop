const server = "http://127.0.0.1:3000/"
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var data = []
var controlData = []

Render = async () => {
    var show = document.getElementById("box_new_products");
    show.innerHTML = ''

    var boxCategories = document.getElementById("box_categories")
    try {
        const res = await fetch(server + 'categories',
            {
                method: 'GET',
            },
        );
        const resDataCategory = await res.json();
        resDataCategory.categories.forEach((cate, i) => {
            var img = i == 1 ? 'mceclip0_5.jpg' : "IMG_4259_55.jpg"
            boxCategories.innerHTML += `
            <div onclick="ProductsInCategory('${cate.id_category}')" class="category_box col_2" style="background-image: url(../../images/home/${img});">
                <h3>${cate.name_category}</h3>
            </div>
            `;

        });

    } catch (err) {
        console.log(err.message);
    }


    try {
        const res = await fetch(server + 'products/',
            {
                method: 'GET',
            },
        );
        const resData = await res.json()
        data = resData
        resData.products.forEach((pro, i) => {
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
                    </div>
                </div>
            `
        });
        resData.products.forEach((pro, i) => {
            let boxSizeProduct = document.querySelectorAll(".box_size_product")
            pro.list_size.forEach((lsSize, index) => {
                boxSizeProduct[i].innerHTML += `
                <button onclick="AddCart('${pro._id}','${lsSize.size}')">${lsSize.size.toLocaleUpperCase()}</button>
            `
            });
        })
        SearchProduct()

    } catch (err) {
        console.log(err.message);
    }
}

ProductsInCategory = async (id_category) => {
    var show = document.getElementById("box_new_products");
    show.innerHTML = ''
    // try {
    const res = await fetch(server + 'categories/products/' + id_category,
        {
            method: 'GET',
        },
    );
    const resData = await res.json()
    var result_show = document.getElementById("result_show");
    // console.log(resData);
    result_show.innerHTML = `${resData[0].id_category.name_category}`
    resData.forEach((pro, i) => {
        let discount = pro.discount / 100 || 0
        show.innerHTML += `
                <div class="product d_flex col_3">
                    <div class="box_img">
                        <div class="img_product">
                            <img onclick="InfoProductFromNav('${pro._id}')" src="${server}${pro.productImage}" alt="">
                            <img onclick="InfoProductFromNav('${pro._id}')" src="${server}${pro.productImageSub}" alt="">
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
                    </div>
                </div>
            `
    });
    resData.forEach((pro, i) => {
        let boxSizeProduct = document.querySelectorAll(".box_size_product")
        pro.sizeList.forEach((lsSize, index) => {
            boxSizeProduct[i].innerHTML += `
                <button onclick="AddCart('${pro._id}','${lsSize.size}')">${lsSize.size.toLocaleUpperCase()}</button>
            `
        });
    })

    // } catch (err) {
    //     console.log(err.message);
    // }
}

SearchProduct = () => {
    const searchProduct = urlParams.get('search')

    if (searchProduct) {
        var result = 0

        controlData = data.products.filter(m => {
            return m.name_product.toLowerCase().includes(searchProduct.toLowerCase().trim())
        })


        if (controlData.length > 0) {
            result = controlData.length

            var show = document.getElementById("box_new_products");
            show.innerHTML = ''
            controlData.forEach((pro, i) => {
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
                            </div>
                        </div>
                    `
            });
            controlData.forEach((pro, i) => {
                let boxSizeProduct = document.querySelectorAll(".box_size_product")
                pro.list_size.forEach((lsSize, index) => {
                    boxSizeProduct[i].innerHTML += `
                        <button onclick="AddCart('${pro._id}','${lsSize.size}')">${lsSize.size.toLocaleUpperCase()}</button>
                    `
                });
            })
        }
        var result_show = document.getElementById("result_show");
        result ?
            result_show.innerHTML = `Có ${result} sản phẩm cho từ khóa: ${searchProduct}`
            :
            result_show.innerHTML = `Không có sản phẩm cho từ khóa: ${searchProduct}`

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

InfoProductFromNav = (id_product) => {
    window.location.href = `./info_product.html?id_product=${id_product}`
}

ConvertNum = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}