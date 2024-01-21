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
        const res = await fetch('http://127.0.0.1:3000/user/check-admin',
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
        ShowListCategory()
    } catch (err) {
        window.location.href = "../../index.html"
        console.log(err.message);
    }
}
ShowListCategory = async () => {
    const show = document.getElementById("box_show_side")
    show.innerHTML = `
    <h1>Danh mục</h1>

            <div class="box_table_statistical">
                <h2>Danh sách danh mục</h2>
                <table class="table_statistical">
                    <thead>
                        <tr>
                            <td class="col_4">Mã danh mục</td>
                            <td class="col_3">Tên danh mục</td>
                            <td class="col_3">Số lượng sản phẩm</td>
                            <td class="col_2">Thao tác</td>
                        </tr>
                    </thead>
                    <tbody id="tbody_table_statistical">
                        
                    </tbody>
                </table>
            </div>
            <div class="btn_add">
                <button onclick="ShowControlCategory('add')">Thêm mới</button>
            </div>
    `
    try {
        const infoCategory = document.getElementById("tbody_table_statistical")
        const res = await fetch('http://127.0.0.1:3000/categories',
            {
                method: 'GET',
            },
        );
        const resDataCategory = await res.json();
        infoCategory.innerHTML = '';

        resDataCategory.categories.forEach(async (info, i) => {
            let amount_product;
            try {
                const resProduct = await fetch('http://127.0.0.1:3000/categories/products/' + info.id_category,
                    {
                        method: 'GET',
                    },
                );
                const resProductInCategory = await resProduct.json();
                amount_product = resProductInCategory.length
                if (resProduct.status == 404) {
                    amount_product = 0
                }

            } catch (err) {
                // console.log(err.message);
                amount_product = 0
            }
            infoCategory.innerHTML += `
            <tr>
                <td class="col_4">${info.id_category}</td>
                <td class="col_3">${info.name_category}</td>
                <td class="col_3">${amount_product}</td>
                <td class="col_2">
                    <button class="btn" onclick="ShowControlCategory('update','${info.id_category}','${info.name_category}')">
                        Sửa
                    </button>
                    / 
                    <button class="btn" onclick=" ConfirmDelete('${info.id_category}','${info.name_category}')">
                        Xóa
                    </button>
                </td>
            </tr>
            `
        });

    } catch (err) {
        console.log(err.message);
    }
}

ShowControlCategory = (control, id_category, name) => {
    const show = document.getElementById("box_show_side")
    switch (control) {
        case "add":
            show.innerHTML = `
            <div class="form">
                <h2>Thêm mới danh mục</h2>
                <input id="name_category" type="text" placeholder="Tên danh mục mới" required/>
                <div>
                    <button class="btn" onclick="AddCategory()">Thêm</button>
                    <button class="btn" onclick="window.location.href = './category.html'">Danh sách danh mục</button>
                </div>
            </div>
            `
            break;
        case "update":
            show.innerHTML = `
            <div class="form">
                <h2>Cập nhật danh mục danh mục</h2>
                <input id="name_category" type="text" value="${name}" placeholder="Tên danh mục" required/>
                <div>
                    <button class="btn" onclick="UpdateCategory('${id_category}')">Sửa</button>
                    <button class="btn" onclick="window.location.href = './category.html'">Danh sách danh mục</button>
                </div>
            </div>
            `
            break;

        default:
            break;
    }
}

AddCategory = async () => {
    var name_category = document.getElementById("name_category")
    data = {
        name_category: name_category.value
    }
    let token = getCookie("token")
    try {
        const res = await fetch('http://127.0.0.1:3000/categories/',
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,

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
            <a href="./category.html"><button class="__confirm">Đóng</button></a>
            </div>`
        ShowPopUp()
        res.status == 201 && setTimeout(() => {
            window.location.href = "./category.html"
        }, 500);
        console.log(resData);
    } catch (err) {
        console.log(err.message);
    }
}
UpdateCategory = async (id_category) => {
    var name_category = document.getElementById("name_category")
    data = {
        name_category: name_category.value
    }

    let token = getCookie("token")
    try {
        const res = await fetch('http://127.0.0.1:3000/categories/' + id_category,
            {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,

                },
                body: JSON.stringify(data),
            },
        );
        const resData = await res.json();
        res.status == 200 ? color = "green" : color = "red"
        const content_popup = document.getElementById("content_popup")
        content_popup.innerHTML = `
        <h2 style="color: ${color};">${resData.message}</h2>
            <div>
            <a href="./category.html"><button class="__confirm">Đóng</button></a>
            </div>`
        ShowPopUp()
        res.status == 200 && setTimeout(() => {
            window.location.href = "./category.html"
        }, 500);

    } catch (err) {
        console.log(err.message);
    }
}

ConfirmDelete = (id_category, name) => {
    const content_popup = document.getElementById("content_popup")
    content_popup.innerHTML = `
        <h2 style="color: red;">Xác nhận xóa danh mục ${name}</h2>
            <div>
                <a href="./category.html"><button class="__confirm">Đóng</button></a>
                <button class="__confirm" onclick="DeleteCategory('${id_category}')">Xác nhận</button>
            </div>`
    ShowPopUp()
}

DeleteCategory = async (id_category) => {
    console.log(id_category);
    let token = getCookie("token")
    try {
        const res = await fetch('http://127.0.0.1:3000/categories/' + id_category,
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
            <a href="./category.html"><button class="__confirm">Đóng</button></a>
            </div>`
        ShowPopUp()
        res.status == 200 && setTimeout(() => {
            window.location.href = "./category.html"
        }, 500);
        console.log(resData);
    } catch (err) {
        console.log(err.message);
    }
}