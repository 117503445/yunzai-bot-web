// ==UserScript==
// @name         miyoushe token sender
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  send miyoushe cookies to yunzai-web
// @author       117503445
// @match        https://www.miyoushe.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @license      GNU/GPL V3
// ==/UserScript==

(function () {
    'use strict';

    const host = "https://example.yunzai-web.com"

    // Basic Auth 的用户名 / 密码, 为空则不使用 Basic Auth
    const username = "user1"
    const password = "pass1"

    var button = document.createElement("button");
    button.innerHTML = "Send Cookie To Yunzai-Web";
    button.className = "my-button";
    var style = document.createAttribute("style");
    button.setAttributeNode(style);
    button.style.position = "fixed";
    button.style.top = "80px";
    button.style.right = "20px";

    document.body.appendChild(button);

    function log(msg) {
        console.log(`[miyoushe token] ${msg}`)
    }

    function error_alert(msg) {
        msg = `[miyoushe token] meeting error: ${msg}`
        console.error(msg);
        alert(msg);
    }

    button.addEventListener("click", function () {
        GM_cookie.list({}, function (cookies, error) {
            if (!error) {
                let cookieStr = "";

                log(`get cookies: ${JSON.stringify(cookies)}`)
                cookies.forEach(cookie => {
                    cookieStr += `${cookie.name}=${cookie.value}; `;
                });
                log(`cookieMsg: ${cookieStr}`)

                var data = {
                    // prompt: document.cookie
                    prompt: cookieStr
                };

                let headers = {
                    'Content-Type': 'application/json',
                }
                if (username) {
                    let authorization = btoa(`${username}:${password}`)
                    headers.Authorization = `Basic ${authorization}`
                }

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${host}/api/chat-process`,
                    headers: headers,
                    data: JSON.stringify(data),
                    onload(xhr) {
                        log(xhr.responseText)
                        alert(`[miyoushe token] Yunzai-Web 返回: \n ${xhr.responseText}`)
                    }
                });
            } else {
                error_alert(error);
            }
        });
    });
})();