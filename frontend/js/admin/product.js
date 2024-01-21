const server = "http://127.0.0.1:3000/"
var listSize = ['s', 'm', 'l', 'xl', '2xl', '3xl']
var chosenSize = [];

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

Render = async () => {
    let token = getCookie("token")
    if (token == null) {
        return window.location.href = "../../index.html";
    }
    try {
        const res = await fetch(server + 'user/check-admin',
            {
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + token,
                },
            },
        );
        const resData = await res.json();
        res.status == 200 ? color = "green" : color = "red"
        if (res.status != 200) {
            content_popup.innerHTML = `
        <h2 style="color: ${color};">${resData.message}</h2>
            <div>
                <a href="../../index.html"><button class="__confirm">Quay lại trang chủ</button></a>
            </div>`
            ShowPopUp()
        }
        res.status != 200 && setTimeout(() => {
            window.location.href = "../../index.html"
        }, 500);
        RenderListProduct()
    } catch (err) {
        window.location.href = "../../index.html"
        console.log(err.message);
    }
}

RenderListProduct = async () => {
    const show = document.getElementById("box_show_side")
    show.innerHTML = `
    <h1>Sản phẩm</h1>

                <div class="box_table_statistical">
                    <h2>Danh sách sản phẩm</h2>
                    <table class="table_statistical">
                        <thead>
                            <tr>
                                <td class="col_2">Tên danh mục</td>
                                <td class="col_3">Tên sản phẩm</td>
                                <td class="col_1">Giá</td>
                                <td class="col_1">Giảm giá</td>
                                <td class="col_2">Ngày thêm</td>
                                <td class="col_3">Thao tác</td>
                            </tr>
                        </thead>
                        <tbody id="tbody_table_statistical">
                            
                        </tbody>
                    </table>
                </div>
                <div class="btn_add">
                    <button onclick="RenderCreateProductForm()">Thêm mới</button>
                </div>
    `
    try {
        const infoProducts = document.getElementById("tbody_table_statistical")
        const res = await fetch(server + 'products',
            {
                method: 'GET',
            },
        );
        const resDataProducts = await res.json();
        infoProducts.innerHTML = '';

        resDataProducts.products.forEach(async (info, i) => {
            let name_category;
            try {
                const res = await fetch(server + 'categories/' + info.id_category,
                    {
                        method: 'GET',
                    },
                );
                const resNameCategory = await res.json();
                name_category = resNameCategory.category.name_category
                if (res.status == 404) {
                    name_category = "Không có"
                }

            } catch (err) {
                // console.log(err.message);
                name_category = "Lỗi hoặc không có"
            }
            infoProducts.innerHTML += `
            <tr>
                <td class="col_2">${name_category}</td>
                <td class="col_3">${info.name_product}</td>
                <td class="col_1">${info.price}đ</td>
                <td class="col_1">${info.discount}%</td>
                <td class="col_2">${info.created_at ? CovertTime(Number(info.created_at)) : ""}</td>
                <td class="col_3">
                    <button onclick="InfoDetailProduct('${info._id}')" class="btn">
                        Xem chi tiết
                    </button>
                    /
                    <button onclick="RenderUploadProductForm('${info._id}')" class="btn">
                        Sửa
                    </button>
                    /
                    <button onclick="ConfirmDeleteProduct('${info._id}','${info.name_product}')" class="btn">
                        Xóa
                </td>
            </tr>
            `
        });

    } catch (err) {
        console.log(err.message);
    }
}

