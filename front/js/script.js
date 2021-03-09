const SERVER_URL = "http://192.168.1.7:5002/";
$(function () {
    const urlParams = new URLSearchParams(window.location.search);
    let userIdValue = $('#userId').val();
    if(typeof userId !== "undefined" && userIdValue !== "")
        localStorage.setItem('userId', userIdValue);
    if(typeof userId !== "undefined" && userIdValue === ""){
        $.get(SERVER_URL+'admin/refresh?token='+localStorage.getItem('userId'))
            .done(r=>{
                $('#nameHolder').text(r.name);
                $('#usernameHolder').text(r.username);
                $('#name').val(r.name);
                $('#username').val(r.username);
                $('#emailHolder').text(r.email);
                $('#email').val(r.email);
                $('#genderHolder').text(r.gender);
                $('#gender').val(r.gender);
                $('#passwordHolder').text('*'.repeat(r.password.length));
            })
            .fail(()=>{
                localStorage.removeItem('userId');
                window.location.href = '/login';
            });
    }
    if(urlParams.get('error')){
        error($("#username"));
        error($("#password"));
        customAlert("alert-fail", "There is no user with entered data!");
        window.history.pushState(null,null,'/login');
    }
    $('#login').on('click', () => {
        if (!validation()) return false;
        $('#loginForm').submit();
    });
    $('#logout').on('click', logout);
    $('#update').on('click', () => {
        let data = {
            name: $('#name').val(),
            username: $('#username').val(),
            email: $('#email').val(),
            gender: $('#gender').val(),
            token: localStorage.getItem('userId')
        }
        $.ajax({
            url: SERVER_URL + "api/update-info",
            data: JSON.stringify(data),
            method: "POST",
            contentType: "application/json",
            success: result => {
                if (result.status === 200) {
                    localStorage.setItem('userId', result.token);
                    setTimeout(()=>window.location.href = '/admin',1000);
                }
                else
                    window.location.href = result.url;
            },
            error: err => {
                alert('somethings wrong, check server');
            }
        });
    });
    $('#updatePassword').on('click', ()=>{
        let oldPassword = $('#oldPassword').val();
        let newPassword = $('#newPassword').val();
        let reNewPassword = $('#reNewPassword').val();
        let token = localStorage.getItem('userId');
        if(newPassword !== reNewPassword)
            return alert("new password and it's repeat is not match");
        $.ajax({
            url: SERVER_URL+"api/update-password",
            data: JSON.stringify({oldPassword, newPassword, reNewPassword, token}),
            method: "POST",
            contentType: "application/json",
            success: result => {
                if(result.status === 200){
                    localStorage.setItem('userId', result.token);
                    setTimeout(logout,1000);
                }
                else
                    alert(result.message);
            },
            error: err => {
                alert('somethings wrong, check server');
            }
        });
    });
    let selectedGender = $('#selectedGender').val();
    $('#gender').val(selectedGender ? selectedGender : "Gender ...");
});
const validation = () => {
    const username = $('#username');
    const password = $('#password');
    let wrong = false;

    if (!username.val()) {
        error(username, true);
        wrong = true;
    } else normal(username);

    if (!password.val()) {
        error(password, true);
        wrong = true;
    } else normal(password);

    return !wrong;
}

const error = (element, text = false) => {
    $(element).parent().css("border", "2px solid orangered");
    $(element).children('i').css("color", "orangered");
    if (text) {
        $(`div[data-target=${$(element).attr("id")}]`).show();
    }
}
const normal = element => {
    $(element).parent().css("border", "none");
    $(element).children('i').css("color", "white");
    $(`div[data-target=${$(element).attr("id")}]`).hide();
}
const customAlert = (type, text) => {
    let alertContainer = $('.d-flex');
    let notification = $('#notification');
    notification.fadeIn();
    alertContainer.css("display", "flex");
    let icon = type === "alert-fail" ? '<i class="fa fa-times"></i>' : '<i class="fa fa-check"></i>';
    text = `${icon} ${text}`;
    notification.addClass(type).html(text);
    setTimeout(() => {
        notification.fadeOut(() => {
            notification.removeClass(type).html("");
        });
    }, 2000);
}

const checkLogin = () => {
    if (!localStorage.getItem('userId')) window.location.href = "/login";
}
const logout = () => {

    $.ajax({
        url: 'http://192.168.1.7:5002/api/logout',
        method: 'post',
        data: {user: localStorage.getItem('userId')}
    })
        .done(() => {
            localStorage.removeItem('userId');
            window.location.href = "/login";
        });
}