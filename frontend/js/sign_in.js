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

SignInUser = async () => {
    const email = document.getElementById("email")
    const passwordInput = document.getElementsByClassName("password_ipt")
    data = {
        email: email.value,
        password: passwordInput[0].value
    }
    try {
        const res = await fetch('http://127.0.0.1:3000/user/login',
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            },
        );
        const resData = await res.json();
        res.status == 200 ? color = "green" : color = "red"
        const content_popup = document.getElementById("content_popup")

        color == "green" ?
            content_popup.innerHTML = `
        <h2 style="color: ${color};">${resData.message}</h2>
            <div>
                <a href="../index.html"><button class="__confirm">Bắt đầu mua sắm</button></a>
            </div>`:
            content_popup.innerHTML = `
            <h2 style="color: ${color};">${resData.message}</h2>
                <div>
                    <a href="./sign_in.html"><button class="__confirm">Quay lai đăng nhập</button></a>
                </div>`
        ShowPopUp()
        res.status == 200 && setCookie("token", resData.token, 3)
        res.status == 200 && setTimeout(() => {
            window.location.href = "../index.html"

        }, 500);
        console.log(resData);
    } catch (err) {
        console.log(err.message);
    }
}
CheckLogin = async () => {
    let token = getCookie("token")
    if (token == null) {
        return;
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
        const resData = await res.json();
        res.status == 200 ? color = "green" : color = "red"
        if (res.status == 200) {
            content_popup.innerHTML = `
        <h2 style="color: ${color};">${resData.message}</h2>
            <div>
                <a href="../index.html"><button class="__confirm">Bắt đầu mua sắm</button></a>
            </div>`
            ShowPopUp()
        }
        res.status == 200 && setTimeout(() => {
            window.location.href = "../index.html"

        }, 500);

    } catch (err) {
        console.log(err.message);
    }
}