InfoDetailProduct = async (id_product) => {
    const show = document.getElementById("box_show_side")
    try {
        const res = await fetch(server + 'products/' + id_product,
            {
                method: 'GET',
            },
        );
        const resDataProduct = await res.json();
        show.innerHTML = `
                    <div class="btn_add">
                        <a href="./product.html"><button>Quay lại danh sách</button></a>
                    </div>
                    <div class="detail_info_product">
                        <h2>Chi tiết sản phẩm: ${resDataProduct.product.name_product}</h2>
                        <div class="col_12 d_flex m_5">
                            <div class="box_detail_info col_5">
                                <div>
                                    <h3>Danh mục</h3>
                                    <p>- Mã danh mục: ${resDataProduct.product.id_category}</p>
                                    <p>- Tên danh mục: ${resDataProduct.product.name_category}</p>
                                </div>
                                <div>
                                    <h3>Chi tiết</h3>
                                    <p>- Mã sản phẩm: ${resDataProduct.product._id}</p>
                                    <p>- Tên sản phẩm: ${resDataProduct.product.name_product}</p>
                                    <p>- Giá sản phẩm: ${ConvertNum(resDataProduct.product.price)}đ</p>
                                    <p>- Giảm giá: ${resDataProduct.product.discount}%</p>
                                    <p>- Mô tả ngắn: ${resDataProduct.product.describe ? resDataProduct.product.describe : ""}</p>
                                </div>
                                <div class="info_size_product">
                                    <p>- Các kích cỡ:</p>
                                    <ul id="info_size_product">
                                        
                                    </ul>
                                </div>
                                <p>Ngày thêm: ${resDataProduct.product.created_at ? CovertTime(Number(resDataProduct.product.created_at)) : ""}</p>
                                <div class="btn_add m_5">
                                    <button onclick="RenderUploadProductForm('${resDataProduct.product._id}')">Chỉnh sửa thông tin</button>
                                </div>
                            </div>
                            <div class="col_7 d_flex flex_column">
                                <div style="max-width: 650px;" class="d_flex ">
                                    <div class="box_img_product">
                                        <p>Ảnh chính: ${resDataProduct.product.main_img_product ? "" : "Chưa thêm"}</p>
                                        <img src="${server}${resDataProduct.product.main_img_product}" alt="">
                                    </div>
                                    <div class="box_img_product">
                                        <p>Ảnh phụ: ${resDataProduct.product.main_img_product ? "" : "Chưa thêm"}</p>
                                        <img src="${server}${resDataProduct.product.main_img_product}" alt="">
    
                                    </div>
                                </div>
                                <div style="max-width: 650px;" class="box_list_img" style="margin-top: 15px;">
                                    <h3 style="font-size: 24px;">Danh sách ảnh${resDataProduct.product.list_img.length == 0 ? ": Chưa bổ sung" : ""}</h3>
                                    <div id="list_img_product" class="side_list_img_product d_flex col_12">
                                        
                                      
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `

        const listImgProduct = document.getElementById("list_img_product")
        const infoSizeProduct = document.getElementById("info_size_product")
        resDataProduct.product.list_size.length > 0 ?
            resDataProduct.product.list_size.forEach((v, k) => {
                infoSizeProduct.innerHTML += `
        <li>Size ${v.size.toLocaleUpperCase()}: số lượng ${v.inStock} </li>
        `
            })
            : infoSizeProduct.innerHTML = `
        <li>Chưa bổ sung </li>
        `
        resDataProduct.product.list_img.length > 0 &&
            resDataProduct.product.list_img.forEach((v, k) => {
                listImgProduct.innerHTML += `
            <div  class="list_img_product">
                <img src="${server}${v.img}" alt="">
            </div>
        `
            })
    } catch (err) {
        console.log(err.message);
    }

}


