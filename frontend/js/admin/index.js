const server = "http://127.0.0.1:3000/"

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
        ShowBoxStatistical()

    } catch (err) {
        window.location.href = "../../index.html"
        console.log(err.message);
    }
}
ShowBoxStatistical = async () => {
    let token = getCookie("token")

    const show = document.getElementById("sile_statistical_main")
    show.innerHTML = '';

    const resCate = await fetch('http://127.0.0.1:3000/categories',
        {
            method: 'GET',
        },
    );
    const resDataCategory = await resCate.json();
    show.innerHTML += `
                    <div class="box_statistical col_4">
                        <h2>Danh mục</h2>
                        <p><b>${resDataCategory.count}</b></p>
                    </div>
    `
    const resPro = await fetch('http://127.0.0.1:3000/products',
        {
            method: 'GET',
        },
    );
    const resDataProduct = await resPro.json();
    show.innerHTML += `
                    <div class="box_statistical col_4">
                        <h2>Sản phẩm</h2>
                        <p><b>${resDataProduct.count}</b></p>
                    </div>
    `
    const resBill = await fetch('http://127.0.0.1:3000/orders',
        {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + token,
            },
        },
    );
    const resDataBill = await resBill.json();

    let listProductOrder = {};
    let listStatistical = []
    resDataBill.orders.forEach(order => {
        order.products.forEach((pro, i) => {
            if (listProductOrder[pro.product]) {
                listProductOrder[pro.product].quantity += pro.quantity
            } else {
                listProductOrder[pro.product] = { id: pro.product, quantity: pro.quantity };
            }
        });
    });
    Object.keys(listProductOrder).forEach((key, i) => {
        listStatistical = [...listStatistical, listProductOrder[key]]
    });
    listStatistical.sort(function (a, b) { return b.quantity - a.quantity })
    const showSellingProduct = document.getElementById("tbody_table_statistical_sellproduct")
    showSellingProduct.innerHTML = ''
    listStatistical.forEach(async (pro, i) => {
        if (i < 6) {
            const res = await fetch(server + 'products/' + pro.id,
                {
                    method: 'GET',
                },
            );
            const resData = await res.json()
            let discount = resData.product.discount / 100 || 0
            showSellingProduct.innerHTML += `
                    <tr>
                        <td class="col_3">${resData.product._id}</td>
                        <td class="col_3">${resData.product.name_product}</td>
                        <td class="col_2">${ConvertNum(resData.product.price)}đ</td>
                        <td class="col_2">${ConvertNum(resData.product.price - (resData.product.price * discount))}đ</td>
                        <td class="col_2">${pro.quantity}</td>
                    </tr>
            `
        }
    });

    show.innerHTML += `
                    <div class="box_statistical col_4">
                        <h2>Đơn hàng</h2>
                        <p><b>${resDataBill.count}</b></p>
                    </div>
    `

    const resNewPro = await fetch(server + 'products/new_products/',
        {
            method: 'GET',
        },
    );
    const resDataNewPro = await resNewPro.json()
    const showNewProduct = document.getElementById("tbody_table_statistical_newproduct")
    showNewProduct.innerHTML = ''
    resDataNewPro.products.forEach((pro, i) => {
        let discount = pro.discount / 100 || 0
        showNewProduct.innerHTML += `
                <tr>
                    <td class="col_3">${pro._id}</td>
                    <td class="col_3">${pro.name_product}</td>
                    <td class="col_2">${ConvertNum(pro.price)}đ</td>
                    <td class="col_2">${ConvertNum(pro.price - (pro.price * discount))}đ</td>
                    <td class="col_2">${CovertTime(Number(pro.created_at))}</td>
                </tr>
                `
    });



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