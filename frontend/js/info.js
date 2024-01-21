const server = "http://127.0.0.1:3000/"
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let listImg = []
Render = async () => {
    const idProduct = urlParams.get('id_product')
    var show = document.getElementById("side_show_product");
    // try {
    const res = await fetch(server + 'products/' + idProduct,
        {
            method: 'GET',
        },
    );
    const resData = await res.json()
    let discount = resData.product.discount / 100 || 0
    show.innerHTML = `
            <p class="dir_path">Trang chủ / ${resData.product.name_category}</p>
            <div class="side_info_product d_flex col_12">
                <div class="side_img_product col_8">
                    <div class="control_img_line" id="control_img_line">
                       
                    </div>
                    <img width="100%" id="img_main_show" src="${server}${resData.product.main_img_product}" alt="">
                    <div class="control_img_box" id="control_img_box">
                        
                    </div>
                </div>
                <div class="side_detail_product col_4">
                    <h1>${resData.product.name_product}</h1>
                    <p>${resData.product.describe}</p>
                    <p class="m_5"><span class="price_product">${ConvertNum(resData.product.price - (resData.product.price * discount))}đ</span> <del>${ConvertNum(resData.product.price)}đ</del></p>
                    <p class="m_5">Kích thước Áo:</p>
                    <div id="box_size_product" class="box_size_product">
                        
                    </div>
                    <div class="box_add_cart d_flex">
                        <div class="amount_product">
                            <button onclick="ControlAmountProduct(-1)" class="reduce">-</button>
                            <p class="amount" id="amount">1</p>
                            <button onclick="ControlAmountProduct(1)" class="increase">+</button>
                        </div>
                        <button onclick="AddCart('${resData.product._id}')" class="btn_add_cart">Thêm vào giỏ hàng</button>
                    </div>

                    <div class="detail_product">
                        <h3>Đặc điểm nổi bật</h3>
                        <ul>
                            <li>Xử lí hoàn thiện giúp bề mặt vải ít xù lông, mềm mịn và bền màu hơn.</li>
                            <li>Độ dày vải vừa phải giúp áo tôn dáng.</li>
                            <li>Phù hợp với đi làm, đi chơi.</li>
                            <li>Sản xuất tại Nhà máy Tessellation (TGV), Việt Nam.</li>
                        </ul>
                    </div>
                </div>
            </div>
            `
    const controlImgLine = document.getElementById("control_img_line")
    const controlImgBox = document.getElementById("control_img_box")
    const controlSize = document.getElementById("box_size_product")

    controlImgLine.innerHTML = ''
    controlImgBox.innerHTML = ''
    controlSize.innerHTML = ''

    let countImg = resData.product.list_img.length
    resData.product.list_img.forEach((v, i) => {
        listImg = [...listImg, v.img]
        let activeLine = (i == 0 ? 'class="active_control_img_line"' : "");
        let activeImg = (i == 0 ? 'active_img_control' : "");
        controlImgLine.innerHTML += `
            <b onclick="ChangeImgShow('${i}')" style=" width: ${100 / countImg}%;" ${activeLine}></b>
            `
        controlImgBox.innerHTML += `
                <div onclick="ChangeImgShow('${i}')" class="img_control ${activeImg}">
                   <img src="${server}${v.img}" alt="">
                </div>
            `
    });

    let count = 0
    resData.product.list_size.forEach((v, i) => {
        if (v.inStock > 0) {
            let activeLine = (count == 0 ? 'class="active_size_btn"' : "");
            controlSize.innerHTML += `
                <button onclick="ChooseSizeProduct('${i}')" ${activeLine}>${v.size.toLocaleUpperCase()}</button>
                `
            count++
        }
    });

    // } catch (err) {
    //     console.log(err.message);
    // }
}

// `<h3>Chi tiết sản phẩm</h3>
// <img src="../images/shop/info_polo_content/mceclip0_66.jpg" alt="">
// <img src="../images/shop/info_polo_content/mceclip1_47.jpg" alt="">
// <img src="../images/shop/info_polo_content/mceclip2_41.jpg" alt="">`


AddCart = (id) => {
    let size = document.querySelectorAll('.box_size_product button.active_size_btn')[0].innerHTML.toLocaleLowerCase()
    let amount = Number(document.getElementById("amount").innerHTML);
    let sessionData = sessionStorage.getItem('cartProduct');
    let cartProduct = {};

    if (sessionData) {
        cartProduct = JSON.parse(sessionData);
    }

    if (cartProduct[id]) {
        cartProduct[id].forEach((pro, i) => {
            if (pro.size == size) {
                pro.quantity += amount;
            } else {
                cartProduct[id] = [...cartProduct[id], { id: id, size: size, quantity: amount }];
            }
        });
    } else {
        cartProduct[id] = [{ id: id, size: size, quantity: amount }];
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


ConvertNum = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

ChangeImgShow = (index) => {
    const lineControlImgProduct = document.querySelectorAll('.control_img_line b');
    const imgControlImgProduct = document.querySelectorAll('.control_img_box .img_control');
    const imgMainShow = document.getElementById('img_main_show');


    let checkLine = document.querySelectorAll('.control_img_line b.active_control_img_line')
    let checkImg = document.querySelectorAll('.control_img_box .img_control.active_img_control')
    if (checkLine.length > 0) {
        checkLine.forEach((ele, i) => {
            ele.classList.remove('active_control_img_line')
        })
    }
    if (checkImg.length > 0) {
        checkImg.forEach((ele, i) => {
            ele.classList.remove('active_img_control')
        })
    }
    lineControlImgProduct[index].classList.add('active_control_img_line')
    imgControlImgProduct[index].classList.add('active_img_control')
    imgMainShow.src = `${server}${listImg[index]}`
}

ChooseSizeProduct = (index) => {
    const sizeProduct = document.querySelectorAll('.box_size_product button');


    let check = document.querySelectorAll('.box_size_product button.active_size_btn')
    if (check.length > 0) {
        check.forEach((ele, i) => {
            ele.classList.remove('active_size_btn')
        })
    }
    sizeProduct[index].classList.add('active_size_btn')
    console.log(2);
}
ControlAmountProduct = (control) => {
    let getAmount = document.getElementById("amount")
    let amount = Number(getAmount.innerHTML)
    if (amount != NaN && amount >= 1 && amount <= 20) {
        amount += control
    }
    if (amount != NaN && amount == 0) {
        amount = 1
    }
    getAmount.innerHTML = amount
}