RenderCreateProductForm = async () => {
    chosenSize = [];
    const show = document.getElementById("box_show_side")
    show.innerHTML = `
    <div class="btn_add">
        <a href="./product.html"><button>Quay lại danh sách</button></a>
    </div>
    <div class="form col_12">
        <h1>Thêm mới sản phẩm</h1>
        <div class="d_flex col_12 justify_between">
            <div class="box_ipt d_flex flex_column col_4">
                <label>Danh mục sản phẩm</label>
                <select class="seletect_form col_12" id="id_category">
                    
                </select>
            </div>
            <div class="box_ipt col_8 d_flex flex_column">
                <label for="">Tên sản phẩm</label>
                <input class="ipt" type="text" id="name_product" placeholder="Tên sản phẩm" required>
            </div>
        </div>
        <div class="d_flex col_12 justify_between">
            <div class="box_ipt col_3 d_flex flex_column">
                <label for="">Giá sản phẩm (đ)</label>
                <input class="ipt" type="number" id="price" placeholder="Giá sản phẩm" required>
            </div>
            <div class="box_ipt col_3 d_flex flex_column">
                <label for="">Giảm giá sản phẩm (%)</label>
                <input class="ipt" type="number" min="0" max="40" id="discount"
                    placeholder="Giảm giá sản phẩm">
            </div>
            <div class="box_ipt col_6 d_flex flex_column">
                <label for="">Mô tả sản phẩm</label>
                <input class="ipt" type="text" id="describe" placeholder="Mô tả sản phẩm">
            </div>
        </div>
        <div style="align-items: center;" class="d_flex col_12 flex_column justify_between m_5">
            <h3 style="margin-left: 10px;">Nhập kích thước sản phẩm</h3>
            <div id="show_box_side" style="flex-wrap: wrap; max-width: 1000px; justify-content: center;"
                class="d_flex col_12 m_5">
            </div>
        </div>
        <div class="d_flex col_12 justify_between m_5">
            <div class="box_ipt col_4 d_flex flex_column">
                <label for="">Ảnh chính</label>
                <input class="ipt_file ipt" type="file" id="mainImageInput" />
            </div>
            <div class="box_ipt col_4 d_flex flex_column">
                <label for="">Ảnh phụ</label>
                <input class="ipt_file ipt" type="file" id="subImageInput" />
            </div>
            <div class="box_ipt col_4 d_flex flex_column">
                <label for="">Danh sách ảnh sản phẩm</label>
                <input class="ipt ipt_file" type="file" id="listImageInput"  multiple />
            </div>
        </div>
        <div style="margin: 20px 0px 0px 20px;" class="btn_add">
            <button onclick="CreateProduct()">Thêm sản phẩm</button>
        </div>
    </div>
    `
    const showBoxSize = document.getElementById("show_box_side")

    try {
        const listCategory = document.getElementById("id_category")
        const res = await fetch(server + 'categories/',
            {
                method: 'GET',
            },
        );
        const resDataCategory = await res.json();
        resDataCategory.categories.forEach((cate, i) => {
            let select = "";
            i == 0 ? select = "selected" : select = ""
            listCategory.innerHTML += `
            <option value="${cate.id_category}" ${select}>${cate.name_category}</option>
            `
        });
    } catch (err) {
        console.log(err.message);
    }

    listSize.forEach((size, i) => {
        showBoxSize.innerHTML += `
                <div class="box_size d_flex">
                    <button onclick="ChooseSize(${i},'${size}')" class="btn_size">${size.toLocaleUpperCase()}</button>
                    <div class="d_flex flex_column size_input_product justify_between m_5">
                        <label for="${size}">Số lượng:</label>
                        <input class="ipt" type="number" name="" id="${size}" min="1" value="1">
                    </div>
                </div>
        `
    });
}

