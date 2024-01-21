function getCookie(name) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Check if the cookie starts with the provided name
        if (cookie.indexOf(name + '=') === 0) {
            // Return the value of the cookie
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    // If the cookie is not found, return null
    return null;
}
function setCookie(name, value, daysToExpire) {
    var cookie = name + "=" + encodeURIComponent(value);
    if (daysToExpire) {
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + daysToExpire);
        cookie += "; expires=" + expirationDate.toUTCString();
    }
    // Set the path to "/"
    cookie += "; path=/";
    document.cookie = cookie;
}
window.removeCookie = function (name) {
    // Set the cookie's expiration date to a past date
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

var id_user;
Render = async () => {
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
        var showUser = document.getElementById("info_user_side");
        showUser.innerHTML = `
        <div class="control_user_info col_4">
            <h2>Xin chào, ${resData.info.full_name ? resData.info.full_name : resData.info.email.slice(0, resData.info.email.indexOf("@"))}</h2>
            <button onclick="ShowControlUser(0, '${id_user}')" class="btn_control_user btn_control_user_active">Thông tin tài khoản</button>
            <button onclick="ShowControlUser(1, '${id_user}')" class="btn_control_user">Đơn hàng của bạn</button>
            <div id="control_user_info" class="col_12">
            </div>
        <div class="logout">
            <button onclick="Logout()" class="btn_logout">Đăng xuất</button>
        </div>
        </div>
        <div class="box_show_info_user col_8" id="box_show_info_user">
            
        </div>
        `
        if (resData.info.role === 2) {
            document.getElementById("control_user_info").innerHTML += `
        <button onclick="ShowControlUser(2, '${id_user}')" class="btn_control_user">Quản trị Website</button>
        `
        }
        ShowControlUser(0, `${id_user}`)
    } catch (err) {
        console.log(err.message);
    }
}
Logout = async () => {
    var token = getCookie("token")
    const res = await fetch('http://127.0.0.1:3000/user/logout',
        {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + token,
            },
        },
    );
    removeCookie("token")
    const content_popup = document.getElementById("content_popup")
    content_popup.innerHTML = `
        <h2 style="color: green;">Bạn đã đăng xuất</h2>
            <div>
                <a href="./sign_in.html"><button class="__confirm">Đóng</button></a>
            </div>`
    ShowPopUp()
    setTimeout(() => {

        window.location.reload()
    }, 2000);
}
UpdateUser = async (id_user) => {
    var token = getCookie("token")
    const fullName = document.getElementById("full_name")
    const email = document.getElementById("email")
    const phone = document.getElementById("phone")
    const location = document.getElementById("location")
    var data = {
        full_name: fullName.value,
        email: email.value,
        phone: phone.value,
        location: location.value
    }
    try {
        const res = await fetch('http://127.0.0.1:3000/user/update/' + id_user,
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
                <a href="./user.html"><button class="__confirm">Đóng</button></a>
            </div>`
        ShowPopUp()
        console.log(resData);
    } catch (err) {
        console.log(err.message);
    }
}

ShowControlUser = async (i, id_user) => {
    const btnControlUser = document.querySelectorAll(".control_user_info .btn_control_user")
    let check = document.querySelectorAll(".control_user_info .btn_control_user.btn_control_user_active")
    let boxShow = document.getElementById("box_show_info_user")
    check.forEach((ele, i) => {
        ele.classList.remove("btn_control_user_active")
    });
    btnControlUser[i].classList.add("btn_control_user_active")
    switch (i) {
        case 0:
            try {
                const res = await fetch('http://127.0.0.1:3000/user/' + id_user,
                    {
                        method: 'GET',
                    },
                );
                const resData = await res.json()

                boxShow.innerHTML = `
                <h2>Thông tin tài khoản</h2>
                <div class="info">
                    <label for="full_name">Họ tên</label>
                    <input id="full_name" type="text" value="${resData.info.full_name ? resData.info.full_name : ""}">
                </div>
                <div class="info">
                    <label for="email">Email</label>
                    <input id="email" type="email" value="${resData.info.email ? resData.info.email : ""}">
                </div>
                <div class="info">
                    <label for="phone">Số điện thoại</label>
                    <input id="phone" type="text" value="${resData.info.phone ? resData.info.phone : ""}">
                </div>
                <div class="info">
                    <label for="location">Địa chỉ</label>
                    <input id="location" type="text" value="${resData.info.location ? resData.info.location : ""}">
                </div>
                
                <button onclick="UpdateUser('${id_user}')" class="btn_update_user">Cập nhật thông tin</button>
                `
            } catch (err) {
                console.log(err.message);
            }
            break;
        case 1:
            console.log(id_user);
            boxShow.innerHTML = `
            <h2>Đơn hàng của bạn</h2>
        <table class="table_cart_user">
            <thead>
                <tr>
                    <td class="col_4">Mã đơn</td>
                    <td class="col_4">Ngày mua</td>
                    <td class="col_4">Tổng tiền</td>
                </tr>
            </thead>
            <tbody id="tbody_table_bill">
                
               
            </tbody>
        </table>
        `
            var showBill = document.getElementById("tbody_table_bill")
            try {
                const res = await fetch('http://127.0.0.1:3000/orders/user/' + id_user,
                    {
                        method: 'GET',
                    },
                );
                const resData = await res.json()
                showBill.innerHTML = ''
                resData.order.forEach((info, i) => {
                    let cost = 0
                    info.products.forEach((pro, i2) => {
                        cost += pro.cost* pro.quantity
                    });
                    showBill.innerHTML += `
                    <tr>
                        <td class="col_4">${info._id}</td>
                        <td class="col_4">${CovertTime(Number(info.createdAt)).toUpperCase()}</td>
                        <td class="col_4">${ConvertNum(cost)}đ</td>
                    </tr>
                    `
                });
            } catch (err) {
                console.log(err.message);
            }
            break;
        case 2:
            window.location.href = "/admin/index.html"
            break;
        default:
            break;
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