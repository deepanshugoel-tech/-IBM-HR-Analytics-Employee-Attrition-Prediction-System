/* Session guard shared by the HR dashboard and the Employee page.
   Usage: <script src="auth.js" data-role="HR"></script>  (place in <head>) */
(function () {
    var requiredRole = document.currentScript.getAttribute("data-role");
    var nativeFetch = window.fetch.bind(window);

    // Hide the page until the server confirms the session.
    var gate = document.createElement("style");
    gate.id = "auth-gate";
    gate.textContent = "html{visibility:hidden}";
    document.head.appendChild(gate);

    // If the session expires, any API call that answers 401 sends the user to login.
    window.fetch = function (input, init) {
        return nativeFetch(input, init).then(function (res) {
            if (res.status === 401) { window.location.replace("login.html"); }
            return res;
        });
    };

    function showName() {
        var u = window.currentUser;
        if (!u) { return; }
        var el = document.getElementById(u.role === "HR" ? "hrName" : "employeeName");
        if (el) { el.textContent = u.name; }
    }

    window.authReady = nativeFetch("/auth/me", { credentials: "same-origin" })
        .then(function (res) {
            if (!res.ok) { throw new Error("not logged in"); }
            return res.json();
        })
        .then(function (user) {
            if (requiredRole && user.role !== requiredRole) {
                window.location.replace(user.role === "HR" ? "index.html" : "employee.html");
                return;
            }
            window.currentUser = user;
            var g = document.getElementById("auth-gate");
            if (g) { g.remove(); }
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", showName);
            } else { showName(); }
        })
        .catch(function () { window.location.replace("login.html"); });

    window.logout = function () {
        nativeFetch("/auth/logout", { method: "POST", credentials: "same-origin" })
            .finally(function () { window.location.replace("login.html"); });
    };

    // Back button after logout must not show a cached private page.
    window.addEventListener("pageshow", function (e) { if (e.persisted) { window.location.reload(); } });
})();