RenderUploadProductForm = async (id_product) => {
    chosenSize = []
    let listInStockSize = []
    try {
        const res = await fetch(server + 'products/' + id_product,
            {
                method: 'GET',
            },
        );
        const resDataProduct = await res.json();

        const show = document.getElementById("box_show_side")

        show.innerHTML = `
            <div class="btn_add">
                <a href="./product.html"><button>Quay lại danh sách</button></a>
            </div>
            <div class="form col_12">
                <h1>Cập nhật sản phẩm</h1>
                <div class="d_flex col_12 justify_between">
                    <div class="box_ipt d_flex flex_column col_4">
                        <label>Danh mục sản phẩm</label>
                        <select class="seletect_form col_12" id="id_category">
                        </select>
                    </div>
                    <div class="box_ipt col_8 d_flex flex_column">
                        <label for="">Tên sản phẩm</label>
                        <input class="ipt" type="text" id="name_product" placeholder="Tên sản phẩm" required value="${resDataProduct.product.name_product}">
                    </div>
                </div>
                <div class="d_flex col_12 justify_between">
                    <div class="box_ipt col_3 d_flex flex_column">
                        <label for="">Giá sản phẩm (đ)</label>
                        <input class="ipt" type="number" id="price" placeholder="Giá sản phẩm" required value="${resDataProduct.product.price}">
                    </div>
                    <div class="box_ipt col_3 d_flex flex_column">
                        <label for="">Giảm giá sản phẩm (%)</label>
                        <input class="ipt" type="number" min="0" max="40" id="discount" placeholder="Giảm giá sản phẩm" value="${resDataProduct.product.discount}">
                    </div>
                    <div class="box_ipt col_6 d_flex flex_column">
                        <label for="">Mô tả sản phẩm</label>
                        <input class="ipt" type="text" id="describe" placeholder="Mô tả sản phẩm" value="${resDataProduct.product.describe ? resDataProduct.product.describe : ""}">
                    </div>
                </div>
                <div style="align-items: center;" class="d_flex col_12 flex_column justify_between m_5">
                    <h3 style="margin-left: 10px;">Nhập kích thước sản phẩm</h3>
                    <div id="show_box_side" style="flex-wrap: wrap; max-width: 1000px; justify-content: center;"
                        class="d_flex col_12 m_5">
                    </div>
                </div>
                <div class="d_flex col_12 justify_between m_5">
                    <div class="box_ipt col_4 d_flex flex_column">
                        <label for="">Ảnh chính</label>
                        <input class="ipt_file ipt" type="file" id="mainImageInput" />
                    </div>
                    <div class="box_ipt col_4 d_flex flex_column">
                        <label for="">Ảnh phụ</label>
                        <input class="ipt_file ipt" type="file" id="subImageInput" />
                    </div>
                    <div class="box_ipt col_4 d_flex flex_column">
                        <label for="">Danh sách ảnh sản phẩm</label>
                        <input class="ipt ipt_file" type="file" id="listImageInput" multiple />
                    </div>
                </div>
                <div style="margin: 20px 0px 0px 20px;" class="btn_add">
                    <button onclick="UpdateProduct('${resDataProduct.product._id}')">Cập nhật sản phẩm</button>
                </div>
            </div>
        `
        const showBoxSize = document.getElementById("show_box_side")

        try {
            const listCategory = document.getElementById("id_category")
            const res = await fetch(server + 'categories/',
                {
                    method: 'GET',
                },
            );
            const resDataCategory = await res.json();
            resDataCategory.categories.forEach((cate, i) => {
                let select = "";
                resDataProduct.product.id_category == cate.id_category ? select = "selected" : select = ""
                listCategory.innerHTML += `
                <option value="${cate.id_category}" ${select}>${cate.name_category}</option>
                `
            });
        } catch (err) {
            console.log(err.message);
        }

        listSize.forEach((size, i) => {
            showBoxSize.innerHTML += `
                    <div class="box_size d_flex">
                        <button onclick="ChooseSize(${i},'${size}')" class="btn_size">${size.toLocaleUpperCase()}</button>
                        <div class="d_flex flex_column size_input_product justify_between m_5">
                            <label for="${size}">Số lượng:</label>
                            <input class="ipt" type="number" name="" id="${size}" min="1" value="1">
                        </div>
                    </div>
            `
        });


        if (resDataProduct.product.list_size.length > 0) {

            resDataProduct.product.list_size.forEach((v, k) => {
                chosenSize = [...chosenSize, v.size.toLocaleLowerCase()];
                listInStockSize = [...listInStockSize, v.inStock]
            })
        }

        const btnSize = document.querySelectorAll(".btn_size")
        const sizeInputProduct = document.querySelectorAll(".size_input_product")
        chosenSize.forEach((size, i) => {
            btnSize[listSize.indexOf(size)].classList.add("active_box_size")
            sizeInputProduct[listSize.indexOf(size)].classList.add("active_size_input_product")
            document.getElementById(`${size}`).value = listInStockSize[i]
        });
    } catch (err) {
        console.log(err.message);
    }

}





CreateProduct = async () => {
    const formData = new FormData();
    let idCategory = document.getElementById('id_category')
    let nameProduct = document.getElementById('name_product')
    let price = document.getElementById('price')
    let discount = document.getElementById('discount')
    let describe = document.getElementById('describe')


    chosenSize.forEach((size, i) => {
        formData.append('sizeList', JSON.stringify({
            size: size,
            inStock: document.getElementById(`${size}`).value
        }));
    });

    formData.append('id_category', idCategory.value);
    formData.append('name_product', nameProduct.value);
    formData.append('price', price.value);
    formData.append('discount', discount.value);
    formData.append('describe', describe.value);

    document.querySelectorAll('#mainImageInput').forEach(input => {
        Array.from(input.files).forEach(file => {
            formData.append('productImage', file);
        });
    });

    document.querySelectorAll('#subImageInput').forEach(input => {
        Array.from(input.files).forEach(file => {
            formData.append('productImageSub', file);
        });
    });

    document.querySelectorAll('#listImageInput').forEach(input => {
        Array.from(input.files).forEach(file => {
            formData.append('listImgProduct', file);
        });
    });
    let token = getCookie("token")
    try {
        const res = await fetch(server + 'products/',
            {
                method: 'POST',
                headers: {
                    "Authorization": "Bearer " + token,
                },
                body: formData,
            },
        );
        const resData = await res.json();
        res.status == 201 ? color = "green" : color = "red"
        const content_popup = document.getElementById("content_popup")
        content_popup.innerHTML = `
        <h2 style="color: ${color};">${resData.message}</h2>
            <div>
            <a href="./product.html"><button class="__confirm">Đóng</button></a>
            </div>`
        ShowPopUp()
        // res.status == 201 && setTimeout(() => {
        //     window.location.href = "./product.html"
        // }, 500);
    } catch (err) {
        console.log(err.message);
    }

}

