<script>
let linkAPI = "https://taskboard.thechampguess.ru/api/taskboard.php";
export default {
    linkAPI,
    deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },
    getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
            c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    getNowDate() {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth()+1).padStart(2, '0'); // мясяцы начинаются с 0 (0 - январь)
        let yy = String(today.getFullYear()).substring(2, 4);
        return `${dd}.${mm}.${yy}`;
    },
    getNowTime() {
        let today = new Date();
        let hh = String(today.getHours()).padStart(2, '0');
        let mm = String(today.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    },
}
</script>