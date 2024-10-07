; /*FB_PKG_DELIM*/

__d("BanzaiAdapter", ["cr:5866"], (function(a, b, c, d, e, f, g) {
    g["default"] = b("cr:5866")
}), 98);
__d("BanzaiConsts", [], (function(a, b, c, d, e, f) {
    a = {
        SEND: "Banzai:SEND",
        OK: "Banzai:OK",
        ERROR: "Banzai:ERROR",
        SHUTDOWN: "Banzai:SHUTDOWN",
        BASIC: "basic",
        VITAL: "vital",
        BASIC_WAIT: 6e4,
        BASIC_WAIT_COMET: 2e3,
        VITAL_WAIT: 1e3,
        BATCH_SIZE_LIMIT: 64e3,
        EXPIRY: 864e5,
        BATCH_TIMEOUT: 1e4,
        LAST_STORAGE_FLUSH: "banzai:last_storage_flush",
        STORAGE_FLUSH_INTERVAL: 12 * 60 * 6e4,
        POST_READY: 0,
        POST_INFLIGHT: 1,
        POST_SENT: 2
    };
    b = a;
    f["default"] = b
}), 66);
__d("BanzaiUtils", ["BanzaiConsts", "FBLogger", "cr:1172", "cr:9985", "cr:9986"], (function(a, b, c, d, e, f) {
    "use strict";
    var g, h = {
        canSend: function(a) {
            return a[2] >= b("cr:9985")() - (g || (g = b("BanzaiConsts"))).EXPIRY
        },
        filterPost: function(a, c, d, e) {
            if (e.overlimit) return !0;
            if (!e.sendMinimumOnePost && a[4] + e.currentSize > (g || (g = b("BanzaiConsts"))).BATCH_SIZE_LIMIT) return !0;
            var f = a.__meta;
            if (f.status != null && f.status >= (g || (g = b("BanzaiConsts"))).POST_SENT || !h.canSend(a)) return !1;
            if (f.status != null && f.status >= (g || (g = b("BanzaiConsts"))).POST_INFLIGHT) return !0;
            var i = f.compress != null ? f.compress : !0,
                j = (f.webSessionId != null ? f.webSessionId : "null") + (f.userID != null ? f.userID : "null") + (f.appID != null ? f.appID : "null") + (i ? "compress" : ""),
                k = e.wadMap.get(j);
            k || (k = {
                app_id: f.appID,
                needs_compression: i,
                posts: [],
                user: f.userID,
                webSessionId: f.webSessionId
            }, e.wadMap.set(j, k), c.push(k));
            f.status = (g || (g = b("BanzaiConsts"))).POST_INFLIGHT;
            Array.isArray(k.posts) ? k.posts.push(a) : b("FBLogger")("banzai").mustfix("Posts were a string instead of array");
            d.push(a);
            e.currentSize += a[4];
            e.currentSize >= (g || (g = b("BanzaiConsts"))).BATCH_SIZE_LIMIT && (e.overlimit = !0);
            return e.keepRetryable && Boolean(f.retry)
        },
        resetPostStatus: function(a) {
            a.__meta.status = (g || (g = b("BanzaiConsts"))).POST_READY
        },
        retryPost: function(a, c, d) {
            var e = a;
            e.__meta.status = (g || (g = b("BanzaiConsts"))).POST_READY;
            e[3] = (e[3] || 0) + 1;
            e.__meta.retry !== !0 && c >= 400 && c < 600 && d.push(a)
        },
        wrapData: function(a, c, d, e, f) {
            d = [a, c, d, 0, (a = f) != null ? a : c ? JSON.stringify(c).length : 0];
            d.__meta = {
                appID: b("cr:9986").getAppID(),
                retry: e === !0,
                status: (g || (g = b("BanzaiConsts"))).POST_READY,
                userID: b("cr:9986").getPossiblyNonFacebookUserID(),
                webSessionId: b("cr:1172").getId()
            };
            return d
        }
    };
    e.exports = h
}), null);
__d("CurrentUser", ["Cookie", "CurrentUserInitialData"], (function(a, b, c, d, e, f) {
    var g, h = {
        getID: function() {
            return (g || (g = b("CurrentUserInitialData"))).USER_ID
        },
        getAccountID: function() {
            return (g || (g = b("CurrentUserInitialData"))).ACCOUNT_ID
        },
        getPossiblyNonFacebookUserID: function() {
            var a;
            return (a = (g || (g = b("CurrentUserInitialData"))).NON_FACEBOOK_USER_ID) != null ? a : this.getID()
        },
        getEIMU: function() {
            var a;
            return (a = (g || (g = b("CurrentUserInitialData"))).IG_USER_EIMU) != null ? a : "0"
        },
        getEmployeeWorkUserID: function() {
            return (g || (g = b("CurrentUserInitialData"))).WORK_USER_ID
        },
        getName: function() {
            return (g || (g = b("CurrentUserInitialData"))).NAME
        },
        getShortName: function() {
            return (g || (g = b("CurrentUserInitialData"))).SHORT_NAME
        },
        getEPOU: function() {
            var a;
            return (a = (g || (g = b("CurrentUserInitialData"))).EPOU_ID) != null ? a : "0"
        },
        getEOCPU: function() {
            var a;
            return (a = (g || (g = b("CurrentUserInitialData"))).EOCPU_ID) != null ? a : "0"
        },
        isLoggedIn: function() {
            return h.getPossiblyNonFacebookUserID() !== "0"
        },
        isLoggedInNow: function() {
            var a;
            if (!h.isLoggedIn()) return !1;
            if ((g || (g = b("CurrentUserInitialData"))).IS_INTERN_SITE) return !0;
            if ((g || (g = b("CurrentUserInitialData"))).IS_ABRA_USER || (g || (g = b("CurrentUserInitialData"))).IS_ENTERPRISE_USER || (g || (g = b("CurrentUserInitialData"))).IS_IMAGINE_USER || (g || (g = b("CurrentUserInitialData"))).IS_INSTAGRAM_USER || (g || (g = b("CurrentUserInitialData"))).IS_META_SPARK_USER || (g || (g = b("CurrentUserInitialData"))).IS_OCULUS_USER || (g || (g = b("CurrentUserInitialData"))).IS_TOGETHER_APP_USER || (g || (g = b("CurrentUserInitialData"))).IS_WORK_MESSENGER_CALL_GUEST_USER || (g || (g = b("CurrentUserInitialData"))).IS_WORK_USER || (g || (g = b("CurrentUserInitialData"))).IS_WORKROOMS_USER || (g || (g = b("CurrentUserInitialData"))).IS_ANONYMOUS_CASTING_USER) return !0;
            if ((g || (g = b("CurrentUserInitialData"))).ORIGINAL_USER_ID != null && (g || (g = b("CurrentUserInitialData"))).ORIGINAL_USER_ID != "") return (g || (g = b("CurrentUserInitialData"))).ORIGINAL_USER_ID === b("Cookie").get("c_user");
            return (g || (g = b("CurrentUserInitialData"))).IS_BUSINESS_DOMAIN === !0 ? (g || (g = b("CurrentUserInitialData"))).USER_ID == b("Cookie").get("c_user") : (g || (g = b("CurrentUserInitialData"))).USER_ID === ((a = b("Cookie").get("i_user")) != null ? a : b("Cookie").get("c_user"))
        },
        isEmployee: function() {
            return !!(g || (g = b("CurrentUserInitialData"))).IS_EMPLOYEE
        },
        isContingentWorker: function() {
            return !!(g || (g = b("CurrentUserInitialData"))).IS_CONTINGENT
        },
        isTestUser: function() {
            return !!(g || (g = b("CurrentUserInitialData"))).IS_TEST_USER
        },
        hasWorkUser: function() {
            return !!(g || (g = b("CurrentUserInitialData"))).HAS_WORK_USER
        },
        isWorkUser: function() {
            return !!(g || (g = b("CurrentUserInitialData"))).IS_WORK_USER
        },
        isWorkroomsUser: function() {
            return !!(g || (g = b("CurrentUserInitialData"))).IS_WORKROOMS_USER
        },
        isGray: function() {
            return !!(g || (g = b("CurrentUserInitialData"))).IS_GRAY
        },
        isUnderage: function() {
            return !!(g || (g = b("CurrentUserInitialData"))).IS_UNDERAGE
        },
        isMessengerOnlyUser: function() {
            return !!(g || (g = b("CurrentUserInitialData"))).IS_MESSENGER_ONLY_USER
        },
        isDeactivatedAllowedOnMessenger: function() {
            return !!(g || (g = b("CurrentUserInitialData"))).IS_DEACTIVATED_ALLOWED_ON_MESSENGER
        },
        isMessengerCallGuestUser: function() {
            return !!(g || (g = b("CurrentUserInitialData"))).IS_MESSENGER_CALL_GUEST_USER
        },
        isBusinessPersonAccount: function() {
            return (g || (g = b("CurrentUserInitialData"))).IS_BUSINESS_PERSON_ACCOUNT
        },
        hasSecondaryBusinessPerson: function() {
            return (g || (g = b("CurrentUserInitialData"))).HAS_SECONDARY_BUSINESS_PERSON
        },
        getAppID: function() {
            return (g || (g = b("CurrentUserInitialData"))).APP_ID
        },
        isFacebookWorkAccount: function() {
            return (g || (g = b("CurrentUserInitialData"))).IS_FACEBOOK_WORK_ACCOUNT
        },
        isInstagramBusinessPerson: function() {
            return (g || (g = b("CurrentUserInitialData"))).IS_INSTAGRAM_BUSINESS_PERSON
        },
        getPageMessagingMailboxId: function() {
            var a;
            return String((a = (g || (g = b("CurrentUserInitialData"))).PAGE_MESSAGING_MAILBOX_ID) != null ? a : "0")
        }
    };
    e.exports = h
}), null);
__d("cancelIdleCallback", ["cr:7384"], (function(a, b, c, d, e, f, g) {
    g["default"] = b("cr:7384")
}), 98);
__d("IdleCallbackImplementation", ["performanceNow", "requestAnimationFramePolyfill"], (function(a, b, c, d, e, f, g) {
    var h, i = [],
        j = 0,
        k = 0,
        l = -1,
        m = !1,
        n = 1e3 / 60,
        o = 2;

    function p(a) {
        return a
    }

    function q(a) {
        return a
    }

    function b(b, c) {
        var d = k++;
        i[d] = b;
        s();
        if (c != null && c.timeout > 0) {
            var e = p(d);
            a.setTimeout(function() {
                return y(e)
            }, c.timeout)
        }
        return p(d)
    }

    function r(a) {
        a = q(a);
        i[a] = null
    }

    function s() {
        m || (m = !0, c("requestAnimationFramePolyfill")(function(a) {
            m = !1, u((h || (h = c("performanceNow")))() - a)
        }))
    }

    function t(a) {
        var b = n - o;
        if (a < b) return b - a;
        a = a % n;
        if (a > b || a < o) return 0;
        else return b - a
    }

    function u(a) {
        var b = (h || (h = c("performanceNow")))();
        if (b > l) {
            a = t(a);
            if (a > 0) {
                b = b + a;
                x(b);
                l = b
            }
        }
        v() && s()
    }

    function v() {
        return j < i.length
    }

    function w() {
        while (v()) {
            var a = i[j];
            j++;
            if (a) return a
        }
        return null
    }

    function x(a) {
        var b;
        while ((h || (h = c("performanceNow")))() < a && (b = w())) b(new z(a))
    }

    function y(a) {
        var b = q(a);
        b = i[b];
        b && (r(a), b(new z(null)))
    }
    var z = function() {
        function a(a) {
            this.didTimeout = a == null, this.$1 = a
        }
        var b = a.prototype;
        b.timeRemaining = function() {
            var a = this.$1;
            if (a != null) {
                var b = (h || (h = c("performanceNow")))();
                if (b < a) return a - b
            }
            return 0
        };
        return a
    }();
    g.requestIdleCallback = b;
    g.cancelIdleCallback = r
}), 98);
__d("requestIdleCallbackAcrossTransitions", ["IdleCallbackImplementation", "TimeSlice"], (function(a, b, c, d, e, f, g) {
    var h = a.requestIdleCallback || d("IdleCallbackImplementation").requestIdleCallback;

    function b(b, d) {
        b = c("TimeSlice").guard(b, "requestIdleCallback", {
            propagationType: c("TimeSlice").PropagationType.CONTINUATION,
            registerCallStack: !0
        });
        return h.call(a, b, d)
    }
    g["default"] = b
}), 98);
__d("SetIdleTimeoutAcrossTransitions", ["NavigationMetrics", "cancelIdleCallback", "clearTimeout", "nullthrows", "requestIdleCallbackAcrossTransitions", "setTimeoutAcrossTransitions"], (function(a, b, c, d, e, f, g) {
    "use strict";
    var h = !1,
        i = new Map();

    function b(a, b) {
        if (h) {
            var d = c("setTimeoutAcrossTransitions")(function() {
                var b = c("requestIdleCallbackAcrossTransitions")(function() {
                    a(), i["delete"](b)
                });
                i.set(d, b)
            }, b);
            return d
        } else return c("setTimeoutAcrossTransitions")(a, b)
    }

    function d(a) {
        c("clearTimeout")(a), i.has(a) && (c("cancelIdleCallback")(c("nullthrows")(i.get(a))), i["delete"](a))
    }
    c("NavigationMetrics").addRetroactiveListener(c("NavigationMetrics").Events.EVENT_OCCURRED, function(b, c) {
        c.event === "all_pagelets_loaded" && (h = !!a.requestIdleCallback)
    });
    g.start = b;
    g.clear = d
}), 98);
__d("BanzaiStorage", ["BanzaiConsts", "BanzaiUtils", "CurrentUser", "SetIdleTimeoutAcrossTransitions", "WebSession", "WebStorage", "WebStorageMutex", "cr:8958", "isInIframe", "performanceAbsoluteNow"], (function(a, b, c, d, e, f) {
    "use strict";
    var g, h, i, j = "bz:",
        k = b("isInIframe")(),
        l, m = !1,
        n = null;

    function o() {
        var a = "check_quota";
        try {
            var b = p();
            if (!b) return !1;
            b.setItem(a, a);
            b.removeItem(a);
            return !0
        } catch (a) {
            return !1
        }
    }

    function p() {
        m || (m = !0, l = (g || (g = b("WebStorage"))).getLocalStorage());
        return l
    }
    a = {
        flush: function(a) {
            if (k) return;
            var c = p();
            if (c) {
                n == null && (n = parseInt(c.getItem((h || (h = b("BanzaiConsts"))).LAST_STORAGE_FLUSH), 10));
                var d = n && (i || (i = b("performanceAbsoluteNow")))() - n >= (h || (h = b("BanzaiConsts"))).STORAGE_FLUSH_INTERVAL;
                d && a();
                (d || !n) && (n = (i || (i = b("performanceAbsoluteNow")))(), (g || (g = b("WebStorage"))).setItemGuarded(c, (h || (h = b("BanzaiConsts"))).LAST_STORAGE_FLUSH, n.toString()))
            }
        },
        restore: function(a) {
            if (k) return;
            var c = p();
            if (!c) return;
            var d = function(d) {
                var e = [];
                for (var f = 0; f < c.length; f++) {
                    var g = c.key(f);
                    typeof g === "string" && g.indexOf(j) === 0 && g.indexOf("bz:__") !== 0 && e.push(g)
                }
                e.forEach(function(d) {
                    var e = c.getItem(d);
                    c.removeItem(d);
                    if (e == null || e === "") return;
                    d = b("cr:8958").parse(e);
                    d.forEach(function(c) {
                        if (!c) return;
                        var d = c.__meta = c.pop(),
                            e = b("BanzaiUtils").canSend(c);
                        if (!e) return;
                        e = b("CurrentUser").getPossiblyNonFacebookUserID();
                        (d.userID === e || e === "0") && (b("BanzaiUtils").resetPostStatus(c), a(c))
                    })
                });
                d && d.unlock()
            };
            o() ? new(b("WebStorageMutex"))("banzai").lock(d) : b("SetIdleTimeoutAcrossTransitions").start(d, 0)
        },
        store: function(a) {
            if (k) return;
            var c = p(),
                d = a.filter(function(a) {
                    return a.__meta.status !== (h || (h = b("BanzaiConsts"))).POST_SENT
                });
            if (!c || d.length <= 0) return;
            d = d.map(function(a) {
                return [a[0], a[1], a[2], a[3] || 0, a[4], a.__meta]
            });
            a.splice(0, a.length);
            (g || (g = b("WebStorage"))).setItemGuarded(c, j + b("WebSession").getId() + "." + (i || (i = b("performanceAbsoluteNow")))(), b("cr:8958").stringify(d))
        }
    };
    e.exports = a
}), null);
__d("QueryString", [], (function(a, b, c, d, e, f) {
    function g(a) {
        var b = [];
        Object.keys(a).sort().forEach(function(c) {
            var d = a[c];
            if (d === void 0) return;
            if (d === null) {
                b.push(c);
                return
            }
            b.push(encodeURIComponent(c) + "=" + encodeURIComponent(String(d)))
        });
        return b.join("&")
    }

    function a(a, b) {
        b === void 0 && (b = !1);
        var c = {};
        if (a === "") return c;
        a = a.split("&");
        for (var d = 0; d < a.length; d++) {
            var e = a[d].split("=", 2),
                f = decodeURIComponent(e[0]);
            if (b && Object.prototype.hasOwnProperty.call(c, f)) throw new URIError("Duplicate key: " + f);
            c[f] = e.length === 2 ? decodeURIComponent(e[1]) : null
        }
        return c
    }

    function b(a, b) {
        return a + (a.indexOf("?") !== -1 ? "&" : "?") + (typeof b === "string" ? b : g(b))
    }
    c = {
        encode: g,
        decode: a,
        appendToUrl: b
    };
    f["default"] = c
}), 66);
__d("once", [], (function(a, b, c, d, e, f) {
    "use strict";

    function a(a) {
        var b = g(a);
        for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && (b[c] = a[c]);
        return b
    }

    function g(a) {
        var b = a,
            c;
        a = function() {
            if (b) {
                for (var a = arguments.length, d = new Array(a), e = 0; e < a; e++) d[e] = arguments[e];
                c = b.apply(this, d);
                b = null
            }
            return c
        };
        return a
    }
    f["default"] = a
}), 66);
__d("BanzaiAdapterWWW", ["invariant", "Arbiter", "BanzaiConfig", "BanzaiConsts", "BanzaiStorage", "QueryString", "Run", "StaticSiteData", "TimeSlice", "URI", "UserAgent", "ZeroRewrites", "getAsyncParams", "once"], (function(a, b, c, d, e, f, g, h) {
    var i, j, k = [],
        l = new(c("Arbiter"))(),
        m = "/ajax/bz",
        n = "POST",
        o = {
            config: c("BanzaiConfig"),
            useBeacon: !0,
            getEndPointUrl: function(a) {
                a = c("getAsyncParams")(n);
                delete a[c("StaticSiteData").csr_key];
                a = c("QueryString").appendToUrl(m, a);
                a.length <= 2e3 || h(0, 21850, a);
                return a
            },
            getStorage: function() {
                return c("BanzaiStorage")
            },
            inform: function(a) {
                l.inform(a)
            },
            subscribe: function(a, b) {
                return l.subscribe(a, b)
            },
            wrapInTimeSlice: function(a, b) {
                return c("TimeSlice").guard(function() {
                    a()
                }, b, {
                    propagationType: c("TimeSlice").PropagationType.ORPHAN
                })
            },
            cleanup: function() {
                var a = k;
                k = [];
                a.forEach(function(a) {
                    a.readyState < 4 && a.abort()
                })
            },
            preferredCompressionMethod: c("once")(function() {
                return "snappy_base64"
            }),
            readyToSend: function() {
                return c("UserAgent").isBrowser("IE <= 8") || navigator.onLine
            },
            send: function(a, b, e, f) {
                var g = o.getEndPointUrl(!1);
                g = d("ZeroRewrites").rewriteURI(new(i || (i = c("URI")))(g));
                var h = d("ZeroRewrites").getTransportBuilderForURI(g)();
                h.open(n, g.toString(), !0);
                h.onreadystatechange = function() {
                    if (h.readyState >= 4) {
                        var a = k.indexOf(h);
                        a >= 0 && k.splice(a, 1);
                        try {
                            a = h.status
                        } catch (b) {
                            a = 0
                        }
                        a == 200 ? (b && b(), f || o.inform((j || (j = c("BanzaiConsts"))).OK)) : (e && e(a), f || o.inform((j || (j = c("BanzaiConsts"))).ERROR))
                    }
                };
                k.push(h);
                h.send(a, !1)
            },
            setHooks: function(a) {},
            setUnloadHook: function(a) {
                d("Run").onAfterUnload(a._unload)
            },
            onUnload: function(a) {
                d("Run").onAfterUnload(a)
            },
            isOkToSendViaBeacon: function() {
                return !0
            }
        };
    a = o;
    g["default"] = a
}), 98);
/**
 * License: https://www.facebook.com/legal/license/WRsJ32R7YJG/
 */