UpdateProduct = async (id_product) => {
    const formData = new FormData();
    let idCategory = document.getElementById('id_category')
    let nameProduct = document.getElementById('name_product')
    let price = document.getElementById('price')
    let discount = document.getElementById('discount')
    let describe = document.getElementById('describe')


    chosenSize.forEach((size, i) => {
        formData.append('sizeList', JSON.stringify({
            size: size,
            inStock: document.getElementById(`${size}`).value
        }));
    });

    formData.append('id_category', idCategory.value);
    formData.append('name_product', nameProduct.value);
    formData.append('price', price.value);
    formData.append('discount', discount.value);
    formData.append('describe', describe.value);

    document.querySelectorAll('#mainImageInput').forEach(input => {
        Array.from(input.files).forEach(file => {
            formData.append('productImage', file);
        });
    });

    document.querySelectorAll('#subImageInput').forEach(input => {
        Array.from(input.files).forEach(file => {
            formData.append('productImageSub', file);
        });
    });

    document.querySelectorAll('#listImageInput').forEach(input => {
        Array.from(input.files).forEach(file => {
            formData.append('listImgProduct', file);
        });
    });
    let token = getCookie("token")
    try {
        const res = await fetch(server + 'products/' + id_product,
            {
                method: 'PATCH',
                headers: {
                    "Authorization": "Bearer " + token,
                },
                body: formData,
            },
        );
        const resData = await res.json();
        res.status == 200 ? color = "green" : color = "red"
        const content_popup = document.getElementById("content_popup")
        content_popup.innerHTML = `
        <h2 style="color: ${color};">${resData.message}</h2>
            <div>
            <a href="./product.html"><button class="__confirm">Đóng</button></a>
            </div>`
        ShowPopUp()
        console.log(resData);
        res.status == 200 && setTimeout(() => {
            window.location.href = "./product.html"
        }, 500);
    } catch (err) {
        console.log(err.message);
    }

}


ConfirmDeleteProduct = (id_product, name) => {
    const content_popup = document.getElementById("content_popup")
    content_popup.innerHTML = `
        <h2 style="color: red;">Xác nhận xóa sản phẩm ${name}</h2>
            <div>
                <a href="./product.html"><button class="__confirm">Đóng</button></a>
                <button class="__confirm" onclick="DeleteProduct('${id_product}')">Xác nhận</button>
            </div>`
    ShowPopUp()
}

DeleteProduct = async (id_product) => {
    console.log(id_product);
    let token = getCookie("token")
    try {
        const res = await fetch(server + 'products/' + id_product,
            {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                }
            },
        );
        const resData = await res.json();
        res.status == 200 ? color = "green" : color = "red"
        const content_popup = document.getElementById("content_popup")
        content_popup.innerHTML = `
        <h2 style="color: ${color};">${resData.message}</h2>
            <div>
            <a href="./product.html"><button class="__confirm">Đóng</button></a>
            </div>`
        ShowPopUp()
        res.status == 200 && setTimeout(() => {
            window.location.href = "./product.html"
        }, 500);
        console.log(resData);
    } catch (err) {
        console.log(err.message);
    }
}








CovertTime = (date) => {
    date = new Date(date)
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let strTime = `${hours}:${minutes}${ampm.toLocaleUpperCase()} ${day}/${month}/${year}`;
    return strTime;

}
ConvertNum = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}