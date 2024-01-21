SignUpUser = async () => {
    const email = document.getElementById("email")
    const passwordInput = document.getElementsByClassName("password_ipt")
    if (passwordInput[0].value !== passwordInput[1].value) {
        return document.getElementById("err").innerHTML = "*Mật khẩu không trùng nhau!"
    }
    data = {
        email: email.value,
        password: passwordInput[0].value
    }
    try {
        const res = await fetch('http://127.0.0.1:3000/user/signup',
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
                <a href="./sign_in.html"><button class="__confirm">Quay lai đăng nhập</button></a>
            </div>`
        ShowPopUp()
        res.status == 201 && setTimeout(() => {
            window.location.href = "./sign_in.html"
        }, 500);
        console.log(resData);
    } catch (err) {
        console.log(err.message);
    }
}