__d("SnappyCompress", [], (function(a, b, c, d, e, f) {
    "use strict";

    function g() {
        return typeof process === "object" && (typeof process.versions === "object" && typeof process.versions.node !== "undefined") ? !0 : !1
    }

    function h(a) {
        return a instanceof Uint8Array && (!g() || !Buffer.isBuffer(a))
    }

    function i(a) {
        return a instanceof ArrayBuffer
    }

    function j(a) {
        return !g() ? !1 : Buffer.isBuffer(a)
    }
    var k = "Argument compressed must be type of ArrayBuffer, Buffer, or Uint8Array";

    function a(a) {
        if (!h(a) && !i(a) && !j(a)) throw new TypeError(k);
        var b = !1,
            c = !1;
        h(a) ? b = !0 : i(a) && (c = !0, a = new Uint8Array(a));
        a = new A(a);
        var d = a.readUncompressedLength();
        if (d === -1) throw new Error("Invalid Snappy bitstream");
        if (b) {
            b = new Uint8Array(d);
            if (!a.uncompressToBuffer(b)) throw new Error("Invalid Snappy bitstream")
        } else if (c) {
            b = new ArrayBuffer(d);
            c = new Uint8Array(b);
            if (!a.uncompressToBuffer(c)) throw new Error("Invalid Snappy bitstream")
        } else {
            b = Buffer.alloc(d);
            if (!a.uncompressToBuffer(b)) throw new Error("Invalid Snappy bitstream")
        }
        return b
    }

    function b(a) {
        if (!h(a) && !i(a) && !j(a)) throw new TypeError(k);
        var b = !1,
            c = !1;
        h(a) ? b = !0 : i(a) && (c = !0, a = new Uint8Array(a));
        a = new x(a);
        var d = a.maxCompressedLength(),
            e, f, g;
        b ? (e = new Uint8Array(d), g = a.compressToBuffer(e)) : c ? (e = new ArrayBuffer(d), f = new Uint8Array(e), g = a.compressToBuffer(f)) : (e = Buffer.alloc(d), g = a.compressToBuffer(e));
        if (!e.slice) {
            f = new Uint8Array(Array.prototype.slice.call(e, 0, g));
            if (b) return f;
            else if (c) return f.buffer;
            else throw new Error("not implemented")
        }
        return e.slice(0, g)
    }
    c = 16;
    var l = 1 << c,
        m = 14,
        n = new Array(m + 1);

    function o(a, b) {
        return a * 506832829 >>> b
    }

    function p(a, b) {
        return a[b] + (a[b + 1] << 8) + (a[b + 2] << 16) + (a[b + 3] << 24)
    }

    function q(a, b, c) {
        return a[b] === a[c] && a[b + 1] === a[c + 1] && a[b + 2] === a[c + 2] && a[b + 3] === a[c + 3]
    }

    function r(a, b, c, d, e) {
        var f;
        for (f = 0; f < e; f++) c[d + f] = a[b + f]
    }

    function s(a, b, c, d, e) {
        c <= 60 ? (d[e] = c - 1 << 2, e += 1) : c < 256 ? (d[e] = 60 << 2, d[e + 1] = c - 1, e += 2) : (d[e] = 61 << 2, d[e + 1] = c - 1 & 255, d[e + 2] = c - 1 >>> 8, e += 3);
        r(a, b, d, e, c);
        return e + c
    }

    function t(a, b, c, d) {
        if (d < 12 && c < 2048) {
            a[b] = 1 + (d - 4 << 2) + (c >>> 8 << 5);
            a[b + 1] = c & 255;
            return b + 2
        } else {
            a[b] = 2 + (d - 1 << 2);
            a[b + 1] = c & 255;
            a[b + 2] = c >>> 8;
            return b + 3
        }
    }

    function u(a, b, c, d) {
        while (d >= 68) b = t(a, b, c, 64), d -= 64;
        d > 64 && (b = t(a, b, c, 60), d -= 60);
        return t(a, b, c, d)
    }

    function v(a, b, c, d, e) {
        var f = 1;
        while (1 << f <= c && f <= m) f += 1;
        f -= 1;
        var g = 32 - f;
        typeof n[f] === "undefined" && (n[f] = new Uint16Array(1 << f));
        f = n[f];
        var h;
        for (h = 0; h < f.length; h++) f[h] = 0;
        h = b + c;
        var i = b,
            j = b,
            k, l, r, t, v, w = !0,
            x = 15;
        if (c >= x) {
            c = h - x;
            b += 1;
            x = o(p(a, b), g);
            while (w) {
                t = 32;
                l = b;
                do {
                    b = l;
                    k = x;
                    v = t >>> 5;
                    t += 1;
                    l = b + v;
                    if (b > c) {
                        w = !1;
                        break
                    }
                    x = o(p(a, l), g);
                    r = i + f[k];
                    f[k] = b - i
                } while (!q(a, b, r));
                if (!w) break;
                e = s(a, j, b - j, d, e);
                do {
                    v = b;
                    k = 4;
                    while (b + k < h && a[b + k] === a[r + k]) k += 1;
                    b += k;
                    l = v - r;
                    e = u(d, e, l, k);
                    j = b;
                    if (b >= c) {
                        w = !1;
                        break
                    }
                    t = o(p(a, b - 1), g);
                    f[t] = b - 1 - i;
                    v = o(p(a, b), g);
                    r = i + f[v];
                    f[v] = b - i
                } while (q(a, b, r));
                if (!w) break;
                b += 1;
                x = o(p(a, b), g)
            }
        }
        j < h && (e = s(a, j, h - j, d, e));
        return e
    }

    function w(a, b, c) {
        do b[c] = a & 127, a = a >>> 7, a > 0 && (b[c] += 128), c += 1; while (a > 0);
        return c
    }

    function x(a) {
        this.array = a
    }
    x.prototype.maxCompressedLength = function() {
        var a = this.array.length;
        return 32 + a + Math.floor(a / 6)
    };
    x.prototype.compressToBuffer = function(a) {
        var b = this.array,
            c = b.length,
            d = 0,
            e = 0,
            f;
        e = w(c, a, e);
        while (d < c) f = Math.min(c - d, l), e = v(b, d, f, a, e), d += f;
        return e
    };
    var y = [0, 255, 65535, 16777215, 4294967295];

    function r(a, b, c, d, e) {
        var f;
        for (f = 0; f < e; f++) c[d + f] = a[b + f]
    }

    function z(a, b, c, d) {
        var e;
        for (e = 0; e < d; e++) a[b + e] = a[b - c + e]
    }

    function A(a) {
        this.array = a, this.pos = 0
    }
    A.prototype.readUncompressedLength = function() {
        var a = 0,
            b = 0,
            c, d;
        while (b < 32 && this.pos < this.array.length) {
            c = this.array[this.pos];
            this.pos += 1;
            d = c & 127;
            if (d << b >>> b !== d) return -1;
            a |= d << b;
            if (c < 128) return a;
            b += 7
        }
        return -1
    };
    A.prototype.uncompressToBuffer = function(a) {
        var b = this.array,
            c = b.length,
            d = this.pos,
            e = 0,
            f, g, h, i;
        while (d < b.length) {
            f = b[d];
            d += 1;
            if ((f & 3) === 0) {
                g = (f >>> 2) + 1;
                if (g > 60) {
                    if (d + 3 >= c) return !1;
                    h = g - 60;
                    g = b[d] + (b[d + 1] << 8) + (b[d + 2] << 16) + (b[d + 3] << 24);
                    g = (g & y[h]) + 1;
                    d += h
                }
                if (d + g > c) return !1;
                r(b, d, a, e, g);
                d += g;
                e += g
            } else {
                switch (f & 3) {
                    case 1:
                        g = (f >>> 2 & 7) + 4;
                        i = b[d] + (f >>> 5 << 8);
                        d += 1;
                        break;
                    case 2:
                        if (d + 1 >= c) return !1;
                        g = (f >>> 2) + 1;
                        i = b[d] + (b[d + 1] << 8);
                        d += 2;
                        break;
                    case 3:
                        if (d + 3 >= c) return !1;
                        g = (f >>> 2) + 1;
                        i = b[d] + (b[d + 1] << 8) + (b[d + 2] << 16) + (b[d + 3] << 24);
                        d += 4;
                        break;
                    default:
                        break
                }
                if (i === 0 || i > e) return !1;
                z(a, e, i, g);
                e += g
            }
        }
        return !0
    };
    e.exports.uncompress = a;
    e.exports.compress = b
}), null);
__d("SnappyCompressUtil", ["SnappyCompress"], (function(a, b, c, d, e, f) {
    "use strict";
    var g = a.Uint8Array,
        h = a.btoa,
        i = a.TextEncoder,
        j = {
            compressUint8ArrayToSnappy: function(a) {
                if (a == null || h == null) return null;
                var c = null;
                try {
                    c = b("SnappyCompress").compress(a)
                } catch (a) {
                    return null
                }
                a = "";
                for (var d = 0; d < c.length; d++) a += String.fromCharCode(c[d]);
                return h(a)
            },
            compressStringToSnappy: function(b) {
                if (g == null || h == null) return null;
                var c = new a.Uint8Array(b.length);
                for (var d = 0; d < b.length; d++) {
                    var e = b.charCodeAt(d);
                    if (e > 127) return null;
                    c[d] = e
                }
                return j.compressUint8ArrayToSnappy(c)
            },
            compressStringToSnappyBinary: function(a) {
                if (g == null) return null;
                var c = null;
                if (i != null) c = new i().encode(a);
                else {
                    c = new g(a.length);
                    for (var d = 0; d < a.length; d++) {
                        var e = a.charCodeAt(d);
                        if (e > 127) return null;
                        c[d] = e
                    }
                }
                e = null;
                try {
                    e = b("SnappyCompress").compress(c)
                } catch (a) {
                    return null
                }
                return e
            }
        };
    e.exports = j
}), null);
__d("BanzaiCompressionUtils", ["FBLogger", "Promise", "SnappyCompressUtil", "once", "performanceNow"], (function(a, b, c, d, e, f) {
    "use strict";
    var g, h, i = b("once")(function() {
            if (a.CompressionStream == null) return !1;
            if (a.Response == null) return !1;
            try {
                new a.CompressionStream("deflate")
            } catch (a) {
                return !1
            }
            return !0
        }),
        j = {
            compressWad: function(a, c) {
                if (a.needs_compression !== !0) {
                    delete a.needs_compression;
                    return
                }
                if (c === "deflate") {
                    j.compressWad(a, "snappy");
                    return
                }
                var d = (g || (g = b("performanceNow")))(),
                    e = JSON.stringify(a.posts),
                    f;
                switch (c) {
                    case "snappy":
                        f = b("SnappyCompressUtil").compressStringToSnappyBinary(e);
                        break;
                    case "snappy_base64":
                        f = b("SnappyCompressUtil").compressStringToSnappy(e);
                        break;
                    default:
                        break
                }
                f != null && f.length < e.length ? (a.posts = f, a.compression = c, a.snappy_ms = Math.ceil((g || (g = b("performanceNow")))() - d), a.snappy_ms < 0 && b("FBLogger")("BanzaiCompressionUtils").warn("Expected positive snappy_ms but got %s", a.snappy_ms)) : a.compression = "";
                delete a.needs_compression
            },
            compressWadAsync: function(c, d) {
                if (d !== "deflate") {
                    j.compressWad(c, "snappy");
                    return (h || (h = b("Promise"))).resolve()
                }
                if (!i()) return j.compressWadAsync(c, "snappy");
                var e = (g || (g = b("performanceNow")))(),
                    f = JSON.stringify(c.posts),
                    k = new Response(f).body;
                if (!k) {
                    c.compression = "";
                    delete c.needs_compression;
                    return (h || (h = b("Promise"))).resolve()
                }
                k = k.pipeThrough(new a.CompressionStream("deflate"));
                return new Response(k).arrayBuffer().then(function(a) {
                    a.byteLength < f.length ? (c.posts = new Uint8Array(a), c.compression = d, c.snappy_ms = Math.ceil((g || (g = b("performanceNow")))() - e), c.snappy_ms < 0 && b("FBLogger")("BanzaiCompressionUtils").warn("Expected positive snappy_ms but got %s", c.snappy_ms)) : c.compression = "", delete c.needs_compression
                })["catch"](function() {
                    c.compression = "", delete c.needs_compression
                })
            },
            outOfBandsPosts: function(a) {
                var b = 0,
                    c = {};
                for (var d = 0; d < a.length; d++) {
                    var e = a[d],
                        f = e.compression === "snappy" || e.compression === "deflate";
                    if (f) {
                        f = new Blob([e.posts], {
                            type: "application/octet-stream"
                        });
                        e.posts = String(b);
                        c["post_" + String(b)] = f;
                        b++
                    }
                }
                return c
            }
        };
    e.exports = j
}), null);
__d("BanzaiBase", ["BanzaiCompressionUtils", "BanzaiConsts", "BanzaiLazyQueue", "BanzaiUtils", "ErrorGuard", "ExecutionEnvironment", "FBLogger", "cr:1172", "cr:2037", "cr:3724", "cr:9985", "cr:9986", "cr:9987", "cr:9988"], (function(a, b, c, d, e, f) {
    var g, h, i, j, k, l = [],
        m = null,
        n = {
            _clearPostBuffer: function() {
                l = []
            },
            _flushLazyQueue: function() {
                b("BanzaiLazyQueue").flushQueue().forEach(function(a) {
                    return n.post.apply(n, a)
                })
            },
            _gatherWadsAndPostsFromBuffer: function(a, c, d, e, f) {
                var g = {
                    currentSize: 0,
                    keepRetryable: d,
                    overlimit: !1,
                    sendMinimumOnePost: f,
                    wadMap: new Map()
                };
                d = e.filter(function(d, e) {
                    return b("BanzaiUtils").filterPost(d, a, c, g)
                });
                g.overlimit && d.length && n._schedule(0);
                return d
            },
            _getEventTime: function() {
                return b("cr:9985")()
            },
            _getWebSessionId: function() {
                return b("cr:1172").getId()
            },
            _getPostBuffer: function() {
                return l
            },
            _getUserId: function() {
                return b("cr:9986").getPossiblyNonFacebookUserID()
            },
            _getAppId: function() {
                return b("cr:9986").getAppID()
            },
            _initialize: function() {
                (g || (g = b("ExecutionEnvironment"))).canUseDOM && (n.adapter.useBeacon && b("cr:9988").isSupported() ? (b("cr:9988").addListener(b("cr:9988").HIDDEN, function() {
                    n._getPostBuffer().length > 0 && (n._tryToSendViaBeacon() || n._store())
                }), n.isEnabled("enable_client_logging_clear_on_visible") && b("cr:9988").addListener(b("cr:9988").VISIBLE, function() {
                    n._tryToSendViaBeacon() || n._restore()
                })) : n.adapter.setHooks(n), n.adapter.setUnloadHook(n), b("cr:9987").addListener(b("cr:9987").Events.NAVIGATION_DONE, function(a, c) {
                    if (c.pageType !== "normal") return;
                    n._restore();
                    b("cr:9987").removeCurrentListener()
                }))
            },
            _sendBeacon: function(b, c) {
                return a.navigator.sendBeacon(b, c)
            },
            _prepForTransit: function(a) {
                var c = new FormData();
                c.append("ts", String(Date.now()));
                var d = b("BanzaiCompressionUtils").outOfBandsPosts(a);
                Object.keys(d).forEach(function(a) {
                    c.append(a, d[a])
                });
                c.append("q", JSON.stringify(a));
                return c
            },
            _prepWadForTransit: function(a) {
                b("BanzaiCompressionUtils").compressWad(a, b("cr:2037").preferredCompressionMethod())
            },
            _processCallbacksAndSendViaBeacon: function() {
                var a = [],
                    c = [],
                    d = [];
                n._gatherWadsAndPostsFromBuffer(c, d, !0, a, !1);
                if (c.length > 0) {
                    c[0].send_method = "beacon";
                    c.map(n._prepWadForTransit);
                    d = n._prepForTransit(c);
                    a = b("cr:2037").getEndPointUrl(!0);
                    c = n._sendBeacon(a, d);
                    c || b("FBLogger")("banzai").warn("Error sending beacon")
                }
            },
            _restore: function() {
                var a = b("cr:2037").getStorage(),
                    c = function(a) {
                        l.push(a)
                    };
                (h || (h = b("ErrorGuard"))).applyWithGuard(a.restore, a, [c]);
                n._schedule(b("cr:2037").config.RESTORE_WAIT || (i || (i = b("BanzaiConsts"))).VITAL_WAIT)
            },
            _schedule: function(a) {
                var c = n._getEventTime() + a;
                if (!k || c < k) {
                    k = c;
                    b("cr:3724").clear(j);
                    j = b("cr:3724").start(b("cr:2037").wrapInTimeSlice(n._sendWithCallbacks, "Banzai.send"), a);
                    return !0
                }
                return !1
            },
            _sendWithCallbacks: function(a, c) {
                k = null;
                n._schedule(n.BASIC.delay);
                if (!b("cr:2037").readyToSend()) {
                    c && c();
                    return
                }
                if (n.isEnabled("flush_storage_periodically")) {
                    var d = b("cr:2037").getStorage(),
                        e = function() {
                            n._restore()
                        };
                    (h || (h = b("ErrorGuard"))).applyWithGuard(d.flush, d, [e])
                }
                b("cr:2037").inform((i || (i = b("BanzaiConsts"))).SEND);
                d = [];
                var f = [];
                l = n._gatherWadsAndPostsFromBuffer(d, f, !0, l, !0);
                if (d.length <= 0) {
                    b("cr:2037").inform((i || (i = b("BanzaiConsts"))).OK);
                    a && a();
                    return
                }
                d[0].trigger = m;
                m = null;
                d[0].send_method = "ajax";
                d.map(n._prepWadForTransit);
                b("cr:2037").send(n._prepForTransit(d), function() {
                    f.forEach(function(a) {
                        a = a;
                        a.__meta.status = (i || (i = b("BanzaiConsts"))).POST_SENT;
                        a.__meta.callback && a.__meta.callback()
                    }), a && a()
                }, function(a) {
                    f.forEach(function(c) {
                        b("BanzaiUtils").retryPost(c, a, l)
                    }), c && c()
                })
            },
            _store: function() {
                var a = b("cr:2037").getStorage();
                (h || (h = b("ErrorGuard"))).applyWithGuard(a.store, a, [l])
            },
            _testState: function() {
                return {
                    postBuffer: l,
                    triggerRoute: m
                }
            },
            _tryToSendViaBeacon: function() {
                if (!(navigator && navigator.sendBeacon && b("cr:2037").isOkToSendViaBeacon())) return !1;
                var a = [],
                    c = [];
                l = n._gatherWadsAndPostsFromBuffer(a, c, !1, l, !1);
                if (a.length <= 0) return !1;
                a[0].send_method = "beacon";
                a.map(n._prepWadForTransit);
                a = n._prepForTransit(a);
                var d = b("cr:2037").getEndPointUrl(!0);
                d = n._sendBeacon(d, a);
                if (!d) {
                    c.forEach(function(a) {
                        l.push(a)
                    });
                    return !1
                }
                return !0
            },
            _unload: function() {
                if (b("cr:2037").config.disabled) return;
                n._flushLazyQueue();
                navigator && navigator.sendBeacon && b("cr:2037").isOkToSendViaBeacon() && n._processCallbacksAndSendViaBeacon();
                b("cr:2037").cleanup();
                b("cr:2037").inform((i || (i = b("BanzaiConsts"))).SHUTDOWN);
                l.length > 0 && ((!n.adapter.useBeacon || !n._tryToSendViaBeacon()) && n._store())
            },
            BASIC: {
                delay: b("cr:2037").config.MAX_WAIT || (i || (i = b("BanzaiConsts"))).BASIC_WAIT
            },
            BASIC_WAIT: (i || (i = b("BanzaiConsts"))).BASIC_WAIT,
            ERROR: i.ERROR,
            OK: i.OK,
            SEND: i.SEND,
            SHUTDOWN: i.SHUTDOWN,
            VITAL: {
                delay: b("cr:2037").config.MIN_WAIT || (i || (i = b("BanzaiConsts"))).VITAL_WAIT
            },
            VITAL_WAIT: i.VITAL_WAIT,
            adapter: b("cr:2037"),
            canUseNavigatorBeacon: function() {
                return Boolean(navigator && navigator.sendBeacon && b("cr:2037").isOkToSendViaBeacon())
            },
            flush: function(a, c) {
                b("cr:3724").clear(j), n._sendWithCallbacks(a, c)
            },
            isEnabled: function(a) {
                return Boolean(b("cr:2037").config.gks && b("cr:2037").config.gks[a] && !b("cr:2037").config.disabled)
            },
            post: function(a, c, d) {
                a || b("FBLogger")("banzai").mustfix("Banzai.post called without specifying a route");
                n._flushLazyQueue();
                var e = a.split(":");
                if ((b("cr:2037").config.known_routes || []).indexOf(e[0]) === -1) {
                    b("cr:2037").config.should_log_unknown_routes === !0 && b("FBLogger")("banzai").blameToPreviousFrame().mustfix("Attempted to post to invalid Banzai route '" + a + "'. This call site should be cleaned up.");
                    if (b("cr:2037").config.should_drop_unknown_routes === !0) return
                }
                e = "";
                try {
                    var f;
                    e = (f = JSON.stringify(c)) != null ? f : ""
                } catch (c) {
                    b("FBLogger")("banzai").catching(c).addToCategoryKey(a).mustfix("Could not JSON.stringify banzai data for route %s", a);
                    return
                }
                f = d == null ? void 0 : d.retry;
                if (b("cr:2037").config.disabled) return;
                if (!(g || (g = b("ExecutionEnvironment"))).canUseDOM && !(g || (g = b("ExecutionEnvironment"))).isInWorker) return;
                var h = b("cr:2037").config.blacklist;
                if (h && (h.indexOf && (typeof h.indexOf == "function" && h.indexOf(a) != -1))) return;
                h = e.length;
                var j = b("BanzaiUtils").wrapData(a, c, n._getEventTime(), f, h),
                    k = j;
                (d == null ? void 0 : d.callback) && (k.__meta.callback = d == null ? void 0 : d.callback);
                (d == null ? void 0 : d.compress) != null && (k.__meta.compress = d == null ? void 0 : d.compress);
                e = d == null ? void 0 : d.delay;
                e == null && (e = (i || (i = b("BanzaiConsts"))).BASIC_WAIT);
                if (d == null ? void 0 : d.signal) {
                    k.__meta.status = (i || (i = b("BanzaiConsts"))).POST_INFLIGHT;
                    c = [{
                        user: n._getUserId(),
                        webSessionId: n._getWebSessionId(),
                        app_id: n._getAppId(),
                        posts: [j],
                        trigger: a
                    }];
                    b("cr:2037").send(n._prepForTransit(c), function() {
                        k.__meta.status = (i || (i = b("BanzaiConsts"))).POST_SENT, k.__meta.callback && k.__meta.callback()
                    }, function(a) {
                        b("BanzaiUtils").retryPost(j, a, l)
                    }, !0);
                    if (!f) return
                }
                l.push(j);
                (n._schedule(e) || !m) && (m = a)
            },
            subscribe: b("cr:2037").subscribe
        };
    n._initialize();
    e.exports = n
}), null);
__d("BanzaiWWW", ["cr:1642797"], (function(a, b, c, d, e, f, g) {
    g["default"] = b("cr:1642797")
}), 98);
__d("CurrentLocale", ["IntlCurrentLocale"], (function(a, b, c, d, e, f, g) {
    "use strict";
    a = {
        get: function() {
            return c("IntlCurrentLocale").code
        }
    };
    b = a;
    g["default"] = b
}), 98);
__d("DateConsts", [], (function(a, b, c, d, e, f) {
    var g = 1e3;
    c = 60;
    d = 60;
    e = 24;
    var h = 7,
        i = 12,
        j = 1e3,
        k = 30.43,
        l = 4.333,
        m = 365.242,
        n = c * d,
        o = n * e,
        p = o * h,
        q = o * m,
        r = g * c,
        s = r * d,
        t = g * o,
        u = t * h,
        v = t * m,
        w = {
            SUNDAY: 0,
            MONDAY: 1,
            TUESDAY: 2,
            WEDNESDAY: 3,
            THURSDAY: 4,
            FRIDAY: 5,
            SATURDAY: 6
        };
    Object.freeze(w);

    function a(a, b) {
        return new Date(a, b, 0).getDate()
    }

    function b() {
        return Date.now() / g
    }
    var x = {
        instantRange: {
            since: -864e10,
            until: 864e10 + 1
        }
    };
    f.MS_PER_SEC = g;
    f.SEC_PER_MIN = c;
    f.MIN_PER_HOUR = d;
    f.HOUR_PER_DAY = e;
    f.DAYS_PER_WEEK = h;
    f.MONTHS_PER_YEAR = i;
    f.US_PER_MS = j;
    f.AVG_DAYS_PER_MONTH = k;
    f.AVG_WEEKS_PER_MONTH = l;
    f.AVG_DAYS_PER_YEAR = m;
    f.SEC_PER_HOUR = n;
    f.SEC_PER_DAY = o;
    f.SEC_PER_WEEK = p;
    f.SEC_PER_YEAR = q;
    f.MS_PER_MIN = r;
    f.MS_PER_HOUR = s;
    f.MS_PER_DAY = t;
    f.MS_PER_WEEK = u;
    f.MS_PER_YEAR = v;
    f.DAYS = w;
    f.getDaysInMonth = a;
    f.getCurrentTimeInSeconds = b;
    f["private"] = x
}), 66);
__d("cancelAnimationFramePolyfill", [], (function(a, b, c, d, e, f) {
    "use strict";
    b = a.__fbNativeCancelAnimationFrame || a.cancelAnimationFrame || a.webkitCancelAnimationFrame || a.mozCancelAnimationFrame || a.oCancelAnimationFrame || a.msCancelAnimationFrame || a.clearTimeout;
    c = b;
    f["default"] = c
}), 66);
__d("cancelAnimationFrame", ["cancelAnimationFramePolyfill"], (function(a, b, c, d, e, f, g) {
    function a(a) {
        c("cancelAnimationFramePolyfill")(a)
    }
    g["default"] = a
}), 98);
__d("cancelIdleCallbackBlue", ["IdleCallbackImplementation"], (function(a, b, c, d, e, f, g) {
    var h = (c = a.cancelIdleCallback) != null ? c : d("IdleCallbackImplementation").cancelIdleCallback;

    function b(a) {
        h(a)
    }
    g["default"] = b
}), 98);
__d("cancelIdleCallbackWWW", ["cr:692209"], (function(a, b, c, d, e, f, g) {
    g["default"] = b("cr:692209")
}), 98);
__d("setInterval", ["cr:7388"], (function(a, b, c, d, e, f, g) {
    g["default"] = b("cr:7388")
}), 98);