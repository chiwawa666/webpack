!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t(exports)
    : "function" == typeof define && define.amd
    ? define(["exports"], t)
    : t(
        ((e = "undefined" != typeof globalThis ? globalThis : e || self).QNRTC =
          {})
      );
})(this, function (e) {
  "use strict";
  function t(e, t) {
    return (
      t.forEach(function (t) {
        t &&
          "string" != typeof t &&
          !Array.isArray(t) &&
          Object.keys(t).forEach(function (r) {
            if ("default" !== r && !(r in e)) {
              var n = Object.getOwnPropertyDescriptor(t, r);
              Object.defineProperty(
                e,
                r,
                n.get
                  ? n
                  : {
                      enumerable: !0,
                      get: function () {
                        return t[r];
                      },
                    }
              );
            }
          });
      }),
      Object.freeze(e)
    );
  }
  let r = !0,
    n = !0;
  function i(e, t, r) {
    const n = e.match(t);
    return n && n.length >= r && parseInt(n[r], 10);
  }
  function o(e, t, r) {
    if (!e.RTCPeerConnection) return;
    const n = e.RTCPeerConnection.prototype,
      i = n.addEventListener;
    n.addEventListener = function (e, n) {
      if (e !== t) return i.apply(this, arguments);
      const o = (e) => {
        const t = r(e);
        t && (n.handleEvent ? n.handleEvent(t) : n(t));
      };
      return (
        (this._eventMap = this._eventMap || {}),
        this._eventMap[t] || (this._eventMap[t] = new Map()),
        this._eventMap[t].set(n, o),
        i.apply(this, [e, o])
      );
    };
    const o = n.removeEventListener;
    (n.removeEventListener = function (e, r) {
      if (e !== t || !this._eventMap || !this._eventMap[t])
        return o.apply(this, arguments);
      if (!this._eventMap[t].has(r)) return o.apply(this, arguments);
      const n = this._eventMap[t].get(r);
      return (
        this._eventMap[t].delete(r),
        0 === this._eventMap[t].size && delete this._eventMap[t],
        0 === Object.keys(this._eventMap).length && delete this._eventMap,
        o.apply(this, [e, n])
      );
    }),
      Object.defineProperty(n, "on" + t, {
        get() {
          return this["_on" + t];
        },
        set(e) {
          this["_on" + t] &&
            (this.removeEventListener(t, this["_on" + t]),
            delete this["_on" + t]),
            e && this.addEventListener(t, (this["_on" + t] = e));
        },
        enumerable: !0,
        configurable: !0,
      });
  }
  function a(e) {
    return "boolean" != typeof e
      ? new Error("Argument type: " + typeof e + ". Please use a boolean.")
      : ((r = e),
        e ? "adapter.js logging disabled" : "adapter.js logging enabled");
  }
  function s(e) {
    return "boolean" != typeof e
      ? new Error("Argument type: " + typeof e + ". Please use a boolean.")
      : ((n = !e),
        "adapter.js deprecation warnings " + (e ? "disabled" : "enabled"));
  }
  function c() {
    if ("object" == typeof window) {
      if (r) return;
      "undefined" != typeof console &&
        "function" == typeof console.log &&
        console.log.apply(console, arguments);
    }
  }
  function d(e, t) {
    n && console.warn(e + " is deprecated, please use " + t + " instead.");
  }
  function u(e) {
    return "[object Object]" === Object.prototype.toString.call(e);
  }
  function l(e) {
    return u(e)
      ? Object.keys(e).reduce(function (t, r) {
          const n = u(e[r]),
            i = n ? l(e[r]) : e[r],
            o = n && !Object.keys(i).length;
          return void 0 === i || o ? t : Object.assign(t, { [r]: i });
        }, {})
      : e;
  }
  function A(e, t, r) {
    t &&
      !r.has(t.id) &&
      (r.set(t.id, t),
      Object.keys(t).forEach((n) => {
        n.endsWith("Id")
          ? A(e, e.get(t[n]), r)
          : n.endsWith("Ids") &&
            t[n].forEach((t) => {
              A(e, e.get(t), r);
            });
      }));
  }
  function h(e, t, r) {
    const n = r ? "outbound-rtp" : "inbound-rtp",
      i = new Map();
    if (null === t) return i;
    const o = [];
    return (
      e.forEach((e) => {
        "track" === e.type && e.trackIdentifier === t.id && o.push(e);
      }),
      o.forEach((t) => {
        e.forEach((r) => {
          r.type === n && r.trackId === t.id && A(e, r, i);
        });
      }),
      i
    );
  }
  const f = c;
  function p(e, t) {
    const r = e && e.navigator;
    if (!r.mediaDevices) return;
    const n = function (e) {
        if ("object" != typeof e || e.mandatory || e.optional) return e;
        const t = {};
        return (
          Object.keys(e).forEach((r) => {
            if ("require" === r || "advanced" === r || "mediaSource" === r)
              return;
            const n = "object" == typeof e[r] ? e[r] : { ideal: e[r] };
            void 0 !== n.exact &&
              "number" == typeof n.exact &&
              (n.min = n.max = n.exact);
            const i = function (e, t) {
              return e
                ? e + t.charAt(0).toUpperCase() + t.slice(1)
                : "deviceId" === t
                ? "sourceId"
                : t;
            };
            if (void 0 !== n.ideal) {
              t.optional = t.optional || [];
              let e = {};
              "number" == typeof n.ideal
                ? ((e[i("min", r)] = n.ideal),
                  t.optional.push(e),
                  (e = {}),
                  (e[i("max", r)] = n.ideal),
                  t.optional.push(e))
                : ((e[i("", r)] = n.ideal), t.optional.push(e));
            }
            void 0 !== n.exact && "number" != typeof n.exact
              ? ((t.mandatory = t.mandatory || {}),
                (t.mandatory[i("", r)] = n.exact))
              : ["min", "max"].forEach((e) => {
                  void 0 !== n[e] &&
                    ((t.mandatory = t.mandatory || {}),
                    (t.mandatory[i(e, r)] = n[e]));
                });
          }),
          e.advanced && (t.optional = (t.optional || []).concat(e.advanced)),
          t
        );
      },
      i = function (e, i) {
        if (t.version >= 61) return i(e);
        if ((e = JSON.parse(JSON.stringify(e))) && "object" == typeof e.audio) {
          const t = function (e, t, r) {
            t in e && !(r in e) && ((e[r] = e[t]), delete e[t]);
          };
          t(
            (e = JSON.parse(JSON.stringify(e))).audio,
            "autoGainControl",
            "googAutoGainControl"
          ),
            t(e.audio, "noiseSuppression", "googNoiseSuppression"),
            (e.audio = n(e.audio));
        }
        if (e && "object" == typeof e.video) {
          let o = e.video.facingMode;
          o = o && ("object" == typeof o ? o : { ideal: o });
          const a = t.version < 66;
          if (
            o &&
            ("user" === o.exact ||
              "environment" === o.exact ||
              "user" === o.ideal ||
              "environment" === o.ideal) &&
            (!r.mediaDevices.getSupportedConstraints ||
              !r.mediaDevices.getSupportedConstraints().facingMode ||
              a)
          ) {
            let t;
            if (
              (delete e.video.facingMode,
              "environment" === o.exact || "environment" === o.ideal
                ? (t = ["back", "rear"])
                : ("user" !== o.exact && "user" !== o.ideal) || (t = ["front"]),
              t)
            )
              return r.mediaDevices.enumerateDevices().then((r) => {
                let a = (r = r.filter((e) => "videoinput" === e.kind)).find(
                  (e) => t.some((t) => e.label.toLowerCase().includes(t))
                );
                return (
                  !a && r.length && t.includes("back") && (a = r[r.length - 1]),
                  a &&
                    (e.video.deviceId = o.exact
                      ? { exact: a.deviceId }
                      : { ideal: a.deviceId }),
                  (e.video = n(e.video)),
                  f("chrome: " + JSON.stringify(e)),
                  i(e)
                );
              });
          }
          e.video = n(e.video);
        }
        return f("chrome: " + JSON.stringify(e)), i(e);
      },
      o = function (e) {
        return t.version >= 64
          ? e
          : {
              name:
                {
                  PermissionDeniedError: "NotAllowedError",
                  PermissionDismissedError: "NotAllowedError",
                  InvalidStateError: "NotAllowedError",
                  DevicesNotFoundError: "NotFoundError",
                  ConstraintNotSatisfiedError: "OverconstrainedError",
                  TrackStartError: "NotReadableError",
                  MediaDeviceFailedDueToShutdown: "NotAllowedError",
                  MediaDeviceKillSwitchOn: "NotAllowedError",
                  TabCaptureError: "AbortError",
                  ScreenCaptureError: "AbortError",
                  DeviceCaptureError: "AbortError",
                }[e.name] || e.name,
              message: e.message,
              constraint: e.constraint || e.constraintName,
              toString() {
                return this.name + (this.message && ": ") + this.message;
              },
            };
      };
    if (
      ((r.getUserMedia = function (e, t, n) {
        i(e, (e) => {
          r.webkitGetUserMedia(e, t, (e) => {
            n && n(o(e));
          });
        });
      }.bind(r)),
      r.mediaDevices.getUserMedia)
    ) {
      const e = r.mediaDevices.getUserMedia.bind(r.mediaDevices);
      r.mediaDevices.getUserMedia = function (t) {
        return i(t, (t) =>
          e(t).then(
            (e) => {
              if (
                (t.audio && !e.getAudioTracks().length) ||
                (t.video && !e.getVideoTracks().length)
              )
                throw (
                  (e.getTracks().forEach((e) => {
                    e.stop();
                  }),
                  new DOMException("", "NotFoundError"))
                );
              return e;
            },
            (e) => Promise.reject(o(e))
          )
        );
      };
    }
  }
  function m(e) {
    e.MediaStream = e.MediaStream || e.webkitMediaStream;
  }
  function g(e) {
    if (
      "object" == typeof e &&
      e.RTCPeerConnection &&
      !("ontrack" in e.RTCPeerConnection.prototype)
    ) {
      Object.defineProperty(e.RTCPeerConnection.prototype, "ontrack", {
        get() {
          return this._ontrack;
        },
        set(e) {
          this._ontrack && this.removeEventListener("track", this._ontrack),
            this.addEventListener("track", (this._ontrack = e));
        },
        enumerable: !0,
        configurable: !0,
      });
      const t = e.RTCPeerConnection.prototype.setRemoteDescription;
      e.RTCPeerConnection.prototype.setRemoteDescription = function () {
        return (
          this._ontrackpoly ||
            ((this._ontrackpoly = (t) => {
              t.stream.addEventListener("addtrack", (r) => {
                let n;
                n = e.RTCPeerConnection.prototype.getReceivers
                  ? this.getReceivers().find(
                      (e) => e.track && e.track.id === r.track.id
                    )
                  : { track: r.track };
                const i = new Event("track");
                (i.track = r.track),
                  (i.receiver = n),
                  (i.transceiver = { receiver: n }),
                  (i.streams = [t.stream]),
                  this.dispatchEvent(i);
              }),
                t.stream.getTracks().forEach((r) => {
                  let n;
                  n = e.RTCPeerConnection.prototype.getReceivers
                    ? this.getReceivers().find(
                        (e) => e.track && e.track.id === r.id
                      )
                    : { track: r };
                  const i = new Event("track");
                  (i.track = r),
                    (i.receiver = n),
                    (i.transceiver = { receiver: n }),
                    (i.streams = [t.stream]),
                    this.dispatchEvent(i);
                });
            }),
            this.addEventListener("addstream", this._ontrackpoly)),
          t.apply(this, arguments)
        );
      };
    } else o(e, "track", (e) => (e.transceiver || Object.defineProperty(e, "transceiver", { value: { receiver: e.receiver } }), e));
  }
  function v(e) {
    if (
      "object" == typeof e &&
      e.RTCPeerConnection &&
      !("getSenders" in e.RTCPeerConnection.prototype) &&
      "createDTMFSender" in e.RTCPeerConnection.prototype
    ) {
      const t = function (e, t) {
        return {
          track: t,
          get dtmf() {
            return (
              void 0 === this._dtmf &&
                ("audio" === t.kind
                  ? (this._dtmf = e.createDTMFSender(t))
                  : (this._dtmf = null)),
              this._dtmf
            );
          },
          _pc: e,
        };
      };
      if (!e.RTCPeerConnection.prototype.getSenders) {
        e.RTCPeerConnection.prototype.getSenders = function () {
          return (this._senders = this._senders || []), this._senders.slice();
        };
        const r = e.RTCPeerConnection.prototype.addTrack;
        e.RTCPeerConnection.prototype.addTrack = function (e, n) {
          let i = r.apply(this, arguments);
          return i || ((i = t(this, e)), this._senders.push(i)), i;
        };
        const n = e.RTCPeerConnection.prototype.removeTrack;
        e.RTCPeerConnection.prototype.removeTrack = function (e) {
          n.apply(this, arguments);
          const t = this._senders.indexOf(e);
          -1 !== t && this._senders.splice(t, 1);
        };
      }
      const r = e.RTCPeerConnection.prototype.addStream;
      e.RTCPeerConnection.prototype.addStream = function (e) {
        (this._senders = this._senders || []),
          r.apply(this, [e]),
          e.getTracks().forEach((e) => {
            this._senders.push(t(this, e));
          });
      };
      const n = e.RTCPeerConnection.prototype.removeStream;
      e.RTCPeerConnection.prototype.removeStream = function (e) {
        (this._senders = this._senders || []),
          n.apply(this, [e]),
          e.getTracks().forEach((e) => {
            const t = this._senders.find((t) => t.track === e);
            t && this._senders.splice(this._senders.indexOf(t), 1);
          });
      };
    } else if (
      "object" == typeof e &&
      e.RTCPeerConnection &&
      "getSenders" in e.RTCPeerConnection.prototype &&
      "createDTMFSender" in e.RTCPeerConnection.prototype &&
      e.RTCRtpSender &&
      !("dtmf" in e.RTCRtpSender.prototype)
    ) {
      const t = e.RTCPeerConnection.prototype.getSenders;
      (e.RTCPeerConnection.prototype.getSenders = function () {
        const e = t.apply(this, []);
        return e.forEach((e) => (e._pc = this)), e;
      }),
        Object.defineProperty(e.RTCRtpSender.prototype, "dtmf", {
          get() {
            return (
              void 0 === this._dtmf &&
                ("audio" === this.track.kind
                  ? (this._dtmf = this._pc.createDTMFSender(this.track))
                  : (this._dtmf = null)),
              this._dtmf
            );
          },
        });
    }
  }
  function T(e) {
    if (!e.RTCPeerConnection) return;
    const t = e.RTCPeerConnection.prototype.getStats;
    e.RTCPeerConnection.prototype.getStats = function () {
      const [e, r, n] = arguments;
      if (arguments.length > 0 && "function" == typeof e)
        return t.apply(this, arguments);
      if (0 === t.length && (0 === arguments.length || "function" != typeof e))
        return t.apply(this, []);
      const i = function (e) {
          const t = {};
          return (
            e.result().forEach((e) => {
              const r = {
                id: e.id,
                timestamp: e.timestamp,
                type:
                  {
                    localcandidate: "local-candidate",
                    remotecandidate: "remote-candidate",
                  }[e.type] || e.type,
              };
              e.names().forEach((t) => {
                r[t] = e.stat(t);
              }),
                (t[r.id] = r);
            }),
            t
          );
        },
        o = function (e) {
          return new Map(Object.keys(e).map((t) => [t, e[t]]));
        };
      if (arguments.length >= 2) {
        const n = function (e) {
          r(o(i(e)));
        };
        return t.apply(this, [n, e]);
      }
      return new Promise((e, r) => {
        t.apply(this, [
          function (t) {
            e(o(i(t)));
          },
          r,
        ]);
      }).then(r, n);
    };
  }
  function b(e) {
    if (
      !(
        "object" == typeof e &&
        e.RTCPeerConnection &&
        e.RTCRtpSender &&
        e.RTCRtpReceiver
      )
    )
      return;
    if (!("getStats" in e.RTCRtpSender.prototype)) {
      const t = e.RTCPeerConnection.prototype.getSenders;
      t &&
        (e.RTCPeerConnection.prototype.getSenders = function () {
          const e = t.apply(this, []);
          return e.forEach((e) => (e._pc = this)), e;
        });
      const r = e.RTCPeerConnection.prototype.addTrack;
      r &&
        (e.RTCPeerConnection.prototype.addTrack = function () {
          const e = r.apply(this, arguments);
          return (e._pc = this), e;
        }),
        (e.RTCRtpSender.prototype.getStats = function () {
          const e = this;
          return this._pc.getStats().then((t) => h(t, e.track, !0));
        });
    }
    if (!("getStats" in e.RTCRtpReceiver.prototype)) {
      const t = e.RTCPeerConnection.prototype.getReceivers;
      t &&
        (e.RTCPeerConnection.prototype.getReceivers = function () {
          const e = t.apply(this, []);
          return e.forEach((e) => (e._pc = this)), e;
        }),
        o(e, "track", (e) => ((e.receiver._pc = e.srcElement), e)),
        (e.RTCRtpReceiver.prototype.getStats = function () {
          const e = this;
          return this._pc.getStats().then((t) => h(t, e.track, !1));
        });
    }
    if (
      !("getStats" in e.RTCRtpSender.prototype) ||
      !("getStats" in e.RTCRtpReceiver.prototype)
    )
      return;
    const t = e.RTCPeerConnection.prototype.getStats;
    e.RTCPeerConnection.prototype.getStats = function () {
      if (arguments.length > 0 && arguments[0] instanceof e.MediaStreamTrack) {
        const e = arguments[0];
        let t, r, n;
        return (
          this.getSenders().forEach((r) => {
            r.track === e && (t ? (n = !0) : (t = r));
          }),
          this.getReceivers().forEach(
            (t) => (t.track === e && (r ? (n = !0) : (r = t)), t.track === e)
          ),
          n || (t && r)
            ? Promise.reject(
                new DOMException(
                  "There are more than one sender or receiver for the track.",
                  "InvalidAccessError"
                )
              )
            : t
            ? t.getStats()
            : r
            ? r.getStats()
            : Promise.reject(
                new DOMException(
                  "There is no sender or receiver for the track.",
                  "InvalidAccessError"
                )
              )
        );
      }
      return t.apply(this, arguments);
    };
  }
  function S(e) {
    e.RTCPeerConnection.prototype.getLocalStreams = function () {
      return (
        (this._shimmedLocalStreams = this._shimmedLocalStreams || {}),
        Object.keys(this._shimmedLocalStreams).map(
          (e) => this._shimmedLocalStreams[e][0]
        )
      );
    };
    const t = e.RTCPeerConnection.prototype.addTrack;
    e.RTCPeerConnection.prototype.addTrack = function (e, r) {
      if (!r) return t.apply(this, arguments);
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      const n = t.apply(this, arguments);
      return (
        this._shimmedLocalStreams[r.id]
          ? -1 === this._shimmedLocalStreams[r.id].indexOf(n) &&
            this._shimmedLocalStreams[r.id].push(n)
          : (this._shimmedLocalStreams[r.id] = [r, n]),
        n
      );
    };
    const r = e.RTCPeerConnection.prototype.addStream;
    e.RTCPeerConnection.prototype.addStream = function (e) {
      (this._shimmedLocalStreams = this._shimmedLocalStreams || {}),
        e.getTracks().forEach((e) => {
          if (this.getSenders().find((t) => t.track === e))
            throw new DOMException(
              "Track already exists.",
              "InvalidAccessError"
            );
        });
      const t = this.getSenders();
      r.apply(this, arguments);
      const n = this.getSenders().filter((e) => -1 === t.indexOf(e));
      this._shimmedLocalStreams[e.id] = [e].concat(n);
    };
    const n = e.RTCPeerConnection.prototype.removeStream;
    e.RTCPeerConnection.prototype.removeStream = function (e) {
      return (
        (this._shimmedLocalStreams = this._shimmedLocalStreams || {}),
        delete this._shimmedLocalStreams[e.id],
        n.apply(this, arguments)
      );
    };
    const i = e.RTCPeerConnection.prototype.removeTrack;
    e.RTCPeerConnection.prototype.removeTrack = function (e) {
      return (
        (this._shimmedLocalStreams = this._shimmedLocalStreams || {}),
        e &&
          Object.keys(this._shimmedLocalStreams).forEach((t) => {
            const r = this._shimmedLocalStreams[t].indexOf(e);
            -1 !== r && this._shimmedLocalStreams[t].splice(r, 1),
              1 === this._shimmedLocalStreams[t].length &&
                delete this._shimmedLocalStreams[t];
          }),
        i.apply(this, arguments)
      );
    };
  }
  function y(e, t) {
    if (!e.RTCPeerConnection) return;
    if (e.RTCPeerConnection.prototype.addTrack && t.version >= 65) return S(e);
    const r = e.RTCPeerConnection.prototype.getLocalStreams;
    e.RTCPeerConnection.prototype.getLocalStreams = function () {
      const e = r.apply(this);
      return (
        (this._reverseStreams = this._reverseStreams || {}),
        e.map((e) => this._reverseStreams[e.id])
      );
    };
    const n = e.RTCPeerConnection.prototype.addStream;
    e.RTCPeerConnection.prototype.addStream = function (t) {
      if (
        ((this._streams = this._streams || {}),
        (this._reverseStreams = this._reverseStreams || {}),
        t.getTracks().forEach((e) => {
          if (this.getSenders().find((t) => t.track === e))
            throw new DOMException(
              "Track already exists.",
              "InvalidAccessError"
            );
        }),
        !this._reverseStreams[t.id])
      ) {
        const r = new e.MediaStream(t.getTracks());
        (this._streams[t.id] = r), (this._reverseStreams[r.id] = t), (t = r);
      }
      n.apply(this, [t]);
    };
    const i = e.RTCPeerConnection.prototype.removeStream;
    function o(e, t) {
      let r = t.sdp;
      return (
        Object.keys(e._reverseStreams || []).forEach((t) => {
          const n = e._reverseStreams[t],
            i = e._streams[n.id];
          r = r.replace(new RegExp(i.id, "g"), n.id);
        }),
        new RTCSessionDescription({ type: t.type, sdp: r })
      );
    }
    (e.RTCPeerConnection.prototype.removeStream = function (e) {
      (this._streams = this._streams || {}),
        (this._reverseStreams = this._reverseStreams || {}),
        i.apply(this, [this._streams[e.id] || e]),
        delete this._reverseStreams[
          this._streams[e.id] ? this._streams[e.id].id : e.id
        ],
        delete this._streams[e.id];
    }),
      (e.RTCPeerConnection.prototype.addTrack = function (t, r) {
        if ("closed" === this.signalingState)
          throw new DOMException(
            "The RTCPeerConnection's signalingState is 'closed'.",
            "InvalidStateError"
          );
        const n = [].slice.call(arguments, 1);
        if (1 !== n.length || !n[0].getTracks().find((e) => e === t))
          throw new DOMException(
            "The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.",
            "NotSupportedError"
          );
        if (this.getSenders().find((e) => e.track === t))
          throw new DOMException("Track already exists.", "InvalidAccessError");
        (this._streams = this._streams || {}),
          (this._reverseStreams = this._reverseStreams || {});
        const i = this._streams[r.id];
        if (i)
          i.addTrack(t),
            Promise.resolve().then(() => {
              this.dispatchEvent(new Event("negotiationneeded"));
            });
        else {
          const n = new e.MediaStream([t]);
          (this._streams[r.id] = n),
            (this._reverseStreams[n.id] = r),
            this.addStream(n);
        }
        return this.getSenders().find((e) => e.track === t);
      }),
      ["createOffer", "createAnswer"].forEach(function (t) {
        const r = e.RTCPeerConnection.prototype[t],
          n = {
            [t]() {
              const e = arguments;
              return arguments.length && "function" == typeof arguments[0]
                ? r.apply(this, [
                    (t) => {
                      const r = o(this, t);
                      e[0].apply(null, [r]);
                    },
                    (t) => {
                      e[1] && e[1].apply(null, t);
                    },
                    arguments[2],
                  ])
                : r.apply(this, arguments).then((e) => o(this, e));
            },
          };
        e.RTCPeerConnection.prototype[t] = n[t];
      });
    const a = e.RTCPeerConnection.prototype.setLocalDescription;
    e.RTCPeerConnection.prototype.setLocalDescription = function () {
      return arguments.length && arguments[0].type
        ? ((arguments[0] = (function (e, t) {
            let r = t.sdp;
            return (
              Object.keys(e._reverseStreams || []).forEach((t) => {
                const n = e._reverseStreams[t],
                  i = e._streams[n.id];
                r = r.replace(new RegExp(n.id, "g"), i.id);
              }),
              new RTCSessionDescription({ type: t.type, sdp: r })
            );
          })(this, arguments[0])),
          a.apply(this, arguments))
        : a.apply(this, arguments);
    };
    const s = Object.getOwnPropertyDescriptor(
      e.RTCPeerConnection.prototype,
      "localDescription"
    );
    Object.defineProperty(e.RTCPeerConnection.prototype, "localDescription", {
      get() {
        const e = s.get.apply(this);
        return "" === e.type ? e : o(this, e);
      },
    }),
      (e.RTCPeerConnection.prototype.removeTrack = function (e) {
        if ("closed" === this.signalingState)
          throw new DOMException(
            "The RTCPeerConnection's signalingState is 'closed'.",
            "InvalidStateError"
          );
        if (!e._pc)
          throw new DOMException(
            "Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.",
            "TypeError"
          );
        if (!(e._pc === this))
          throw new DOMException(
            "Sender was not created by this connection.",
            "InvalidAccessError"
          );
        let t;
        (this._streams = this._streams || {}),
          Object.keys(this._streams).forEach((r) => {
            this._streams[r].getTracks().find((t) => e.track === t) &&
              (t = this._streams[r]);
          }),
          t &&
            (1 === t.getTracks().length
              ? this.removeStream(this._reverseStreams[t.id])
              : t.removeTrack(e.track),
            this.dispatchEvent(new Event("negotiationneeded")));
      });
  }
  function k(e, t) {
    !e.RTCPeerConnection &&
      e.webkitRTCPeerConnection &&
      (e.RTCPeerConnection = e.webkitRTCPeerConnection),
      e.RTCPeerConnection &&
        t.version < 53 &&
        [
          "setLocalDescription",
          "setRemoteDescription",
          "addIceCandidate",
        ].forEach(function (t) {
          const r = e.RTCPeerConnection.prototype[t],
            n = {
              [t]() {
                return (
                  (arguments[0] = new (
                    "addIceCandidate" === t
                      ? e.RTCIceCandidate
                      : e.RTCSessionDescription
                  )(arguments[0])),
                  r.apply(this, arguments)
                );
              },
            };
          e.RTCPeerConnection.prototype[t] = n[t];
        });
  }
  function _(e, t) {
    o(e, "negotiationneeded", (e) => {
      const r = e.target;
      if (
        !(
          t.version < 72 ||
          (r.getConfiguration && "plan-b" === r.getConfiguration().sdpSemantics)
        ) ||
        "stable" === r.signalingState
      )
        return e;
    });
  }
  var w = Object.freeze({
    __proto__: null,
    fixNegotiationNeeded: _,
    shimAddTrackRemoveTrack: y,
    shimAddTrackRemoveTrackWithNative: S,
    shimGetDisplayMedia: function (e, t) {
      (e.navigator.mediaDevices &&
        "getDisplayMedia" in e.navigator.mediaDevices) ||
        (e.navigator.mediaDevices &&
          ("function" == typeof t
            ? (e.navigator.mediaDevices.getDisplayMedia = function (r) {
                return t(r).then((t) => {
                  const n = r.video && r.video.width,
                    i = r.video && r.video.height,
                    o = r.video && r.video.frameRate;
                  return (
                    (r.video = {
                      mandatory: {
                        chromeMediaSource: "desktop",
                        chromeMediaSourceId: t,
                        maxFrameRate: o || 3,
                      },
                    }),
                    n && (r.video.mandatory.maxWidth = n),
                    i && (r.video.mandatory.maxHeight = i),
                    e.navigator.mediaDevices.getUserMedia(r)
                  );
                });
              })
            : console.error(
                "shimGetDisplayMedia: getSourceId argument is not a function"
              )));
    },
    shimGetSendersWithDtmf: v,
    shimGetStats: T,
    shimGetUserMedia: p,
    shimMediaStream: m,
    shimOnTrack: g,
    shimPeerConnection: k,
    shimSenderReceiverGetStats: b,
  });
  function E(e, t) {
    const r = e && e.navigator,
      n = e && e.MediaStreamTrack;
    if (
      ((r.getUserMedia = function (e, t, n) {
        d("navigator.getUserMedia", "navigator.mediaDevices.getUserMedia"),
          r.mediaDevices.getUserMedia(e).then(t, n);
      }),
      !(
        t.version > 55 &&
        "autoGainControl" in r.mediaDevices.getSupportedConstraints()
      ))
    ) {
      const e = function (e, t, r) {
          t in e && !(r in e) && ((e[r] = e[t]), delete e[t]);
        },
        t = r.mediaDevices.getUserMedia.bind(r.mediaDevices);
      if (
        ((r.mediaDevices.getUserMedia = function (r) {
          return (
            "object" == typeof r &&
              "object" == typeof r.audio &&
              ((r = JSON.parse(JSON.stringify(r))),
              e(r.audio, "autoGainControl", "mozAutoGainControl"),
              e(r.audio, "noiseSuppression", "mozNoiseSuppression")),
            t(r)
          );
        }),
        n && n.prototype.getSettings)
      ) {
        const t = n.prototype.getSettings;
        n.prototype.getSettings = function () {
          const r = t.apply(this, arguments);
          return (
            e(r, "mozAutoGainControl", "autoGainControl"),
            e(r, "mozNoiseSuppression", "noiseSuppression"),
            r
          );
        };
      }
      if (n && n.prototype.applyConstraints) {
        const t = n.prototype.applyConstraints;
        n.prototype.applyConstraints = function (r) {
          return (
            "audio" === this.kind &&
              "object" == typeof r &&
              ((r = JSON.parse(JSON.stringify(r))),
              e(r, "autoGainControl", "mozAutoGainControl"),
              e(r, "noiseSuppression", "mozNoiseSuppression")),
            t.apply(this, [r])
          );
        };
      }
    }
  }
  function C(e) {
    "object" == typeof e &&
      e.RTCTrackEvent &&
      "receiver" in e.RTCTrackEvent.prototype &&
      !("transceiver" in e.RTCTrackEvent.prototype) &&
      Object.defineProperty(e.RTCTrackEvent.prototype, "transceiver", {
        get() {
          return { receiver: this.receiver };
        },
      });
  }
  function I(e, t) {
    if (
      "object" != typeof e ||
      (!e.RTCPeerConnection && !e.mozRTCPeerConnection)
    )
      return;
    !e.RTCPeerConnection &&
      e.mozRTCPeerConnection &&
      (e.RTCPeerConnection = e.mozRTCPeerConnection),
      t.version < 53 &&
        [
          "setLocalDescription",
          "setRemoteDescription",
          "addIceCandidate",
        ].forEach(function (t) {
          const r = e.RTCPeerConnection.prototype[t],
            n = {
              [t]() {
                return (
                  (arguments[0] = new (
                    "addIceCandidate" === t
                      ? e.RTCIceCandidate
                      : e.RTCSessionDescription
                  )(arguments[0])),
                  r.apply(this, arguments)
                );
              },
            };
          e.RTCPeerConnection.prototype[t] = n[t];
        });
    const r = {
        inboundrtp: "inbound-rtp",
        outboundrtp: "outbound-rtp",
        candidatepair: "candidate-pair",
        localcandidate: "local-candidate",
        remotecandidate: "remote-candidate",
      },
      n = e.RTCPeerConnection.prototype.getStats;
    e.RTCPeerConnection.prototype.getStats = function () {
      const [e, i, o] = arguments;
      return n
        .apply(this, [e || null])
        .then((e) => {
          if (t.version < 53 && !i)
            try {
              e.forEach((e) => {
                e.type = r[e.type] || e.type;
              });
            } catch (t) {
              if ("TypeError" !== t.name) throw t;
              e.forEach((t, n) => {
                e.set(n, Object.assign({}, t, { type: r[t.type] || t.type }));
              });
            }
          return e;
        })
        .then(i, o);
    };
  }
  function P(e) {
    if ("object" != typeof e || !e.RTCPeerConnection || !e.RTCRtpSender) return;
    if (e.RTCRtpSender && "getStats" in e.RTCRtpSender.prototype) return;
    const t = e.RTCPeerConnection.prototype.getSenders;
    t &&
      (e.RTCPeerConnection.prototype.getSenders = function () {
        const e = t.apply(this, []);
        return e.forEach((e) => (e._pc = this)), e;
      });
    const r = e.RTCPeerConnection.prototype.addTrack;
    r &&
      (e.RTCPeerConnection.prototype.addTrack = function () {
        const e = r.apply(this, arguments);
        return (e._pc = this), e;
      }),
      (e.RTCRtpSender.prototype.getStats = function () {
        return this.track
          ? this._pc.getStats(this.track)
          : Promise.resolve(new Map());
      });
  }
  function R(e) {
    if ("object" != typeof e || !e.RTCPeerConnection || !e.RTCRtpSender) return;
    if (e.RTCRtpSender && "getStats" in e.RTCRtpReceiver.prototype) return;
    const t = e.RTCPeerConnection.prototype.getReceivers;
    t &&
      (e.RTCPeerConnection.prototype.getReceivers = function () {
        const e = t.apply(this, []);
        return e.forEach((e) => (e._pc = this)), e;
      }),
      o(e, "track", (e) => ((e.receiver._pc = e.srcElement), e)),
      (e.RTCRtpReceiver.prototype.getStats = function () {
        return this._pc.getStats(this.track);
      });
  }
  function M(e) {
    e.RTCPeerConnection &&
      !("removeStream" in e.RTCPeerConnection.prototype) &&
      (e.RTCPeerConnection.prototype.removeStream = function (e) {
        d("removeStream", "removeTrack"),
          this.getSenders().forEach((t) => {
            t.track && e.getTracks().includes(t.track) && this.removeTrack(t);
          });
      });
  }
  function D(e) {
    e.DataChannel && !e.RTCDataChannel && (e.RTCDataChannel = e.DataChannel);
  }
  function O(e) {
    if ("object" != typeof e || !e.RTCPeerConnection) return;
    const t = e.RTCPeerConnection.prototype.addTransceiver;
    t &&
      (e.RTCPeerConnection.prototype.addTransceiver = function () {
        this.setParametersPromises = [];
        let e = arguments[1] && arguments[1].sendEncodings;
        void 0 === e && (e = []), (e = [...e]);
        const r = e.length > 0;
        r &&
          e.forEach((e) => {
            if ("rid" in e) {
              if (!/^[a-z0-9]{0,16}$/i.test(e.rid))
                throw new TypeError("Invalid RID value provided.");
            }
            if (
              "scaleResolutionDownBy" in e &&
              !(parseFloat(e.scaleResolutionDownBy) >= 1)
            )
              throw new RangeError("scale_resolution_down_by must be >= 1.0");
            if ("maxFramerate" in e && !(parseFloat(e.maxFramerate) >= 0))
              throw new RangeError("max_framerate must be >= 0.0");
          });
        const n = t.apply(this, arguments);
        if (r) {
          const { sender: t } = n,
            r = t.getParameters();
          (!("encodings" in r) ||
            (1 === r.encodings.length &&
              0 === Object.keys(r.encodings[0]).length)) &&
            ((r.encodings = e),
            (t.sendEncodings = e),
            this.setParametersPromises.push(
              t
                .setParameters(r)
                .then(() => {
                  delete t.sendEncodings;
                })
                .catch(() => {
                  delete t.sendEncodings;
                })
            ));
        }
        return n;
      });
  }
  function N(e) {
    if ("object" != typeof e || !e.RTCRtpSender) return;
    const t = e.RTCRtpSender.prototype.getParameters;
    t &&
      (e.RTCRtpSender.prototype.getParameters = function () {
        const e = t.apply(this, arguments);
        return (
          "encodings" in e ||
            (e.encodings = [].concat(this.sendEncodings || [{}])),
          e
        );
      });
  }
  function x(e) {
    if ("object" != typeof e || !e.RTCPeerConnection) return;
    const t = e.RTCPeerConnection.prototype.createOffer;
    e.RTCPeerConnection.prototype.createOffer = function () {
      return this.setParametersPromises && this.setParametersPromises.length
        ? Promise.all(this.setParametersPromises)
            .then(() => t.apply(this, arguments))
            .finally(() => {
              this.setParametersPromises = [];
            })
        : t.apply(this, arguments);
    };
  }
  function L(e) {
    if ("object" != typeof e || !e.RTCPeerConnection) return;
    const t = e.RTCPeerConnection.prototype.createAnswer;
    e.RTCPeerConnection.prototype.createAnswer = function () {
      return this.setParametersPromises && this.setParametersPromises.length
        ? Promise.all(this.setParametersPromises)
            .then(() => t.apply(this, arguments))
            .finally(() => {
              this.setParametersPromises = [];
            })
        : t.apply(this, arguments);
    };
  }
  var B = Object.freeze({
    __proto__: null,
    shimAddTransceiver: O,
    shimCreateAnswer: L,
    shimCreateOffer: x,
    shimGetDisplayMedia: function (e, t) {
      (e.navigator.mediaDevices &&
        "getDisplayMedia" in e.navigator.mediaDevices) ||
        (e.navigator.mediaDevices &&
          (e.navigator.mediaDevices.getDisplayMedia = function (r) {
            if (!r || !r.video) {
              const e = new DOMException(
                "getDisplayMedia without video constraints is undefined"
              );
              return (
                (e.name = "NotFoundError"), (e.code = 8), Promise.reject(e)
              );
            }
            return (
              !0 === r.video
                ? (r.video = { mediaSource: t })
                : (r.video.mediaSource = t),
              e.navigator.mediaDevices.getUserMedia(r)
            );
          }));
    },
    shimGetParameters: N,
    shimGetUserMedia: E,
    shimOnTrack: C,
    shimPeerConnection: I,
    shimRTCDataChannel: D,
    shimReceiverGetStats: R,
    shimRemoveStream: M,
    shimSenderGetStats: P,
  });
  function G(e) {
    if ("object" == typeof e && e.RTCPeerConnection) {
      if (
        ("getLocalStreams" in e.RTCPeerConnection.prototype ||
          (e.RTCPeerConnection.prototype.getLocalStreams = function () {
            return (
              this._localStreams || (this._localStreams = []),
              this._localStreams
            );
          }),
        !("addStream" in e.RTCPeerConnection.prototype))
      ) {
        const t = e.RTCPeerConnection.prototype.addTrack;
        (e.RTCPeerConnection.prototype.addStream = function (e) {
          this._localStreams || (this._localStreams = []),
            this._localStreams.includes(e) || this._localStreams.push(e),
            e.getAudioTracks().forEach((r) => t.call(this, r, e)),
            e.getVideoTracks().forEach((r) => t.call(this, r, e));
        }),
          (e.RTCPeerConnection.prototype.addTrack = function (e) {
            for (
              var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), i = 1;
              i < r;
              i++
            )
              n[i - 1] = arguments[i];
            return (
              n &&
                n.forEach((e) => {
                  this._localStreams
                    ? this._localStreams.includes(e) ||
                      this._localStreams.push(e)
                    : (this._localStreams = [e]);
                }),
              t.apply(this, arguments)
            );
          });
      }
      "removeStream" in e.RTCPeerConnection.prototype ||
        (e.RTCPeerConnection.prototype.removeStream = function (e) {
          this._localStreams || (this._localStreams = []);
          const t = this._localStreams.indexOf(e);
          if (-1 === t) return;
          this._localStreams.splice(t, 1);
          const r = e.getTracks();
          this.getSenders().forEach((e) => {
            r.includes(e.track) && this.removeTrack(e);
          });
        });
    }
  }
  function H(e) {
    if (
      "object" == typeof e &&
      e.RTCPeerConnection &&
      ("getRemoteStreams" in e.RTCPeerConnection.prototype ||
        (e.RTCPeerConnection.prototype.getRemoteStreams = function () {
          return this._remoteStreams ? this._remoteStreams : [];
        }),
      !("onaddstream" in e.RTCPeerConnection.prototype))
    ) {
      Object.defineProperty(e.RTCPeerConnection.prototype, "onaddstream", {
        get() {
          return this._onaddstream;
        },
        set(e) {
          this._onaddstream &&
            (this.removeEventListener("addstream", this._onaddstream),
            this.removeEventListener("track", this._onaddstreampoly)),
            this.addEventListener("addstream", (this._onaddstream = e)),
            this.addEventListener(
              "track",
              (this._onaddstreampoly = (e) => {
                e.streams.forEach((e) => {
                  if (
                    (this._remoteStreams || (this._remoteStreams = []),
                    this._remoteStreams.includes(e))
                  )
                    return;
                  this._remoteStreams.push(e);
                  const t = new Event("addstream");
                  (t.stream = e), this.dispatchEvent(t);
                });
              })
            );
        },
      });
      const t = e.RTCPeerConnection.prototype.setRemoteDescription;
      e.RTCPeerConnection.prototype.setRemoteDescription = function () {
        const e = this;
        return (
          this._onaddstreampoly ||
            this.addEventListener(
              "track",
              (this._onaddstreampoly = function (t) {
                t.streams.forEach((t) => {
                  if (
                    (e._remoteStreams || (e._remoteStreams = []),
                    e._remoteStreams.indexOf(t) >= 0)
                  )
                    return;
                  e._remoteStreams.push(t);
                  const r = new Event("addstream");
                  (r.stream = t), e.dispatchEvent(r);
                });
              })
            ),
          t.apply(e, arguments)
        );
      };
    }
  }
  function j(e) {
    if ("object" != typeof e || !e.RTCPeerConnection) return;
    const t = e.RTCPeerConnection.prototype,
      r = t.createOffer,
      n = t.createAnswer,
      i = t.setLocalDescription,
      o = t.setRemoteDescription,
      a = t.addIceCandidate;
    (t.createOffer = function (e, t) {
      const n = arguments.length >= 2 ? arguments[2] : arguments[0],
        i = r.apply(this, [n]);
      return t ? (i.then(e, t), Promise.resolve()) : i;
    }),
      (t.createAnswer = function (e, t) {
        const r = arguments.length >= 2 ? arguments[2] : arguments[0],
          i = n.apply(this, [r]);
        return t ? (i.then(e, t), Promise.resolve()) : i;
      });
    let s = function (e, t, r) {
      const n = i.apply(this, [e]);
      return r ? (n.then(t, r), Promise.resolve()) : n;
    };
    (t.setLocalDescription = s),
      (s = function (e, t, r) {
        const n = o.apply(this, [e]);
        return r ? (n.then(t, r), Promise.resolve()) : n;
      }),
      (t.setRemoteDescription = s),
      (s = function (e, t, r) {
        const n = a.apply(this, [e]);
        return r ? (n.then(t, r), Promise.resolve()) : n;
      }),
      (t.addIceCandidate = s);
  }
  function F(e) {
    const t = e && e.navigator;
    if (t.mediaDevices && t.mediaDevices.getUserMedia) {
      const e = t.mediaDevices,
        r = e.getUserMedia.bind(e);
      t.mediaDevices.getUserMedia = (e) => r(V(e));
    }
    !t.getUserMedia &&
      t.mediaDevices &&
      t.mediaDevices.getUserMedia &&
      (t.getUserMedia = function (e, r, n) {
        t.mediaDevices.getUserMedia(e).then(r, n);
      }.bind(t));
  }
  function V(e) {
    return e && void 0 !== e.video
      ? Object.assign({}, e, { video: l(e.video) })
      : e;
  }
  function U(e) {
    if (!e.RTCPeerConnection) return;
    const t = e.RTCPeerConnection;
    (e.RTCPeerConnection = function (e, r) {
      if (e && e.iceServers) {
        const t = [];
        for (let r = 0; r < e.iceServers.length; r++) {
          let n = e.iceServers[r];
          void 0 === n.urls && n.url
            ? (d("RTCIceServer.url", "RTCIceServer.urls"),
              (n = JSON.parse(JSON.stringify(n))),
              (n.urls = n.url),
              delete n.url,
              t.push(n))
            : t.push(e.iceServers[r]);
        }
        e.iceServers = t;
      }
      return new t(e, r);
    }),
      (e.RTCPeerConnection.prototype = t.prototype),
      "generateCertificate" in t &&
        Object.defineProperty(e.RTCPeerConnection, "generateCertificate", {
          get: () => t.generateCertificate,
        });
  }
  function q(e) {
    "object" == typeof e &&
      e.RTCTrackEvent &&
      "receiver" in e.RTCTrackEvent.prototype &&
      !("transceiver" in e.RTCTrackEvent.prototype) &&
      Object.defineProperty(e.RTCTrackEvent.prototype, "transceiver", {
        get() {
          return { receiver: this.receiver };
        },
      });
  }
  function Q(e) {
    const t = e.RTCPeerConnection.prototype.createOffer;
    e.RTCPeerConnection.prototype.createOffer = function (e) {
      if (e) {
        void 0 !== e.offerToReceiveAudio &&
          (e.offerToReceiveAudio = !!e.offerToReceiveAudio);
        const t = this.getTransceivers().find(
          (e) => "audio" === e.receiver.track.kind
        );
        !1 === e.offerToReceiveAudio && t
          ? "sendrecv" === t.direction
            ? t.setDirection
              ? t.setDirection("sendonly")
              : (t.direction = "sendonly")
            : "recvonly" === t.direction &&
              (t.setDirection
                ? t.setDirection("inactive")
                : (t.direction = "inactive"))
          : !0 !== e.offerToReceiveAudio ||
            t ||
            this.addTransceiver("audio", { direction: "recvonly" }),
          void 0 !== e.offerToReceiveVideo &&
            (e.offerToReceiveVideo = !!e.offerToReceiveVideo);
        const r = this.getTransceivers().find(
          (e) => "video" === e.receiver.track.kind
        );
        !1 === e.offerToReceiveVideo && r
          ? "sendrecv" === r.direction
            ? r.setDirection
              ? r.setDirection("sendonly")
              : (r.direction = "sendonly")
            : "recvonly" === r.direction &&
              (r.setDirection
                ? r.setDirection("inactive")
                : (r.direction = "inactive"))
          : !0 !== e.offerToReceiveVideo ||
            r ||
            this.addTransceiver("video", { direction: "recvonly" });
      }
      return t.apply(this, arguments);
    };
  }
  function W(e) {
    "object" != typeof e ||
      e.AudioContext ||
      (e.AudioContext = e.webkitAudioContext);
  }
  var z = Object.freeze({
      __proto__: null,
      shimAudioContext: W,
      shimCallbacksAPI: j,
      shimConstraints: V,
      shimCreateOfferLegacy: Q,
      shimGetUserMedia: F,
      shimLocalStreamsAPI: G,
      shimRTCIceServerUrls: U,
      shimRemoteStreamsAPI: H,
      shimTrackEventTransceiver: q,
    }),
    X =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : {};
  function K(e) {
    return e &&
      e.__esModule &&
      Object.prototype.hasOwnProperty.call(e, "default")
      ? e.default
      : e;
  }
  var J = { exports: {} };
  !(function (e) {
    const t = {
      generateIdentifier: function () {
        return Math.random().toString(36).substring(2, 12);
      },
    };
    (t.localCName = t.generateIdentifier()),
      (t.splitLines = function (e) {
        return e
          .trim()
          .split("\n")
          .map((e) => e.trim());
      }),
      (t.splitSections = function (e) {
        return e
          .split("\nm=")
          .map((e, t) => (t > 0 ? "m=" + e : e).trim() + "\r\n");
      }),
      (t.getDescription = function (e) {
        const r = t.splitSections(e);
        return r && r[0];
      }),
      (t.getMediaSections = function (e) {
        const r = t.splitSections(e);
        return r.shift(), r;
      }),
      (t.matchPrefix = function (e, r) {
        return t.splitLines(e).filter((e) => 0 === e.indexOf(r));
      }),
      (t.parseCandidate = function (e) {
        let t;
        t =
          0 === e.indexOf("a=candidate:")
            ? e.substring(12).split(" ")
            : e.substring(10).split(" ");
        const r = {
          foundation: t[0],
          component: { 1: "rtp", 2: "rtcp" }[t[1]] || t[1],
          protocol: t[2].toLowerCase(),
          priority: parseInt(t[3], 10),
          ip: t[4],
          address: t[4],
          port: parseInt(t[5], 10),
          type: t[7],
        };
        for (let e = 8; e < t.length; e += 2)
          switch (t[e]) {
            case "raddr":
              r.relatedAddress = t[e + 1];
              break;
            case "rport":
              r.relatedPort = parseInt(t[e + 1], 10);
              break;
            case "tcptype":
              r.tcpType = t[e + 1];
              break;
            case "ufrag":
              (r.ufrag = t[e + 1]), (r.usernameFragment = t[e + 1]);
              break;
            default:
              void 0 === r[t[e]] && (r[t[e]] = t[e + 1]);
          }
        return r;
      }),
      (t.writeCandidate = function (e) {
        const t = [];
        t.push(e.foundation);
        const r = e.component;
        "rtp" === r ? t.push(1) : "rtcp" === r ? t.push(2) : t.push(r),
          t.push(e.protocol.toUpperCase()),
          t.push(e.priority),
          t.push(e.address || e.ip),
          t.push(e.port);
        const n = e.type;
        return (
          t.push("typ"),
          t.push(n),
          "host" !== n &&
            e.relatedAddress &&
            e.relatedPort &&
            (t.push("raddr"),
            t.push(e.relatedAddress),
            t.push("rport"),
            t.push(e.relatedPort)),
          e.tcpType &&
            "tcp" === e.protocol.toLowerCase() &&
            (t.push("tcptype"), t.push(e.tcpType)),
          (e.usernameFragment || e.ufrag) &&
            (t.push("ufrag"), t.push(e.usernameFragment || e.ufrag)),
          "candidate:" + t.join(" ")
        );
      }),
      (t.parseIceOptions = function (e) {
        return e.substring(14).split(" ");
      }),
      (t.parseRtpMap = function (e) {
        let t = e.substring(9).split(" ");
        const r = { payloadType: parseInt(t.shift(), 10) };
        return (
          (t = t[0].split("/")),
          (r.name = t[0]),
          (r.clockRate = parseInt(t[1], 10)),
          (r.channels = 3 === t.length ? parseInt(t[2], 10) : 1),
          (r.numChannels = r.channels),
          r
        );
      }),
      (t.writeRtpMap = function (e) {
        let t = e.payloadType;
        void 0 !== e.preferredPayloadType && (t = e.preferredPayloadType);
        const r = e.channels || e.numChannels || 1;
        return (
          "a=rtpmap:" +
          t +
          " " +
          e.name +
          "/" +
          e.clockRate +
          (1 !== r ? "/" + r : "") +
          "\r\n"
        );
      }),
      (t.parseExtmap = function (e) {
        const t = e.substring(9).split(" ");
        return {
          id: parseInt(t[0], 10),
          direction: t[0].indexOf("/") > 0 ? t[0].split("/")[1] : "sendrecv",
          uri: t[1],
          attributes: t.slice(2).join(" "),
        };
      }),
      (t.writeExtmap = function (e) {
        return (
          "a=extmap:" +
          (e.id || e.preferredId) +
          (e.direction && "sendrecv" !== e.direction ? "/" + e.direction : "") +
          " " +
          e.uri +
          (e.attributes ? " " + e.attributes : "") +
          "\r\n"
        );
      }),
      (t.parseFmtp = function (e) {
        const t = {};
        let r;
        const n = e.substring(e.indexOf(" ") + 1).split(";");
        for (let e = 0; e < n.length; e++)
          (r = n[e].trim().split("=")), (t[r[0].trim()] = r[1]);
        return t;
      }),
      (t.writeFmtp = function (e) {
        let t = "",
          r = e.payloadType;
        if (
          (void 0 !== e.preferredPayloadType && (r = e.preferredPayloadType),
          e.parameters && Object.keys(e.parameters).length)
        ) {
          const n = [];
          Object.keys(e.parameters).forEach((t) => {
            void 0 !== e.parameters[t]
              ? n.push(t + "=" + e.parameters[t])
              : n.push(t);
          }),
            (t += "a=fmtp:" + r + " " + n.join(";") + "\r\n");
        }
        return t;
      }),
      (t.parseRtcpFb = function (e) {
        const t = e.substring(e.indexOf(" ") + 1).split(" ");
        return { type: t.shift(), parameter: t.join(" ") };
      }),
      (t.writeRtcpFb = function (e) {
        let t = "",
          r = e.payloadType;
        return (
          void 0 !== e.preferredPayloadType && (r = e.preferredPayloadType),
          e.rtcpFeedback &&
            e.rtcpFeedback.length &&
            e.rtcpFeedback.forEach((e) => {
              t +=
                "a=rtcp-fb:" +
                r +
                " " +
                e.type +
                (e.parameter && e.parameter.length ? " " + e.parameter : "") +
                "\r\n";
            }),
          t
        );
      }),
      (t.parseSsrcMedia = function (e) {
        const t = e.indexOf(" "),
          r = { ssrc: parseInt(e.substring(7, t), 10) },
          n = e.indexOf(":", t);
        return (
          n > -1
            ? ((r.attribute = e.substring(t + 1, n)),
              (r.value = e.substring(n + 1)))
            : (r.attribute = e.substring(t + 1)),
          r
        );
      }),
      (t.parseSsrcGroup = function (e) {
        const t = e.substring(13).split(" ");
        return { semantics: t.shift(), ssrcs: t.map((e) => parseInt(e, 10)) };
      }),
      (t.getMid = function (e) {
        const r = t.matchPrefix(e, "a=mid:")[0];
        if (r) return r.substring(6);
      }),
      (t.parseFingerprint = function (e) {
        const t = e.substring(14).split(" ");
        return { algorithm: t[0].toLowerCase(), value: t[1].toUpperCase() };
      }),
      (t.getDtlsParameters = function (e, r) {
        return {
          role: "auto",
          fingerprints: t
            .matchPrefix(e + r, "a=fingerprint:")
            .map(t.parseFingerprint),
        };
      }),
      (t.writeDtlsParameters = function (e, t) {
        let r = "a=setup:" + t + "\r\n";
        return (
          e.fingerprints.forEach((e) => {
            r += "a=fingerprint:" + e.algorithm + " " + e.value + "\r\n";
          }),
          r
        );
      }),
      (t.parseCryptoLine = function (e) {
        const t = e.substring(9).split(" ");
        return {
          tag: parseInt(t[0], 10),
          cryptoSuite: t[1],
          keyParams: t[2],
          sessionParams: t.slice(3),
        };
      }),
      (t.writeCryptoLine = function (e) {
        return (
          "a=crypto:" +
          e.tag +
          " " +
          e.cryptoSuite +
          " " +
          ("object" == typeof e.keyParams
            ? t.writeCryptoKeyParams(e.keyParams)
            : e.keyParams) +
          (e.sessionParams ? " " + e.sessionParams.join(" ") : "") +
          "\r\n"
        );
      }),
      (t.parseCryptoKeyParams = function (e) {
        if (0 !== e.indexOf("inline:")) return null;
        const t = e.substring(7).split("|");
        return {
          keyMethod: "inline",
          keySalt: t[0],
          lifeTime: t[1],
          mkiValue: t[2] ? t[2].split(":")[0] : void 0,
          mkiLength: t[2] ? t[2].split(":")[1] : void 0,
        };
      }),
      (t.writeCryptoKeyParams = function (e) {
        return (
          e.keyMethod +
          ":" +
          e.keySalt +
          (e.lifeTime ? "|" + e.lifeTime : "") +
          (e.mkiValue && e.mkiLength
            ? "|" + e.mkiValue + ":" + e.mkiLength
            : "")
        );
      }),
      (t.getCryptoParameters = function (e, r) {
        return t.matchPrefix(e + r, "a=crypto:").map(t.parseCryptoLine);
      }),
      (t.getIceParameters = function (e, r) {
        const n = t.matchPrefix(e + r, "a=ice-ufrag:")[0],
          i = t.matchPrefix(e + r, "a=ice-pwd:")[0];
        return n && i
          ? { usernameFragment: n.substring(12), password: i.substring(10) }
          : null;
      }),
      (t.writeIceParameters = function (e) {
        let t =
          "a=ice-ufrag:" +
          e.usernameFragment +
          "\r\na=ice-pwd:" +
          e.password +
          "\r\n";
        return e.iceLite && (t += "a=ice-lite\r\n"), t;
      }),
      (t.parseRtpParameters = function (e) {
        const r = {
            codecs: [],
            headerExtensions: [],
            fecMechanisms: [],
            rtcp: [],
          },
          n = t.splitLines(e)[0].split(" ");
        r.profile = n[2];
        for (let i = 3; i < n.length; i++) {
          const o = n[i],
            a = t.matchPrefix(e, "a=rtpmap:" + o + " ")[0];
          if (a) {
            const n = t.parseRtpMap(a),
              i = t.matchPrefix(e, "a=fmtp:" + o + " ");
            switch (
              ((n.parameters = i.length ? t.parseFmtp(i[0]) : {}),
              (n.rtcpFeedback = t
                .matchPrefix(e, "a=rtcp-fb:" + o + " ")
                .map(t.parseRtcpFb)),
              r.codecs.push(n),
              n.name.toUpperCase())
            ) {
              case "RED":
              case "ULPFEC":
                r.fecMechanisms.push(n.name.toUpperCase());
            }
          }
        }
        t.matchPrefix(e, "a=extmap:").forEach((e) => {
          r.headerExtensions.push(t.parseExtmap(e));
        });
        const i = t.matchPrefix(e, "a=rtcp-fb:* ").map(t.parseRtcpFb);
        return (
          r.codecs.forEach((e) => {
            i.forEach((t) => {
              e.rtcpFeedback.find(
                (e) => e.type === t.type && e.parameter === t.parameter
              ) || e.rtcpFeedback.push(t);
            });
          }),
          r
        );
      }),
      (t.writeRtpDescription = function (e, r) {
        let n = "";
        (n += "m=" + e + " "),
          (n += r.codecs.length > 0 ? "9" : "0"),
          (n += " " + (r.profile || "UDP/TLS/RTP/SAVPF") + " "),
          (n +=
            r.codecs
              .map((e) =>
                void 0 !== e.preferredPayloadType
                  ? e.preferredPayloadType
                  : e.payloadType
              )
              .join(" ") + "\r\n"),
          (n += "c=IN IP4 0.0.0.0\r\n"),
          (n += "a=rtcp:9 IN IP4 0.0.0.0\r\n"),
          r.codecs.forEach((e) => {
            (n += t.writeRtpMap(e)),
              (n += t.writeFmtp(e)),
              (n += t.writeRtcpFb(e));
          });
        let i = 0;
        return (
          r.codecs.forEach((e) => {
            e.maxptime > i && (i = e.maxptime);
          }),
          i > 0 && (n += "a=maxptime:" + i + "\r\n"),
          r.headerExtensions &&
            r.headerExtensions.forEach((e) => {
              n += t.writeExtmap(e);
            }),
          n
        );
      }),
      (t.parseRtpEncodingParameters = function (e) {
        const r = [],
          n = t.parseRtpParameters(e),
          i = -1 !== n.fecMechanisms.indexOf("RED"),
          o = -1 !== n.fecMechanisms.indexOf("ULPFEC"),
          a = t
            .matchPrefix(e, "a=ssrc:")
            .map((e) => t.parseSsrcMedia(e))
            .filter((e) => "cname" === e.attribute),
          s = a.length > 0 && a[0].ssrc;
        let c;
        const d = t.matchPrefix(e, "a=ssrc-group:FID").map((e) =>
          e
            .substring(17)
            .split(" ")
            .map((e) => parseInt(e, 10))
        );
        d.length > 0 && d[0].length > 1 && d[0][0] === s && (c = d[0][1]),
          n.codecs.forEach((e) => {
            if ("RTX" === e.name.toUpperCase() && e.parameters.apt) {
              let t = {
                ssrc: s,
                codecPayloadType: parseInt(e.parameters.apt, 10),
              };
              s && c && (t.rtx = { ssrc: c }),
                r.push(t),
                i &&
                  ((t = JSON.parse(JSON.stringify(t))),
                  (t.fec = { ssrc: s, mechanism: o ? "red+ulpfec" : "red" }),
                  r.push(t));
            }
          }),
          0 === r.length && s && r.push({ ssrc: s });
        let u = t.matchPrefix(e, "b=");
        return (
          u.length &&
            ((u =
              0 === u[0].indexOf("b=TIAS:")
                ? parseInt(u[0].substring(7), 10)
                : 0 === u[0].indexOf("b=AS:")
                ? 1e3 * parseInt(u[0].substring(5), 10) * 0.95 - 16e3
                : void 0),
            r.forEach((e) => {
              e.maxBitrate = u;
            })),
          r
        );
      }),
      (t.parseRtcpParameters = function (e) {
        const r = {},
          n = t
            .matchPrefix(e, "a=ssrc:")
            .map((e) => t.parseSsrcMedia(e))
            .filter((e) => "cname" === e.attribute)[0];
        n && ((r.cname = n.value), (r.ssrc = n.ssrc));
        const i = t.matchPrefix(e, "a=rtcp-rsize");
        (r.reducedSize = i.length > 0), (r.compound = 0 === i.length);
        const o = t.matchPrefix(e, "a=rtcp-mux");
        return (r.mux = o.length > 0), r;
      }),
      (t.writeRtcpParameters = function (e) {
        let t = "";
        return (
          e.reducedSize && (t += "a=rtcp-rsize\r\n"),
          e.mux && (t += "a=rtcp-mux\r\n"),
          void 0 !== e.ssrc &&
            e.cname &&
            (t += "a=ssrc:" + e.ssrc + " cname:" + e.cname + "\r\n"),
          t
        );
      }),
      (t.parseMsid = function (e) {
        let r;
        const n = t.matchPrefix(e, "a=msid:");
        if (1 === n.length)
          return (
            (r = n[0].substring(7).split(" ")), { stream: r[0], track: r[1] }
          );
        const i = t
          .matchPrefix(e, "a=ssrc:")
          .map((e) => t.parseSsrcMedia(e))
          .filter((e) => "msid" === e.attribute);
        return i.length > 0
          ? ((r = i[0].value.split(" ")), { stream: r[0], track: r[1] })
          : void 0;
      }),
      (t.parseSctpDescription = function (e) {
        const r = t.parseMLine(e),
          n = t.matchPrefix(e, "a=max-message-size:");
        let i;
        n.length > 0 && (i = parseInt(n[0].substring(19), 10)),
          isNaN(i) && (i = 65536);
        const o = t.matchPrefix(e, "a=sctp-port:");
        if (o.length > 0)
          return {
            port: parseInt(o[0].substring(12), 10),
            protocol: r.fmt,
            maxMessageSize: i,
          };
        const a = t.matchPrefix(e, "a=sctpmap:");
        if (a.length > 0) {
          const e = a[0].substring(10).split(" ");
          return {
            port: parseInt(e[0], 10),
            protocol: e[1],
            maxMessageSize: i,
          };
        }
      }),
      (t.writeSctpDescription = function (e, t) {
        let r = [];
        return (
          (r =
            "DTLS/SCTP" !== e.protocol
              ? [
                  "m=" +
                    e.kind +
                    " 9 " +
                    e.protocol +
                    " " +
                    t.protocol +
                    "\r\n",
                  "c=IN IP4 0.0.0.0\r\n",
                  "a=sctp-port:" + t.port + "\r\n",
                ]
              : [
                  "m=" + e.kind + " 9 " + e.protocol + " " + t.port + "\r\n",
                  "c=IN IP4 0.0.0.0\r\n",
                  "a=sctpmap:" + t.port + " " + t.protocol + " 65535\r\n",
                ]),
          void 0 !== t.maxMessageSize &&
            r.push("a=max-message-size:" + t.maxMessageSize + "\r\n"),
          r.join("")
        );
      }),
      (t.generateSessionId = function () {
        return Math.random().toString().substr(2, 22);
      }),
      (t.writeSessionBoilerplate = function (e, r, n) {
        let i;
        const o = void 0 !== r ? r : 2;
        i = e || t.generateSessionId();
        return (
          "v=0\r\no=" +
          (n || "thisisadapterortc") +
          " " +
          i +
          " " +
          o +
          " IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n"
        );
      }),
      (t.getDirection = function (e, r) {
        const n = t.splitLines(e);
        for (let e = 0; e < n.length; e++)
          switch (n[e]) {
            case "a=sendrecv":
            case "a=sendonly":
            case "a=recvonly":
            case "a=inactive":
              return n[e].substring(2);
          }
        return r ? t.getDirection(r) : "sendrecv";
      }),
      (t.getKind = function (e) {
        return t.splitLines(e)[0].split(" ")[0].substring(2);
      }),
      (t.isRejected = function (e) {
        return "0" === e.split(" ", 2)[1];
      }),
      (t.parseMLine = function (e) {
        const r = t.splitLines(e)[0].substring(2).split(" ");
        return {
          kind: r[0],
          port: parseInt(r[1], 10),
          protocol: r[2],
          fmt: r.slice(3).join(" "),
        };
      }),
      (t.parseOLine = function (e) {
        const r = t.matchPrefix(e, "o=")[0].substring(2).split(" ");
        return {
          username: r[0],
          sessionId: r[1],
          sessionVersion: parseInt(r[2], 10),
          netType: r[3],
          addressType: r[4],
          address: r[5],
        };
      }),
      (t.isValidSDP = function (e) {
        if ("string" != typeof e || 0 === e.length) return !1;
        const r = t.splitLines(e);
        for (let e = 0; e < r.length; e++)
          if (r[e].length < 2 || "=" !== r[e].charAt(1)) return !1;
        return !0;
      }),
      (e.exports = t);
  })(J);
  var Z = J.exports,
    Y = K(Z),
    $ = t({ __proto__: null, default: Y }, [Z]);
  function ee(e) {
    if (
      !e.RTCIceCandidate ||
      (e.RTCIceCandidate && "foundation" in e.RTCIceCandidate.prototype)
    )
      return;
    const t = e.RTCIceCandidate;
    (e.RTCIceCandidate = function (e) {
      if (
        ("object" == typeof e &&
          e.candidate &&
          0 === e.candidate.indexOf("a=") &&
          ((e = JSON.parse(JSON.stringify(e))).candidate =
            e.candidate.substring(2)),
        e.candidate && e.candidate.length)
      ) {
        const r = new t(e),
          n = Y.parseCandidate(e.candidate);
        for (const e in n)
          e in r || Object.defineProperty(r, e, { value: n[e] });
        return (
          (r.toJSON = function () {
            return {
              candidate: r.candidate,
              sdpMid: r.sdpMid,
              sdpMLineIndex: r.sdpMLineIndex,
              usernameFragment: r.usernameFragment,
            };
          }),
          r
        );
      }
      return new t(e);
    }),
      (e.RTCIceCandidate.prototype = t.prototype),
      o(
        e,
        "icecandidate",
        (t) => (
          t.candidate &&
            Object.defineProperty(t, "candidate", {
              value: new e.RTCIceCandidate(t.candidate),
              writable: "false",
            }),
          t
        )
      );
  }
  function te(e) {
    !e.RTCIceCandidate ||
      (e.RTCIceCandidate && "relayProtocol" in e.RTCIceCandidate.prototype) ||
      o(e, "icecandidate", (e) => {
        if (e.candidate) {
          const t = Y.parseCandidate(e.candidate.candidate);
          "relay" === t.type &&
            (e.candidate.relayProtocol = { 0: "tls", 1: "tcp", 2: "udp" }[
              t.priority >> 24
            ]);
        }
        return e;
      });
  }
  function re(e, t) {
    if (!e.RTCPeerConnection) return;
    "sctp" in e.RTCPeerConnection.prototype ||
      Object.defineProperty(e.RTCPeerConnection.prototype, "sctp", {
        get() {
          return void 0 === this._sctp ? null : this._sctp;
        },
      });
    const r = e.RTCPeerConnection.prototype.setRemoteDescription;
    e.RTCPeerConnection.prototype.setRemoteDescription = function () {
      if (((this._sctp = null), "chrome" === t.browser && t.version >= 76)) {
        const { sdpSemantics: e } = this.getConfiguration();
        "plan-b" === e &&
          Object.defineProperty(this, "sctp", {
            get() {
              return void 0 === this._sctp ? null : this._sctp;
            },
            enumerable: !0,
            configurable: !0,
          });
      }
      if (
        (function (e) {
          if (!e || !e.sdp) return !1;
          const t = Y.splitSections(e.sdp);
          return (
            t.shift(),
            t.some((e) => {
              const t = Y.parseMLine(e);
              return (
                t &&
                "application" === t.kind &&
                -1 !== t.protocol.indexOf("SCTP")
              );
            })
          );
        })(arguments[0])
      ) {
        const e = (function (e) {
            const t = e.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
            if (null === t || t.length < 2) return -1;
            const r = parseInt(t[1], 10);
            return r != r ? -1 : r;
          })(arguments[0]),
          r = (function (e) {
            let r = 65536;
            return (
              "firefox" === t.browser &&
                (r =
                  t.version < 57
                    ? -1 === e
                      ? 16384
                      : 2147483637
                    : t.version < 60
                    ? 57 === t.version
                      ? 65535
                      : 65536
                    : 2147483637),
              r
            );
          })(e),
          n = (function (e, r) {
            let n = 65536;
            "firefox" === t.browser && 57 === t.version && (n = 65535);
            const i = Y.matchPrefix(e.sdp, "a=max-message-size:");
            return (
              i.length > 0
                ? (n = parseInt(i[0].substring(19), 10))
                : "firefox" === t.browser && -1 !== r && (n = 2147483637),
              n
            );
          })(arguments[0], e);
        let i;
        i =
          0 === r && 0 === n
            ? Number.POSITIVE_INFINITY
            : 0 === r || 0 === n
            ? Math.max(r, n)
            : Math.min(r, n);
        const o = {};
        Object.defineProperty(o, "maxMessageSize", { get: () => i }),
          (this._sctp = o);
      }
      return r.apply(this, arguments);
    };
  }
  function ne(e) {
    if (
      !e.RTCPeerConnection ||
      !("createDataChannel" in e.RTCPeerConnection.prototype)
    )
      return;
    function t(e, t) {
      const r = e.send;
      e.send = function () {
        const n = arguments[0],
          i = n.length || n.size || n.byteLength;
        if ("open" === e.readyState && t.sctp && i > t.sctp.maxMessageSize)
          throw new TypeError(
            "Message too large (can send a maximum of " +
              t.sctp.maxMessageSize +
              " bytes)"
          );
        return r.apply(e, arguments);
      };
    }
    const r = e.RTCPeerConnection.prototype.createDataChannel;
    (e.RTCPeerConnection.prototype.createDataChannel = function () {
      const e = r.apply(this, arguments);
      return t(e, this), e;
    }),
      o(e, "datachannel", (e) => (t(e.channel, e.target), e));
  }
  function ie(e) {
    if (
      !e.RTCPeerConnection ||
      "connectionState" in e.RTCPeerConnection.prototype
    )
      return;
    const t = e.RTCPeerConnection.prototype;
    Object.defineProperty(t, "connectionState", {
      get() {
        return (
          { completed: "connected", checking: "connecting" }[
            this.iceConnectionState
          ] || this.iceConnectionState
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
      Object.defineProperty(t, "onconnectionstatechange", {
        get() {
          return this._onconnectionstatechange || null;
        },
        set(e) {
          this._onconnectionstatechange &&
            (this.removeEventListener(
              "connectionstatechange",
              this._onconnectionstatechange
            ),
            delete this._onconnectionstatechange),
            e &&
              this.addEventListener(
                "connectionstatechange",
                (this._onconnectionstatechange = e)
              );
        },
        enumerable: !0,
        configurable: !0,
      }),
      ["setLocalDescription", "setRemoteDescription"].forEach((e) => {
        const r = t[e];
        t[e] = function () {
          return (
            this._connectionstatechangepoly ||
              ((this._connectionstatechangepoly = (e) => {
                const t = e.target;
                if (t._lastConnectionState !== t.connectionState) {
                  t._lastConnectionState = t.connectionState;
                  const r = new Event("connectionstatechange", e);
                  t.dispatchEvent(r);
                }
                return e;
              }),
              this.addEventListener(
                "iceconnectionstatechange",
                this._connectionstatechangepoly
              )),
            r.apply(this, arguments)
          );
        };
      });
  }
  function oe(e, t) {
    if (!e.RTCPeerConnection) return;
    if ("chrome" === t.browser && t.version >= 71) return;
    if ("safari" === t.browser && t.version >= 605) return;
    const r = e.RTCPeerConnection.prototype.setRemoteDescription;
    e.RTCPeerConnection.prototype.setRemoteDescription = function (t) {
      if (t && t.sdp && -1 !== t.sdp.indexOf("\na=extmap-allow-mixed")) {
        const r = t.sdp
          .split("\n")
          .filter((e) => "a=extmap-allow-mixed" !== e.trim())
          .join("\n");
        e.RTCSessionDescription && t instanceof e.RTCSessionDescription
          ? (arguments[0] = new e.RTCSessionDescription({
              type: t.type,
              sdp: r,
            }))
          : (t.sdp = r);
      }
      return r.apply(this, arguments);
    };
  }
  function ae(e, t) {
    if (!e.RTCPeerConnection || !e.RTCPeerConnection.prototype) return;
    const r = e.RTCPeerConnection.prototype.addIceCandidate;
    r &&
      0 !== r.length &&
      (e.RTCPeerConnection.prototype.addIceCandidate = function () {
        return arguments[0]
          ? (("chrome" === t.browser && t.version < 78) ||
              ("firefox" === t.browser && t.version < 68) ||
              "safari" === t.browser) &&
            arguments[0] &&
            "" === arguments[0].candidate
            ? Promise.resolve()
            : r.apply(this, arguments)
          : (arguments[1] && arguments[1].apply(null), Promise.resolve());
      });
  }
  function se(e, t) {
    if (!e.RTCPeerConnection || !e.RTCPeerConnection.prototype) return;
    const r = e.RTCPeerConnection.prototype.setLocalDescription;
    r &&
      0 !== r.length &&
      (e.RTCPeerConnection.prototype.setLocalDescription = function () {
        let e = arguments[0] || {};
        if ("object" != typeof e || (e.type && e.sdp))
          return r.apply(this, arguments);
        if (((e = { type: e.type, sdp: e.sdp }), !e.type))
          switch (this.signalingState) {
            case "stable":
            case "have-local-offer":
            case "have-remote-pranswer":
              e.type = "offer";
              break;
            default:
              e.type = "answer";
          }
        if (e.sdp || ("offer" !== e.type && "answer" !== e.type))
          return r.apply(this, [e]);
        return ("offer" === e.type ? this.createOffer : this.createAnswer)
          .apply(this)
          .then((e) => r.apply(this, [e]));
      });
  }
  var ce = Object.freeze({
    __proto__: null,
    removeExtmapAllowMixed: oe,
    shimAddIceCandidateNullOrEmpty: ae,
    shimConnectionState: ie,
    shimMaxMessageSize: re,
    shimParameterlessSetLocalDescription: se,
    shimRTCIceCandidate: ee,
    shimRTCIceCandidateRelayProtocol: te,
    shimSendThrowTypeError: ne,
  });
  const de = (function () {
    let { window: e } =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
      t =
        arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : { shimChrome: !0, shimFirefox: !0, shimSafari: !0 };
    const r = c,
      n = (function (e) {
        const t = { browser: null, version: null };
        if (void 0 === e || !e.navigator || !e.navigator.userAgent)
          return (t.browser = "Not a browser."), t;
        const { navigator: r } = e;
        if (r.mozGetUserMedia)
          (t.browser = "firefox"),
            (t.version = i(r.userAgent, /Firefox\/(\d+)\./, 1));
        else if (
          r.webkitGetUserMedia ||
          (!1 === e.isSecureContext && e.webkitRTCPeerConnection)
        )
          (t.browser = "chrome"),
            (t.version = i(r.userAgent, /Chrom(e|ium)\/(\d+)\./, 2));
        else {
          if (
            !e.RTCPeerConnection ||
            !r.userAgent.match(/AppleWebKit\/(\d+)\./)
          )
            return (t.browser = "Not a supported browser."), t;
          (t.browser = "safari"),
            (t.version = i(r.userAgent, /AppleWebKit\/(\d+)\./, 1)),
            (t.supportsUnifiedPlan =
              e.RTCRtpTransceiver &&
              "currentDirection" in e.RTCRtpTransceiver.prototype);
        }
        return t;
      })(e),
      o = {
        browserDetails: n,
        commonShim: ce,
        extractVersion: i,
        disableLog: a,
        disableWarnings: s,
        sdp: $,
      };
    switch (n.browser) {
      case "chrome":
        if (!w || !k || !t.shimChrome)
          return r("Chrome shim is not included in this adapter release."), o;
        if (null === n.version)
          return r("Chrome shim can not determine version, not shimming."), o;
        r("adapter.js shimming chrome."),
          (o.browserShim = w),
          ae(e, n),
          se(e),
          p(e, n),
          m(e),
          k(e, n),
          g(e),
          y(e, n),
          v(e),
          T(e),
          b(e),
          _(e, n),
          ee(e),
          te(e),
          ie(e),
          re(e, n),
          ne(e),
          oe(e, n);
        break;
      case "firefox":
        if (!B || !I || !t.shimFirefox)
          return r("Firefox shim is not included in this adapter release."), o;
        r("adapter.js shimming firefox."),
          (o.browserShim = B),
          ae(e, n),
          se(e),
          E(e, n),
          I(e, n),
          C(e),
          M(e),
          P(e),
          R(e),
          D(e),
          O(e),
          N(e),
          x(e),
          L(e),
          ee(e),
          ie(e),
          re(e, n),
          ne(e);
        break;
      case "safari":
        if (!z || !t.shimSafari)
          return r("Safari shim is not included in this adapter release."), o;
        r("adapter.js shimming safari."),
          (o.browserShim = z),
          ae(e, n),
          se(e),
          U(e),
          Q(e),
          j(e),
          G(e),
          H(e),
          q(e),
          F(e),
          W(e),
          ee(e),
          te(e),
          re(e, n),
          ne(e),
          oe(e, n);
        break;
      default:
        r("Unsupported browser!");
    }
    return o;
  })({ window: "undefined" == typeof window ? void 0 : window });
  var ue = { exports: {} };
  !(function (e) {
    var t = Object.prototype.hasOwnProperty,
      r = "~";
    function n() {}
    function i(e, t, r) {
      (this.fn = e), (this.context = t), (this.once = r || !1);
    }
    function o(e, t, n, o, a) {
      if ("function" != typeof n)
        throw new TypeError("The listener must be a function");
      var s = new i(n, o || e, a),
        c = r ? r + t : t;
      return (
        e._events[c]
          ? e._events[c].fn
            ? (e._events[c] = [e._events[c], s])
            : e._events[c].push(s)
          : ((e._events[c] = s), e._eventsCount++),
        e
      );
    }
    function a(e, t) {
      0 == --e._eventsCount ? (e._events = new n()) : delete e._events[t];
    }
    function s() {
      (this._events = new n()), (this._eventsCount = 0);
    }
    Object.create &&
      ((n.prototype = Object.create(null)), new n().__proto__ || (r = !1)),
      (s.prototype.eventNames = function () {
        var e,
          n,
          i = [];
        if (0 === this._eventsCount) return i;
        for (n in (e = this._events))
          t.call(e, n) && i.push(r ? n.slice(1) : n);
        return Object.getOwnPropertySymbols
          ? i.concat(Object.getOwnPropertySymbols(e))
          : i;
      }),
      (s.prototype.listeners = function (e) {
        var t = r ? r + e : e,
          n = this._events[t];
        if (!n) return [];
        if (n.fn) return [n.fn];
        for (var i = 0, o = n.length, a = new Array(o); i < o; i++)
          a[i] = n[i].fn;
        return a;
      }),
      (s.prototype.listenerCount = function (e) {
        var t = r ? r + e : e,
          n = this._events[t];
        return n ? (n.fn ? 1 : n.length) : 0;
      }),
      (s.prototype.emit = function (e, t, n, i, o, a) {
        var s = r ? r + e : e;
        if (!this._events[s]) return !1;
        var c,
          d,
          u = this._events[s],
          l = arguments.length;
        if (u.fn) {
          switch ((u.once && this.removeListener(e, u.fn, void 0, !0), l)) {
            case 1:
              return u.fn.call(u.context), !0;
            case 2:
              return u.fn.call(u.context, t), !0;
            case 3:
              return u.fn.call(u.context, t, n), !0;
            case 4:
              return u.fn.call(u.context, t, n, i), !0;
            case 5:
              return u.fn.call(u.context, t, n, i, o), !0;
            case 6:
              return u.fn.call(u.context, t, n, i, o, a), !0;
          }
          for (d = 1, c = new Array(l - 1); d < l; d++) c[d - 1] = arguments[d];
          u.fn.apply(u.context, c);
        } else {
          var A,
            h = u.length;
          for (d = 0; d < h; d++)
            switch (
              (u[d].once && this.removeListener(e, u[d].fn, void 0, !0), l)
            ) {
              case 1:
                u[d].fn.call(u[d].context);
                break;
              case 2:
                u[d].fn.call(u[d].context, t);
                break;
              case 3:
                u[d].fn.call(u[d].context, t, n);
                break;
              case 4:
                u[d].fn.call(u[d].context, t, n, i);
                break;
              default:
                if (!c)
                  for (A = 1, c = new Array(l - 1); A < l; A++)
                    c[A - 1] = arguments[A];
                u[d].fn.apply(u[d].context, c);
            }
        }
        return !0;
      }),
      (s.prototype.on = function (e, t, r) {
        return o(this, e, t, r, !1);
      }),
      (s.prototype.once = function (e, t, r) {
        return o(this, e, t, r, !0);
      }),
      (s.prototype.removeListener = function (e, t, n, i) {
        var o = r ? r + e : e;
        if (!this._events[o]) return this;
        if (!t) return a(this, o), this;
        var s = this._events[o];
        if (s.fn)
          s.fn !== t || (i && !s.once) || (n && s.context !== n) || a(this, o);
        else {
          for (var c = 0, d = [], u = s.length; c < u; c++)
            (s[c].fn !== t || (i && !s[c].once) || (n && s[c].context !== n)) &&
              d.push(s[c]);
          d.length ? (this._events[o] = 1 === d.length ? d[0] : d) : a(this, o);
        }
        return this;
      }),
      (s.prototype.removeAllListeners = function (e) {
        var t;
        return (
          e
            ? ((t = r ? r + e : e), this._events[t] && a(this, t))
            : ((this._events = new n()), (this._eventsCount = 0)),
          this
        );
      }),
      (s.prototype.off = s.prototype.removeListener),
      (s.prototype.addListener = s.prototype.on),
      (s.prefixed = r),
      (s.EventEmitter = s),
      (e.exports = s);
  })(ue);
  var le = K(ue.exports);
  function Ae() {
    const e = new Date();
    function t(e) {
      const t = e.toString();
      return t.length < 2 ? "0" + t : t;
    }
    const r = t(e.getHours()),
      n = t(e.getMinutes()),
      i = t(e.getSeconds()),
      o = e.getMilliseconds();
    return "[".concat(r, ":").concat(n, ":").concat(i, ".").concat(o, "]");
  }
  const he = new (class extends le {
    constructor(e) {
      super(), (this.level = e);
    }
    setLevel(e) {
      this.level = e;
    }
    log() {
      for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
        t[r] = arguments[r];
      if (
        ("log" === this.savedLevel && this.emit("log", "log", t),
        "log" !== this.level)
      )
        return;
      const n = "".concat(Ae(), " %cLOG-QNRTC");
      console.info(n, "color: #66ccff; font-weight: bold;", ...t);
    }
    debug() {
      for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
        t[r] = arguments[r];
      if (
        (("log" !== this.savedLevel && "debug" !== this.savedLevel) ||
          this.emit("log", "debug", t),
        "log" !== this.level && "debug" !== this.level)
      )
        return;
      const n = "".concat(Ae(), " %cDEBUG-QNRTC");
      console.info(n, "color: #A28148; font-weight: bold;", ...t);
    }
    warning() {
      for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
        t[r] = arguments[r];
      if (
        (this.savedLevel &&
          "disable" !== this.savedLevel &&
          this.emit("log", "warn", t),
        "disable" === this.level)
      )
        return;
      const n = "".concat(Ae(), " %cWARNING-QNRTC");
      console.warn(n, "color: #E44F44; font-weight: bold;", ...t);
    }
    error() {
      for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
        t[r] = arguments[r];
      if (
        (this.savedLevel &&
          "disable" !== this.savedLevel &&
          this.emit("log", "error", t),
        "disable" === this.level)
      )
        return;
      const n = "".concat(Ae(), " %cERROR-QNRTC");
      console.error(n, "color: #E44F44; font-weight: bold;", ...t);
    }
    setSavedLevel(e) {
      this.savedLevel = e;
    }
  })("log");
  function fe(e, t) {
    var r = {};
    for (var n in e)
      Object.prototype.hasOwnProperty.call(e, n) &&
        t.indexOf(n) < 0 &&
        (r[n] = e[n]);
    if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
      var i = 0;
      for (n = Object.getOwnPropertySymbols(e); i < n.length; i++)
        t.indexOf(n[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(e, n[i]) &&
          (r[n[i]] = e[n[i]]);
    }
    return r;
  }
  function pe(e, t, r, n) {
    return new (r || (r = Promise))(function (i, o) {
      function a(e) {
        try {
          c(n.next(e));
        } catch (e) {
          o(e);
        }
      }
      function s(e) {
        try {
          c(n.throw(e));
        } catch (e) {
          o(e);
        }
      }
      function c(e) {
        var t;
        e.done
          ? i(e.value)
          : ((t = e.value),
            t instanceof r
              ? t
              : new r(function (e) {
                  e(t);
                })).then(a, s);
      }
      c((n = n.apply(e, t || [])).next());
    });
  }
  "function" == typeof SuppressedError && SuppressedError;
  var me = { exports: {} };
  !(function (e, t) {
    var r = "__lodash_hash_undefined__",
      n = 1,
      i = 2,
      o = 1 / 0,
      a = 9007199254740991,
      s = "[object Arguments]",
      c = "[object Array]",
      d = "[object Boolean]",
      u = "[object Date]",
      l = "[object Error]",
      A = "[object Function]",
      h = "[object GeneratorFunction]",
      f = "[object Map]",
      p = "[object Number]",
      m = "[object Object]",
      g = "[object Promise]",
      v = "[object RegExp]",
      T = "[object Set]",
      b = "[object String]",
      S = "[object Symbol]",
      y = "[object WeakMap]",
      k = "[object ArrayBuffer]",
      _ = "[object DataView]",
      w = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      E = /^\w*$/,
      C = /^\./,
      I =
        /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
      P = /\\(\\)?/g,
      R = /^\[object .+?Constructor\]$/,
      M = /^(?:0|[1-9]\d*)$/,
      D = {};
    (D["[object Float32Array]"] =
      D["[object Float64Array]"] =
      D["[object Int8Array]"] =
      D["[object Int16Array]"] =
      D["[object Int32Array]"] =
      D["[object Uint8Array]"] =
      D["[object Uint8ClampedArray]"] =
      D["[object Uint16Array]"] =
      D["[object Uint32Array]"] =
        !0),
      (D[s] =
        D[c] =
        D[k] =
        D[d] =
        D[_] =
        D[u] =
        D[l] =
        D[A] =
        D[f] =
        D[p] =
        D[m] =
        D[v] =
        D[T] =
        D[b] =
        D[y] =
          !1);
    var O = "object" == typeof X && X && X.Object === Object && X,
      N = "object" == typeof self && self && self.Object === Object && self,
      x = O || N || Function("return this")(),
      L = t && !t.nodeType && t,
      B = L && e && !e.nodeType && e,
      G = B && B.exports === L && O.process,
      H = (function () {
        try {
          return G && G.binding("util");
        } catch (e) {}
      })(),
      j = H && H.isTypedArray;
    function F(e, t) {
      for (var r = -1, n = e ? e.length : 0; ++r < n; )
        if (t(e[r], r, e)) return !0;
      return !1;
    }
    function V(e) {
      var t = !1;
      if (null != e && "function" != typeof e.toString)
        try {
          t = !!(e + "");
        } catch (e) {}
      return t;
    }
    function U(e) {
      var t = -1,
        r = Array(e.size);
      return (
        e.forEach(function (e, n) {
          r[++t] = [n, e];
        }),
        r
      );
    }
    function q(e) {
      var t = -1,
        r = Array(e.size);
      return (
        e.forEach(function (e) {
          r[++t] = e;
        }),
        r
      );
    }
    var Q,
      W,
      z,
      K = Array.prototype,
      J = Function.prototype,
      Z = Object.prototype,
      Y = x["__core-js_shared__"],
      $ = (Q = /[^.]+$/.exec((Y && Y.keys && Y.keys.IE_PROTO) || ""))
        ? "Symbol(src)_1." + Q
        : "",
      ee = J.toString,
      te = Z.hasOwnProperty,
      re = Z.toString,
      ne = RegExp(
        "^" +
          ee
            .call(te)
            .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
            .replace(
              /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
              "$1.*?"
            ) +
          "$"
      ),
      ie = x.Symbol,
      oe = x.Uint8Array,
      ae = Z.propertyIsEnumerable,
      se = K.splice,
      ce =
        ((W = Object.keys),
        (z = Object),
        function (e) {
          return W(z(e));
        }),
      de = He(x, "DataView"),
      ue = He(x, "Map"),
      le = He(x, "Promise"),
      Ae = He(x, "Set"),
      he = He(x, "WeakMap"),
      fe = He(Object, "create"),
      pe = Xe(de),
      me = Xe(ue),
      ge = Xe(le),
      ve = Xe(Ae),
      Te = Xe(he),
      be = ie ? ie.prototype : void 0,
      Se = be ? be.valueOf : void 0,
      ye = be ? be.toString : void 0;
    function ke(e) {
      var t = -1,
        r = e ? e.length : 0;
      for (this.clear(); ++t < r; ) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function _e(e) {
      var t = -1,
        r = e ? e.length : 0;
      for (this.clear(); ++t < r; ) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function we(e) {
      var t = -1,
        r = e ? e.length : 0;
      for (this.clear(); ++t < r; ) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function Ee(e) {
      var t = -1,
        r = e ? e.length : 0;
      for (this.__data__ = new we(); ++t < r; ) this.add(e[t]);
    }
    function Ce(e) {
      this.__data__ = new _e(e);
    }
    function Ie(e, t) {
      var r =
          $e(e) || Ye(e)
            ? (function (e, t) {
                for (var r = -1, n = Array(e); ++r < e; ) n[r] = t(r);
                return n;
              })(e.length, String)
            : [],
        n = r.length,
        i = !!n;
      for (var o in e)
        (!t && !te.call(e, o)) ||
          (i && ("length" == o || Fe(o, n))) ||
          r.push(o);
      return r;
    }
    function Pe(e, t) {
      for (var r = e.length; r--; ) if (Ze(e[r][0], t)) return r;
      return -1;
    }
    function Re(e, t) {
      for (
        var r = 0, n = (t = Ve(t, e) ? [t] : Le(t)).length;
        null != e && r < n;

      )
        e = e[ze(t[r++])];
      return r && r == n ? e : void 0;
    }
    function Me(e, t) {
      return null != e && t in Object(e);
    }
    function De(e, t, r, o, a) {
      return (
        e === t ||
        (null == e || null == t || (!nt(e) && !it(t))
          ? e != e && t != t
          : (function (e, t, r, o, a, A) {
              var h = $e(e),
                g = $e(t),
                y = c,
                w = c;
              h || (y = (y = je(e)) == s ? m : y);
              g || (w = (w = je(t)) == s ? m : w);
              var E = y == m && !V(e),
                C = w == m && !V(t),
                I = y == w;
              if (I && !E)
                return (
                  A || (A = new Ce()),
                  h || at(e)
                    ? Be(e, t, r, o, a, A)
                    : (function (e, t, r, o, a, s, c) {
                        switch (r) {
                          case _:
                            if (
                              e.byteLength != t.byteLength ||
                              e.byteOffset != t.byteOffset
                            )
                              return !1;
                            (e = e.buffer), (t = t.buffer);
                          case k:
                            return !(
                              e.byteLength != t.byteLength ||
                              !o(new oe(e), new oe(t))
                            );
                          case d:
                          case u:
                          case p:
                            return Ze(+e, +t);
                          case l:
                            return e.name == t.name && e.message == t.message;
                          case v:
                          case b:
                            return e == t + "";
                          case f:
                            var A = U;
                          case T:
                            var h = s & i;
                            if ((A || (A = q), e.size != t.size && !h))
                              return !1;
                            var m = c.get(e);
                            if (m) return m == t;
                            (s |= n), c.set(e, t);
                            var g = Be(A(e), A(t), o, a, s, c);
                            return c.delete(e), g;
                          case S:
                            if (Se) return Se.call(e) == Se.call(t);
                        }
                        return !1;
                      })(e, t, y, r, o, a, A)
                );
              if (!(a & i)) {
                var P = E && te.call(e, "__wrapped__"),
                  R = C && te.call(t, "__wrapped__");
                if (P || R) {
                  var M = P ? e.value() : e,
                    D = R ? t.value() : t;
                  return A || (A = new Ce()), r(M, D, o, a, A);
                }
              }
              if (!I) return !1;
              return (
                A || (A = new Ce()),
                (function (e, t, r, n, o, a) {
                  var s = o & i,
                    c = st(e),
                    d = c.length,
                    u = st(t),
                    l = u.length;
                  if (d != l && !s) return !1;
                  var A = d;
                  for (; A--; ) {
                    var h = c[A];
                    if (!(s ? h in t : te.call(t, h))) return !1;
                  }
                  var f = a.get(e);
                  if (f && a.get(t)) return f == t;
                  var p = !0;
                  a.set(e, t), a.set(t, e);
                  var m = s;
                  for (; ++A < d; ) {
                    var g = e[(h = c[A])],
                      v = t[h];
                    if (n)
                      var T = s ? n(v, g, h, t, e, a) : n(g, v, h, e, t, a);
                    if (!(void 0 === T ? g === v || r(g, v, n, o, a) : T)) {
                      p = !1;
                      break;
                    }
                    m || (m = "constructor" == h);
                  }
                  if (p && !m) {
                    var b = e.constructor,
                      S = t.constructor;
                    b == S ||
                      !("constructor" in e) ||
                      !("constructor" in t) ||
                      ("function" == typeof b &&
                        b instanceof b &&
                        "function" == typeof S &&
                        S instanceof S) ||
                      (p = !1);
                  }
                  return a.delete(e), a.delete(t), p;
                })(e, t, r, o, a, A)
              );
            })(e, t, De, r, o, a))
      );
    }
    function Oe(e) {
      return (
        !(
          !nt(e) ||
          (function (e) {
            return !!$ && $ in e;
          })(e)
        ) && (tt(e) || V(e) ? ne : R).test(Xe(e))
      );
    }
    function Ne(e) {
      return "function" == typeof e
        ? e
        : null == e
        ? ct
        : "object" == typeof e
        ? $e(e)
          ? (function (e, t) {
              if (Ve(e) && Ue(t)) return qe(ze(e), t);
              return function (r) {
                var o = (function (e, t, r) {
                  var n = null == e ? void 0 : Re(e, t);
                  return void 0 === n ? r : n;
                })(r, e);
                return void 0 === o && o === t
                  ? (function (e, t) {
                      return (
                        null != e &&
                        (function (e, t, r) {
                          t = Ve(t, e) ? [t] : Le(t);
                          var n,
                            i = -1,
                            o = t.length;
                          for (; ++i < o; ) {
                            var a = ze(t[i]);
                            if (!(n = null != e && r(e, a))) break;
                            e = e[a];
                          }
                          if (n) return n;
                          o = e ? e.length : 0;
                          return !!o && rt(o) && Fe(a, o) && ($e(e) || Ye(e));
                        })(e, t, Me)
                      );
                    })(r, e)
                  : De(t, o, void 0, n | i);
              };
            })(e[0], e[1])
          : (function (e) {
              var t = (function (e) {
                var t = st(e),
                  r = t.length;
                for (; r--; ) {
                  var n = t[r],
                    i = e[n];
                  t[r] = [n, i, Ue(i)];
                }
                return t;
              })(e);
              if (1 == t.length && t[0][2]) return qe(t[0][0], t[0][1]);
              return function (r) {
                return (
                  r === e ||
                  (function (e, t, r, o) {
                    var a = r.length,
                      s = a,
                      c = !o;
                    if (null == e) return !s;
                    for (e = Object(e); a--; ) {
                      var d = r[a];
                      if (c && d[2] ? d[1] !== e[d[0]] : !(d[0] in e))
                        return !1;
                    }
                    for (; ++a < s; ) {
                      var u = (d = r[a])[0],
                        l = e[u],
                        A = d[1];
                      if (c && d[2]) {
                        if (void 0 === l && !(u in e)) return !1;
                      } else {
                        var h = new Ce();
                        if (o) var f = o(l, A, u, e, t, h);
                        if (!(void 0 === f ? De(A, l, o, n | i, h) : f))
                          return !1;
                      }
                    }
                    return !0;
                  })(r, e, t)
                );
              };
            })(e)
        : Ve((t = e))
        ? ((r = ze(t)),
          function (e) {
            return null == e ? void 0 : e[r];
          })
        : (function (e) {
            return function (t) {
              return Re(t, e);
            };
          })(t);
      var t, r;
    }
    function xe(e) {
      if (
        ((r = (t = e) && t.constructor),
        (n = ("function" == typeof r && r.prototype) || Z),
        t !== n)
      )
        return ce(e);
      var t,
        r,
        n,
        i = [];
      for (var o in Object(e)) te.call(e, o) && "constructor" != o && i.push(o);
      return i;
    }
    function Le(e) {
      return $e(e) ? e : We(e);
    }
    function Be(e, t, r, o, a, s) {
      var c = a & i,
        d = e.length,
        u = t.length;
      if (d != u && !(c && u > d)) return !1;
      var l = s.get(e);
      if (l && s.get(t)) return l == t;
      var A = -1,
        h = !0,
        f = a & n ? new Ee() : void 0;
      for (s.set(e, t), s.set(t, e); ++A < d; ) {
        var p = e[A],
          m = t[A];
        if (o) var g = c ? o(m, p, A, t, e, s) : o(p, m, A, e, t, s);
        if (void 0 !== g) {
          if (g) continue;
          h = !1;
          break;
        }
        if (f) {
          if (
            !F(t, function (e, t) {
              if (!f.has(t) && (p === e || r(p, e, o, a, s))) return f.add(t);
            })
          ) {
            h = !1;
            break;
          }
        } else if (p !== m && !r(p, m, o, a, s)) {
          h = !1;
          break;
        }
      }
      return s.delete(e), s.delete(t), h;
    }
    function Ge(e, t) {
      var r = e.__data__;
      return (function (e) {
        var t = typeof e;
        return "string" == t || "number" == t || "symbol" == t || "boolean" == t
          ? "__proto__" !== e
          : null === e;
      })(t)
        ? r["string" == typeof t ? "string" : "hash"]
        : r.map;
    }
    function He(e, t) {
      var r = (function (e, t) {
        return null == e ? void 0 : e[t];
      })(e, t);
      return Oe(r) ? r : void 0;
    }
    (ke.prototype.clear = function () {
      this.__data__ = fe ? fe(null) : {};
    }),
      (ke.prototype.delete = function (e) {
        return this.has(e) && delete this.__data__[e];
      }),
      (ke.prototype.get = function (e) {
        var t = this.__data__;
        if (fe) {
          var n = t[e];
          return n === r ? void 0 : n;
        }
        return te.call(t, e) ? t[e] : void 0;
      }),
      (ke.prototype.has = function (e) {
        var t = this.__data__;
        return fe ? void 0 !== t[e] : te.call(t, e);
      }),
      (ke.prototype.set = function (e, t) {
        return (this.__data__[e] = fe && void 0 === t ? r : t), this;
      }),
      (_e.prototype.clear = function () {
        this.__data__ = [];
      }),
      (_e.prototype.delete = function (e) {
        var t = this.__data__,
          r = Pe(t, e);
        return !(r < 0) && (r == t.length - 1 ? t.pop() : se.call(t, r, 1), !0);
      }),
      (_e.prototype.get = function (e) {
        var t = this.__data__,
          r = Pe(t, e);
        return r < 0 ? void 0 : t[r][1];
      }),
      (_e.prototype.has = function (e) {
        return Pe(this.__data__, e) > -1;
      }),
      (_e.prototype.set = function (e, t) {
        var r = this.__data__,
          n = Pe(r, e);
        return n < 0 ? r.push([e, t]) : (r[n][1] = t), this;
      }),
      (we.prototype.clear = function () {
        this.__data__ = {
          hash: new ke(),
          map: new (ue || _e)(),
          string: new ke(),
        };
      }),
      (we.prototype.delete = function (e) {
        return Ge(this, e).delete(e);
      }),
      (we.prototype.get = function (e) {
        return Ge(this, e).get(e);
      }),
      (we.prototype.has = function (e) {
        return Ge(this, e).has(e);
      }),
      (we.prototype.set = function (e, t) {
        return Ge(this, e).set(e, t), this;
      }),
      (Ee.prototype.add = Ee.prototype.push =
        function (e) {
          return this.__data__.set(e, r), this;
        }),
      (Ee.prototype.has = function (e) {
        return this.__data__.has(e);
      }),
      (Ce.prototype.clear = function () {
        this.__data__ = new _e();
      }),
      (Ce.prototype.delete = function (e) {
        return this.__data__.delete(e);
      }),
      (Ce.prototype.get = function (e) {
        return this.__data__.get(e);
      }),
      (Ce.prototype.has = function (e) {
        return this.__data__.has(e);
      }),
      (Ce.prototype.set = function (e, t) {
        var r = this.__data__;
        if (r instanceof _e) {
          var n = r.__data__;
          if (!ue || n.length < 199) return n.push([e, t]), this;
          r = this.__data__ = new we(n);
        }
        return r.set(e, t), this;
      });
    var je = function (e) {
      return re.call(e);
    };
    function Fe(e, t) {
      return (
        !!(t = null == t ? a : t) &&
        ("number" == typeof e || M.test(e)) &&
        e > -1 &&
        e % 1 == 0 &&
        e < t
      );
    }
    function Ve(e, t) {
      if ($e(e)) return !1;
      var r = typeof e;
      return (
        !(
          "number" != r &&
          "symbol" != r &&
          "boolean" != r &&
          null != e &&
          !ot(e)
        ) ||
        E.test(e) ||
        !w.test(e) ||
        (null != t && e in Object(t))
      );
    }
    function Ue(e) {
      return e == e && !nt(e);
    }
    function qe(e, t) {
      return function (r) {
        return null != r && r[e] === t && (void 0 !== t || e in Object(r));
      };
    }
    function Qe(e, t) {
      return 1 == t.length
        ? e
        : Re(
            e,
            (function (e, t, r) {
              var n = -1,
                i = e.length;
              t < 0 && (t = -t > i ? 0 : i + t),
                (r = r > i ? i : r) < 0 && (r += i),
                (i = t > r ? 0 : (r - t) >>> 0),
                (t >>>= 0);
              for (var o = Array(i); ++n < i; ) o[n] = e[n + t];
              return o;
            })(t, 0, -1)
          );
    }
    ((de && je(new de(new ArrayBuffer(1))) != _) ||
      (ue && je(new ue()) != f) ||
      (le && je(le.resolve()) != g) ||
      (Ae && je(new Ae()) != T) ||
      (he && je(new he()) != y)) &&
      (je = function (e) {
        var t = re.call(e),
          r = t == m ? e.constructor : void 0,
          n = r ? Xe(r) : void 0;
        if (n)
          switch (n) {
            case pe:
              return _;
            case me:
              return f;
            case ge:
              return g;
            case ve:
              return T;
            case Te:
              return y;
          }
        return t;
      });
    var We = Je(function (e) {
      var t;
      e =
        null == (t = e)
          ? ""
          : (function (e) {
              if ("string" == typeof e) return e;
              if (ot(e)) return ye ? ye.call(e) : "";
              var t = e + "";
              return "0" == t && 1 / e == -o ? "-0" : t;
            })(t);
      var r = [];
      return (
        C.test(e) && r.push(""),
        e.replace(I, function (e, t, n, i) {
          r.push(n ? i.replace(P, "$1") : t || e);
        }),
        r
      );
    });
    function ze(e) {
      if ("string" == typeof e || ot(e)) return e;
      var t = e + "";
      return "0" == t && 1 / e == -o ? "-0" : t;
    }
    function Xe(e) {
      if (null != e) {
        try {
          return ee.call(e);
        } catch (e) {}
        try {
          return e + "";
        } catch (e) {}
      }
      return "";
    }
    function Ke(e) {
      var t = e ? e.length : 0;
      return t ? e[t - 1] : void 0;
    }
    function Je(e, t) {
      if ("function" != typeof e || (t && "function" != typeof t))
        throw new TypeError("Expected a function");
      var r = function () {
        var n = arguments,
          i = t ? t.apply(this, n) : n[0],
          o = r.cache;
        if (o.has(i)) return o.get(i);
        var a = e.apply(this, n);
        return (r.cache = o.set(i, a)), a;
      };
      return (r.cache = new (Je.Cache || we)()), r;
    }
    function Ze(e, t) {
      return e === t || (e != e && t != t);
    }
    function Ye(e) {
      return (
        (function (e) {
          return it(e) && et(e);
        })(e) &&
        te.call(e, "callee") &&
        (!ae.call(e, "callee") || re.call(e) == s)
      );
    }
    Je.Cache = we;
    var $e = Array.isArray;
    function et(e) {
      return null != e && rt(e.length) && !tt(e);
    }
    function tt(e) {
      var t = nt(e) ? re.call(e) : "";
      return t == A || t == h;
    }
    function rt(e) {
      return "number" == typeof e && e > -1 && e % 1 == 0 && e <= a;
    }
    function nt(e) {
      var t = typeof e;
      return !!e && ("object" == t || "function" == t);
    }
    function it(e) {
      return !!e && "object" == typeof e;
    }
    function ot(e) {
      return "symbol" == typeof e || (it(e) && re.call(e) == S);
    }
    var at = j
      ? (function (e) {
          return function (t) {
            return e(t);
          };
        })(j)
      : function (e) {
          return it(e) && rt(e.length) && !!D[re.call(e)];
        };
    function st(e) {
      return et(e) ? Ie(e) : xe(e);
    }
    function ct(e) {
      return e;
    }
    e.exports = function (e, t) {
      var r = [];
      if (!e || !e.length) return r;
      var n = -1,
        i = [],
        o = e.length;
      for (t = Ne(t); ++n < o; ) {
        var a = e[n];
        t(a, n, e) && (r.push(a), i.push(n));
      }
      return (
        (function (e, t) {
          for (var r = e ? t.length : 0, n = r - 1; r--; ) {
            var i = t[r];
            if (r == n || i !== o) {
              var o = i;
              if (Fe(i)) se.call(e, i, 1);
              else if (Ve(i, e)) delete e[ze(i)];
              else {
                var a = Le(i),
                  s = Qe(e, a);
                null != s && delete s[ze(Ke(a))];
              }
            }
          }
        })(e, i),
        r
      );
    };
  })(me, me.exports);
  var ge = K(me.exports);
  const ve = (e) => !!e && !!e.audio && e.audio.enabled,
    Te = (e) => !!e && !!e.video && e.video.enabled,
    be = (e) => !!e && !!e.screen && e.screen.enabled;
  var Se, ye, ke, _e, we;
  function Ee(e) {
    return void 0 !== e;
  }
  (e.PermissionNameCode = void 0),
    ((Se = e.PermissionNameCode || (e.PermissionNameCode = {}))[
      (Se.camera = 0)
    ] = "camera"),
    (Se[(Se.microphone = 1)] = "microphone"),
    (e.PermissionStateCode = void 0),
    ((ye = e.PermissionStateCode || (e.PermissionStateCode = {}))[
      (ye.prompt = 1)
    ] = "prompt"),
    (ye[(ye.denied = 2)] = "denied"),
    (ye[(ye.granted = 3)] = "granted"),
    (e.NetworkGrade = void 0),
    ((ke = e.NetworkGrade || (e.NetworkGrade = {}))[(ke.INVALID = -1)] =
      "INVALID"),
    (ke[(ke.EXCELLENT = 1)] = "EXCELLENT"),
    (ke[(ke.GOOD = 2)] = "GOOD"),
    (ke[(ke.FAIR = 3)] = "FAIR"),
    (ke[(ke.POOR = 4)] = "POOR"),
    (e.TrackConnectStatus = void 0),
    ((_e = e.TrackConnectStatus || (e.TrackConnectStatus = {}))[(_e.Idle = 0)] =
      "Idle"),
    (_e[(_e.Connecting = 1)] = "Connecting"),
    (_e[(_e.Connect = 2)] = "Connect"),
    (e.TrackSourceType = void 0),
    ((we = e.TrackSourceType || (e.TrackSourceType = {}))[(we.NORMAL = 0)] =
      "NORMAL"),
    (we[(we.EXTERNAL = 1)] = "EXTERNAL"),
    (we[(we.MIXING = 2)] = "MIXING");
  const Ce = {
    publishUrl: "",
    height: 720,
    width: 1080,
    fps: 25,
    kbps: 1e3,
    audioOnly: !1,
    stretchMode: "aspectFill",
  };
  var Ie;
  (e.AudioSourceState = void 0),
    ((Ie = e.AudioSourceState || (e.AudioSourceState = {})).IDLE = "idle"),
    (Ie.LOADING = "loading"),
    (Ie.PLAY = "play"),
    (Ie.PAUSE = "pause"),
    (Ie.STOP = "stop"),
    (Ie.END = "end");
  const Pe = {
    Init: 1,
    UnInit: 2,
    JoinRoom: 3,
    MCSAuth: 4,
    SignalAuth: 5,
    LeaveRoom: 6,
    PublisherPC: 7,
    PublishTracks: 8,
    UnPublishTracks: 9,
    SubscriberPC: 10,
    SubscribeTracks: 11,
    UnSubscribeTracks: 13,
    MuteTracks: 14,
    ICEConnectionState: 15,
    CallbackStatistics: 16,
    KickoutUser: 17,
    RoomStateChanged: 18,
    AudioDeviceInOut: 19,
    VideoDeviceInOut: 20,
    SDKError: 21,
    ApplicationState: 22,
    CreateMergeJob: 24,
    UpdateMergeTracks: 25,
    StopMerge: 26,
    AuthorizationStatus: 27,
    DeviceChanged: 28,
    DefaultSetting: 29,
    MediaStatistics: 30,
    AbnormalDisconnect: 31,
    CreateForwardJob: 36,
    StopForwardJob: 37,
    WebsocketConnect: 40,
    NetworkChange: 46,
    SystemRequirementsTest: 47,
    AutoplayFail: 49,
    TrackEnded: 50,
    WebSDKException: 51,
    VideoPlayQuality: 53,
    AudioPlayQuality: 54,
    JoinRoomResult: 55,
    SetClientRole: 56,
    StartMediaRelay: 57,
    UpdateMediaRelay: 58,
    StopMediaRelay: 59,
    MCURelayAuth: 60,
    SignalFired: 66,
  };
  var Re = { exports: {} };
  !(function (e) {
    var t, r;
    (t = X),
      (r = function () {
        void 0 === Array.isArray &&
          (Array.isArray = function (e) {
            return "[object Array]" === Object.prototype.toString.call(e);
          });
        var e = function (e, t) {
            (e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]]),
              (t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]]);
            var r = [0, 0, 0, 0];
            return (
              (r[3] += e[3] + t[3]),
              (r[2] += r[3] >>> 16),
              (r[3] &= 65535),
              (r[2] += e[2] + t[2]),
              (r[1] += r[2] >>> 16),
              (r[2] &= 65535),
              (r[1] += e[1] + t[1]),
              (r[0] += r[1] >>> 16),
              (r[1] &= 65535),
              (r[0] += e[0] + t[0]),
              (r[0] &= 65535),
              [(r[0] << 16) | r[1], (r[2] << 16) | r[3]]
            );
          },
          t = function (e, t) {
            (e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]]),
              (t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]]);
            var r = [0, 0, 0, 0];
            return (
              (r[3] += e[3] * t[3]),
              (r[2] += r[3] >>> 16),
              (r[3] &= 65535),
              (r[2] += e[2] * t[3]),
              (r[1] += r[2] >>> 16),
              (r[2] &= 65535),
              (r[2] += e[3] * t[2]),
              (r[1] += r[2] >>> 16),
              (r[2] &= 65535),
              (r[1] += e[1] * t[3]),
              (r[0] += r[1] >>> 16),
              (r[1] &= 65535),
              (r[1] += e[2] * t[2]),
              (r[0] += r[1] >>> 16),
              (r[1] &= 65535),
              (r[1] += e[3] * t[1]),
              (r[0] += r[1] >>> 16),
              (r[1] &= 65535),
              (r[0] += e[0] * t[3] + e[1] * t[2] + e[2] * t[1] + e[3] * t[0]),
              (r[0] &= 65535),
              [(r[0] << 16) | r[1], (r[2] << 16) | r[3]]
            );
          },
          r = function (e, t) {
            return 32 == (t %= 64)
              ? [e[1], e[0]]
              : t < 32
              ? [
                  (e[0] << t) | (e[1] >>> (32 - t)),
                  (e[1] << t) | (e[0] >>> (32 - t)),
                ]
              : ((t -= 32),
                [
                  (e[1] << t) | (e[0] >>> (32 - t)),
                  (e[0] << t) | (e[1] >>> (32 - t)),
                ]);
          },
          n = function (e, t) {
            return 0 == (t %= 64)
              ? e
              : t < 32
              ? [(e[0] << t) | (e[1] >>> (32 - t)), e[1] << t]
              : [e[1] << (t - 32), 0];
          },
          i = function (e, t) {
            return [e[0] ^ t[0], e[1] ^ t[1]];
          },
          o = function (e) {
            return (
              (e = i(e, [0, e[0] >>> 1])),
              (e = t(e, [4283543511, 3981806797])),
              (e = i(e, [0, e[0] >>> 1])),
              (e = t(e, [3301882366, 444984403])),
              (e = i(e, [0, e[0] >>> 1]))
            );
          },
          a = function (a, s) {
            s = s || 0;
            for (
              var c = (a = a || "").length % 16,
                d = a.length - c,
                u = [0, s],
                l = [0, s],
                A = [0, 0],
                h = [0, 0],
                f = [2277735313, 289559509],
                p = [1291169091, 658871167],
                m = 0;
              m < d;
              m += 16
            )
              (A = [
                (255 & a.charCodeAt(m + 4)) |
                  ((255 & a.charCodeAt(m + 5)) << 8) |
                  ((255 & a.charCodeAt(m + 6)) << 16) |
                  ((255 & a.charCodeAt(m + 7)) << 24),
                (255 & a.charCodeAt(m)) |
                  ((255 & a.charCodeAt(m + 1)) << 8) |
                  ((255 & a.charCodeAt(m + 2)) << 16) |
                  ((255 & a.charCodeAt(m + 3)) << 24),
              ]),
                (h = [
                  (255 & a.charCodeAt(m + 12)) |
                    ((255 & a.charCodeAt(m + 13)) << 8) |
                    ((255 & a.charCodeAt(m + 14)) << 16) |
                    ((255 & a.charCodeAt(m + 15)) << 24),
                  (255 & a.charCodeAt(m + 8)) |
                    ((255 & a.charCodeAt(m + 9)) << 8) |
                    ((255 & a.charCodeAt(m + 10)) << 16) |
                    ((255 & a.charCodeAt(m + 11)) << 24),
                ]),
                (A = t(A, f)),
                (A = r(A, 31)),
                (A = t(A, p)),
                (u = i(u, A)),
                (u = r(u, 27)),
                (u = e(u, l)),
                (u = e(t(u, [0, 5]), [0, 1390208809])),
                (h = t(h, p)),
                (h = r(h, 33)),
                (h = t(h, f)),
                (l = i(l, h)),
                (l = r(l, 31)),
                (l = e(l, u)),
                (l = e(t(l, [0, 5]), [0, 944331445]));
            switch (((A = [0, 0]), (h = [0, 0]), c)) {
              case 15:
                h = i(h, n([0, a.charCodeAt(m + 14)], 48));
              case 14:
                h = i(h, n([0, a.charCodeAt(m + 13)], 40));
              case 13:
                h = i(h, n([0, a.charCodeAt(m + 12)], 32));
              case 12:
                h = i(h, n([0, a.charCodeAt(m + 11)], 24));
              case 11:
                h = i(h, n([0, a.charCodeAt(m + 10)], 16));
              case 10:
                h = i(h, n([0, a.charCodeAt(m + 9)], 8));
              case 9:
                (h = i(h, [0, a.charCodeAt(m + 8)])),
                  (h = t(h, p)),
                  (h = r(h, 33)),
                  (h = t(h, f)),
                  (l = i(l, h));
              case 8:
                A = i(A, n([0, a.charCodeAt(m + 7)], 56));
              case 7:
                A = i(A, n([0, a.charCodeAt(m + 6)], 48));
              case 6:
                A = i(A, n([0, a.charCodeAt(m + 5)], 40));
              case 5:
                A = i(A, n([0, a.charCodeAt(m + 4)], 32));
              case 4:
                A = i(A, n([0, a.charCodeAt(m + 3)], 24));
              case 3:
                A = i(A, n([0, a.charCodeAt(m + 2)], 16));
              case 2:
                A = i(A, n([0, a.charCodeAt(m + 1)], 8));
              case 1:
                (A = i(A, [0, a.charCodeAt(m)])),
                  (A = t(A, f)),
                  (A = r(A, 31)),
                  (A = t(A, p)),
                  (u = i(u, A));
            }
            return (
              (u = i(u, [0, a.length])),
              (l = i(l, [0, a.length])),
              (u = e(u, l)),
              (l = e(l, u)),
              (u = o(u)),
              (l = o(l)),
              (u = e(u, l)),
              (l = e(l, u)),
              ("00000000" + (u[0] >>> 0).toString(16)).slice(-8) +
                ("00000000" + (u[1] >>> 0).toString(16)).slice(-8) +
                ("00000000" + (l[0] >>> 0).toString(16)).slice(-8) +
                ("00000000" + (l[1] >>> 0).toString(16)).slice(-8)
            );
          },
          s = {
            preprocessor: null,
            audio: { timeout: 1e3, excludeIOS11: !0 },
            fonts: {
              swfContainerId: "fingerprintjs2",
              swfPath: "flash/compiled/FontList.swf",
              userDefinedFonts: [],
              extendedJsFonts: !1,
            },
            screen: { detectScreenOrientation: !0 },
            plugins: { sortPluginsFor: [/palemoon/i], excludeIE: !1 },
            extraComponents: [],
            excludes: {
              enumerateDevices: !0,
              pixelRatio: !0,
              doNotTrack: !0,
              fontsFlash: !0,
              adBlock: !0,
            },
            NOT_AVAILABLE: "not available",
            ERROR: "error",
            EXCLUDED: "excluded",
          },
          c = function (e, t) {
            if (
              Array.prototype.forEach &&
              e.forEach === Array.prototype.forEach
            )
              e.forEach(t);
            else if (e.length === +e.length)
              for (var r = 0, n = e.length; r < n; r++) t(e[r], r, e);
            else for (var i in e) e.hasOwnProperty(i) && t(e[i], i, e);
          },
          d = function (e, t) {
            var r = [];
            return null == e
              ? r
              : Array.prototype.map && e.map === Array.prototype.map
              ? e.map(t)
              : (c(e, function (e, n, i) {
                  r.push(t(e, n, i));
                }),
                r);
          },
          u = function () {
            return (
              navigator.mediaDevices && navigator.mediaDevices.enumerateDevices
            );
          },
          l = function (e) {
            var t = [window.screen.width, window.screen.height];
            return e.screen.detectScreenOrientation && t.sort().reverse(), t;
          },
          A = function (e) {
            if (window.screen.availWidth && window.screen.availHeight) {
              var t = [window.screen.availHeight, window.screen.availWidth];
              return e.screen.detectScreenOrientation && t.sort().reverse(), t;
            }
            return e.NOT_AVAILABLE;
          },
          h = function (e) {
            if (null == navigator.plugins) return e.NOT_AVAILABLE;
            for (var t = [], r = 0, n = navigator.plugins.length; r < n; r++)
              navigator.plugins[r] && t.push(navigator.plugins[r]);
            return (
              p(e) &&
                (t = t.sort(function (e, t) {
                  return e.name > t.name ? 1 : e.name < t.name ? -1 : 0;
                })),
              d(t, function (e) {
                var t = d(e, function (e) {
                  return [e.type, e.suffixes];
                });
                return [e.name, e.description, t];
              })
            );
          },
          f = function (e) {
            var t = [];
            return (
              (Object.getOwnPropertyDescriptor &&
                Object.getOwnPropertyDescriptor(window, "ActiveXObject")) ||
              "ActiveXObject" in window
                ? (t = d(
                    [
                      "AcroPDF.PDF",
                      "Adodb.Stream",
                      "AgControl.AgControl",
                      "DevalVRXCtrl.DevalVRXCtrl.1",
                      "MacromediaFlashPaper.MacromediaFlashPaper",
                      "Msxml2.DOMDocument",
                      "Msxml2.XMLHTTP",
                      "PDF.PdfCtrl",
                      "QuickTime.QuickTime",
                      "QuickTimeCheckObject.QuickTimeCheck.1",
                      "RealPlayer",
                      "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)",
                      "RealVideo.RealVideo(tm) ActiveX Control (32-bit)",
                      "Scripting.Dictionary",
                      "SWCtl.SWCtl",
                      "Shell.UIHelper",
                      "ShockwaveFlash.ShockwaveFlash",
                      "Skype.Detection",
                      "TDCCtl.TDCCtl",
                      "WMPlayer.OCX",
                      "rmocx.RealPlayer G2 Control",
                      "rmocx.RealPlayer G2 Control.1",
                    ],
                    function (t) {
                      try {
                        return new window.ActiveXObject(t), t;
                      } catch (t) {
                        return e.ERROR;
                      }
                    }
                  ))
                : t.push(e.NOT_AVAILABLE),
              navigator.plugins && (t = t.concat(h(e))),
              t
            );
          },
          p = function (e) {
            for (
              var t = !1, r = 0, n = e.plugins.sortPluginsFor.length;
              r < n;
              r++
            ) {
              var i = e.plugins.sortPluginsFor[r];
              if (navigator.userAgent.match(i)) {
                t = !0;
                break;
              }
            }
            return t;
          },
          m = function (e) {
            try {
              return !!window.sessionStorage;
            } catch (t) {
              return e.ERROR;
            }
          },
          g = function (e) {
            try {
              return !!window.localStorage;
            } catch (t) {
              return e.ERROR;
            }
          },
          v = function (e) {
            if (x()) return e.EXCLUDED;
            try {
              return !!window.indexedDB;
            } catch (t) {
              return e.ERROR;
            }
          },
          T = function (e) {
            return navigator.hardwareConcurrency
              ? navigator.hardwareConcurrency
              : e.NOT_AVAILABLE;
          },
          b = function (e) {
            return navigator.cpuClass || e.NOT_AVAILABLE;
          },
          S = function (e) {
            return navigator.platform ? navigator.platform : e.NOT_AVAILABLE;
          },
          y = function (e) {
            return navigator.doNotTrack
              ? navigator.doNotTrack
              : navigator.msDoNotTrack
              ? navigator.msDoNotTrack
              : window.doNotTrack
              ? window.doNotTrack
              : e.NOT_AVAILABLE;
          },
          k = function () {
            var e,
              t = 0;
            void 0 !== navigator.maxTouchPoints
              ? (t = navigator.maxTouchPoints)
              : void 0 !== navigator.msMaxTouchPoints &&
                (t = navigator.msMaxTouchPoints);
            try {
              document.createEvent("TouchEvent"), (e = !0);
            } catch (t) {
              e = !1;
            }
            return [t, e, "ontouchstart" in window];
          },
          _ = function (e) {
            var t = [],
              r = document.createElement("canvas");
            (r.width = 2e3), (r.height = 200), (r.style.display = "inline");
            var n = r.getContext("2d");
            return (
              n.rect(0, 0, 10, 10),
              n.rect(2, 2, 6, 6),
              t.push(
                "canvas winding:" +
                  (!1 === n.isPointInPath(5, 5, "evenodd") ? "yes" : "no")
              ),
              (n.textBaseline = "alphabetic"),
              (n.fillStyle = "#f60"),
              n.fillRect(125, 1, 62, 20),
              (n.fillStyle = "#069"),
              e.dontUseFakeFontInCanvas
                ? (n.font = "11pt Arial")
                : (n.font = "11pt no-real-font-123"),
              n.fillText("Cwm fjordbank glyphs vext quiz, 😃", 2, 15),
              (n.fillStyle = "rgba(102, 204, 0, 0.2)"),
              (n.font = "18pt Arial"),
              n.fillText("Cwm fjordbank glyphs vext quiz, 😃", 4, 45),
              (n.globalCompositeOperation = "multiply"),
              (n.fillStyle = "rgb(255,0,255)"),
              n.beginPath(),
              n.arc(50, 50, 50, 0, 2 * Math.PI, !0),
              n.closePath(),
              n.fill(),
              (n.fillStyle = "rgb(0,255,255)"),
              n.beginPath(),
              n.arc(100, 50, 50, 0, 2 * Math.PI, !0),
              n.closePath(),
              n.fill(),
              (n.fillStyle = "rgb(255,255,0)"),
              n.beginPath(),
              n.arc(75, 100, 50, 0, 2 * Math.PI, !0),
              n.closePath(),
              n.fill(),
              (n.fillStyle = "rgb(255,0,255)"),
              n.arc(75, 75, 75, 0, 2 * Math.PI, !0),
              n.arc(75, 75, 25, 0, 2 * Math.PI, !0),
              n.fill("evenodd"),
              r.toDataURL && t.push("canvas fp:" + r.toDataURL()),
              t
            );
          },
          w = function () {
            var e,
              t = function (t) {
                return (
                  e.clearColor(0, 0, 0, 1),
                  e.enable(e.DEPTH_TEST),
                  e.depthFunc(e.LEQUAL),
                  e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT),
                  "[" + t[0] + ", " + t[1] + "]"
                );
              };
            if (!(e = H())) return null;
            var r = [],
              n = e.createBuffer();
            e.bindBuffer(e.ARRAY_BUFFER, n);
            var i = new Float32Array([
              -0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0,
            ]);
            e.bufferData(e.ARRAY_BUFFER, i, e.STATIC_DRAW),
              (n.itemSize = 3),
              (n.numItems = 3);
            var o = e.createProgram(),
              a = e.createShader(e.VERTEX_SHADER);
            e.shaderSource(
              a,
              "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}"
            ),
              e.compileShader(a);
            var s = e.createShader(e.FRAGMENT_SHADER);
            e.shaderSource(
              s,
              "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}"
            ),
              e.compileShader(s),
              e.attachShader(o, a),
              e.attachShader(o, s),
              e.linkProgram(o),
              e.useProgram(o),
              (o.vertexPosAttrib = e.getAttribLocation(o, "attrVertex")),
              (o.offsetUniform = e.getUniformLocation(o, "uniformOffset")),
              e.enableVertexAttribArray(o.vertexPosArray),
              e.vertexAttribPointer(
                o.vertexPosAttrib,
                n.itemSize,
                e.FLOAT,
                !1,
                0,
                0
              ),
              e.uniform2f(o.offsetUniform, 1, 1),
              e.drawArrays(e.TRIANGLE_STRIP, 0, n.numItems);
            try {
              r.push(e.canvas.toDataURL());
            } catch (e) {}
            r.push(
              "extensions:" + (e.getSupportedExtensions() || []).join(";")
            ),
              r.push(
                "webgl aliased line width range:" +
                  t(e.getParameter(e.ALIASED_LINE_WIDTH_RANGE))
              ),
              r.push(
                "webgl aliased point size range:" +
                  t(e.getParameter(e.ALIASED_POINT_SIZE_RANGE))
              ),
              r.push("webgl alpha bits:" + e.getParameter(e.ALPHA_BITS)),
              r.push(
                "webgl antialiasing:" +
                  (e.getContextAttributes().antialias ? "yes" : "no")
              ),
              r.push("webgl blue bits:" + e.getParameter(e.BLUE_BITS)),
              r.push("webgl depth bits:" + e.getParameter(e.DEPTH_BITS)),
              r.push("webgl green bits:" + e.getParameter(e.GREEN_BITS)),
              r.push(
                "webgl max anisotropy:" +
                  (function (e) {
                    var t =
                      e.getExtension("EXT_texture_filter_anisotropic") ||
                      e.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
                      e.getExtension("MOZ_EXT_texture_filter_anisotropic");
                    if (t) {
                      var r = e.getParameter(t.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                      return 0 === r && (r = 2), r;
                    }
                    return null;
                  })(e)
              ),
              r.push(
                "webgl max combined texture image units:" +
                  e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
              ),
              r.push(
                "webgl max cube map texture size:" +
                  e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE)
              ),
              r.push(
                "webgl max fragment uniform vectors:" +
                  e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS)
              ),
              r.push(
                "webgl max render buffer size:" +
                  e.getParameter(e.MAX_RENDERBUFFER_SIZE)
              ),
              r.push(
                "webgl max texture image units:" +
                  e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS)
              ),
              r.push(
                "webgl max texture size:" + e.getParameter(e.MAX_TEXTURE_SIZE)
              ),
              r.push(
                "webgl max varying vectors:" +
                  e.getParameter(e.MAX_VARYING_VECTORS)
              ),
              r.push(
                "webgl max vertex attribs:" +
                  e.getParameter(e.MAX_VERTEX_ATTRIBS)
              ),
              r.push(
                "webgl max vertex texture image units:" +
                  e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS)
              ),
              r.push(
                "webgl max vertex uniform vectors:" +
                  e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS)
              ),
              r.push(
                "webgl max viewport dims:" +
                  t(e.getParameter(e.MAX_VIEWPORT_DIMS))
              ),
              r.push("webgl red bits:" + e.getParameter(e.RED_BITS)),
              r.push("webgl renderer:" + e.getParameter(e.RENDERER)),
              r.push(
                "webgl shading language version:" +
                  e.getParameter(e.SHADING_LANGUAGE_VERSION)
              ),
              r.push("webgl stencil bits:" + e.getParameter(e.STENCIL_BITS)),
              r.push("webgl vendor:" + e.getParameter(e.VENDOR)),
              r.push("webgl version:" + e.getParameter(e.VERSION));
            try {
              var d = e.getExtension("WEBGL_debug_renderer_info");
              d &&
                (r.push(
                  "webgl unmasked vendor:" +
                    e.getParameter(d.UNMASKED_VENDOR_WEBGL)
                ),
                r.push(
                  "webgl unmasked renderer:" +
                    e.getParameter(d.UNMASKED_RENDERER_WEBGL)
                ));
            } catch (e) {}
            return e.getShaderPrecisionFormat
              ? (c(["FLOAT", "INT"], function (t) {
                  c(["VERTEX", "FRAGMENT"], function (n) {
                    c(["HIGH", "MEDIUM", "LOW"], function (i) {
                      c(["precision", "rangeMin", "rangeMax"], function (o) {
                        var a = e.getShaderPrecisionFormat(
                          e[n + "_SHADER"],
                          e[i + "_" + t]
                        )[o];
                        "precision" !== o && (o = "precision " + o);
                        var s = [
                          "webgl ",
                          n.toLowerCase(),
                          " shader ",
                          i.toLowerCase(),
                          " ",
                          t.toLowerCase(),
                          " ",
                          o,
                          ":",
                          a,
                        ].join("");
                        r.push(s);
                      });
                    });
                  });
                }),
                j(e),
                r)
              : (j(e), r);
          },
          E = function () {
            try {
              var e = H(),
                t = e.getExtension("WEBGL_debug_renderer_info"),
                r =
                  e.getParameter(t.UNMASKED_VENDOR_WEBGL) +
                  "~" +
                  e.getParameter(t.UNMASKED_RENDERER_WEBGL);
              return j(e), r;
            } catch (e) {
              return null;
            }
          },
          C = function () {
            var e = document.createElement("div");
            (e.innerHTML = "&nbsp;"), (e.className = "adsbox");
            var t = !1;
            try {
              document.body.appendChild(e),
                (t =
                  0 ===
                  document.getElementsByClassName("adsbox")[0].offsetHeight),
                document.body.removeChild(e);
            } catch (e) {
              t = !1;
            }
            return t;
          },
          I = function () {
            if (void 0 !== navigator.languages)
              try {
                if (
                  navigator.languages[0].substr(0, 2) !==
                  navigator.language.substr(0, 2)
                )
                  return !0;
              } catch (e) {
                return !0;
              }
            return !1;
          },
          P = function () {
            return (
              window.screen.width < window.screen.availWidth ||
              window.screen.height < window.screen.availHeight
            );
          },
          R = function () {
            var e,
              t = navigator.userAgent.toLowerCase(),
              r = navigator.oscpu,
              n = navigator.platform.toLowerCase();
            if (
              ((e =
                t.indexOf("windows phone") >= 0
                  ? "Windows Phone"
                  : t.indexOf("windows") >= 0 ||
                    t.indexOf("win16") >= 0 ||
                    t.indexOf("win32") >= 0 ||
                    t.indexOf("win64") >= 0 ||
                    t.indexOf("win95") >= 0 ||
                    t.indexOf("win98") >= 0 ||
                    t.indexOf("winnt") >= 0 ||
                    t.indexOf("wow64") >= 0
                  ? "Windows"
                  : t.indexOf("android") >= 0
                  ? "Android"
                  : t.indexOf("linux") >= 0 ||
                    t.indexOf("cros") >= 0 ||
                    t.indexOf("x11") >= 0
                  ? "Linux"
                  : t.indexOf("iphone") >= 0 ||
                    t.indexOf("ipad") >= 0 ||
                    t.indexOf("ipod") >= 0 ||
                    t.indexOf("crios") >= 0 ||
                    t.indexOf("fxios") >= 0
                  ? "iOS"
                  : t.indexOf("macintosh") >= 0 ||
                    t.indexOf("mac_powerpc)") >= 0
                  ? "Mac"
                  : "Other"),
              ("ontouchstart" in window ||
                navigator.maxTouchPoints > 0 ||
                navigator.msMaxTouchPoints > 0) &&
                "Windows" !== e &&
                "Windows Phone" !== e &&
                "Android" !== e &&
                "iOS" !== e &&
                "Other" !== e &&
                -1 === t.indexOf("cros"))
            )
              return !0;
            if (void 0 !== r) {
              if (
                (r = r.toLowerCase()).indexOf("win") >= 0 &&
                "Windows" !== e &&
                "Windows Phone" !== e
              )
                return !0;
              if (r.indexOf("linux") >= 0 && "Linux" !== e && "Android" !== e)
                return !0;
              if (r.indexOf("mac") >= 0 && "Mac" !== e && "iOS" !== e)
                return !0;
              if (
                (-1 === r.indexOf("win") &&
                  -1 === r.indexOf("linux") &&
                  -1 === r.indexOf("mac")) !=
                ("Other" === e)
              )
                return !0;
            }
            return (
              (n.indexOf("win") >= 0 &&
                "Windows" !== e &&
                "Windows Phone" !== e) ||
              ((n.indexOf("linux") >= 0 ||
                n.indexOf("android") >= 0 ||
                n.indexOf("pike") >= 0) &&
                "Linux" !== e &&
                "Android" !== e) ||
              ((n.indexOf("mac") >= 0 ||
                n.indexOf("ipad") >= 0 ||
                n.indexOf("ipod") >= 0 ||
                n.indexOf("iphone") >= 0) &&
                "Mac" !== e &&
                "iOS" !== e) ||
              (!(n.indexOf("arm") >= 0 && "Windows Phone" === e) &&
                !(n.indexOf("pike") >= 0 && t.indexOf("opera mini") >= 0) &&
                ((n.indexOf("win") < 0 &&
                  n.indexOf("linux") < 0 &&
                  n.indexOf("mac") < 0 &&
                  n.indexOf("iphone") < 0 &&
                  n.indexOf("ipad") < 0 &&
                  n.indexOf("ipod") < 0) !=
                  ("Other" === e) ||
                  (void 0 === navigator.plugins &&
                    "Windows" !== e &&
                    "Windows Phone" !== e)))
            );
          },
          M = function () {
            var e,
              t = navigator.userAgent.toLowerCase(),
              r = navigator.productSub;
            if (t.indexOf("edge/") >= 0 || t.indexOf("iemobile/") >= 0)
              return !1;
            if (t.indexOf("opera mini") >= 0) return !1;
            if (
              ("Chrome" ==
                (e =
                  t.indexOf("firefox/") >= 0
                    ? "Firefox"
                    : t.indexOf("opera/") >= 0 || t.indexOf(" opr/") >= 0
                    ? "Opera"
                    : t.indexOf("chrome/") >= 0
                    ? "Chrome"
                    : t.indexOf("safari/") >= 0
                    ? t.indexOf("android 1.") >= 0 ||
                      t.indexOf("android 2.") >= 0 ||
                      t.indexOf("android 3.") >= 0 ||
                      t.indexOf("android 4.") >= 0
                      ? "AOSP"
                      : "Safari"
                    : t.indexOf("trident/") >= 0
                    ? "Internet Explorer"
                    : "Other") ||
                "Safari" === e ||
                "Opera" === e) &&
              "20030107" !== r
            )
              return !0;
            var n,
              i = eval.toString().length;
            if (37 === i && "Safari" !== e && "Firefox" !== e && "Other" !== e)
              return !0;
            if (39 === i && "Internet Explorer" !== e && "Other" !== e)
              return !0;
            if (
              33 === i &&
              "Chrome" !== e &&
              "AOSP" !== e &&
              "Opera" !== e &&
              "Other" !== e
            )
              return !0;
            try {
              throw "a";
            } catch (e) {
              try {
                e.toSource(), (n = !0);
              } catch (e) {
                n = !1;
              }
            }
            return n && "Firefox" !== e && "Other" !== e;
          },
          D = function () {
            var e = document.createElement("canvas");
            return !(!e.getContext || !e.getContext("2d"));
          },
          O = function () {
            if (!D()) return !1;
            var e = H(),
              t = !!window.WebGLRenderingContext && !!e;
            return j(e), t;
          },
          N = function () {
            return (
              "Microsoft Internet Explorer" === navigator.appName ||
              !(
                "Netscape" !== navigator.appName ||
                !/Trident/.test(navigator.userAgent)
              )
            );
          },
          x = function () {
            return (
              ("msWriteProfilerMark" in window) +
                ("msLaunchUri" in navigator) +
                ("msSaveBlob" in navigator) >=
              2
            );
          },
          L = function () {
            return void 0 !== window.swfobject;
          },
          B = function () {
            return window.swfobject.hasFlashPlayerVersion("9.0.0");
          },
          G = function (e, t) {
            var r = "___fp_swf_loaded";
            window[r] = function (t) {
              e(t);
            };
            var n = t.fonts.swfContainerId;
            !(function (e) {
              var t = document.createElement("div");
              t.setAttribute("id", e.fonts.swfContainerId),
                document.body.appendChild(t);
            })();
            var i = { onReady: r };
            window.swfobject.embedSWF(
              t.fonts.swfPath,
              n,
              "1",
              "1",
              "9.0.0",
              !1,
              i,
              { allowScriptAccess: "always", menu: "false" },
              {}
            );
          },
          H = function () {
            var e = document.createElement("canvas"),
              t = null;
            try {
              t = e.getContext("webgl") || e.getContext("experimental-webgl");
            } catch (e) {}
            return t || (t = null), t;
          },
          j = function (e) {
            var t = e.getExtension("WEBGL_lose_context");
            null != t && t.loseContext();
          },
          F = [
            {
              key: "userAgent",
              getData: function (e) {
                e(navigator.userAgent);
              },
            },
            {
              key: "webdriver",
              getData: function (e, t) {
                e(
                  null == navigator.webdriver
                    ? t.NOT_AVAILABLE
                    : navigator.webdriver
                );
              },
            },
            {
              key: "language",
              getData: function (e, t) {
                e(
                  navigator.language ||
                    navigator.userLanguage ||
                    navigator.browserLanguage ||
                    navigator.systemLanguage ||
                    t.NOT_AVAILABLE
                );
              },
            },
            {
              key: "colorDepth",
              getData: function (e, t) {
                e(window.screen.colorDepth || t.NOT_AVAILABLE);
              },
            },
            {
              key: "deviceMemory",
              getData: function (e, t) {
                e(navigator.deviceMemory || t.NOT_AVAILABLE);
              },
            },
            {
              key: "pixelRatio",
              getData: function (e, t) {
                e(window.devicePixelRatio || t.NOT_AVAILABLE);
              },
            },
            {
              key: "hardwareConcurrency",
              getData: function (e, t) {
                e(T(t));
              },
            },
            {
              key: "screenResolution",
              getData: function (e, t) {
                e(l(t));
              },
            },
            {
              key: "availableScreenResolution",
              getData: function (e, t) {
                e(A(t));
              },
            },
            {
              key: "timezoneOffset",
              getData: function (e) {
                e(new Date().getTimezoneOffset());
              },
            },
            {
              key: "timezone",
              getData: function (e, t) {
                window.Intl && window.Intl.DateTimeFormat
                  ? e(
                      new window.Intl.DateTimeFormat().resolvedOptions()
                        .timeZone || t.NOT_AVAILABLE
                    )
                  : e(t.NOT_AVAILABLE);
              },
            },
            {
              key: "sessionStorage",
              getData: function (e, t) {
                e(m(t));
              },
            },
            {
              key: "localStorage",
              getData: function (e, t) {
                e(g(t));
              },
            },
            {
              key: "indexedDb",
              getData: function (e, t) {
                e(v(t));
              },
            },
            {
              key: "addBehavior",
              getData: function (e) {
                e(!!window.HTMLElement.prototype.addBehavior);
              },
            },
            {
              key: "openDatabase",
              getData: function (e) {
                e(!!window.openDatabase);
              },
            },
            {
              key: "cpuClass",
              getData: function (e, t) {
                e(b(t));
              },
            },
            {
              key: "platform",
              getData: function (e, t) {
                e(S(t));
              },
            },
            {
              key: "doNotTrack",
              getData: function (e, t) {
                e(y(t));
              },
            },
            {
              key: "plugins",
              getData: function (e, t) {
                N() ? (t.plugins.excludeIE ? e(t.EXCLUDED) : e(f(t))) : e(h(t));
              },
            },
            {
              key: "canvas",
              getData: function (e, t) {
                D() ? e(_(t)) : e(t.NOT_AVAILABLE);
              },
            },
            {
              key: "webgl",
              getData: function (e, t) {
                O() ? e(w()) : e(t.NOT_AVAILABLE);
              },
            },
            {
              key: "webglVendorAndRenderer",
              getData: function (e) {
                O() ? e(E()) : e();
              },
            },
            {
              key: "adBlock",
              getData: function (e) {
                e(C());
              },
            },
            {
              key: "hasLiedLanguages",
              getData: function (e) {
                e(I());
              },
            },
            {
              key: "hasLiedResolution",
              getData: function (e) {
                e(P());
              },
            },
            {
              key: "hasLiedOs",
              getData: function (e) {
                e(R());
              },
            },
            {
              key: "hasLiedBrowser",
              getData: function (e) {
                e(M());
              },
            },
            {
              key: "touchSupport",
              getData: function (e) {
                e(k());
              },
            },
            {
              key: "fonts",
              getData: function (e, t) {
                var r = ["monospace", "sans-serif", "serif"],
                  n = [
                    "Andale Mono",
                    "Arial",
                    "Arial Black",
                    "Arial Hebrew",
                    "Arial MT",
                    "Arial Narrow",
                    "Arial Rounded MT Bold",
                    "Arial Unicode MS",
                    "Bitstream Vera Sans Mono",
                    "Book Antiqua",
                    "Bookman Old Style",
                    "Calibri",
                    "Cambria",
                    "Cambria Math",
                    "Century",
                    "Century Gothic",
                    "Century Schoolbook",
                    "Comic Sans",
                    "Comic Sans MS",
                    "Consolas",
                    "Courier",
                    "Courier New",
                    "Geneva",
                    "Georgia",
                    "Helvetica",
                    "Helvetica Neue",
                    "Impact",
                    "Lucida Bright",
                    "Lucida Calligraphy",
                    "Lucida Console",
                    "Lucida Fax",
                    "LUCIDA GRANDE",
                    "Lucida Handwriting",
                    "Lucida Sans",
                    "Lucida Sans Typewriter",
                    "Lucida Sans Unicode",
                    "Microsoft Sans Serif",
                    "Monaco",
                    "Monotype Corsiva",
                    "MS Gothic",
                    "MS Outlook",
                    "MS PGothic",
                    "MS Reference Sans Serif",
                    "MS Sans Serif",
                    "MS Serif",
                    "MYRIAD",
                    "MYRIAD PRO",
                    "Palatino",
                    "Palatino Linotype",
                    "Segoe Print",
                    "Segoe Script",
                    "Segoe UI",
                    "Segoe UI Light",
                    "Segoe UI Semibold",
                    "Segoe UI Symbol",
                    "Tahoma",
                    "Times",
                    "Times New Roman",
                    "Times New Roman PS",
                    "Trebuchet MS",
                    "Verdana",
                    "Wingdings",
                    "Wingdings 2",
                    "Wingdings 3",
                  ];
                t.fonts.extendedJsFonts &&
                  (n = n.concat([
                    "Abadi MT Condensed Light",
                    "Academy Engraved LET",
                    "ADOBE CASLON PRO",
                    "Adobe Garamond",
                    "ADOBE GARAMOND PRO",
                    "Agency FB",
                    "Aharoni",
                    "Albertus Extra Bold",
                    "Albertus Medium",
                    "Algerian",
                    "Amazone BT",
                    "American Typewriter",
                    "American Typewriter Condensed",
                    "AmerType Md BT",
                    "Andalus",
                    "Angsana New",
                    "AngsanaUPC",
                    "Antique Olive",
                    "Aparajita",
                    "Apple Chancery",
                    "Apple Color Emoji",
                    "Apple SD Gothic Neo",
                    "Arabic Typesetting",
                    "ARCHER",
                    "ARNO PRO",
                    "Arrus BT",
                    "Aurora Cn BT",
                    "AvantGarde Bk BT",
                    "AvantGarde Md BT",
                    "AVENIR",
                    "Ayuthaya",
                    "Bandy",
                    "Bangla Sangam MN",
                    "Bank Gothic",
                    "BankGothic Md BT",
                    "Baskerville",
                    "Baskerville Old Face",
                    "Batang",
                    "BatangChe",
                    "Bauer Bodoni",
                    "Bauhaus 93",
                    "Bazooka",
                    "Bell MT",
                    "Bembo",
                    "Benguiat Bk BT",
                    "Berlin Sans FB",
                    "Berlin Sans FB Demi",
                    "Bernard MT Condensed",
                    "BernhardFashion BT",
                    "BernhardMod BT",
                    "Big Caslon",
                    "BinnerD",
                    "Blackadder ITC",
                    "BlairMdITC TT",
                    "Bodoni 72",
                    "Bodoni 72 Oldstyle",
                    "Bodoni 72 Smallcaps",
                    "Bodoni MT",
                    "Bodoni MT Black",
                    "Bodoni MT Condensed",
                    "Bodoni MT Poster Compressed",
                    "Bookshelf Symbol 7",
                    "Boulder",
                    "Bradley Hand",
                    "Bradley Hand ITC",
                    "Bremen Bd BT",
                    "Britannic Bold",
                    "Broadway",
                    "Browallia New",
                    "BrowalliaUPC",
                    "Brush Script MT",
                    "Californian FB",
                    "Calisto MT",
                    "Calligrapher",
                    "Candara",
                    "CaslonOpnface BT",
                    "Castellar",
                    "Centaur",
                    "Cezanne",
                    "CG Omega",
                    "CG Times",
                    "Chalkboard",
                    "Chalkboard SE",
                    "Chalkduster",
                    "Charlesworth",
                    "Charter Bd BT",
                    "Charter BT",
                    "Chaucer",
                    "ChelthmITC Bk BT",
                    "Chiller",
                    "Clarendon",
                    "Clarendon Condensed",
                    "CloisterBlack BT",
                    "Cochin",
                    "Colonna MT",
                    "Constantia",
                    "Cooper Black",
                    "Copperplate",
                    "Copperplate Gothic",
                    "Copperplate Gothic Bold",
                    "Copperplate Gothic Light",
                    "CopperplGoth Bd BT",
                    "Corbel",
                    "Cordia New",
                    "CordiaUPC",
                    "Cornerstone",
                    "Coronet",
                    "Cuckoo",
                    "Curlz MT",
                    "DaunPenh",
                    "Dauphin",
                    "David",
                    "DB LCD Temp",
                    "DELICIOUS",
                    "Denmark",
                    "DFKai-SB",
                    "Didot",
                    "DilleniaUPC",
                    "DIN",
                    "DokChampa",
                    "Dotum",
                    "DotumChe",
                    "Ebrima",
                    "Edwardian Script ITC",
                    "Elephant",
                    "English 111 Vivace BT",
                    "Engravers MT",
                    "EngraversGothic BT",
                    "Eras Bold ITC",
                    "Eras Demi ITC",
                    "Eras Light ITC",
                    "Eras Medium ITC",
                    "EucrosiaUPC",
                    "Euphemia",
                    "Euphemia UCAS",
                    "EUROSTILE",
                    "Exotc350 Bd BT",
                    "FangSong",
                    "Felix Titling",
                    "Fixedsys",
                    "FONTIN",
                    "Footlight MT Light",
                    "Forte",
                    "FrankRuehl",
                    "Fransiscan",
                    "Freefrm721 Blk BT",
                    "FreesiaUPC",
                    "Freestyle Script",
                    "French Script MT",
                    "FrnkGothITC Bk BT",
                    "Fruitger",
                    "FRUTIGER",
                    "Futura",
                    "Futura Bk BT",
                    "Futura Lt BT",
                    "Futura Md BT",
                    "Futura ZBlk BT",
                    "FuturaBlack BT",
                    "Gabriola",
                    "Galliard BT",
                    "Gautami",
                    "Geeza Pro",
                    "Geometr231 BT",
                    "Geometr231 Hv BT",
                    "Geometr231 Lt BT",
                    "GeoSlab 703 Lt BT",
                    "GeoSlab 703 XBd BT",
                    "Gigi",
                    "Gill Sans",
                    "Gill Sans MT",
                    "Gill Sans MT Condensed",
                    "Gill Sans MT Ext Condensed Bold",
                    "Gill Sans Ultra Bold",
                    "Gill Sans Ultra Bold Condensed",
                    "Gisha",
                    "Gloucester MT Extra Condensed",
                    "GOTHAM",
                    "GOTHAM BOLD",
                    "Goudy Old Style",
                    "Goudy Stout",
                    "GoudyHandtooled BT",
                    "GoudyOLSt BT",
                    "Gujarati Sangam MN",
                    "Gulim",
                    "GulimChe",
                    "Gungsuh",
                    "GungsuhChe",
                    "Gurmukhi MN",
                    "Haettenschweiler",
                    "Harlow Solid Italic",
                    "Harrington",
                    "Heather",
                    "Heiti SC",
                    "Heiti TC",
                    "HELV",
                    "Herald",
                    "High Tower Text",
                    "Hiragino Kaku Gothic ProN",
                    "Hiragino Mincho ProN",
                    "Hoefler Text",
                    "Humanst 521 Cn BT",
                    "Humanst521 BT",
                    "Humanst521 Lt BT",
                    "Imprint MT Shadow",
                    "Incised901 Bd BT",
                    "Incised901 BT",
                    "Incised901 Lt BT",
                    "INCONSOLATA",
                    "Informal Roman",
                    "Informal011 BT",
                    "INTERSTATE",
                    "IrisUPC",
                    "Iskoola Pota",
                    "JasmineUPC",
                    "Jazz LET",
                    "Jenson",
                    "Jester",
                    "Jokerman",
                    "Juice ITC",
                    "Kabel Bk BT",
                    "Kabel Ult BT",
                    "Kailasa",
                    "KaiTi",
                    "Kalinga",
                    "Kannada Sangam MN",
                    "Kartika",
                    "Kaufmann Bd BT",
                    "Kaufmann BT",
                    "Khmer UI",
                    "KodchiangUPC",
                    "Kokila",
                    "Korinna BT",
                    "Kristen ITC",
                    "Krungthep",
                    "Kunstler Script",
                    "Lao UI",
                    "Latha",
                    "Leelawadee",
                    "Letter Gothic",
                    "Levenim MT",
                    "LilyUPC",
                    "Lithograph",
                    "Lithograph Light",
                    "Long Island",
                    "Lydian BT",
                    "Magneto",
                    "Maiandra GD",
                    "Malayalam Sangam MN",
                    "Malgun Gothic",
                    "Mangal",
                    "Marigold",
                    "Marion",
                    "Marker Felt",
                    "Market",
                    "Marlett",
                    "Matisse ITC",
                    "Matura MT Script Capitals",
                    "Meiryo",
                    "Meiryo UI",
                    "Microsoft Himalaya",
                    "Microsoft JhengHei",
                    "Microsoft New Tai Lue",
                    "Microsoft PhagsPa",
                    "Microsoft Tai Le",
                    "Microsoft Uighur",
                    "Microsoft YaHei",
                    "Microsoft Yi Baiti",
                    "MingLiU",
                    "MingLiU_HKSCS",
                    "MingLiU_HKSCS-ExtB",
                    "MingLiU-ExtB",
                    "Minion",
                    "Minion Pro",
                    "Miriam",
                    "Miriam Fixed",
                    "Mistral",
                    "Modern",
                    "Modern No. 20",
                    "Mona Lisa Solid ITC TT",
                    "Mongolian Baiti",
                    "MONO",
                    "MoolBoran",
                    "Mrs Eaves",
                    "MS LineDraw",
                    "MS Mincho",
                    "MS PMincho",
                    "MS Reference Specialty",
                    "MS UI Gothic",
                    "MT Extra",
                    "MUSEO",
                    "MV Boli",
                    "Nadeem",
                    "Narkisim",
                    "NEVIS",
                    "News Gothic",
                    "News GothicMT",
                    "NewsGoth BT",
                    "Niagara Engraved",
                    "Niagara Solid",
                    "Noteworthy",
                    "NSimSun",
                    "Nyala",
                    "OCR A Extended",
                    "Old Century",
                    "Old English Text MT",
                    "Onyx",
                    "Onyx BT",
                    "OPTIMA",
                    "Oriya Sangam MN",
                    "OSAKA",
                    "OzHandicraft BT",
                    "Palace Script MT",
                    "Papyrus",
                    "Parchment",
                    "Party LET",
                    "Pegasus",
                    "Perpetua",
                    "Perpetua Titling MT",
                    "PetitaBold",
                    "Pickwick",
                    "Plantagenet Cherokee",
                    "Playbill",
                    "PMingLiU",
                    "PMingLiU-ExtB",
                    "Poor Richard",
                    "Poster",
                    "PosterBodoni BT",
                    "PRINCETOWN LET",
                    "Pristina",
                    "PTBarnum BT",
                    "Pythagoras",
                    "Raavi",
                    "Rage Italic",
                    "Ravie",
                    "Ribbon131 Bd BT",
                    "Rockwell",
                    "Rockwell Condensed",
                    "Rockwell Extra Bold",
                    "Rod",
                    "Roman",
                    "Sakkal Majalla",
                    "Santa Fe LET",
                    "Savoye LET",
                    "Sceptre",
                    "Script",
                    "Script MT Bold",
                    "SCRIPTINA",
                    "Serifa",
                    "Serifa BT",
                    "Serifa Th BT",
                    "ShelleyVolante BT",
                    "Sherwood",
                    "Shonar Bangla",
                    "Showcard Gothic",
                    "Shruti",
                    "Signboard",
                    "SILKSCREEN",
                    "SimHei",
                    "Simplified Arabic",
                    "Simplified Arabic Fixed",
                    "SimSun",
                    "SimSun-ExtB",
                    "Sinhala Sangam MN",
                    "Sketch Rockwell",
                    "Skia",
                    "Small Fonts",
                    "Snap ITC",
                    "Snell Roundhand",
                    "Socket",
                    "Souvenir Lt BT",
                    "Staccato222 BT",
                    "Steamer",
                    "Stencil",
                    "Storybook",
                    "Styllo",
                    "Subway",
                    "Swis721 BlkEx BT",
                    "Swiss911 XCm BT",
                    "Sylfaen",
                    "Synchro LET",
                    "System",
                    "Tamil Sangam MN",
                    "Technical",
                    "Teletype",
                    "Telugu Sangam MN",
                    "Tempus Sans ITC",
                    "Terminal",
                    "Thonburi",
                    "Traditional Arabic",
                    "Trajan",
                    "TRAJAN PRO",
                    "Tristan",
                    "Tubular",
                    "Tunga",
                    "Tw Cen MT",
                    "Tw Cen MT Condensed",
                    "Tw Cen MT Condensed Extra Bold",
                    "TypoUpright BT",
                    "Unicorn",
                    "Univers",
                    "Univers CE 55 Medium",
                    "Univers Condensed",
                    "Utsaah",
                    "Vagabond",
                    "Vani",
                    "Vijaya",
                    "Viner Hand ITC",
                    "VisualUI",
                    "Vivaldi",
                    "Vladimir Script",
                    "Vrinda",
                    "Westminster",
                    "WHITNEY",
                    "Wide Latin",
                    "ZapfEllipt BT",
                    "ZapfHumnst BT",
                    "ZapfHumnst Dm BT",
                    "Zapfino",
                    "Zurich BlkEx BT",
                    "Zurich Ex BT",
                    "ZWAdobeF",
                  ])),
                  (n = (n = n.concat(t.fonts.userDefinedFonts)).filter(
                    function (e, t) {
                      return n.indexOf(e) === t;
                    }
                  ));
                var i = document.getElementsByTagName("body")[0],
                  o = document.createElement("div"),
                  a = document.createElement("div"),
                  s = {},
                  c = {},
                  d = function () {
                    var e = document.createElement("span");
                    return (
                      (e.style.position = "absolute"),
                      (e.style.left = "-9999px"),
                      (e.style.fontSize = "72px"),
                      (e.style.fontStyle = "normal"),
                      (e.style.fontWeight = "normal"),
                      (e.style.letterSpacing = "normal"),
                      (e.style.lineBreak = "auto"),
                      (e.style.lineHeight = "normal"),
                      (e.style.textTransform = "none"),
                      (e.style.textAlign = "left"),
                      (e.style.textDecoration = "none"),
                      (e.style.textShadow = "none"),
                      (e.style.whiteSpace = "normal"),
                      (e.style.wordBreak = "normal"),
                      (e.style.wordSpacing = "normal"),
                      (e.innerHTML = "mmmmmmmmmmlli"),
                      e
                    );
                  },
                  u = function (e, t) {
                    var r = d();
                    return (r.style.fontFamily = "'" + e + "'," + t), r;
                  },
                  l = function (e) {
                    for (var t = !1, n = 0; n < r.length; n++)
                      if (
                        (t =
                          e[n].offsetWidth !== s[r[n]] ||
                          e[n].offsetHeight !== c[r[n]])
                      )
                        return t;
                    return t;
                  },
                  A = (function () {
                    for (var e = [], t = 0, n = r.length; t < n; t++) {
                      var i = d();
                      (i.style.fontFamily = r[t]), o.appendChild(i), e.push(i);
                    }
                    return e;
                  })();
                i.appendChild(o);
                for (var h = 0, f = r.length; h < f; h++)
                  (s[r[h]] = A[h].offsetWidth), (c[r[h]] = A[h].offsetHeight);
                var p = (function () {
                  for (var e = {}, t = 0, i = n.length; t < i; t++) {
                    for (var o = [], s = 0, c = r.length; s < c; s++) {
                      var d = u(n[t], r[s]);
                      a.appendChild(d), o.push(d);
                    }
                    e[n[t]] = o;
                  }
                  return e;
                })();
                i.appendChild(a);
                for (var m = [], g = 0, v = n.length; g < v; g++)
                  l(p[n[g]]) && m.push(n[g]);
                i.removeChild(a), i.removeChild(o), e(m);
              },
              pauseBefore: !0,
            },
            {
              key: "fontsFlash",
              getData: function (e, t) {
                return L()
                  ? B()
                    ? t.fonts.swfPath
                      ? void G(function (t) {
                          e(t);
                        }, t)
                      : e("missing options.fonts.swfPath")
                    : e("flash not installed")
                  : e("swf object not loaded");
              },
              pauseBefore: !0,
            },
            {
              key: "audio",
              getData: function (e, t) {
                var r = t.audio;
                if (
                  r.excludeIOS11 &&
                  navigator.userAgent.match(/OS 11.+Version\/11.+Safari/)
                )
                  return e(t.EXCLUDED);
                var n =
                  window.OfflineAudioContext ||
                  window.webkitOfflineAudioContext;
                if (null == n) return e(t.NOT_AVAILABLE);
                var i = new n(1, 44100, 44100),
                  o = i.createOscillator();
                (o.type = "triangle"),
                  o.frequency.setValueAtTime(1e4, i.currentTime);
                var a = i.createDynamicsCompressor();
                c(
                  [
                    ["threshold", -50],
                    ["knee", 40],
                    ["ratio", 12],
                    ["reduction", -20],
                    ["attack", 0],
                    ["release", 0.25],
                  ],
                  function (e) {
                    void 0 !== a[e[0]] &&
                      "function" == typeof a[e[0]].setValueAtTime &&
                      a[e[0]].setValueAtTime(e[1], i.currentTime);
                  }
                ),
                  o.connect(a),
                  a.connect(i.destination),
                  o.start(0),
                  i.startRendering();
                var s = setTimeout(function () {
                  return (
                    console.warn(
                      'Audio fingerprint timed out. Please report bug at https://github.com/fingerprintjs/fingerprintjs with your user agent: "' +
                        navigator.userAgent +
                        '".'
                    ),
                    (i.oncomplete = function () {}),
                    (i = null),
                    e("audioTimeout")
                  );
                }, r.timeout);
                i.oncomplete = function (t) {
                  var r;
                  try {
                    clearTimeout(s),
                      (r = t.renderedBuffer
                        .getChannelData(0)
                        .slice(4500, 5e3)
                        .reduce(function (e, t) {
                          return e + Math.abs(t);
                        }, 0)
                        .toString()),
                      o.disconnect(),
                      a.disconnect();
                  } catch (t) {
                    return void e(t);
                  }
                  e(r);
                };
              },
            },
            {
              key: "enumerateDevices",
              getData: function (e, t) {
                if (!u()) return e(t.NOT_AVAILABLE);
                navigator.mediaDevices
                  .enumerateDevices()
                  .then(function (t) {
                    e(
                      t.map(function (e) {
                        return (
                          "id=" +
                          e.deviceId +
                          ";gid=" +
                          e.groupId +
                          ";" +
                          e.kind +
                          ";" +
                          e.label
                        );
                      })
                    );
                  })
                  .catch(function (t) {
                    e(t);
                  });
              },
            },
          ],
          V = function (e) {
            throw new Error(
              "'new Fingerprint()' is deprecated, see https://github.com/fingerprintjs/fingerprintjs#upgrade-guide-from-182-to-200"
            );
          };
        return (
          (V.get = function (e, t) {
            t ? e || (e = {}) : ((t = e), (e = {})),
              (function (e, t) {
                if (null == t) return e;
                var r, n;
                for (n in t)
                  null == (r = t[n]) ||
                    Object.prototype.hasOwnProperty.call(e, n) ||
                    (e[n] = r);
              })(e, s),
              (e.components = e.extraComponents.concat(F));
            var r = {
                data: [],
                addPreprocessedComponent: function (t, n) {
                  "function" == typeof e.preprocessor &&
                    (n = e.preprocessor(t, n)),
                    r.data.push({ key: t, value: n });
                },
              },
              n = -1,
              i = function (o) {
                if ((n += 1) >= e.components.length) t(r.data);
                else {
                  var a = e.components[n];
                  if (e.excludes[a.key]) i(!1);
                  else {
                    if (!o && a.pauseBefore)
                      return (
                        (n -= 1),
                        void setTimeout(function () {
                          i(!0);
                        }, 1)
                      );
                    try {
                      a.getData(function (e) {
                        r.addPreprocessedComponent(a.key, e), i(!1);
                      }, e);
                    } catch (e) {
                      r.addPreprocessedComponent(a.key, String(e)), i(!1);
                    }
                  }
                }
              };
            i(!1);
          }),
          (V.getPromise = function (e) {
            return new Promise(function (t, r) {
              V.get(e, t);
            });
          }),
          (V.getV18 = function (e, t) {
            return (
              null == t && ((t = e), (e = {})),
              V.get(e, function (r) {
                for (var n = [], i = 0; i < r.length; i++) {
                  var o = r[i];
                  if (o.value === (e.NOT_AVAILABLE || "not available"))
                    n.push({ key: o.key, value: "unknown" });
                  else if ("plugins" === o.key)
                    n.push({
                      key: "plugins",
                      value: d(o.value, function (e) {
                        var t = d(e[2], function (e) {
                          return e.join ? e.join("~") : e;
                        }).join(",");
                        return [e[0], e[1], t].join("::");
                      }),
                    });
                  else if (
                    -1 !== ["canvas", "webgl"].indexOf(o.key) &&
                    Array.isArray(o.value)
                  )
                    n.push({ key: o.key, value: o.value.join("~") });
                  else if (
                    -1 !==
                    [
                      "sessionStorage",
                      "localStorage",
                      "indexedDb",
                      "addBehavior",
                      "openDatabase",
                    ].indexOf(o.key)
                  ) {
                    if (!o.value) continue;
                    n.push({ key: o.key, value: 1 });
                  } else
                    o.value
                      ? n.push(
                          o.value.join
                            ? { key: o.key, value: o.value.join(";") }
                            : o
                        )
                      : n.push({ key: o.key, value: o.value });
                }
                var s = a(
                  d(n, function (e) {
                    return e.value;
                  }).join("~~~"),
                  31
                );
                t(s, n);
              })
            );
          }),
          (V.x64hash128 = a),
          (V.VERSION = "2.1.4"),
          V
        );
      }),
      e.exports
        ? (e.exports = r())
        : t.exports
        ? (t.exports = r())
        : (t.Fingerprint2 = r());
  })(Re);
  var Me = K(Re.exports);
  function De(e) {
    throw new Error(
      'Could not dynamically require "' +
        e +
        '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.'
    );
  }
  var Oe = { exports: {} };
  /*!
      localForage -- Offline Storage, Improved
      Version 1.10.0
      https://localforage.github.io/localForage
      (c) 2013-2017 Mozilla, Apache License 2.0
  */ !(function (e, t) {
    e.exports = (function e(t, r, n) {
      function i(a, s) {
        if (!r[a]) {
          if (!t[a]) {
            if (!s && De) return De(a);
            if (o) return o(a, !0);
            var c = new Error("Cannot find module '" + a + "'");
            throw ((c.code = "MODULE_NOT_FOUND"), c);
          }
          var d = (r[a] = { exports: {} });
          t[a][0].call(
            d.exports,
            function (e) {
              var r = t[a][1][e];
              return i(r || e);
            },
            d,
            d.exports,
            e,
            t,
            r,
            n
          );
        }
        return r[a].exports;
      }
      for (var o = De, a = 0; a < n.length; a++) i(n[a]);
      return i;
    })(
      {
        1: [
          function (e, t, r) {
            (function (e) {
              var r,
                n,
                i = e.MutationObserver || e.WebKitMutationObserver;
              if (i) {
                var o = 0,
                  a = new i(u),
                  s = e.document.createTextNode("");
                a.observe(s, { characterData: !0 }),
                  (r = function () {
                    s.data = o = ++o % 2;
                  });
              } else if (e.setImmediate || void 0 === e.MessageChannel)
                r =
                  "document" in e &&
                  "onreadystatechange" in e.document.createElement("script")
                    ? function () {
                        var t = e.document.createElement("script");
                        (t.onreadystatechange = function () {
                          u(),
                            (t.onreadystatechange = null),
                            t.parentNode.removeChild(t),
                            (t = null);
                        }),
                          e.document.documentElement.appendChild(t);
                      }
                    : function () {
                        setTimeout(u, 0);
                      };
              else {
                var c = new e.MessageChannel();
                (c.port1.onmessage = u),
                  (r = function () {
                    c.port2.postMessage(0);
                  });
              }
              var d = [];
              function u() {
                var e, t;
                n = !0;
                for (var r = d.length; r; ) {
                  for (t = d, d = [], e = -1; ++e < r; ) t[e]();
                  r = d.length;
                }
                n = !1;
              }
              function l(e) {
                1 !== d.push(e) || n || r();
              }
              t.exports = l;
            }).call(
              this,
              void 0 !== X
                ? X
                : "undefined" != typeof self
                ? self
                : "undefined" != typeof window
                ? window
                : {}
            );
          },
          {},
        ],
        2: [
          function (e, t, r) {
            var n = e(1);
            function i() {}
            var o = {},
              a = ["REJECTED"],
              s = ["FULFILLED"],
              c = ["PENDING"];
            function d(e) {
              if ("function" != typeof e)
                throw new TypeError("resolver must be a function");
              (this.state = c),
                (this.queue = []),
                (this.outcome = void 0),
                e !== i && h(this, e);
            }
            function u(e, t, r) {
              (this.promise = e),
                "function" == typeof t &&
                  ((this.onFulfilled = t),
                  (this.callFulfilled = this.otherCallFulfilled)),
                "function" == typeof r &&
                  ((this.onRejected = r),
                  (this.callRejected = this.otherCallRejected));
            }
            function l(e, t, r) {
              n(function () {
                var n;
                try {
                  n = t(r);
                } catch (t) {
                  return o.reject(e, t);
                }
                n === e
                  ? o.reject(
                      e,
                      new TypeError("Cannot resolve promise with itself")
                    )
                  : o.resolve(e, n);
              });
            }
            function A(e) {
              var t = e && e.then;
              if (
                e &&
                ("object" == typeof e || "function" == typeof e) &&
                "function" == typeof t
              )
                return function () {
                  t.apply(e, arguments);
                };
            }
            function h(e, t) {
              var r = !1;
              function n(t) {
                r || ((r = !0), o.reject(e, t));
              }
              function i(t) {
                r || ((r = !0), o.resolve(e, t));
              }
              function a() {
                t(i, n);
              }
              var s = f(a);
              "error" === s.status && n(s.value);
            }
            function f(e, t) {
              var r = {};
              try {
                (r.value = e(t)), (r.status = "success");
              } catch (e) {
                (r.status = "error"), (r.value = e);
              }
              return r;
            }
            function p(e) {
              return e instanceof this ? e : o.resolve(new this(i), e);
            }
            function m(e) {
              var t = new this(i);
              return o.reject(t, e);
            }
            function g(e) {
              var t = this;
              if ("[object Array]" !== Object.prototype.toString.call(e))
                return this.reject(new TypeError("must be an array"));
              var r = e.length,
                n = !1;
              if (!r) return this.resolve([]);
              for (
                var a = new Array(r), s = 0, c = -1, d = new this(i);
                ++c < r;

              )
                u(e[c], c);
              return d;
              function u(e, i) {
                function c(e) {
                  (a[i] = e), ++s !== r || n || ((n = !0), o.resolve(d, a));
                }
                t.resolve(e).then(c, function (e) {
                  n || ((n = !0), o.reject(d, e));
                });
              }
            }
            function v(e) {
              var t = this;
              if ("[object Array]" !== Object.prototype.toString.call(e))
                return this.reject(new TypeError("must be an array"));
              var r = e.length,
                n = !1;
              if (!r) return this.resolve([]);
              for (var a = -1, s = new this(i); ++a < r; ) c(e[a]);
              return s;
              function c(e) {
                t.resolve(e).then(
                  function (e) {
                    n || ((n = !0), o.resolve(s, e));
                  },
                  function (e) {
                    n || ((n = !0), o.reject(s, e));
                  }
                );
              }
            }
            (t.exports = d),
              (d.prototype.catch = function (e) {
                return this.then(null, e);
              }),
              (d.prototype.then = function (e, t) {
                if (
                  ("function" != typeof e && this.state === s) ||
                  ("function" != typeof t && this.state === a)
                )
                  return this;
                var r = new this.constructor(i);
                return (
                  this.state !== c
                    ? l(r, this.state === s ? e : t, this.outcome)
                    : this.queue.push(new u(r, e, t)),
                  r
                );
              }),
              (u.prototype.callFulfilled = function (e) {
                o.resolve(this.promise, e);
              }),
              (u.prototype.otherCallFulfilled = function (e) {
                l(this.promise, this.onFulfilled, e);
              }),
              (u.prototype.callRejected = function (e) {
                o.reject(this.promise, e);
              }),
              (u.prototype.otherCallRejected = function (e) {
                l(this.promise, this.onRejected, e);
              }),
              (o.resolve = function (e, t) {
                var r = f(A, t);
                if ("error" === r.status) return o.reject(e, r.value);
                var n = r.value;
                if (n) h(e, n);
                else {
                  (e.state = s), (e.outcome = t);
                  for (var i = -1, a = e.queue.length; ++i < a; )
                    e.queue[i].callFulfilled(t);
                }
                return e;
              }),
              (o.reject = function (e, t) {
                (e.state = a), (e.outcome = t);
                for (var r = -1, n = e.queue.length; ++r < n; )
                  e.queue[r].callRejected(t);
                return e;
              }),
              (d.resolve = p),
              (d.reject = m),
              (d.all = g),
              (d.race = v);
          },
          { 1: 1 },
        ],
        3: [
          function (e, t, r) {
            (function (t) {
              "function" != typeof t.Promise && (t.Promise = e(2));
            }).call(
              this,
              void 0 !== X
                ? X
                : "undefined" != typeof self
                ? self
                : "undefined" != typeof window
                ? window
                : {}
            );
          },
          { 2: 2 },
        ],
        4: [
          function (e, t, r) {
            var n =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (e) {
                    return typeof e;
                  }
                : function (e) {
                    return e &&
                      "function" == typeof Symbol &&
                      e.constructor === Symbol &&
                      e !== Symbol.prototype
                      ? "symbol"
                      : typeof e;
                  };
            function i(e, t) {
              if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function");
            }
            function o() {
              try {
                if ("undefined" != typeof indexedDB) return indexedDB;
                if ("undefined" != typeof webkitIndexedDB)
                  return webkitIndexedDB;
                if ("undefined" != typeof mozIndexedDB) return mozIndexedDB;
                if ("undefined" != typeof OIndexedDB) return OIndexedDB;
                if ("undefined" != typeof msIndexedDB) return msIndexedDB;
              } catch (e) {
                return;
              }
            }
            var a = o();
            function s() {
              try {
                if (!a || !a.open) return !1;
                var e =
                    "undefined" != typeof openDatabase &&
                    /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) &&
                    !/Chrome/.test(navigator.userAgent) &&
                    !/BlackBerry/.test(navigator.platform),
                  t =
                    "function" == typeof fetch &&
                    -1 !== fetch.toString().indexOf("[native code");
                return (
                  (!e || t) &&
                  "undefined" != typeof indexedDB &&
                  "undefined" != typeof IDBKeyRange
                );
              } catch (e) {
                return !1;
              }
            }
            function c(e, t) {
              (e = e || []), (t = t || {});
              try {
                return new Blob(e, t);
              } catch (i) {
                if ("TypeError" !== i.name) throw i;
                for (
                  var r = new (
                      "undefined" != typeof BlobBuilder
                        ? BlobBuilder
                        : "undefined" != typeof MSBlobBuilder
                        ? MSBlobBuilder
                        : "undefined" != typeof MozBlobBuilder
                        ? MozBlobBuilder
                        : WebKitBlobBuilder
                    )(),
                    n = 0;
                  n < e.length;
                  n += 1
                )
                  r.append(e[n]);
                return r.getBlob(t.type);
              }
            }
            "undefined" == typeof Promise && e(3);
            var d = Promise;
            function u(e, t) {
              t &&
                e.then(
                  function (e) {
                    t(null, e);
                  },
                  function (e) {
                    t(e);
                  }
                );
            }
            function l(e, t, r) {
              "function" == typeof t && e.then(t),
                "function" == typeof r && e.catch(r);
            }
            function A(e) {
              return (
                "string" != typeof e &&
                  (console.warn(e + " used as a key, but it is not a string."),
                  (e = String(e))),
                e
              );
            }
            function h() {
              if (
                arguments.length &&
                "function" == typeof arguments[arguments.length - 1]
              )
                return arguments[arguments.length - 1];
            }
            var f = "local-forage-detect-blob-support",
              p = void 0,
              m = {},
              g = Object.prototype.toString,
              v = "readonly",
              T = "readwrite";
            function b(e) {
              for (
                var t = e.length,
                  r = new ArrayBuffer(t),
                  n = new Uint8Array(r),
                  i = 0;
                i < t;
                i++
              )
                n[i] = e.charCodeAt(i);
              return r;
            }
            function S(e) {
              return new d(function (t) {
                var r = e.transaction(f, T),
                  n = c([""]);
                r.objectStore(f).put(n, "key"),
                  (r.onabort = function (e) {
                    e.preventDefault(), e.stopPropagation(), t(!1);
                  }),
                  (r.oncomplete = function () {
                    var e = navigator.userAgent.match(/Chrome\/(\d+)/),
                      r = navigator.userAgent.match(/Edge\//);
                    t(r || !e || parseInt(e[1], 10) >= 43);
                  });
              }).catch(function () {
                return !1;
              });
            }
            function y(e) {
              return "boolean" == typeof p
                ? d.resolve(p)
                : S(e).then(function (e) {
                    return (p = e);
                  });
            }
            function k(e) {
              var t = m[e.name],
                r = {};
              (r.promise = new d(function (e, t) {
                (r.resolve = e), (r.reject = t);
              })),
                t.deferredOperations.push(r),
                t.dbReady
                  ? (t.dbReady = t.dbReady.then(function () {
                      return r.promise;
                    }))
                  : (t.dbReady = r.promise);
            }
            function _(e) {
              var t = m[e.name].deferredOperations.pop();
              if (t) return t.resolve(), t.promise;
            }
            function w(e, t) {
              var r = m[e.name].deferredOperations.pop();
              if (r) return r.reject(t), r.promise;
            }
            function E(e, t) {
              return new d(function (r, n) {
                if (((m[e.name] = m[e.name] || L()), e.db)) {
                  if (!t) return r(e.db);
                  k(e), e.db.close();
                }
                var i = [e.name];
                t && i.push(e.version);
                var o = a.open.apply(a, i);
                t &&
                  (o.onupgradeneeded = function (t) {
                    var r = o.result;
                    try {
                      r.createObjectStore(e.storeName),
                        t.oldVersion <= 1 && r.createObjectStore(f);
                    } catch (r) {
                      if ("ConstraintError" !== r.name) throw r;
                      console.warn(
                        'The database "' +
                          e.name +
                          '" has been upgraded from version ' +
                          t.oldVersion +
                          " to version " +
                          t.newVersion +
                          ', but the storage "' +
                          e.storeName +
                          '" already exists.'
                      );
                    }
                  }),
                  (o.onerror = function (e) {
                    e.preventDefault(), n(o.error);
                  }),
                  (o.onsuccess = function () {
                    var t = o.result;
                    (t.onversionchange = function (e) {
                      e.target.close();
                    }),
                      r(t),
                      _(e);
                  });
              });
            }
            function C(e) {
              return E(e, !1);
            }
            function I(e) {
              return E(e, !0);
            }
            function P(e, t) {
              if (!e.db) return !0;
              var r = !e.db.objectStoreNames.contains(e.storeName),
                n = e.version < e.db.version,
                i = e.version > e.db.version;
              if (
                (n &&
                  (e.version !== t &&
                    console.warn(
                      'The database "' +
                        e.name +
                        "\" can't be downgraded from version " +
                        e.db.version +
                        " to version " +
                        e.version +
                        "."
                    ),
                  (e.version = e.db.version)),
                i || r)
              ) {
                if (r) {
                  var o = e.db.version + 1;
                  o > e.version && (e.version = o);
                }
                return !0;
              }
              return !1;
            }
            function R(e) {
              return new d(function (t, r) {
                var n = new FileReader();
                (n.onerror = r),
                  (n.onloadend = function (r) {
                    var n = btoa(r.target.result || "");
                    t({
                      __local_forage_encoded_blob: !0,
                      data: n,
                      type: e.type,
                    });
                  }),
                  n.readAsBinaryString(e);
              });
            }
            function M(e) {
              return c([b(atob(e.data))], { type: e.type });
            }
            function D(e) {
              return e && e.__local_forage_encoded_blob;
            }
            function O(e) {
              var t = this,
                r = t._initReady().then(function () {
                  var e = m[t._dbInfo.name];
                  if (e && e.dbReady) return e.dbReady;
                });
              return l(r, e, e), r;
            }
            function N(e) {
              k(e);
              for (var t = m[e.name], r = t.forages, n = 0; n < r.length; n++) {
                var i = r[n];
                i._dbInfo.db && (i._dbInfo.db.close(), (i._dbInfo.db = null));
              }
              return (
                (e.db = null),
                C(e)
                  .then(function (t) {
                    return (e.db = t), P(e) ? I(e) : t;
                  })
                  .then(function (n) {
                    e.db = t.db = n;
                    for (var i = 0; i < r.length; i++) r[i]._dbInfo.db = n;
                  })
                  .catch(function (t) {
                    throw (w(e, t), t);
                  })
              );
            }
            function x(e, t, r, n) {
              void 0 === n && (n = 1);
              try {
                var i = e.db.transaction(e.storeName, t);
                r(null, i);
              } catch (i) {
                if (
                  n > 0 &&
                  (!e.db ||
                    "InvalidStateError" === i.name ||
                    "NotFoundError" === i.name)
                )
                  return d
                    .resolve()
                    .then(function () {
                      if (
                        !e.db ||
                        ("NotFoundError" === i.name &&
                          !e.db.objectStoreNames.contains(e.storeName) &&
                          e.version <= e.db.version)
                      )
                        return e.db && (e.version = e.db.version + 1), I(e);
                    })
                    .then(function () {
                      return N(e).then(function () {
                        x(e, t, r, n - 1);
                      });
                    })
                    .catch(r);
                r(i);
              }
            }
            function L() {
              return {
                forages: [],
                db: null,
                dbReady: null,
                deferredOperations: [],
              };
            }
            function B(e) {
              var t = this,
                r = { db: null };
              if (e) for (var n in e) r[n] = e[n];
              var i = m[r.name];
              i || ((i = L()), (m[r.name] = i)),
                i.forages.push(t),
                t._initReady || ((t._initReady = t.ready), (t.ready = O));
              var o = [];
              function a() {
                return d.resolve();
              }
              for (var s = 0; s < i.forages.length; s++) {
                var c = i.forages[s];
                c !== t && o.push(c._initReady().catch(a));
              }
              var u = i.forages.slice(0);
              return d
                .all(o)
                .then(function () {
                  return (r.db = i.db), C(r);
                })
                .then(function (e) {
                  return (r.db = e), P(r, t._defaultConfig.version) ? I(r) : e;
                })
                .then(function (e) {
                  (r.db = i.db = e), (t._dbInfo = r);
                  for (var n = 0; n < u.length; n++) {
                    var o = u[n];
                    o !== t &&
                      ((o._dbInfo.db = r.db), (o._dbInfo.version = r.version));
                  }
                });
            }
            function G(e, t) {
              var r = this;
              e = A(e);
              var n = new d(function (t, n) {
                r.ready()
                  .then(function () {
                    x(r._dbInfo, v, function (i, o) {
                      if (i) return n(i);
                      try {
                        var a = o.objectStore(r._dbInfo.storeName).get(e);
                        (a.onsuccess = function () {
                          var e = a.result;
                          void 0 === e && (e = null), D(e) && (e = M(e)), t(e);
                        }),
                          (a.onerror = function () {
                            n(a.error);
                          });
                      } catch (e) {
                        n(e);
                      }
                    });
                  })
                  .catch(n);
              });
              return u(n, t), n;
            }
            function H(e, t) {
              var r = this,
                n = new d(function (t, n) {
                  r.ready()
                    .then(function () {
                      x(r._dbInfo, v, function (i, o) {
                        if (i) return n(i);
                        try {
                          var a = o
                              .objectStore(r._dbInfo.storeName)
                              .openCursor(),
                            s = 1;
                          (a.onsuccess = function () {
                            var r = a.result;
                            if (r) {
                              var n = r.value;
                              D(n) && (n = M(n));
                              var i = e(n, r.key, s++);
                              void 0 !== i ? t(i) : r.continue();
                            } else t();
                          }),
                            (a.onerror = function () {
                              n(a.error);
                            });
                        } catch (e) {
                          n(e);
                        }
                      });
                    })
                    .catch(n);
                });
              return u(n, t), n;
            }
            function j(e, t, r) {
              var n = this;
              e = A(e);
              var i = new d(function (r, i) {
                var o;
                n.ready()
                  .then(function () {
                    return (
                      (o = n._dbInfo),
                      "[object Blob]" === g.call(t)
                        ? y(o.db).then(function (e) {
                            return e ? t : R(t);
                          })
                        : t
                    );
                  })
                  .then(function (t) {
                    x(n._dbInfo, T, function (o, a) {
                      if (o) return i(o);
                      try {
                        var s = a.objectStore(n._dbInfo.storeName);
                        null === t && (t = void 0);
                        var c = s.put(t, e);
                        (a.oncomplete = function () {
                          void 0 === t && (t = null), r(t);
                        }),
                          (a.onabort = a.onerror =
                            function () {
                              var e = c.error ? c.error : c.transaction.error;
                              i(e);
                            });
                      } catch (e) {
                        i(e);
                      }
                    });
                  })
                  .catch(i);
              });
              return u(i, r), i;
            }
            function F(e, t) {
              var r = this;
              e = A(e);
              var n = new d(function (t, n) {
                r.ready()
                  .then(function () {
                    x(r._dbInfo, T, function (i, o) {
                      if (i) return n(i);
                      try {
                        var a = o.objectStore(r._dbInfo.storeName).delete(e);
                        (o.oncomplete = function () {
                          t();
                        }),
                          (o.onerror = function () {
                            n(a.error);
                          }),
                          (o.onabort = function () {
                            var e = a.error ? a.error : a.transaction.error;
                            n(e);
                          });
                      } catch (e) {
                        n(e);
                      }
                    });
                  })
                  .catch(n);
              });
              return u(n, t), n;
            }
            function V(e) {
              var t = this,
                r = new d(function (e, r) {
                  t.ready()
                    .then(function () {
                      x(t._dbInfo, T, function (n, i) {
                        if (n) return r(n);
                        try {
                          var o = i.objectStore(t._dbInfo.storeName).clear();
                          (i.oncomplete = function () {
                            e();
                          }),
                            (i.onabort = i.onerror =
                              function () {
                                var e = o.error ? o.error : o.transaction.error;
                                r(e);
                              });
                        } catch (e) {
                          r(e);
                        }
                      });
                    })
                    .catch(r);
                });
              return u(r, e), r;
            }
            function U(e) {
              var t = this,
                r = new d(function (e, r) {
                  t.ready()
                    .then(function () {
                      x(t._dbInfo, v, function (n, i) {
                        if (n) return r(n);
                        try {
                          var o = i.objectStore(t._dbInfo.storeName).count();
                          (o.onsuccess = function () {
                            e(o.result);
                          }),
                            (o.onerror = function () {
                              r(o.error);
                            });
                        } catch (e) {
                          r(e);
                        }
                      });
                    })
                    .catch(r);
                });
              return u(r, e), r;
            }
            function q(e, t) {
              var r = this,
                n = new d(function (t, n) {
                  e < 0
                    ? t(null)
                    : r
                        .ready()
                        .then(function () {
                          x(r._dbInfo, v, function (i, o) {
                            if (i) return n(i);
                            try {
                              var a = o.objectStore(r._dbInfo.storeName),
                                s = !1,
                                c = a.openKeyCursor();
                              (c.onsuccess = function () {
                                var r = c.result;
                                r
                                  ? 0 === e || s
                                    ? t(r.key)
                                    : ((s = !0), r.advance(e))
                                  : t(null);
                              }),
                                (c.onerror = function () {
                                  n(c.error);
                                });
                            } catch (e) {
                              n(e);
                            }
                          });
                        })
                        .catch(n);
                });
              return u(n, t), n;
            }
            function Q(e) {
              var t = this,
                r = new d(function (e, r) {
                  t.ready()
                    .then(function () {
                      x(t._dbInfo, v, function (n, i) {
                        if (n) return r(n);
                        try {
                          var o = i
                              .objectStore(t._dbInfo.storeName)
                              .openKeyCursor(),
                            a = [];
                          (o.onsuccess = function () {
                            var t = o.result;
                            t ? (a.push(t.key), t.continue()) : e(a);
                          }),
                            (o.onerror = function () {
                              r(o.error);
                            });
                        } catch (e) {
                          r(e);
                        }
                      });
                    })
                    .catch(r);
                });
              return u(r, e), r;
            }
            function W(e, t) {
              t = h.apply(this, arguments);
              var r = this.config();
              (e = ("function" != typeof e && e) || {}).name ||
                ((e.name = e.name || r.name),
                (e.storeName = e.storeName || r.storeName));
              var n,
                i = this;
              if (e.name) {
                var o =
                  e.name === r.name && i._dbInfo.db
                    ? d.resolve(i._dbInfo.db)
                    : C(e).then(function (t) {
                        var r = m[e.name],
                          n = r.forages;
                        r.db = t;
                        for (var i = 0; i < n.length; i++) n[i]._dbInfo.db = t;
                        return t;
                      });
                n = e.storeName
                  ? o.then(function (t) {
                      if (t.objectStoreNames.contains(e.storeName)) {
                        var r = t.version + 1;
                        k(e);
                        var n = m[e.name],
                          i = n.forages;
                        t.close();
                        for (var o = 0; o < i.length; o++) {
                          var s = i[o];
                          (s._dbInfo.db = null), (s._dbInfo.version = r);
                        }
                        var c = new d(function (t, n) {
                          var i = a.open(e.name, r);
                          (i.onerror = function (e) {
                            i.result.close(), n(e);
                          }),
                            (i.onupgradeneeded = function () {
                              i.result.deleteObjectStore(e.storeName);
                            }),
                            (i.onsuccess = function () {
                              var e = i.result;
                              e.close(), t(e);
                            });
                        });
                        return c
                          .then(function (e) {
                            n.db = e;
                            for (var t = 0; t < i.length; t++) {
                              var r = i[t];
                              (r._dbInfo.db = e), _(r._dbInfo);
                            }
                          })
                          .catch(function (t) {
                            throw (
                              ((w(e, t) || d.resolve()).catch(function () {}),
                              t)
                            );
                          });
                      }
                    })
                  : o.then(function (t) {
                      k(e);
                      var r = m[e.name],
                        n = r.forages;
                      t.close();
                      for (var i = 0; i < n.length; i++) n[i]._dbInfo.db = null;
                      var o = new d(function (t, r) {
                        var n = a.deleteDatabase(e.name);
                        (n.onerror = function () {
                          var e = n.result;
                          e && e.close(), r(n.error);
                        }),
                          (n.onblocked = function () {
                            console.warn(
                              'dropInstance blocked for database "' +
                                e.name +
                                '" until all open connections are closed'
                            );
                          }),
                          (n.onsuccess = function () {
                            var e = n.result;
                            e && e.close(), t(e);
                          });
                      });
                      return o
                        .then(function (e) {
                          r.db = e;
                          for (var t = 0; t < n.length; t++) _(n[t]._dbInfo);
                        })
                        .catch(function (t) {
                          throw (
                            ((w(e, t) || d.resolve()).catch(function () {}), t)
                          );
                        });
                    });
              } else n = d.reject("Invalid arguments");
              return u(n, t), n;
            }
            var z = {
              _driver: "asyncStorage",
              _initStorage: B,
              _support: s(),
              iterate: H,
              getItem: G,
              setItem: j,
              removeItem: F,
              clear: V,
              length: U,
              key: q,
              keys: Q,
              dropInstance: W,
            };
            function X() {
              return "function" == typeof openDatabase;
            }
            var K =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
              J = "~~local_forage_type~",
              Z = /^~~local_forage_type~([^~]+)~/,
              Y = "__lfsc__:",
              $ = Y.length,
              ee = "arbf",
              te = "blob",
              re = "si08",
              ne = "ui08",
              ie = "uic8",
              oe = "si16",
              ae = "si32",
              se = "ur16",
              ce = "ui32",
              de = "fl32",
              ue = "fl64",
              le = $ + ee.length,
              Ae = Object.prototype.toString;
            function he(e) {
              var t,
                r,
                n,
                i,
                o,
                a = 0.75 * e.length,
                s = e.length,
                c = 0;
              "=" === e[e.length - 1] && (a--, "=" === e[e.length - 2] && a--);
              var d = new ArrayBuffer(a),
                u = new Uint8Array(d);
              for (t = 0; t < s; t += 4)
                (r = K.indexOf(e[t])),
                  (n = K.indexOf(e[t + 1])),
                  (i = K.indexOf(e[t + 2])),
                  (o = K.indexOf(e[t + 3])),
                  (u[c++] = (r << 2) | (n >> 4)),
                  (u[c++] = ((15 & n) << 4) | (i >> 2)),
                  (u[c++] = ((3 & i) << 6) | (63 & o));
              return d;
            }
            function fe(e) {
              var t,
                r = new Uint8Array(e),
                n = "";
              for (t = 0; t < r.length; t += 3)
                (n += K[r[t] >> 2]),
                  (n += K[((3 & r[t]) << 4) | (r[t + 1] >> 4)]),
                  (n += K[((15 & r[t + 1]) << 2) | (r[t + 2] >> 6)]),
                  (n += K[63 & r[t + 2]]);
              return (
                r.length % 3 == 2
                  ? (n = n.substring(0, n.length - 1) + "=")
                  : r.length % 3 == 1 &&
                    (n = n.substring(0, n.length - 2) + "=="),
                n
              );
            }
            function pe(e, t) {
              var r = "";
              if (
                (e && (r = Ae.call(e)),
                e &&
                  ("[object ArrayBuffer]" === r ||
                    (e.buffer && "[object ArrayBuffer]" === Ae.call(e.buffer))))
              ) {
                var n,
                  i = Y;
                e instanceof ArrayBuffer
                  ? ((n = e), (i += ee))
                  : ((n = e.buffer),
                    "[object Int8Array]" === r
                      ? (i += re)
                      : "[object Uint8Array]" === r
                      ? (i += ne)
                      : "[object Uint8ClampedArray]" === r
                      ? (i += ie)
                      : "[object Int16Array]" === r
                      ? (i += oe)
                      : "[object Uint16Array]" === r
                      ? (i += se)
                      : "[object Int32Array]" === r
                      ? (i += ae)
                      : "[object Uint32Array]" === r
                      ? (i += ce)
                      : "[object Float32Array]" === r
                      ? (i += de)
                      : "[object Float64Array]" === r
                      ? (i += ue)
                      : t(new Error("Failed to get type for BinaryArray"))),
                  t(i + fe(n));
              } else if ("[object Blob]" === r) {
                var o = new FileReader();
                (o.onload = function () {
                  var r = J + e.type + "~" + fe(this.result);
                  t(Y + te + r);
                }),
                  o.readAsArrayBuffer(e);
              } else
                try {
                  t(JSON.stringify(e));
                } catch (r) {
                  console.error(
                    "Couldn't convert value into a JSON string: ",
                    e
                  ),
                    t(null, r);
                }
            }
            function me(e) {
              if (e.substring(0, $) !== Y) return JSON.parse(e);
              var t,
                r = e.substring(le),
                n = e.substring($, le);
              if (n === te && Z.test(r)) {
                var i = r.match(Z);
                (t = i[1]), (r = r.substring(i[0].length));
              }
              var o = he(r);
              switch (n) {
                case ee:
                  return o;
                case te:
                  return c([o], { type: t });
                case re:
                  return new Int8Array(o);
                case ne:
                  return new Uint8Array(o);
                case ie:
                  return new Uint8ClampedArray(o);
                case oe:
                  return new Int16Array(o);
                case se:
                  return new Uint16Array(o);
                case ae:
                  return new Int32Array(o);
                case ce:
                  return new Uint32Array(o);
                case de:
                  return new Float32Array(o);
                case ue:
                  return new Float64Array(o);
                default:
                  throw new Error("Unkown type: " + n);
              }
            }
            var ge = {
              serialize: pe,
              deserialize: me,
              stringToBuffer: he,
              bufferToString: fe,
            };
            function ve(e, t, r, n) {
              e.executeSql(
                "CREATE TABLE IF NOT EXISTS " +
                  t.storeName +
                  " (id INTEGER PRIMARY KEY, key unique, value)",
                [],
                r,
                n
              );
            }
            function Te(e) {
              var t = this,
                r = { db: null };
              if (e)
                for (var n in e)
                  r[n] = "string" != typeof e[n] ? e[n].toString() : e[n];
              var i = new d(function (e, n) {
                try {
                  r.db = openDatabase(
                    r.name,
                    String(r.version),
                    r.description,
                    r.size
                  );
                } catch (e) {
                  return n(e);
                }
                r.db.transaction(function (i) {
                  ve(
                    i,
                    r,
                    function () {
                      (t._dbInfo = r), e();
                    },
                    function (e, t) {
                      n(t);
                    }
                  );
                }, n);
              });
              return (r.serializer = ge), i;
            }
            function be(e, t, r, n, i, o) {
              e.executeSql(
                r,
                n,
                i,
                function (e, a) {
                  a.code === a.SYNTAX_ERR
                    ? e.executeSql(
                        "SELECT name FROM sqlite_master WHERE type='table' AND name = ?",
                        [t.storeName],
                        function (e, s) {
                          s.rows.length
                            ? o(e, a)
                            : ve(
                                e,
                                t,
                                function () {
                                  e.executeSql(r, n, i, o);
                                },
                                o
                              );
                        },
                        o
                      )
                    : o(e, a);
                },
                o
              );
            }
            function Se(e, t) {
              var r = this;
              e = A(e);
              var n = new d(function (t, n) {
                r.ready()
                  .then(function () {
                    var i = r._dbInfo;
                    i.db.transaction(function (r) {
                      be(
                        r,
                        i,
                        "SELECT * FROM " +
                          i.storeName +
                          " WHERE key = ? LIMIT 1",
                        [e],
                        function (e, r) {
                          var n = r.rows.length ? r.rows.item(0).value : null;
                          n && (n = i.serializer.deserialize(n)), t(n);
                        },
                        function (e, t) {
                          n(t);
                        }
                      );
                    });
                  })
                  .catch(n);
              });
              return u(n, t), n;
            }
            function ye(e, t) {
              var r = this,
                n = new d(function (t, n) {
                  r.ready()
                    .then(function () {
                      var i = r._dbInfo;
                      i.db.transaction(function (r) {
                        be(
                          r,
                          i,
                          "SELECT * FROM " + i.storeName,
                          [],
                          function (r, n) {
                            for (
                              var o = n.rows, a = o.length, s = 0;
                              s < a;
                              s++
                            ) {
                              var c = o.item(s),
                                d = c.value;
                              if (
                                (d && (d = i.serializer.deserialize(d)),
                                void 0 !== (d = e(d, c.key, s + 1)))
                              )
                                return void t(d);
                            }
                            t();
                          },
                          function (e, t) {
                            n(t);
                          }
                        );
                      });
                    })
                    .catch(n);
                });
              return u(n, t), n;
            }
            function ke(e, t, r, n) {
              var i = this;
              e = A(e);
              var o = new d(function (o, a) {
                i.ready()
                  .then(function () {
                    void 0 === t && (t = null);
                    var s = t,
                      c = i._dbInfo;
                    c.serializer.serialize(t, function (t, d) {
                      d
                        ? a(d)
                        : c.db.transaction(
                            function (r) {
                              be(
                                r,
                                c,
                                "INSERT OR REPLACE INTO " +
                                  c.storeName +
                                  " (key, value) VALUES (?, ?)",
                                [e, t],
                                function () {
                                  o(s);
                                },
                                function (e, t) {
                                  a(t);
                                }
                              );
                            },
                            function (t) {
                              if (t.code === t.QUOTA_ERR) {
                                if (n > 0)
                                  return void o(ke.apply(i, [e, s, r, n - 1]));
                                a(t);
                              }
                            }
                          );
                    });
                  })
                  .catch(a);
              });
              return u(o, r), o;
            }
            function _e(e, t, r) {
              return ke.apply(this, [e, t, r, 1]);
            }
            function we(e, t) {
              var r = this;
              e = A(e);
              var n = new d(function (t, n) {
                r.ready()
                  .then(function () {
                    var i = r._dbInfo;
                    i.db.transaction(function (r) {
                      be(
                        r,
                        i,
                        "DELETE FROM " + i.storeName + " WHERE key = ?",
                        [e],
                        function () {
                          t();
                        },
                        function (e, t) {
                          n(t);
                        }
                      );
                    });
                  })
                  .catch(n);
              });
              return u(n, t), n;
            }
            function Ee(e) {
              var t = this,
                r = new d(function (e, r) {
                  t.ready()
                    .then(function () {
                      var n = t._dbInfo;
                      n.db.transaction(function (t) {
                        be(
                          t,
                          n,
                          "DELETE FROM " + n.storeName,
                          [],
                          function () {
                            e();
                          },
                          function (e, t) {
                            r(t);
                          }
                        );
                      });
                    })
                    .catch(r);
                });
              return u(r, e), r;
            }
            function Ce(e) {
              var t = this,
                r = new d(function (e, r) {
                  t.ready()
                    .then(function () {
                      var n = t._dbInfo;
                      n.db.transaction(function (t) {
                        be(
                          t,
                          n,
                          "SELECT COUNT(key) as c FROM " + n.storeName,
                          [],
                          function (t, r) {
                            var n = r.rows.item(0).c;
                            e(n);
                          },
                          function (e, t) {
                            r(t);
                          }
                        );
                      });
                    })
                    .catch(r);
                });
              return u(r, e), r;
            }
            function Ie(e, t) {
              var r = this,
                n = new d(function (t, n) {
                  r.ready()
                    .then(function () {
                      var i = r._dbInfo;
                      i.db.transaction(function (r) {
                        be(
                          r,
                          i,
                          "SELECT key FROM " +
                            i.storeName +
                            " WHERE id = ? LIMIT 1",
                          [e + 1],
                          function (e, r) {
                            var n = r.rows.length ? r.rows.item(0).key : null;
                            t(n);
                          },
                          function (e, t) {
                            n(t);
                          }
                        );
                      });
                    })
                    .catch(n);
                });
              return u(n, t), n;
            }
            function Pe(e) {
              var t = this,
                r = new d(function (e, r) {
                  t.ready()
                    .then(function () {
                      var n = t._dbInfo;
                      n.db.transaction(function (t) {
                        be(
                          t,
                          n,
                          "SELECT key FROM " + n.storeName,
                          [],
                          function (t, r) {
                            for (var n = [], i = 0; i < r.rows.length; i++)
                              n.push(r.rows.item(i).key);
                            e(n);
                          },
                          function (e, t) {
                            r(t);
                          }
                        );
                      });
                    })
                    .catch(r);
                });
              return u(r, e), r;
            }
            function Re(e) {
              return new d(function (t, r) {
                e.transaction(
                  function (n) {
                    n.executeSql(
                      "SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'",
                      [],
                      function (r, n) {
                        for (var i = [], o = 0; o < n.rows.length; o++)
                          i.push(n.rows.item(o).name);
                        t({ db: e, storeNames: i });
                      },
                      function (e, t) {
                        r(t);
                      }
                    );
                  },
                  function (e) {
                    r(e);
                  }
                );
              });
            }
            function Me(e, t) {
              t = h.apply(this, arguments);
              var r = this.config();
              (e = ("function" != typeof e && e) || {}).name ||
                ((e.name = e.name || r.name),
                (e.storeName = e.storeName || r.storeName));
              var n,
                i = this;
              return (
                (n = e.name
                  ? new d(function (t) {
                      var n;
                      (n =
                        e.name === r.name
                          ? i._dbInfo.db
                          : openDatabase(e.name, "", "", 0)),
                        e.storeName
                          ? t({ db: n, storeNames: [e.storeName] })
                          : t(Re(n));
                    }).then(function (e) {
                      return new d(function (t, r) {
                        e.db.transaction(
                          function (n) {
                            function i(e) {
                              return new d(function (t, r) {
                                n.executeSql(
                                  "DROP TABLE IF EXISTS " + e,
                                  [],
                                  function () {
                                    t();
                                  },
                                  function (e, t) {
                                    r(t);
                                  }
                                );
                              });
                            }
                            for (
                              var o = [], a = 0, s = e.storeNames.length;
                              a < s;
                              a++
                            )
                              o.push(i(e.storeNames[a]));
                            d.all(o)
                              .then(function () {
                                t();
                              })
                              .catch(function (e) {
                                r(e);
                              });
                          },
                          function (e) {
                            r(e);
                          }
                        );
                      });
                    })
                  : d.reject("Invalid arguments")),
                u(n, t),
                n
              );
            }
            var De = {
              _driver: "webSQLStorage",
              _initStorage: Te,
              _support: X(),
              iterate: ye,
              getItem: Se,
              setItem: _e,
              removeItem: we,
              clear: Ee,
              length: Ce,
              key: Ie,
              keys: Pe,
              dropInstance: Me,
            };
            function Oe() {
              try {
                return (
                  "undefined" != typeof localStorage &&
                  "setItem" in localStorage &&
                  !!localStorage.setItem
                );
              } catch (e) {
                return !1;
              }
            }
            function Ne(e, t) {
              var r = e.name + "/";
              return e.storeName !== t.storeName && (r += e.storeName + "/"), r;
            }
            function xe() {
              var e = "_localforage_support_test";
              try {
                return (
                  localStorage.setItem(e, !0), localStorage.removeItem(e), !1
                );
              } catch (e) {
                return !0;
              }
            }
            function Le() {
              return !xe() || localStorage.length > 0;
            }
            function Be(e) {
              var t = this,
                r = {};
              if (e) for (var n in e) r[n] = e[n];
              return (
                (r.keyPrefix = Ne(e, t._defaultConfig)),
                Le()
                  ? ((t._dbInfo = r), (r.serializer = ge), d.resolve())
                  : d.reject()
              );
            }
            function Ge(e) {
              var t = this,
                r = t.ready().then(function () {
                  for (
                    var e = t._dbInfo.keyPrefix, r = localStorage.length - 1;
                    r >= 0;
                    r--
                  ) {
                    var n = localStorage.key(r);
                    0 === n.indexOf(e) && localStorage.removeItem(n);
                  }
                });
              return u(r, e), r;
            }
            function He(e, t) {
              var r = this;
              e = A(e);
              var n = r.ready().then(function () {
                var t = r._dbInfo,
                  n = localStorage.getItem(t.keyPrefix + e);
                return n && (n = t.serializer.deserialize(n)), n;
              });
              return u(n, t), n;
            }
            function je(e, t) {
              var r = this,
                n = r.ready().then(function () {
                  for (
                    var t = r._dbInfo,
                      n = t.keyPrefix,
                      i = n.length,
                      o = localStorage.length,
                      a = 1,
                      s = 0;
                    s < o;
                    s++
                  ) {
                    var c = localStorage.key(s);
                    if (0 === c.indexOf(n)) {
                      var d = localStorage.getItem(c);
                      if (
                        (d && (d = t.serializer.deserialize(d)),
                        void 0 !== (d = e(d, c.substring(i), a++)))
                      )
                        return d;
                    }
                  }
                });
              return u(n, t), n;
            }
            function Fe(e, t) {
              var r = this,
                n = r.ready().then(function () {
                  var t,
                    n = r._dbInfo;
                  try {
                    t = localStorage.key(e);
                  } catch (e) {
                    t = null;
                  }
                  return t && (t = t.substring(n.keyPrefix.length)), t;
                });
              return u(n, t), n;
            }
            function Ve(e) {
              var t = this,
                r = t.ready().then(function () {
                  for (
                    var e = t._dbInfo, r = localStorage.length, n = [], i = 0;
                    i < r;
                    i++
                  ) {
                    var o = localStorage.key(i);
                    0 === o.indexOf(e.keyPrefix) &&
                      n.push(o.substring(e.keyPrefix.length));
                  }
                  return n;
                });
              return u(r, e), r;
            }
            function Ue(e) {
              var t = this.keys().then(function (e) {
                return e.length;
              });
              return u(t, e), t;
            }
            function qe(e, t) {
              var r = this;
              e = A(e);
              var n = r.ready().then(function () {
                var t = r._dbInfo;
                localStorage.removeItem(t.keyPrefix + e);
              });
              return u(n, t), n;
            }
            function Qe(e, t, r) {
              var n = this;
              e = A(e);
              var i = n.ready().then(function () {
                void 0 === t && (t = null);
                var r = t;
                return new d(function (i, o) {
                  var a = n._dbInfo;
                  a.serializer.serialize(t, function (t, n) {
                    if (n) o(n);
                    else
                      try {
                        localStorage.setItem(a.keyPrefix + e, t), i(r);
                      } catch (e) {
                        ("QuotaExceededError" !== e.name &&
                          "NS_ERROR_DOM_QUOTA_REACHED" !== e.name) ||
                          o(e),
                          o(e);
                      }
                  });
                });
              });
              return u(i, r), i;
            }
            function We(e, t) {
              if (
                ((t = h.apply(this, arguments)),
                !(e = ("function" != typeof e && e) || {}).name)
              ) {
                var r = this.config();
                (e.name = e.name || r.name),
                  (e.storeName = e.storeName || r.storeName);
              }
              var n,
                i = this;
              return (
                (n = e.name
                  ? new d(function (t) {
                      e.storeName
                        ? t(Ne(e, i._defaultConfig))
                        : t(e.name + "/");
                    }).then(function (e) {
                      for (var t = localStorage.length - 1; t >= 0; t--) {
                        var r = localStorage.key(t);
                        0 === r.indexOf(e) && localStorage.removeItem(r);
                      }
                    })
                  : d.reject("Invalid arguments")),
                u(n, t),
                n
              );
            }
            var ze = {
                _driver: "localStorageWrapper",
                _initStorage: Be,
                _support: Oe(),
                iterate: je,
                getItem: He,
                setItem: Qe,
                removeItem: qe,
                clear: Ge,
                length: Ue,
                key: Fe,
                keys: Ve,
                dropInstance: We,
              },
              Xe = function (e, t) {
                return (
                  e === t ||
                  ("number" == typeof e &&
                    "number" == typeof t &&
                    isNaN(e) &&
                    isNaN(t))
                );
              },
              Ke = function (e, t) {
                for (var r = e.length, n = 0; n < r; ) {
                  if (Xe(e[n], t)) return !0;
                  n++;
                }
                return !1;
              },
              Je =
                Array.isArray ||
                function (e) {
                  return "[object Array]" === Object.prototype.toString.call(e);
                },
              Ze = {},
              Ye = {},
              $e = { INDEXEDDB: z, WEBSQL: De, LOCALSTORAGE: ze },
              et = [
                $e.INDEXEDDB._driver,
                $e.WEBSQL._driver,
                $e.LOCALSTORAGE._driver,
              ],
              tt = ["dropInstance"],
              rt = [
                "clear",
                "getItem",
                "iterate",
                "key",
                "keys",
                "length",
                "removeItem",
                "setItem",
              ].concat(tt),
              nt = {
                description: "",
                driver: et.slice(),
                name: "localforage",
                size: 4980736,
                storeName: "keyvaluepairs",
                version: 1,
              };
            function it(e, t) {
              e[t] = function () {
                var r = arguments;
                return e.ready().then(function () {
                  return e[t].apply(e, r);
                });
              };
            }
            function ot() {
              for (var e = 1; e < arguments.length; e++) {
                var t = arguments[e];
                if (t)
                  for (var r in t)
                    t.hasOwnProperty(r) &&
                      (Je(t[r])
                        ? (arguments[0][r] = t[r].slice())
                        : (arguments[0][r] = t[r]));
              }
              return arguments[0];
            }
            var at = (function () {
                function e(t) {
                  for (var r in (i(this, e), $e))
                    if ($e.hasOwnProperty(r)) {
                      var n = $e[r],
                        o = n._driver;
                      (this[r] = o), Ze[o] || this.defineDriver(n);
                    }
                  (this._defaultConfig = ot({}, nt)),
                    (this._config = ot({}, this._defaultConfig, t)),
                    (this._driverSet = null),
                    (this._initDriver = null),
                    (this._ready = !1),
                    (this._dbInfo = null),
                    this._wrapLibraryMethodsWithReady(),
                    this.setDriver(this._config.driver).catch(function () {});
                }
                return (
                  (e.prototype.config = function (e) {
                    if ("object" === (void 0 === e ? "undefined" : n(e))) {
                      if (this._ready)
                        return new Error(
                          "Can't call config() after localforage has been used."
                        );
                      for (var t in e) {
                        if (
                          ("storeName" === t &&
                            (e[t] = e[t].replace(/\W/g, "_")),
                          "version" === t && "number" != typeof e[t])
                        )
                          return new Error(
                            "Database version must be a number."
                          );
                        this._config[t] = e[t];
                      }
                      return (
                        !("driver" in e) ||
                        !e.driver ||
                        this.setDriver(this._config.driver)
                      );
                    }
                    return "string" == typeof e
                      ? this._config[e]
                      : this._config;
                  }),
                  (e.prototype.defineDriver = function (e, t, r) {
                    var n = new d(function (t, r) {
                      try {
                        var n = e._driver,
                          i = new Error(
                            "Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver"
                          );
                        if (!e._driver) return void r(i);
                        for (
                          var o = rt.concat("_initStorage"),
                            a = 0,
                            s = o.length;
                          a < s;
                          a++
                        ) {
                          var c = o[a];
                          if ((!Ke(tt, c) || e[c]) && "function" != typeof e[c])
                            return void r(i);
                        }
                        var l = function () {
                          for (
                            var t = function (e) {
                                return function () {
                                  var t = new Error(
                                      "Method " +
                                        e +
                                        " is not implemented by the current driver"
                                    ),
                                    r = d.reject(t);
                                  return (
                                    u(r, arguments[arguments.length - 1]), r
                                  );
                                };
                              },
                              r = 0,
                              n = tt.length;
                            r < n;
                            r++
                          ) {
                            var i = tt[r];
                            e[i] || (e[i] = t(i));
                          }
                        };
                        l();
                        var A = function (r) {
                          Ze[n] &&
                            console.info("Redefining LocalForage driver: " + n),
                            (Ze[n] = e),
                            (Ye[n] = r),
                            t();
                        };
                        "_support" in e
                          ? e._support && "function" == typeof e._support
                            ? e._support().then(A, r)
                            : A(!!e._support)
                          : A(!0);
                      } catch (e) {
                        r(e);
                      }
                    });
                    return l(n, t, r), n;
                  }),
                  (e.prototype.driver = function () {
                    return this._driver || null;
                  }),
                  (e.prototype.getDriver = function (e, t, r) {
                    var n = Ze[e]
                      ? d.resolve(Ze[e])
                      : d.reject(new Error("Driver not found."));
                    return l(n, t, r), n;
                  }),
                  (e.prototype.getSerializer = function (e) {
                    var t = d.resolve(ge);
                    return l(t, e), t;
                  }),
                  (e.prototype.ready = function (e) {
                    var t = this,
                      r = t._driverSet.then(function () {
                        return (
                          null === t._ready && (t._ready = t._initDriver()),
                          t._ready
                        );
                      });
                    return l(r, e, e), r;
                  }),
                  (e.prototype.setDriver = function (e, t, r) {
                    var n = this;
                    Je(e) || (e = [e]);
                    var i = this._getSupportedDrivers(e);
                    function o() {
                      n._config.driver = n.driver();
                    }
                    function a(e) {
                      return (
                        n._extend(e),
                        o(),
                        (n._ready = n._initStorage(n._config)),
                        n._ready
                      );
                    }
                    function s(e) {
                      return function () {
                        var t = 0;
                        function r() {
                          for (; t < e.length; ) {
                            var i = e[t];
                            return (
                              t++,
                              (n._dbInfo = null),
                              (n._ready = null),
                              n.getDriver(i).then(a).catch(r)
                            );
                          }
                          o();
                          var s = new Error(
                            "No available storage method found."
                          );
                          return (n._driverSet = d.reject(s)), n._driverSet;
                        }
                        return r();
                      };
                    }
                    var c =
                      null !== this._driverSet
                        ? this._driverSet.catch(function () {
                            return d.resolve();
                          })
                        : d.resolve();
                    return (
                      (this._driverSet = c
                        .then(function () {
                          var e = i[0];
                          return (
                            (n._dbInfo = null),
                            (n._ready = null),
                            n.getDriver(e).then(function (e) {
                              (n._driver = e._driver),
                                o(),
                                n._wrapLibraryMethodsWithReady(),
                                (n._initDriver = s(i));
                            })
                          );
                        })
                        .catch(function () {
                          o();
                          var e = new Error(
                            "No available storage method found."
                          );
                          return (n._driverSet = d.reject(e)), n._driverSet;
                        })),
                      l(this._driverSet, t, r),
                      this._driverSet
                    );
                  }),
                  (e.prototype.supports = function (e) {
                    return !!Ye[e];
                  }),
                  (e.prototype._extend = function (e) {
                    ot(this, e);
                  }),
                  (e.prototype._getSupportedDrivers = function (e) {
                    for (var t = [], r = 0, n = e.length; r < n; r++) {
                      var i = e[r];
                      this.supports(i) && t.push(i);
                    }
                    return t;
                  }),
                  (e.prototype._wrapLibraryMethodsWithReady = function () {
                    for (var e = 0, t = rt.length; e < t; e++) it(this, rt[e]);
                  }),
                  (e.prototype.createInstance = function (t) {
                    return new e(t);
                  }),
                  e
                );
              })(),
              st = new at();
            t.exports = st;
          },
          { 3: 3 },
        ],
      },
      {},
      [4]
    )(4);
  })(Oe);
  var Ne = K(Oe.exports);
  function xe(e) {
    let t = e.length;
    for (; --t >= 0; ) e[t] = 0;
  }
  const Le = 256,
    Be = 286,
    Ge = 30,
    He = 15,
    je = new Uint8Array([
      0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5,
      5, 5, 5, 0,
    ]),
    Fe = new Uint8Array([
      0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10,
      11, 11, 12, 12, 13, 13,
    ]),
    Ve = new Uint8Array([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7,
    ]),
    Ue = new Uint8Array([
      16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
    ]),
    qe = new Array(576);
  xe(qe);
  const Qe = new Array(60);
  xe(Qe);
  const We = new Array(512);
  xe(We);
  const ze = new Array(256);
  xe(ze);
  const Xe = new Array(29);
  xe(Xe);
  const Ke = new Array(Ge);
  function Je(e, t, r, n, i) {
    (this.static_tree = e),
      (this.extra_bits = t),
      (this.extra_base = r),
      (this.elems = n),
      (this.max_length = i),
      (this.has_stree = e && e.length);
  }
  let Ze, Ye, $e;
  function et(e, t) {
    (this.dyn_tree = e), (this.max_code = 0), (this.stat_desc = t);
  }
  xe(Ke);
  const tt = (e) => (e < 256 ? We[e] : We[256 + (e >>> 7)]),
    rt = (e, t) => {
      (e.pending_buf[e.pending++] = 255 & t),
        (e.pending_buf[e.pending++] = (t >>> 8) & 255);
    },
    nt = (e, t, r) => {
      e.bi_valid > 16 - r
        ? ((e.bi_buf |= (t << e.bi_valid) & 65535),
          rt(e, e.bi_buf),
          (e.bi_buf = t >> (16 - e.bi_valid)),
          (e.bi_valid += r - 16))
        : ((e.bi_buf |= (t << e.bi_valid) & 65535), (e.bi_valid += r));
    },
    it = (e, t, r) => {
      nt(e, r[2 * t], r[2 * t + 1]);
    },
    ot = (e, t) => {
      let r = 0;
      do {
        (r |= 1 & e), (e >>>= 1), (r <<= 1);
      } while (--t > 0);
      return r >>> 1;
    },
    at = (e, t, r) => {
      const n = new Array(16);
      let i,
        o,
        a = 0;
      for (i = 1; i <= He; i++) (a = (a + r[i - 1]) << 1), (n[i] = a);
      for (o = 0; o <= t; o++) {
        let t = e[2 * o + 1];
        0 !== t && (e[2 * o] = ot(n[t]++, t));
      }
    },
    st = (e) => {
      let t;
      for (t = 0; t < Be; t++) e.dyn_ltree[2 * t] = 0;
      for (t = 0; t < Ge; t++) e.dyn_dtree[2 * t] = 0;
      for (t = 0; t < 19; t++) e.bl_tree[2 * t] = 0;
      (e.dyn_ltree[512] = 1),
        (e.opt_len = e.static_len = 0),
        (e.sym_next = e.matches = 0);
    },
    ct = (e) => {
      e.bi_valid > 8
        ? rt(e, e.bi_buf)
        : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf),
        (e.bi_buf = 0),
        (e.bi_valid = 0);
    },
    dt = (e, t, r, n) => {
      const i = 2 * t,
        o = 2 * r;
      return e[i] < e[o] || (e[i] === e[o] && n[t] <= n[r]);
    },
    ut = (e, t, r) => {
      const n = e.heap[r];
      let i = r << 1;
      for (
        ;
        i <= e.heap_len &&
        (i < e.heap_len && dt(t, e.heap[i + 1], e.heap[i], e.depth) && i++,
        !dt(t, n, e.heap[i], e.depth));

      )
        (e.heap[r] = e.heap[i]), (r = i), (i <<= 1);
      e.heap[r] = n;
    },
    lt = (e, t, r) => {
      let n,
        i,
        o,
        a,
        s = 0;
      if (0 !== e.sym_next)
        do {
          (n = 255 & e.pending_buf[e.sym_buf + s++]),
            (n += (255 & e.pending_buf[e.sym_buf + s++]) << 8),
            (i = e.pending_buf[e.sym_buf + s++]),
            0 === n
              ? it(e, i, t)
              : ((o = ze[i]),
                it(e, o + Le + 1, t),
                (a = je[o]),
                0 !== a && ((i -= Xe[o]), nt(e, i, a)),
                n--,
                (o = tt(n)),
                it(e, o, r),
                (a = Fe[o]),
                0 !== a && ((n -= Ke[o]), nt(e, n, a)));
        } while (s < e.sym_next);
      it(e, 256, t);
    },
    At = (e, t) => {
      const r = t.dyn_tree,
        n = t.stat_desc.static_tree,
        i = t.stat_desc.has_stree,
        o = t.stat_desc.elems;
      let a,
        s,
        c,
        d = -1;
      for (e.heap_len = 0, e.heap_max = 573, a = 0; a < o; a++)
        0 !== r[2 * a]
          ? ((e.heap[++e.heap_len] = d = a), (e.depth[a] = 0))
          : (r[2 * a + 1] = 0);
      for (; e.heap_len < 2; )
        (c = e.heap[++e.heap_len] = d < 2 ? ++d : 0),
          (r[2 * c] = 1),
          (e.depth[c] = 0),
          e.opt_len--,
          i && (e.static_len -= n[2 * c + 1]);
      for (t.max_code = d, a = e.heap_len >> 1; a >= 1; a--) ut(e, r, a);
      c = o;
      do {
        (a = e.heap[1]),
          (e.heap[1] = e.heap[e.heap_len--]),
          ut(e, r, 1),
          (s = e.heap[1]),
          (e.heap[--e.heap_max] = a),
          (e.heap[--e.heap_max] = s),
          (r[2 * c] = r[2 * a] + r[2 * s]),
          (e.depth[c] =
            (e.depth[a] >= e.depth[s] ? e.depth[a] : e.depth[s]) + 1),
          (r[2 * a + 1] = r[2 * s + 1] = c),
          (e.heap[1] = c++),
          ut(e, r, 1);
      } while (e.heap_len >= 2);
      (e.heap[--e.heap_max] = e.heap[1]),
        ((e, t) => {
          const r = t.dyn_tree,
            n = t.max_code,
            i = t.stat_desc.static_tree,
            o = t.stat_desc.has_stree,
            a = t.stat_desc.extra_bits,
            s = t.stat_desc.extra_base,
            c = t.stat_desc.max_length;
          let d,
            u,
            l,
            A,
            h,
            f,
            p = 0;
          for (A = 0; A <= He; A++) e.bl_count[A] = 0;
          for (
            r[2 * e.heap[e.heap_max] + 1] = 0, d = e.heap_max + 1;
            d < 573;
            d++
          )
            (u = e.heap[d]),
              (A = r[2 * r[2 * u + 1] + 1] + 1),
              A > c && ((A = c), p++),
              (r[2 * u + 1] = A),
              u > n ||
                (e.bl_count[A]++,
                (h = 0),
                u >= s && (h = a[u - s]),
                (f = r[2 * u]),
                (e.opt_len += f * (A + h)),
                o && (e.static_len += f * (i[2 * u + 1] + h)));
          if (0 !== p) {
            do {
              for (A = c - 1; 0 === e.bl_count[A]; ) A--;
              e.bl_count[A]--,
                (e.bl_count[A + 1] += 2),
                e.bl_count[c]--,
                (p -= 2);
            } while (p > 0);
            for (A = c; 0 !== A; A--)
              for (u = e.bl_count[A]; 0 !== u; )
                (l = e.heap[--d]),
                  l > n ||
                    (r[2 * l + 1] !== A &&
                      ((e.opt_len += (A - r[2 * l + 1]) * r[2 * l]),
                      (r[2 * l + 1] = A)),
                    u--);
          }
        })(e, t),
        at(r, d, e.bl_count);
    },
    ht = (e, t, r) => {
      let n,
        i,
        o = -1,
        a = t[1],
        s = 0,
        c = 7,
        d = 4;
      for (
        0 === a && ((c = 138), (d = 3)), t[2 * (r + 1) + 1] = 65535, n = 0;
        n <= r;
        n++
      )
        (i = a),
          (a = t[2 * (n + 1) + 1]),
          (++s < c && i === a) ||
            (s < d
              ? (e.bl_tree[2 * i] += s)
              : 0 !== i
              ? (i !== o && e.bl_tree[2 * i]++, e.bl_tree[32]++)
              : s <= 10
              ? e.bl_tree[34]++
              : e.bl_tree[36]++,
            (s = 0),
            (o = i),
            0 === a
              ? ((c = 138), (d = 3))
              : i === a
              ? ((c = 6), (d = 3))
              : ((c = 7), (d = 4)));
    },
    ft = (e, t, r) => {
      let n,
        i,
        o = -1,
        a = t[1],
        s = 0,
        c = 7,
        d = 4;
      for (0 === a && ((c = 138), (d = 3)), n = 0; n <= r; n++)
        if (((i = a), (a = t[2 * (n + 1) + 1]), !(++s < c && i === a))) {
          if (s < d)
            do {
              it(e, i, e.bl_tree);
            } while (0 != --s);
          else
            0 !== i
              ? (i !== o && (it(e, i, e.bl_tree), s--),
                it(e, 16, e.bl_tree),
                nt(e, s - 3, 2))
              : s <= 10
              ? (it(e, 17, e.bl_tree), nt(e, s - 3, 3))
              : (it(e, 18, e.bl_tree), nt(e, s - 11, 7));
          (s = 0),
            (o = i),
            0 === a
              ? ((c = 138), (d = 3))
              : i === a
              ? ((c = 6), (d = 3))
              : ((c = 7), (d = 4));
        }
    };
  let pt = !1;
  const mt = (e, t, r, n) => {
    nt(e, 0 + (n ? 1 : 0), 3),
      ct(e),
      rt(e, r),
      rt(e, ~r),
      r && e.pending_buf.set(e.window.subarray(t, t + r), e.pending),
      (e.pending += r);
  };
  var gt = (e, t, r, n) => {
      let i,
        o,
        a = 0;
      e.level > 0
        ? (2 === e.strm.data_type &&
            (e.strm.data_type = ((e) => {
              let t,
                r = 4093624447;
              for (t = 0; t <= 31; t++, r >>>= 1)
                if (1 & r && 0 !== e.dyn_ltree[2 * t]) return 0;
              if (
                0 !== e.dyn_ltree[18] ||
                0 !== e.dyn_ltree[20] ||
                0 !== e.dyn_ltree[26]
              )
                return 1;
              for (t = 32; t < Le; t++) if (0 !== e.dyn_ltree[2 * t]) return 1;
              return 0;
            })(e)),
          At(e, e.l_desc),
          At(e, e.d_desc),
          (a = ((e) => {
            let t;
            for (
              ht(e, e.dyn_ltree, e.l_desc.max_code),
                ht(e, e.dyn_dtree, e.d_desc.max_code),
                At(e, e.bl_desc),
                t = 18;
              t >= 3 && 0 === e.bl_tree[2 * Ue[t] + 1];
              t--
            );
            return (e.opt_len += 3 * (t + 1) + 5 + 5 + 4), t;
          })(e)),
          (i = (e.opt_len + 3 + 7) >>> 3),
          (o = (e.static_len + 3 + 7) >>> 3),
          o <= i && (i = o))
        : (i = o = r + 5),
        r + 4 <= i && -1 !== t
          ? mt(e, t, r, n)
          : 4 === e.strategy || o === i
          ? (nt(e, 2 + (n ? 1 : 0), 3), lt(e, qe, Qe))
          : (nt(e, 4 + (n ? 1 : 0), 3),
            ((e, t, r, n) => {
              let i;
              for (
                nt(e, t - 257, 5), nt(e, r - 1, 5), nt(e, n - 4, 4), i = 0;
                i < n;
                i++
              )
                nt(e, e.bl_tree[2 * Ue[i] + 1], 3);
              ft(e, e.dyn_ltree, t - 1), ft(e, e.dyn_dtree, r - 1);
            })(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, a + 1),
            lt(e, e.dyn_ltree, e.dyn_dtree)),
        st(e),
        n && ct(e);
    },
    vt = {
      _tr_init: (e) => {
        pt ||
          ((() => {
            let e, t, r, n, i;
            const o = new Array(16);
            for (r = 0, n = 0; n < 28; n++)
              for (Xe[n] = r, e = 0; e < 1 << je[n]; e++) ze[r++] = n;
            for (ze[r - 1] = n, i = 0, n = 0; n < 16; n++)
              for (Ke[n] = i, e = 0; e < 1 << Fe[n]; e++) We[i++] = n;
            for (i >>= 7; n < Ge; n++)
              for (Ke[n] = i << 7, e = 0; e < 1 << (Fe[n] - 7); e++)
                We[256 + i++] = n;
            for (t = 0; t <= He; t++) o[t] = 0;
            for (e = 0; e <= 143; ) (qe[2 * e + 1] = 8), e++, o[8]++;
            for (; e <= 255; ) (qe[2 * e + 1] = 9), e++, o[9]++;
            for (; e <= 279; ) (qe[2 * e + 1] = 7), e++, o[7]++;
            for (; e <= 287; ) (qe[2 * e + 1] = 8), e++, o[8]++;
            for (at(qe, 287, o), e = 0; e < Ge; e++)
              (Qe[2 * e + 1] = 5), (Qe[2 * e] = ot(e, 5));
            (Ze = new Je(qe, je, 257, Be, He)),
              (Ye = new Je(Qe, Fe, 0, Ge, He)),
              ($e = new Je(new Array(0), Ve, 0, 19, 7));
          })(),
          (pt = !0)),
          (e.l_desc = new et(e.dyn_ltree, Ze)),
          (e.d_desc = new et(e.dyn_dtree, Ye)),
          (e.bl_desc = new et(e.bl_tree, $e)),
          (e.bi_buf = 0),
          (e.bi_valid = 0),
          st(e);
      },
      _tr_stored_block: mt,
      _tr_flush_block: gt,
      _tr_tally: (e, t, r) => (
        (e.pending_buf[e.sym_buf + e.sym_next++] = t),
        (e.pending_buf[e.sym_buf + e.sym_next++] = t >> 8),
        (e.pending_buf[e.sym_buf + e.sym_next++] = r),
        0 === t
          ? e.dyn_ltree[2 * r]++
          : (e.matches++,
            t--,
            e.dyn_ltree[2 * (ze[r] + Le + 1)]++,
            e.dyn_dtree[2 * tt(t)]++),
        e.sym_next === e.sym_end
      ),
      _tr_align: (e) => {
        nt(e, 2, 3),
          it(e, 256, qe),
          ((e) => {
            16 === e.bi_valid
              ? (rt(e, e.bi_buf), (e.bi_buf = 0), (e.bi_valid = 0))
              : e.bi_valid >= 8 &&
                ((e.pending_buf[e.pending++] = 255 & e.bi_buf),
                (e.bi_buf >>= 8),
                (e.bi_valid -= 8));
          })(e);
      },
    };
  var Tt = (e, t, r, n) => {
    let i = (65535 & e) | 0,
      o = ((e >>> 16) & 65535) | 0,
      a = 0;
    for (; 0 !== r; ) {
      (a = r > 2e3 ? 2e3 : r), (r -= a);
      do {
        (i = (i + t[n++]) | 0), (o = (o + i) | 0);
      } while (--a);
      (i %= 65521), (o %= 65521);
    }
    return i | (o << 16) | 0;
  };
  const bt = new Uint32Array(
    (() => {
      let e,
        t = [];
      for (var r = 0; r < 256; r++) {
        e = r;
        for (var n = 0; n < 8; n++)
          e = 1 & e ? 3988292384 ^ (e >>> 1) : e >>> 1;
        t[r] = e;
      }
      return t;
    })()
  );
  var St = (e, t, r, n) => {
      const i = bt,
        o = n + r;
      e ^= -1;
      for (let r = n; r < o; r++) e = (e >>> 8) ^ i[255 & (e ^ t[r])];
      return -1 ^ e;
    },
    yt = {
      2: "need dictionary",
      1: "stream end",
      0: "",
      "-1": "file error",
      "-2": "stream error",
      "-3": "data error",
      "-4": "insufficient memory",
      "-5": "buffer error",
      "-6": "incompatible version",
    },
    kt = {
      Z_NO_FLUSH: 0,
      Z_PARTIAL_FLUSH: 1,
      Z_SYNC_FLUSH: 2,
      Z_FULL_FLUSH: 3,
      Z_FINISH: 4,
      Z_BLOCK: 5,
      Z_TREES: 6,
      Z_OK: 0,
      Z_STREAM_END: 1,
      Z_NEED_DICT: 2,
      Z_ERRNO: -1,
      Z_STREAM_ERROR: -2,
      Z_DATA_ERROR: -3,
      Z_MEM_ERROR: -4,
      Z_BUF_ERROR: -5,
      Z_NO_COMPRESSION: 0,
      Z_BEST_SPEED: 1,
      Z_BEST_COMPRESSION: 9,
      Z_DEFAULT_COMPRESSION: -1,
      Z_FILTERED: 1,
      Z_HUFFMAN_ONLY: 2,
      Z_RLE: 3,
      Z_FIXED: 4,
      Z_DEFAULT_STRATEGY: 0,
      Z_BINARY: 0,
      Z_TEXT: 1,
      Z_UNKNOWN: 2,
      Z_DEFLATED: 8,
    };
  const {
      _tr_init: _t,
      _tr_stored_block: wt,
      _tr_flush_block: Et,
      _tr_tally: Ct,
      _tr_align: It,
    } = vt,
    {
      Z_NO_FLUSH: Pt,
      Z_PARTIAL_FLUSH: Rt,
      Z_FULL_FLUSH: Mt,
      Z_FINISH: Dt,
      Z_BLOCK: Ot,
      Z_OK: Nt,
      Z_STREAM_END: xt,
      Z_STREAM_ERROR: Lt,
      Z_DATA_ERROR: Bt,
      Z_BUF_ERROR: Gt,
      Z_DEFAULT_COMPRESSION: Ht,
      Z_FILTERED: jt,
      Z_HUFFMAN_ONLY: Ft,
      Z_RLE: Vt,
      Z_FIXED: Ut,
      Z_DEFAULT_STRATEGY: qt,
      Z_UNKNOWN: Qt,
      Z_DEFLATED: Wt,
    } = kt,
    zt = 258,
    Xt = 262,
    Kt = 42,
    Jt = 113,
    Zt = 666,
    Yt = (e, t) => ((e.msg = yt[t]), t),
    $t = (e) => 2 * e - (e > 4 ? 9 : 0),
    er = (e) => {
      let t = e.length;
      for (; --t >= 0; ) e[t] = 0;
    },
    tr = (e) => {
      let t,
        r,
        n,
        i = e.w_size;
      (t = e.hash_size), (n = t);
      do {
        (r = e.head[--n]), (e.head[n] = r >= i ? r - i : 0);
      } while (--t);
      (t = i), (n = t);
      do {
        (r = e.prev[--n]), (e.prev[n] = r >= i ? r - i : 0);
      } while (--t);
    };
  let rr = (e, t, r) => ((t << e.hash_shift) ^ r) & e.hash_mask;
  const nr = (e) => {
      const t = e.state;
      let r = t.pending;
      r > e.avail_out && (r = e.avail_out),
        0 !== r &&
          (e.output.set(
            t.pending_buf.subarray(t.pending_out, t.pending_out + r),
            e.next_out
          ),
          (e.next_out += r),
          (t.pending_out += r),
          (e.total_out += r),
          (e.avail_out -= r),
          (t.pending -= r),
          0 === t.pending && (t.pending_out = 0));
    },
    ir = (e, t) => {
      Et(
        e,
        e.block_start >= 0 ? e.block_start : -1,
        e.strstart - e.block_start,
        t
      ),
        (e.block_start = e.strstart),
        nr(e.strm);
    },
    or = (e, t) => {
      e.pending_buf[e.pending++] = t;
    },
    ar = (e, t) => {
      (e.pending_buf[e.pending++] = (t >>> 8) & 255),
        (e.pending_buf[e.pending++] = 255 & t);
    },
    sr = (e, t, r, n) => {
      let i = e.avail_in;
      return (
        i > n && (i = n),
        0 === i
          ? 0
          : ((e.avail_in -= i),
            t.set(e.input.subarray(e.next_in, e.next_in + i), r),
            1 === e.state.wrap
              ? (e.adler = Tt(e.adler, t, i, r))
              : 2 === e.state.wrap && (e.adler = St(e.adler, t, i, r)),
            (e.next_in += i),
            (e.total_in += i),
            i)
      );
    },
    cr = (e, t) => {
      let r,
        n,
        i = e.max_chain_length,
        o = e.strstart,
        a = e.prev_length,
        s = e.nice_match;
      const c = e.strstart > e.w_size - Xt ? e.strstart - (e.w_size - Xt) : 0,
        d = e.window,
        u = e.w_mask,
        l = e.prev,
        A = e.strstart + zt;
      let h = d[o + a - 1],
        f = d[o + a];
      e.prev_length >= e.good_match && (i >>= 2),
        s > e.lookahead && (s = e.lookahead);
      do {
        if (
          ((r = t),
          d[r + a] === f &&
            d[r + a - 1] === h &&
            d[r] === d[o] &&
            d[++r] === d[o + 1])
        ) {
          (o += 2), r++;
          do {} while (
            d[++o] === d[++r] &&
            d[++o] === d[++r] &&
            d[++o] === d[++r] &&
            d[++o] === d[++r] &&
            d[++o] === d[++r] &&
            d[++o] === d[++r] &&
            d[++o] === d[++r] &&
            d[++o] === d[++r] &&
            o < A
          );
          if (((n = zt - (A - o)), (o = A - zt), n > a)) {
            if (((e.match_start = t), (a = n), n >= s)) break;
            (h = d[o + a - 1]), (f = d[o + a]);
          }
        }
      } while ((t = l[t & u]) > c && 0 != --i);
      return a <= e.lookahead ? a : e.lookahead;
    },
    dr = (e) => {
      const t = e.w_size;
      let r, n, i;
      do {
        if (
          ((n = e.window_size - e.lookahead - e.strstart),
          e.strstart >= t + (t - Xt) &&
            (e.window.set(e.window.subarray(t, t + t - n), 0),
            (e.match_start -= t),
            (e.strstart -= t),
            (e.block_start -= t),
            e.insert > e.strstart && (e.insert = e.strstart),
            tr(e),
            (n += t)),
          0 === e.strm.avail_in)
        )
          break;
        if (
          ((r = sr(e.strm, e.window, e.strstart + e.lookahead, n)),
          (e.lookahead += r),
          e.lookahead + e.insert >= 3)
        )
          for (
            i = e.strstart - e.insert,
              e.ins_h = e.window[i],
              e.ins_h = rr(e, e.ins_h, e.window[i + 1]);
            e.insert &&
            ((e.ins_h = rr(e, e.ins_h, e.window[i + 3 - 1])),
            (e.prev[i & e.w_mask] = e.head[e.ins_h]),
            (e.head[e.ins_h] = i),
            i++,
            e.insert--,
            !(e.lookahead + e.insert < 3));

          );
      } while (e.lookahead < Xt && 0 !== e.strm.avail_in);
    },
    ur = (e, t) => {
      let r,
        n,
        i,
        o =
          e.pending_buf_size - 5 > e.w_size ? e.w_size : e.pending_buf_size - 5,
        a = 0,
        s = e.strm.avail_in;
      do {
        if (((r = 65535), (i = (e.bi_valid + 42) >> 3), e.strm.avail_out < i))
          break;
        if (
          ((i = e.strm.avail_out - i),
          (n = e.strstart - e.block_start),
          r > n + e.strm.avail_in && (r = n + e.strm.avail_in),
          r > i && (r = i),
          r < o &&
            ((0 === r && t !== Dt) || t === Pt || r !== n + e.strm.avail_in))
        )
          break;
        (a = t === Dt && r === n + e.strm.avail_in ? 1 : 0),
          wt(e, 0, 0, a),
          (e.pending_buf[e.pending - 4] = r),
          (e.pending_buf[e.pending - 3] = r >> 8),
          (e.pending_buf[e.pending - 2] = ~r),
          (e.pending_buf[e.pending - 1] = ~r >> 8),
          nr(e.strm),
          n &&
            (n > r && (n = r),
            e.strm.output.set(
              e.window.subarray(e.block_start, e.block_start + n),
              e.strm.next_out
            ),
            (e.strm.next_out += n),
            (e.strm.avail_out -= n),
            (e.strm.total_out += n),
            (e.block_start += n),
            (r -= n)),
          r &&
            (sr(e.strm, e.strm.output, e.strm.next_out, r),
            (e.strm.next_out += r),
            (e.strm.avail_out -= r),
            (e.strm.total_out += r));
      } while (0 === a);
      return (
        (s -= e.strm.avail_in),
        s &&
          (s >= e.w_size
            ? ((e.matches = 2),
              e.window.set(
                e.strm.input.subarray(
                  e.strm.next_in - e.w_size,
                  e.strm.next_in
                ),
                0
              ),
              (e.strstart = e.w_size),
              (e.insert = e.strstart))
            : (e.window_size - e.strstart <= s &&
                ((e.strstart -= e.w_size),
                e.window.set(
                  e.window.subarray(e.w_size, e.w_size + e.strstart),
                  0
                ),
                e.matches < 2 && e.matches++,
                e.insert > e.strstart && (e.insert = e.strstart)),
              e.window.set(
                e.strm.input.subarray(e.strm.next_in - s, e.strm.next_in),
                e.strstart
              ),
              (e.strstart += s),
              (e.insert += s > e.w_size - e.insert ? e.w_size - e.insert : s)),
          (e.block_start = e.strstart)),
        e.high_water < e.strstart && (e.high_water = e.strstart),
        a
          ? 4
          : t !== Pt &&
            t !== Dt &&
            0 === e.strm.avail_in &&
            e.strstart === e.block_start
          ? 2
          : ((i = e.window_size - e.strstart),
            e.strm.avail_in > i &&
              e.block_start >= e.w_size &&
              ((e.block_start -= e.w_size),
              (e.strstart -= e.w_size),
              e.window.set(
                e.window.subarray(e.w_size, e.w_size + e.strstart),
                0
              ),
              e.matches < 2 && e.matches++,
              (i += e.w_size),
              e.insert > e.strstart && (e.insert = e.strstart)),
            i > e.strm.avail_in && (i = e.strm.avail_in),
            i &&
              (sr(e.strm, e.window, e.strstart, i),
              (e.strstart += i),
              (e.insert += i > e.w_size - e.insert ? e.w_size - e.insert : i)),
            e.high_water < e.strstart && (e.high_water = e.strstart),
            (i = (e.bi_valid + 42) >> 3),
            (i =
              e.pending_buf_size - i > 65535 ? 65535 : e.pending_buf_size - i),
            (o = i > e.w_size ? e.w_size : i),
            (n = e.strstart - e.block_start),
            (n >= o ||
              ((n || t === Dt) &&
                t !== Pt &&
                0 === e.strm.avail_in &&
                n <= i)) &&
              ((r = n > i ? i : n),
              (a = t === Dt && 0 === e.strm.avail_in && r === n ? 1 : 0),
              wt(e, e.block_start, r, a),
              (e.block_start += r),
              nr(e.strm)),
            a ? 3 : 1)
      );
    },
    lr = (e, t) => {
      let r, n;
      for (;;) {
        if (e.lookahead < Xt) {
          if ((dr(e), e.lookahead < Xt && t === Pt)) return 1;
          if (0 === e.lookahead) break;
        }
        if (
          ((r = 0),
          e.lookahead >= 3 &&
            ((e.ins_h = rr(e, e.ins_h, e.window[e.strstart + 3 - 1])),
            (r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h]),
            (e.head[e.ins_h] = e.strstart)),
          0 !== r &&
            e.strstart - r <= e.w_size - Xt &&
            (e.match_length = cr(e, r)),
          e.match_length >= 3)
        )
          if (
            ((n = Ct(e, e.strstart - e.match_start, e.match_length - 3)),
            (e.lookahead -= e.match_length),
            e.match_length <= e.max_lazy_match && e.lookahead >= 3)
          ) {
            e.match_length--;
            do {
              e.strstart++,
                (e.ins_h = rr(e, e.ins_h, e.window[e.strstart + 3 - 1])),
                (r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h]),
                (e.head[e.ins_h] = e.strstart);
            } while (0 != --e.match_length);
            e.strstart++;
          } else
            (e.strstart += e.match_length),
              (e.match_length = 0),
              (e.ins_h = e.window[e.strstart]),
              (e.ins_h = rr(e, e.ins_h, e.window[e.strstart + 1]));
        else (n = Ct(e, 0, e.window[e.strstart])), e.lookahead--, e.strstart++;
        if (n && (ir(e, !1), 0 === e.strm.avail_out)) return 1;
      }
      return (
        (e.insert = e.strstart < 2 ? e.strstart : 2),
        t === Dt
          ? (ir(e, !0), 0 === e.strm.avail_out ? 3 : 4)
          : e.sym_next && (ir(e, !1), 0 === e.strm.avail_out)
          ? 1
          : 2
      );
    },
    Ar = (e, t) => {
      let r, n, i;
      for (;;) {
        if (e.lookahead < Xt) {
          if ((dr(e), e.lookahead < Xt && t === Pt)) return 1;
          if (0 === e.lookahead) break;
        }
        if (
          ((r = 0),
          e.lookahead >= 3 &&
            ((e.ins_h = rr(e, e.ins_h, e.window[e.strstart + 3 - 1])),
            (r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h]),
            (e.head[e.ins_h] = e.strstart)),
          (e.prev_length = e.match_length),
          (e.prev_match = e.match_start),
          (e.match_length = 2),
          0 !== r &&
            e.prev_length < e.max_lazy_match &&
            e.strstart - r <= e.w_size - Xt &&
            ((e.match_length = cr(e, r)),
            e.match_length <= 5 &&
              (e.strategy === jt ||
                (3 === e.match_length && e.strstart - e.match_start > 4096)) &&
              (e.match_length = 2)),
          e.prev_length >= 3 && e.match_length <= e.prev_length)
        ) {
          (i = e.strstart + e.lookahead - 3),
            (n = Ct(e, e.strstart - 1 - e.prev_match, e.prev_length - 3)),
            (e.lookahead -= e.prev_length - 1),
            (e.prev_length -= 2);
          do {
            ++e.strstart <= i &&
              ((e.ins_h = rr(e, e.ins_h, e.window[e.strstart + 3 - 1])),
              (r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h]),
              (e.head[e.ins_h] = e.strstart));
          } while (0 != --e.prev_length);
          if (
            ((e.match_available = 0),
            (e.match_length = 2),
            e.strstart++,
            n && (ir(e, !1), 0 === e.strm.avail_out))
          )
            return 1;
        } else if (e.match_available) {
          if (
            ((n = Ct(e, 0, e.window[e.strstart - 1])),
            n && ir(e, !1),
            e.strstart++,
            e.lookahead--,
            0 === e.strm.avail_out)
          )
            return 1;
        } else (e.match_available = 1), e.strstart++, e.lookahead--;
      }
      return (
        e.match_available &&
          ((n = Ct(e, 0, e.window[e.strstart - 1])), (e.match_available = 0)),
        (e.insert = e.strstart < 2 ? e.strstart : 2),
        t === Dt
          ? (ir(e, !0), 0 === e.strm.avail_out ? 3 : 4)
          : e.sym_next && (ir(e, !1), 0 === e.strm.avail_out)
          ? 1
          : 2
      );
    };
  function hr(e, t, r, n, i) {
    (this.good_length = e),
      (this.max_lazy = t),
      (this.nice_length = r),
      (this.max_chain = n),
      (this.func = i);
  }
  const fr = [
    new hr(0, 0, 0, 0, ur),
    new hr(4, 4, 8, 4, lr),
    new hr(4, 5, 16, 8, lr),
    new hr(4, 6, 32, 32, lr),
    new hr(4, 4, 16, 16, Ar),
    new hr(8, 16, 32, 32, Ar),
    new hr(8, 16, 128, 128, Ar),
    new hr(8, 32, 128, 256, Ar),
    new hr(32, 128, 258, 1024, Ar),
    new hr(32, 258, 258, 4096, Ar),
  ];
  function pr() {
    (this.strm = null),
      (this.status = 0),
      (this.pending_buf = null),
      (this.pending_buf_size = 0),
      (this.pending_out = 0),
      (this.pending = 0),
      (this.wrap = 0),
      (this.gzhead = null),
      (this.gzindex = 0),
      (this.method = Wt),
      (this.last_flush = -1),
      (this.w_size = 0),
      (this.w_bits = 0),
      (this.w_mask = 0),
      (this.window = null),
      (this.window_size = 0),
      (this.prev = null),
      (this.head = null),
      (this.ins_h = 0),
      (this.hash_size = 0),
      (this.hash_bits = 0),
      (this.hash_mask = 0),
      (this.hash_shift = 0),
      (this.block_start = 0),
      (this.match_length = 0),
      (this.prev_match = 0),
      (this.match_available = 0),
      (this.strstart = 0),
      (this.match_start = 0),
      (this.lookahead = 0),
      (this.prev_length = 0),
      (this.max_chain_length = 0),
      (this.max_lazy_match = 0),
      (this.level = 0),
      (this.strategy = 0),
      (this.good_match = 0),
      (this.nice_match = 0),
      (this.dyn_ltree = new Uint16Array(1146)),
      (this.dyn_dtree = new Uint16Array(122)),
      (this.bl_tree = new Uint16Array(78)),
      er(this.dyn_ltree),
      er(this.dyn_dtree),
      er(this.bl_tree),
      (this.l_desc = null),
      (this.d_desc = null),
      (this.bl_desc = null),
      (this.bl_count = new Uint16Array(16)),
      (this.heap = new Uint16Array(573)),
      er(this.heap),
      (this.heap_len = 0),
      (this.heap_max = 0),
      (this.depth = new Uint16Array(573)),
      er(this.depth),
      (this.sym_buf = 0),
      (this.lit_bufsize = 0),
      (this.sym_next = 0),
      (this.sym_end = 0),
      (this.opt_len = 0),
      (this.static_len = 0),
      (this.matches = 0),
      (this.insert = 0),
      (this.bi_buf = 0),
      (this.bi_valid = 0);
  }
  const mr = (e) => {
      if (!e) return 1;
      const t = e.state;
      return !t ||
        t.strm !== e ||
        (t.status !== Kt &&
          57 !== t.status &&
          69 !== t.status &&
          73 !== t.status &&
          91 !== t.status &&
          103 !== t.status &&
          t.status !== Jt &&
          t.status !== Zt)
        ? 1
        : 0;
    },
    gr = (e) => {
      if (mr(e)) return Yt(e, Lt);
      (e.total_in = e.total_out = 0), (e.data_type = Qt);
      const t = e.state;
      return (
        (t.pending = 0),
        (t.pending_out = 0),
        t.wrap < 0 && (t.wrap = -t.wrap),
        (t.status = 2 === t.wrap ? 57 : t.wrap ? Kt : Jt),
        (e.adler = 2 === t.wrap ? 0 : 1),
        (t.last_flush = -2),
        _t(t),
        Nt
      );
    },
    vr = (e) => {
      const t = gr(e);
      var r;
      return (
        t === Nt &&
          (((r = e.state).window_size = 2 * r.w_size),
          er(r.head),
          (r.max_lazy_match = fr[r.level].max_lazy),
          (r.good_match = fr[r.level].good_length),
          (r.nice_match = fr[r.level].nice_length),
          (r.max_chain_length = fr[r.level].max_chain),
          (r.strstart = 0),
          (r.block_start = 0),
          (r.lookahead = 0),
          (r.insert = 0),
          (r.match_length = r.prev_length = 2),
          (r.match_available = 0),
          (r.ins_h = 0)),
        t
      );
    },
    Tr = (e, t, r, n, i, o) => {
      if (!e) return Lt;
      let a = 1;
      if (
        (t === Ht && (t = 6),
        n < 0 ? ((a = 0), (n = -n)) : n > 15 && ((a = 2), (n -= 16)),
        i < 1 ||
          i > 9 ||
          r !== Wt ||
          n < 8 ||
          n > 15 ||
          t < 0 ||
          t > 9 ||
          o < 0 ||
          o > Ut ||
          (8 === n && 1 !== a))
      )
        return Yt(e, Lt);
      8 === n && (n = 9);
      const s = new pr();
      return (
        (e.state = s),
        (s.strm = e),
        (s.status = Kt),
        (s.wrap = a),
        (s.gzhead = null),
        (s.w_bits = n),
        (s.w_size = 1 << s.w_bits),
        (s.w_mask = s.w_size - 1),
        (s.hash_bits = i + 7),
        (s.hash_size = 1 << s.hash_bits),
        (s.hash_mask = s.hash_size - 1),
        (s.hash_shift = ~~((s.hash_bits + 3 - 1) / 3)),
        (s.window = new Uint8Array(2 * s.w_size)),
        (s.head = new Uint16Array(s.hash_size)),
        (s.prev = new Uint16Array(s.w_size)),
        (s.lit_bufsize = 1 << (i + 6)),
        (s.pending_buf_size = 4 * s.lit_bufsize),
        (s.pending_buf = new Uint8Array(s.pending_buf_size)),
        (s.sym_buf = s.lit_bufsize),
        (s.sym_end = 3 * (s.lit_bufsize - 1)),
        (s.level = t),
        (s.strategy = o),
        (s.method = r),
        vr(e)
      );
    };
  var br = {
    deflateInit: (e, t) => Tr(e, t, Wt, 15, 8, qt),
    deflateInit2: Tr,
    deflateReset: vr,
    deflateResetKeep: gr,
    deflateSetHeader: (e, t) =>
      mr(e) || 2 !== e.state.wrap ? Lt : ((e.state.gzhead = t), Nt),
    deflate: (e, t) => {
      if (mr(e) || t > Ot || t < 0) return e ? Yt(e, Lt) : Lt;
      const r = e.state;
      if (
        !e.output ||
        (0 !== e.avail_in && !e.input) ||
        (r.status === Zt && t !== Dt)
      )
        return Yt(e, 0 === e.avail_out ? Gt : Lt);
      const n = r.last_flush;
      if (((r.last_flush = t), 0 !== r.pending)) {
        if ((nr(e), 0 === e.avail_out)) return (r.last_flush = -1), Nt;
      } else if (0 === e.avail_in && $t(t) <= $t(n) && t !== Dt)
        return Yt(e, Gt);
      if (r.status === Zt && 0 !== e.avail_in) return Yt(e, Gt);
      if (
        (r.status === Kt && 0 === r.wrap && (r.status = Jt), r.status === Kt)
      ) {
        let t = (Wt + ((r.w_bits - 8) << 4)) << 8,
          n = -1;
        if (
          ((n =
            r.strategy >= Ft || r.level < 2
              ? 0
              : r.level < 6
              ? 1
              : 6 === r.level
              ? 2
              : 3),
          (t |= n << 6),
          0 !== r.strstart && (t |= 32),
          (t += 31 - (t % 31)),
          ar(r, t),
          0 !== r.strstart && (ar(r, e.adler >>> 16), ar(r, 65535 & e.adler)),
          (e.adler = 1),
          (r.status = Jt),
          nr(e),
          0 !== r.pending)
        )
          return (r.last_flush = -1), Nt;
      }
      if (57 === r.status)
        if (((e.adler = 0), or(r, 31), or(r, 139), or(r, 8), r.gzhead))
          or(
            r,
            (r.gzhead.text ? 1 : 0) +
              (r.gzhead.hcrc ? 2 : 0) +
              (r.gzhead.extra ? 4 : 0) +
              (r.gzhead.name ? 8 : 0) +
              (r.gzhead.comment ? 16 : 0)
          ),
            or(r, 255 & r.gzhead.time),
            or(r, (r.gzhead.time >> 8) & 255),
            or(r, (r.gzhead.time >> 16) & 255),
            or(r, (r.gzhead.time >> 24) & 255),
            or(r, 9 === r.level ? 2 : r.strategy >= Ft || r.level < 2 ? 4 : 0),
            or(r, 255 & r.gzhead.os),
            r.gzhead.extra &&
              r.gzhead.extra.length &&
              (or(r, 255 & r.gzhead.extra.length),
              or(r, (r.gzhead.extra.length >> 8) & 255)),
            r.gzhead.hcrc &&
              (e.adler = St(e.adler, r.pending_buf, r.pending, 0)),
            (r.gzindex = 0),
            (r.status = 69);
        else if (
          (or(r, 0),
          or(r, 0),
          or(r, 0),
          or(r, 0),
          or(r, 0),
          or(r, 9 === r.level ? 2 : r.strategy >= Ft || r.level < 2 ? 4 : 0),
          or(r, 3),
          (r.status = Jt),
          nr(e),
          0 !== r.pending)
        )
          return (r.last_flush = -1), Nt;
      if (69 === r.status) {
        if (r.gzhead.extra) {
          let t = r.pending,
            n = (65535 & r.gzhead.extra.length) - r.gzindex;
          for (; r.pending + n > r.pending_buf_size; ) {
            let i = r.pending_buf_size - r.pending;
            if (
              (r.pending_buf.set(
                r.gzhead.extra.subarray(r.gzindex, r.gzindex + i),
                r.pending
              ),
              (r.pending = r.pending_buf_size),
              r.gzhead.hcrc &&
                r.pending > t &&
                (e.adler = St(e.adler, r.pending_buf, r.pending - t, t)),
              (r.gzindex += i),
              nr(e),
              0 !== r.pending)
            )
              return (r.last_flush = -1), Nt;
            (t = 0), (n -= i);
          }
          let i = new Uint8Array(r.gzhead.extra);
          r.pending_buf.set(i.subarray(r.gzindex, r.gzindex + n), r.pending),
            (r.pending += n),
            r.gzhead.hcrc &&
              r.pending > t &&
              (e.adler = St(e.adler, r.pending_buf, r.pending - t, t)),
            (r.gzindex = 0);
        }
        r.status = 73;
      }
      if (73 === r.status) {
        if (r.gzhead.name) {
          let t,
            n = r.pending;
          do {
            if (r.pending === r.pending_buf_size) {
              if (
                (r.gzhead.hcrc &&
                  r.pending > n &&
                  (e.adler = St(e.adler, r.pending_buf, r.pending - n, n)),
                nr(e),
                0 !== r.pending)
              )
                return (r.last_flush = -1), Nt;
              n = 0;
            }
            (t =
              r.gzindex < r.gzhead.name.length
                ? 255 & r.gzhead.name.charCodeAt(r.gzindex++)
                : 0),
              or(r, t);
          } while (0 !== t);
          r.gzhead.hcrc &&
            r.pending > n &&
            (e.adler = St(e.adler, r.pending_buf, r.pending - n, n)),
            (r.gzindex = 0);
        }
        r.status = 91;
      }
      if (91 === r.status) {
        if (r.gzhead.comment) {
          let t,
            n = r.pending;
          do {
            if (r.pending === r.pending_buf_size) {
              if (
                (r.gzhead.hcrc &&
                  r.pending > n &&
                  (e.adler = St(e.adler, r.pending_buf, r.pending - n, n)),
                nr(e),
                0 !== r.pending)
              )
                return (r.last_flush = -1), Nt;
              n = 0;
            }
            (t =
              r.gzindex < r.gzhead.comment.length
                ? 255 & r.gzhead.comment.charCodeAt(r.gzindex++)
                : 0),
              or(r, t);
          } while (0 !== t);
          r.gzhead.hcrc &&
            r.pending > n &&
            (e.adler = St(e.adler, r.pending_buf, r.pending - n, n));
        }
        r.status = 103;
      }
      if (103 === r.status) {
        if (r.gzhead.hcrc) {
          if (r.pending + 2 > r.pending_buf_size && (nr(e), 0 !== r.pending))
            return (r.last_flush = -1), Nt;
          or(r, 255 & e.adler), or(r, (e.adler >> 8) & 255), (e.adler = 0);
        }
        if (((r.status = Jt), nr(e), 0 !== r.pending))
          return (r.last_flush = -1), Nt;
      }
      if (
        0 !== e.avail_in ||
        0 !== r.lookahead ||
        (t !== Pt && r.status !== Zt)
      ) {
        let n =
          0 === r.level
            ? ur(r, t)
            : r.strategy === Ft
            ? ((e, t) => {
                let r;
                for (;;) {
                  if (0 === e.lookahead && (dr(e), 0 === e.lookahead)) {
                    if (t === Pt) return 1;
                    break;
                  }
                  if (
                    ((e.match_length = 0),
                    (r = Ct(e, 0, e.window[e.strstart])),
                    e.lookahead--,
                    e.strstart++,
                    r && (ir(e, !1), 0 === e.strm.avail_out))
                  )
                    return 1;
                }
                return (
                  (e.insert = 0),
                  t === Dt
                    ? (ir(e, !0), 0 === e.strm.avail_out ? 3 : 4)
                    : e.sym_next && (ir(e, !1), 0 === e.strm.avail_out)
                    ? 1
                    : 2
                );
              })(r, t)
            : r.strategy === Vt
            ? ((e, t) => {
                let r, n, i, o;
                const a = e.window;
                for (;;) {
                  if (e.lookahead <= zt) {
                    if ((dr(e), e.lookahead <= zt && t === Pt)) return 1;
                    if (0 === e.lookahead) break;
                  }
                  if (
                    ((e.match_length = 0),
                    e.lookahead >= 3 &&
                      e.strstart > 0 &&
                      ((i = e.strstart - 1),
                      (n = a[i]),
                      n === a[++i] && n === a[++i] && n === a[++i]))
                  ) {
                    o = e.strstart + zt;
                    do {} while (
                      n === a[++i] &&
                      n === a[++i] &&
                      n === a[++i] &&
                      n === a[++i] &&
                      n === a[++i] &&
                      n === a[++i] &&
                      n === a[++i] &&
                      n === a[++i] &&
                      i < o
                    );
                    (e.match_length = zt - (o - i)),
                      e.match_length > e.lookahead &&
                        (e.match_length = e.lookahead);
                  }
                  if (
                    (e.match_length >= 3
                      ? ((r = Ct(e, 1, e.match_length - 3)),
                        (e.lookahead -= e.match_length),
                        (e.strstart += e.match_length),
                        (e.match_length = 0))
                      : ((r = Ct(e, 0, e.window[e.strstart])),
                        e.lookahead--,
                        e.strstart++),
                    r && (ir(e, !1), 0 === e.strm.avail_out))
                  )
                    return 1;
                }
                return (
                  (e.insert = 0),
                  t === Dt
                    ? (ir(e, !0), 0 === e.strm.avail_out ? 3 : 4)
                    : e.sym_next && (ir(e, !1), 0 === e.strm.avail_out)
                    ? 1
                    : 2
                );
              })(r, t)
            : fr[r.level].func(r, t);
        if (((3 !== n && 4 !== n) || (r.status = Zt), 1 === n || 3 === n))
          return 0 === e.avail_out && (r.last_flush = -1), Nt;
        if (
          2 === n &&
          (t === Rt
            ? It(r)
            : t !== Ot &&
              (wt(r, 0, 0, !1),
              t === Mt &&
                (er(r.head),
                0 === r.lookahead &&
                  ((r.strstart = 0), (r.block_start = 0), (r.insert = 0)))),
          nr(e),
          0 === e.avail_out)
        )
          return (r.last_flush = -1), Nt;
      }
      return t !== Dt
        ? Nt
        : r.wrap <= 0
        ? xt
        : (2 === r.wrap
            ? (or(r, 255 & e.adler),
              or(r, (e.adler >> 8) & 255),
              or(r, (e.adler >> 16) & 255),
              or(r, (e.adler >> 24) & 255),
              or(r, 255 & e.total_in),
              or(r, (e.total_in >> 8) & 255),
              or(r, (e.total_in >> 16) & 255),
              or(r, (e.total_in >> 24) & 255))
            : (ar(r, e.adler >>> 16), ar(r, 65535 & e.adler)),
          nr(e),
          r.wrap > 0 && (r.wrap = -r.wrap),
          0 !== r.pending ? Nt : xt);
    },
    deflateEnd: (e) => {
      if (mr(e)) return Lt;
      const t = e.state.status;
      return (e.state = null), t === Jt ? Yt(e, Bt) : Nt;
    },
    deflateSetDictionary: (e, t) => {
      let r = t.length;
      if (mr(e)) return Lt;
      const n = e.state,
        i = n.wrap;
      if (2 === i || (1 === i && n.status !== Kt) || n.lookahead) return Lt;
      if (
        (1 === i && (e.adler = Tt(e.adler, t, r, 0)),
        (n.wrap = 0),
        r >= n.w_size)
      ) {
        0 === i &&
          (er(n.head), (n.strstart = 0), (n.block_start = 0), (n.insert = 0));
        let e = new Uint8Array(n.w_size);
        e.set(t.subarray(r - n.w_size, r), 0), (t = e), (r = n.w_size);
      }
      const o = e.avail_in,
        a = e.next_in,
        s = e.input;
      for (
        e.avail_in = r, e.next_in = 0, e.input = t, dr(n);
        n.lookahead >= 3;

      ) {
        let e = n.strstart,
          t = n.lookahead - 2;
        do {
          (n.ins_h = rr(n, n.ins_h, n.window[e + 3 - 1])),
            (n.prev[e & n.w_mask] = n.head[n.ins_h]),
            (n.head[n.ins_h] = e),
            e++;
        } while (--t);
        (n.strstart = e), (n.lookahead = 2), dr(n);
      }
      return (
        (n.strstart += n.lookahead),
        (n.block_start = n.strstart),
        (n.insert = n.lookahead),
        (n.lookahead = 0),
        (n.match_length = n.prev_length = 2),
        (n.match_available = 0),
        (e.next_in = a),
        (e.input = s),
        (e.avail_in = o),
        (n.wrap = i),
        Nt
      );
    },
    deflateInfo: "pako deflate (from Nodeca project)",
  };
  const Sr = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
  var yr = {
    assign: function (e) {
      const t = Array.prototype.slice.call(arguments, 1);
      for (; t.length; ) {
        const r = t.shift();
        if (r) {
          if ("object" != typeof r)
            throw new TypeError(r + "must be non-object");
          for (const t in r) Sr(r, t) && (e[t] = r[t]);
        }
      }
      return e;
    },
    flattenChunks: (e) => {
      let t = 0;
      for (let r = 0, n = e.length; r < n; r++) t += e[r].length;
      const r = new Uint8Array(t);
      for (let t = 0, n = 0, i = e.length; t < i; t++) {
        let i = e[t];
        r.set(i, n), (n += i.length);
      }
      return r;
    },
  };
  let kr = !0;
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch (Mc) {
    kr = !1;
  }
  const _r = new Uint8Array(256);
  for (let Dc = 0; Dc < 256; Dc++)
    _r[Dc] =
      Dc >= 252
        ? 6
        : Dc >= 248
        ? 5
        : Dc >= 240
        ? 4
        : Dc >= 224
        ? 3
        : Dc >= 192
        ? 2
        : 1;
  _r[254] = _r[254] = 1;
  var wr = {
    string2buf: (e) => {
      if ("function" == typeof TextEncoder && TextEncoder.prototype.encode)
        return new TextEncoder().encode(e);
      let t,
        r,
        n,
        i,
        o,
        a = e.length,
        s = 0;
      for (i = 0; i < a; i++)
        (r = e.charCodeAt(i)),
          55296 == (64512 & r) &&
            i + 1 < a &&
            ((n = e.charCodeAt(i + 1)),
            56320 == (64512 & n) &&
              ((r = 65536 + ((r - 55296) << 10) + (n - 56320)), i++)),
          (s += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4);
      for (t = new Uint8Array(s), o = 0, i = 0; o < s; i++)
        (r = e.charCodeAt(i)),
          55296 == (64512 & r) &&
            i + 1 < a &&
            ((n = e.charCodeAt(i + 1)),
            56320 == (64512 & n) &&
              ((r = 65536 + ((r - 55296) << 10) + (n - 56320)), i++)),
          r < 128
            ? (t[o++] = r)
            : r < 2048
            ? ((t[o++] = 192 | (r >>> 6)), (t[o++] = 128 | (63 & r)))
            : r < 65536
            ? ((t[o++] = 224 | (r >>> 12)),
              (t[o++] = 128 | ((r >>> 6) & 63)),
              (t[o++] = 128 | (63 & r)))
            : ((t[o++] = 240 | (r >>> 18)),
              (t[o++] = 128 | ((r >>> 12) & 63)),
              (t[o++] = 128 | ((r >>> 6) & 63)),
              (t[o++] = 128 | (63 & r)));
      return t;
    },
    buf2string: (e, t) => {
      const r = t || e.length;
      if ("function" == typeof TextDecoder && TextDecoder.prototype.decode)
        return new TextDecoder().decode(e.subarray(0, t));
      let n, i;
      const o = new Array(2 * r);
      for (i = 0, n = 0; n < r; ) {
        let t = e[n++];
        if (t < 128) {
          o[i++] = t;
          continue;
        }
        let a = _r[t];
        if (a > 4) (o[i++] = 65533), (n += a - 1);
        else {
          for (t &= 2 === a ? 31 : 3 === a ? 15 : 7; a > 1 && n < r; )
            (t = (t << 6) | (63 & e[n++])), a--;
          a > 1
            ? (o[i++] = 65533)
            : t < 65536
            ? (o[i++] = t)
            : ((t -= 65536),
              (o[i++] = 55296 | ((t >> 10) & 1023)),
              (o[i++] = 56320 | (1023 & t)));
        }
      }
      return ((e, t) => {
        if (t < 65534 && e.subarray && kr)
          return String.fromCharCode.apply(
            null,
            e.length === t ? e : e.subarray(0, t)
          );
        let r = "";
        for (let n = 0; n < t; n++) r += String.fromCharCode(e[n]);
        return r;
      })(o, i);
    },
    utf8border: (e, t) => {
      (t = t || e.length) > e.length && (t = e.length);
      let r = t - 1;
      for (; r >= 0 && 128 == (192 & e[r]); ) r--;
      return r < 0 || 0 === r ? t : r + _r[e[r]] > t ? r : t;
    },
  };
  var Er = function () {
    (this.input = null),
      (this.next_in = 0),
      (this.avail_in = 0),
      (this.total_in = 0),
      (this.output = null),
      (this.next_out = 0),
      (this.avail_out = 0),
      (this.total_out = 0),
      (this.msg = ""),
      (this.state = null),
      (this.data_type = 2),
      (this.adler = 0);
  };
  const Cr = Object.prototype.toString,
    {
      Z_NO_FLUSH: Ir,
      Z_SYNC_FLUSH: Pr,
      Z_FULL_FLUSH: Rr,
      Z_FINISH: Mr,
      Z_OK: Dr,
      Z_STREAM_END: Or,
      Z_DEFAULT_COMPRESSION: Nr,
      Z_DEFAULT_STRATEGY: xr,
      Z_DEFLATED: Lr,
    } = kt;
  function Br(e) {
    this.options = yr.assign(
      {
        level: Nr,
        method: Lr,
        chunkSize: 16384,
        windowBits: 15,
        memLevel: 8,
        strategy: xr,
      },
      e || {}
    );
    let t = this.options;
    t.raw && t.windowBits > 0
      ? (t.windowBits = -t.windowBits)
      : t.gzip && t.windowBits > 0 && t.windowBits < 16 && (t.windowBits += 16),
      (this.err = 0),
      (this.msg = ""),
      (this.ended = !1),
      (this.chunks = []),
      (this.strm = new Er()),
      (this.strm.avail_out = 0);
    let r = br.deflateInit2(
      this.strm,
      t.level,
      t.method,
      t.windowBits,
      t.memLevel,
      t.strategy
    );
    if (r !== Dr) throw new Error(yt[r]);
    if ((t.header && br.deflateSetHeader(this.strm, t.header), t.dictionary)) {
      let e;
      if (
        ((e =
          "string" == typeof t.dictionary
            ? wr.string2buf(t.dictionary)
            : "[object ArrayBuffer]" === Cr.call(t.dictionary)
            ? new Uint8Array(t.dictionary)
            : t.dictionary),
        (r = br.deflateSetDictionary(this.strm, e)),
        r !== Dr)
      )
        throw new Error(yt[r]);
      this._dict_set = !0;
    }
  }
  function Gr(e, t) {
    const r = new Br(t);
    if ((r.push(e, !0), r.err)) throw r.msg || yt[r.err];
    return r.result;
  }
  (Br.prototype.push = function (e, t) {
    const r = this.strm,
      n = this.options.chunkSize;
    let i, o;
    if (this.ended) return !1;
    for (
      o = t === ~~t ? t : !0 === t ? Mr : Ir,
        "string" == typeof e
          ? (r.input = wr.string2buf(e))
          : "[object ArrayBuffer]" === Cr.call(e)
          ? (r.input = new Uint8Array(e))
          : (r.input = e),
        r.next_in = 0,
        r.avail_in = r.input.length;
      ;

    )
      if (
        (0 === r.avail_out &&
          ((r.output = new Uint8Array(n)), (r.next_out = 0), (r.avail_out = n)),
        (o === Pr || o === Rr) && r.avail_out <= 6)
      )
        this.onData(r.output.subarray(0, r.next_out)), (r.avail_out = 0);
      else {
        if (((i = br.deflate(r, o)), i === Or))
          return (
            r.next_out > 0 && this.onData(r.output.subarray(0, r.next_out)),
            (i = br.deflateEnd(this.strm)),
            this.onEnd(i),
            (this.ended = !0),
            i === Dr
          );
        if (0 !== r.avail_out) {
          if (o > 0 && r.next_out > 0)
            this.onData(r.output.subarray(0, r.next_out)), (r.avail_out = 0);
          else if (0 === r.avail_in) break;
        } else this.onData(r.output);
      }
    return !0;
  }),
    (Br.prototype.onData = function (e) {
      this.chunks.push(e);
    }),
    (Br.prototype.onEnd = function (e) {
      e === Dr && (this.result = yr.flattenChunks(this.chunks)),
        (this.chunks = []),
        (this.err = e),
        (this.msg = this.strm.msg);
    });
  var Hr = {
    Deflate: Br,
    deflate: Gr,
    deflateRaw: function (e, t) {
      return ((t = t || {}).raw = !0), Gr(e, t);
    },
    gzip: function (e, t) {
      return ((t = t || {}).gzip = !0), Gr(e, t);
    },
    constants: kt,
  };
  const jr = 16209;
  var Fr = function (e, t) {
    let r, n, i, o, a, s, c, d, u, l, A, h, f, p, m, g, v, T, b, S, y, k, _, w;
    const E = e.state;
    (r = e.next_in),
      (_ = e.input),
      (n = r + (e.avail_in - 5)),
      (i = e.next_out),
      (w = e.output),
      (o = i - (t - e.avail_out)),
      (a = i + (e.avail_out - 257)),
      (s = E.dmax),
      (c = E.wsize),
      (d = E.whave),
      (u = E.wnext),
      (l = E.window),
      (A = E.hold),
      (h = E.bits),
      (f = E.lencode),
      (p = E.distcode),
      (m = (1 << E.lenbits) - 1),
      (g = (1 << E.distbits) - 1);
    e: do {
      h < 15 && ((A += _[r++] << h), (h += 8), (A += _[r++] << h), (h += 8)),
        (v = f[A & m]);
      t: for (;;) {
        if (
          ((T = v >>> 24),
          (A >>>= T),
          (h -= T),
          (T = (v >>> 16) & 255),
          0 === T)
        )
          w[i++] = 65535 & v;
        else {
          if (!(16 & T)) {
            if (0 == (64 & T)) {
              v = f[(65535 & v) + (A & ((1 << T) - 1))];
              continue t;
            }
            if (32 & T) {
              E.mode = 16191;
              break e;
            }
            (e.msg = "invalid literal/length code"), (E.mode = jr);
            break e;
          }
          (b = 65535 & v),
            (T &= 15),
            T &&
              (h < T && ((A += _[r++] << h), (h += 8)),
              (b += A & ((1 << T) - 1)),
              (A >>>= T),
              (h -= T)),
            h < 15 &&
              ((A += _[r++] << h), (h += 8), (A += _[r++] << h), (h += 8)),
            (v = p[A & g]);
          r: for (;;) {
            if (
              ((T = v >>> 24),
              (A >>>= T),
              (h -= T),
              (T = (v >>> 16) & 255),
              !(16 & T))
            ) {
              if (0 == (64 & T)) {
                v = p[(65535 & v) + (A & ((1 << T) - 1))];
                continue r;
              }
              (e.msg = "invalid distance code"), (E.mode = jr);
              break e;
            }
            if (
              ((S = 65535 & v),
              (T &= 15),
              h < T &&
                ((A += _[r++] << h),
                (h += 8),
                h < T && ((A += _[r++] << h), (h += 8))),
              (S += A & ((1 << T) - 1)),
              S > s)
            ) {
              (e.msg = "invalid distance too far back"), (E.mode = jr);
              break e;
            }
            if (((A >>>= T), (h -= T), (T = i - o), S > T)) {
              if (((T = S - T), T > d && E.sane)) {
                (e.msg = "invalid distance too far back"), (E.mode = jr);
                break e;
              }
              if (((y = 0), (k = l), 0 === u)) {
                if (((y += c - T), T < b)) {
                  b -= T;
                  do {
                    w[i++] = l[y++];
                  } while (--T);
                  (y = i - S), (k = w);
                }
              } else if (u < T) {
                if (((y += c + u - T), (T -= u), T < b)) {
                  b -= T;
                  do {
                    w[i++] = l[y++];
                  } while (--T);
                  if (((y = 0), u < b)) {
                    (T = u), (b -= T);
                    do {
                      w[i++] = l[y++];
                    } while (--T);
                    (y = i - S), (k = w);
                  }
                }
              } else if (((y += u - T), T < b)) {
                b -= T;
                do {
                  w[i++] = l[y++];
                } while (--T);
                (y = i - S), (k = w);
              }
              for (; b > 2; )
                (w[i++] = k[y++]),
                  (w[i++] = k[y++]),
                  (w[i++] = k[y++]),
                  (b -= 3);
              b && ((w[i++] = k[y++]), b > 1 && (w[i++] = k[y++]));
            } else {
              y = i - S;
              do {
                (w[i++] = w[y++]),
                  (w[i++] = w[y++]),
                  (w[i++] = w[y++]),
                  (b -= 3);
              } while (b > 2);
              b && ((w[i++] = w[y++]), b > 1 && (w[i++] = w[y++]));
            }
            break;
          }
        }
        break;
      }
    } while (r < n && i < a);
    (b = h >> 3),
      (r -= b),
      (h -= b << 3),
      (A &= (1 << h) - 1),
      (e.next_in = r),
      (e.next_out = i),
      (e.avail_in = r < n ? n - r + 5 : 5 - (r - n)),
      (e.avail_out = i < a ? a - i + 257 : 257 - (i - a)),
      (E.hold = A),
      (E.bits = h);
  };
  const Vr = 15,
    Ur = new Uint16Array([
      3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59,
      67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0,
    ]),
    qr = new Uint8Array([
      16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19,
      19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78,
    ]),
    Qr = new Uint16Array([
      1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513,
      769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0,
    ]),
    Wr = new Uint8Array([
      16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23,
      24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64,
    ]);
  var zr = (e, t, r, n, i, o, a, s) => {
    const c = s.bits;
    let d,
      u,
      l,
      A,
      h,
      f,
      p = 0,
      m = 0,
      g = 0,
      v = 0,
      T = 0,
      b = 0,
      S = 0,
      y = 0,
      k = 0,
      _ = 0,
      w = null;
    const E = new Uint16Array(16),
      C = new Uint16Array(16);
    let I,
      P,
      R,
      M = null;
    for (p = 0; p <= Vr; p++) E[p] = 0;
    for (m = 0; m < n; m++) E[t[r + m]]++;
    for (T = c, v = Vr; v >= 1 && 0 === E[v]; v--);
    if ((T > v && (T = v), 0 === v))
      return (i[o++] = 20971520), (i[o++] = 20971520), (s.bits = 1), 0;
    for (g = 1; g < v && 0 === E[g]; g++);
    for (T < g && (T = g), y = 1, p = 1; p <= Vr; p++)
      if (((y <<= 1), (y -= E[p]), y < 0)) return -1;
    if (y > 0 && (0 === e || 1 !== v)) return -1;
    for (C[1] = 0, p = 1; p < Vr; p++) C[p + 1] = C[p] + E[p];
    for (m = 0; m < n; m++) 0 !== t[r + m] && (a[C[t[r + m]]++] = m);
    if (
      (0 === e
        ? ((w = M = a), (f = 20))
        : 1 === e
        ? ((w = Ur), (M = qr), (f = 257))
        : ((w = Qr), (M = Wr), (f = 0)),
      (_ = 0),
      (m = 0),
      (p = g),
      (h = o),
      (b = T),
      (S = 0),
      (l = -1),
      (k = 1 << T),
      (A = k - 1),
      (1 === e && k > 852) || (2 === e && k > 592))
    )
      return 1;
    for (;;) {
      (I = p - S),
        a[m] + 1 < f
          ? ((P = 0), (R = a[m]))
          : a[m] >= f
          ? ((P = M[a[m] - f]), (R = w[a[m] - f]))
          : ((P = 96), (R = 0)),
        (d = 1 << (p - S)),
        (u = 1 << b),
        (g = u);
      do {
        (u -= d), (i[h + (_ >> S) + u] = (I << 24) | (P << 16) | R | 0);
      } while (0 !== u);
      for (d = 1 << (p - 1); _ & d; ) d >>= 1;
      if ((0 !== d ? ((_ &= d - 1), (_ += d)) : (_ = 0), m++, 0 == --E[p])) {
        if (p === v) break;
        p = t[r + a[m]];
      }
      if (p > T && (_ & A) !== l) {
        for (
          0 === S && (S = T), h += g, b = p - S, y = 1 << b;
          b + S < v && ((y -= E[b + S]), !(y <= 0));

        )
          b++, (y <<= 1);
        if (((k += 1 << b), (1 === e && k > 852) || (2 === e && k > 592)))
          return 1;
        (l = _ & A), (i[l] = (T << 24) | (b << 16) | (h - o) | 0);
      }
    }
    return (
      0 !== _ && (i[h + _] = ((p - S) << 24) | (64 << 16) | 0), (s.bits = T), 0
    );
  };
  const {
      Z_FINISH: Xr,
      Z_BLOCK: Kr,
      Z_TREES: Jr,
      Z_OK: Zr,
      Z_STREAM_END: Yr,
      Z_NEED_DICT: $r,
      Z_STREAM_ERROR: en,
      Z_DATA_ERROR: tn,
      Z_MEM_ERROR: rn,
      Z_BUF_ERROR: nn,
      Z_DEFLATED: on,
    } = kt,
    an = 16180,
    sn = 16190,
    cn = 16191,
    dn = 16192,
    un = 16194,
    ln = 16199,
    An = 16200,
    hn = 16206,
    fn = 16209,
    pn = (e) =>
      ((e >>> 24) & 255) +
      ((e >>> 8) & 65280) +
      ((65280 & e) << 8) +
      ((255 & e) << 24);
  function mn() {
    (this.strm = null),
      (this.mode = 0),
      (this.last = !1),
      (this.wrap = 0),
      (this.havedict = !1),
      (this.flags = 0),
      (this.dmax = 0),
      (this.check = 0),
      (this.total = 0),
      (this.head = null),
      (this.wbits = 0),
      (this.wsize = 0),
      (this.whave = 0),
      (this.wnext = 0),
      (this.window = null),
      (this.hold = 0),
      (this.bits = 0),
      (this.length = 0),
      (this.offset = 0),
      (this.extra = 0),
      (this.lencode = null),
      (this.distcode = null),
      (this.lenbits = 0),
      (this.distbits = 0),
      (this.ncode = 0),
      (this.nlen = 0),
      (this.ndist = 0),
      (this.have = 0),
      (this.next = null),
      (this.lens = new Uint16Array(320)),
      (this.work = new Uint16Array(288)),
      (this.lendyn = null),
      (this.distdyn = null),
      (this.sane = 0),
      (this.back = 0),
      (this.was = 0);
  }
  const gn = (e) => {
      if (!e) return 1;
      const t = e.state;
      return !t || t.strm !== e || t.mode < an || t.mode > 16211 ? 1 : 0;
    },
    vn = (e) => {
      if (gn(e)) return en;
      const t = e.state;
      return (
        (e.total_in = e.total_out = t.total = 0),
        (e.msg = ""),
        t.wrap && (e.adler = 1 & t.wrap),
        (t.mode = an),
        (t.last = 0),
        (t.havedict = 0),
        (t.flags = -1),
        (t.dmax = 32768),
        (t.head = null),
        (t.hold = 0),
        (t.bits = 0),
        (t.lencode = t.lendyn = new Int32Array(852)),
        (t.distcode = t.distdyn = new Int32Array(592)),
        (t.sane = 1),
        (t.back = -1),
        Zr
      );
    },
    Tn = (e) => {
      if (gn(e)) return en;
      const t = e.state;
      return (t.wsize = 0), (t.whave = 0), (t.wnext = 0), vn(e);
    },
    bn = (e, t) => {
      let r;
      if (gn(e)) return en;
      const n = e.state;
      return (
        t < 0 ? ((r = 0), (t = -t)) : ((r = 5 + (t >> 4)), t < 48 && (t &= 15)),
        t && (t < 8 || t > 15)
          ? en
          : (null !== n.window && n.wbits !== t && (n.window = null),
            (n.wrap = r),
            (n.wbits = t),
            Tn(e))
      );
    },
    Sn = (e, t) => {
      if (!e) return en;
      const r = new mn();
      (e.state = r), (r.strm = e), (r.window = null), (r.mode = an);
      const n = bn(e, t);
      return n !== Zr && (e.state = null), n;
    };
  let yn,
    kn,
    _n = !0;
  const wn = (e) => {
      if (_n) {
        (yn = new Int32Array(512)), (kn = new Int32Array(32));
        let t = 0;
        for (; t < 144; ) e.lens[t++] = 8;
        for (; t < 256; ) e.lens[t++] = 9;
        for (; t < 280; ) e.lens[t++] = 7;
        for (; t < 288; ) e.lens[t++] = 8;
        for (zr(1, e.lens, 0, 288, yn, 0, e.work, { bits: 9 }), t = 0; t < 32; )
          e.lens[t++] = 5;
        zr(2, e.lens, 0, 32, kn, 0, e.work, { bits: 5 }), (_n = !1);
      }
      (e.lencode = yn), (e.lenbits = 9), (e.distcode = kn), (e.distbits = 5);
    },
    En = (e, t, r, n) => {
      let i;
      const o = e.state;
      return (
        null === o.window &&
          ((o.wsize = 1 << o.wbits),
          (o.wnext = 0),
          (o.whave = 0),
          (o.window = new Uint8Array(o.wsize))),
        n >= o.wsize
          ? (o.window.set(t.subarray(r - o.wsize, r), 0),
            (o.wnext = 0),
            (o.whave = o.wsize))
          : ((i = o.wsize - o.wnext),
            i > n && (i = n),
            o.window.set(t.subarray(r - n, r - n + i), o.wnext),
            (n -= i)
              ? (o.window.set(t.subarray(r - n, r), 0),
                (o.wnext = n),
                (o.whave = o.wsize))
              : ((o.wnext += i),
                o.wnext === o.wsize && (o.wnext = 0),
                o.whave < o.wsize && (o.whave += i))),
        0
      );
    };
  var Cn = {
    inflateReset: Tn,
    inflateReset2: bn,
    inflateResetKeep: vn,
    inflateInit: (e) => Sn(e, 15),
    inflateInit2: Sn,
    inflate: (e, t) => {
      let r,
        n,
        i,
        o,
        a,
        s,
        c,
        d,
        u,
        l,
        A,
        h,
        f,
        p,
        m,
        g,
        v,
        T,
        b,
        S,
        y,
        k,
        _ = 0;
      const w = new Uint8Array(4);
      let E, C;
      const I = new Uint8Array([
        16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
      ]);
      if (gn(e) || !e.output || (!e.input && 0 !== e.avail_in)) return en;
      (r = e.state),
        r.mode === cn && (r.mode = dn),
        (a = e.next_out),
        (i = e.output),
        (c = e.avail_out),
        (o = e.next_in),
        (n = e.input),
        (s = e.avail_in),
        (d = r.hold),
        (u = r.bits),
        (l = s),
        (A = c),
        (k = Zr);
      e: for (;;)
        switch (r.mode) {
          case an:
            if (0 === r.wrap) {
              r.mode = dn;
              break;
            }
            for (; u < 16; ) {
              if (0 === s) break e;
              s--, (d += n[o++] << u), (u += 8);
            }
            if (2 & r.wrap && 35615 === d) {
              0 === r.wbits && (r.wbits = 15),
                (r.check = 0),
                (w[0] = 255 & d),
                (w[1] = (d >>> 8) & 255),
                (r.check = St(r.check, w, 2, 0)),
                (d = 0),
                (u = 0),
                (r.mode = 16181);
              break;
            }
            if (
              (r.head && (r.head.done = !1),
              !(1 & r.wrap) || (((255 & d) << 8) + (d >> 8)) % 31)
            ) {
              (e.msg = "incorrect header check"), (r.mode = fn);
              break;
            }
            if ((15 & d) !== on) {
              (e.msg = "unknown compression method"), (r.mode = fn);
              break;
            }
            if (
              ((d >>>= 4),
              (u -= 4),
              (y = 8 + (15 & d)),
              0 === r.wbits && (r.wbits = y),
              y > 15 || y > r.wbits)
            ) {
              (e.msg = "invalid window size"), (r.mode = fn);
              break;
            }
            (r.dmax = 1 << r.wbits),
              (r.flags = 0),
              (e.adler = r.check = 1),
              (r.mode = 512 & d ? 16189 : cn),
              (d = 0),
              (u = 0);
            break;
          case 16181:
            for (; u < 16; ) {
              if (0 === s) break e;
              s--, (d += n[o++] << u), (u += 8);
            }
            if (((r.flags = d), (255 & r.flags) !== on)) {
              (e.msg = "unknown compression method"), (r.mode = fn);
              break;
            }
            if (57344 & r.flags) {
              (e.msg = "unknown header flags set"), (r.mode = fn);
              break;
            }
            r.head && (r.head.text = (d >> 8) & 1),
              512 & r.flags &&
                4 & r.wrap &&
                ((w[0] = 255 & d),
                (w[1] = (d >>> 8) & 255),
                (r.check = St(r.check, w, 2, 0))),
              (d = 0),
              (u = 0),
              (r.mode = 16182);
          case 16182:
            for (; u < 32; ) {
              if (0 === s) break e;
              s--, (d += n[o++] << u), (u += 8);
            }
            r.head && (r.head.time = d),
              512 & r.flags &&
                4 & r.wrap &&
                ((w[0] = 255 & d),
                (w[1] = (d >>> 8) & 255),
                (w[2] = (d >>> 16) & 255),
                (w[3] = (d >>> 24) & 255),
                (r.check = St(r.check, w, 4, 0))),
              (d = 0),
              (u = 0),
              (r.mode = 16183);
          case 16183:
            for (; u < 16; ) {
              if (0 === s) break e;
              s--, (d += n[o++] << u), (u += 8);
            }
            r.head && ((r.head.xflags = 255 & d), (r.head.os = d >> 8)),
              512 & r.flags &&
                4 & r.wrap &&
                ((w[0] = 255 & d),
                (w[1] = (d >>> 8) & 255),
                (r.check = St(r.check, w, 2, 0))),
              (d = 0),
              (u = 0),
              (r.mode = 16184);
          case 16184:
            if (1024 & r.flags) {
              for (; u < 16; ) {
                if (0 === s) break e;
                s--, (d += n[o++] << u), (u += 8);
              }
              (r.length = d),
                r.head && (r.head.extra_len = d),
                512 & r.flags &&
                  4 & r.wrap &&
                  ((w[0] = 255 & d),
                  (w[1] = (d >>> 8) & 255),
                  (r.check = St(r.check, w, 2, 0))),
                (d = 0),
                (u = 0);
            } else r.head && (r.head.extra = null);
            r.mode = 16185;
          case 16185:
            if (
              1024 & r.flags &&
              ((h = r.length),
              h > s && (h = s),
              h &&
                (r.head &&
                  ((y = r.head.extra_len - r.length),
                  r.head.extra ||
                    (r.head.extra = new Uint8Array(r.head.extra_len)),
                  r.head.extra.set(n.subarray(o, o + h), y)),
                512 & r.flags && 4 & r.wrap && (r.check = St(r.check, n, h, o)),
                (s -= h),
                (o += h),
                (r.length -= h)),
              r.length)
            )
              break e;
            (r.length = 0), (r.mode = 16186);
          case 16186:
            if (2048 & r.flags) {
              if (0 === s) break e;
              h = 0;
              do {
                (y = n[o + h++]),
                  r.head &&
                    y &&
                    r.length < 65536 &&
                    (r.head.name += String.fromCharCode(y));
              } while (y && h < s);
              if (
                (512 & r.flags &&
                  4 & r.wrap &&
                  (r.check = St(r.check, n, h, o)),
                (s -= h),
                (o += h),
                y)
              )
                break e;
            } else r.head && (r.head.name = null);
            (r.length = 0), (r.mode = 16187);
          case 16187:
            if (4096 & r.flags) {
              if (0 === s) break e;
              h = 0;
              do {
                (y = n[o + h++]),
                  r.head &&
                    y &&
                    r.length < 65536 &&
                    (r.head.comment += String.fromCharCode(y));
              } while (y && h < s);
              if (
                (512 & r.flags &&
                  4 & r.wrap &&
                  (r.check = St(r.check, n, h, o)),
                (s -= h),
                (o += h),
                y)
              )
                break e;
            } else r.head && (r.head.comment = null);
            r.mode = 16188;
          case 16188:
            if (512 & r.flags) {
              for (; u < 16; ) {
                if (0 === s) break e;
                s--, (d += n[o++] << u), (u += 8);
              }
              if (4 & r.wrap && d !== (65535 & r.check)) {
                (e.msg = "header crc mismatch"), (r.mode = fn);
                break;
              }
              (d = 0), (u = 0);
            }
            r.head && ((r.head.hcrc = (r.flags >> 9) & 1), (r.head.done = !0)),
              (e.adler = r.check = 0),
              (r.mode = cn);
            break;
          case 16189:
            for (; u < 32; ) {
              if (0 === s) break e;
              s--, (d += n[o++] << u), (u += 8);
            }
            (e.adler = r.check = pn(d)), (d = 0), (u = 0), (r.mode = sn);
          case sn:
            if (0 === r.havedict)
              return (
                (e.next_out = a),
                (e.avail_out = c),
                (e.next_in = o),
                (e.avail_in = s),
                (r.hold = d),
                (r.bits = u),
                $r
              );
            (e.adler = r.check = 1), (r.mode = cn);
          case cn:
            if (t === Kr || t === Jr) break e;
          case dn:
            if (r.last) {
              (d >>>= 7 & u), (u -= 7 & u), (r.mode = hn);
              break;
            }
            for (; u < 3; ) {
              if (0 === s) break e;
              s--, (d += n[o++] << u), (u += 8);
            }
            switch (((r.last = 1 & d), (d >>>= 1), (u -= 1), 3 & d)) {
              case 0:
                r.mode = 16193;
                break;
              case 1:
                if ((wn(r), (r.mode = ln), t === Jr)) {
                  (d >>>= 2), (u -= 2);
                  break e;
                }
                break;
              case 2:
                r.mode = 16196;
                break;
              case 3:
                (e.msg = "invalid block type"), (r.mode = fn);
            }
            (d >>>= 2), (u -= 2);
            break;
          case 16193:
            for (d >>>= 7 & u, u -= 7 & u; u < 32; ) {
              if (0 === s) break e;
              s--, (d += n[o++] << u), (u += 8);
            }
            if ((65535 & d) != ((d >>> 16) ^ 65535)) {
              (e.msg = "invalid stored block lengths"), (r.mode = fn);
              break;
            }
            if (
              ((r.length = 65535 & d),
              (d = 0),
              (u = 0),
              (r.mode = un),
              t === Jr)
            )
              break e;
          case un:
            r.mode = 16195;
          case 16195:
            if (((h = r.length), h)) {
              if ((h > s && (h = s), h > c && (h = c), 0 === h)) break e;
              i.set(n.subarray(o, o + h), a),
                (s -= h),
                (o += h),
                (c -= h),
                (a += h),
                (r.length -= h);
              break;
            }
            r.mode = cn;
            break;
          case 16196:
            for (; u < 14; ) {
              if (0 === s) break e;
              s--, (d += n[o++] << u), (u += 8);
            }
            if (
              ((r.nlen = 257 + (31 & d)),
              (d >>>= 5),
              (u -= 5),
              (r.ndist = 1 + (31 & d)),
              (d >>>= 5),
              (u -= 5),
              (r.ncode = 4 + (15 & d)),
              (d >>>= 4),
              (u -= 4),
              r.nlen > 286 || r.ndist > 30)
            ) {
              (e.msg = "too many length or distance symbols"), (r.mode = fn);
              break;
            }
            (r.have = 0), (r.mode = 16197);
          case 16197:
            for (; r.have < r.ncode; ) {
              for (; u < 3; ) {
                if (0 === s) break e;
                s--, (d += n[o++] << u), (u += 8);
              }
              (r.lens[I[r.have++]] = 7 & d), (d >>>= 3), (u -= 3);
            }
            for (; r.have < 19; ) r.lens[I[r.have++]] = 0;
            if (
              ((r.lencode = r.lendyn),
              (r.lenbits = 7),
              (E = { bits: r.lenbits }),
              (k = zr(0, r.lens, 0, 19, r.lencode, 0, r.work, E)),
              (r.lenbits = E.bits),
              k)
            ) {
              (e.msg = "invalid code lengths set"), (r.mode = fn);
              break;
            }
            (r.have = 0), (r.mode = 16198);
          case 16198:
            for (; r.have < r.nlen + r.ndist; ) {
              for (
                ;
                (_ = r.lencode[d & ((1 << r.lenbits) - 1)]),
                  (m = _ >>> 24),
                  (g = (_ >>> 16) & 255),
                  (v = 65535 & _),
                  !(m <= u);

              ) {
                if (0 === s) break e;
                s--, (d += n[o++] << u), (u += 8);
              }
              if (v < 16) (d >>>= m), (u -= m), (r.lens[r.have++] = v);
              else {
                if (16 === v) {
                  for (C = m + 2; u < C; ) {
                    if (0 === s) break e;
                    s--, (d += n[o++] << u), (u += 8);
                  }
                  if (((d >>>= m), (u -= m), 0 === r.have)) {
                    (e.msg = "invalid bit length repeat"), (r.mode = fn);
                    break;
                  }
                  (y = r.lens[r.have - 1]),
                    (h = 3 + (3 & d)),
                    (d >>>= 2),
                    (u -= 2);
                } else if (17 === v) {
                  for (C = m + 3; u < C; ) {
                    if (0 === s) break e;
                    s--, (d += n[o++] << u), (u += 8);
                  }
                  (d >>>= m),
                    (u -= m),
                    (y = 0),
                    (h = 3 + (7 & d)),
                    (d >>>= 3),
                    (u -= 3);
                } else {
                  for (C = m + 7; u < C; ) {
                    if (0 === s) break e;
                    s--, (d += n[o++] << u), (u += 8);
                  }
                  (d >>>= m),
                    (u -= m),
                    (y = 0),
                    (h = 11 + (127 & d)),
                    (d >>>= 7),
                    (u -= 7);
                }
                if (r.have + h > r.nlen + r.ndist) {
                  (e.msg = "invalid bit length repeat"), (r.mode = fn);
                  break;
                }
                for (; h--; ) r.lens[r.have++] = y;
              }
            }
            if (r.mode === fn) break;
            if (0 === r.lens[256]) {
              (e.msg = "invalid code -- missing end-of-block"), (r.mode = fn);
              break;
            }
            if (
              ((r.lenbits = 9),
              (E = { bits: r.lenbits }),
              (k = zr(1, r.lens, 0, r.nlen, r.lencode, 0, r.work, E)),
              (r.lenbits = E.bits),
              k)
            ) {
              (e.msg = "invalid literal/lengths set"), (r.mode = fn);
              break;
            }
            if (
              ((r.distbits = 6),
              (r.distcode = r.distdyn),
              (E = { bits: r.distbits }),
              (k = zr(2, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, E)),
              (r.distbits = E.bits),
              k)
            ) {
              (e.msg = "invalid distances set"), (r.mode = fn);
              break;
            }
            if (((r.mode = ln), t === Jr)) break e;
          case ln:
            r.mode = An;
          case An:
            if (s >= 6 && c >= 258) {
              (e.next_out = a),
                (e.avail_out = c),
                (e.next_in = o),
                (e.avail_in = s),
                (r.hold = d),
                (r.bits = u),
                Fr(e, A),
                (a = e.next_out),
                (i = e.output),
                (c = e.avail_out),
                (o = e.next_in),
                (n = e.input),
                (s = e.avail_in),
                (d = r.hold),
                (u = r.bits),
                r.mode === cn && (r.back = -1);
              break;
            }
            for (
              r.back = 0;
              (_ = r.lencode[d & ((1 << r.lenbits) - 1)]),
                (m = _ >>> 24),
                (g = (_ >>> 16) & 255),
                (v = 65535 & _),
                !(m <= u);

            ) {
              if (0 === s) break e;
              s--, (d += n[o++] << u), (u += 8);
            }
            if (g && 0 == (240 & g)) {
              for (
                T = m, b = g, S = v;
                (_ = r.lencode[S + ((d & ((1 << (T + b)) - 1)) >> T)]),
                  (m = _ >>> 24),
                  (g = (_ >>> 16) & 255),
                  (v = 65535 & _),
                  !(T + m <= u);

              ) {
                if (0 === s) break e;
                s--, (d += n[o++] << u), (u += 8);
              }
              (d >>>= T), (u -= T), (r.back += T);
            }
            if (
              ((d >>>= m), (u -= m), (r.back += m), (r.length = v), 0 === g)
            ) {
              r.mode = 16205;
              break;
            }
            if (32 & g) {
              (r.back = -1), (r.mode = cn);
              break;
            }
            if (64 & g) {
              (e.msg = "invalid literal/length code"), (r.mode = fn);
              break;
            }
            (r.extra = 15 & g), (r.mode = 16201);
          case 16201:
            if (r.extra) {
              for (C = r.extra; u < C; ) {
                if (0 === s) break e;
                s--, (d += n[o++] << u), (u += 8);
              }
              (r.length += d & ((1 << r.extra) - 1)),
                (d >>>= r.extra),
                (u -= r.extra),
                (r.back += r.extra);
            }
            (r.was = r.length), (r.mode = 16202);
          case 16202:
            for (
              ;
              (_ = r.distcode[d & ((1 << r.distbits) - 1)]),
                (m = _ >>> 24),
                (g = (_ >>> 16) & 255),
                (v = 65535 & _),
                !(m <= u);

            ) {
              if (0 === s) break e;
              s--, (d += n[o++] << u), (u += 8);
            }
            if (0 == (240 & g)) {
              for (
                T = m, b = g, S = v;
                (_ = r.distcode[S + ((d & ((1 << (T + b)) - 1)) >> T)]),
                  (m = _ >>> 24),
                  (g = (_ >>> 16) & 255),
                  (v = 65535 & _),
                  !(T + m <= u);

              ) {
                if (0 === s) break e;
                s--, (d += n[o++] << u), (u += 8);
              }
              (d >>>= T), (u -= T), (r.back += T);
            }
            if (((d >>>= m), (u -= m), (r.back += m), 64 & g)) {
              (e.msg = "invalid distance code"), (r.mode = fn);
              break;
            }
            (r.offset = v), (r.extra = 15 & g), (r.mode = 16203);
          case 16203:
            if (r.extra) {
              for (C = r.extra; u < C; ) {
                if (0 === s) break e;
                s--, (d += n[o++] << u), (u += 8);
              }
              (r.offset += d & ((1 << r.extra) - 1)),
                (d >>>= r.extra),
                (u -= r.extra),
                (r.back += r.extra);
            }
            if (r.offset > r.dmax) {
              (e.msg = "invalid distance too far back"), (r.mode = fn);
              break;
            }
            r.mode = 16204;
          case 16204:
            if (0 === c) break e;
            if (((h = A - c), r.offset > h)) {
              if (((h = r.offset - h), h > r.whave && r.sane)) {
                (e.msg = "invalid distance too far back"), (r.mode = fn);
                break;
              }
              h > r.wnext
                ? ((h -= r.wnext), (f = r.wsize - h))
                : (f = r.wnext - h),
                h > r.length && (h = r.length),
                (p = r.window);
            } else (p = i), (f = a - r.offset), (h = r.length);
            h > c && (h = c), (c -= h), (r.length -= h);
            do {
              i[a++] = p[f++];
            } while (--h);
            0 === r.length && (r.mode = An);
            break;
          case 16205:
            if (0 === c) break e;
            (i[a++] = r.length), c--, (r.mode = An);
            break;
          case hn:
            if (r.wrap) {
              for (; u < 32; ) {
                if (0 === s) break e;
                s--, (d |= n[o++] << u), (u += 8);
              }
              if (
                ((A -= c),
                (e.total_out += A),
                (r.total += A),
                4 & r.wrap &&
                  A &&
                  (e.adler = r.check =
                    r.flags
                      ? St(r.check, i, A, a - A)
                      : Tt(r.check, i, A, a - A)),
                (A = c),
                4 & r.wrap && (r.flags ? d : pn(d)) !== r.check)
              ) {
                (e.msg = "incorrect data check"), (r.mode = fn);
                break;
              }
              (d = 0), (u = 0);
            }
            r.mode = 16207;
          case 16207:
            if (r.wrap && r.flags) {
              for (; u < 32; ) {
                if (0 === s) break e;
                s--, (d += n[o++] << u), (u += 8);
              }
              if (4 & r.wrap && d !== (4294967295 & r.total)) {
                (e.msg = "incorrect length check"), (r.mode = fn);
                break;
              }
              (d = 0), (u = 0);
            }
            r.mode = 16208;
          case 16208:
            k = Yr;
            break e;
          case fn:
            k = tn;
            break e;
          case 16210:
            return rn;
          default:
            return en;
        }
      return (
        (e.next_out = a),
        (e.avail_out = c),
        (e.next_in = o),
        (e.avail_in = s),
        (r.hold = d),
        (r.bits = u),
        (r.wsize ||
          (A !== e.avail_out && r.mode < fn && (r.mode < hn || t !== Xr))) &&
          En(e, e.output, e.next_out, A - e.avail_out),
        (l -= e.avail_in),
        (A -= e.avail_out),
        (e.total_in += l),
        (e.total_out += A),
        (r.total += A),
        4 & r.wrap &&
          A &&
          (e.adler = r.check =
            r.flags
              ? St(r.check, i, A, e.next_out - A)
              : Tt(r.check, i, A, e.next_out - A)),
        (e.data_type =
          r.bits +
          (r.last ? 64 : 0) +
          (r.mode === cn ? 128 : 0) +
          (r.mode === ln || r.mode === un ? 256 : 0)),
        ((0 === l && 0 === A) || t === Xr) && k === Zr && (k = nn),
        k
      );
    },
    inflateEnd: (e) => {
      if (gn(e)) return en;
      let t = e.state;
      return t.window && (t.window = null), (e.state = null), Zr;
    },
    inflateGetHeader: (e, t) => {
      if (gn(e)) return en;
      const r = e.state;
      return 0 == (2 & r.wrap) ? en : ((r.head = t), (t.done = !1), Zr);
    },
    inflateSetDictionary: (e, t) => {
      const r = t.length;
      let n, i, o;
      return gn(e)
        ? en
        : ((n = e.state),
          0 !== n.wrap && n.mode !== sn
            ? en
            : n.mode === sn && ((i = 1), (i = Tt(i, t, r, 0)), i !== n.check)
            ? tn
            : ((o = En(e, t, r, r)),
              o ? ((n.mode = 16210), rn) : ((n.havedict = 1), Zr)));
    },
    inflateInfo: "pako inflate (from Nodeca project)",
  };
  var In = function () {
    (this.text = 0),
      (this.time = 0),
      (this.xflags = 0),
      (this.os = 0),
      (this.extra = null),
      (this.extra_len = 0),
      (this.name = ""),
      (this.comment = ""),
      (this.hcrc = 0),
      (this.done = !1);
  };
  const Pn = Object.prototype.toString,
    {
      Z_NO_FLUSH: Rn,
      Z_FINISH: Mn,
      Z_OK: Dn,
      Z_STREAM_END: On,
      Z_NEED_DICT: Nn,
      Z_STREAM_ERROR: xn,
      Z_DATA_ERROR: Ln,
      Z_MEM_ERROR: Bn,
    } = kt;
  function Gn(e) {
    this.options = yr.assign(
      { chunkSize: 65536, windowBits: 15, to: "" },
      e || {}
    );
    const t = this.options;
    t.raw &&
      t.windowBits >= 0 &&
      t.windowBits < 16 &&
      ((t.windowBits = -t.windowBits),
      0 === t.windowBits && (t.windowBits = -15)),
      !(t.windowBits >= 0 && t.windowBits < 16) ||
        (e && e.windowBits) ||
        (t.windowBits += 32),
      t.windowBits > 15 &&
        t.windowBits < 48 &&
        0 == (15 & t.windowBits) &&
        (t.windowBits |= 15),
      (this.err = 0),
      (this.msg = ""),
      (this.ended = !1),
      (this.chunks = []),
      (this.strm = new Er()),
      (this.strm.avail_out = 0);
    let r = Cn.inflateInit2(this.strm, t.windowBits);
    if (r !== Dn) throw new Error(yt[r]);
    if (
      ((this.header = new In()),
      Cn.inflateGetHeader(this.strm, this.header),
      t.dictionary &&
        ("string" == typeof t.dictionary
          ? (t.dictionary = wr.string2buf(t.dictionary))
          : "[object ArrayBuffer]" === Pn.call(t.dictionary) &&
            (t.dictionary = new Uint8Array(t.dictionary)),
        t.raw &&
          ((r = Cn.inflateSetDictionary(this.strm, t.dictionary)), r !== Dn)))
    )
      throw new Error(yt[r]);
  }
  function Hn(e, t) {
    const r = new Gn(t);
    if ((r.push(e), r.err)) throw r.msg || yt[r.err];
    return r.result;
  }
  (Gn.prototype.push = function (e, t) {
    const r = this.strm,
      n = this.options.chunkSize,
      i = this.options.dictionary;
    let o, a, s;
    if (this.ended) return !1;
    for (
      a = t === ~~t ? t : !0 === t ? Mn : Rn,
        "[object ArrayBuffer]" === Pn.call(e)
          ? (r.input = new Uint8Array(e))
          : (r.input = e),
        r.next_in = 0,
        r.avail_in = r.input.length;
      ;

    ) {
      for (
        0 === r.avail_out &&
          ((r.output = new Uint8Array(n)), (r.next_out = 0), (r.avail_out = n)),
          o = Cn.inflate(r, a),
          o === Nn &&
            i &&
            ((o = Cn.inflateSetDictionary(r, i)),
            o === Dn ? (o = Cn.inflate(r, a)) : o === Ln && (o = Nn));
        r.avail_in > 0 && o === On && r.state.wrap > 0 && 0 !== e[r.next_in];

      )
        Cn.inflateReset(r), (o = Cn.inflate(r, a));
      switch (o) {
        case xn:
        case Ln:
        case Nn:
        case Bn:
          return this.onEnd(o), (this.ended = !0), !1;
      }
      if (((s = r.avail_out), r.next_out && (0 === r.avail_out || o === On)))
        if ("string" === this.options.to) {
          let e = wr.utf8border(r.output, r.next_out),
            t = r.next_out - e,
            i = wr.buf2string(r.output, e);
          (r.next_out = t),
            (r.avail_out = n - t),
            t && r.output.set(r.output.subarray(e, e + t), 0),
            this.onData(i);
        } else
          this.onData(
            r.output.length === r.next_out
              ? r.output
              : r.output.subarray(0, r.next_out)
          );
      if (o !== Dn || 0 !== s) {
        if (o === On)
          return (
            (o = Cn.inflateEnd(this.strm)), this.onEnd(o), (this.ended = !0), !0
          );
        if (0 === r.avail_in) break;
      }
    }
    return !0;
  }),
    (Gn.prototype.onData = function (e) {
      this.chunks.push(e);
    }),
    (Gn.prototype.onEnd = function (e) {
      e === Dn &&
        ("string" === this.options.to
          ? (this.result = this.chunks.join(""))
          : (this.result = yr.flattenChunks(this.chunks))),
        (this.chunks = []),
        (this.err = e),
        (this.msg = this.strm.msg);
    });
  var jn = {
    Inflate: Gn,
    inflate: Hn,
    inflateRaw: function (e, t) {
      return ((t = t || {}).raw = !0), Hn(e, t);
    },
    ungzip: Hn,
    constants: kt,
  };
  const { Deflate: Fn, deflate: Vn, deflateRaw: Un, gzip: qn } = Hr,
    { Inflate: Qn, inflate: Wn, inflateRaw: zn, ungzip: Xn } = jn;
  var Kn = {
      Deflate: Fn,
      deflate: Vn,
      deflateRaw: Un,
      gzip: qn,
      Inflate: Qn,
      inflate: Wn,
      inflateRaw: zn,
      ungzip: Xn,
      constants: kt,
    },
    Jn = { exports: {} };
  !(function (e) {
    !(function (t) {
      function r(e, t) {
        var r = (65535 & e) + (65535 & t);
        return (((e >> 16) + (t >> 16) + (r >> 16)) << 16) | (65535 & r);
      }
      function n(e, t, n, i, o, a) {
        return r(((s = r(r(t, e), r(i, a))) << (c = o)) | (s >>> (32 - c)), n);
        var s, c;
      }
      function i(e, t, r, i, o, a, s) {
        return n((t & r) | (~t & i), e, t, o, a, s);
      }
      function o(e, t, r, i, o, a, s) {
        return n((t & i) | (r & ~i), e, t, o, a, s);
      }
      function a(e, t, r, i, o, a, s) {
        return n(t ^ r ^ i, e, t, o, a, s);
      }
      function s(e, t, r, i, o, a, s) {
        return n(r ^ (t | ~i), e, t, o, a, s);
      }
      function c(e, t) {
        var n, c, d, u, l;
        (e[t >> 5] |= 128 << t % 32), (e[14 + (((t + 64) >>> 9) << 4)] = t);
        var A = 1732584193,
          h = -271733879,
          f = -1732584194,
          p = 271733878;
        for (n = 0; n < e.length; n += 16)
          (c = A),
            (d = h),
            (u = f),
            (l = p),
            (A = i(A, h, f, p, e[n], 7, -680876936)),
            (p = i(p, A, h, f, e[n + 1], 12, -389564586)),
            (f = i(f, p, A, h, e[n + 2], 17, 606105819)),
            (h = i(h, f, p, A, e[n + 3], 22, -1044525330)),
            (A = i(A, h, f, p, e[n + 4], 7, -176418897)),
            (p = i(p, A, h, f, e[n + 5], 12, 1200080426)),
            (f = i(f, p, A, h, e[n + 6], 17, -1473231341)),
            (h = i(h, f, p, A, e[n + 7], 22, -45705983)),
            (A = i(A, h, f, p, e[n + 8], 7, 1770035416)),
            (p = i(p, A, h, f, e[n + 9], 12, -1958414417)),
            (f = i(f, p, A, h, e[n + 10], 17, -42063)),
            (h = i(h, f, p, A, e[n + 11], 22, -1990404162)),
            (A = i(A, h, f, p, e[n + 12], 7, 1804603682)),
            (p = i(p, A, h, f, e[n + 13], 12, -40341101)),
            (f = i(f, p, A, h, e[n + 14], 17, -1502002290)),
            (A = o(
              A,
              (h = i(h, f, p, A, e[n + 15], 22, 1236535329)),
              f,
              p,
              e[n + 1],
              5,
              -165796510
            )),
            (p = o(p, A, h, f, e[n + 6], 9, -1069501632)),
            (f = o(f, p, A, h, e[n + 11], 14, 643717713)),
            (h = o(h, f, p, A, e[n], 20, -373897302)),
            (A = o(A, h, f, p, e[n + 5], 5, -701558691)),
            (p = o(p, A, h, f, e[n + 10], 9, 38016083)),
            (f = o(f, p, A, h, e[n + 15], 14, -660478335)),
            (h = o(h, f, p, A, e[n + 4], 20, -405537848)),
            (A = o(A, h, f, p, e[n + 9], 5, 568446438)),
            (p = o(p, A, h, f, e[n + 14], 9, -1019803690)),
            (f = o(f, p, A, h, e[n + 3], 14, -187363961)),
            (h = o(h, f, p, A, e[n + 8], 20, 1163531501)),
            (A = o(A, h, f, p, e[n + 13], 5, -1444681467)),
            (p = o(p, A, h, f, e[n + 2], 9, -51403784)),
            (f = o(f, p, A, h, e[n + 7], 14, 1735328473)),
            (A = a(
              A,
              (h = o(h, f, p, A, e[n + 12], 20, -1926607734)),
              f,
              p,
              e[n + 5],
              4,
              -378558
            )),
            (p = a(p, A, h, f, e[n + 8], 11, -2022574463)),
            (f = a(f, p, A, h, e[n + 11], 16, 1839030562)),
            (h = a(h, f, p, A, e[n + 14], 23, -35309556)),
            (A = a(A, h, f, p, e[n + 1], 4, -1530992060)),
            (p = a(p, A, h, f, e[n + 4], 11, 1272893353)),
            (f = a(f, p, A, h, e[n + 7], 16, -155497632)),
            (h = a(h, f, p, A, e[n + 10], 23, -1094730640)),
            (A = a(A, h, f, p, e[n + 13], 4, 681279174)),
            (p = a(p, A, h, f, e[n], 11, -358537222)),
            (f = a(f, p, A, h, e[n + 3], 16, -722521979)),
            (h = a(h, f, p, A, e[n + 6], 23, 76029189)),
            (A = a(A, h, f, p, e[n + 9], 4, -640364487)),
            (p = a(p, A, h, f, e[n + 12], 11, -421815835)),
            (f = a(f, p, A, h, e[n + 15], 16, 530742520)),
            (A = s(
              A,
              (h = a(h, f, p, A, e[n + 2], 23, -995338651)),
              f,
              p,
              e[n],
              6,
              -198630844
            )),
            (p = s(p, A, h, f, e[n + 7], 10, 1126891415)),
            (f = s(f, p, A, h, e[n + 14], 15, -1416354905)),
            (h = s(h, f, p, A, e[n + 5], 21, -57434055)),
            (A = s(A, h, f, p, e[n + 12], 6, 1700485571)),
            (p = s(p, A, h, f, e[n + 3], 10, -1894986606)),
            (f = s(f, p, A, h, e[n + 10], 15, -1051523)),
            (h = s(h, f, p, A, e[n + 1], 21, -2054922799)),
            (A = s(A, h, f, p, e[n + 8], 6, 1873313359)),
            (p = s(p, A, h, f, e[n + 15], 10, -30611744)),
            (f = s(f, p, A, h, e[n + 6], 15, -1560198380)),
            (h = s(h, f, p, A, e[n + 13], 21, 1309151649)),
            (A = s(A, h, f, p, e[n + 4], 6, -145523070)),
            (p = s(p, A, h, f, e[n + 11], 10, -1120210379)),
            (f = s(f, p, A, h, e[n + 2], 15, 718787259)),
            (h = s(h, f, p, A, e[n + 9], 21, -343485551)),
            (A = r(A, c)),
            (h = r(h, d)),
            (f = r(f, u)),
            (p = r(p, l));
        return [A, h, f, p];
      }
      function d(e) {
        var t,
          r = "",
          n = 32 * e.length;
        for (t = 0; t < n; t += 8)
          r += String.fromCharCode((e[t >> 5] >>> t % 32) & 255);
        return r;
      }
      function u(e) {
        var t,
          r = [];
        for (r[(e.length >> 2) - 1] = void 0, t = 0; t < r.length; t += 1)
          r[t] = 0;
        var n = 8 * e.length;
        for (t = 0; t < n; t += 8)
          r[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
        return r;
      }
      function l(e) {
        var t,
          r,
          n = "0123456789abcdef",
          i = "";
        for (r = 0; r < e.length; r += 1)
          (t = e.charCodeAt(r)),
            (i += n.charAt((t >>> 4) & 15) + n.charAt(15 & t));
        return i;
      }
      function A(e) {
        return unescape(encodeURIComponent(e));
      }
      function h(e) {
        return (function (e) {
          return d(c(u(e), 8 * e.length));
        })(A(e));
      }
      function f(e, t) {
        return (function (e, t) {
          var r,
            n,
            i = u(e),
            o = [],
            a = [];
          for (
            o[15] = a[15] = void 0,
              i.length > 16 && (i = c(i, 8 * e.length)),
              r = 0;
            r < 16;
            r += 1
          )
            (o[r] = 909522486 ^ i[r]), (a[r] = 1549556828 ^ i[r]);
          return (
            (n = c(o.concat(u(t)), 512 + 8 * t.length)), d(c(a.concat(n), 640))
          );
        })(A(e), A(t));
      }
      function p(e, t, r) {
        return t ? (r ? f(t, e) : l(f(t, e))) : r ? h(e) : l(h(e));
      }
      e.exports ? (e.exports = p) : (t.md5 = p);
    })(X);
  })(Jn);
  var Zn = K(Jn.exports),
    Yn = { exports: {} };
  !(function (e, t) {
    var r = "__lodash_hash_undefined__",
      n = 1,
      i = 2,
      o = 1 / 0,
      a = 9007199254740991,
      s = "[object Arguments]",
      c = "[object Array]",
      d = "[object Boolean]",
      u = "[object Date]",
      l = "[object Error]",
      A = "[object Function]",
      h = "[object GeneratorFunction]",
      f = "[object Map]",
      p = "[object Number]",
      m = "[object Object]",
      g = "[object Promise]",
      v = "[object RegExp]",
      T = "[object Set]",
      b = "[object String]",
      S = "[object Symbol]",
      y = "[object WeakMap]",
      k = "[object ArrayBuffer]",
      _ = "[object DataView]",
      w = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      E = /^\w*$/,
      C = /^\./,
      I =
        /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
      P = /\\(\\)?/g,
      R = /^\[object .+?Constructor\]$/,
      M = /^(?:0|[1-9]\d*)$/,
      D = {};
    (D["[object Float32Array]"] =
      D["[object Float64Array]"] =
      D["[object Int8Array]"] =
      D["[object Int16Array]"] =
      D["[object Int32Array]"] =
      D["[object Uint8Array]"] =
      D["[object Uint8ClampedArray]"] =
      D["[object Uint16Array]"] =
      D["[object Uint32Array]"] =
        !0),
      (D[s] =
        D[c] =
        D[k] =
        D[d] =
        D[_] =
        D[u] =
        D[l] =
        D[A] =
        D[f] =
        D[p] =
        D[m] =
        D[v] =
        D[T] =
        D[b] =
        D[y] =
          !1);
    var O = "object" == typeof X && X && X.Object === Object && X,
      N = "object" == typeof self && self && self.Object === Object && self,
      x = O || N || Function("return this")(),
      L = t && !t.nodeType && t,
      B = L && e && !e.nodeType && e,
      G = B && B.exports === L && O.process,
      H = (function () {
        try {
          return G && G.binding("util");
        } catch (e) {}
      })(),
      j = H && H.isTypedArray;
    function F(e, t, r, n) {
      for (var i = -1, o = e ? e.length : 0; ++i < o; ) {
        var a = e[i];
        t(n, a, r(a), e);
      }
      return n;
    }
    function V(e, t) {
      for (var r = -1, n = e ? e.length : 0; ++r < n; )
        if (t(e[r], r, e)) return !0;
      return !1;
    }
    function U(e) {
      var t = !1;
      if (null != e && "function" != typeof e.toString)
        try {
          t = !!(e + "");
        } catch (e) {}
      return t;
    }
    function q(e) {
      var t = -1,
        r = Array(e.size);
      return (
        e.forEach(function (e, n) {
          r[++t] = [n, e];
        }),
        r
      );
    }
    function Q(e) {
      var t = -1,
        r = Array(e.size);
      return (
        e.forEach(function (e) {
          r[++t] = e;
        }),
        r
      );
    }
    var W,
      z,
      K,
      J = Array.prototype,
      Z = Function.prototype,
      Y = Object.prototype,
      $ = x["__core-js_shared__"],
      ee = (W = /[^.]+$/.exec(($ && $.keys && $.keys.IE_PROTO) || ""))
        ? "Symbol(src)_1." + W
        : "",
      te = Z.toString,
      re = Y.hasOwnProperty,
      ne = Y.toString,
      ie = RegExp(
        "^" +
          te
            .call(re)
            .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
            .replace(
              /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
              "$1.*?"
            ) +
          "$"
      ),
      oe = x.Symbol,
      ae = x.Uint8Array,
      se = Y.propertyIsEnumerable,
      ce = J.splice,
      de =
        ((z = Object.keys),
        (K = Object),
        function (e) {
          return z(K(e));
        }),
      ue = Qe(x, "DataView"),
      le = Qe(x, "Map"),
      Ae = Qe(x, "Promise"),
      he = Qe(x, "Set"),
      fe = Qe(x, "WeakMap"),
      pe = Qe(Object, "create"),
      me = $e(ue),
      ge = $e(le),
      ve = $e(Ae),
      Te = $e(he),
      be = $e(fe),
      Se = oe ? oe.prototype : void 0,
      ye = Se ? Se.valueOf : void 0,
      ke = Se ? Se.toString : void 0;
    function _e(e) {
      var t = -1,
        r = e ? e.length : 0;
      for (this.clear(); ++t < r; ) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function we(e) {
      var t = -1,
        r = e ? e.length : 0;
      for (this.clear(); ++t < r; ) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function Ee(e) {
      var t = -1,
        r = e ? e.length : 0;
      for (this.clear(); ++t < r; ) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function Ce(e) {
      var t = -1,
        r = e ? e.length : 0;
      for (this.__data__ = new Ee(); ++t < r; ) this.add(e[t]);
    }
    function Ie(e) {
      this.__data__ = new we(e);
    }
    function Pe(e, t) {
      var r =
          at(e) || ot(e)
            ? (function (e, t) {
                for (var r = -1, n = Array(e); ++r < e; ) n[r] = t(r);
                return n;
              })(e.length, String)
            : [],
        n = r.length,
        i = !!n;
      for (var o in e)
        (!t && !re.call(e, o)) ||
          (i && ("length" == o || ze(o, n))) ||
          r.push(o);
      return r;
    }
    function Re(e, t) {
      for (var r = e.length; r--; ) if (it(e[r][0], t)) return r;
      return -1;
    }
    function Me(e, t, r, n) {
      return (
        Ne(e, function (e, i, o) {
          t(n, e, r(e), o);
        }),
        n
      );
    }
    (_e.prototype.clear = function () {
      this.__data__ = pe ? pe(null) : {};
    }),
      (_e.prototype.delete = function (e) {
        return this.has(e) && delete this.__data__[e];
      }),
      (_e.prototype.get = function (e) {
        var t = this.__data__;
        if (pe) {
          var n = t[e];
          return n === r ? void 0 : n;
        }
        return re.call(t, e) ? t[e] : void 0;
      }),
      (_e.prototype.has = function (e) {
        var t = this.__data__;
        return pe ? void 0 !== t[e] : re.call(t, e);
      }),
      (_e.prototype.set = function (e, t) {
        return (this.__data__[e] = pe && void 0 === t ? r : t), this;
      }),
      (we.prototype.clear = function () {
        this.__data__ = [];
      }),
      (we.prototype.delete = function (e) {
        var t = this.__data__,
          r = Re(t, e);
        return !(r < 0) && (r == t.length - 1 ? t.pop() : ce.call(t, r, 1), !0);
      }),
      (we.prototype.get = function (e) {
        var t = this.__data__,
          r = Re(t, e);
        return r < 0 ? void 0 : t[r][1];
      }),
      (we.prototype.has = function (e) {
        return Re(this.__data__, e) > -1;
      }),
      (we.prototype.set = function (e, t) {
        var r = this.__data__,
          n = Re(r, e);
        return n < 0 ? r.push([e, t]) : (r[n][1] = t), this;
      }),
      (Ee.prototype.clear = function () {
        this.__data__ = {
          hash: new _e(),
          map: new (le || we)(),
          string: new _e(),
        };
      }),
      (Ee.prototype.delete = function (e) {
        return qe(this, e).delete(e);
      }),
      (Ee.prototype.get = function (e) {
        return qe(this, e).get(e);
      }),
      (Ee.prototype.has = function (e) {
        return qe(this, e).has(e);
      }),
      (Ee.prototype.set = function (e, t) {
        return qe(this, e).set(e, t), this;
      }),
      (Ce.prototype.add = Ce.prototype.push =
        function (e) {
          return this.__data__.set(e, r), this;
        }),
      (Ce.prototype.has = function (e) {
        return this.__data__.has(e);
      }),
      (Ie.prototype.clear = function () {
        this.__data__ = new we();
      }),
      (Ie.prototype.delete = function (e) {
        return this.__data__.delete(e);
      }),
      (Ie.prototype.get = function (e) {
        return this.__data__.get(e);
      }),
      (Ie.prototype.has = function (e) {
        return this.__data__.has(e);
      }),
      (Ie.prototype.set = function (e, t) {
        var r = this.__data__;
        if (r instanceof we) {
          var n = r.__data__;
          if (!le || n.length < 199) return n.push([e, t]), this;
          r = this.__data__ = new Ee(n);
        }
        return r.set(e, t), this;
      });
    var De,
      Oe,
      Ne =
        ((De = function (e, t) {
          return e && xe(e, t, ft);
        }),
        function (e, t) {
          if (null == e) return e;
          if (!st(e)) return De(e, t);
          for (
            var r = e.length, n = Oe ? r : -1, i = Object(e);
            (Oe ? n-- : ++n < r) && !1 !== t(i[n], n, i);

          );
          return e;
        }),
      xe = (function (e) {
        return function (t, r, n) {
          for (var i = -1, o = Object(t), a = n(t), s = a.length; s--; ) {
            var c = a[e ? s : ++i];
            if (!1 === r(o[c], c, o)) break;
          }
          return t;
        };
      })();
    function Le(e, t) {
      for (
        var r = 0, n = (t = Xe(t, e) ? [t] : Ve(t)).length;
        null != e && r < n;

      )
        e = e[Ye(t[r++])];
      return r && r == n ? e : void 0;
    }
    function Be(e, t) {
      return null != e && t in Object(e);
    }
    function Ge(e, t, r, o, a) {
      return (
        e === t ||
        (null == e || null == t || (!ut(e) && !lt(t))
          ? e != e && t != t
          : (function (e, t, r, o, a, A) {
              var h = at(e),
                g = at(t),
                y = c,
                w = c;
              h || (y = (y = We(e)) == s ? m : y);
              g || (w = (w = We(t)) == s ? m : w);
              var E = y == m && !U(e),
                C = w == m && !U(t),
                I = y == w;
              if (I && !E)
                return (
                  A || (A = new Ie()),
                  h || ht(e)
                    ? Ue(e, t, r, o, a, A)
                    : (function (e, t, r, o, a, s, c) {
                        switch (r) {
                          case _:
                            if (
                              e.byteLength != t.byteLength ||
                              e.byteOffset != t.byteOffset
                            )
                              return !1;
                            (e = e.buffer), (t = t.buffer);
                          case k:
                            return !(
                              e.byteLength != t.byteLength ||
                              !o(new ae(e), new ae(t))
                            );
                          case d:
                          case u:
                          case p:
                            return it(+e, +t);
                          case l:
                            return e.name == t.name && e.message == t.message;
                          case v:
                          case b:
                            return e == t + "";
                          case f:
                            var A = q;
                          case T:
                            var h = s & i;
                            if ((A || (A = Q), e.size != t.size && !h))
                              return !1;
                            var m = c.get(e);
                            if (m) return m == t;
                            (s |= n), c.set(e, t);
                            var g = Ue(A(e), A(t), o, a, s, c);
                            return c.delete(e), g;
                          case S:
                            if (ye) return ye.call(e) == ye.call(t);
                        }
                        return !1;
                      })(e, t, y, r, o, a, A)
                );
              if (!(a & i)) {
                var P = E && re.call(e, "__wrapped__"),
                  R = C && re.call(t, "__wrapped__");
                if (P || R) {
                  var M = P ? e.value() : e,
                    D = R ? t.value() : t;
                  return A || (A = new Ie()), r(M, D, o, a, A);
                }
              }
              if (!I) return !1;
              return (
                A || (A = new Ie()),
                (function (e, t, r, n, o, a) {
                  var s = o & i,
                    c = ft(e),
                    d = c.length,
                    u = ft(t),
                    l = u.length;
                  if (d != l && !s) return !1;
                  var A = d;
                  for (; A--; ) {
                    var h = c[A];
                    if (!(s ? h in t : re.call(t, h))) return !1;
                  }
                  var f = a.get(e);
                  if (f && a.get(t)) return f == t;
                  var p = !0;
                  a.set(e, t), a.set(t, e);
                  var m = s;
                  for (; ++A < d; ) {
                    var g = e[(h = c[A])],
                      v = t[h];
                    if (n)
                      var T = s ? n(v, g, h, t, e, a) : n(g, v, h, e, t, a);
                    if (!(void 0 === T ? g === v || r(g, v, n, o, a) : T)) {
                      p = !1;
                      break;
                    }
                    m || (m = "constructor" == h);
                  }
                  if (p && !m) {
                    var b = e.constructor,
                      S = t.constructor;
                    b == S ||
                      !("constructor" in e) ||
                      !("constructor" in t) ||
                      ("function" == typeof b &&
                        b instanceof b &&
                        "function" == typeof S &&
                        S instanceof S) ||
                      (p = !1);
                  }
                  return a.delete(e), a.delete(t), p;
                })(e, t, r, o, a, A)
              );
            })(e, t, Ge, r, o, a))
      );
    }
    function He(e) {
      return (
        !(
          !ut(e) ||
          (function (e) {
            return !!ee && ee in e;
          })(e)
        ) && (ct(e) || U(e) ? ie : R).test($e(e))
      );
    }
    function je(e) {
      return "function" == typeof e
        ? e
        : null == e
        ? pt
        : "object" == typeof e
        ? at(e)
          ? (function (e, t) {
              if (Xe(e) && Ke(t)) return Je(Ye(e), t);
              return function (r) {
                var o = (function (e, t, r) {
                  var n = null == e ? void 0 : Le(e, t);
                  return void 0 === n ? r : n;
                })(r, e);
                return void 0 === o && o === t
                  ? (function (e, t) {
                      return (
                        null != e &&
                        (function (e, t, r) {
                          t = Xe(t, e) ? [t] : Ve(t);
                          var n,
                            i = -1,
                            o = t.length;
                          for (; ++i < o; ) {
                            var a = Ye(t[i]);
                            if (!(n = null != e && r(e, a))) break;
                            e = e[a];
                          }
                          if (n) return n;
                          o = e ? e.length : 0;
                          return !!o && dt(o) && ze(a, o) && (at(e) || ot(e));
                        })(e, t, Be)
                      );
                    })(r, e)
                  : Ge(t, o, void 0, n | i);
              };
            })(e[0], e[1])
          : (function (e) {
              var t = (function (e) {
                var t = ft(e),
                  r = t.length;
                for (; r--; ) {
                  var n = t[r],
                    i = e[n];
                  t[r] = [n, i, Ke(i)];
                }
                return t;
              })(e);
              if (1 == t.length && t[0][2]) return Je(t[0][0], t[0][1]);
              return function (r) {
                return (
                  r === e ||
                  (function (e, t, r, o) {
                    var a = r.length,
                      s = a,
                      c = !o;
                    if (null == e) return !s;
                    for (e = Object(e); a--; ) {
                      var d = r[a];
                      if (c && d[2] ? d[1] !== e[d[0]] : !(d[0] in e))
                        return !1;
                    }
                    for (; ++a < s; ) {
                      var u = (d = r[a])[0],
                        l = e[u],
                        A = d[1];
                      if (c && d[2]) {
                        if (void 0 === l && !(u in e)) return !1;
                      } else {
                        var h = new Ie();
                        if (o) var f = o(l, A, u, e, t, h);
                        if (!(void 0 === f ? Ge(A, l, o, n | i, h) : f))
                          return !1;
                      }
                    }
                    return !0;
                  })(r, e, t)
                );
              };
            })(e)
        : Xe((t = e))
        ? ((r = Ye(t)),
          function (e) {
            return null == e ? void 0 : e[r];
          })
        : (function (e) {
            return function (t) {
              return Le(t, e);
            };
          })(t);
      var t, r;
    }
    function Fe(e) {
      if (
        ((r = (t = e) && t.constructor),
        (n = ("function" == typeof r && r.prototype) || Y),
        t !== n)
      )
        return de(e);
      var t,
        r,
        n,
        i = [];
      for (var o in Object(e)) re.call(e, o) && "constructor" != o && i.push(o);
      return i;
    }
    function Ve(e) {
      return at(e) ? e : Ze(e);
    }
    function Ue(e, t, r, o, a, s) {
      var c = a & i,
        d = e.length,
        u = t.length;
      if (d != u && !(c && u > d)) return !1;
      var l = s.get(e);
      if (l && s.get(t)) return l == t;
      var A = -1,
        h = !0,
        f = a & n ? new Ce() : void 0;
      for (s.set(e, t), s.set(t, e); ++A < d; ) {
        var p = e[A],
          m = t[A];
        if (o) var g = c ? o(m, p, A, t, e, s) : o(p, m, A, e, t, s);
        if (void 0 !== g) {
          if (g) continue;
          h = !1;
          break;
        }
        if (f) {
          if (
            !V(t, function (e, t) {
              if (!f.has(t) && (p === e || r(p, e, o, a, s))) return f.add(t);
            })
          ) {
            h = !1;
            break;
          }
        } else if (p !== m && !r(p, m, o, a, s)) {
          h = !1;
          break;
        }
      }
      return s.delete(e), s.delete(t), h;
    }
    function qe(e, t) {
      var r = e.__data__;
      return (function (e) {
        var t = typeof e;
        return "string" == t || "number" == t || "symbol" == t || "boolean" == t
          ? "__proto__" !== e
          : null === e;
      })(t)
        ? r["string" == typeof t ? "string" : "hash"]
        : r.map;
    }
    function Qe(e, t) {
      var r = (function (e, t) {
        return null == e ? void 0 : e[t];
      })(e, t);
      return He(r) ? r : void 0;
    }
    var We = function (e) {
      return ne.call(e);
    };
    function ze(e, t) {
      return (
        !!(t = null == t ? a : t) &&
        ("number" == typeof e || M.test(e)) &&
        e > -1 &&
        e % 1 == 0 &&
        e < t
      );
    }
    function Xe(e, t) {
      if (at(e)) return !1;
      var r = typeof e;
      return (
        !(
          "number" != r &&
          "symbol" != r &&
          "boolean" != r &&
          null != e &&
          !At(e)
        ) ||
        E.test(e) ||
        !w.test(e) ||
        (null != t && e in Object(t))
      );
    }
    function Ke(e) {
      return e == e && !ut(e);
    }
    function Je(e, t) {
      return function (r) {
        return null != r && r[e] === t && (void 0 !== t || e in Object(r));
      };
    }
    ((ue && We(new ue(new ArrayBuffer(1))) != _) ||
      (le && We(new le()) != f) ||
      (Ae && We(Ae.resolve()) != g) ||
      (he && We(new he()) != T) ||
      (fe && We(new fe()) != y)) &&
      (We = function (e) {
        var t = ne.call(e),
          r = t == m ? e.constructor : void 0,
          n = r ? $e(r) : void 0;
        if (n)
          switch (n) {
            case me:
              return _;
            case ge:
              return f;
            case ve:
              return g;
            case Te:
              return T;
            case be:
              return y;
          }
        return t;
      });
    var Ze = nt(function (e) {
      var t;
      e =
        null == (t = e)
          ? ""
          : (function (e) {
              if ("string" == typeof e) return e;
              if (At(e)) return ke ? ke.call(e) : "";
              var t = e + "";
              return "0" == t && 1 / e == -o ? "-0" : t;
            })(t);
      var r = [];
      return (
        C.test(e) && r.push(""),
        e.replace(I, function (e, t, n, i) {
          r.push(n ? i.replace(P, "$1") : t || e);
        }),
        r
      );
    });
    function Ye(e) {
      if ("string" == typeof e || At(e)) return e;
      var t = e + "";
      return "0" == t && 1 / e == -o ? "-0" : t;
    }
    function $e(e) {
      if (null != e) {
        try {
          return te.call(e);
        } catch (e) {}
        try {
          return e + "";
        } catch (e) {}
      }
      return "";
    }
    var et,
      tt,
      rt =
        ((et = function (e, t, r) {
          re.call(e, r) ? e[r].push(t) : (e[r] = [t]);
        }),
        function (e, t) {
          var r = at(e) ? F : Me,
            n = tt ? tt() : {};
          return r(e, et, je(t), n);
        });
    function nt(e, t) {
      if ("function" != typeof e || (t && "function" != typeof t))
        throw new TypeError("Expected a function");
      var r = function () {
        var n = arguments,
          i = t ? t.apply(this, n) : n[0],
          o = r.cache;
        if (o.has(i)) return o.get(i);
        var a = e.apply(this, n);
        return (r.cache = o.set(i, a)), a;
      };
      return (r.cache = new (nt.Cache || Ee)()), r;
    }
    function it(e, t) {
      return e === t || (e != e && t != t);
    }
    function ot(e) {
      return (
        (function (e) {
          return lt(e) && st(e);
        })(e) &&
        re.call(e, "callee") &&
        (!se.call(e, "callee") || ne.call(e) == s)
      );
    }
    nt.Cache = Ee;
    var at = Array.isArray;
    function st(e) {
      return null != e && dt(e.length) && !ct(e);
    }
    function ct(e) {
      var t = ut(e) ? ne.call(e) : "";
      return t == A || t == h;
    }
    function dt(e) {
      return "number" == typeof e && e > -1 && e % 1 == 0 && e <= a;
    }
    function ut(e) {
      var t = typeof e;
      return !!e && ("object" == t || "function" == t);
    }
    function lt(e) {
      return !!e && "object" == typeof e;
    }
    function At(e) {
      return "symbol" == typeof e || (lt(e) && ne.call(e) == S);
    }
    var ht = j
      ? (function (e) {
          return function (t) {
            return e(t);
          };
        })(j)
      : function (e) {
          return lt(e) && dt(e.length) && !!D[ne.call(e)];
        };
    function ft(e) {
      return st(e) ? Pe(e) : Fe(e);
    }
    function pt(e) {
      return e;
    }
    e.exports = rt;
  })(Yn, Yn.exports);
  var $n = K(Yn.exports);
  const ei = "4.3.0";
  function ti(e) {
    var t = ii([
      ["iOS", /iP(hone|od|ad)/],
      ["Android OS", /Android/],
      ["BlackBerry OS", /BlackBerry|BB10/],
      ["Windows Mobile", /IEMobile/],
      ["Amazon OS", /Kindle/],
      ["Windows 3.11", /Win16/],
      ["Windows 95", /(Windows 95)|(Win95)|(Windows_95)/],
      ["Windows 98", /(Windows 98)|(Win98)/],
      ["Windows 2000", /(Windows NT 5.0)|(Windows 2000)/],
      ["Windows XP", /(Windows NT 5.1)|(Windows XP)/],
      ["Windows Server 2003", /(Windows NT 5.2)/],
      ["Windows Vista", /(Windows NT 6.0)/],
      ["Windows 7", /(Windows NT 6.1)/],
      ["Windows 8", /(Windows NT 6.2)/],
      ["Windows 8.1", /(Windows NT 6.3)/],
      ["Windows 10", /(Windows NT 10.0)/],
      ["Windows ME", /Windows ME/],
      ["Open BSD", /OpenBSD/],
      ["Sun OS", /SunOS/],
      ["Linux", /(Linux)|(X11)/],
      ["Mac OS", /(Mac_PowerPC)|(Macintosh)/],
      ["QNX", /QNX/],
      ["BeOS", /BeOS/],
      ["OS/2", /OS\/2/],
      [
        "Search Bot",
        /(nuhk)|(Googlebot)|(Yammybot)|(Openbot)|(Slurp)|(MSNBot)|(Ask Jeeves\/Teoma)|(ia_archiver)/,
      ],
    ]).filter(function (t) {
      return t.rule && t.rule.test(e);
    })[0];
    return t ? t.name : null;
  }
  function ri() {
    return (
      "undefined" != typeof process &&
      process.version && {
        name: "node",
        version: process.version.slice(1),
        os: process.platform,
      }
    );
  }
  function ni(e) {
    var t = ii([
      ["aol", /AOLShield\/([0-9\._]+)/],
      ["edge", /Edge\/([0-9\._]+)/],
      ["yandexbrowser", /YaBrowser\/([0-9\._]+)/],
      ["vivaldi", /Vivaldi\/([0-9\.]+)/],
      ["kakaotalk", /KAKAOTALK\s([0-9\.]+)/],
      ["samsung", /SamsungBrowser\/([0-9\.]+)/],
      ["chrome", /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
      ["phantomjs", /PhantomJS\/([0-9\.]+)(:?\s|$)/],
      ["crios", /CriOS\/([0-9\.]+)(:?\s|$)/],
      ["firefox", /Firefox\/([0-9\.]+)(?:\s|$)/],
      ["fxios", /FxiOS\/([0-9\.]+)/],
      ["opera", /Opera\/([0-9\.]+)(?:\s|$)/],
      ["opera", /OPR\/([0-9\.]+)(:?\s|$)$/],
      ["ie", /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
      ["ie", /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
      ["ie", /MSIE\s(7\.0)/],
      ["bb10", /BB10;\sTouch.*Version\/([0-9\.]+)/],
      ["android", /Android\s([0-9\.]+)/],
      ["ios", /Version\/([0-9\._]+).*Mobile.*Safari.*/],
      ["safari", /Version\/([0-9\._]+).*Safari/],
      ["facebook", /FBAV\/([0-9\.]+)/],
      ["instagram", /Instagram\s([0-9\.]+)/],
      ["ios-webview", /AppleWebKit\/([0-9\.]+).*Mobile/],
    ]);
    if (!e) return null;
    var r =
      t
        .map(function (t) {
          var r = t.rule.exec(e),
            n = r && r[1].split(/[._]/).slice(0, 3);
          return (
            n && n.length < 3 && (n = n.concat(1 == n.length ? [0, 0] : [0])),
            r && { name: t.name, version: n.join(".") }
          );
        })
        .filter(Boolean)[0] || null;
    return (
      r && (r.os = ti(e)),
      /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/i.test(
        e
      ) && ((r = r || {}).bot = !0),
      r
    );
  }
  function ii(e) {
    return e.map(function (e) {
      return { name: e[0], rule: e[1] };
    });
  }
  var oi = {
      detect: function () {
        return "undefined" != typeof navigator ? ni(navigator.userAgent) : ri();
      },
      detectOS: ti,
      getNodeVersion: ri,
      parseUserAgent: ni,
    },
    ai = { exports: {} };
  !(function (e, t) {
    var r;
    (t = e.exports = Y),
      (r =
        "object" == typeof process &&
        process.env &&
        process.env.NODE_DEBUG &&
        /\bsemver\b/i.test(process.env.NODE_DEBUG)
          ? function () {
              var e = Array.prototype.slice.call(arguments, 0);
              e.unshift("SEMVER"), console.log.apply(console, e);
            }
          : function () {}),
      (t.SEMVER_SPEC_VERSION = "2.0.0");
    var n = 256,
      i = Number.MAX_SAFE_INTEGER || 9007199254740991,
      o = n - 6,
      a = (t.re = []),
      s = (t.safeRe = []),
      c = (t.src = []),
      d = 0,
      u = "[a-zA-Z0-9-]",
      l = [
        ["\\s", 1],
        ["\\d", n],
        [u, o],
      ];
    function A(e) {
      for (var t = 0; t < l.length; t++) {
        var r = l[t][0],
          n = l[t][1];
        e = e
          .split(r + "*")
          .join(r + "{0," + n + "}")
          .split(r + "+")
          .join(r + "{1," + n + "}");
      }
      return e;
    }
    var h = d++;
    c[h] = "0|[1-9]\\d*";
    var f = d++;
    c[f] = "\\d+";
    var p = d++;
    c[p] = "\\d*[a-zA-Z-]" + u + "*";
    var m = d++;
    c[m] = "(" + c[h] + ")\\.(" + c[h] + ")\\.(" + c[h] + ")";
    var g = d++;
    c[g] = "(" + c[f] + ")\\.(" + c[f] + ")\\.(" + c[f] + ")";
    var v = d++;
    c[v] = "(?:" + c[h] + "|" + c[p] + ")";
    var T = d++;
    c[T] = "(?:" + c[f] + "|" + c[p] + ")";
    var b = d++;
    c[b] = "(?:-(" + c[v] + "(?:\\." + c[v] + ")*))";
    var S = d++;
    c[S] = "(?:-?(" + c[T] + "(?:\\." + c[T] + ")*))";
    var y = d++;
    c[y] = u + "+";
    var k = d++;
    c[k] = "(?:\\+(" + c[y] + "(?:\\." + c[y] + ")*))";
    var _ = d++,
      w = "v?" + c[m] + c[b] + "?" + c[k] + "?";
    c[_] = "^" + w + "$";
    var E = "[v=\\s]*" + c[g] + c[S] + "?" + c[k] + "?",
      C = d++;
    c[C] = "^" + E + "$";
    var I = d++;
    c[I] = "((?:<|>)?=?)";
    var P = d++;
    c[P] = c[f] + "|x|X|\\*";
    var R = d++;
    c[R] = c[h] + "|x|X|\\*";
    var M = d++;
    c[M] =
      "[v=\\s]*(" +
      c[R] +
      ")(?:\\.(" +
      c[R] +
      ")(?:\\.(" +
      c[R] +
      ")(?:" +
      c[b] +
      ")?" +
      c[k] +
      "?)?)?";
    var D = d++;
    c[D] =
      "[v=\\s]*(" +
      c[P] +
      ")(?:\\.(" +
      c[P] +
      ")(?:\\.(" +
      c[P] +
      ")(?:" +
      c[S] +
      ")?" +
      c[k] +
      "?)?)?";
    var O = d++;
    c[O] = "^" + c[I] + "\\s*" + c[M] + "$";
    var N = d++;
    c[N] = "^" + c[I] + "\\s*" + c[D] + "$";
    var x = d++;
    c[x] =
      "(?:^|[^\\d])(\\d{1,16})(?:\\.(\\d{1,16}))?(?:\\.(\\d{1,16}))?(?:$|[^\\d])";
    var L = d++;
    c[L] = "(?:~>?)";
    var B = d++;
    (c[B] = "(\\s*)" + c[L] + "\\s+"),
      (a[B] = new RegExp(c[B], "g")),
      (s[B] = new RegExp(A(c[B]), "g"));
    var G = d++;
    c[G] = "^" + c[L] + c[M] + "$";
    var H = d++;
    c[H] = "^" + c[L] + c[D] + "$";
    var j = d++;
    c[j] = "(?:\\^)";
    var F = d++;
    (c[F] = "(\\s*)" + c[j] + "\\s+"),
      (a[F] = new RegExp(c[F], "g")),
      (s[F] = new RegExp(A(c[F]), "g"));
    var V = d++;
    c[V] = "^" + c[j] + c[M] + "$";
    var U = d++;
    c[U] = "^" + c[j] + c[D] + "$";
    var q = d++;
    c[q] = "^" + c[I] + "\\s*(" + E + ")$|^$";
    var Q = d++;
    c[Q] = "^" + c[I] + "\\s*(" + w + ")$|^$";
    var W = d++;
    (c[W] = "(\\s*)" + c[I] + "\\s*(" + E + "|" + c[M] + ")"),
      (a[W] = new RegExp(c[W], "g")),
      (s[W] = new RegExp(A(c[W]), "g"));
    var z = d++;
    c[z] = "^\\s*(" + c[M] + ")\\s+-\\s+(" + c[M] + ")\\s*$";
    var X = d++;
    c[X] = "^\\s*(" + c[D] + ")\\s+-\\s+(" + c[D] + ")\\s*$";
    var K = d++;
    c[K] = "(<|>)?=?\\s*\\*";
    for (var J = 0; J < 35; J++)
      r(J, c[J]),
        a[J] || ((a[J] = new RegExp(c[J])), (s[J] = new RegExp(A(c[J]))));
    function Z(e, t) {
      if (
        ((t && "object" == typeof t) ||
          (t = { loose: !!t, includePrerelease: !1 }),
        e instanceof Y)
      )
        return e;
      if ("string" != typeof e) return null;
      if (e.length > n) return null;
      if (!(t.loose ? s[C] : s[_]).test(e)) return null;
      try {
        return new Y(e, t);
      } catch (e) {
        return null;
      }
    }
    function Y(e, t) {
      if (
        ((t && "object" == typeof t) ||
          (t = { loose: !!t, includePrerelease: !1 }),
        e instanceof Y)
      ) {
        if (e.loose === t.loose) return e;
        e = e.version;
      } else if ("string" != typeof e) throw new TypeError("Invalid Version: " + e);
      if (e.length > n)
        throw new TypeError("version is longer than " + n + " characters");
      if (!(this instanceof Y)) return new Y(e, t);
      r("SemVer", e, t), (this.options = t), (this.loose = !!t.loose);
      var o = e.trim().match(t.loose ? s[C] : s[_]);
      if (!o) throw new TypeError("Invalid Version: " + e);
      if (
        ((this.raw = e),
        (this.major = +o[1]),
        (this.minor = +o[2]),
        (this.patch = +o[3]),
        this.major > i || this.major < 0)
      )
        throw new TypeError("Invalid major version");
      if (this.minor > i || this.minor < 0)
        throw new TypeError("Invalid minor version");
      if (this.patch > i || this.patch < 0)
        throw new TypeError("Invalid patch version");
      o[4]
        ? (this.prerelease = o[4].split(".").map(function (e) {
            if (/^[0-9]+$/.test(e)) {
              var t = +e;
              if (t >= 0 && t < i) return t;
            }
            return e;
          }))
        : (this.prerelease = []),
        (this.build = o[5] ? o[5].split(".") : []),
        this.format();
    }
    (t.parse = Z),
      (t.valid = function (e, t) {
        var r = Z(e, t);
        return r ? r.version : null;
      }),
      (t.clean = function (e, t) {
        var r = Z(e.trim().replace(/^[=v]+/, ""), t);
        return r ? r.version : null;
      }),
      (t.SemVer = Y),
      (Y.prototype.format = function () {
        return (
          (this.version = this.major + "." + this.minor + "." + this.patch),
          this.prerelease.length &&
            (this.version += "-" + this.prerelease.join(".")),
          this.version
        );
      }),
      (Y.prototype.toString = function () {
        return this.version;
      }),
      (Y.prototype.compare = function (e) {
        return (
          r("SemVer.compare", this.version, this.options, e),
          e instanceof Y || (e = new Y(e, this.options)),
          this.compareMain(e) || this.comparePre(e)
        );
      }),
      (Y.prototype.compareMain = function (e) {
        return (
          e instanceof Y || (e = new Y(e, this.options)),
          ee(this.major, e.major) ||
            ee(this.minor, e.minor) ||
            ee(this.patch, e.patch)
        );
      }),
      (Y.prototype.comparePre = function (e) {
        if (
          (e instanceof Y || (e = new Y(e, this.options)),
          this.prerelease.length && !e.prerelease.length)
        )
          return -1;
        if (!this.prerelease.length && e.prerelease.length) return 1;
        if (!this.prerelease.length && !e.prerelease.length) return 0;
        var t = 0;
        do {
          var n = this.prerelease[t],
            i = e.prerelease[t];
          if ((r("prerelease compare", t, n, i), void 0 === n && void 0 === i))
            return 0;
          if (void 0 === i) return 1;
          if (void 0 === n) return -1;
          if (n !== i) return ee(n, i);
        } while (++t);
      }),
      (Y.prototype.inc = function (e, t) {
        switch (e) {
          case "premajor":
            (this.prerelease.length = 0),
              (this.patch = 0),
              (this.minor = 0),
              this.major++,
              this.inc("pre", t);
            break;
          case "preminor":
            (this.prerelease.length = 0),
              (this.patch = 0),
              this.minor++,
              this.inc("pre", t);
            break;
          case "prepatch":
            (this.prerelease.length = 0),
              this.inc("patch", t),
              this.inc("pre", t);
            break;
          case "prerelease":
            0 === this.prerelease.length && this.inc("patch", t),
              this.inc("pre", t);
            break;
          case "major":
            (0 === this.minor &&
              0 === this.patch &&
              0 !== this.prerelease.length) ||
              this.major++,
              (this.minor = 0),
              (this.patch = 0),
              (this.prerelease = []);
            break;
          case "minor":
            (0 === this.patch && 0 !== this.prerelease.length) || this.minor++,
              (this.patch = 0),
              (this.prerelease = []);
            break;
          case "patch":
            0 === this.prerelease.length && this.patch++,
              (this.prerelease = []);
            break;
          case "pre":
            if (0 === this.prerelease.length) this.prerelease = [0];
            else {
              for (var r = this.prerelease.length; --r >= 0; )
                "number" == typeof this.prerelease[r] &&
                  (this.prerelease[r]++, (r = -2));
              -1 === r && this.prerelease.push(0);
            }
            t &&
              (this.prerelease[0] === t
                ? isNaN(this.prerelease[1]) && (this.prerelease = [t, 0])
                : (this.prerelease = [t, 0]));
            break;
          default:
            throw new Error("invalid increment argument: " + e);
        }
        return this.format(), (this.raw = this.version), this;
      }),
      (t.inc = function (e, t, r, n) {
        "string" == typeof r && ((n = r), (r = void 0));
        try {
          return new Y(e, r).inc(t, n).version;
        } catch (e) {
          return null;
        }
      }),
      (t.diff = function (e, t) {
        if (ie(e, t)) return null;
        var r = Z(e),
          n = Z(t),
          i = "";
        if (r.prerelease.length || n.prerelease.length) {
          i = "pre";
          var o = "prerelease";
        }
        for (var a in r)
          if (
            ("major" === a || "minor" === a || "patch" === a) &&
            r[a] !== n[a]
          )
            return i + a;
        return o;
      }),
      (t.compareIdentifiers = ee);
    var $ = /^[0-9]+$/;
    function ee(e, t) {
      var r = $.test(e),
        n = $.test(t);
      return (
        r && n && ((e = +e), (t = +t)),
        e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1
      );
    }
    function te(e, t, r) {
      return new Y(e, r).compare(new Y(t, r));
    }
    function re(e, t, r) {
      return te(e, t, r) > 0;
    }
    function ne(e, t, r) {
      return te(e, t, r) < 0;
    }
    function ie(e, t, r) {
      return 0 === te(e, t, r);
    }
    function oe(e, t, r) {
      return 0 !== te(e, t, r);
    }
    function ae(e, t, r) {
      return te(e, t, r) >= 0;
    }
    function se(e, t, r) {
      return te(e, t, r) <= 0;
    }
    function ce(e, t, r, n) {
      switch (t) {
        case "===":
          return (
            "object" == typeof e && (e = e.version),
            "object" == typeof r && (r = r.version),
            e === r
          );
        case "!==":
          return (
            "object" == typeof e && (e = e.version),
            "object" == typeof r && (r = r.version),
            e !== r
          );
        case "":
        case "=":
        case "==":
          return ie(e, r, n);
        case "!=":
          return oe(e, r, n);
        case ">":
          return re(e, r, n);
        case ">=":
          return ae(e, r, n);
        case "<":
          return ne(e, r, n);
        case "<=":
          return se(e, r, n);
        default:
          throw new TypeError("Invalid operator: " + t);
      }
    }
    function de(e, t) {
      if (
        ((t && "object" == typeof t) ||
          (t = { loose: !!t, includePrerelease: !1 }),
        e instanceof de)
      ) {
        if (e.loose === !!t.loose) return e;
        e = e.value;
      }
      if (!(this instanceof de)) return new de(e, t);
      (e = e.trim().split(/\s+/).join(" ")),
        r("comparator", e, t),
        (this.options = t),
        (this.loose = !!t.loose),
        this.parse(e),
        this.semver === ue
          ? (this.value = "")
          : (this.value = this.operator + this.semver.version),
        r("comp", this);
    }
    (t.rcompareIdentifiers = function (e, t) {
      return ee(t, e);
    }),
      (t.major = function (e, t) {
        return new Y(e, t).major;
      }),
      (t.minor = function (e, t) {
        return new Y(e, t).minor;
      }),
      (t.patch = function (e, t) {
        return new Y(e, t).patch;
      }),
      (t.compare = te),
      (t.compareLoose = function (e, t) {
        return te(e, t, !0);
      }),
      (t.rcompare = function (e, t, r) {
        return te(t, e, r);
      }),
      (t.sort = function (e, r) {
        return e.sort(function (e, n) {
          return t.compare(e, n, r);
        });
      }),
      (t.rsort = function (e, r) {
        return e.sort(function (e, n) {
          return t.rcompare(e, n, r);
        });
      }),
      (t.gt = re),
      (t.lt = ne),
      (t.eq = ie),
      (t.neq = oe),
      (t.gte = ae),
      (t.lte = se),
      (t.cmp = ce),
      (t.Comparator = de);
    var ue = {};
    function le(e, t) {
      if (
        ((t && "object" == typeof t) ||
          (t = { loose: !!t, includePrerelease: !1 }),
        e instanceof le)
      )
        return e.loose === !!t.loose &&
          e.includePrerelease === !!t.includePrerelease
          ? e
          : new le(e.raw, t);
      if (e instanceof de) return new le(e.value, t);
      if (!(this instanceof le)) return new le(e, t);
      if (
        ((this.options = t),
        (this.loose = !!t.loose),
        (this.includePrerelease = !!t.includePrerelease),
        (this.raw = e.trim().split(/\s+/).join(" ")),
        (this.set = this.raw
          .split("||")
          .map(function (e) {
            return this.parseRange(e.trim());
          }, this)
          .filter(function (e) {
            return e.length;
          })),
        !this.set.length)
      )
        throw new TypeError("Invalid SemVer Range: " + this.raw);
      this.format();
    }
    function Ae(e) {
      return !e || "x" === e.toLowerCase() || "*" === e;
    }
    function he(e, t, r, n, i, o, a, s, c, d, u, l, A) {
      return (
        (t = Ae(r)
          ? ""
          : Ae(n)
          ? ">=" + r + ".0.0"
          : Ae(i)
          ? ">=" + r + "." + n + ".0"
          : ">=" + t) +
        " " +
        (s = Ae(c)
          ? ""
          : Ae(d)
          ? "<" + (+c + 1) + ".0.0"
          : Ae(u)
          ? "<" + c + "." + (+d + 1) + ".0"
          : l
          ? "<=" + c + "." + d + "." + u + "-" + l
          : "<=" + s)
      ).trim();
    }
    function fe(e, t, n) {
      for (var i = 0; i < e.length; i++) if (!e[i].test(t)) return !1;
      if (t.prerelease.length && !n.includePrerelease) {
        for (i = 0; i < e.length; i++)
          if (
            (r(e[i].semver),
            e[i].semver !== ue && e[i].semver.prerelease.length > 0)
          ) {
            var o = e[i].semver;
            if (
              o.major === t.major &&
              o.minor === t.minor &&
              o.patch === t.patch
            )
              return !0;
          }
        return !1;
      }
      return !0;
    }
    function pe(e, t, r) {
      try {
        t = new le(t, r);
      } catch (e) {
        return !1;
      }
      return t.test(e);
    }
    function me(e, t, r, n) {
      var i, o, a, s, c;
      switch (((e = new Y(e, n)), (t = new le(t, n)), r)) {
        case ">":
          (i = re), (o = se), (a = ne), (s = ">"), (c = ">=");
          break;
        case "<":
          (i = ne), (o = ae), (a = re), (s = "<"), (c = "<=");
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (pe(e, t, n)) return !1;
      for (var d = 0; d < t.set.length; ++d) {
        var u = t.set[d],
          l = null,
          A = null;
        if (
          (u.forEach(function (e) {
            e.semver === ue && (e = new de(">=0.0.0")),
              (l = l || e),
              (A = A || e),
              i(e.semver, l.semver, n)
                ? (l = e)
                : a(e.semver, A.semver, n) && (A = e);
          }),
          l.operator === s || l.operator === c)
        )
          return !1;
        if ((!A.operator || A.operator === s) && o(e, A.semver)) return !1;
        if (A.operator === c && a(e, A.semver)) return !1;
      }
      return !0;
    }
    (de.prototype.parse = function (e) {
      var t = this.options.loose ? s[q] : s[Q],
        r = e.match(t);
      if (!r) throw new TypeError("Invalid comparator: " + e);
      (this.operator = r[1]),
        "=" === this.operator && (this.operator = ""),
        r[2]
          ? (this.semver = new Y(r[2], this.options.loose))
          : (this.semver = ue);
    }),
      (de.prototype.toString = function () {
        return this.value;
      }),
      (de.prototype.test = function (e) {
        return (
          r("Comparator.test", e, this.options.loose),
          this.semver === ue ||
            ("string" == typeof e && (e = new Y(e, this.options)),
            ce(e, this.operator, this.semver, this.options))
        );
      }),
      (de.prototype.intersects = function (e, t) {
        if (!(e instanceof de)) throw new TypeError("a Comparator is required");
        var r;
        if (
          ((t && "object" == typeof t) ||
            (t = { loose: !!t, includePrerelease: !1 }),
          "" === this.operator)
        )
          return (r = new le(e.value, t)), pe(this.value, r, t);
        if ("" === e.operator)
          return (r = new le(this.value, t)), pe(e.semver, r, t);
        var n = !(
            (">=" !== this.operator && ">" !== this.operator) ||
            (">=" !== e.operator && ">" !== e.operator)
          ),
          i = !(
            ("<=" !== this.operator && "<" !== this.operator) ||
            ("<=" !== e.operator && "<" !== e.operator)
          ),
          o = this.semver.version === e.semver.version,
          a = !(
            (">=" !== this.operator && "<=" !== this.operator) ||
            (">=" !== e.operator && "<=" !== e.operator)
          ),
          s =
            ce(this.semver, "<", e.semver, t) &&
            (">=" === this.operator || ">" === this.operator) &&
            ("<=" === e.operator || "<" === e.operator),
          c =
            ce(this.semver, ">", e.semver, t) &&
            ("<=" === this.operator || "<" === this.operator) &&
            (">=" === e.operator || ">" === e.operator);
        return n || i || (o && a) || s || c;
      }),
      (t.Range = le),
      (le.prototype.format = function () {
        return (
          (this.range = this.set
            .map(function (e) {
              return e.join(" ").trim();
            })
            .join("||")
            .trim()),
          this.range
        );
      }),
      (le.prototype.toString = function () {
        return this.range;
      }),
      (le.prototype.parseRange = function (e) {
        var t = this.options.loose,
          n = t ? s[X] : s[z];
        (e = e.replace(n, he)),
          r("hyphen replace", e),
          (e = e.replace(s[W], "$1$2$3")),
          r("comparator trim", e, s[W]),
          (e = (e = e.replace(s[B], "$1~")).replace(s[F], "$1^"));
        var i = t ? s[q] : s[Q],
          o = e
            .split(" ")
            .map(function (e) {
              return (function (e, t) {
                return (
                  r("comp", e, t),
                  (e = (function (e, t) {
                    return e
                      .trim()
                      .split(/\s+/)
                      .map(function (e) {
                        return (function (e, t) {
                          r("caret", e, t);
                          var n = t.loose ? s[U] : s[V];
                          return e.replace(n, function (t, n, i, o, a) {
                            var s;
                            return (
                              r("caret", e, t, n, i, o, a),
                              Ae(n)
                                ? (s = "")
                                : Ae(i)
                                ? (s = ">=" + n + ".0.0 <" + (+n + 1) + ".0.0")
                                : Ae(o)
                                ? (s =
                                    "0" === n
                                      ? ">=" +
                                        n +
                                        "." +
                                        i +
                                        ".0 <" +
                                        n +
                                        "." +
                                        (+i + 1) +
                                        ".0"
                                      : ">=" +
                                        n +
                                        "." +
                                        i +
                                        ".0 <" +
                                        (+n + 1) +
                                        ".0.0")
                                : a
                                ? (r("replaceCaret pr", a),
                                  (s =
                                    "0" === n
                                      ? "0" === i
                                        ? ">=" +
                                          n +
                                          "." +
                                          i +
                                          "." +
                                          o +
                                          "-" +
                                          a +
                                          " <" +
                                          n +
                                          "." +
                                          i +
                                          "." +
                                          (+o + 1)
                                        : ">=" +
                                          n +
                                          "." +
                                          i +
                                          "." +
                                          o +
                                          "-" +
                                          a +
                                          " <" +
                                          n +
                                          "." +
                                          (+i + 1) +
                                          ".0"
                                      : ">=" +
                                        n +
                                        "." +
                                        i +
                                        "." +
                                        o +
                                        "-" +
                                        a +
                                        " <" +
                                        (+n + 1) +
                                        ".0.0"))
                                : (r("no pr"),
                                  (s =
                                    "0" === n
                                      ? "0" === i
                                        ? ">=" +
                                          n +
                                          "." +
                                          i +
                                          "." +
                                          o +
                                          " <" +
                                          n +
                                          "." +
                                          i +
                                          "." +
                                          (+o + 1)
                                        : ">=" +
                                          n +
                                          "." +
                                          i +
                                          "." +
                                          o +
                                          " <" +
                                          n +
                                          "." +
                                          (+i + 1) +
                                          ".0"
                                      : ">=" +
                                        n +
                                        "." +
                                        i +
                                        "." +
                                        o +
                                        " <" +
                                        (+n + 1) +
                                        ".0.0")),
                              r("caret return", s),
                              s
                            );
                          });
                        })(e, t);
                      })
                      .join(" ");
                  })(e, t)),
                  r("caret", e),
                  (e = (function (e, t) {
                    return e
                      .trim()
                      .split(/\s+/)
                      .map(function (e) {
                        return (function (e, t) {
                          var n = t.loose ? s[H] : s[G];
                          return e.replace(n, function (t, n, i, o, a) {
                            var s;
                            return (
                              r("tilde", e, t, n, i, o, a),
                              Ae(n)
                                ? (s = "")
                                : Ae(i)
                                ? (s = ">=" + n + ".0.0 <" + (+n + 1) + ".0.0")
                                : Ae(o)
                                ? (s =
                                    ">=" +
                                    n +
                                    "." +
                                    i +
                                    ".0 <" +
                                    n +
                                    "." +
                                    (+i + 1) +
                                    ".0")
                                : a
                                ? (r("replaceTilde pr", a),
                                  (s =
                                    ">=" +
                                    n +
                                    "." +
                                    i +
                                    "." +
                                    o +
                                    "-" +
                                    a +
                                    " <" +
                                    n +
                                    "." +
                                    (+i + 1) +
                                    ".0"))
                                : (s =
                                    ">=" +
                                    n +
                                    "." +
                                    i +
                                    "." +
                                    o +
                                    " <" +
                                    n +
                                    "." +
                                    (+i + 1) +
                                    ".0"),
                              r("tilde return", s),
                              s
                            );
                          });
                        })(e, t);
                      })
                      .join(" ");
                  })(e, t)),
                  r("tildes", e),
                  (e = (function (e, t) {
                    return (
                      r("replaceXRanges", e, t),
                      e
                        .split(/\s+/)
                        .map(function (e) {
                          return (function (e, t) {
                            e = e.trim();
                            var n = t.loose ? s[N] : s[O];
                            return e.replace(n, function (t, n, i, o, a, s) {
                              r("xRange", e, t, n, i, o, a, s);
                              var c = Ae(i),
                                d = c || Ae(o),
                                u = d || Ae(a);
                              return (
                                "=" === n && u && (n = ""),
                                c
                                  ? (t =
                                      ">" === n || "<" === n ? "<0.0.0" : "*")
                                  : n && u
                                  ? (d && (o = 0),
                                    (a = 0),
                                    ">" === n
                                      ? ((n = ">="),
                                        d
                                          ? ((i = +i + 1), (o = 0), (a = 0))
                                          : ((o = +o + 1), (a = 0)))
                                      : "<=" === n &&
                                        ((n = "<"),
                                        d ? (i = +i + 1) : (o = +o + 1)),
                                    (t = n + i + "." + o + "." + a))
                                  : d
                                  ? (t =
                                      ">=" + i + ".0.0 <" + (+i + 1) + ".0.0")
                                  : u &&
                                    (t =
                                      ">=" +
                                      i +
                                      "." +
                                      o +
                                      ".0 <" +
                                      i +
                                      "." +
                                      (+o + 1) +
                                      ".0"),
                                r("xRange return", t),
                                t
                              );
                            });
                          })(e, t);
                        })
                        .join(" ")
                    );
                  })(e, t)),
                  r("xrange", e),
                  (e = (function (e, t) {
                    return r("replaceStars", e, t), e.trim().replace(s[K], "");
                  })(e, t)),
                  r("stars", e),
                  e
                );
              })(e, this.options);
            }, this)
            .join(" ")
            .split(/\s+/);
        return (
          this.options.loose &&
            (o = o.filter(function (e) {
              return !!e.match(i);
            })),
          (o = o.map(function (e) {
            return new de(e, this.options);
          }, this))
        );
      }),
      (le.prototype.intersects = function (e, t) {
        if (!(e instanceof le)) throw new TypeError("a Range is required");
        return this.set.some(function (r) {
          return r.every(function (r) {
            return e.set.some(function (e) {
              return e.every(function (e) {
                return r.intersects(e, t);
              });
            });
          });
        });
      }),
      (t.toComparators = function (e, t) {
        return new le(e, t).set.map(function (e) {
          return e
            .map(function (e) {
              return e.value;
            })
            .join(" ")
            .trim()
            .split(" ");
        });
      }),
      (le.prototype.test = function (e) {
        if (!e) return !1;
        "string" == typeof e && (e = new Y(e, this.options));
        for (var t = 0; t < this.set.length; t++)
          if (fe(this.set[t], e, this.options)) return !0;
        return !1;
      }),
      (t.satisfies = pe),
      (t.maxSatisfying = function (e, t, r) {
        var n = null,
          i = null;
        try {
          var o = new le(t, r);
        } catch (e) {
          return null;
        }
        return (
          e.forEach(function (e) {
            o.test(e) &&
              ((n && -1 !== i.compare(e)) || (i = new Y((n = e), r)));
          }),
          n
        );
      }),
      (t.minSatisfying = function (e, t, r) {
        var n = null,
          i = null;
        try {
          var o = new le(t, r);
        } catch (e) {
          return null;
        }
        return (
          e.forEach(function (e) {
            o.test(e) && ((n && 1 !== i.compare(e)) || (i = new Y((n = e), r)));
          }),
          n
        );
      }),
      (t.minVersion = function (e, t) {
        e = new le(e, t);
        var r = new Y("0.0.0");
        if (e.test(r)) return r;
        if (((r = new Y("0.0.0-0")), e.test(r))) return r;
        r = null;
        for (var n = 0; n < e.set.length; ++n) {
          e.set[n].forEach(function (e) {
            var t = new Y(e.semver.version);
            switch (e.operator) {
              case ">":
                0 === t.prerelease.length ? t.patch++ : t.prerelease.push(0),
                  (t.raw = t.format());
              case "":
              case ">=":
                (r && !re(r, t)) || (r = t);
                break;
              case "<":
              case "<=":
                break;
              default:
                throw new Error("Unexpected operation: " + e.operator);
            }
          });
        }
        if (r && e.test(r)) return r;
        return null;
      }),
      (t.validRange = function (e, t) {
        try {
          return new le(e, t).range || "*";
        } catch (e) {
          return null;
        }
      }),
      (t.ltr = function (e, t, r) {
        return me(e, t, "<", r);
      }),
      (t.gtr = function (e, t, r) {
        return me(e, t, ">", r);
      }),
      (t.outside = me),
      (t.prerelease = function (e, t) {
        var r = Z(e, t);
        return r && r.prerelease.length ? r.prerelease : null;
      }),
      (t.intersects = function (e, t, r) {
        return (e = new le(e, r)), (t = new le(t, r)), e.intersects(t);
      }),
      (t.coerce = function (e) {
        if (e instanceof Y) return e;
        if ("string" != typeof e) return null;
        var t = e.match(s[x]);
        if (null == t) return null;
        return Z(t[1] + "." + (t[2] || "0") + "." + (t[3] || "0"));
      });
  })(ai, ai.exports);
  var si = ai.exports,
    ci = { exports: {} };
  !(function (e) {
    /*!mobile-detect v1.4.5 2021-03-13*/
    /*!@license Copyright 2013, Heinrich Goebl, License: MIT, see https://github.com/hgoebl/mobile-detect.js*/
    !(function (e, t) {
      e(function () {
        var e,
          r = {
            mobileDetectRules: {
              phones: {
                iPhone: "\\biPhone\\b|\\biPod\\b",
                BlackBerry:
                  "BlackBerry|\\bBB10\\b|rim[0-9]+|\\b(BBA100|BBB100|BBD100|BBE100|BBF100|STH100)\\b-[0-9]+",
                Pixel: "; \\bPixel\\b",
                HTC: "HTC|HTC.*(Sensation|Evo|Vision|Explorer|6800|8100|8900|A7272|S510e|C110e|Legend|Desire|T8282)|APX515CKT|Qtek9090|APA9292KT|HD_mini|Sensation.*Z710e|PG86100|Z715e|Desire.*(A8181|HD)|ADR6200|ADR6400L|ADR6425|001HT|Inspire 4G|Android.*\\bEVO\\b|T-Mobile G1|Z520m|Android [0-9.]+; Pixel",
                Nexus:
                  "Nexus One|Nexus S|Galaxy.*Nexus|Android.*Nexus.*Mobile|Nexus 4|Nexus 5|Nexus 5X|Nexus 6",
                Dell: "Dell[;]? (Streak|Aero|Venue|Venue Pro|Flash|Smoke|Mini 3iX)|XCD28|XCD35|\\b001DL\\b|\\b101DL\\b|\\bGS01\\b",
                Motorola:
                  "Motorola|DROIDX|DROID BIONIC|\\bDroid\\b.*Build|Android.*Xoom|HRI39|MOT-|A1260|A1680|A555|A853|A855|A953|A955|A956|Motorola.*ELECTRIFY|Motorola.*i1|i867|i940|MB200|MB300|MB501|MB502|MB508|MB511|MB520|MB525|MB526|MB611|MB612|MB632|MB810|MB855|MB860|MB861|MB865|MB870|ME501|ME502|ME511|ME525|ME600|ME632|ME722|ME811|ME860|ME863|ME865|MT620|MT710|MT716|MT720|MT810|MT870|MT917|Motorola.*TITANIUM|WX435|WX445|XT300|XT301|XT311|XT316|XT317|XT319|XT320|XT390|XT502|XT530|XT531|XT532|XT535|XT603|XT610|XT611|XT615|XT681|XT701|XT702|XT711|XT720|XT800|XT806|XT860|XT862|XT875|XT882|XT883|XT894|XT901|XT907|XT909|XT910|XT912|XT928|XT926|XT915|XT919|XT925|XT1021|\\bMoto E\\b|XT1068|XT1092|XT1052",
                Samsung:
                  "\\bSamsung\\b|SM-G950F|SM-G955F|SM-G9250|GT-19300|SGH-I337|BGT-S5230|GT-B2100|GT-B2700|GT-B2710|GT-B3210|GT-B3310|GT-B3410|GT-B3730|GT-B3740|GT-B5510|GT-B5512|GT-B5722|GT-B6520|GT-B7300|GT-B7320|GT-B7330|GT-B7350|GT-B7510|GT-B7722|GT-B7800|GT-C3010|GT-C3011|GT-C3060|GT-C3200|GT-C3212|GT-C3212I|GT-C3262|GT-C3222|GT-C3300|GT-C3300K|GT-C3303|GT-C3303K|GT-C3310|GT-C3322|GT-C3330|GT-C3350|GT-C3500|GT-C3510|GT-C3530|GT-C3630|GT-C3780|GT-C5010|GT-C5212|GT-C6620|GT-C6625|GT-C6712|GT-E1050|GT-E1070|GT-E1075|GT-E1080|GT-E1081|GT-E1085|GT-E1087|GT-E1100|GT-E1107|GT-E1110|GT-E1120|GT-E1125|GT-E1130|GT-E1160|GT-E1170|GT-E1175|GT-E1180|GT-E1182|GT-E1200|GT-E1210|GT-E1225|GT-E1230|GT-E1390|GT-E2100|GT-E2120|GT-E2121|GT-E2152|GT-E2220|GT-E2222|GT-E2230|GT-E2232|GT-E2250|GT-E2370|GT-E2550|GT-E2652|GT-E3210|GT-E3213|GT-I5500|GT-I5503|GT-I5700|GT-I5800|GT-I5801|GT-I6410|GT-I6420|GT-I7110|GT-I7410|GT-I7500|GT-I8000|GT-I8150|GT-I8160|GT-I8190|GT-I8320|GT-I8330|GT-I8350|GT-I8530|GT-I8700|GT-I8703|GT-I8910|GT-I9000|GT-I9001|GT-I9003|GT-I9010|GT-I9020|GT-I9023|GT-I9070|GT-I9082|GT-I9100|GT-I9103|GT-I9220|GT-I9250|GT-I9300|GT-I9305|GT-I9500|GT-I9505|GT-M3510|GT-M5650|GT-M7500|GT-M7600|GT-M7603|GT-M8800|GT-M8910|GT-N7000|GT-S3110|GT-S3310|GT-S3350|GT-S3353|GT-S3370|GT-S3650|GT-S3653|GT-S3770|GT-S3850|GT-S5210|GT-S5220|GT-S5229|GT-S5230|GT-S5233|GT-S5250|GT-S5253|GT-S5260|GT-S5263|GT-S5270|GT-S5300|GT-S5330|GT-S5350|GT-S5360|GT-S5363|GT-S5369|GT-S5380|GT-S5380D|GT-S5560|GT-S5570|GT-S5600|GT-S5603|GT-S5610|GT-S5620|GT-S5660|GT-S5670|GT-S5690|GT-S5750|GT-S5780|GT-S5830|GT-S5839|GT-S6102|GT-S6500|GT-S7070|GT-S7200|GT-S7220|GT-S7230|GT-S7233|GT-S7250|GT-S7500|GT-S7530|GT-S7550|GT-S7562|GT-S7710|GT-S8000|GT-S8003|GT-S8500|GT-S8530|GT-S8600|SCH-A310|SCH-A530|SCH-A570|SCH-A610|SCH-A630|SCH-A650|SCH-A790|SCH-A795|SCH-A850|SCH-A870|SCH-A890|SCH-A930|SCH-A950|SCH-A970|SCH-A990|SCH-I100|SCH-I110|SCH-I400|SCH-I405|SCH-I500|SCH-I510|SCH-I515|SCH-I600|SCH-I730|SCH-I760|SCH-I770|SCH-I830|SCH-I910|SCH-I920|SCH-I959|SCH-LC11|SCH-N150|SCH-N300|SCH-R100|SCH-R300|SCH-R351|SCH-R400|SCH-R410|SCH-T300|SCH-U310|SCH-U320|SCH-U350|SCH-U360|SCH-U365|SCH-U370|SCH-U380|SCH-U410|SCH-U430|SCH-U450|SCH-U460|SCH-U470|SCH-U490|SCH-U540|SCH-U550|SCH-U620|SCH-U640|SCH-U650|SCH-U660|SCH-U700|SCH-U740|SCH-U750|SCH-U810|SCH-U820|SCH-U900|SCH-U940|SCH-U960|SCS-26UC|SGH-A107|SGH-A117|SGH-A127|SGH-A137|SGH-A157|SGH-A167|SGH-A177|SGH-A187|SGH-A197|SGH-A227|SGH-A237|SGH-A257|SGH-A437|SGH-A517|SGH-A597|SGH-A637|SGH-A657|SGH-A667|SGH-A687|SGH-A697|SGH-A707|SGH-A717|SGH-A727|SGH-A737|SGH-A747|SGH-A767|SGH-A777|SGH-A797|SGH-A817|SGH-A827|SGH-A837|SGH-A847|SGH-A867|SGH-A877|SGH-A887|SGH-A897|SGH-A927|SGH-B100|SGH-B130|SGH-B200|SGH-B220|SGH-C100|SGH-C110|SGH-C120|SGH-C130|SGH-C140|SGH-C160|SGH-C170|SGH-C180|SGH-C200|SGH-C207|SGH-C210|SGH-C225|SGH-C230|SGH-C417|SGH-C450|SGH-D307|SGH-D347|SGH-D357|SGH-D407|SGH-D415|SGH-D780|SGH-D807|SGH-D980|SGH-E105|SGH-E200|SGH-E315|SGH-E316|SGH-E317|SGH-E335|SGH-E590|SGH-E635|SGH-E715|SGH-E890|SGH-F300|SGH-F480|SGH-I200|SGH-I300|SGH-I320|SGH-I550|SGH-I577|SGH-I600|SGH-I607|SGH-I617|SGH-I627|SGH-I637|SGH-I677|SGH-I700|SGH-I717|SGH-I727|SGH-i747M|SGH-I777|SGH-I780|SGH-I827|SGH-I847|SGH-I857|SGH-I896|SGH-I897|SGH-I900|SGH-I907|SGH-I917|SGH-I927|SGH-I937|SGH-I997|SGH-J150|SGH-J200|SGH-L170|SGH-L700|SGH-M110|SGH-M150|SGH-M200|SGH-N105|SGH-N500|SGH-N600|SGH-N620|SGH-N625|SGH-N700|SGH-N710|SGH-P107|SGH-P207|SGH-P300|SGH-P310|SGH-P520|SGH-P735|SGH-P777|SGH-Q105|SGH-R210|SGH-R220|SGH-R225|SGH-S105|SGH-S307|SGH-T109|SGH-T119|SGH-T139|SGH-T209|SGH-T219|SGH-T229|SGH-T239|SGH-T249|SGH-T259|SGH-T309|SGH-T319|SGH-T329|SGH-T339|SGH-T349|SGH-T359|SGH-T369|SGH-T379|SGH-T409|SGH-T429|SGH-T439|SGH-T459|SGH-T469|SGH-T479|SGH-T499|SGH-T509|SGH-T519|SGH-T539|SGH-T559|SGH-T589|SGH-T609|SGH-T619|SGH-T629|SGH-T639|SGH-T659|SGH-T669|SGH-T679|SGH-T709|SGH-T719|SGH-T729|SGH-T739|SGH-T746|SGH-T749|SGH-T759|SGH-T769|SGH-T809|SGH-T819|SGH-T839|SGH-T919|SGH-T929|SGH-T939|SGH-T959|SGH-T989|SGH-U100|SGH-U200|SGH-U800|SGH-V205|SGH-V206|SGH-X100|SGH-X105|SGH-X120|SGH-X140|SGH-X426|SGH-X427|SGH-X475|SGH-X495|SGH-X497|SGH-X507|SGH-X600|SGH-X610|SGH-X620|SGH-X630|SGH-X700|SGH-X820|SGH-X890|SGH-Z130|SGH-Z150|SGH-Z170|SGH-ZX10|SGH-ZX20|SHW-M110|SPH-A120|SPH-A400|SPH-A420|SPH-A460|SPH-A500|SPH-A560|SPH-A600|SPH-A620|SPH-A660|SPH-A700|SPH-A740|SPH-A760|SPH-A790|SPH-A800|SPH-A820|SPH-A840|SPH-A880|SPH-A900|SPH-A940|SPH-A960|SPH-D600|SPH-D700|SPH-D710|SPH-D720|SPH-I300|SPH-I325|SPH-I330|SPH-I350|SPH-I500|SPH-I600|SPH-I700|SPH-L700|SPH-M100|SPH-M220|SPH-M240|SPH-M300|SPH-M305|SPH-M320|SPH-M330|SPH-M350|SPH-M360|SPH-M370|SPH-M380|SPH-M510|SPH-M540|SPH-M550|SPH-M560|SPH-M570|SPH-M580|SPH-M610|SPH-M620|SPH-M630|SPH-M800|SPH-M810|SPH-M850|SPH-M900|SPH-M910|SPH-M920|SPH-M930|SPH-N100|SPH-N200|SPH-N240|SPH-N300|SPH-N400|SPH-Z400|SWC-E100|SCH-i909|GT-N7100|GT-N7105|SCH-I535|SM-N900A|SGH-I317|SGH-T999L|GT-S5360B|GT-I8262|GT-S6802|GT-S6312|GT-S6310|GT-S5312|GT-S5310|GT-I9105|GT-I8510|GT-S6790N|SM-G7105|SM-N9005|GT-S5301|GT-I9295|GT-I9195|SM-C101|GT-S7392|GT-S7560|GT-B7610|GT-I5510|GT-S7582|GT-S7530E|GT-I8750|SM-G9006V|SM-G9008V|SM-G9009D|SM-G900A|SM-G900D|SM-G900F|SM-G900H|SM-G900I|SM-G900J|SM-G900K|SM-G900L|SM-G900M|SM-G900P|SM-G900R4|SM-G900S|SM-G900T|SM-G900V|SM-G900W8|SHV-E160K|SCH-P709|SCH-P729|SM-T2558|GT-I9205|SM-G9350|SM-J120F|SM-G920F|SM-G920V|SM-G930F|SM-N910C|SM-A310F|GT-I9190|SM-J500FN|SM-G903F|SM-J330F|SM-G610F|SM-G981B|SM-G892A|SM-A530F",
                LG: "\\bLG\\b;|LG[- ]?(C800|C900|E400|E610|E900|E-900|F160|F180K|F180L|F180S|730|855|L160|LS740|LS840|LS970|LU6200|MS690|MS695|MS770|MS840|MS870|MS910|P500|P700|P705|VM696|AS680|AS695|AX840|C729|E970|GS505|272|C395|E739BK|E960|L55C|L75C|LS696|LS860|P769BK|P350|P500|P509|P870|UN272|US730|VS840|VS950|LN272|LN510|LS670|LS855|LW690|MN270|MN510|P509|P769|P930|UN200|UN270|UN510|UN610|US670|US740|US760|UX265|UX840|VN271|VN530|VS660|VS700|VS740|VS750|VS910|VS920|VS930|VX9200|VX11000|AX840A|LW770|P506|P925|P999|E612|D955|D802|MS323|M257)|LM-G710",
                Sony: "SonyST|SonyLT|SonyEricsson|SonyEricssonLT15iv|LT18i|E10i|LT28h|LT26w|SonyEricssonMT27i|C5303|C6902|C6903|C6906|C6943|D2533|SOV34|601SO|F8332",
                Asus: "Asus.*Galaxy|PadFone.*Mobile",
                Xiaomi:
                  "^(?!.*\\bx11\\b).*xiaomi.*$|POCOPHONE F1|MI 8|Redmi Note 9S|Redmi Note 5A Prime|N2G47H|M2001J2G|M2001J2I|M1805E10A|M2004J11G|M1902F1G|M2002J9G|M2004J19G|M2003J6A1G",
                NokiaLumia: "Lumia [0-9]{3,4}",
                Micromax:
                  "Micromax.*\\b(A210|A92|A88|A72|A111|A110Q|A115|A116|A110|A90S|A26|A51|A35|A54|A25|A27|A89|A68|A65|A57|A90)\\b",
                Palm: "PalmSource|Palm",
                Vertu:
                  "Vertu|Vertu.*Ltd|Vertu.*Ascent|Vertu.*Ayxta|Vertu.*Constellation(F|Quest)?|Vertu.*Monika|Vertu.*Signature",
                Pantech:
                  "PANTECH|IM-A850S|IM-A840S|IM-A830L|IM-A830K|IM-A830S|IM-A820L|IM-A810K|IM-A810S|IM-A800S|IM-T100K|IM-A725L|IM-A780L|IM-A775C|IM-A770K|IM-A760S|IM-A750K|IM-A740S|IM-A730S|IM-A720L|IM-A710K|IM-A690L|IM-A690S|IM-A650S|IM-A630K|IM-A600S|VEGA PTL21|PT003|P8010|ADR910L|P6030|P6020|P9070|P4100|P9060|P5000|CDM8992|TXT8045|ADR8995|IS11PT|P2030|P6010|P8000|PT002|IS06|CDM8999|P9050|PT001|TXT8040|P2020|P9020|P2000|P7040|P7000|C790",
                Fly: "IQ230|IQ444|IQ450|IQ440|IQ442|IQ441|IQ245|IQ256|IQ236|IQ255|IQ235|IQ245|IQ275|IQ240|IQ285|IQ280|IQ270|IQ260|IQ250",
                Wiko: "KITE 4G|HIGHWAY|GETAWAY|STAIRWAY|DARKSIDE|DARKFULL|DARKNIGHT|DARKMOON|SLIDE|WAX 4G|RAINBOW|BLOOM|SUNSET|GOA(?!nna)|LENNY|BARRY|IGGY|OZZY|CINK FIVE|CINK PEAX|CINK PEAX 2|CINK SLIM|CINK SLIM 2|CINK +|CINK KING|CINK PEAX|CINK SLIM|SUBLIM",
                iMobile: "i-mobile (IQ|i-STYLE|idea|ZAA|Hitz)",
                SimValley:
                  "\\b(SP-80|XT-930|SX-340|XT-930|SX-310|SP-360|SP60|SPT-800|SP-120|SPT-800|SP-140|SPX-5|SPX-8|SP-100|SPX-8|SPX-12)\\b",
                Wolfgang:
                  "AT-B24D|AT-AS50HD|AT-AS40W|AT-AS55HD|AT-AS45q2|AT-B26D|AT-AS50Q",
                Alcatel: "Alcatel",
                Nintendo: "Nintendo (3DS|Switch)",
                Amoi: "Amoi",
                INQ: "INQ",
                OnePlus: "ONEPLUS",
                GenericPhone:
                  "Tapatalk|PDA;|SAGEM|\\bmmp\\b|pocket|\\bpsp\\b|symbian|Smartphone|smartfon|treo|up.browser|up.link|vodafone|\\bwap\\b|nokia|Series40|Series60|S60|SonyEricsson|N900|MAUI.*WAP.*Browser",
              },
              tablets: {
                iPad: "iPad|iPad.*Mobile",
                NexusTablet: "Android.*Nexus[\\s]+(7|9|10)",
                GoogleTablet: "Android.*Pixel C",
                SamsungTablet:
                  "SAMSUNG.*Tablet|Galaxy.*Tab|SC-01C|GT-P1000|GT-P1003|GT-P1010|GT-P3105|GT-P6210|GT-P6800|GT-P6810|GT-P7100|GT-P7300|GT-P7310|GT-P7500|GT-P7510|SCH-I800|SCH-I815|SCH-I905|SGH-I957|SGH-I987|SGH-T849|SGH-T859|SGH-T869|SPH-P100|GT-P3100|GT-P3108|GT-P3110|GT-P5100|GT-P5110|GT-P6200|GT-P7320|GT-P7511|GT-N8000|GT-P8510|SGH-I497|SPH-P500|SGH-T779|SCH-I705|SCH-I915|GT-N8013|GT-P3113|GT-P5113|GT-P8110|GT-N8010|GT-N8005|GT-N8020|GT-P1013|GT-P6201|GT-P7501|GT-N5100|GT-N5105|GT-N5110|SHV-E140K|SHV-E140L|SHV-E140S|SHV-E150S|SHV-E230K|SHV-E230L|SHV-E230S|SHW-M180K|SHW-M180L|SHW-M180S|SHW-M180W|SHW-M300W|SHW-M305W|SHW-M380K|SHW-M380S|SHW-M380W|SHW-M430W|SHW-M480K|SHW-M480S|SHW-M480W|SHW-M485W|SHW-M486W|SHW-M500W|GT-I9228|SCH-P739|SCH-I925|GT-I9200|GT-P5200|GT-P5210|GT-P5210X|SM-T311|SM-T310|SM-T310X|SM-T210|SM-T210R|SM-T211|SM-P600|SM-P601|SM-P605|SM-P900|SM-P901|SM-T217|SM-T217A|SM-T217S|SM-P6000|SM-T3100|SGH-I467|XE500|SM-T110|GT-P5220|GT-I9200X|GT-N5110X|GT-N5120|SM-P905|SM-T111|SM-T2105|SM-T315|SM-T320|SM-T320X|SM-T321|SM-T520|SM-T525|SM-T530NU|SM-T230NU|SM-T330NU|SM-T900|XE500T1C|SM-P605V|SM-P905V|SM-T337V|SM-T537V|SM-T707V|SM-T807V|SM-P600X|SM-P900X|SM-T210X|SM-T230|SM-T230X|SM-T325|GT-P7503|SM-T531|SM-T330|SM-T530|SM-T705|SM-T705C|SM-T535|SM-T331|SM-T800|SM-T700|SM-T537|SM-T807|SM-P907A|SM-T337A|SM-T537A|SM-T707A|SM-T807A|SM-T237|SM-T807P|SM-P607T|SM-T217T|SM-T337T|SM-T807T|SM-T116NQ|SM-T116BU|SM-P550|SM-T350|SM-T550|SM-T9000|SM-P9000|SM-T705Y|SM-T805|GT-P3113|SM-T710|SM-T810|SM-T815|SM-T360|SM-T533|SM-T113|SM-T335|SM-T715|SM-T560|SM-T670|SM-T677|SM-T377|SM-T567|SM-T357T|SM-T555|SM-T561|SM-T713|SM-T719|SM-T813|SM-T819|SM-T580|SM-T355Y?|SM-T280|SM-T817A|SM-T820|SM-W700|SM-P580|SM-T587|SM-P350|SM-P555M|SM-P355M|SM-T113NU|SM-T815Y|SM-T585|SM-T285|SM-T825|SM-W708|SM-T835|SM-T830|SM-T837V|SM-T720|SM-T510|SM-T387V|SM-P610|SM-T290|SM-T515|SM-T590|SM-T595|SM-T725|SM-T817P|SM-P585N0|SM-T395|SM-T295|SM-T865|SM-P610N|SM-P615|SM-T970|SM-T380|SM-T5950|SM-T905|SM-T231|SM-T500|SM-T860",
                Kindle:
                  "Kindle|Silk.*Accelerated|Android.*\\b(KFOT|KFTT|KFJWI|KFJWA|KFOTE|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|WFJWAE|KFSAWA|KFSAWI|KFASWI|KFARWI|KFFOWI|KFGIWI|KFMEWI)\\b|Android.*Silk/[0-9.]+ like Chrome/[0-9.]+ (?!Mobile)",
                SurfaceTablet: "Windows NT [0-9.]+; ARM;.*(Tablet|ARMBJS)",
                HPTablet:
                  "HP Slate (7|8|10)|HP ElitePad 900|hp-tablet|EliteBook.*Touch|HP 8|Slate 21|HP SlateBook 10",
                AsusTablet:
                  "^.*PadFone((?!Mobile).)*$|Transformer|TF101|TF101G|TF300T|TF300TG|TF300TL|TF700T|TF700KL|TF701T|TF810C|ME171|ME301T|ME302C|ME371MG|ME370T|ME372MG|ME172V|ME173X|ME400C|Slider SL101|\\bK00F\\b|\\bK00C\\b|\\bK00E\\b|\\bK00L\\b|TX201LA|ME176C|ME102A|\\bM80TA\\b|ME372CL|ME560CG|ME372CG|ME302KL| K010 | K011 | K017 | K01E |ME572C|ME103K|ME170C|ME171C|\\bME70C\\b|ME581C|ME581CL|ME8510C|ME181C|P01Y|PO1MA|P01Z|\\bP027\\b|\\bP024\\b|\\bP00C\\b",
                BlackBerryTablet: "PlayBook|RIM Tablet",
                HTCtablet:
                  "HTC_Flyer_P512|HTC Flyer|HTC Jetstream|HTC-P715a|HTC EVO View 4G|PG41200|PG09410",
                MotorolaTablet:
                  "xoom|sholest|MZ615|MZ605|MZ505|MZ601|MZ602|MZ603|MZ604|MZ606|MZ607|MZ608|MZ609|MZ615|MZ616|MZ617",
                NookTablet:
                  "Android.*Nook|NookColor|nook browser|BNRV200|BNRV200A|BNTV250|BNTV250A|BNTV400|BNTV600|LogicPD Zoom2",
                AcerTablet:
                  "Android.*; \\b(A100|A101|A110|A200|A210|A211|A500|A501|A510|A511|A700|A701|W500|W500P|W501|W501P|W510|W511|W700|G100|G100W|B1-A71|B1-710|B1-711|A1-810|A1-811|A1-830)\\b|W3-810|\\bA3-A10\\b|\\bA3-A11\\b|\\bA3-A20\\b|\\bA3-A30|A3-A40",
                ToshibaTablet:
                  "Android.*(AT100|AT105|AT200|AT205|AT270|AT275|AT300|AT305|AT1S5|AT500|AT570|AT700|AT830)|TOSHIBA.*FOLIO",
                LGTablet:
                  "\\bL-06C|LG-V909|LG-V900|LG-V700|LG-V510|LG-V500|LG-V410|LG-V400|LG-VK810\\b",
                FujitsuTablet:
                  "Android.*\\b(F-01D|F-02F|F-05E|F-10D|M532|Q572)\\b",
                PrestigioTablet:
                  "PMP3170B|PMP3270B|PMP3470B|PMP7170B|PMP3370B|PMP3570C|PMP5870C|PMP3670B|PMP5570C|PMP5770D|PMP3970B|PMP3870C|PMP5580C|PMP5880D|PMP5780D|PMP5588C|PMP7280C|PMP7280C3G|PMP7280|PMP7880D|PMP5597D|PMP5597|PMP7100D|PER3464|PER3274|PER3574|PER3884|PER5274|PER5474|PMP5097CPRO|PMP5097|PMP7380D|PMP5297C|PMP5297C_QUAD|PMP812E|PMP812E3G|PMP812F|PMP810E|PMP880TD|PMT3017|PMT3037|PMT3047|PMT3057|PMT7008|PMT5887|PMT5001|PMT5002",
                LenovoTablet:
                  "Lenovo TAB|Idea(Tab|Pad)( A1|A10| K1|)|ThinkPad([ ]+)?Tablet|YT3-850M|YT3-X90L|YT3-X90F|YT3-X90X|Lenovo.*(S2109|S2110|S5000|S6000|K3011|A3000|A3500|A1000|A2107|A2109|A1107|A5500|A7600|B6000|B8000|B8080)(-|)(FL|F|HV|H|)|TB-X103F|TB-X304X|TB-X304F|TB-X304L|TB-X505F|TB-X505L|TB-X505X|TB-X605F|TB-X605L|TB-8703F|TB-8703X|TB-8703N|TB-8704N|TB-8704F|TB-8704X|TB-8704V|TB-7304F|TB-7304I|TB-7304X|Tab2A7-10F|Tab2A7-20F|TB2-X30L|YT3-X50L|YT3-X50F|YT3-X50M|YT-X705F|YT-X703F|YT-X703L|YT-X705L|YT-X705X|TB2-X30F|TB2-X30L|TB2-X30M|A2107A-F|A2107A-H|TB3-730F|TB3-730M|TB3-730X|TB-7504F|TB-7504X|TB-X704F|TB-X104F|TB3-X70F|TB-X705F|TB-8504F|TB3-X70L|TB3-710F|TB-X704L",
                DellTablet:
                  "Venue 11|Venue 8|Venue 7|Dell Streak 10|Dell Streak 7",
                YarvikTablet:
                  "Android.*\\b(TAB210|TAB211|TAB224|TAB250|TAB260|TAB264|TAB310|TAB360|TAB364|TAB410|TAB411|TAB420|TAB424|TAB450|TAB460|TAB461|TAB464|TAB465|TAB467|TAB468|TAB07-100|TAB07-101|TAB07-150|TAB07-151|TAB07-152|TAB07-200|TAB07-201-3G|TAB07-210|TAB07-211|TAB07-212|TAB07-214|TAB07-220|TAB07-400|TAB07-485|TAB08-150|TAB08-200|TAB08-201-3G|TAB08-201-30|TAB09-100|TAB09-211|TAB09-410|TAB10-150|TAB10-201|TAB10-211|TAB10-400|TAB10-410|TAB13-201|TAB274EUK|TAB275EUK|TAB374EUK|TAB462EUK|TAB474EUK|TAB9-200)\\b",
                MedionTablet:
                  "Android.*\\bOYO\\b|LIFE.*(P9212|P9514|P9516|S9512)|LIFETAB",
                ArnovaTablet:
                  "97G4|AN10G2|AN7bG3|AN7fG3|AN8G3|AN8cG3|AN7G3|AN9G3|AN7dG3|AN7dG3ST|AN7dG3ChildPad|AN10bG3|AN10bG3DT|AN9G2",
                IntensoTablet:
                  "INM8002KP|INM1010FP|INM805ND|Intenso Tab|TAB1004",
                IRUTablet: "M702pro",
                MegafonTablet: "MegaFon V9|\\bZTE V9\\b|Android.*\\bMT7A\\b",
                EbodaTablet: "E-Boda (Supreme|Impresspeed|Izzycomm|Essential)",
                AllViewTablet:
                  "Allview.*(Viva|Alldro|City|Speed|All TV|Frenzy|Quasar|Shine|TX1|AX1|AX2)",
                ArchosTablet:
                  "\\b(101G9|80G9|A101IT)\\b|Qilive 97R|Archos5|\\bARCHOS (70|79|80|90|97|101|FAMILYPAD|)(b|c|)(G10| Cobalt| TITANIUM(HD|)| Xenon| Neon|XSK| 2| XS 2| PLATINUM| CARBON|GAMEPAD)\\b",
                AinolTablet:
                  "NOVO7|NOVO8|NOVO10|Novo7Aurora|Novo7Basic|NOVO7PALADIN|novo9-Spark",
                NokiaLumiaTablet: "Lumia 2520",
                SonyTablet:
                  "Sony.*Tablet|Xperia Tablet|Sony Tablet S|SO-03E|SGPT12|SGPT13|SGPT114|SGPT121|SGPT122|SGPT123|SGPT111|SGPT112|SGPT113|SGPT131|SGPT132|SGPT133|SGPT211|SGPT212|SGPT213|SGP311|SGP312|SGP321|EBRD1101|EBRD1102|EBRD1201|SGP351|SGP341|SGP511|SGP512|SGP521|SGP541|SGP551|SGP621|SGP641|SGP612|SOT31|SGP771|SGP611|SGP612|SGP712",
                PhilipsTablet:
                  "\\b(PI2010|PI3000|PI3100|PI3105|PI3110|PI3205|PI3210|PI3900|PI4010|PI7000|PI7100)\\b",
                CubeTablet:
                  "Android.*(K8GT|U9GT|U10GT|U16GT|U17GT|U18GT|U19GT|U20GT|U23GT|U30GT)|CUBE U8GT",
                CobyTablet:
                  "MID1042|MID1045|MID1125|MID1126|MID7012|MID7014|MID7015|MID7034|MID7035|MID7036|MID7042|MID7048|MID7127|MID8042|MID8048|MID8127|MID9042|MID9740|MID9742|MID7022|MID7010",
                MIDTablet:
                  "M9701|M9000|M9100|M806|M1052|M806|T703|MID701|MID713|MID710|MID727|MID760|MID830|MID728|MID933|MID125|MID810|MID732|MID120|MID930|MID800|MID731|MID900|MID100|MID820|MID735|MID980|MID130|MID833|MID737|MID960|MID135|MID860|MID736|MID140|MID930|MID835|MID733|MID4X10",
                MSITablet:
                  "MSI \\b(Primo 73K|Primo 73L|Primo 81L|Primo 77|Primo 93|Primo 75|Primo 76|Primo 73|Primo 81|Primo 91|Primo 90|Enjoy 71|Enjoy 7|Enjoy 10)\\b",
                SMiTTablet:
                  "Android.*(\\bMID\\b|MID-560|MTV-T1200|MTV-PND531|MTV-P1101|MTV-PND530)",
                RockChipTablet:
                  "Android.*(RK2818|RK2808A|RK2918|RK3066)|RK2738|RK2808A",
                FlyTablet: "IQ310|Fly Vision",
                bqTablet:
                  "Android.*(bq)?.*\\b(Elcano|Curie|Edison|Maxwell|Kepler|Pascal|Tesla|Hypatia|Platon|Newton|Livingstone|Cervantes|Avant|Aquaris ([E|M]10|M8))\\b|Maxwell.*Lite|Maxwell.*Plus",
                HuaweiTablet:
                  "MediaPad|MediaPad 7 Youth|IDEOS S7|S7-201c|S7-202u|S7-101|S7-103|S7-104|S7-105|S7-106|S7-201|S7-Slim|M2-A01L|BAH-L09|BAH-W09|AGS-L09|CMR-AL19",
                NecTablet: "\\bN-06D|\\bN-08D",
                PantechTablet: "Pantech.*P4100",
                BronchoTablet: "Broncho.*(N701|N708|N802|a710)",
                VersusTablet: "TOUCHPAD.*[78910]|\\bTOUCHTAB\\b",
                ZyncTablet: "z1000|Z99 2G|z930|z990|z909|Z919|z900",
                PositivoTablet: "TB07STA|TB10STA|TB07FTA|TB10FTA",
                NabiTablet: "Android.*\\bNabi",
                KoboTablet:
                  "Kobo Touch|\\bK080\\b|\\bVox\\b Build|\\bArc\\b Build",
                DanewTablet:
                  "DSlide.*\\b(700|701R|702|703R|704|802|970|971|972|973|974|1010|1012)\\b",
                TexetTablet:
                  "NaviPad|TB-772A|TM-7045|TM-7055|TM-9750|TM-7016|TM-7024|TM-7026|TM-7041|TM-7043|TM-7047|TM-8041|TM-9741|TM-9747|TM-9748|TM-9751|TM-7022|TM-7021|TM-7020|TM-7011|TM-7010|TM-7023|TM-7025|TM-7037W|TM-7038W|TM-7027W|TM-9720|TM-9725|TM-9737W|TM-1020|TM-9738W|TM-9740|TM-9743W|TB-807A|TB-771A|TB-727A|TB-725A|TB-719A|TB-823A|TB-805A|TB-723A|TB-715A|TB-707A|TB-705A|TB-709A|TB-711A|TB-890HD|TB-880HD|TB-790HD|TB-780HD|TB-770HD|TB-721HD|TB-710HD|TB-434HD|TB-860HD|TB-840HD|TB-760HD|TB-750HD|TB-740HD|TB-730HD|TB-722HD|TB-720HD|TB-700HD|TB-500HD|TB-470HD|TB-431HD|TB-430HD|TB-506|TB-504|TB-446|TB-436|TB-416|TB-146SE|TB-126SE",
                PlaystationTablet: "Playstation.*(Portable|Vita)",
                TrekstorTablet:
                  "ST10416-1|VT10416-1|ST70408-1|ST702xx-1|ST702xx-2|ST80208|ST97216|ST70104-2|VT10416-2|ST10216-2A|SurfTab",
                PyleAudioTablet:
                  "\\b(PTBL10CEU|PTBL10C|PTBL72BC|PTBL72BCEU|PTBL7CEU|PTBL7C|PTBL92BC|PTBL92BCEU|PTBL9CEU|PTBL9CUK|PTBL9C)\\b",
                AdvanTablet:
                  "Android.* \\b(E3A|T3X|T5C|T5B|T3E|T3C|T3B|T1J|T1F|T2A|T1H|T1i|E1C|T1-E|T5-A|T4|E1-B|T2Ci|T1-B|T1-D|O1-A|E1-A|T1-A|T3A|T4i)\\b ",
                DanyTechTablet:
                  "Genius Tab G3|Genius Tab S2|Genius Tab Q3|Genius Tab G4|Genius Tab Q4|Genius Tab G-II|Genius TAB GII|Genius TAB GIII|Genius Tab S1",
                GalapadTablet: "Android [0-9.]+; [a-z-]+; \\bG1\\b",
                MicromaxTablet:
                  "Funbook|Micromax.*\\b(P250|P560|P360|P362|P600|P300|P350|P500|P275)\\b",
                KarbonnTablet:
                  "Android.*\\b(A39|A37|A34|ST8|ST10|ST7|Smart Tab3|Smart Tab2)\\b",
                AllFineTablet:
                  "Fine7 Genius|Fine7 Shine|Fine7 Air|Fine8 Style|Fine9 More|Fine10 Joy|Fine11 Wide",
                PROSCANTablet:
                  "\\b(PEM63|PLT1023G|PLT1041|PLT1044|PLT1044G|PLT1091|PLT4311|PLT4311PL|PLT4315|PLT7030|PLT7033|PLT7033D|PLT7035|PLT7035D|PLT7044K|PLT7045K|PLT7045KB|PLT7071KG|PLT7072|PLT7223G|PLT7225G|PLT7777G|PLT7810K|PLT7849G|PLT7851G|PLT7852G|PLT8015|PLT8031|PLT8034|PLT8036|PLT8080K|PLT8082|PLT8088|PLT8223G|PLT8234G|PLT8235G|PLT8816K|PLT9011|PLT9045K|PLT9233G|PLT9735|PLT9760G|PLT9770G)\\b",
                YONESTablet:
                  "BQ1078|BC1003|BC1077|RK9702|BC9730|BC9001|IT9001|BC7008|BC7010|BC708|BC728|BC7012|BC7030|BC7027|BC7026",
                ChangJiaTablet:
                  "TPC7102|TPC7103|TPC7105|TPC7106|TPC7107|TPC7201|TPC7203|TPC7205|TPC7210|TPC7708|TPC7709|TPC7712|TPC7110|TPC8101|TPC8103|TPC8105|TPC8106|TPC8203|TPC8205|TPC8503|TPC9106|TPC9701|TPC97101|TPC97103|TPC97105|TPC97106|TPC97111|TPC97113|TPC97203|TPC97603|TPC97809|TPC97205|TPC10101|TPC10103|TPC10106|TPC10111|TPC10203|TPC10205|TPC10503",
                GUTablet: "TX-A1301|TX-M9002|Q702|kf026",
                PointOfViewTablet:
                  "TAB-P506|TAB-navi-7-3G-M|TAB-P517|TAB-P-527|TAB-P701|TAB-P703|TAB-P721|TAB-P731N|TAB-P741|TAB-P825|TAB-P905|TAB-P925|TAB-PR945|TAB-PL1015|TAB-P1025|TAB-PI1045|TAB-P1325|TAB-PROTAB[0-9]+|TAB-PROTAB25|TAB-PROTAB26|TAB-PROTAB27|TAB-PROTAB26XL|TAB-PROTAB2-IPS9|TAB-PROTAB30-IPS9|TAB-PROTAB25XXL|TAB-PROTAB26-IPS10|TAB-PROTAB30-IPS10",
                OvermaxTablet:
                  "OV-(SteelCore|NewBase|Basecore|Baseone|Exellen|Quattor|EduTab|Solution|ACTION|BasicTab|TeddyTab|MagicTab|Stream|TB-08|TB-09)|Qualcore 1027",
                HCLTablet:
                  "HCL.*Tablet|Connect-3G-2.0|Connect-2G-2.0|ME Tablet U1|ME Tablet U2|ME Tablet G1|ME Tablet X1|ME Tablet Y2|ME Tablet Sync",
                DPSTablet: "DPS Dream 9|DPS Dual 7",
                VistureTablet:
                  "V97 HD|i75 3G|Visture V4( HD)?|Visture V5( HD)?|Visture V10",
                CrestaTablet:
                  "CTP(-)?810|CTP(-)?818|CTP(-)?828|CTP(-)?838|CTP(-)?888|CTP(-)?978|CTP(-)?980|CTP(-)?987|CTP(-)?988|CTP(-)?989",
                MediatekTablet: "\\bMT8125|MT8389|MT8135|MT8377\\b",
                ConcordeTablet: "Concorde([ ]+)?Tab|ConCorde ReadMan",
                GoCleverTablet:
                  "GOCLEVER TAB|A7GOCLEVER|M1042|M7841|M742|R1042BK|R1041|TAB A975|TAB A7842|TAB A741|TAB A741L|TAB M723G|TAB M721|TAB A1021|TAB I921|TAB R721|TAB I720|TAB T76|TAB R70|TAB R76.2|TAB R106|TAB R83.2|TAB M813G|TAB I721|GCTA722|TAB I70|TAB I71|TAB S73|TAB R73|TAB R74|TAB R93|TAB R75|TAB R76.1|TAB A73|TAB A93|TAB A93.2|TAB T72|TAB R83|TAB R974|TAB R973|TAB A101|TAB A103|TAB A104|TAB A104.2|R105BK|M713G|A972BK|TAB A971|TAB R974.2|TAB R104|TAB R83.3|TAB A1042",
                ModecomTablet:
                  "FreeTAB 9000|FreeTAB 7.4|FreeTAB 7004|FreeTAB 7800|FreeTAB 2096|FreeTAB 7.5|FreeTAB 1014|FreeTAB 1001 |FreeTAB 8001|FreeTAB 9706|FreeTAB 9702|FreeTAB 7003|FreeTAB 7002|FreeTAB 1002|FreeTAB 7801|FreeTAB 1331|FreeTAB 1004|FreeTAB 8002|FreeTAB 8014|FreeTAB 9704|FreeTAB 1003",
                VoninoTablet:
                  "\\b(Argus[ _]?S|Diamond[ _]?79HD|Emerald[ _]?78E|Luna[ _]?70C|Onyx[ _]?S|Onyx[ _]?Z|Orin[ _]?HD|Orin[ _]?S|Otis[ _]?S|SpeedStar[ _]?S|Magnet[ _]?M9|Primus[ _]?94[ _]?3G|Primus[ _]?94HD|Primus[ _]?QS|Android.*\\bQ8\\b|Sirius[ _]?EVO[ _]?QS|Sirius[ _]?QS|Spirit[ _]?S)\\b",
                ECSTablet: "V07OT2|TM105A|S10OT1|TR10CS1",
                StorexTablet: "eZee[_']?(Tab|Go)[0-9]+|TabLC7|Looney Tunes Tab",
                VodafoneTablet:
                  "SmartTab([ ]+)?[0-9]+|SmartTabII10|SmartTabII7|VF-1497|VFD 1400",
                EssentielBTablet: "Smart[ ']?TAB[ ]+?[0-9]+|Family[ ']?TAB2",
                RossMoorTablet:
                  "RM-790|RM-997|RMD-878G|RMD-974R|RMT-705A|RMT-701|RME-601|RMT-501|RMT-711",
                iMobileTablet: "i-mobile i-note",
                TolinoTablet: "tolino tab [0-9.]+|tolino shine",
                AudioSonicTablet: "\\bC-22Q|T7-QC|T-17B|T-17P\\b",
                AMPETablet: "Android.* A78 ",
                SkkTablet: "Android.* (SKYPAD|PHOENIX|CYCLOPS)",
                TecnoTablet: "TECNO P9|TECNO DP8D",
                JXDTablet:
                  "Android.* \\b(F3000|A3300|JXD5000|JXD3000|JXD2000|JXD300B|JXD300|S5800|S7800|S602b|S5110b|S7300|S5300|S602|S603|S5100|S5110|S601|S7100a|P3000F|P3000s|P101|P200s|P1000m|P200m|P9100|P1000s|S6600b|S908|P1000|P300|S18|S6600|S9100)\\b",
                iJoyTablet:
                  "Tablet (Spirit 7|Essentia|Galatea|Fusion|Onix 7|Landa|Titan|Scooby|Deox|Stella|Themis|Argon|Unique 7|Sygnus|Hexen|Finity 7|Cream|Cream X2|Jade|Neon 7|Neron 7|Kandy|Scape|Saphyr 7|Rebel|Biox|Rebel|Rebel 8GB|Myst|Draco 7|Myst|Tab7-004|Myst|Tadeo Jones|Tablet Boing|Arrow|Draco Dual Cam|Aurix|Mint|Amity|Revolution|Finity 9|Neon 9|T9w|Amity 4GB Dual Cam|Stone 4GB|Stone 8GB|Andromeda|Silken|X2|Andromeda II|Halley|Flame|Saphyr 9,7|Touch 8|Planet|Triton|Unique 10|Hexen 10|Memphis 4GB|Memphis 8GB|Onix 10)",
                FX2Tablet: "FX2 PAD7|FX2 PAD10",
                XoroTablet:
                  "KidsPAD 701|PAD[ ]?712|PAD[ ]?714|PAD[ ]?716|PAD[ ]?717|PAD[ ]?718|PAD[ ]?720|PAD[ ]?721|PAD[ ]?722|PAD[ ]?790|PAD[ ]?792|PAD[ ]?900|PAD[ ]?9715D|PAD[ ]?9716DR|PAD[ ]?9718DR|PAD[ ]?9719QR|PAD[ ]?9720QR|TelePAD1030|Telepad1032|TelePAD730|TelePAD731|TelePAD732|TelePAD735Q|TelePAD830|TelePAD9730|TelePAD795|MegaPAD 1331|MegaPAD 1851|MegaPAD 2151",
                ViewsonicTablet:
                  "ViewPad 10pi|ViewPad 10e|ViewPad 10s|ViewPad E72|ViewPad7|ViewPad E100|ViewPad 7e|ViewSonic VB733|VB100a",
                VerizonTablet: "QTAQZ3|QTAIR7|QTAQTZ3|QTASUN1|QTASUN2|QTAXIA1",
                OdysTablet:
                  "LOOX|XENO10|ODYS[ -](Space|EVO|Xpress|NOON)|\\bXELIO\\b|Xelio10Pro|XELIO7PHONETAB|XELIO10EXTREME|XELIOPT2|NEO_QUAD10",
                CaptivaTablet: "CAPTIVA PAD",
                IconbitTablet:
                  "NetTAB|NT-3702|NT-3702S|NT-3702S|NT-3603P|NT-3603P|NT-0704S|NT-0704S|NT-3805C|NT-3805C|NT-0806C|NT-0806C|NT-0909T|NT-0909T|NT-0907S|NT-0907S|NT-0902S|NT-0902S",
                TeclastTablet:
                  "T98 4G|\\bP80\\b|\\bX90HD\\b|X98 Air|X98 Air 3G|\\bX89\\b|P80 3G|\\bX80h\\b|P98 Air|\\bX89HD\\b|P98 3G|\\bP90HD\\b|P89 3G|X98 3G|\\bP70h\\b|P79HD 3G|G18d 3G|\\bP79HD\\b|\\bP89s\\b|\\bA88\\b|\\bP10HD\\b|\\bP19HD\\b|G18 3G|\\bP78HD\\b|\\bA78\\b|\\bP75\\b|G17s 3G|G17h 3G|\\bP85t\\b|\\bP90\\b|\\bP11\\b|\\bP98t\\b|\\bP98HD\\b|\\bG18d\\b|\\bP85s\\b|\\bP11HD\\b|\\bP88s\\b|\\bA80HD\\b|\\bA80se\\b|\\bA10h\\b|\\bP89\\b|\\bP78s\\b|\\bG18\\b|\\bP85\\b|\\bA70h\\b|\\bA70\\b|\\bG17\\b|\\bP18\\b|\\bA80s\\b|\\bA11s\\b|\\bP88HD\\b|\\bA80h\\b|\\bP76s\\b|\\bP76h\\b|\\bP98\\b|\\bA10HD\\b|\\bP78\\b|\\bP88\\b|\\bA11\\b|\\bA10t\\b|\\bP76a\\b|\\bP76t\\b|\\bP76e\\b|\\bP85HD\\b|\\bP85a\\b|\\bP86\\b|\\bP75HD\\b|\\bP76v\\b|\\bA12\\b|\\bP75a\\b|\\bA15\\b|\\bP76Ti\\b|\\bP81HD\\b|\\bA10\\b|\\bT760VE\\b|\\bT720HD\\b|\\bP76\\b|\\bP73\\b|\\bP71\\b|\\bP72\\b|\\bT720SE\\b|\\bC520Ti\\b|\\bT760\\b|\\bT720VE\\b|T720-3GE|T720-WiFi",
                OndaTablet:
                  "\\b(V975i|Vi30|VX530|V701|Vi60|V701s|Vi50|V801s|V719|Vx610w|VX610W|V819i|Vi10|VX580W|Vi10|V711s|V813|V811|V820w|V820|Vi20|V711|VI30W|V712|V891w|V972|V819w|V820w|Vi60|V820w|V711|V813s|V801|V819|V975s|V801|V819|V819|V818|V811|V712|V975m|V101w|V961w|V812|V818|V971|V971s|V919|V989|V116w|V102w|V973|Vi40)\\b[\\s]+|V10 \\b4G\\b",
                JaytechTablet: "TPC-PA762",
                BlaupunktTablet: "Endeavour 800NG|Endeavour 1010",
                DigmaTablet:
                  "\\b(iDx10|iDx9|iDx8|iDx7|iDxD7|iDxD8|iDsQ8|iDsQ7|iDsQ8|iDsD10|iDnD7|3TS804H|iDsQ11|iDj7|iDs10)\\b",
                EvolioTablet:
                  "ARIA_Mini_wifi|Aria[ _]Mini|Evolio X10|Evolio X7|Evolio X8|\\bEvotab\\b|\\bNeura\\b",
                LavaTablet: "QPAD E704|\\bIvoryS\\b|E-TAB IVORY|\\bE-TAB\\b",
                AocTablet:
                  "MW0811|MW0812|MW0922|MTK8382|MW1031|MW0831|MW0821|MW0931|MW0712",
                MpmanTablet:
                  "MP11 OCTA|MP10 OCTA|MPQC1114|MPQC1004|MPQC994|MPQC974|MPQC973|MPQC804|MPQC784|MPQC780|\\bMPG7\\b|MPDCG75|MPDCG71|MPDC1006|MP101DC|MPDC9000|MPDC905|MPDC706HD|MPDC706|MPDC705|MPDC110|MPDC100|MPDC99|MPDC97|MPDC88|MPDC8|MPDC77|MP709|MID701|MID711|MID170|MPDC703|MPQC1010",
                CelkonTablet:
                  "CT695|CT888|CT[\\s]?910|CT7 Tab|CT9 Tab|CT3 Tab|CT2 Tab|CT1 Tab|C820|C720|\\bCT-1\\b",
                WolderTablet:
                  "miTab \\b(DIAMOND|SPACE|BROOKLYN|NEO|FLY|MANHATTAN|FUNK|EVOLUTION|SKY|GOCAR|IRON|GENIUS|POP|MINT|EPSILON|BROADWAY|JUMP|HOP|LEGEND|NEW AGE|LINE|ADVANCE|FEEL|FOLLOW|LIKE|LINK|LIVE|THINK|FREEDOM|CHICAGO|CLEVELAND|BALTIMORE-GH|IOWA|BOSTON|SEATTLE|PHOENIX|DALLAS|IN 101|MasterChef)\\b",
                MediacomTablet:
                  "M-MPI10C3G|M-SP10EG|M-SP10EGP|M-SP10HXAH|M-SP7HXAH|M-SP10HXBH|M-SP8HXAH|M-SP8MXA",
                MiTablet: "\\bMI PAD\\b|\\bHM NOTE 1W\\b",
                NibiruTablet: "Nibiru M1|Nibiru Jupiter One",
                NexoTablet:
                  "NEXO NOVA|NEXO 10|NEXO AVIO|NEXO FREE|NEXO GO|NEXO EVO|NEXO 3G|NEXO SMART|NEXO KIDDO|NEXO MOBI",
                LeaderTablet:
                  "TBLT10Q|TBLT10I|TBL-10WDKB|TBL-10WDKBO2013|TBL-W230V2|TBL-W450|TBL-W500|SV572|TBLT7I|TBA-AC7-8G|TBLT79|TBL-8W16|TBL-10W32|TBL-10WKB|TBL-W100",
                UbislateTablet: "UbiSlate[\\s]?7C",
                PocketBookTablet: "Pocketbook",
                KocasoTablet: "\\b(TB-1207)\\b",
                HisenseTablet: "\\b(F5281|E2371)\\b",
                Hudl: "Hudl HT7S3|Hudl 2",
                TelstraTablet: "T-Hub2",
                GenericTablet:
                  "Android.*\\b97D\\b|Tablet(?!.*PC)|BNTV250A|MID-WCDMA|LogicPD Zoom2|\\bA7EB\\b|CatNova8|A1_07|CT704|CT1002|\\bM721\\b|rk30sdk|\\bEVOTAB\\b|M758A|ET904|ALUMIUM10|Smartfren Tab|Endeavour 1010|Tablet-PC-4|Tagi Tab|\\bM6pro\\b|CT1020W|arc 10HD|\\bTP750\\b|\\bQTAQZ3\\b|WVT101|TM1088|KT107",
              },
              oss: {
                AndroidOS: "Android",
                BlackBerryOS: "blackberry|\\bBB10\\b|rim tablet os",
                PalmOS:
                  "PalmOS|avantgo|blazer|elaine|hiptop|palm|plucker|xiino",
                SymbianOS:
                  "Symbian|SymbOS|Series60|Series40|SYB-[0-9]+|\\bS60\\b",
                WindowsMobileOS:
                  "Windows CE.*(PPC|Smartphone|Mobile|[0-9]{3}x[0-9]{3})|Windows Mobile|Windows Phone [0-9.]+|WCE;",
                WindowsPhoneOS:
                  "Windows Phone 10.0|Windows Phone 8.1|Windows Phone 8.0|Windows Phone OS|XBLWP7|ZuneWP7|Windows NT 6.[23]; ARM;",
                iOS: "\\biPhone.*Mobile|\\biPod|\\biPad|AppleCoreMedia",
                iPadOS: "CPU OS 13",
                SailfishOS: "Sailfish",
                MeeGoOS: "MeeGo",
                MaemoOS: "Maemo",
                JavaOS: "J2ME/|\\bMIDP\\b|\\bCLDC\\b",
                webOS: "webOS|hpwOS",
                badaOS: "\\bBada\\b",
                BREWOS: "BREW",
              },
              uas: {
                Chrome: "\\bCrMo\\b|CriOS|Android.*Chrome/[.0-9]* (Mobile)?",
                Dolfin: "\\bDolfin\\b",
                Opera:
                  "Opera.*Mini|Opera.*Mobi|Android.*Opera|Mobile.*OPR/[0-9.]+$|Coast/[0-9.]+",
                Skyfire: "Skyfire",
                Edge: "\\bEdgiOS\\b|Mobile Safari/[.0-9]* Edge",
                IE: "IEMobile|MSIEMobile",
                Firefox:
                  "fennec|firefox.*maemo|(Mobile|Tablet).*Firefox|Firefox.*Mobile|FxiOS",
                Bolt: "bolt",
                TeaShark: "teashark",
                Blazer: "Blazer",
                Safari:
                  "Version((?!\\bEdgiOS\\b).)*Mobile.*Safari|Safari.*Mobile|MobileSafari",
                WeChat: "\\bMicroMessenger\\b",
                UCBrowser: "UC.*Browser|UCWEB",
                baiduboxapp: "baiduboxapp",
                baidubrowser: "baidubrowser",
                DiigoBrowser: "DiigoBrowser",
                Mercury: "\\bMercury\\b",
                ObigoBrowser: "Obigo",
                NetFront: "NF-Browser",
                GenericBrowser:
                  "NokiaBrowser|OviBrowser|OneBrowser|TwonkyBeamBrowser|SEMC.*Browser|FlyFlow|Minimo|NetFront|Novarra-Vision|MQQBrowser|MicroMessenger",
                PaleMoon: "Android.*PaleMoon|Mobile.*PaleMoon",
              },
              props: {
                Mobile: "Mobile/[VER]",
                Build: "Build/[VER]",
                Version: "Version/[VER]",
                VendorID: "VendorID/[VER]",
                iPad: "iPad.*CPU[a-z ]+[VER]",
                iPhone: "iPhone.*CPU[a-z ]+[VER]",
                iPod: "iPod.*CPU[a-z ]+[VER]",
                Kindle: "Kindle/[VER]",
                Chrome: ["Chrome/[VER]", "CriOS/[VER]", "CrMo/[VER]"],
                Coast: ["Coast/[VER]"],
                Dolfin: "Dolfin/[VER]",
                Firefox: ["Firefox/[VER]", "FxiOS/[VER]"],
                Fennec: "Fennec/[VER]",
                Edge: "Edge/[VER]",
                IE: [
                  "IEMobile/[VER];",
                  "IEMobile [VER]",
                  "MSIE [VER];",
                  "Trident/[0-9.]+;.*rv:[VER]",
                ],
                NetFront: "NetFront/[VER]",
                NokiaBrowser: "NokiaBrowser/[VER]",
                Opera: [" OPR/[VER]", "Opera Mini/[VER]", "Version/[VER]"],
                "Opera Mini": "Opera Mini/[VER]",
                "Opera Mobi": "Version/[VER]",
                UCBrowser: ["UCWEB[VER]", "UC.*Browser/[VER]"],
                MQQBrowser: "MQQBrowser/[VER]",
                MicroMessenger: "MicroMessenger/[VER]",
                baiduboxapp: "baiduboxapp/[VER]",
                baidubrowser: "baidubrowser/[VER]",
                SamsungBrowser: "SamsungBrowser/[VER]",
                Iron: "Iron/[VER]",
                Safari: ["Version/[VER]", "Safari/[VER]"],
                Skyfire: "Skyfire/[VER]",
                Tizen: "Tizen/[VER]",
                Webkit: "webkit[ /][VER]",
                PaleMoon: "PaleMoon/[VER]",
                SailfishBrowser: "SailfishBrowser/[VER]",
                Gecko: "Gecko/[VER]",
                Trident: "Trident/[VER]",
                Presto: "Presto/[VER]",
                Goanna: "Goanna/[VER]",
                iOS: " \\bi?OS\\b [VER][ ;]{1}",
                Android: "Android [VER]",
                Sailfish: "Sailfish [VER]",
                BlackBerry: [
                  "BlackBerry[\\w]+/[VER]",
                  "BlackBerry.*Version/[VER]",
                  "Version/[VER]",
                ],
                BREW: "BREW [VER]",
                Java: "Java/[VER]",
                "Windows Phone OS": [
                  "Windows Phone OS [VER]",
                  "Windows Phone [VER]",
                ],
                "Windows Phone": "Windows Phone [VER]",
                "Windows CE": "Windows CE/[VER]",
                "Windows NT": "Windows NT [VER]",
                Symbian: ["SymbianOS/[VER]", "Symbian/[VER]"],
                webOS: ["webOS/[VER]", "hpwOS/[VER];"],
              },
              utils: {
                Bot: "Googlebot|facebookexternalhit|Google-AMPHTML|s~amp-validator|AdsBot-Google|Google Keyword Suggestion|Facebot|YandexBot|YandexMobileBot|bingbot|ia_archiver|AhrefsBot|Ezooms|GSLFbot|WBSearchBot|Twitterbot|TweetmemeBot|Twikle|PaperLiBot|Wotbox|UnwindFetchor|Exabot|MJ12bot|YandexImages|TurnitinBot|Pingdom|contentkingapp|AspiegelBot",
                MobileBot:
                  "Googlebot-Mobile|AdsBot-Google-Mobile|YahooSeeker/M1A1-R2D2",
                DesktopMode: "WPDesktop",
                TV: "SonyDTV|HbbTV",
                WebKit: "(webkit)[ /]([\\w.]+)",
                Console:
                  "\\b(Nintendo|Nintendo WiiU|Nintendo 3DS|Nintendo Switch|PLAYSTATION|Xbox)\\b",
                Watch: "SM-V700",
              },
            },
            detectMobileBrowsers: {
              fullPattern:
                /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
              shortPattern:
                /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
              tabletPattern: /android|ipad|playbook|silk/i,
            },
          },
          n = Object.prototype.hasOwnProperty;
        function i(e, t) {
          return null != e && null != t && e.toLowerCase() === t.toLowerCase();
        }
        function o(e, t) {
          var r,
            n,
            i = e.length;
          if (!i || !t) return !1;
          for (r = t.toLowerCase(), n = 0; n < i; ++n)
            if (r === e[n].toLowerCase()) return !0;
          return !1;
        }
        function a(e) {
          for (var t in e) n.call(e, t) && (e[t] = new RegExp(e[t], "i"));
        }
        function s(e, t) {
          (this.ua = (function (e) {
            return (e || "").substr(0, 500);
          })(e)),
            (this._cache = {}),
            (this.maxPhoneWidth = t || 600);
        }
        return (
          (r.FALLBACK_PHONE = "UnknownPhone"),
          (r.FALLBACK_TABLET = "UnknownTablet"),
          (r.FALLBACK_MOBILE = "UnknownMobile"),
          (e =
            "isArray" in Array
              ? Array.isArray
              : function (e) {
                  return "[object Array]" === Object.prototype.toString.call(e);
                }),
          (function () {
            var t,
              i,
              o,
              s,
              c,
              d,
              u = r.mobileDetectRules;
            for (t in u.props)
              if (n.call(u.props, t)) {
                for (
                  i = u.props[t], e(i) || (i = [i]), c = i.length, s = 0;
                  s < c;
                  ++s
                )
                  (d = (o = i[s]).indexOf("[VER]")) >= 0 &&
                    (o =
                      o.substring(0, d) + "([\\w._\\+]+)" + o.substring(d + 5)),
                    (i[s] = new RegExp(o, "i"));
                u.props[t] = i;
              }
            a(u.oss),
              a(u.phones),
              a(u.tablets),
              a(u.uas),
              a(u.utils),
              (u.oss0 = {
                WindowsPhoneOS: u.oss.WindowsPhoneOS,
                WindowsMobileOS: u.oss.WindowsMobileOS,
              });
          })(),
          (r.findMatch = function (e, t) {
            for (var r in e) if (n.call(e, r) && e[r].test(t)) return r;
            return null;
          }),
          (r.findMatches = function (e, t) {
            var r = [];
            for (var i in e) n.call(e, i) && e[i].test(t) && r.push(i);
            return r;
          }),
          (r.getVersionStr = function (e, t) {
            var i,
              o,
              a,
              s,
              c = r.mobileDetectRules.props;
            if (n.call(c, e))
              for (a = (i = c[e]).length, o = 0; o < a; ++o)
                if (null !== (s = i[o].exec(t))) return s[1];
            return null;
          }),
          (r.getVersion = function (e, t) {
            var n = r.getVersionStr(e, t);
            return n ? r.prepareVersionNo(n) : NaN;
          }),
          (r.prepareVersionNo = function (e) {
            var t;
            return (
              1 === (t = e.split(/[a-z._ \/\-]/i)).length && (e = t[0]),
              t.length > 1 && ((e = t[0] + "."), t.shift(), (e += t.join(""))),
              Number(e)
            );
          }),
          (r.isMobileFallback = function (e) {
            return (
              r.detectMobileBrowsers.fullPattern.test(e) ||
              r.detectMobileBrowsers.shortPattern.test(e.substr(0, 4))
            );
          }),
          (r.isTabletFallback = function (e) {
            return r.detectMobileBrowsers.tabletPattern.test(e);
          }),
          (r.prepareDetectionCache = function (e, n, i) {
            if (e.mobile === t) {
              var o, a, c;
              if ((a = r.findMatch(r.mobileDetectRules.tablets, n)))
                return (e.mobile = e.tablet = a), void (e.phone = null);
              if ((o = r.findMatch(r.mobileDetectRules.phones, n)))
                return (e.mobile = e.phone = o), void (e.tablet = null);
              r.isMobileFallback(n)
                ? (c = s.isPhoneSized(i)) === t
                  ? ((e.mobile = r.FALLBACK_MOBILE),
                    (e.tablet = e.phone = null))
                  : c
                  ? ((e.mobile = e.phone = r.FALLBACK_PHONE), (e.tablet = null))
                  : ((e.mobile = e.tablet = r.FALLBACK_TABLET),
                    (e.phone = null))
                : r.isTabletFallback(n)
                ? ((e.mobile = e.tablet = r.FALLBACK_TABLET), (e.phone = null))
                : (e.mobile = e.tablet = e.phone = null);
            }
          }),
          (r.mobileGrade = function (e) {
            var t = null !== e.mobile();
            return (e.os("iOS") && e.version("iPad") >= 4.3) ||
              (e.os("iOS") && e.version("iPhone") >= 3.1) ||
              (e.os("iOS") && e.version("iPod") >= 3.1) ||
              (e.version("Android") > 2.1 && e.is("Webkit")) ||
              e.version("Windows Phone OS") >= 7 ||
              (e.is("BlackBerry") && e.version("BlackBerry") >= 6) ||
              e.match("Playbook.*Tablet") ||
              (e.version("webOS") >= 1.4 && e.match("Palm|Pre|Pixi")) ||
              e.match("hp.*TouchPad") ||
              (e.is("Firefox") && e.version("Firefox") >= 12) ||
              (e.is("Chrome") &&
                e.is("AndroidOS") &&
                e.version("Android") >= 4) ||
              (e.is("Skyfire") &&
                e.version("Skyfire") >= 4.1 &&
                e.is("AndroidOS") &&
                e.version("Android") >= 2.3) ||
              (e.is("Opera") &&
                e.version("Opera Mobi") > 11 &&
                e.is("AndroidOS")) ||
              e.is("MeeGoOS") ||
              e.is("Tizen") ||
              (e.is("Dolfin") && e.version("Bada") >= 2) ||
              ((e.is("UC Browser") || e.is("Dolfin")) &&
                e.version("Android") >= 2.3) ||
              e.match("Kindle Fire") ||
              (e.is("Kindle") && e.version("Kindle") >= 3) ||
              (e.is("AndroidOS") && e.is("NookTablet")) ||
              (e.version("Chrome") >= 11 && !t) ||
              (e.version("Safari") >= 5 && !t) ||
              (e.version("Firefox") >= 4 && !t) ||
              (e.version("MSIE") >= 7 && !t) ||
              (e.version("Opera") >= 10 && !t)
              ? "A"
              : (e.os("iOS") && e.version("iPad") < 4.3) ||
                (e.os("iOS") && e.version("iPhone") < 3.1) ||
                (e.os("iOS") && e.version("iPod") < 3.1) ||
                (e.is("Blackberry") &&
                  e.version("BlackBerry") >= 5 &&
                  e.version("BlackBerry") < 6) ||
                (e.version("Opera Mini") >= 5 &&
                  e.version("Opera Mini") <= 6.5 &&
                  (e.version("Android") >= 2.3 || e.is("iOS"))) ||
                e.match("NokiaN8|NokiaC7|N97.*Series60|Symbian/3") ||
                (e.version("Opera Mobi") >= 11 && e.is("SymbianOS"))
              ? "B"
              : (e.version("BlackBerry") < 5 ||
                  e.match("MSIEMobile|Windows CE.*Mobile") ||
                  e.version("Windows Mobile"),
                "C");
          }),
          (r.detectOS = function (e) {
            return (
              r.findMatch(r.mobileDetectRules.oss0, e) ||
              r.findMatch(r.mobileDetectRules.oss, e)
            );
          }),
          (r.getDeviceSmallerSide = function () {
            return window.screen.width < window.screen.height
              ? window.screen.width
              : window.screen.height;
          }),
          (s.prototype = {
            constructor: s,
            mobile: function () {
              return (
                r.prepareDetectionCache(
                  this._cache,
                  this.ua,
                  this.maxPhoneWidth
                ),
                this._cache.mobile
              );
            },
            phone: function () {
              return (
                r.prepareDetectionCache(
                  this._cache,
                  this.ua,
                  this.maxPhoneWidth
                ),
                this._cache.phone
              );
            },
            tablet: function () {
              return (
                r.prepareDetectionCache(
                  this._cache,
                  this.ua,
                  this.maxPhoneWidth
                ),
                this._cache.tablet
              );
            },
            userAgent: function () {
              return (
                this._cache.userAgent === t &&
                  (this._cache.userAgent = r.findMatch(
                    r.mobileDetectRules.uas,
                    this.ua
                  )),
                this._cache.userAgent
              );
            },
            userAgents: function () {
              return (
                this._cache.userAgents === t &&
                  (this._cache.userAgents = r.findMatches(
                    r.mobileDetectRules.uas,
                    this.ua
                  )),
                this._cache.userAgents
              );
            },
            os: function () {
              return (
                this._cache.os === t && (this._cache.os = r.detectOS(this.ua)),
                this._cache.os
              );
            },
            version: function (e) {
              return r.getVersion(e, this.ua);
            },
            versionStr: function (e) {
              return r.getVersionStr(e, this.ua);
            },
            is: function (e) {
              return (
                o(this.userAgents(), e) ||
                i(e, this.os()) ||
                i(e, this.phone()) ||
                i(e, this.tablet()) ||
                o(r.findMatches(r.mobileDetectRules.utils, this.ua), e)
              );
            },
            match: function (e) {
              return (
                e instanceof RegExp || (e = new RegExp(e, "i")), e.test(this.ua)
              );
            },
            isPhoneSized: function (e) {
              return s.isPhoneSized(e || this.maxPhoneWidth);
            },
            mobileGrade: function () {
              return (
                this._cache.grade === t &&
                  (this._cache.grade = r.mobileGrade(this)),
                this._cache.grade
              );
            },
          }),
          "undefined" != typeof window && window.screen
            ? (s.isPhoneSized = function (e) {
                return e < 0 ? t : r.getDeviceSmallerSide() <= e;
              })
            : (s.isPhoneSized = function () {}),
          (s._impl = r),
          (s.version = "1.4.5 2021-03-13"),
          s
        );
      });
    })(
      (function (t) {
        if (e.exports)
          return function (t) {
            e.exports = t();
          };
        if ("undefined" != typeof window)
          return function (e) {
            window.MobileDetect = e();
          };
        throw new Error("unknown environment");
      })()
    );
  })(ci);
  var di = K(ci.exports);
  const ui = navigator.userAgent.toLowerCase().indexOf("firefox") > -1,
    li = !!window.chrome,
    Ai =
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPhone/i),
    hi =
      (function () {
        const e = oi.detect();
        if (!navigator || !navigator.appVersion || !e) return e;
        const t = /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/.exec(
          window.navigator.appVersion
        );
        return t && t[1]
          ? Object.assign(Object.assign({}, e), { chromeVersion: t[1] })
          : e;
      })() || {},
    fi = !!new di(navigator.userAgent).mobile(),
    pi = navigator.userAgent.toLowerCase().indexOf("electron") > -1;
  function mi() {
    try {
      return (
        !!window &&
        "RTCPeerConnection" in window &&
        "WebSocket" in window &&
        !!navigator &&
        !!navigator.mediaDevices &&
        !!navigator.mediaDevices.getUserMedia
      );
    } catch (e) {
      return !1;
    }
  }
  function gi() {
    const e =
        navigator &&
        navigator.mediaDevices &&
        navigator.mediaDevices.getDisplayMedia,
      t =
        navigator &&
        navigator.mediaDevices &&
        navigator.mediaDevices.getSupportedConstraints &&
        navigator.mediaDevices.getSupportedConstraints().displaySurface;
    return ui ? !!e && !!t : !!e;
  }
  function vi() {
    return (
      "createMediaStreamDestination" in
      (window.AudioContext || window.webkitAudioContext || window.Object)
        .prototype
    );
  }
  const Ti = (function () {
    if (!hi)
      return {
        support: mi(),
        supportRestartICE: !0,
        getDisplayMedia: gi(),
        disconnectAudioNode: !0,
      };
    switch (hi.name) {
      case "chrome":
        return {
          support: mi(),
          mediaStreamDest: si.gte(hi.version, "55.0.0"),
          replaceTrack: si.gte(hi.version, "65.0.0"),
          screenSharing: si.gte(hi.version, "55.0.0"),
          connectionState: si.gte(hi.version, "72.0.0"),
          stats: si.gte(hi.version, "67.0.0"),
          ondevicechange: si.gte(hi.version, "57.0.0"),
          minMaxWithIdeal: si.gte(hi.version, "56.0.0"),
          supportTransceivers: si.gte(hi.version, "69.0.0"),
          unifiedPlan: si.gte(hi.version, "72.0.0"),
          supportRestartICE: !0,
          getReceivers: si.gte(hi.version, "59.0.0"),
          needH264FmtpLine: si.lte(hi.version, "51.0.0"),
          audioContextOptions: !0,
          getDisplayMedia: gi(),
          disconnectAudioNode: !0,
          setPlaybackDevice: !0,
        };
      case "ios":
      case "safari":
        return {
          support: mi(),
          replaceTrack: si.gte(hi.version, "11.0.0"),
          stats: si.gte(hi.version, "11.0.0"),
          ondevicechange: !1,
          connectionState: !0,
          mediaStreamDest: si.gte(hi.version, "12.0.0"),
          screenSharing: si.gte(hi.version, "13.0.0"),
          unifiedPlan: si.gte(hi.version, "12.1.0"),
          supportTransceivers: !0,
          minMaxWithIdeal: !1,
          supportRestartICE: !0,
          getReceivers: !0,
          audioContextOptions: !0,
          getDisplayMedia: gi(),
          disconnectAudioNode: !1,
        };
      case "firefox":
        return {
          support: mi(),
          replaceTrack: !0,
          stats: si.gte(hi.version, "66.0.0"),
          ondevicechange: si.gte(hi.version, "52.0.0"),
          connectionState: !0,
          mediaStreamDest: !0,
          screenSharing: !0,
          minMaxWithIdeal: !0,
          unifiedPlan: !0,
          supportTransceivers: si.gte(hi.version, "59.0.0"),
          supportRestartICE: !1,
          getReceivers: !0,
          audioContextOptions: si.gte(hi.version, "55.0.0"),
          getDisplayMedia: gi(),
          disconnectAudioNode: !0,
        };
      case "crios":
      case "ios-webview":
        return {
          support: mi(),
          getDisplayMedia: gi(),
          mediaStreamDest: vi(),
          unifiedPlan: !0,
          supportTransceivers: !0,
          supportRestartICE: !0,
          disconnectAudioNode: !0,
        };
      default:
        return {
          support: mi(),
          mediaStreamDest: vi(),
          supportRestartICE: !0,
          getDisplayMedia: gi(),
          disconnectAudioNode: !0,
        };
    }
  })();
  class bi extends le {
    constructor(e) {
      let t =
        !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
      super(),
        (this._closed = !1),
        (this._busy = !1),
        (this._queue = []),
        (this.name = e || "TaskQueue"),
        (this.isDebug = t);
    }
    close() {
      this._closed = !0;
    }
    push(e, t) {
      return (
        this.isDebug && he.debug("".concat(this.name, " push()"), e, t),
        new Promise((r, n) => {
          this._queue.push({ method: e, data: t, resolve: r, reject: n }),
            this._handlePendingCommands();
        })
      );
    }
    _handlePendingCommands() {
      if (this._busy) return;
      const e = this._queue,
        t = e[0];
      t &&
        ((this._busy = !0),
        this._handleCommand(t).then(() => {
          (this._busy = !1), e.shift(), this._handlePendingCommands();
        }));
    }
    _handleCommand(e) {
      if (
        (this.isDebug &&
          he.debug(
            "".concat(this.name, " _handleCommand() "),
            e.method,
            e.data
          ),
        this._closed)
      )
        return e.reject(new Do("closed")), Promise.resolve();
      const t = { promise: null };
      return (
        this.emit("exec", e, t),
        Promise.resolve()
          .then(() => t.promise)
          .then((t) => {
            this.isDebug &&
              he.debug(
                "".concat(this.name, " _handleCommand() | command succeeded"),
                e.method
              ),
              this._closed ? e.reject(new Do("closed")) : e.resolve(t);
          })
          .catch((t) => {
            this.isDebug &&
              he.warning(
                "".concat(
                  this.name,
                  " _handleCommand() | command failed [method:%s]: %o"
                ),
                e.method,
                t
              ),
              e.reject(t);
          })
      );
    }
  }
  var Si, yi;
  (e.QNConnectionState = void 0),
    ((Si = e.QNConnectionState || (e.QNConnectionState = {})).DISCONNECTED =
      "DISCONNECTED"),
    (Si.CONNECTING = "CONNECTING"),
    (Si.CONNECTED = "CONNECTED"),
    (Si.RECONNECTING = "RECONNECTING"),
    (Si.RECONNECTED = "RECONNECTED"),
    (e.QNDeviceState = void 0),
    ((yi = e.QNDeviceState || (e.QNDeviceState = {})).ACTIVE = "ACTIVE"),
    (yi.INACTIVE = "INACTIVE");
  const ki = {
      "360p": { width: 640, height: 360, frameRate: 15, bitrate: 400 },
      "640x360_15": { width: 640, height: 360, frameRate: 15, bitrate: 400 },
      "640x360_30": { width: 640, height: 360, frameRate: 30, bitrate: 600 },
      "480p": { width: 640, height: 480, frameRate: 15, bitrate: 500 },
      "640x480_15": { width: 640, height: 480, frameRate: 15, bitrate: 500 },
      "640x480_30": { width: 640, height: 480, frameRate: 30, bitrate: 1e3 },
      "720p": { width: 1280, height: 720, frameRate: 15, bitrate: 1130 },
      "1280x720_15": { width: 1280, height: 720, frameRate: 15, bitrate: 1130 },
      "1280x720_30": { width: 1280, height: 720, frameRate: 30, bitrate: 2e3 },
      "1080p": { width: 1920, height: 1080, frameRate: 15, bitrate: 2080 },
      "1920x1080_15": {
        width: 1920,
        height: 1080,
        frameRate: 15,
        bitrate: 2080,
      },
      "1920x1080_30": {
        width: 1920,
        height: 1080,
        frameRate: 30,
        bitrate: 4e3,
      },
      "1440p": { width: 2560, height: 1440, frameRate: 30, bitrate: 4850 },
      "2560x1440_30": {
        width: 2560,
        height: 1440,
        frameRate: 30,
        bitrate: 4850,
      },
      "4k": { width: 3840, height: 2160, frameRate: 30, bitrate: 8910 },
      "3840x2160_30": {
        width: 3840,
        height: 2160,
        frameRate: 30,
        bitrate: 8910,
      },
    },
    _i = ki["480p"],
    wi = {
      LOW: { sampleRate: 16e3, stereo: !1, bitrate: 24, sampleSize: 16 },
      STANDARD: { sampleRate: 48e3, stereo: !1, bitrate: 64, sampleSize: 16 },
      STANDARD_STEREO: {
        sampleRate: 48e3,
        stereo: !0,
        bitrate: 80,
        sampleSize: 16,
      },
      HIGH: { sampleRate: 48e3, stereo: !1, bitrate: 96, sampleSize: 16 },
      HIGH_STEREO: {
        sampleRate: 48e3,
        stereo: !0,
        bitrate: 128,
        sampleSize: 16,
      },
    },
    Ei = wi.STANDARD,
    Ci = {
      "480p": { width: 640, height: 480, frameRate: 15, bitrate: 500 },
      "640x480_5": { width: 640, height: 480, frameRate: 5, bitrate: 200 },
      "640x480_15": { width: 640, height: 480, frameRate: 15, bitrate: 500 },
      "640x480_30": { width: 640, height: 480, frameRate: 30, bitrate: 1e3 },
      "720p": { width: 1280, height: 720, frameRate: 15, bitrate: 1130 },
      "1280x720_5": { width: 1280, height: 720, frameRate: 5, bitrate: 400 },
      "1280x720_15": { width: 1280, height: 720, frameRate: 15, bitrate: 1130 },
      "1280x720_30": { width: 1280, height: 720, frameRate: 30, bitrate: 2e3 },
      "1080p": { width: 1920, height: 1080, frameRate: 15, bitrate: 2080 },
      "1920x1080_5": { width: 1920, height: 1080, frameRate: 5, bitrate: 700 },
      "1920x1080_15": {
        width: 1920,
        height: 1080,
        frameRate: 15,
        bitrate: 2080,
      },
      "1920x1080_30": {
        width: 1920,
        height: 1080,
        frameRate: 30,
        bitrate: 4e3,
      },
    },
    Ii = Ci["720p"];
  var Pi, Ri, Mi, Di, Oi, Ni, xi, Li, Bi, Gi, Hi, ji, Fi, Vi, Ui, qi;
  (e.QNChromeExtensionSourceType = void 0),
    ((Pi =
      e.QNChromeExtensionSourceType ||
      (e.QNChromeExtensionSourceType = {})).WINDOW = "window"),
    (Pi.SCREEN = "screen"),
    (Pi.ALL = "all"),
    (e.QNAudioSourceState = void 0),
    ((Ri = e.QNAudioSourceState || (e.QNAudioSourceState = {})).IDLE = "IDLE"),
    (Ri.PlAYING = "PlAYING"),
    (Ri.MIXING = "MIXING"),
    (Ri.PAUSED = "PAUSED"),
    (Ri.STOPPED = "STOPPED"),
    (Ri.COMPLETED = "COMPLETED"),
    (e.QNRenderMode = void 0),
    ((Mi = e.QNRenderMode || (e.QNRenderMode = {})).FILL = "scaleToFit"),
    (Mi.ASPECT_FILL = "aspectFill"),
    (Mi.ASPECT_FIT = "aspectFit"),
    (e.QNLiveStreamingState = void 0),
    ((Di = e.QNLiveStreamingState || (e.QNLiveStreamingState = {})).STARTED =
      "STARTED"),
    (Di.STOPPED = "STOPPED"),
    (e.QNNetworkQuality = void 0),
    ((Oi = e.QNNetworkQuality || (e.QNNetworkQuality = {})).UNKNOWN =
      "UNKNOWN"),
    (Oi.EXCELLENT = "EXCELLENT"),
    (Oi.GOOD = "GOOD"),
    (Oi.FAIR = "FAIR"),
    (Oi.POOR = "POOR"),
    (e.QNTrackProfile = void 0),
    ((Ni = e.QNTrackProfile || (e.QNTrackProfile = {})).LOW = "LOW"),
    (Ni.MEDIUM = "MEDIUM"),
    (Ni.HIGH = "HIGH"),
    (e.QNConnectionDisconnectedReason = void 0),
    ((xi =
      e.QNConnectionDisconnectedReason ||
      (e.QNConnectionDisconnectedReason = {})).LEAVE = "LEAVE"),
    (xi.KICKED_OUT = "KICKED_OUT"),
    (xi.ERROR = "ERROR"),
    (e.QNLogLevel = void 0),
    ((Li = e.QNLogLevel || (e.QNLogLevel = {})).VERBOSE = "VERBOSE"),
    (Li.INFO = "INFO"),
    (Li.WARNING = "WARNING"),
    (Li.ERROR = "ERROR"),
    (Li.NONE = "NONE"),
    (e.QNTransportPolicy = void 0),
    ((Bi = e.QNTransportPolicy || (e.QNTransportPolicy = {})).FORCE_UDP =
      "FORCE_UDP"),
    (Bi.FORCE_TCP = "FORCE_TCP"),
    (Bi.PREFER_UDP = "PREFER_UDP"),
    (e.QNVideoOptimizationMode = void 0),
    ((Gi =
      e.QNVideoOptimizationMode || (e.QNVideoOptimizationMode = {})).MOTION =
      "motion"),
    (Gi.DETAIL = "detail"),
    (Gi.DEFAULT = ""),
    (e.QNElectronScreenSourceType = void 0),
    ((Hi =
      e.QNElectronScreenSourceType ||
      (e.QNElectronScreenSourceType = {})).SCREEN = "screen"),
    (Hi.WINDOW = "window"),
    (Hi.ALL = "all"),
    (e.QNClientMode = void 0),
    ((ji = e.QNClientMode || (e.QNClientMode = {})).RTC = "RTC"),
    (ji.LIVE = "LIVE"),
    (e.QNClientRole = void 0),
    ((Fi = e.QNClientRole || (e.QNClientRole = {})).BROADCASTER =
      "BROADCASTER"),
    (Fi.AUDIENCE = "AUDIENCE"),
    (e.QNMediaRelayState = void 0),
    ((Vi = e.QNMediaRelayState || (e.QNMediaRelayState = {}))[
      (Vi.SUCCESS = 0)
    ] = "SUCCESS"),
    (Vi[(Vi.STOPPED = 1)] = "STOPPED"),
    (Vi[(Vi.INVALID_TOKEN = 2)] = "INVALID_TOKEN"),
    (Vi[(Vi.NO_ROOM = 3)] = "NO_ROOM"),
    (Vi[(Vi.ROOM_CLOSED = 4)] = "ROOM_CLOSED"),
    (Vi[(Vi.PLAYER_EXISTED = 5)] = "PLAYER_EXISTED"),
    (e.QNEventGrade = void 0),
    ((Ui = e.QNEventGrade || (e.QNEventGrade = {})).NORMAL = "NORMAL"),
    (Ui.GENERAL = "GENERAL"),
    (Ui.SERVERE = "SERVERE"),
    (e.QNEventCategory = void 0),
    ((qi = e.QNEventCategory || (e.QNEventCategory = {})).CORE = "Core"),
    (qi.API = "API"),
    (qi.AUDIO = "Audio"),
    (qi.VIDEO = "Video"),
    (qi.SIGNAL = "Signal");
  const Qi = "qnrtcqosevents";
  function Wi() {
    return new Promise((e, t) => {
      window.requestIdleCallback
        ? window.requestIdleCallback(() => {
            Me.get((t) => {
              const r = Zn(JSON.stringify(t));
              e(r);
            });
          })
        : setTimeout(() => {
            Me.get((t) => {
              const r = Zn(JSON.stringify(t));
              e(r);
            });
          }, 500);
    });
  }
  function zi(e) {
    const t = [];
    for (let r = 0; r < e.length; r++) {
      let n = e.charCodeAt(r);
      n < 128
        ? t.push(n)
        : n < 2048
        ? t.push(192 | (n >> 6), 128 | (63 & n))
        : n < 55296 || n >= 57344
        ? t.push(224 | (n >> 12), 128 | ((n >> 6) & 63), 128 | (63 & n))
        : (r++,
          (n = 65536 + (((1023 & n) << 10) | (1023 & e.charCodeAt(r)))),
          t.push(
            240 | (n >> 18),
            128 | ((n >> 12) & 63),
            128 | ((n >> 6) & 63),
            128 | (63 & n)
          ));
    }
    return new Uint8Array(t);
  }
  const Xi = new (class {
    constructor() {
      (this.events = []),
        (this.lastSubmitTime = Date.now()),
        (this.submitQueue = new bi("qossubmit", !1)),
        Wi()
          .then((e) => {
            (this.deviceId = e), (this.base.device_id = this.deviceId);
          })
          .catch(() => {
            (this.deviceId = "unknow"), (this.base.device_id = this.deviceId);
          }),
        (this.base = {
          qos_version: "2.0",
          device_id: "",
          bundle_id: "",
          url: window.location.href,
          app_version: "",
          sdk_version: ei,
          device_model: "".concat(hi.name).concat(hi.version),
          os_platform: "Web",
          os_version: "",
          host_environment: hi.os,
        }),
        this.initSubmitQueue(),
        this.submitQueue.push("resume").catch(Bo);
    }
    setSessionId(e) {
      for (let t = this.events.length - 1; t >= 0; t -= 1) {
        const r = this.events[t];
        if (r.session_id) break;
        r.session_id = e;
      }
      this.sessionId = e;
    }
    setUserBase(e, t, r) {
      this.userBase = { user_id: e, room_name: t, app_id: r };
      for (let e = this.events.length - 1; e >= 0; e -= 1) {
        const t = this.events[e];
        if (t.user_base) break;
        t.user_base = this.userBase;
      }
    }
    addEvent(e, t, r) {
      const n = Object.assign(
        { timestamp: Date.now(), event_id: Pe[e], event_name: e },
        t
      );
      this.submitQueue.push("add", n).catch(Bo), this.submit(r);
    }
    submit() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      this.submitQueue.push("submit", e).catch(Bo);
    }
    initSubmitQueue() {
      this.submitQueue.on("exec", (e, t) => {
        switch (e.method) {
          case "submit":
            return void (t.promise = this._submit(e.data));
          case "add":
            return void (t.promise = this._addEvent(e.data));
          case "resume":
            return void (t.promise = this._recoverStoredEvents());
        }
      });
    }
    _recoverStoredEvents() {
      return pe(this, void 0, void 0, function* () {
        const e = yield Ne.getItem(Qi);
        yield Ne.removeItem(Qi),
          e &&
            ((this.events = JSON.parse(window.atob(decodeURIComponent(e)))),
            (this.events = this.events
              .filter((e) => !!e.session_id && !!e.user_base)
              .sort((e, t) => e.event.timestamp - t.event.timestamp)));
      });
    }
    _addEvent(e) {
      return (
        this.events.push({
          user_base: this.userBase,
          event: e,
          session_id: this.sessionId,
        }),
        this.submit(),
        Promise.resolve()
      );
    }
    saveEvents() {
      const e = encodeURIComponent(window.btoa(JSON.stringify(this.events)));
      Ne.setItem(Qi, e).catch(Bo);
    }
    submitCheck() {
      return (
        !!(this.sessionId && this.deviceId && this.userBase) &&
        (Date.now() - this.lastSubmitTime > 3e5 || this.events.length >= 30)
      );
    }
    _submit() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      return pe(this, void 0, void 0, function* () {
        if (!!e || this.submitCheck())
          try {
            const e = this.encodeQosSubmitData();
            for (const t of e) {
              if (
                !(yield fetch("https://pili-rtc-qos.qiniuapi.com/v1/rtcevent", {
                  method: "POST",
                  headers: { "Content-Type": "application/x-gzip" },
                  body: t.buffer,
                })).ok
              )
                throw Yi("rtcevent error");
            }
            (this.lastSubmitTime = Date.now()),
              (this.events = []),
              yield Ne.removeItem(Qi);
          } catch (e) {
            he.log(e);
          }
        else this.saveEvents();
      });
    }
    encodeQosSubmitData() {
      const e = $n(
          this.events,
          (e) => e.session_id || "" + JSON.stringify(e.user_base)
        ),
        t = [];
      for (const r in e) {
        const n = e[r];
        if (0 === n.length) continue;
        const i = {
          session_id: n[0].session_id,
          user_base: n[0].user_base,
          base: this.base,
          items: n.map((e) => e.event),
        };
        he.log("encode", i);
        const o = new Uint8Array(Kn.gzip(zi(JSON.stringify(i))));
        t.push(o);
      }
      return t;
    }
  })();
  {
    const Oc = navigator;
    function Nc(t, r) {
      let n;
      switch (t) {
        case "prompt":
          n = e.PermissionStateCode.prompt;
          break;
        case "granted":
          n = e.PermissionStateCode.granted;
          break;
        case "denied":
          n = e.PermissionStateCode.denied;
          break;
        default:
          return;
      }
      let i = e.QNEventGrade.NORMAL;
      (n === e.PermissionStateCode.prompt || e.PermissionStateCode.denied) &&
        (i = e.QNEventGrade.SERVERE),
        Xi.addEvent("AuthorizationStatus", {
          type: r,
          status: n,
          event_grade: i,
          event_category: e.QNEventCategory.CORE,
        });
    }
    function xc(t) {
      Oc &&
        Oc.permissions &&
        Oc.permissions
          .query({ name: t })
          .then((r) => {
            Nc(r.state, e.PermissionNameCode[t]),
              (r.onchange = () => {
                Nc(r.state, e.PermissionNameCode[t]);
              });
          })
          .catch((e) => {
            he.debug("error when queryPermission", e);
          });
    }
    xc("camera"), xc("microphone");
  }
  document.visibilityState &&
    document.addEventListener("visibilitychange", () => {
      Xi.addEvent("ApplicationState", {
        state: "visible" === document.visibilityState ? 0 : 2,
        event_grade: e.QNEventGrade.GENERAL,
        event_category: e.QNEventCategory.CORE,
      });
    });
  const Ki = (() => {
    let t = e.NetworkGrade.INVALID,
      r = "unknow";
    const n = (e) => {
        let t;
        switch (e) {
          case "cellular":
            t = 0;
            break;
          case "wifi":
            t = 1;
            break;
          case "ethernet":
            t = 2;
            break;
          default:
            t = -1;
        }
        return t;
      },
      i = () => {
        Xi.addEvent("NetworkChange", {
          network_type: n(r),
          network_name: r,
          network_grade: t,
          event_grade: e.QNEventGrade.GENERAL,
          event_category: e.QNEventCategory.CORE,
        });
      },
      o = navigator,
      a = o.connection || o.mozConnection || o.webkitConnection;
    return (
      a &&
        a.type &&
        ((r = a.type),
        (a.onchange = () => {
          r !== a.type && ((r = a.type), i());
        })),
      i(),
      (e) => {
        e !== t && ((t = e), i());
      }
    );
  })();
  class Ji extends Error {
    constructor(e, t) {
      super(t),
        (this.code = e),
        (this.error = t),
        Xi.addEvent("SDKError", { error_code: e, error_msg: t });
    }
  }
  const Zi = (e) => new Ji(10053, "invalid parameters: ".concat(e)),
    Yi = (e) => new Ji(21005, "piliRTC: unexpected error ".concat(e)),
    $i = (e) =>
      new Ji(
        21001,
        "enterRoom error, can not get accessToken. Error: ".concat(
          e,
          "\n please check enterRoom arguments"
        )
      ),
    eo = (e) => new Ji(21006, "not support! ".concat(e)),
    to = (e) => new Ji(21007, "track play is not allowed: ".concat(e)),
    ro = (e) => new Ji(23003, "plugin not avaliable! ".concat(e)),
    no = (e) =>
      new Ji(
        23004,
        "NotAllowedError: no permission to access media device. ".concat(e)
      ),
    io = (e) =>
      new Ji(22011, "can not decode audio data, ".concat(e.toString())),
    oo = () =>
      new Ji(
        23005,
        "no audio track when createScreenVideoTrack withAudio enable"
      ),
    ao = (e) =>
      new Ji(
        23008,
        "require('electron') error, please checkout if electron environment is ok: ".concat(
          e
        )
      ),
    so = (e) =>
      new Ji(24e3, "relay error, can not get relayToken. Error: ".concat(e)),
    co = (e) => new Ji(24001, "invalid client mode, ".concat(e)),
    uo = (e) => new Ji(24002, "invalid client role, ".concat(e)),
    lo = () => Yi("websocket abort"),
    Ao = (e) =>
      Zi("can not set merge layout stream, no merge job id ".concat(e)),
    ho = () => no("can not sharing screen/window on chrome"),
    fo = () => Yi("subscribe/publish operation is aborted"),
    po = () => Zi("cannot found preset"),
    mo = () => new Ji(22003, "mix source error"),
    go = () => new Ji(22002, "mixed source does not find a valid track"),
    vo = () =>
      new Ji(22001, "effectID already exists, cannot create QNAudioEffect"),
    To = () =>
      new Ji(22004, "effectID is not exists, pleast createAudioEffect first"),
    bo = () => new Ji(22005, "failed to write recording file"),
    So = () => new Ji(22006, "audio and video resources do not exist"),
    yo = () => new Ji(22007, "recording time exceeded limit"),
    ko = () =>
      new Ji(22009, "the operation is not supported in the current state"),
    _o = (e, t) =>
      new Ji(
        e,
        "publish error, signaling code: ".concat(e, ", msg: ").concat(t)
      ),
    wo = (e, t) =>
      new Ji(
        e,
        "create merge job error, signaling code: "
          .concat(e, ", msg: ")
          .concat(t)
      ),
    Eo = (e, t) =>
      new Ji(
        e,
        "create forward job error, signaling code: "
          .concat(e, ", msg: ")
          .concat(t)
      ),
    Co = (e, t) => new Ji(e, "media format not support, ".concat(t)),
    Io = (e, t) =>
      new Ji(
        e,
        "subscribe error, signaling code: ".concat(e, ", msg: ").concat(t)
      ),
    Po = (e, t) =>
      new Ji(e, "send control error, code: ".concat(e, ", msg: ").concat(t)),
    Ro = (e, t) => new Ji(e, t),
    Mo = () => new Ji(10052, "server unavailable");
  class Do extends Error {
    constructor(e) {
      super(e),
        (this.name = "InvalidStateError"),
        Error.hasOwnProperty("captureStackTrace")
          ? Error.captureStackTrace(this, Do)
          : (this.stack = new Error(e).stack);
    }
  }
  var Oo = Object.freeze({
    __proto__: null,
    CONTROL_ERROR: Po,
    CREATE_FORWARD_JOB_ERROR: Eo,
    CREATE_MERGE_JOB_ERROR: wo,
    CREATE_SCREEN_AUDIO_ERROR: oo,
    ERROR_AUDIO_DECODE_ERROR: io,
    ERROR_AUDIO_MIXING_AUDIO_NOT_FOUND: go,
    ERROR_AUDIO_MIXING_IO_EXCEPTION: mo,
    ERROR_AUTH_FAILED: $i,
    ERROR_DEVICE_NOT_ALLOWED: no,
    ERROR_EFFECT_ID_IS_EXIST: vo,
    ERROR_EFFECT_ID_IS_NOT_EXIST: To,
    ERROR_ELECTRON_REQUIRE_ERROR: ao,
    ERROR_FATAL: Yi,
    ERROR_INVALID_CLIENT_MODE: co,
    ERROR_INVALID_CLIENT_ROLE: uo,
    ERROR_INVALID_PARAMETER: Zi,
    ERROR_NOT_SUPPORT: eo,
    ERROR_PLAY_NOT_ALLOWED: to,
    ERROR_PLUGIN_NOT_AVAILABLE: ro,
    ERROR_RECONNECT_FAILED: (e) =>
      new Ji(21003, "reconnect failed！".concat(e)),
    ERROR_RECORDER_EXCEEDING_TIME: yo,
    ERROR_RECORDER_PARAMS_EXCEPTION: () => new Ji(22008, ""),
    ERROR_RECORDER_SOURCE_EXCEPTION: So,
    ERROR_RECORDER_STATE_EXCEPTION: ko,
    ERROR_RECORDER_WRITE: bo,
    ERROR_RELAY_TOKEN: so,
    InvalidStateError: Do,
    JOIN_ROOM_ERROR: (e, t) =>
      new Ji(e, "joinRoom error, code: ".concat(e, ", ").concat(t)),
    NO_MERGE_JOB: Ao,
    PRESET_NOT_FOUND: po,
    PUBLISH_ERROR: _o,
    QNRTCError: Ji,
    SCREEN_PERMISSION_DENIED: ho,
    SERVER_ERROR: Ro,
    SERVER_UNAVAILABLE: Mo,
    SUB_ERROR: Io,
    SUB_PUB_ABORT: fo,
    UNPUBLISH_ERROR: (e, t) =>
      new Ji(e, "unpublish error, code: ${code}, msg: ${msg}"),
    UNSUB_ERROR: (e, t) =>
      new Ji(e, "unsubscribe error, code: ${code}, msg: ${msg}"),
    UNSUPPORT_FMT: Co,
    WS_ABORT: lo,
  });
  function No(e) {
    const t = e.split(".")[1];
    if (!t) throw new Error("parse jwt error, can not find payload string.");
    const r = atob(t);
    return JSON.parse(r);
  }
  function xo(e) {
    try {
      const t = e.split(":")[2],
        r = atob(t);
      return JSON.parse(r);
    } catch (e) {
      throw Yi("can not parse roomToken, ".concat(e));
    }
  }
  function Lo(e, t, r) {
    if (!r) return null;
    for (let n = 0; n < e.length; n += 1) {
      const i = e[n];
      if (i[t] === r) return i;
    }
    return null;
  }
  function Bo() {}
  function Go(e) {
    let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
    if (t >= 4) return e;
    for (const r in e)
      void 0 === e[r] && delete e[r],
        e[r] instanceof File ||
          e[r] instanceof ArrayBuffer ||
          ("object" == typeof e[r] && (e[r] = Go(e[r], t + 1)));
    return e;
  }
  function Ho(e) {
    Promise.resolve().then(e);
  }
  function jo(e) {
    return ("0" + e.toString(16)).substr(-2);
  }
  function Fo() {
    const e = new Uint8Array(
      ((arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 5) ||
        40) / 2
    );
    return window.crypto.getRandomValues(e), Array.from(e, jo).join("");
  }
  function Vo(e) {
    return new Promise((t) => {
      setTimeout(() => {
        t();
      }, e);
    });
  }
  const Uo = {};
  function qo(e, t) {
    if (!Uo[t]) return (Uo[t] = !0), e();
  }
  function Qo(e) {
    he.warning("play failed!", e),
      he.warning(
        "play failed due to browser security policy, see: http://s.qnsdk.com/s/Txsdz"
      );
  }
  const Wo = [];
  let zo;
  function Xo(e) {
    let t =
      arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 5e3;
    return pe(this, void 0, void 0, function* () {
      if (zo) return r(zo);
      for (const e of (function* () {
        Wo.length &&
          (he.debug("using custom mcu server hosts:", Wo), yield* Wo),
          yield "https://rtc.qiniuapi.com",
          yield "https://rtc.qiniu.com";
      })()) {
        const t = yield r(e);
        if (t) return (zo = e), t;
      }
      function r(r) {
        return pe(this, void 0, void 0, function* () {
          const n = "".concat(r).concat(e);
          he.debug("requesting on", n);
          try {
            const e = new AbortController();
            let r;
            const i = yield Promise.race([
              new Promise((n, i) => {
                r = window.setTimeout(() => {
                  e.abort("Time limit exceeded"),
                    i({ networkCode: -1, message: "请求超时" });
                }, t);
              }),
              fetch(n, { signal: e.signal }),
            ]);
            clearTimeout(r);
            const { status: o, statusText: a } = i;
            if (o >= 500) return;
            if (o >= 400)
              throw { retry: !1, message: "".concat(o, " ").concat(a) };
            return i.json();
          } catch (e) {
            return e instanceof TypeError
              ? void he.error("bad request with host:", r, e.message)
              : (console.error(r, e), e);
          }
        });
      }
    });
  }
  function Ko(e) {
    return pe(this, void 0, void 0, function* () {
      const t = e.match(
        /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/
      );
      if (
        e.match(
          /^([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])$/
        ) ||
        t
      )
        return e;
      try {
        const t = yield fetch("https://".concat(e, "/ip"));
        return (yield t.json()).ip;
      } catch (t) {
        return (
          he.warning("resolve ice failed, retry", t), yield Vo(1e3), yield Ko(e)
        );
      }
    });
  }
  var Jo;
  !(function (e) {
    e[(e.AudioLevelUnusual = 0)] = "AudioLevelUnusual";
  })(Jo || (Jo = {}));
  class Zo {
    static create(t) {
      this.instance || (this.instance = new Zo());
      const r = this.instance.getValidStandard(t.code);
      return (
        this.instance.qosAddEvent(
          Object.assign(Object.assign({ valid_standard: r }, t), {
            event_grade: e.QNEventGrade.SERVERE,
          })
        ),
        this.instance
      );
    }
    constructor() {}
    qosAddEvent(e) {
      Xi.addEvent("WebSDKException", e);
    }
    getValidStandard(e) {
      if (e === Jo.AudioLevelUnusual) return "0-1";
    }
  }
  class Yo {
    constructor(e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : Yo.AlphaForPacketLossFractionSmoother;
      (this.mLastFilteredTimestamp = Date.now()),
        (this.mMax = Yo.kValueUndefined),
        (this.smooth_interval =
          "audio" === e ? Yo.SMOOTH_AUDIO_INTERVAL : Yo.SMOOTH_VIDEO_INTERVAL),
        this.Reset(t);
    }
    Reset(e) {
      (this.mAlpha = e), (this.mFiltered = Yo.kValueUndefined);
    }
    Apply(e) {
      const t = Date.now() - this.mLastFilteredTimestamp;
      if (t < this.smooth_interval && 0 === e) return void (this.applied = !1);
      let r;
      if (this.mFiltered === Yo.kValueUndefined) r = e;
      else if (1 === t)
        r = this.mAlpha * this.mFiltered + (1 - this.mAlpha) * e;
      else {
        const n = Math.pow(this.mAlpha, t);
        r = n * this.mFiltered + (1 - n) * e;
      }
      isNaN(r) || (this.mFiltered = r),
        this.mMax !== Yo.kValueUndefined &&
          this.mFiltered > this.mMax &&
          (this.mFiltered = this.mMax),
        (this.mLastFilteredTimestamp = Date.now()),
        (this.applied = !0);
    }
    Filtered() {
      return this.mFiltered;
    }
    LastFilteredTime() {
      return this.mLastFilteredTimestamp;
    }
    UpdateBase(e) {
      this.mAlpha = e;
    }
  }
  function $o() {
    const e = {};
    return (t, r) => (t in e || (e[t] = new Yo(r)), e[t]);
  }
  (Yo.kValueUndefined = -1),
    (Yo.AlphaForPacketLossFractionSmoother = 0.9999),
    (Yo.SMOOTH_VIDEO_INTERVAL = 1e3),
    (Yo.SMOOTH_AUDIO_INTERVAL = 5e3);
  const ea = $o(),
    ta = $o(),
    ra = () => ({
      id: "",
      kind: "audio",
      packetLossRate: 0,
      bitrate: 0,
      bytes: 0,
      packets: 0,
      packetLoss: 0,
      frameRate: 0,
      rtt: 0,
      timestamp: Date.now(),
      networkGrade: e.NetworkGrade.INVALID,
    });
  function na(t, r) {
    let n;
    n =
      t > 15 || r > 400
        ? e.NetworkGrade.POOR
        : t > 8 || r > 200
        ? e.NetworkGrade.FAIR
        : t > 1 || r > 100
        ? e.NetworkGrade.GOOD
        : e.NetworkGrade.EXCELLENT;
    const i = navigator;
    return (
      i.connection &&
        i.connection.effectiveType &&
        ["slow-2g", "2g", "3g"].includes(i.connection.effectiveType) &&
        (n = e.NetworkGrade.POOR),
      n
    );
  }
  const ia = {
      track_audio_volume: 0,
      jitter_buffer_delay: 0,
      bytes_sent: 0,
      bytes_received: 0,
    },
    oa = {
      nack_count: 0,
      fir_count: 0,
      pli_count: 0,
      width: 0,
      height: 0,
      jitter_buffer_delay: 0,
      bytes_sent: 0,
      frame_encoded: 0,
      bytes_received: 0,
      frame_decoded: 0,
    },
    aa = {
      frames_received: 0,
      frames_sent: 0,
      packets_lost: 0,
      packets_received: 0,
      packets_sent: 0,
      timestamp: 0,
      bytes_sent: 0,
      bytes_received: 0,
    };
  var sa, ca, da;
  function ua(e, t) {
    return pe(this, void 0, void 0, function* () {
      let r;
      try {
        r = yield e.getStats();
      } catch (e) {
        return (
          he.debug("get media statistic stats error, fallback to default", e),
          []
        );
      }
      if (!r)
        return (
          he.debug("get null media statistic stats, fallback to default"), []
        );
      const n = [...r.values()],
        i = n
          .filter(
            (e) =>
              (e.type === ca.InBoundRtp || e.type === ca.OutBoundRtp) &&
              n.find((t) => t.id === e.trackId && "track" === t.type)
          )
          .map((e) =>
            (function (e, t, r) {
              const n = {
                [ca.MediaSource]: t
                  .filter((e) => e.type === ca.MediaSource)
                  .find((t) => t.id === e.mediaSourceId),
                [ca.Track]: t
                  .filter((e) => e.type === ca.Track)
                  .find((t) => t.id === e.trackId),
                [ca.RemoteInBound]: t
                  .filter((e) => e.type === ca.RemoteInBound)
                  .find((t) => t.id === e.remoteId),
              };
              let i = (function (e, t, r) {
                const n = {
                  id: e,
                  track_id: t,
                  kind: "audio",
                  kbps: 0,
                  framerate: 0,
                  packet_lost_rate: 0,
                  rtt: 0,
                  extra_stats: null,
                  calculation_stats: Object.assign({}, aa),
                };
                return (
                  r === sa.Audio
                    ? (n.extra_stats = Object.assign({}, ia))
                    : (n.extra_stats = Object.assign({}, oa)),
                  n
                );
              })(e.id, e.trackID, e.mediaType);
              (i.rtt = Aa(n[ca.RemoteInBound]) || Aa(e) || 0),
                (i.calculation_stats.packets_lost =
                  ha(e, n[ca.RemoteInBound]) || 0),
                e.mediaType === sa.Video
                  ? ((i = (function (e, t) {
                      return (
                        (t.kind = e.kind),
                        (t.extra_stats.nack_count = e.nackCount),
                        (t.extra_stats.fir_count = e.firCount),
                        (t.extra_stats.pli_count = e.pliCount),
                        (t.extra_stats.bytes_sent = e.bytesSent || 0),
                        (t.extra_stats.frame_encoded = e.framesEncoded || 0),
                        (t.extra_stats.bytes_received = e.bytesReceived || 0),
                        (t.extra_stats.frame_decoded = e.framesDecoded || 0),
                        (t.calculation_stats.bytes_received =
                          e.bytesReceived || 0),
                        (t.calculation_stats.bytes_sent = e.bytesSent || 0),
                        (t.calculation_stats.packets_received =
                          e.packetsReceived || 0),
                        (t.calculation_stats.packets_sent = e.packetsSent || 0),
                        (t.calculation_stats.timestamp = e.timestamp || 0),
                        t
                      );
                    })(e, i)),
                    n[ca.MediaSource] &&
                      (i = (function (e, t) {
                        return (t.framerate = e.framesPerSecond), t;
                      })(n[ca.MediaSource], i)),
                    n[ca.Track] &&
                      (i = (function (e, t, r) {
                        const n = [...r.publishedTracks, ...r.subscribedTracks],
                          i = n.find(
                            (t) => t.mediaTrack.id === e.trackIdentifier
                          );
                        return (
                          (t.track_id = (i && i.info && i.info.trackID) || ""),
                          (t.extra_stats.width = e.frameWidth),
                          (t.extra_stats.height = e.frameHeight),
                          (t.extra_stats.jitter_buffer_delay =
                            e.jitterBufferDelay || 0),
                          (t.calculation_stats.frames_sent = e.framesSent || 0),
                          (t.calculation_stats.frames_received =
                            e.framesReceived || 0),
                          t
                        );
                      })(n[ca.Track], i, r)))
                  : ((i = (function (e, t) {
                      return (
                        (t.kind = e.kind),
                        (t.extra_stats.bytes_sent = e.bytesSent || 0),
                        (t.extra_stats.bytes_received = e.bytesReceived || 0),
                        (t.extra_stats.track_audio_volume = la(
                          e.audioLevel,
                          e.type
                        )),
                        (t.calculation_stats.bytes_received =
                          e.bytesReceived || 0),
                        (t.calculation_stats.bytes_sent = e.bytesSent || 0),
                        (t.calculation_stats.packets_received =
                          e.packetsReceived || 0),
                        (t.calculation_stats.packets_sent = e.packetsSent || 0),
                        (t.calculation_stats.timestamp = e.timestamp || 0),
                        t
                      );
                    })(e, i)),
                    n[ca.MediaSource] &&
                      (i = (function (e, t) {
                        return (
                          (t.extra_stats.track_audio_volume = la(
                            e.audioLevel,
                            e.type
                          )),
                          t
                        );
                      })(n[ca.MediaSource], i)),
                    n[ca.Track] &&
                      (i = (function (e, t, r) {
                        const n = [...r.publishedTracks, ...r.subscribedTracks],
                          i = n.find(
                            (t) => t.mediaTrack.id === e.trackIdentifier
                          );
                        return (
                          (t.track_id = (i && i.info && i.info.trackID) || ""),
                          (t.extra_stats.jitter_buffer_delay =
                            e.jitterBufferDelay || 0),
                          (t.calculation_stats.frames_sent = e.framesSent || 0),
                          (t.calculation_stats.frames_received =
                            e.framesReceived || 0),
                          t
                        );
                      })(n[ca.Track], i, r)));
              return i;
            })(e, n, t)
          );
      return i;
    });
  }
  function la(e, t) {
    let r = e || 0;
    const n = { chrome: ["86.0.4240", "87.0.4280"] };
    return (
      n[hi.name] && n[hi.name].includes(hi.version) && t === ca.InBoundRtp
        ? ((r = Math.min(e / 32767, 1)),
          Zo.create({
            code: Jo.AudioLevelUnusual,
            actual_value: e,
            extra_info: { stats_report_type: t },
          }))
        : (r > 1 || r < 0) &&
          Zo.create({
            code: Jo.AudioLevelUnusual,
            actual_value: e,
            extra_info: { stats_report_type: t },
          }),
      r
    );
  }
  function Aa(e) {
    if (e)
      return e.roundTripTime
        ? 1e3 * e.roundTripTime
        : e.googRtt
        ? e.googRtt
        : e.mozRtt
        ? e.mozRtt
        : void 0;
  }
  function ha(e, t) {
    return "inbound-rtp" === e.type
      ? e.packetsLost
      : "outbound-rtp" === e.type && t
      ? t.packetsLost
      : void 0;
  }
  function fa(e, t, r, n) {
    const i = t - e,
      o = n - r;
    if (i <= 0 || o <= 0) return 0;
    const a = i / o;
    return a > 1 ? 1 : a;
  }
  function pa() {
    const e = {
      bundlePolicy: "max-bundle",
      rtcpMuxPolicy: "require",
      iceServers: [],
    };
    Ti.unifiedPlan
      ? (e.sdpSemantics = "unified-plan")
      : (e.sdpSemantics = "plan-b");
    const t = new RTCPeerConnection(e);
    return (
      Ti.unifiedPlan &&
        Ti.supportTransceivers &&
        (t.addTransceiver("audio", { direction: "inactive" }),
        t.addTransceiver("video", { direction: "inactive" })),
      t
    );
  }
  function ma(e, t, r) {
    let n =
        arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 600,
      i = arguments.length > 4 ? arguments[4] : void 0;
    return pe(this, void 0, void 0, function* () {
      if (r) {
        const o = [
          { rid: "hi", active: !0, maxBitrate: 1e3 * n },
          {
            rid: "lo",
            active: !0,
            maxBitrate: 1e3 * r.bitrate,
            scaleResolutionDownBy: r.scaleResolutionDownBy,
          },
        ];
        return yield t.addTransceiver(e, {
          direction: "sendonly",
          sendEncodings: o,
          streams: [i],
        });
      }
      return yield t.addTransceiver(e, { direction: "sendonly", streams: [i] });
    });
  }
  function ga(e, t, r, n) {
    return pe(this, void 0, void 0, function* () {
      if (Ti.stats) {
        const i = yield (function (e, t, r) {
          return pe(this, void 0, void 0, function* () {
            let n;
            try {
              n = yield e.getStats(t);
            } catch (e) {
              return he.debug("get stats error, fallback to default", e), [];
            }
            if (!n) return he.debug("get null stats, fallback to default"), [];
            const i = [];
            for (const e of n.values())
              if (
                ("send" === r && "outbound-rtp" === e.type && !e.isRemote) ||
                ("recv" === r && "inbound-rtp" === e.type && !e.isRemote)
              ) {
                const t = ra(),
                  o = n.get(e.remoteId);
                (t.packetLoss = ha(e, o) || 0),
                  (t.bytes = "send" === r ? e.bytesSent : e.bytesReceived),
                  (t.packets =
                    "send" === r ? e.packetsSent : e.packetsReceived),
                  (t.rtt = Aa(e) || Aa(o) || 0),
                  (t.id = e.id),
                  (t.kind = e.kind),
                  e.frameWidth && (t.width = e.frameWidth),
                  e.frameHeight && (t.height = e.frameHeight),
                  e.framesPerSecond && (t.frameRate = e.framesPerSecond),
                  e.framerateMean && (t.frameRate = Math.ceil(e.framerateMean)),
                  i.push(t);
              }
            return i;
          });
        })(e, t, r);
        return (function (e, t) {
          if (!t || 0 === t.length) return e;
          if (t.length !== e.length) return e;
          const r = Object.values($n([...e, ...t], "id"));
          if (!r.every((e) => 2 === e.length)) return e;
          return r.map((e) => {
            let [t, r] = e;
            const n = (t.timestamp - r.timestamp) / 1e3;
            if (n <= 0) return t;
            const i = Object.assign({}, t),
              o = fa(r.packetLoss, t.packetLoss, r.packets, t.packets);
            i.networkGrade = na(o, i.rtt);
            const a = ea(t.id, t.kind);
            return (
              a.Apply(o),
              (i.packetLossRate = a.Filtered() < 0 ? 0 : a.Filtered()),
              (i.bitrate = (8 * (t.bytes - r.bytes)) / n),
              i.bitrate < 0 ? r : i
            );
          });
        })(i, n);
      }
      return (
        qo(() => {
          he.warning("your browser does not support getStats");
        }, "not-support-stats-warning"),
        []
      );
    });
  }
  !(function (e) {
    (e.Video = "video"), (e.Audio = "audio");
  })(sa || (sa = {})),
    (function (e) {
      (e.MediaSource = "media-source"),
        (e.Track = "track"),
        (e.OutBoundRtp = "outbound-rtp"),
        (e.InBoundRtp = "inbound-rtp"),
        (e.RemoteInBound = "remote-inbound-rtp");
    })(ca || (ca = {})),
    (function (e) {
      (e.In = "in"), (e.Out = "out");
    })(da || (da = {})),
    window.addEventListener("message", (e) => {
      e.origin === window.location.origin &&
        (function (e) {
          if ("PermissionDeniedError" === e) {
            if (((ba = "PermissionDeniedError"), Ta))
              return Ta("PermissionDeniedError");
            throw ho();
          }
          "qnrtc:rtcmulticonnection-extension-loaded" === e && (ba = "desktop");
          "rtcmulticonnection-extension-loaded" === e &&
            (he.warning(
              "your chrome screen sharing plugin is not the latest version, or you have other screen sharing plugins."
            ),
            (Sa = !1));
          e.sourceId &&
            Ta &&
            Ta((va = e.sourceId), !0 === e.canRequestAudioTrack);
        })(e.data);
    });
  let va,
    Ta,
    ba = "screen",
    Sa = !0;
  function ya() {
    return pe(this, void 0, void 0, function* () {
      return yield new Promise((e, t) => {
        "desktop" !== ba
          ? (window.postMessage("qnrtc:are-you-there", "*"),
            setTimeout(() => {
              e("screen" !== ba);
            }, 2e3))
          : e(!0);
      });
    });
  }
  function ka(e, t) {
    return pe(this, void 0, void 0, function* () {
      const r = t.source;
      return yield new Promise((n, i) => {
        const o = {
          mozMediaSource: r || "window",
          mediaSource: r || "window",
          height: t.height,
          width: t.width,
        };
        if (ui) return void n(o);
        const a = {
          mandatory: {
            chromeMediaSource: ba,
            maxWidth: Ha(t.width),
            maxHeight: Ha(t.height),
          },
          optional: [],
        };
        "desktop" !== ba
          ? n(a)
          : e
          ? (function (e) {
              if (va) return e(va);
              (Ta = e), window.postMessage("qnrtc:audio-plus-tab", "*");
            })(function (e, t) {
              (a.mandatory.chromeMediaSourceId = e),
                t && (a.canRequestAudioTrack = !0),
                "PermissionDeniedError" !== e ? n(a) : i(ho());
            })
          : (function (e) {
              let t =
                arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
              (Ta = e),
                arguments.length > 1 && void 0 !== arguments[1] && arguments[1]
                  ? window.postMessage("qnrtc:get-sourceId-screen", "*")
                  : t
                  ? window.postMessage("qnrtc:get-sourceId-window", "*")
                  : window.postMessage("qnrtc:get-sourceId", "*");
            })(
              function (e) {
                (a.mandatory.chromeMediaSourceId = e),
                  "PermissionDeniedError" !== e ? n(a) : i(ho());
              },
              "screen" === r,
              "window" === r
            );
      });
    });
  }
  var _a = { exports: {} };
  !(function (e, t) {
    var r = 200,
      n = "__lodash_hash_undefined__",
      i = 1,
      o = 2,
      a = 1 / 0,
      s = 9007199254740991,
      c = "[object Arguments]",
      d = "[object Array]",
      u = "[object Boolean]",
      l = "[object Date]",
      A = "[object Error]",
      h = "[object Function]",
      f = "[object GeneratorFunction]",
      p = "[object Map]",
      m = "[object Number]",
      g = "[object Object]",
      v = "[object Promise]",
      T = "[object RegExp]",
      b = "[object Set]",
      S = "[object String]",
      y = "[object Symbol]",
      k = "[object WeakMap]",
      _ = "[object ArrayBuffer]",
      w = "[object DataView]",
      E = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      C = /^\w*$/,
      I = /^\./,
      P =
        /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
      R = /\\(\\)?/g,
      M = /^\[object .+?Constructor\]$/,
      D = /^(?:0|[1-9]\d*)$/,
      O = {};
    (O["[object Float32Array]"] =
      O["[object Float64Array]"] =
      O["[object Int8Array]"] =
      O["[object Int16Array]"] =
      O["[object Int32Array]"] =
      O["[object Uint8Array]"] =
      O["[object Uint8ClampedArray]"] =
      O["[object Uint16Array]"] =
      O["[object Uint32Array]"] =
        !0),
      (O[c] =
        O[d] =
        O[_] =
        O[u] =
        O[w] =
        O[l] =
        O[A] =
        O[h] =
        O[p] =
        O[m] =
        O[g] =
        O[T] =
        O[b] =
        O[S] =
        O[k] =
          !1);
    var N = "object" == typeof X && X && X.Object === Object && X,
      x = "object" == typeof self && self && self.Object === Object && self,
      L = N || x || Function("return this")(),
      B = t && !t.nodeType && t,
      G = B && e && !e.nodeType && e,
      H = G && G.exports === B && N.process,
      j = (function () {
        try {
          return H && H.binding("util");
        } catch (e) {}
      })(),
      F = j && j.isTypedArray;
    function V(e, t) {
      return (
        !!(e ? e.length : 0) &&
        (function (e, t, r) {
          if (t != t)
            return (function (e, t, r, n) {
              var i = e.length,
                o = r + (n ? 1 : -1);
              for (; n ? o-- : ++o < i; ) if (t(e[o], o, e)) return o;
              return -1;
            })(e, Q, r);
          var n = r - 1,
            i = e.length;
          for (; ++n < i; ) if (e[n] === t) return n;
          return -1;
        })(e, t, 0) > -1
      );
    }
    function U(e, t, r) {
      for (var n = -1, i = e ? e.length : 0; ++n < i; )
        if (r(t, e[n])) return !0;
      return !1;
    }
    function q(e, t) {
      for (var r = -1, n = e ? e.length : 0; ++r < n; )
        if (t(e[r], r, e)) return !0;
      return !1;
    }
    function Q(e) {
      return e != e;
    }
    function W(e, t) {
      return e.has(t);
    }
    function z(e) {
      var t = !1;
      if (null != e && "function" != typeof e.toString)
        try {
          t = !!(e + "");
        } catch (e) {}
      return t;
    }
    function K(e) {
      var t = -1,
        r = Array(e.size);
      return (
        e.forEach(function (e, n) {
          r[++t] = [n, e];
        }),
        r
      );
    }
    function J(e) {
      var t = -1,
        r = Array(e.size);
      return (
        e.forEach(function (e) {
          r[++t] = e;
        }),
        r
      );
    }
    var Z,
      Y,
      $,
      ee = Array.prototype,
      te = Function.prototype,
      re = Object.prototype,
      ne = L["__core-js_shared__"],
      ie = (Z = /[^.]+$/.exec((ne && ne.keys && ne.keys.IE_PROTO) || ""))
        ? "Symbol(src)_1." + Z
        : "",
      oe = te.toString,
      ae = re.hasOwnProperty,
      se = re.toString,
      ce = RegExp(
        "^" +
          oe
            .call(ae)
            .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
            .replace(
              /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
              "$1.*?"
            ) +
          "$"
      ),
      de = L.Symbol,
      ue = L.Uint8Array,
      le = re.propertyIsEnumerable,
      Ae = ee.splice,
      he =
        ((Y = Object.keys),
        ($ = Object),
        function (e) {
          return Y($(e));
        }),
      fe = Qe(L, "DataView"),
      pe = Qe(L, "Map"),
      me = Qe(L, "Promise"),
      ge = Qe(L, "Set"),
      ve = Qe(L, "WeakMap"),
      Te = Qe(Object, "create"),
      be = $e(fe),
      Se = $e(pe),
      ye = $e(me),
      ke = $e(ge),
      _e = $e(ve),
      we = de ? de.prototype : void 0,
      Ee = we ? we.valueOf : void 0,
      Ce = we ? we.toString : void 0;
    function Ie(e) {
      var t = -1,
        r = e ? e.length : 0;
      for (this.clear(); ++t < r; ) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function Pe(e) {
      var t = -1,
        r = e ? e.length : 0;
      for (this.clear(); ++t < r; ) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function Re(e) {
      var t = -1,
        r = e ? e.length : 0;
      for (this.clear(); ++t < r; ) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function Me(e) {
      var t = -1,
        r = e ? e.length : 0;
      for (this.__data__ = new Re(); ++t < r; ) this.add(e[t]);
    }
    function De(e) {
      this.__data__ = new Pe(e);
    }
    function Oe(e, t) {
      var r =
          nt(e) || rt(e)
            ? (function (e, t) {
                for (var r = -1, n = Array(e); ++r < e; ) n[r] = t(r);
                return n;
              })(e.length, String)
            : [],
        n = r.length,
        i = !!n;
      for (var o in e)
        (!t && !ae.call(e, o)) ||
          (i && ("length" == o || ze(o, n))) ||
          r.push(o);
      return r;
    }
    function Ne(e, t) {
      for (var r = e.length; r--; ) if (tt(e[r][0], t)) return r;
      return -1;
    }
    function xe(e, t) {
      for (
        var r = 0, n = (t = Xe(t, e) ? [t] : Fe(t)).length;
        null != e && r < n;

      )
        e = e[Ye(t[r++])];
      return r && r == n ? e : void 0;
    }
    function Le(e, t) {
      return null != e && t in Object(e);
    }
    function Be(e, t, r, n, a) {
      return (
        e === t ||
        (null == e || null == t || (!st(e) && !ct(t))
          ? e != e && t != t
          : (function (e, t, r, n, a, s) {
              var h = nt(e),
                f = nt(t),
                v = d,
                k = d;
              h || (v = (v = We(e)) == c ? g : v);
              f || (k = (k = We(t)) == c ? g : k);
              var E = v == g && !z(e),
                C = k == g && !z(t),
                I = v == k;
              if (I && !E)
                return (
                  s || (s = new De()),
                  h || ut(e)
                    ? Ue(e, t, r, n, a, s)
                    : (function (e, t, r, n, a, s, c) {
                        switch (r) {
                          case w:
                            if (
                              e.byteLength != t.byteLength ||
                              e.byteOffset != t.byteOffset
                            )
                              return !1;
                            (e = e.buffer), (t = t.buffer);
                          case _:
                            return !(
                              e.byteLength != t.byteLength ||
                              !n(new ue(e), new ue(t))
                            );
                          case u:
                          case l:
                          case m:
                            return tt(+e, +t);
                          case A:
                            return e.name == t.name && e.message == t.message;
                          case T:
                          case S:
                            return e == t + "";
                          case p:
                            var d = K;
                          case b:
                            var h = s & o;
                            if ((d || (d = J), e.size != t.size && !h))
                              return !1;
                            var f = c.get(e);
                            if (f) return f == t;
                            (s |= i), c.set(e, t);
                            var g = Ue(d(e), d(t), n, a, s, c);
                            return c.delete(e), g;
                          case y:
                            if (Ee) return Ee.call(e) == Ee.call(t);
                        }
                        return !1;
                      })(e, t, v, r, n, a, s)
                );
              if (!(a & o)) {
                var P = E && ae.call(e, "__wrapped__"),
                  R = C && ae.call(t, "__wrapped__");
                if (P || R) {
                  var M = P ? e.value() : e,
                    D = R ? t.value() : t;
                  return s || (s = new De()), r(M, D, n, a, s);
                }
              }
              if (!I) return !1;
              return (
                s || (s = new De()),
                (function (e, t, r, n, i, a) {
                  var s = i & o,
                    c = lt(e),
                    d = c.length,
                    u = lt(t),
                    l = u.length;
                  if (d != l && !s) return !1;
                  var A = d;
                  for (; A--; ) {
                    var h = c[A];
                    if (!(s ? h in t : ae.call(t, h))) return !1;
                  }
                  var f = a.get(e);
                  if (f && a.get(t)) return f == t;
                  var p = !0;
                  a.set(e, t), a.set(t, e);
                  var m = s;
                  for (; ++A < d; ) {
                    var g = e[(h = c[A])],
                      v = t[h];
                    if (n)
                      var T = s ? n(v, g, h, t, e, a) : n(g, v, h, e, t, a);
                    if (!(void 0 === T ? g === v || r(g, v, n, i, a) : T)) {
                      p = !1;
                      break;
                    }
                    m || (m = "constructor" == h);
                  }
                  if (p && !m) {
                    var b = e.constructor,
                      S = t.constructor;
                    b == S ||
                      !("constructor" in e) ||
                      !("constructor" in t) ||
                      ("function" == typeof b &&
                        b instanceof b &&
                        "function" == typeof S &&
                        S instanceof S) ||
                      (p = !1);
                  }
                  return a.delete(e), a.delete(t), p;
                })(e, t, r, n, a, s)
              );
            })(e, t, Be, r, n, a))
      );
    }
    function Ge(e) {
      return (
        !(
          !st(e) ||
          (function (e) {
            return !!ie && ie in e;
          })(e)
        ) && (ot(e) || z(e) ? ce : M).test($e(e))
      );
    }
    function He(e) {
      return "function" == typeof e
        ? e
        : null == e
        ? At
        : "object" == typeof e
        ? nt(e)
          ? (function (e, t) {
              if (Xe(e) && Ke(t)) return Je(Ye(e), t);
              return function (r) {
                var n = (function (e, t, r) {
                  var n = null == e ? void 0 : xe(e, t);
                  return void 0 === n ? r : n;
                })(r, e);
                return void 0 === n && n === t
                  ? (function (e, t) {
                      return (
                        null != e &&
                        (function (e, t, r) {
                          t = Xe(t, e) ? [t] : Fe(t);
                          var n,
                            i = -1,
                            o = t.length;
                          for (; ++i < o; ) {
                            var a = Ye(t[i]);
                            if (!(n = null != e && r(e, a))) break;
                            e = e[a];
                          }
                          if (n) return n;
                          o = e ? e.length : 0;
                          return !!o && at(o) && ze(a, o) && (nt(e) || rt(e));
                        })(e, t, Le)
                      );
                    })(r, e)
                  : Be(t, n, void 0, i | o);
              };
            })(e[0], e[1])
          : (function (e) {
              var t = (function (e) {
                var t = lt(e),
                  r = t.length;
                for (; r--; ) {
                  var n = t[r],
                    i = e[n];
                  t[r] = [n, i, Ke(i)];
                }
                return t;
              })(e);
              if (1 == t.length && t[0][2]) return Je(t[0][0], t[0][1]);
              return function (r) {
                return (
                  r === e ||
                  (function (e, t, r, n) {
                    var a = r.length,
                      s = a,
                      c = !n;
                    if (null == e) return !s;
                    for (e = Object(e); a--; ) {
                      var d = r[a];
                      if (c && d[2] ? d[1] !== e[d[0]] : !(d[0] in e))
                        return !1;
                    }
                    for (; ++a < s; ) {
                      var u = (d = r[a])[0],
                        l = e[u],
                        A = d[1];
                      if (c && d[2]) {
                        if (void 0 === l && !(u in e)) return !1;
                      } else {
                        var h = new De();
                        if (n) var f = n(l, A, u, e, t, h);
                        if (!(void 0 === f ? Be(A, l, n, i | o, h) : f))
                          return !1;
                      }
                    }
                    return !0;
                  })(r, e, t)
                );
              };
            })(e)
        : Xe((t = e))
        ? ((r = Ye(t)),
          function (e) {
            return null == e ? void 0 : e[r];
          })
        : (function (e) {
            return function (t) {
              return xe(t, e);
            };
          })(t);
      var t, r;
    }
    function je(e) {
      if (
        ((r = (t = e) && t.constructor),
        (n = ("function" == typeof r && r.prototype) || re),
        t !== n)
      )
        return he(e);
      var t,
        r,
        n,
        i = [];
      for (var o in Object(e)) ae.call(e, o) && "constructor" != o && i.push(o);
      return i;
    }
    function Fe(e) {
      return nt(e) ? e : Ze(e);
    }
    (Ie.prototype.clear = function () {
      this.__data__ = Te ? Te(null) : {};
    }),
      (Ie.prototype.delete = function (e) {
        return this.has(e) && delete this.__data__[e];
      }),
      (Ie.prototype.get = function (e) {
        var t = this.__data__;
        if (Te) {
          var r = t[e];
          return r === n ? void 0 : r;
        }
        return ae.call(t, e) ? t[e] : void 0;
      }),
      (Ie.prototype.has = function (e) {
        var t = this.__data__;
        return Te ? void 0 !== t[e] : ae.call(t, e);
      }),
      (Ie.prototype.set = function (e, t) {
        return (this.__data__[e] = Te && void 0 === t ? n : t), this;
      }),
      (Pe.prototype.clear = function () {
        this.__data__ = [];
      }),
      (Pe.prototype.delete = function (e) {
        var t = this.__data__,
          r = Ne(t, e);
        return !(r < 0) && (r == t.length - 1 ? t.pop() : Ae.call(t, r, 1), !0);
      }),
      (Pe.prototype.get = function (e) {
        var t = this.__data__,
          r = Ne(t, e);
        return r < 0 ? void 0 : t[r][1];
      }),
      (Pe.prototype.has = function (e) {
        return Ne(this.__data__, e) > -1;
      }),
      (Pe.prototype.set = function (e, t) {
        var r = this.__data__,
          n = Ne(r, e);
        return n < 0 ? r.push([e, t]) : (r[n][1] = t), this;
      }),
      (Re.prototype.clear = function () {
        this.__data__ = {
          hash: new Ie(),
          map: new (pe || Pe)(),
          string: new Ie(),
        };
      }),
      (Re.prototype.delete = function (e) {
        return qe(this, e).delete(e);
      }),
      (Re.prototype.get = function (e) {
        return qe(this, e).get(e);
      }),
      (Re.prototype.has = function (e) {
        return qe(this, e).has(e);
      }),
      (Re.prototype.set = function (e, t) {
        return qe(this, e).set(e, t), this;
      }),
      (Me.prototype.add = Me.prototype.push =
        function (e) {
          return this.__data__.set(e, n), this;
        }),
      (Me.prototype.has = function (e) {
        return this.__data__.has(e);
      }),
      (De.prototype.clear = function () {
        this.__data__ = new Pe();
      }),
      (De.prototype.delete = function (e) {
        return this.__data__.delete(e);
      }),
      (De.prototype.get = function (e) {
        return this.__data__.get(e);
      }),
      (De.prototype.has = function (e) {
        return this.__data__.has(e);
      }),
      (De.prototype.set = function (e, t) {
        var n = this.__data__;
        if (n instanceof Pe) {
          var i = n.__data__;
          if (!pe || i.length < r - 1) return i.push([e, t]), this;
          n = this.__data__ = new Re(i);
        }
        return n.set(e, t), this;
      });
    var Ve =
      ge && 1 / J(new ge([, -0]))[1] == a
        ? function (e) {
            return new ge(e);
          }
        : function () {};
    function Ue(e, t, r, n, a, s) {
      var c = a & o,
        d = e.length,
        u = t.length;
      if (d != u && !(c && u > d)) return !1;
      var l = s.get(e);
      if (l && s.get(t)) return l == t;
      var A = -1,
        h = !0,
        f = a & i ? new Me() : void 0;
      for (s.set(e, t), s.set(t, e); ++A < d; ) {
        var p = e[A],
          m = t[A];
        if (n) var g = c ? n(m, p, A, t, e, s) : n(p, m, A, e, t, s);
        if (void 0 !== g) {
          if (g) continue;
          h = !1;
          break;
        }
        if (f) {
          if (
            !q(t, function (e, t) {
              if (!f.has(t) && (p === e || r(p, e, n, a, s))) return f.add(t);
            })
          ) {
            h = !1;
            break;
          }
        } else if (p !== m && !r(p, m, n, a, s)) {
          h = !1;
          break;
        }
      }
      return s.delete(e), s.delete(t), h;
    }
    function qe(e, t) {
      var r = e.__data__;
      return (function (e) {
        var t = typeof e;
        return "string" == t || "number" == t || "symbol" == t || "boolean" == t
          ? "__proto__" !== e
          : null === e;
      })(t)
        ? r["string" == typeof t ? "string" : "hash"]
        : r.map;
    }
    function Qe(e, t) {
      var r = (function (e, t) {
        return null == e ? void 0 : e[t];
      })(e, t);
      return Ge(r) ? r : void 0;
    }
    var We = function (e) {
      return se.call(e);
    };
    function ze(e, t) {
      return (
        !!(t = null == t ? s : t) &&
        ("number" == typeof e || D.test(e)) &&
        e > -1 &&
        e % 1 == 0 &&
        e < t
      );
    }
    function Xe(e, t) {
      if (nt(e)) return !1;
      var r = typeof e;
      return (
        !(
          "number" != r &&
          "symbol" != r &&
          "boolean" != r &&
          null != e &&
          !dt(e)
        ) ||
        C.test(e) ||
        !E.test(e) ||
        (null != t && e in Object(t))
      );
    }
    function Ke(e) {
      return e == e && !st(e);
    }
    function Je(e, t) {
      return function (r) {
        return null != r && r[e] === t && (void 0 !== t || e in Object(r));
      };
    }
    ((fe && We(new fe(new ArrayBuffer(1))) != w) ||
      (pe && We(new pe()) != p) ||
      (me && We(me.resolve()) != v) ||
      (ge && We(new ge()) != b) ||
      (ve && We(new ve()) != k)) &&
      (We = function (e) {
        var t = se.call(e),
          r = t == g ? e.constructor : void 0,
          n = r ? $e(r) : void 0;
        if (n)
          switch (n) {
            case be:
              return w;
            case Se:
              return p;
            case ye:
              return v;
            case ke:
              return b;
            case _e:
              return k;
          }
        return t;
      });
    var Ze = et(function (e) {
      var t;
      e =
        null == (t = e)
          ? ""
          : (function (e) {
              if ("string" == typeof e) return e;
              if (dt(e)) return Ce ? Ce.call(e) : "";
              var t = e + "";
              return "0" == t && 1 / e == -a ? "-0" : t;
            })(t);
      var r = [];
      return (
        I.test(e) && r.push(""),
        e.replace(P, function (e, t, n, i) {
          r.push(n ? i.replace(R, "$1") : t || e);
        }),
        r
      );
    });
    function Ye(e) {
      if ("string" == typeof e || dt(e)) return e;
      var t = e + "";
      return "0" == t && 1 / e == -a ? "-0" : t;
    }
    function $e(e) {
      if (null != e) {
        try {
          return oe.call(e);
        } catch (e) {}
        try {
          return e + "";
        } catch (e) {}
      }
      return "";
    }
    function et(e, t) {
      if ("function" != typeof e || (t && "function" != typeof t))
        throw new TypeError("Expected a function");
      var r = function () {
        var n = arguments,
          i = t ? t.apply(this, n) : n[0],
          o = r.cache;
        if (o.has(i)) return o.get(i);
        var a = e.apply(this, n);
        return (r.cache = o.set(i, a)), a;
      };
      return (r.cache = new (et.Cache || Re)()), r;
    }
    function tt(e, t) {
      return e === t || (e != e && t != t);
    }
    function rt(e) {
      return (
        (function (e) {
          return ct(e) && it(e);
        })(e) &&
        ae.call(e, "callee") &&
        (!le.call(e, "callee") || se.call(e) == c)
      );
    }
    et.Cache = Re;
    var nt = Array.isArray;
    function it(e) {
      return null != e && at(e.length) && !ot(e);
    }
    function ot(e) {
      var t = st(e) ? se.call(e) : "";
      return t == h || t == f;
    }
    function at(e) {
      return "number" == typeof e && e > -1 && e % 1 == 0 && e <= s;
    }
    function st(e) {
      var t = typeof e;
      return !!e && ("object" == t || "function" == t);
    }
    function ct(e) {
      return !!e && "object" == typeof e;
    }
    function dt(e) {
      return "symbol" == typeof e || (ct(e) && se.call(e) == y);
    }
    var ut = F
      ? (function (e) {
          return function (t) {
            return e(t);
          };
        })(F)
      : function (e) {
          return ct(e) && at(e.length) && !!O[se.call(e)];
        };
    function lt(e) {
      return it(e) ? Oe(e) : je(e);
    }
    function At(e) {
      return e;
    }
    e.exports = function (e, t) {
      return e && e.length
        ? (function (e, t, n) {
            var i = -1,
              o = V,
              a = e.length,
              s = !0,
              c = [],
              d = c;
            if (n) (s = !1), (o = U);
            else if (a >= r) {
              var u = t ? null : Ve(e);
              if (u) return J(u);
              (s = !1), (o = W), (d = new Me());
            } else d = t ? [] : c;
            e: for (; ++i < a; ) {
              var l = e[i],
                A = t ? t(l) : l;
              if (((l = n || 0 !== l ? l : 0), s && A == A)) {
                for (var h = d.length; h--; ) if (d[h] === A) continue e;
                t && d.push(A), c.push(l);
              } else o(d, A, n) || (d !== c && d.push(A), c.push(l));
            }
            return c;
          })(e, He(t))
        : [];
    };
  })(_a, _a.exports);
  var wa = K(_a.exports);
  class Ea {
    constructor(e, t) {
      (this.tracks = []),
        (this.publishedTrackInfo = []),
        (this.userID = e),
        (this.userData = t);
    }
    get published() {
      return this.publishedTrackInfo.length > 0;
    }
    addTracks(e) {
      (this.tracks = this.tracks.concat(e)),
        (this.tracks = wa(this.tracks, "mediaTrack"));
      for (const e of this.tracks)
        e.once("release", () => {
          ge(this.tracks, (t) => t === e);
        });
    }
    removeTracksByTrackId(e) {
      ge(
        this.tracks,
        (t) => !!t.info.trackID && -1 !== e.indexOf(t.info.trackID)
      );
    }
    addPublishedTrackInfo(e) {
      (this.publishedTrackInfo = this.publishedTrackInfo.concat(e)),
        (this.publishedTrackInfo = wa(this.publishedTrackInfo, "trackID"));
    }
    removePublishedTrackInfo(e) {
      ge(this.publishedTrackInfo, (t) => -1 !== e.indexOf(t.trackID));
    }
  }
  function Ca(e) {
    const t = document.createElement("audio"),
      r = new MediaStream([e]);
    return (
      (t.style.visibility = "hidden"),
      (t.className = "qnrtc-audio-player qnrtc-stream-player"),
      (t.dataset.localid = e.id),
      (t.srcObject = r),
      (t.autoplay = !0),
      { element: t, stream: r }
    );
  }
  function Ia(e) {
    const t = document.createElement("video"),
      r = new MediaStream([e]);
    return (
      (t.style.width = "100%"),
      (t.style.height = "100%"),
      (t.style.objectFit = "contain"),
      (t.muted = !0),
      (t.className = "qnrtc-video-player qnrtc-stream-player"),
      (t.dataset.localid = e.id),
      t.setAttribute("playsinline", !0),
      (t.autoplay = !0),
      (t.srcObject = r),
      Ai &&
        (t.setAttribute("controls", !0),
        Ho(() => {
          t && t.srcObject && t.removeAttribute("controls");
        })),
      { element: t, stream: r }
    );
  }
  class Pa extends le {
    safeEmit(e) {
      try {
        for (
          var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1;
          n < t;
          n++
        )
          r[n - 1] = arguments[n];
        this.emit(e, ...r);
      } catch (t) {
        he.warning(
          "safeEmit() | event listener threw an error [event:%s]:%o",
          e,
          t
        );
      }
    }
    safeEmitAsPromise(e) {
      for (
        var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1;
        n < t;
        n++
      )
        r[n - 1] = arguments[n];
      return new Promise((t, n) => {
        const i = t;
        this.safeEmit(e, ...r, i, (t) => {
          he.warning(
            "safeEmitAsPromise() | errback called [event:%s]:%o",
            e,
            t
          ),
            n(t);
        });
      });
    }
  }
  class Ra extends Pa {
    setPlaybackDevice(e) {
      return pe(this, void 0, void 0, function* () {
        if (
          (Ti.setPlaybackDevice || eo("setPlaybackDevice api not support"),
          (this.playbackDevice = e),
          this.mediaElement)
        )
          return this.mediaElement.setSinkId(e);
      });
    }
    constructor(t, r, n, i) {
      super(),
        (this.master = !1),
        (this.stats = []),
        (this.isReplacedByImageTrack = !1),
        (this.direction = "local"),
        (this.sourceType = e.TrackSourceType.NORMAL),
        (this.onended = (t) =>
          pe(this, void 0, void 0, function* () {
            "local" === this.direction
              ? (he.warning("track ended", this.mediaTrack, this.info.trackID),
                this.info.trackID &&
                  this._selfEndedCallback &&
                  (yield this._selfEndedCallback([this.info.trackID])),
                this.emit("ended", t),
                Xi.addEvent("TrackEnded", {
                  track_id: this.info.trackID,
                  kind: this.info.kind,
                  label: this.mediaTrack.label,
                  event_grade: e.QNEventGrade.SERVERE,
                }),
                this.release())
              : this.emit("@ended", t);
          })),
        (this.mediaTrack = t),
        this.mediaTrack.addEventListener("ended", this.onended),
        (this.userID = r),
        n && (this.direction = n),
        (this.info = {
          kind: t.kind,
          muted: !t.enabled,
          userID: this.userID,
          versionid: 0,
          profiles: i || [],
        }),
        (this.handleMediaPause = this.handleMediaPause.bind(this));
    }
    play(t, r) {
      let n =
        arguments.length > 2 && void 0 !== arguments[2]
          ? arguments[2]
          : { mirror: !1 };
      return new Promise((i, o) => {
        this.removeMediaElement();
        const a = "video" === this.info.kind ? Ia : Ca,
          { element: s, stream: c } = a(this.mediaTrack);
        (this.mediaElement = s),
          "audio" === this.info.kind &&
            void 0 !== r &&
            (this.mediaElement.muted = r),
          n.mirror
            ? (this.mediaElement.style.transform = "rotateY(180deg)")
            : (this.mediaElement.style.transform = ""),
          this.mediaElement.setAttribute("controls", !0),
          t.appendChild(this.mediaElement),
          (this.mediaElement.onplaying = () => {
            this.mediaElement && (this.mediaElement.onplaying = null), i();
          }),
          Promise.resolve()
            .then(() => {
              if (
                (this.mediaElement.removeAttribute("controls"),
                this.playbackDevice)
              )
                return this.setPlaybackDevice(this.playbackDevice);
            })
            .then(() => {
              (function (e) {
                let t =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : 3e3;
                const r = () =>
                  pe(this, void 0, void 0, function* () {
                    if (
                      (Rc.deviceManager &&
                        Rc.deviceManager.currentPlaybackDeviceID &&
                        e.setSinkId &&
                        e.setSinkId(Rc.deviceManager.currentPlaybackDeviceID),
                      e.paused)
                    )
                      return e.play();
                  });
                return new Promise((n, i) => {
                  const o = setTimeout(() => {
                    r().then(n).catch(i);
                  }, t);
                  (e.onloadedmetadata = () => {
                    clearTimeout(o), r().then(n).catch(i);
                  }),
                    "WeixinJSBridge" in window
                      ? window.WeixinJSBridge.invoke(
                          "getNetworkType",
                          {},
                          () => {
                            r().then(n).catch(Bo);
                          },
                          !1
                        )
                      : document.addEventListener(
                          "WeixinJSBridgeReady",
                          () => {
                            r().then(n).catch(Bo);
                          },
                          !1
                        );
                });
              })(this.mediaElement)
                .then(i)
                .catch((t) => {
                  const r =
                    t instanceof Error
                      ? t.name + ", " + t.message
                      : "play failed" + String(t);
                  "NotAllowedError" === t.name
                    ? (o(to(r)),
                      Xi.addEvent("AutoplayFail", {
                        track_id: this.info.trackID,
                        local_id: this.mediaTrack.id,
                        label: this.mediaTrack.label,
                        kind: this.info.kind,
                        reason: r,
                        event_grade: e.QNEventGrade.SERVERE,
                      }))
                    : o(Yi(r));
                });
            });
      });
    }
    handleMediaPause() {
      setTimeout(() => this.mediaElement.play().catch(Qo), 900);
    }
    switchPlayingTrack() {
      if (this.mediaElement) {
        if (this.isReplacedByImageTrack && this.imageStreamTrack)
          this.mediaElement.srcObject = new MediaStream([
            this.imageStreamTrack.mediaTrack,
          ]);
        else {
          if (this.isReplacedByImageTrack || !this.mediaTrack) return;
          this.mediaElement.srcObject = new MediaStream([this.mediaTrack]);
        }
        this.mediaElement.paused || this.mediaElement.play().catch(Qo);
      }
    }
    resume(e) {
      if (
        (this.mediaTrack.removeEventListener("ended", this.onended),
        this.mediaTrack.stop(),
        (this.mediaTrack = e),
        this.mediaTrack.addEventListener("ended", this.onended),
        this.mediaElement)
      ) {
        const t = new MediaStream([e]);
        (this.mediaElement.dataset.localid = e.id),
          (this.mediaElement.srcObject = t);
      }
      this.removeAllListeners("@get-stats"), this.resetStats();
    }
    getStats() {
      return this.statsInterval || this.startGetStatsInterval(), this.stats;
    }
    getCurrentFrameDataURL() {
      return this.mediaElement && this.mediaElement instanceof HTMLVideoElement
        ? (function (e) {
            const t = document.createElement("canvas");
            (t.width = e.videoWidth), (t.height = e.videoHeight);
            const r = t.getContext("2d");
            return r
              ? (r.drawImage(e, 0, 0, e.videoWidth, e.videoHeight),
                t.toDataURL())
              : "data:,";
          })(this.mediaElement)
        : "data:,";
    }
    setMaster(e) {
      this.master = e;
    }
    setMute(e) {
      (this.info.muted = e),
        (this.mediaTrack.enabled = !e),
        this.emit("mute", e);
    }
    setKbps(e) {
      this.info.kbps = e;
    }
    setInfo(e) {
      this.info = Object.assign(Object.assign({}, this.info), e);
    }
    removeMediaElement() {
      this.mediaElement &&
        (this.mediaElement.removeEventListener("pause", this.handleMediaPause),
        this.mediaElement.remove(),
        (this.mediaElement = void 0));
    }
    release() {
      this.emit("release"),
        this.removeAllListeners(),
        this.statsInterval && window.clearInterval(this.statsInterval),
        ("local" !== this.direction && Ti.unifiedPlan) ||
          this.mediaTrack.stop(),
        this.removeMediaElement(),
        this.imageStreamTrack &&
          (this.imageStreamTrack.release(), (this.imageStreamTrack = void 0)),
        this.remoteAudioHelper &&
          (this.remoteAudioHelper.release(), (this.remoteAudioHelper = void 0));
    }
    reset() {
      (this.info.trackID = void 0),
        (this.info.userID = void 0),
        (this.info.versionid = 0),
        (this.userID = void 0),
        this.resetStats();
    }
    resetStats() {
      (this.stats = []), (this.lastStats = []);
    }
    startGetStatsInterval() {
      return pe(this, void 0, void 0, function* () {
        this.statsInterval = window.setInterval(
          () =>
            pe(this, void 0, void 0, function* () {
              const e = this.listeners("@get-stats");
              if (!e || 0 === e.length) return [];
              (this.stats = yield this.safeEmitAsPromise(
                "@get-stats",
                this.lastStats
              )),
                (this.lastStats = [...this.stats]);
            }),
          1e3
        );
      });
    }
    set selfEndedCallback(e) {
      this._selfEndedCallback = e;
    }
    setVolume(e) {
      he.warning("not implement");
    }
    getCurrentTimeDomainData() {
      return he.warning("not implement"), new Uint8Array();
    }
    getCurrentFrequencyData() {
      return he.warning("not implement"), new Uint8Array();
    }
    getVolume() {
      return he.warning("not implement"), 0;
    }
    getCurrentVolumeLevel() {
      return he.warning("not implement"), 0;
    }
    setLoop(e) {
      he.warning("not implement");
    }
    startAudioSource() {
      he.warning("not implement");
    }
    pauseAudioSource() {
      he.warning("not implement");
    }
    resumeAudioSource() {
      he.warning("not implement");
    }
    stopAudioSource() {
      he.warning("not implement");
    }
    getCurrentTime() {
      return he.warning("not implement"), 0;
    }
    setCurrentTime(e) {
      he.warning("not implement");
    }
    getDuration() {
      return he.warning("not implement"), 0;
    }
  }
  function Ma(e) {
    return {
      timestamp: e.msgts,
      data: e.text,
      userID: e.playerid,
      type: e.type,
      msgid: e.msgid,
    };
  }
  function Da(e) {
    return {
      trackID: e.trackid,
      tag: e.tag,
      mid: e.mid || void 0,
      kind: e.kind,
      userID: e.playerid,
      muted: e.muted,
      versionid: e.versionid,
      profiles: e.profiles || [],
    };
  }
  function Oa(e, t) {
    return {
      trackid: e.trackID,
      mid: e.mid || void 0,
      kind: e.kind,
      master: t,
      muted: !!e.muted,
      playerid: e.userID,
      tag: e.tag || "",
      versionid: e.versionid,
    };
  }
  function Na(e) {
    if (!e.info.mid && Ti.unifiedPlan) throw Yi("can not find track mid!");
    return {
      localid: e.mediaTrack.id,
      localmid: e.info.mid || void 0,
      master: e.master,
      kind: e.info.kind,
      kbps: e.info.kbps,
      tag: e.info.tag,
    };
  }
  function xa(e) {
    return new Ea(e.playerid, e.playerdata);
  }
  function La(e, t, r) {
    let n;
    return (
      "audio" === e.kind
        ? ((n = new _s(e)), n.initAudioManager(!0))
        : (n = new Ra(e)),
      r && n.setKbps(r),
      n.setInfo({ tag: t }),
      n
    );
  }
  function Ba(e) {
    switch (e) {
      case "window":
        return "application";
      case "screen":
        return ["window", "monitor"];
      default:
        return;
    }
  }
  const Ga = (e) =>
    (function (e) {
      0 === Object.keys(e.audio).length &&
        "boolean" != typeof e.audio &&
        (e.audio = !0);
      0 === Object.keys(e.video).length &&
        "boolean" != typeof e.video &&
        (e.video = !0);
      return e;
    })(
      (function (e) {
        if (Ti.minMaxWithIdeal) return e;
        return (
          ["video", "screen"].forEach((t) => {
            "object" == typeof e[t] &&
              "object" == typeof e[t].width &&
              e[t].width.ideal &&
              delete e[t].width.ideal,
              "object" == typeof e[t] &&
                "object" == typeof e[t].height &&
                e[t].height.ideal &&
                delete e[t].height.ideal;
          }),
          e
        );
      })(Go(e))
    );
  function Ha(e) {
    if (e)
      return "number" == typeof e
        ? e
        : e.exact
        ? e.exact
        : e.max
        ? e.max
        : e.ideal
        ? e.ideal
        : e.min
        ? e.min
        : void 0;
  }
  var ja = {},
    Fa = {},
    Va = { exports: {} },
    Ua = (Va.exports = {
      v: [{ name: "version", reg: /^(\d*)$/ }],
      o: [
        {
          name: "origin",
          reg: /^(\S*) (\d*) (\d*) (\S*) IP(\d) (\S*)/,
          names: [
            "username",
            "sessionId",
            "sessionVersion",
            "netType",
            "ipVer",
            "address",
          ],
          format: "%s %s %d %s IP%d %s",
        },
      ],
      s: [{ name: "name" }],
      i: [{ name: "description" }],
      u: [{ name: "uri" }],
      e: [{ name: "email" }],
      p: [{ name: "phone" }],
      z: [{ name: "timezones" }],
      r: [{ name: "repeats" }],
      t: [
        {
          name: "timing",
          reg: /^(\d*) (\d*)/,
          names: ["start", "stop"],
          format: "%d %d",
        },
      ],
      c: [
        {
          name: "connection",
          reg: /^IN IP(\d) (\S*)/,
          names: ["version", "ip"],
          format: "IN IP%d %s",
        },
      ],
      b: [
        {
          push: "bandwidth",
          reg: /^(TIAS|AS|CT|RR|RS):(\d*)/,
          names: ["type", "limit"],
          format: "%s:%s",
        },
      ],
      m: [
        {
          reg: /^(\w*) (\d*) ([\w/]*)(?: (.*))?/,
          names: ["type", "port", "protocol", "payloads"],
          format: "%s %d %s %s",
        },
      ],
      a: [
        {
          push: "rtp",
          reg: /^rtpmap:(\d*) ([\w\-.]*)(?:\s*\/(\d*)(?:\s*\/(\S*))?)?/,
          names: ["payload", "codec", "rate", "encoding"],
          format: function (e) {
            return e.encoding
              ? "rtpmap:%d %s/%s/%s"
              : e.rate
              ? "rtpmap:%d %s/%s"
              : "rtpmap:%d %s";
          },
        },
        {
          push: "fmtp",
          reg: /^fmtp:(\d*) ([\S| ]*)/,
          names: ["payload", "config"],
          format: "fmtp:%d %s",
        },
        { name: "control", reg: /^control:(.*)/, format: "control:%s" },
        {
          name: "rtcp",
          reg: /^rtcp:(\d*)(?: (\S*) IP(\d) (\S*))?/,
          names: ["port", "netType", "ipVer", "address"],
          format: function (e) {
            return null != e.address ? "rtcp:%d %s IP%d %s" : "rtcp:%d";
          },
        },
        {
          push: "rtcpFbTrrInt",
          reg: /^rtcp-fb:(\*|\d*) trr-int (\d*)/,
          names: ["payload", "value"],
          format: "rtcp-fb:%s trr-int %d",
        },
        {
          push: "rtcpFb",
          reg: /^rtcp-fb:(\*|\d*) ([\w-_]*)(?: ([\w-_]*))?/,
          names: ["payload", "type", "subtype"],
          format: function (e) {
            return null != e.subtype ? "rtcp-fb:%s %s %s" : "rtcp-fb:%s %s";
          },
        },
        {
          push: "ext",
          reg: /^extmap:(\d+)(?:\/(\w+))?(?: (urn:ietf:params:rtp-hdrext:encrypt))? (\S*)(?: (\S*))?/,
          names: ["value", "direction", "encrypt-uri", "uri", "config"],
          format: function (e) {
            return (
              "extmap:%d" +
              (e.direction ? "/%s" : "%v") +
              (e["encrypt-uri"] ? " %s" : "%v") +
              " %s" +
              (e.config ? " %s" : "")
            );
          },
        },
        { name: "extmapAllowMixed", reg: /^(extmap-allow-mixed)/ },
        {
          push: "crypto",
          reg: /^crypto:(\d*) ([\w_]*) (\S*)(?: (\S*))?/,
          names: ["id", "suite", "config", "sessionConfig"],
          format: function (e) {
            return null != e.sessionConfig
              ? "crypto:%d %s %s %s"
              : "crypto:%d %s %s";
          },
        },
        { name: "setup", reg: /^setup:(\w*)/, format: "setup:%s" },
        {
          name: "connectionType",
          reg: /^connection:(new|existing)/,
          format: "connection:%s",
        },
        { name: "mid", reg: /^mid:([^\s]*)/, format: "mid:%s" },
        { name: "msid", reg: /^msid:(.*)/, format: "msid:%s" },
        { name: "ptime", reg: /^ptime:(\d*(?:\.\d*)*)/, format: "ptime:%d" },
        {
          name: "maxptime",
          reg: /^maxptime:(\d*(?:\.\d*)*)/,
          format: "maxptime:%d",
        },
        { name: "direction", reg: /^(sendrecv|recvonly|sendonly|inactive)/ },
        { name: "icelite", reg: /^(ice-lite)/ },
        { name: "iceUfrag", reg: /^ice-ufrag:(\S*)/, format: "ice-ufrag:%s" },
        { name: "icePwd", reg: /^ice-pwd:(\S*)/, format: "ice-pwd:%s" },
        {
          name: "fingerprint",
          reg: /^fingerprint:(\S*) (\S*)/,
          names: ["type", "hash"],
          format: "fingerprint:%s %s",
        },
        {
          push: "candidates",
          reg: /^candidate:(\S*) (\d*) (\S*) (\d*) (\S*) (\d*) typ (\S*)(?: raddr (\S*) rport (\d*))?(?: tcptype (\S*))?(?: generation (\d*))?(?: network-id (\d*))?(?: network-cost (\d*))?/,
          names: [
            "foundation",
            "component",
            "transport",
            "priority",
            "ip",
            "port",
            "type",
            "raddr",
            "rport",
            "tcptype",
            "generation",
            "network-id",
            "network-cost",
          ],
          format: function (e) {
            var t = "candidate:%s %d %s %d %s %d typ %s";
            return (
              (t += null != e.raddr ? " raddr %s rport %d" : "%v%v"),
              (t += null != e.tcptype ? " tcptype %s" : "%v"),
              null != e.generation && (t += " generation %d"),
              (t += null != e["network-id"] ? " network-id %d" : "%v"),
              (t += null != e["network-cost"] ? " network-cost %d" : "%v")
            );
          },
        },
        { name: "endOfCandidates", reg: /^(end-of-candidates)/ },
        {
          name: "remoteCandidates",
          reg: /^remote-candidates:(.*)/,
          format: "remote-candidates:%s",
        },
        {
          name: "iceOptions",
          reg: /^ice-options:(\S*)/,
          format: "ice-options:%s",
        },
        {
          push: "ssrcs",
          reg: /^ssrc:(\d*) ([\w_-]*)(?::(.*))?/,
          names: ["id", "attribute", "value"],
          format: function (e) {
            var t = "ssrc:%d";
            return (
              null != e.attribute &&
                ((t += " %s"), null != e.value && (t += ":%s")),
              t
            );
          },
        },
        {
          push: "ssrcGroups",
          reg: /^ssrc-group:([\x21\x23\x24\x25\x26\x27\x2A\x2B\x2D\x2E\w]*) (.*)/,
          names: ["semantics", "ssrcs"],
          format: "ssrc-group:%s %s",
        },
        {
          name: "msidSemantic",
          reg: /^msid-semantic:\s?(\w*) (\S*)/,
          names: ["semantic", "token"],
          format: "msid-semantic: %s %s",
        },
        {
          push: "groups",
          reg: /^group:(\w*) (.*)/,
          names: ["type", "mids"],
          format: "group:%s %s",
        },
        { name: "rtcpMux", reg: /^(rtcp-mux)/ },
        { name: "rtcpRsize", reg: /^(rtcp-rsize)/ },
        {
          name: "sctpmap",
          reg: /^sctpmap:([\w_/]*) (\S*)(?: (\S*))?/,
          names: ["sctpmapNumber", "app", "maxMessageSize"],
          format: function (e) {
            return null != e.maxMessageSize
              ? "sctpmap:%s %s %s"
              : "sctpmap:%s %s";
          },
        },
        {
          name: "xGoogleFlag",
          reg: /^x-google-flag:([^\s]*)/,
          format: "x-google-flag:%s",
        },
        {
          push: "rids",
          reg: /^rid:([\d\w]+) (\w+)(?: ([\S| ]*))?/,
          names: ["id", "direction", "params"],
          format: function (e) {
            return e.params ? "rid:%s %s %s" : "rid:%s %s";
          },
        },
        {
          push: "imageattrs",
          reg: new RegExp(
            "^imageattr:(\\d+|\\*)[\\s\\t]+(send|recv)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*)(?:[\\s\\t]+(recv|send)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*))?"
          ),
          names: ["pt", "dir1", "attrs1", "dir2", "attrs2"],
          format: function (e) {
            return "imageattr:%s %s %s" + (e.dir2 ? " %s %s" : "");
          },
        },
        {
          name: "simulcast",
          reg: new RegExp(
            "^simulcast:(send|recv) ([a-zA-Z0-9\\-_~;,]+)(?:\\s?(send|recv) ([a-zA-Z0-9\\-_~;,]+))?$"
          ),
          names: ["dir1", "list1", "dir2", "list2"],
          format: function (e) {
            return "simulcast:%s %s" + (e.dir2 ? " %s %s" : "");
          },
        },
        {
          name: "simulcast_03",
          reg: /^simulcast:[\s\t]+([\S+\s\t]+)$/,
          names: ["value"],
          format: "simulcast: %s",
        },
        {
          name: "framerate",
          reg: /^framerate:(\d+(?:$|\.\d+))/,
          format: "framerate:%s",
        },
        {
          name: "sourceFilter",
          reg: /^source-filter: *(excl|incl) (\S*) (IP4|IP6|\*) (\S*) (.*)/,
          names: [
            "filterMode",
            "netType",
            "addressTypes",
            "destAddress",
            "srcList",
          ],
          format: "source-filter: %s %s %s %s %s",
        },
        { name: "bundleOnly", reg: /^(bundle-only)/ },
        { name: "label", reg: /^label:(.+)/, format: "label:%s" },
        { name: "sctpPort", reg: /^sctp-port:(\d+)$/, format: "sctp-port:%s" },
        {
          name: "maxMessageSize",
          reg: /^max-message-size:(\d+)$/,
          format: "max-message-size:%s",
        },
        {
          push: "tsRefClocks",
          reg: /^ts-refclk:([^\s=]*)(?:=(\S*))?/,
          names: ["clksrc", "clksrcExt"],
          format: function (e) {
            return "ts-refclk:%s" + (null != e.clksrcExt ? "=%s" : "");
          },
        },
        {
          name: "mediaClk",
          reg: /^mediaclk:(?:id=(\S*))? *([^\s=]*)(?:=(\S*))?(?: *rate=(\d+)\/(\d+))?/,
          names: [
            "id",
            "mediaClockName",
            "mediaClockValue",
            "rateNumerator",
            "rateDenominator",
          ],
          format: function (e) {
            var t = "mediaclk:";
            return (
              (t += null != e.id ? "id=%s %s" : "%v%s"),
              (t += null != e.mediaClockValue ? "=%s" : ""),
              (t += null != e.rateNumerator ? " rate=%s" : ""),
              (t += null != e.rateDenominator ? "/%s" : "")
            );
          },
        },
        { name: "keywords", reg: /^keywds:(.+)$/, format: "keywds:%s" },
        { name: "content", reg: /^content:(.+)/, format: "content:%s" },
        {
          name: "bfcpFloorCtrl",
          reg: /^floorctrl:(c-only|s-only|c-s)/,
          format: "floorctrl:%s",
        },
        { name: "bfcpConfId", reg: /^confid:(\d+)/, format: "confid:%s" },
        { name: "bfcpUserId", reg: /^userid:(\d+)/, format: "userid:%s" },
        {
          name: "bfcpFloorId",
          reg: /^floorid:(.+) (?:m-stream|mstrm):(.+)/,
          names: ["id", "mStream"],
          format: "floorid:%s mstrm:%s",
        },
        { push: "invalid", names: ["value"] },
      ],
    });
  Object.keys(Ua).forEach(function (e) {
    Ua[e].forEach(function (e) {
      e.reg || (e.reg = /(.*)/), e.format || (e.format = "%s");
    });
  });
  var qa = Va.exports;
  !(function (e) {
    var t = function (e) {
        return String(Number(e)) === e ? Number(e) : e;
      },
      r = function (e, r, n) {
        var i = e.name && e.names;
        e.push && !r[e.push]
          ? (r[e.push] = [])
          : i && !r[e.name] && (r[e.name] = {});
        var o = e.push ? {} : i ? r[e.name] : r;
        !(function (e, r, n, i) {
          if (i && !n) r[i] = t(e[1]);
          else
            for (var o = 0; o < n.length; o += 1)
              null != e[o + 1] && (r[n[o]] = t(e[o + 1]));
        })(n.match(e.reg), o, e.names, e.name),
          e.push && r[e.push].push(o);
      },
      n = qa,
      i = RegExp.prototype.test.bind(/^([a-z])=(.*)/);
    e.parse = function (e) {
      var t = {},
        o = [],
        a = t;
      return (
        e
          .split(/(\r\n|\r|\n)/)
          .filter(i)
          .forEach(function (e) {
            var t = e[0],
              i = e.slice(2);
            "m" === t && (o.push({ rtp: [], fmtp: [] }), (a = o[o.length - 1]));
            for (var s = 0; s < (n[t] || []).length; s += 1) {
              var c = n[t][s];
              if (c.reg.test(i)) return r(c, a, i);
            }
          }),
        (t.media = o),
        t
      );
    };
    var o = function (e, r) {
      var n = r.split(/=(.+)/, 2);
      return (
        2 === n.length
          ? (e[n[0]] = t(n[1]))
          : 1 === n.length && r.length > 1 && (e[n[0]] = void 0),
        e
      );
    };
    (e.parseParams = function (e) {
      return e.split(/;\s?/).reduce(o, {});
    }),
      (e.parseFmtpConfig = e.parseParams),
      (e.parsePayloads = function (e) {
        return e.toString().split(" ").map(Number);
      }),
      (e.parseRemoteCandidates = function (e) {
        for (var r = [], n = e.split(" ").map(t), i = 0; i < n.length; i += 3)
          r.push({ component: n[i], ip: n[i + 1], port: n[i + 2] });
        return r;
      }),
      (e.parseImageAttributes = function (e) {
        return e.split(" ").map(function (e) {
          return e
            .substring(1, e.length - 1)
            .split(",")
            .reduce(o, {});
        });
      }),
      (e.parseSimulcastStreamList = function (e) {
        return e.split(";").map(function (e) {
          return e.split(",").map(function (e) {
            var r,
              n = !1;
            return (
              "~" !== e[0]
                ? (r = t(e))
                : ((r = t(e.substring(1, e.length))), (n = !0)),
              { scid: r, paused: n }
            );
          });
        });
      });
  })(Fa);
  var Qa = qa,
    Wa = /%[sdv%]/g,
    za = function (e) {
      var t = 1,
        r = arguments,
        n = r.length;
      return e.replace(Wa, function (e) {
        if (t >= n) return e;
        var i = r[t];
        switch (((t += 1), e)) {
          case "%%":
            return "%";
          case "%s":
            return String(i);
          case "%d":
            return Number(i);
          case "%v":
            return "";
        }
      });
    },
    Xa = function (e, t, r) {
      var n = [
        e +
          "=" +
          (t.format instanceof Function
            ? t.format(t.push ? r : r[t.name])
            : t.format),
      ];
      if (t.names)
        for (var i = 0; i < t.names.length; i += 1) {
          var o = t.names[i];
          t.name ? n.push(r[t.name][o]) : n.push(r[t.names[i]]);
        }
      else n.push(r[t.name]);
      return za.apply(null, n);
    },
    Ka = ["v", "o", "s", "i", "u", "e", "p", "c", "b", "t", "r", "z", "a"],
    Ja = ["i", "c", "b", "a"],
    Za = Fa,
    Ya = function (e, t) {
      (t = t || {}),
        null == e.version && (e.version = 0),
        null == e.name && (e.name = " "),
        e.media.forEach(function (e) {
          null == e.payloads && (e.payloads = "");
        });
      var r = t.outerOrder || Ka,
        n = t.innerOrder || Ja,
        i = [];
      return (
        r.forEach(function (t) {
          Qa[t].forEach(function (r) {
            r.name in e && null != e[r.name]
              ? i.push(Xa(t, r, e))
              : r.push in e &&
                null != e[r.push] &&
                e[r.push].forEach(function (e) {
                  i.push(Xa(t, r, e));
                });
          });
        }),
        e.media.forEach(function (e) {
          i.push(Xa("m", Qa.m[0], e)),
            n.forEach(function (t) {
              Qa[t].forEach(function (r) {
                r.name in e && null != e[r.name]
                  ? i.push(Xa(t, r, e))
                  : r.push in e &&
                    null != e[r.push] &&
                    e[r.push].forEach(function (e) {
                      i.push(Xa(t, r, e));
                    });
              });
            });
        }),
        i.join("\r\n") + "\r\n"
      );
    };
  (ja.write = Ya),
    (ja.parse = Za.parse),
    (ja.parseParams = Za.parseParams),
    (ja.parseFmtpConfig = Za.parseFmtpConfig),
    (ja.parsePayloads = Za.parsePayloads),
    (ja.parseRemoteCandidates = Za.parseRemoteCandidates),
    (ja.parseImageAttributes = Za.parseImageAttributes),
    (ja.parseSimulcastStreamList = Za.parseSimulcastStreamList);
  const $a = "qiniu-rtc-client";
  function es(e) {
    return e.map((e) => {
      const t = {
        component: 1,
        foundation: e.foundation,
        ip: e.ip,
        port: e.port,
        priority: e.priority,
        transport: e.protocol,
        type: e.type,
      };
      return e.tcpType && (t.tcptype = e.tcpType), t;
    });
  }
  class ts {
    get transportRemoteParameters() {
      return this._transportRemoteParameters;
    }
    constructor(e, t) {
      (this.lastSubMids = []),
        (this.sessionVersion = 0),
        (this.direction = e),
        (this.extendedRtpCapabilities = t);
    }
    setTransportRemoteParameters(e) {
      return pe(this, void 0, void 0, function* () {
        for (const t of e.iceCandidates) t.ip = yield Ko(t.ip);
        this._transportRemoteParameters = e;
      });
    }
    createRemoteAnswer(e, t, r) {
      if (
        (he.log("create remote answer", t, r), !this.transportRemoteParameters)
      )
        throw Yi("no transportRemoteParameters!");
      return Ti.unifiedPlan
        ? (function (e, t, r, n, i) {
            const o = ja.parse(r),
              a = { version: 0 };
            (a.origin = {
              address: "0.0.0.0",
              ipVer: 4,
              netType: "IN",
              sessionId: "5975129998295344376",
              sessionVersion: 2,
              username: $a,
            }),
              (a.name = "-"),
              (a.timing = { start: 0, stop: 0 }),
              (a.icelite = t.iceParameters.iceLite ? "ice-lite" : void 0),
              (a.msidSemantic = { semantic: "WMS", token: "*" }),
              (a.media = []),
              (a.fingerprint = {
                type: t.dtlsParameters.fingerprints[0].algorithm,
                hash: t.dtlsParameters.fingerprints[0].value,
              });
            for (const r of o.media) {
              const o = "inactive" === r.direction,
                s = r.type,
                c = "audio" === s ? e.codecs[0] : e.codecs[1],
                d = e.headerExtensions.filter((e) => e.kind === s);
              Ic && d.push({ uri: "urn:3gpp:video-orientation", sendId: 13 });
              const u = {
                type: r.type,
                port: i && i.has(String(r.mid)) ? 0 : 7,
                protocol: "RTP/SAVPF",
                connection: { ip: "127.0.0.1", version: 4 },
                mid: r.mid,
                iceUfrag: t.iceParameters.usernameFragment,
                icePwd: t.iceParameters.password,
                candidates: es(t.iceCandidates),
                endOfCandidates: "end-of-candidates",
                iceOptions: "renomination",
                setup:
                  "server" === t.dtlsParameters.role ? "actpass" : "active",
                direction:
                  "sendonly" === r.direction || "sendrecv" === r.direction
                    ? "recvonly"
                    : "inactive",
                rtp: [
                  {
                    payload: c.sendPayloadType,
                    codec: c.name,
                    rate: c.clockRate,
                    encoding: c.channels > 1 ? c.channels : void 0,
                  },
                ],
                rtcpFb: [],
                fmtp: [
                  {
                    payload: c.sendPayloadType,
                    config: Object.keys(c.parameters)
                      .map((e) =>
                        "".concat(e, "=").concat(c.parameters[e], ";")
                      )
                      .join(""),
                  },
                ],
                payloads: c.sendPayloadType,
                rtcpMux: "rtcp-mux",
                rtcpRsize: "rtcp-rsize",
                ext: d.map((e) => ({ uri: e.uri, value: e.sendId })),
              };
              c.rtcpFeedback &&
                c.rtcpFeedback.length > 0 &&
                c.rtcpFeedback.forEach((e) => {
                  u.rtcpFb.push({
                    payload: c.sendPayloadType,
                    type: e.type,
                    subtype: e.parameter,
                  });
                }),
                c.sendRtxPayloadType &&
                  (u.rtp.push({
                    payload: c.sendRtxPayloadType,
                    codec: "rtx",
                    rate: c.clockRate,
                    encoding: c.channels > 1 ? c.channels : void 0,
                  }),
                  u.fmtp.push({
                    payload: c.sendRtxPayloadType,
                    config: "apt=".concat(c.sendPayloadType, ";"),
                  }),
                  (u.payloads = ""
                    .concat(c.sendPayloadType, " ")
                    .concat(c.sendRtxPayloadType))),
                ns(s, u, e, c);
              const l = n[u.mid];
              "video" === u.type &&
                l &&
                !o &&
                ((u.rids = [
                  { id: "hi", direction: "recv" },
                  { id: "lo", direction: "recv" },
                ]),
                (u.simulcast = { dir1: "recv", list1: "hi;lo" })),
                a.media.push(u);
            }
            const s = (o.media || [])
              .filter((e) => e.hasOwnProperty("mid") && 0 !== e.port)
              .map((e) => String(e.mid));
            s.length > 0 &&
              (a.groups = [{ type: "BUNDLE", mids: s.join(" ") }]);
            return ja.write(a);
          })(
            this.extendedRtpCapabilities,
            this.transportRemoteParameters,
            e,
            t,
            r
          )
        : (function (e, t, r) {
            const n = ja.parse(r);
            (n.version = 0),
              (n.origin = {
                address: "0.0.0.0",
                ipVer: 4,
                netType: "IN",
                sessionId: "5975129998295344376",
                sessionVersion: 2,
                username: $a,
              }),
              (n.name = "-"),
              (n.timing = { start: 0, stop: 0 }),
              (n.icelite = t.iceParameters.iceLite ? "ice-lite" : void 0),
              (n.msidSemantic = { semantic: "WMS", token: "*" }),
              (n.fingerprint = {
                type: t.dtlsParameters.fingerprints[0].algorithm,
                hash: t.dtlsParameters.fingerprints[0].value,
              });
            const i = [];
            for (const r of n.media) {
              const n = r.type,
                o = e.codecs.find((e) => e.kind === n),
                a = (e.headerExtensions || []).filter((e) => e.kind === n);
              if (!o) throw Yi("can not find codec" + n);
              const s = {
                type: n,
                mid: n,
                port: 7,
                protocol: "RTP/SAVPF",
                connection: { ip: "127.0.0.1", version: 4 },
                iceUfrag: t.iceParameters.usernameFragment,
                icePwd: t.iceParameters.password,
                candidates: es(t.iceCandidates),
                endOfCandidates: "end-of-candidates",
                iceOptions: "renomination",
                setup:
                  "server" === t.dtlsParameters.role ? "actpass" : "active",
                direction: "recvonly",
                rtp: [
                  {
                    payload: o.sendPayloadType,
                    codec: o.name,
                    rate: o.clockRate,
                    encoding: o.channels > 1 ? o.channels : void 0,
                  },
                ],
                rtcpFb: [],
                fmtp: [
                  {
                    payload: o.sendPayloadType,
                    config: Object.keys(o.parameters)
                      .map((e) =>
                        "".concat(e, "=").concat(o.parameters[e], ";")
                      )
                      .join(""),
                  },
                ],
                payloads: o.sendPayloadType,
                rtcpMux: "rtcp-mux",
                rtcpRsize: "rtcp-rsize",
                ext: a.map((e) => ({ uri: e.uri, value: e.sendId })),
              };
              o.rtcpFeedback &&
                o.rtcpFeedback.length > 0 &&
                o.rtcpFeedback.forEach((e) => {
                  s.rtcpFb.push({
                    payload: o.sendPayloadType,
                    type: e.type,
                    subtype: e.parameter,
                  });
                }),
                o.sendRtxPayloadType &&
                  (s.rtp.push({
                    payload: o.sendRtxPayloadType,
                    codec: "rtx",
                    rate: o.clockRate,
                    encoding: o.channels > 1 ? o.channels : void 0,
                  }),
                  s.fmtp.push({
                    payload: o.sendRtxPayloadType,
                    config: "apt=".concat(o.sendPayloadType, ";"),
                  }),
                  (s.payloads = ""
                    .concat(o.sendPayloadType, " ")
                    .concat(o.sendRtxPayloadType))),
                i.push(s);
            }
            return (n.media = i), ja.write(n);
          })(this.extendedRtpCapabilities, this.transportRemoteParameters, e);
    }
    createRemoteOffer(e) {
      if (!this.transportRemoteParameters)
        throw Yi("no transportRemoteParameters!");
      if (Ti.unifiedPlan) {
        const t = (function (e, t) {
          let r = [];
          for (const n of t) {
            const t = ge(e, (e) => e.mid === n)[0];
            t && r.push(t);
          }
          return (r = r.concat(e)), (t = r.map((e) => e.mid)), r;
        })(e, this.lastSubMids);
        return (
          (this.lastSubMids = t.map((e) => e.mid)),
          (this.sessionVersion += 1),
          (function (e, t, r, n) {
            he.debug("createUnifiedPlanOfferSdp: consumerInfos", e);
            const i = {},
              o = e.map((e) => e.mid);
            (i.version = 0),
              (i.origin = {
                address: "0.0.0.0",
                ipVer: 4,
                netType: "IN",
                sessionId: "5975129998295344377",
                sessionVersion: n,
                username: $a,
              }),
              (i.name = "-"),
              (i.timing = { start: 0, stop: 0 }),
              (i.icelite = r.iceParameters.iceLite ? "ice-lite" : void 0),
              (i.msidSemantic = { semantic: "WMS", token: "*" }),
              o.length > 0 &&
                (i.groups = [{ type: "BUNDLE", mids: o.join(" ") }]);
            (i.media = []),
              (i.fingerprint = {
                type: r.dtlsParameters.fingerprints[0].algorithm,
                hash: r.dtlsParameters.fingerprints[0].value,
              });
            for (const n of e) {
              const e = "audio" === n.kind ? t.codecs[0] : t.codecs[1],
                o = t.headerExtensions.filter((e) => e.kind === n.kind),
                a = {
                  type: n.kind,
                  port: 7,
                  protocol: "RTP/SAVPF",
                  connection: { ip: "127.0.0.1", version: 4 },
                  mid: n.mid,
                  msid: "".concat(n.streamId, " ").concat(n.trackID),
                  iceUfrag: r.iceParameters.usernameFragment,
                  icePwd: r.iceParameters.password,
                  candidates: es(r.iceCandidates),
                  endOfCandidates: "end-of-candidates",
                  iceOptions: "renomination",
                  setup:
                    "server" === r.dtlsParameters.role ? "actpass" : "active",
                  direction: n.closed ? "inactive" : "sendonly",
                  rtp: [
                    {
                      payload: e.recvPayloadType,
                      codec: e.name,
                      rate: e.clockRate,
                      encoding: e.channels > 1 ? e.channels : void 0,
                    },
                  ],
                  rtcpFb: [],
                  fmtp: [
                    {
                      payload: e.recvPayloadType,
                      config: Object.keys(e.parameters)
                        .map((t) =>
                          "".concat(t, "=").concat(e.parameters[t], ";")
                        )
                        .join(""),
                    },
                  ],
                  payloads: e.recvPayloadType,
                  rtcpMux: "rtcp-mux",
                  rtcpRsize: "rtcp-rsize",
                  ext: n.closed
                    ? []
                    : o.map((e) => ({ uri: e.uri, value: e.recvId })),
                  ssrcs:
                    !n.closed && n.ssrc
                      ? [{ id: n.ssrc, attribute: "cname", value: n.cname }]
                      : [],
                  ssrcGroups: [],
                };
              e.rtcpFeedback &&
                e.rtcpFeedback.length > 0 &&
                e.rtcpFeedback.forEach((t) => {
                  a.rtcpFb.push({
                    payload: e.recvPayloadType,
                    type: t.type,
                    subtype: t.parameter,
                  });
                }),
                e.recvRtxPayloadType &&
                  (a.rtp.push({
                    payload: e.recvRtxPayloadType,
                    codec: "rtx",
                    rate: e.clockRate,
                    encoding: e.channels > 1 ? e.channels : void 0,
                  }),
                  a.fmtp.push({
                    payload: e.recvRtxPayloadType,
                    config: "apt=".concat(e.recvPayloadType, ";"),
                  }),
                  (a.payloads = ""
                    .concat(e.recvPayloadType, " ")
                    .concat(e.recvRtxPayloadType))),
                ns(n.kind, a, t, e, !0),
                n.rtxSsrc &&
                  !n.closed &&
                  ((a.ssrcs = a.ssrcs.concat([
                    { id: n.rtxSsrc, attribute: "cname", value: n.cname },
                  ])),
                  a.ssrcGroups.push({
                    semantics: "FID",
                    ssrcs: "".concat(n.ssrc, " ").concat(n.rtxSsrc),
                  })),
                i.media.push(a);
            }
            return ja.write(i);
          })(
            t,
            this.extendedRtpCapabilities,
            this.transportRemoteParameters,
            this.sessionVersion
          )
        );
      }
      {
        const t = new Set();
        return (
          e.forEach((e) => t.add(e.kind)),
          0 === e.length && (t.add("audio"), t.add("video")),
          (function (e, t, r, n) {
            he.debug("createPlanBOfferSdp: consumerInfos", t, "kinds", e),
              (e = ["audio", "video"]);
            const i = { version: 0 };
            (i.origin = {
              address: "0.0.0.0",
              ipVer: 4,
              netType: "IN",
              sessionId: "5975129998295344377",
              sessionVersion: 2,
              username: $a,
            }),
              (i.name = "-"),
              (i.timing = { start: 0, stop: 0 }),
              (i.icelite = n.iceParameters.iceLite ? "ice-lite" : void 0),
              (i.msidSemantic = { semantic: "WMS", token: "*" }),
              (i.groups = [{ type: "BUNDLE", mids: e.join(" ") }]),
              (i.media = []),
              (i.fingerprint = {
                type: n.dtlsParameters.fingerprints[0].algorithm,
                hash: n.dtlsParameters.fingerprints[0].value,
              });
            for (const o of e) {
              const e = t.filter((e) => e.kind === o),
                a = r.codecs.find((e) => e.kind === o),
                s = (r.headerExtensions || []).filter((e) => e.kind === o);
              if (!a) throw Yi("no codec" + o);
              const c = {
                type: o,
                port: 7,
                protocol: "RTP/SAVPF",
                connection: { ip: "127.0.0.1", version: 4 },
                mid: o,
                iceUfrag: n.iceParameters.usernameFragment,
                icePwd: n.iceParameters.password,
                candidates: es(n.iceCandidates),
                endOfCandidates: "end-of-candidates",
                iceOptions: "renomination",
                setup:
                  "server" === n.dtlsParameters.role ? "actpass" : "active",
                direction: "sendonly",
                rtp: [
                  {
                    payload: a.recvPayloadType,
                    codec: a.name,
                    rate: a.clockRate,
                    encoding: a.channels > 1 ? a.channels : void 0,
                  },
                ],
                rtcpFb: [],
                fmtp: [
                  {
                    payload: a.recvPayloadType,
                    config: Object.keys(a.parameters)
                      .map((e) =>
                        "".concat(e, "=").concat(a.parameters[e], ";")
                      )
                      .join(""),
                  },
                ],
                payloads: a.recvPayloadType,
                rtcpMux: "rtcp-mux",
                rtcpRsize: "rtcp-rsize",
                ssrcs: [],
                ssrcGroups: [],
                ext: s.map((e) => ({ uri: e.uri, value: e.recvId })),
              };
              a.rtcpFeedback &&
                a.rtcpFeedback.length > 0 &&
                a.rtcpFeedback.forEach((e) => {
                  c.rtcpFb.push({
                    payload: a.recvPayloadType,
                    type: e.type,
                    subtype: e.parameter,
                  });
                }),
                a.recvRtxPayloadType &&
                  (c.rtp.push({
                    payload: a.recvRtxPayloadType,
                    codec: "rtx",
                    rate: a.clockRate,
                    encoding: a.channels > 1 ? a.channels : void 0,
                  }),
                  c.fmtp.push({
                    payload: a.recvRtxPayloadType,
                    config: "apt=".concat(a.recvPayloadType, ";"),
                  }),
                  (c.payloads = ""
                    .concat(a.recvPayloadType, " ")
                    .concat(a.recvRtxPayloadType)));
              for (const t of e)
                c.ssrcs.push({
                  id: t.ssrc,
                  attribute: "msid",
                  value: "".concat(t.streamId, " ").concat(t.trackID),
                }),
                  c.ssrcs.push({
                    id: t.ssrc,
                    attribute: "mslabel",
                    value: "".concat(t.streamId),
                  }),
                  c.ssrcs.push({
                    id: t.ssrc,
                    attribute: "label",
                    value: "".concat(t.trackID),
                  }),
                  c.ssrcs.push({
                    id: t.ssrc,
                    attribute: "cname",
                    value: "".concat(t.cname),
                  }),
                  t.rtxSsrc &&
                    (c.ssrcGroups.push({
                      semantics: "FID",
                      ssrcs: "".concat(t.ssrc, " ").concat(t.rtxSsrc),
                    }),
                    c.ssrcs.push({
                      id: t.rtxSsrc,
                      attribute: "msid",
                      value: "".concat(t.streamId, " ").concat(t.trackID),
                    }),
                    c.ssrcs.push({
                      id: t.rtxSsrc,
                      attribute: "mslabel",
                      value: "".concat(t.streamId),
                    }),
                    c.ssrcs.push({
                      id: t.rtxSsrc,
                      attribute: "label",
                      value: "".concat(t.trackID),
                    }),
                    c.ssrcs.push({
                      id: t.rtxSsrc,
                      attribute: "cname",
                      value: "".concat(t.cname),
                    }));
              i.media.push(c);
            }
            return ja.write(i);
          })(
            Array.from(t),
            e,
            this.extendedRtpCapabilities,
            this.transportRemoteParameters
          )
        );
      }
    }
    updateICEData(e, t) {
      return pe(this, void 0, void 0, function* () {
        if (this.transportRemoteParameters) {
          for (const e of t) e.ip = yield Ko(e.ip);
          (this.transportRemoteParameters.iceCandidates = t),
            (this.transportRemoteParameters.iceParameters = e);
        }
      });
    }
  }
  function rs(e) {
    return pe(this, void 0, void 0, function* () {
      const t = yield e.createOffer({
        offerToReceiveAudio: !0,
        offerToReceiveVideo: !0,
      });
      return t.sdp
        ? { isH264: -1 !== t.sdp.toLowerCase().indexOf("h264"), sdp: t.sdp }
        : { isH264: !1, sdp: "" };
    });
  }
  function ns(e, t, r, n) {
    let i = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
    const o = r.codecs.filter((t) => t.kind === e && t.name !== n.name);
    if (o.length > 0) {
      let e = i ? n.recvPayloadType : n.sendPayloadType;
      const r = [];
      o.forEach((n) => {
        const o = i ? n.recvPayloadType : n.sendPayloadType;
        r.push(o),
          t.rtp.push({
            payload: o,
            codec: n.name,
            rate: n.clockRate,
            encoding: n.channels > 1 ? n.channels : void 0,
          }),
          t.fmtp.push({ payload: o, config: "".concat(e, "/").concat(e) });
      }),
        (t.payloads = "".concat(t.payloads, " ").concat(r.join(" ")));
    }
  }
  function is(e) {
    const t = ja.parse(e);
    if (!("media" in t)) return ja.write(t);
    if (!Array.isArray(t.media)) return ja.write(t);
    for (const e of t.media)
      "ext" in e &&
        Array.isArray(e.ext) &&
        "video" === e.type &&
        (e.ext = e.ext.filter((e) => "urn:3gpp:video-orientation" !== e.uri));
    return ja.write(t);
  }
  function os(t, r, n) {
    return pe(this, void 0, void 0, function* () {
      let i = 0,
        o = !1;
      const { appId: a, roomName: s, userId: c } = t,
        d = "/v3/apps/"
          .concat(a, "/rooms/")
          .concat(s, "/auth?user=")
          .concat(c, "&token=")
          .concat(r);
      for (;;) {
        const t = {
          auth_start_time: Date.now(),
          auth_dns_time: 0,
          auth_server_ip: "",
          room_token: r,
          auth_url: d,
        };
        try {
          const r = yield Xo(d, n);
          return (
            i++,
            Xi.addEvent(
              "MCSAuth",
              Object.assign(Object.assign({}, t), {
                auth_take_time: Date.now() - t.auth_start_time,
                auth_error_code: 0,
                auth_error_message: "",
                access_token: r.accessToken,
                event_grade: e.QNEventGrade.NORMAL,
                event_category: e.QNEventCategory.CORE,
                auth_network_code: 0,
                fire_times: i,
                auth_reason: o ? "reconnect" : "connect",
              })
            ),
            r
          );
        } catch (r) {
          const n = r;
          if (
            ((o = !0),
            i++,
            Xi.addEvent(
              "MCSAuth",
              Object.assign(Object.assign({}, t), {
                auth_take_time: Date.now() - t.auth_start_time,
                auth_error_code: void 0 === n.retry ? -1 : Number(n.message),
                auth_error_message:
                  void 0 === n.retry ? n.toString() : n.message,
                access_token: "",
                event_grade: e.QNEventGrade.SERVERE,
                event_category: e.QNEventCategory.CORE,
                auth_network_code: void 0 === n.retry ? n.networkCode || -2 : 0,
                fire_times: i,
                auth_reason: o ? "reconnect" : "connect",
              })
            ),
            !1 === n.retry)
          )
            throw $i(n.message);
          yield Vo(1e3), he.warning("can not get accessToken, retry.", $i(n));
        }
      }
    });
  }
  function as(e, t, r) {
    return pe(this, void 0, void 0, function* () {
      const { appId: n, roomName: i, userId: o } = e,
        a = "/v3/apps/"
          .concat(n, "/rooms/")
          .concat(i, "/relay/token?user=")
          .concat(o, "&token=")
          .concat(t);
      for (;;) {
        const e = {
          auth_start_time: Date.now(),
          auth_dns_time: 0,
          auth_server_ip: "",
          room_token: t,
        };
        try {
          const t = yield Xo(a, r);
          return (
            Xi.addEvent(
              "MCURelayAuth",
              Object.assign(Object.assign({}, e), {
                auth_take_time: Date.now() - e.auth_start_time,
                auth_error_code: 0,
                auth_error_message: "",
                access_token: t.relayToken || "no relay token",
                auth_network_code: 0,
              })
            ),
            t
          );
        } catch (t) {
          const r = t;
          if (
            (Xi.addEvent(
              "MCURelayAuth",
              Object.assign(Object.assign({}, e), {
                auth_take_time: Date.now() - e.auth_start_time,
                auth_error_code: void 0 === r.retry ? -1 : Number(r.message),
                auth_error_message:
                  void 0 === r.retry ? r.toString() : r.message,
                access_token: "",
                auth_network_code: r.networkCode || 0,
              })
            ),
            !1 === r.retry)
          )
            throw so(r.message);
          yield Vo(1e3), he.warning("can not get relayToken, retry.", so(r));
        }
      }
    });
  }
  var ss;
  !(function (e) {
    (e[(e.CONNECTING = 0)] = "CONNECTING"),
      (e[(e.OPEN = 1)] = "OPEN"),
      (e[(e.CLOSING = 2)] = "CLOSING"),
      (e[(e.CLOSED = 3)] = "CLOSED");
  })(ss || (ss = {}));
  const { JOIN_ROOM_ERROR: cs, ERROR_RECONNECT_FAILED: ds } = Oo;
  class us extends Pa {
    set _state(e) {
      this.emit("@ws-state-change", this.__state, e), (this.__state = e);
    }
    get state() {
      return this.__state;
    }
    set reconnectTimes(e) {
      (this._reconnectTimes = e), (this.currentLeftReconnectTimes = e);
    }
    get reconnectTimes() {
      return this._reconnectTimes;
    }
    set requestTimeout(e) {
      this.wsConnectTimeout = e;
    }
    setUrl(e) {
      this.url = e + "?rpcid=".concat(this.rpcid);
    }
    constructor(t, r, n, i, o) {
      var a;
      let s =
        arguments.length > 5 && void 0 !== arguments[5]
          ? arguments[5]
          : ["subscribe", "publish"];
      super(),
        (a = this),
        (this.privileges = []),
        (this.rpcid = Fo(16)),
        (this.startInitTime = -1),
        (this.startAuthTime = 0),
        (this.initWs = function () {
          let t =
              arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
            r = arguments.length > 1 ? arguments[1] : void 0,
            n = arguments.length > 2 ? arguments[2] : void 0;
          return new Promise((i, o) => {
            if (
              (a.ws &&
                a.ws.readyState === WebSocket.OPEN &&
                (a.ws.close(), (a.ws.onclose = null)),
              t)
            )
              (a.ws = r), a.setUrl(n);
            else {
              a.startInitTime = Date.now();
              try {
                (a.wsConnectTimeoutID = setTimeout(() => {
                  a.ws &&
                    ((a.ws.onopen = null),
                    (a.ws.onclose = null),
                    (a.ws.onerror = null),
                    a.ws.close());
                  const r = a.wsConnectTimeout / 1e3 + "s timeout";
                  Xi.addEvent("WebsocketConnect", {
                    happy_dns_resolve_time: 0,
                    happy_dns_take_effect: !1,
                    socket_node_info: a.url,
                    socket_connect_time: Date.now() - a.startInitTime,
                    socket_connect_success: !1,
                    socket_connect_error_message: r,
                    event_grade: e.QNEventGrade.SERVERE,
                    event_category: e.QNEventCategory.CORE,
                    dns_resolve_time: 0,
                    dns_take_effect: !1,
                    dns_resolved_ip: "",
                    socket_connect_reason: t ? "connect" : "reconnect",
                  }),
                    (a.startInitTime = -1),
                    a.reconnect(a.wsConnectTimeout).catch((e) => {
                      he.warning("signaling: reconnect timeout error", e);
                    });
                }, a.wsConnectTimeout)),
                  (a.ws = new WebSocket(a.url)),
                  (a._state = ss.CONNECTING);
              } catch (e) {
                throw Yi("init signaling websocket faild!\nError: ".concat(e));
              }
            }
            (a.ws.onerror = a.onWsError),
              (a.ws.onclose = a.onWsClose.bind(a, i, o));
            const s = () => {
              a.wsConnectTimeoutID && clearTimeout(a.wsConnectTimeoutID),
                a.emit("ws:onopen"),
                he.log("signaling: websocket open", a.url),
                t ||
                  (Xi.addEvent("WebsocketConnect", {
                    happy_dns_resolve_time: 0,
                    happy_dns_take_effect: !1,
                    socket_node_info: a.url,
                    socket_connect_time: Date.now() - a.startInitTime,
                    socket_connect_success: !0,
                    event_grade: e.QNEventGrade.NORMAL,
                    event_category: e.QNEventCategory.CORE,
                    dns_resolve_time: 0,
                    dns_take_effect: !1,
                    dns_resolved_ip: "",
                    socket_connect_reason: t ? "connect" : "reconnect",
                  }),
                  (a.startInitTime = -1)),
                (a.ws.onmessage = a.onWsMsg);
              const r = {
                token: a.accessToken,
                reconntoken: a.reconnectToken,
                agent: "".concat(hi.name).concat(hi.version),
                sdkversion: ei,
                capsdp: a.capsdp,
                msgsn: a.customMsgNumber,
                supportdomain: !0,
                privileges: a.privileges,
              };
              a.playerdata && (r.playerdata = a.playerdata),
                (a.startAuthTime = Date.now()),
                a.request("auth", r).then((r) => {
                  switch (
                    (0 !== r.code &&
                      (Xi.addEvent("SignalAuth", {
                        auth_start_time: a.startAuthTime,
                        auth_dns_time: 0,
                        auth_server_ip: a.url,
                        auth_error_code: r.code,
                        auth_error_message: r.error,
                        auth_take_time: Date.now() - a.startAuthTime,
                        access_token: a.accessToken,
                        event_grade: e.QNEventGrade.SERVERE,
                        event_category: e.QNEventCategory.CORE,
                        auth_server_info: n,
                        auth_reason: t ? "connect" : "reconnect",
                      }),
                      (a.startAuthTime = 0)),
                    r.code)
                  ) {
                    case 0:
                      (a.ws.onclose = a.onWsClose.bind(a, null, null)),
                        (a.reconnectToken = r.reconntoken),
                        he.log("signaling: websocket authed"),
                        (a._state = ss.OPEN),
                        Xi.addEvent("SignalAuth", {
                          auth_start_time: a.startAuthTime,
                          auth_dns_time: 0,
                          auth_server_ip: a.url,
                          auth_error_code: 0,
                          auth_error_message: "",
                          auth_take_time: Date.now() - a.startAuthTime,
                          access_token: a.accessToken,
                          event_grade: e.QNEventGrade.NORMAL,
                          event_category: e.QNEventCategory.CORE,
                          auth_server_info: n,
                          auth_reason: t ? "connect" : "reconnect",
                        }),
                        a.emit("@signalingauth", r),
                        (a.startAuthTime = 0),
                        i(r);
                      break;
                    case 10001:
                    case 10002:
                    case 10011:
                    case 10022:
                    case 10012:
                    case 10004:
                      a.emit("@error", r), o(ds(r.error));
                      break;
                    case 10005:
                      a.emit("@error", r), o(ds(r.error));
                    case 10052:
                      if (
                        (he.debug("10052 auth, retry", t),
                        (a.reconnectToken = void 0),
                        t)
                      ) {
                        o(cs(r.code, r.error));
                        break;
                      }
                      return void a.emit("@error", r);
                    case 10054:
                      o(Co(10054, r.error));
                      break;
                    default:
                      o(Yi(r.error));
                  }
                  0 !== r.code &&
                    ((a.reconnectToken = void 0),
                    (a._state = ss.CLOSED),
                    a.release());
                });
            };
            (a.ws.onopen = () => {
              s();
            }),
              t && s();
          });
        }),
        (this.onWsMsg = (e) => {
          const t = e.data;
          this.emit("ws:onmessage", t);
          const r = t.indexOf("=");
          if (!(r > 0))
            throw Yi("signaling model can not parse message: ".concat(t));
          {
            const e = t.substring(0, r),
              n = JSON.parse(t.substring(r + 1)),
              { rpcid: i, pcid: o, code: a, error: s } = n,
              c = fe(n, ["rpcid", "pcid", "code", "error"]),
              d = {
                cmd_type: e,
                rpcid: i,
                pcid: o,
                code: a,
                error: s,
                raw: JSON.stringify(c),
              };
            "ping" !== e &&
              "send-message-res" !== e &&
              "send-qos-message-res" !== e &&
              (/res$/.test(e)
                ? Xi.addEvent(
                    "SignalFired",
                    Object.assign({ kind: "receive" }, d)
                  )
                : Xi.addEvent(
                    "SignalFired",
                    Object.assign({ kind: "notify" }, d)
                  )),
              this.receiveWsMsg(e, n);
          }
        }),
        (this.onWsError = (t) => {
          this.wsConnectTimeoutID && clearTimeout(this.wsConnectTimeoutID),
            he.warning("signaling: websocket error", t),
            this.emit("@ws:error", t),
            -1 !== this.startInitTime &&
              (Xi.addEvent("WebsocketConnect", {
                happy_dns_resolve_time: 0,
                happy_dns_take_effect: !1,
                socket_node_info: this.url,
                socket_connect_time: Date.now() - this.startInitTime,
                socket_connect_success: !1,
                event_grade: e.QNEventGrade.SERVERE,
                event_category: e.QNEventCategory.CORE,
                dns_resolve_time: 0,
                dns_take_effect: !1,
                dns_resolved_ip: "",
                socket_connect_reason: "",
              }),
              (this.startInitTime = -1));
        }),
        (this.sendWsMsg = (e, t) => {
          const { rpcid: r } = t,
            n = fe(t, ["rpcid"]);
          if (
            ("pong" !== e &&
              "send-qos-message" !== e &&
              "send-message" !== e &&
              Xi.addEvent("SignalFired", {
                kind: "send",
                cmd_type: e,
                rpcid: r,
                raw: JSON.stringify(n),
              }),
            this.ws.readyState !== WebSocket.OPEN)
          )
            throw lo();
          const i = JSON.stringify(t);
          try {
            this.ws.send("".concat(e, "=").concat(i)), this.emit("send", e, t);
          } catch (e) {
            throw (
              (he.warning("signaling: websocket send error", e),
              this.reconnect().catch((e) => {
                he.warning("signaling: reconnect error", e);
              }),
              lo())
            );
          }
        }),
        (this.handlePing = () => {
          this.sendWsMsg("pong", {}),
            this.reconnectTimeoutID && clearTimeout(this.reconnectTimeoutID),
            (this.reconnectTimeoutID = setTimeout(() => {
              he.debug("signaling: websocket heartbeat timeout"),
                this.reconnect().catch((e) => {
                  he.warning("signaling: reconnect error", e);
                });
            }, 9e3));
        }),
        (this.receiveWsMsg = (e, t) => {
          switch ((this.emit("receive", e, t), e)) {
            case "ping":
              this.handlePing();
              break;
            case "auth-res":
              this.emit("@auth-res", t);
            case "pubpc-res":
            case "subpc-res":
            case "pub-tracks":
            case "webrtc-candidate":
            case "on-player-in":
            case "on-player-out":
            case "disconnect":
            case "mute-tracks":
            case "on-add-tracks":
            case "on-remove-tracks":
            case "on-player-reconnect":
            case "on-player-reconnect-in":
            case "on-command":
              this.emit(e, t);
              break;
            case "sub-res":
            case "unsub-res":
              this.emit(e, t),
                this.emit("".concat(e, "-").concat(t.streamid), t);
              break;
            case "control-res":
              this.emit(e, t),
                this.emit(
                  "".concat(e, "-").concat(t.command, "-").concat(t.playerid),
                  t
                );
              break;
            case "on-pubpc-connected":
            case "on-pubpc-disconnected":
              this.emit("on-pubpc-state", {
                pcid: t.pcid,
                connected: "on-pubpc-connected" === e,
              }),
                this.emit("".concat(e, "-").concat(t.pcid), t);
              break;
            case "on-subpc-disconnected":
            case "on-subpc-connected":
              this.emit("on-subpc-state", {
                pcid: t.pcid,
                connected: "on-subpc-connected" === e,
              }),
                this.emit(e, t);
              break;
            case "pub-tracks-res":
              this.emit(e, t);
              break;
            case "on-messages":
            case "on-qos-messages":
              (t.messages = t.messages.sort((e, t) => e.msgsn - t.msgsn)),
                (this.customMsgNumber =
                  t.messages[t.messages.length - 1].msgsn),
                this.emit(e, t);
              break;
            case "unpub-tracks-res":
            case "sub-tracks-res":
            case "unsub-tracks-res":
            case "on-pubpc-restart-notify":
            case "on-subpc-restart-notify":
            case "set-sub-profile-res":
            case "on-sub-profile-changed":
            case "pubpc-restart-res":
            case "subpc-restart-res":
            case "create-merge-job-res":
            case "create-forward-job-res":
            case "stop-forward-res":
            case "on-job-connected":
            case "on-job-disconnected":
            case "on-merge-job-connected":
            case "on-merge-job-disconnected":
            case "update-merge-tracks-res":
            case "set-privileges-res":
            case "start-media-relay-res":
            case "update-media-relay-res":
            case "stop-media-relay-res":
            case "on-media-relay-state":
              this.emit(e, t);
          }
        }),
        (this.accessToken = t),
        (this.capsdp = r),
        (this.reconnectTimes = n),
        (this.wsConnectTimeout = i),
        (this.playerdata = o),
        (this.privileges = s),
        (this._state = ss.CONNECTING);
    }
    onWsClose(t, r, n) {
      this.wsConnectTimeoutID && clearTimeout(this.wsConnectTimeoutID),
        (this._state = ss.CLOSED),
        he.warning("signaling: websocket onclose", n),
        this.startAuthTime &&
          Xi.addEvent("SignalAuth", {
            auth_start_time: this.startAuthTime,
            auth_dns_time: 0,
            auth_server_ip: this.url,
            auth_error_code: n.code,
            auth_error_message: n.toString(),
            auth_take_time: Date.now() - this.startAuthTime,
            access_token: this.accessToken,
            event_grade: e.QNEventGrade.NORMAL,
            event_category: e.QNEventCategory.CORE,
            auth_server_info: this.url,
            auth_reason: "connect",
          });
      let i = this.reconnectPromise;
      switch (n.code) {
        case 1e3:
          this.emit("@closed");
          break;
        case 1001:
        case 1005:
        case 1011:
        case 1013:
          i = this.reconnect();
          break;
        case 1006:
          i = this.reconnect(this.wsConnectTimeout);
          break;
        case 1007:
        case 1008:
        case 1009:
        case 1010:
          break;
        case 1012:
        case 1014:
          i = this.reconnect(5e3);
      }
      t &&
        r &&
        (i
          ? i.then(t).catch((e) => {
              he.warning("signaling: reconnect error", e);
            })
          : r(n));
    }
    sendDisconnect() {
      if (this.state === ss.OPEN)
        try {
          this.sendWsMsg("disconnect", {});
        } catch (e) {}
    }
    reconnect() {
      let e =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1e3;
      return (
        this.reconnectTimeoutID && clearTimeout(this.reconnectTimeoutID),
        this.wsConnectTimeoutID && clearTimeout(this.wsConnectTimeoutID),
        this.reconnectPromise && this._state === ss.CONNECTING
          ? this.reconnectPromise
          : this.currentLeftReconnectTimes <= 0
          ? (this.emit("@error", { code: 10007 }),
            Promise.reject(
              "websocket reconnectTimes run out, reconnect stops."
            ))
          : ((this.currentLeftReconnectTimes -= 1),
            (this._state = ss.CONNECTING),
            he.debug(
              "signaling: websocket reconnecting, currentLeftReconnectTimes remaining: ",
              this.currentLeftReconnectTimes
            ),
            (this.reconnectPromise = Vo(e)
              .then(() => this.initWs())
              .then(
                (e) => (
                  (this.reconnectPromise = void 0),
                  (this.currentLeftReconnectTimes = this.reconnectTimes),
                  e
                )
              )
              .catch(
                (e) => (
                  (this._state = ss.CLOSED),
                  this.emit("error", e),
                  Promise.reject(e)
                )
              )),
            this.reconnectPromise)
      );
    }
    request(e, t) {
      const r = Fo(8);
      return (
        (t.rpcid = r),
        he.log("ws request", r, e, t),
        this.sendWsMsg(e, t),
        new Promise((t) => {
          const n = (i) => {
            i.rpcid === r &&
              (he.log("ws response", r, e, i),
              this.off("".concat(e, "-res"), n),
              t(i));
          };
          this.on("".concat(e, "-res"), n);
        })
      );
    }
    release() {
      this.reconnectTimeoutID && clearTimeout(this.reconnectTimeoutID),
        this.wsConnectTimeoutID && clearTimeout(this.wsConnectTimeoutID),
        this.removeAllListeners(),
        this.ws &&
          ((this.ws.onopen = null),
          (this.ws.onclose = null),
          (this.ws.onerror = null),
          this.ws.close());
    }
  }
  class ls {}
  class As {
    constructor(e, t, r, n) {
      (this.videoTrackInfo = []),
        (this.audioTrackInfo = []),
        (this.layoutLevel = 0),
        (this.width = e),
        (this.height = t),
        (this.jobID = n),
        (this.controller = r),
        this.controller.getCurrentTracks().forEach((e) => {
          "audio" === e.kind
            ? this.audioTrackInfo.push(e)
            : this.videoTrackInfo.push(e);
        }),
        this.controller.addMergeTrack(
          this.audioTrackInfo.map((e) => ({ trackID: e.trackID })),
          this.jobID
        ),
        this.initLayout(),
        (this.controller.onAddTracks = (e) => {
          const t = e.filter((e) => "audio" === e.kind),
            r = e.filter((e) => "video" === e.kind);
          this.controller.addMergeTrack(
            t.map((e) => ({ trackID: e.trackID })),
            this.jobID
          ),
            r.forEach(this.handleAddVideoTrack.bind(this));
        }),
        (this.controller.onRemoveTracks = (e) => {
          e.filter((e) => "video" === e.kind).forEach(
            this.handleRemoveVideoTrack.bind(this)
          );
        }),
        he.log("init default merger, init layout: ", this.layout);
    }
    initLayout() {
      const e = this.videoTrackInfo.length;
      (this.layoutLevel = 0),
        (this.layout = {
          "level-0": {
            items: {
              "item-0": { x: 0, y: 0, isExpand: !1, isExpanded: !1, index: 0 },
            },
            itemWidth: this.width,
            itemHeight: this.height,
            maxItems: 1,
            currentItems: 0,
            splitWidthFlag: this.width < this.height,
          },
        });
      let t = this.width >= this.height;
      if (0 !== e) {
        for (; Math.pow(2, this.layoutLevel) < e; )
          this.updateLayoutLevel(t), (t = !t);
        this.setLevelLayoutStream();
      }
    }
    updateLayoutLevel(e) {
      const t = this.layout["level-".concat(this.layoutLevel)],
        r = t.itemWidth,
        n = t.itemHeight;
      this.layoutLevel += 1;
      const i = Math.pow(2, this.layoutLevel),
        o = e ? r / 2 : r,
        a = e ? n : n / 2;
      if (1 === this.layoutLevel)
        this.layout["level-".concat(this.layoutLevel)] = {
          items: {
            "item-0": { x: 0, y: 0, isExpand: !1, isExpanded: !1, index: 0 },
            "item-1": {
              x: this.width >= this.height ? o : 0,
              y: this.width < this.height ? a : 0,
              isExpand: !1,
              isExpanded: !1,
              index: 1,
            },
          },
          maxItems: i,
          currentItems: 0,
          itemWidth: o,
          itemHeight: a,
          splitWidthFlag: e,
        };
      else {
        this.layout["level-".concat(this.layoutLevel)] = {
          items: {},
          maxItems: i,
          currentItems: 0,
          itemWidth: o,
          itemHeight: a,
          splitWidthFlag: e,
        };
        const t = this.layout["level-".concat(this.layoutLevel)].items;
        Object.keys(
          this.layout["level-".concat(this.layoutLevel - 1)].items
        ).forEach((r) => {
          const n = this.layout["level-".concat(this.layoutLevel - 1)].items[r],
            i = 2 * n.index;
          (t["item-".concat(i)] = {
            x: n.x,
            y: n.y,
            isExpand: !1,
            isExpanded: !1,
            index: i,
          }),
            (t["item-".concat(i + 1)] = e
              ? {
                  x: n.x + o,
                  y: n.y,
                  isExpand: !1,
                  isExpanded: !1,
                  index: i + 1,
                }
              : {
                  x: n.x,
                  y: n.y + a,
                  isExpand: !1,
                  isExpanded: !1,
                  index: i + 1,
                });
        });
      }
      he.log(
        "merger: increase layout level, current level: ".concat(
          this.layoutLevel
        ),
        this.layout
      );
    }
    setLevelLayoutStream() {
      const e = this.videoTrackInfo.length,
        t = this.layout["level-".concat(this.layoutLevel)];
      let r = t.maxItems - e,
        n = 0;
      for (let e = 0; e < t.maxItems; e += 1)
        r > 0
          ? e % 2 == 0
            ? ((t.items["item-".concat(e)].isExpand = !0),
              (t.items["item-".concat(e)].trackID =
                this.videoTrackInfo[n].trackID),
              this.sendMergeOpt(this.layoutLevel, e),
              (n += 1))
            : ((t.items["item-".concat(e)].isExpanded = !0), (r -= 1))
          : ((t.items["item-".concat(e)].trackID =
              this.videoTrackInfo[n].trackID),
            this.sendMergeOpt(this.layoutLevel, e),
            (n += 1));
      t.currentItems = e;
    }
    sendMergeOpt(e, t) {
      const r = this.layout["level-".concat(e)],
        n = r.items["item-".concat(t)];
      if (!n.trackID || n.isExpanded) return;
      let i = r.itemWidth,
        o = r.itemHeight;
      n.isExpand && (r.splitWidthFlag ? (i *= 2) : (o *= 2));
      const a = { x: n.x, y: n.y, w: i, h: o, z: 0, trackID: n.trackID };
      this.controller.addMergeTrack([a], this.jobID);
    }
    handleRemoveVideoTrack(e) {
      ge(this.videoTrackInfo, (t) => t.trackID === e.trackID);
      const t = this.layout["level-".concat(this.layoutLevel)];
      if (
        this.layoutLevel > 0 &&
        this.videoTrackInfo.length <=
          this.layout["level-".concat(this.layoutLevel - 1)].maxItems
      )
        (this.layoutLevel -= 1),
          he.log(
            "merger: reduce layout level, current level: ".concat(
              this.layoutLevel
            ),
            this.layout
          ),
          this.setLevelLayoutStream();
      else
        for (const r in t.items) {
          const n = t.items[r];
          if (n.trackID === e.trackID) {
            n.index % 2 == 0
              ? (t.items["item-".concat(n.index + 1)]
                  ? ((n.isExpand = !0),
                    (n.trackID = t.items["item-".concat(n.index + 1)].trackID),
                    (t.items["item-".concat(n.index + 1)].isExpanded = !0),
                    (t.items["item-".concat(n.index + 1)].trackID = void 0))
                  : (n.trackID = void 0),
                this.sendMergeOpt(this.layoutLevel, n.index))
              : ((n.isExpanded = !0),
                (n.trackID = void 0),
                (t.items["item-".concat(n.index - 1)].isExpand = !0),
                this.sendMergeOpt(this.layoutLevel, n.index - 1));
            break;
          }
        }
    }
    handleAddVideoTrack(e) {
      const t = this.videoTrackInfo.length;
      if (
        (this.videoTrackInfo.push(e),
        (this.videoTrackInfo = wa(this.videoTrackInfo, "trackID")),
        this.videoTrackInfo.length === t)
      )
        return void he.log("handle add video track ignore", e);
      const r = this.layout["level-".concat(this.layoutLevel)];
      if (this.videoTrackInfo.length <= r.maxItems) {
        for (const t in r.items) {
          const n = r.items[t];
          if (!n.trackID) {
            (n.trackID = e.trackID),
              n.isExpanded &&
                ((n.isExpanded = !1),
                (r.items["item-".concat(n.index - 1)].isExpand = !1),
                this.sendMergeOpt(this.layoutLevel, n.index - 1)),
              this.sendMergeOpt(this.layoutLevel, n.index);
            break;
          }
        }
        r.currentItems = this.videoTrackInfo.length;
      } else this.updateLayoutLevel(!r.splitWidthFlag), this.setLevelLayoutStream();
    }
    release() {
      this.controller.release();
    }
  }
  class hs {
    static loadImage(e) {
      if (e instanceof File) return hs.loadImageFromFile(e);
      if (e instanceof ArrayBuffer) return hs.loadImageFromArrayBuffer(e);
      if ("string" == typeof e) return hs.loadImageFromUrl(e);
      throw eo("unsupported image source");
    }
    static loadImageFromUrl(e) {
      return new Promise((t, r) => {
        var n = new Image();
        (n.crossOrigin = "Anonymous"),
          (n.src = e),
          (n.onload = function () {
            t(n);
          }),
          (n.onerror = function (e) {
            r(e);
          });
      });
    }
    static loadImageFromFile(e) {
      return new Promise((t, r) => {
        const n = new FileReader();
        (n.onload = (e) => {
          n.result && t(hs.loadImageFromUrl(n.result));
        }),
          (n.onerror = (e) => {
            r(e);
          }),
          n.readAsDataURL(e);
      });
    }
    static loadImageFromArrayBuffer(e) {
      return new Promise((t, r) => {
        const n = new Blob([e]),
          i = URL.createObjectURL(n);
        t(hs.loadImageFromUrl(i));
      });
    }
  }
  class fs {
    constructor() {
      (this.canvas = document.createElement("canvas")),
        (this.ctx = this.canvas.getContext("2d"));
    }
    setSource(e) {
      return pe(this, void 0, void 0, function* () {
        e !== this.source &&
          ((this.source = e), yield this.createImageStreamTrack(e));
      });
    }
    get id() {
      if (this.mediaTrack) return this.mediaTrack.id;
    }
    createImageStreamTrack(e) {
      return pe(this, void 0, void 0, function* () {
        let t;
        (t =
          e instanceof File
            ? yield hs.loadImageFromFile(e)
            : e instanceof ArrayBuffer
            ? yield hs.loadImageFromArrayBuffer(e)
            : yield hs.loadImageFromUrl(e)),
          (this.canvas.width = t.width),
          (this.canvas.height = t.height),
          this.drawIntervalId && clearInterval(this.drawIntervalId),
          (this.drawIntervalId = setInterval(() => {
            this.ctx.drawImage(t, 0, 0);
          }, 900));
        const r = this.canvas.captureStream(1);
        this.mediaTrack = r.getTracks()[0];
      });
    }
    release() {
      this.drawIntervalId && clearInterval(this.drawIntervalId);
    }
  }
  class ps {
    constructor(e, t, r, n) {
      (this.id = e),
        (this.mid = t),
        (this.kind = r),
        (this.rtpParameters = n),
        (this.track = null);
    }
  }
  class ms {
    constructor(t, r, n, i, o) {
      (this._connectStatus = e.TrackConnectStatus.Idle),
        (this.track = n),
        (this.trackID = i),
        (this.mid = o),
        (this.transport = t),
        (this.direction = r);
    }
    get connectStatus() {
      return this._connectStatus;
    }
    set connectStatus(e) {
      if (e !== this._connectStatus) {
        const t = this._connectStatus;
        (this._connectStatus = e),
          Ho(() => {
            this.onConnectStatusChange &&
              this.onConnectStatusChange(t, this._connectStatus);
          });
      }
    }
    startConnect() {
      return (
        (this.connectStatus = e.TrackConnectStatus.Connecting),
        new Promise((t, r) => {
          this.onConnectStatusChange = (n, i) => {
            i === e.TrackConnectStatus.Connect && t(),
              i === e.TrackConnectStatus.Idle && r();
          };
        })
      );
    }
    appendConsumner(e, t) {
      (this.consumer = new ps(this.trackID, this.mid, t, e)),
        this.transport.appendConsumer(this.consumer);
    }
    setMute(e) {
      this.track && this.track.setMute(e);
    }
    addTrackId(e) {
      this.track && ((this.trackID = e), this.track.setInfo({ trackID: e }));
    }
    release() {
      this.consumer && this.transport
        ? (this.transport.recvHandler.isPcReady &&
            this.transport.removeConsumers([this.consumer]),
          this.track && this.track.release())
        : this.track && this.track.reset();
    }
  }
  const gs =
      "data:text/javascript;base64," +
      btoa(
        "\nclass AudioBufferProcessor extends AudioWorkletProcessor {\n  constructor(...args) {\n    super(...args);\n    this.signal = true;\n    this.port.onmessage = (e) => {\n      this.signal = false;\n    };\n  }\n  process (inputs, outputs, parameters) {\n    inputs.length && inputs[0].length && this.port.postMessage(inputs[0][0]);\n    return this.signal;\n  }\n}\nregisterProcessor('audio-buffer-processor', AudioBufferProcessor);\n"
      ),
    vs = window.AudioContext || window.webkitAudioContext || window.Object,
    Ts = Ti.audioContextOptions
      ? new vs({ latencyHint: "interactive" })
      : new vs();
  if (((window.audioContext = Ts), window.Promise)) {
    const Lc = () => {
      var e;
      ((e = Ts),
      new Promise((t, r) => {
        if ("suspended" === e.state) {
          he.log("audio context state is suspended");
          const n = () => {
            e.resume()
              .then(() => {
                document.body.removeEventListener("touchstart", n),
                  document.body.removeEventListener("touchend", n),
                  document.body.removeEventListener("mousedown", n),
                  document.body.removeEventListener("mouseup", n),
                  t(!0);
              })
              .catch(r);
          };
          document.body.addEventListener("touchstart", n, !0),
            document.body.addEventListener("touchend", n, !0),
            document.body.addEventListener("mousedown", n, !0),
            document.body.addEventListener("mouseup", n, !0),
            n();
        } else t(!1);
      }))
        .then((e) => {
          he.debug("web audio context unlocked", e);
        })
        .catch((e) => {
          he.warning("can not unlock web audio context", e);
        }),
        window.removeEventListener("load", Lc);
    };
    document.body ? Lc() : window.addEventListener("load", Lc),
      (Ts.onstatechange = () => {
        Lc();
      });
  }
  const bs = 4096,
    Ss = Ts.sampleRate,
    ys = ["play", "playing", "pause", "ended", "waiting", "seeking"];
  class ks extends Pa {
    get audioSourceState() {
      return this._audioSourceState;
    }
    set audioSourceState(e) {
      e !== this._audioSourceState &&
        (this.emit("@audio-source-state-change", e, this._audioSourceState),
        (this._audioSourceState = e));
    }
    constructor() {
      super(),
        (this.audioSource = null),
        (this.sampleList = new Float32Array()),
        (this.isScriptNodeAvailable = "createScriptProcessor" in Ts),
        (this._audioSourceState = e.AudioSourceState.IDLE),
        (this.bufferSourceDuration = {
          startTime: 0,
          pauseTime: 0,
          lastPauseTime: 0,
          offsetTime: 0,
          stopTime: 0,
        }),
        (this.handleMediaElementEvents = (t) => {
          switch (t.type) {
            case "playing":
            case "play":
              this.audioSourceState = e.AudioSourceState.PLAY;
              break;
            case "waiting":
            case "seeking":
              this.audioSourceState = e.AudioSourceState.LOADING;
              break;
            case "ended":
              this.audioSourceElement &&
                (this.audioSourceElement.currentTime = 0),
                (this.audioSourceState = e.AudioSourceState.END);
          }
        }),
        Rc.forceAudioWorklet && (this.isScriptNodeAvailable = !1);
    }
    initAudioContext() {
      he.log("init audio context", Ts.state),
        "suspended" === Ts.state &&
          (he.log("audio context suspended"),
          Ts.resume().catch((e) => {
            he.warning(
              "resume audiocontext failed! see: http://s.qnsdk.com/s/Txsdz",
              e
            );
          })),
        he.log("init audio finish", Ts.state),
        (this.analyserNode = Ts.createAnalyser()),
        (this.analyserNode.fftSize = 2048),
        (this.gainNode = Ts.createGain()),
        (function (e) {
          if (Ti.disconnectAudioNode) return;
          const t = e.connect,
            r = e.disconnect;
          (e.connect = (r, n, i) => (
            e._inputNodes || (e._inputNodes = []),
            r instanceof AudioNode
              ? (e._inputNodes.push(r),
                (e._inputNodes = wa(e._inputNodes, (e) => e)),
                t.call(e, r, n, i))
              : t.call(e, r, n),
            e
          )),
            (e.disconnect = (t, n, i) => {
              if (!t) return r.call(e), void (e._inputNodes = []);
              r.call(e, t, n, i), ge(e._inputNodes, (e) => e === t);
              for (const t of e._inputNodes) e.connect(t);
            });
        })(this.gainNode),
        Ti.mediaStreamDest &&
          (this.audioStream = Ts.createMediaStreamDestination());
    }
    setMediaStreamSource(e) {
      (this.audioSource = Ts.createMediaStreamSource(e)), this.connect();
    }
    setAudioBufferSource() {
      (this.audioSource = Ts.createBufferSource()),
        (this.audioSource.onended = () => {
          (this.audioSource.onended = null),
            this.audioSource.stop(),
            this.audioSource.disconnect(),
            (this.audioSource = null),
            (this.bufferSourceDuration.stopTime = Ts.currentTime),
            (this.audioSourceState = e.AudioSourceState.END);
        }),
        this.connect();
    }
    setMediaElementSource(e) {
      (this.audioSource = Ts.createMediaElementSource(e)),
        (this.audioSourceElement = e);
      for (const e of ys)
        this.audioSourceElement.addEventListener(
          e,
          this.handleMediaElementEvents
        );
      this.connect();
    }
    setAudioSourceLoop(e) {
      (this.audioSourceLoop = e),
        this.isAudioSource()
          ? (this.audioSource.loop = !!e)
          : this.audioSourceElement && (this.audioSourceElement.loop = !!e);
    }
    setAudioBuffer(e) {
      this.isAudioSource() &&
        ((this.audioSource.buffer = e), (this.audioSourceBuffer = e));
    }
    playAudioSource() {
      let t =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
      if (this.isAudioSource()) {
        this.resetBufferSourceDuration();
        try {
          this.audioSource.start(0, t),
            (this.bufferSourceDuration.startTime = Ts.currentTime),
            (this.bufferSourceDuration.offsetTime = t),
            (this.audioSourceState = e.AudioSourceState.PLAY);
        } catch (e) {
          this.stopAudioSource(), this.playAudioSource(t);
        }
      } else this.audioSourceElement ? ((this.audioSourceElement.currentTime = 0), this.audioSourceElement.play().catch(Qo)) : null === this.audioSource && this.audioSourceBuffer && (this.resetBufferSourceDuration(), this.setAudioBufferSource(), this.setAudioBuffer(this.audioSourceBuffer), this.setAudioSourceLoop(!!this.audioSourceLoop), this.audioSource.start(0, t), (this.bufferSourceDuration.startTime = Ts.currentTime), (this.bufferSourceDuration.offsetTime = t), (this.audioSourceState = e.AudioSourceState.PLAY));
    }
    resumeAudioSource() {
      if (this.isAudioSource()) {
        if (this.audioSourceState !== e.AudioSourceState.PAUSE) return;
        (this.audioSource.playbackRate.value = 1),
          (this.bufferSourceDuration.pauseTime +=
            Ts.currentTime - this.bufferSourceDuration.lastPauseTime),
          (this.bufferSourceDuration.lastPauseTime = 0),
          (this.audioSourceState = e.AudioSourceState.PLAY);
      } else this.audioSourceElement && this.audioSourceElement.play().catch(Qo);
    }
    pauseAudioSource() {
      this.isAudioSource()
        ? ((this.audioSource.playbackRate.value = ui ? 1e-7 : Number.MIN_VALUE),
          this.bufferSourceDuration.lastPauseTime ||
            (this.bufferSourceDuration.lastPauseTime = Ts.currentTime),
          (this.audioSourceState = e.AudioSourceState.PAUSE))
        : this.audioSourceElement &&
          (this.audioSourceElement.pause(),
          this.audioSourceState !== e.AudioSourceState.END &&
            (this.audioSourceState = e.AudioSourceState.PAUSE));
    }
    stopAudioSource() {
      let t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
        r = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      this.isAudioSource()
        ? ((this.audioSource.onended = null),
          this.audioSource.stop(),
          this.audioSource.disconnect(),
          (this.audioSource = null),
          (this.bufferSourceDuration.stopTime = Ts.currentTime),
          t || !1 !== r || (this.audioSourceState = e.AudioSourceState.STOP))
        : this.audioSourceElement &&
          (!1 === r && (this.audioSourceState = e.AudioSourceState.STOP),
          this.audioSourceElement.pause(),
          (this.audioSourceElement.currentTime = 0));
    }
    getAudioSourceCurrentTime() {
      if (this.audioSourceElement) return this.audioSourceElement.currentTime;
      if (this.isAudioSource()) {
        let e = Ts.currentTime;
        const t = this.getAudioSourceDuration();
        this.bufferSourceDuration.lastPauseTime &&
          (e = this.bufferSourceDuration.lastPauseTime),
          this.bufferSourceDuration.stopTime &&
            (e = this.bufferSourceDuration.stopTime);
        const r =
          this.bufferSourceDuration.offsetTime +
          e -
          this.bufferSourceDuration.startTime -
          this.bufferSourceDuration.pauseTime;
        return Math.max(0, r % t);
      }
      return 0;
    }
    setAudioSourceCurrentTime(e) {
      this.audioSourceElement
        ? (this.audioSourceElement.currentTime = e)
        : this.isAudioSource() &&
          (this.stopAudioSource(!0), this.playAudioSource(e));
    }
    getAudioSourceDuration() {
      return this.audioSourceElement
        ? this.audioSourceElement.duration
        : this.audioSourceBuffer
        ? this.audioSourceBuffer.duration
        : 0;
    }
    release(e) {
      if (
        (e &&
          this.audioSource instanceof MediaStreamAudioSourceNode &&
          this.audioSource.mediaStream &&
          this.audioSource.mediaStream.getTracks().map((e) => e.stop()),
        this.audioSource && this.audioSource.disconnect(),
        this.gainNode.disconnect(),
        this.audioSourceElement)
      ) {
        for (const e of ys)
          this.audioSourceElement.removeEventListener(
            e,
            this.handleMediaElementEvents
          );
        (this.audioSourceElement.src = ""),
          this.audioSourceElement.load(),
          this.audioSourceElement.remove(),
          (this.audioSourceElement = void 0);
      }
      this.scriptNode && this.scriptNode.disconnect(),
        this.audioWorkletNode &&
          ((this.sampleList = new Float32Array()),
          this.audioWorkletNode.port.postMessage("close"),
          this.audioWorkletNode.disconnect());
    }
    connect() {
      this.audioSource
        ? (this.audioSource.connect(this.analyserNode),
          this.audioSource.connect(this.gainNode),
          this.audioStream &&
            (this.gainNode.connect(this.audioStream), this.onAudioBuffer()))
        : he.warning("no audio source, can not connect");
    }
    handleAudioBuffer(e) {
      const t = e.inputBuffer;
      this.emit("audioBuffer", t),
        this.audioBufferCallback && this.audioBufferCallback(t);
    }
    handleAudioProcressBuffer(e) {
      const t = new Float32Array(e.data.length);
      for (let r = 0; r < e.data.length; r++) t[r] = e.data[r];
      const r = this.sampleList;
      if (
        ((this.sampleList = new Float32Array(r.length + t.length)),
        this.sampleList.set(r),
        this.sampleList.set(t, r.length),
        this.sampleList.length === bs)
      ) {
        const e = Ts.createBuffer(2, bs, Ss);
        for (let t = 0; t < 2; t++) {
          const r = e.getChannelData(t);
          for (let e = 0; e < r.length; e++) r[e] = this.sampleList[e];
        }
        this.emit("audioBuffer", e),
          this.audioBufferCallback && this.audioBufferCallback(e),
          (this.sampleList = new Float32Array());
      }
    }
    onAudioBuffer(e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : bs;
      return pe(this, void 0, void 0, function* () {
        (this.audioBufferCallback = e),
          (this.audioBufferSize = t),
          this.audioStream &&
            this.audioSource &&
            (this.isScriptNodeAvailable
              ? this.scriptNode ||
                ((this.scriptNode = Ts.createScriptProcessor(t)),
                this.audioSource.connect(this.scriptNode),
                this.scriptNode.connect(this.audioStream),
                (this.scriptNode.onaudioprocess =
                  this.handleAudioBuffer.bind(this)))
              : this.audioWorkletNode ||
                (yield Ts.audioWorklet.addModule(gs),
                (this.audioWorkletNode = new AudioWorkletNode(
                  Ts,
                  "audio-buffer-processor"
                )),
                this.audioSource.connect(this.audioWorkletNode),
                this.audioWorkletNode.connect(this.audioStream),
                (this.audioWorkletNode.port.onmessage =
                  this.handleAudioProcressBuffer.bind(this))));
      });
    }
    resetBufferSourceDuration() {
      this.bufferSourceDuration = {
        offsetTime: 0,
        startTime: 0,
        lastPauseTime: 0,
        pauseTime: 0,
        stopTime: 0,
      };
    }
    isAudioSource() {
      const { audioSource: e } = this;
      return (
        e instanceof AudioBufferSourceNode ||
        e instanceof AudioScheduledSourceNode
      );
    }
  }
  class _s extends Ra {
    constructor(e, t, r) {
      if ("audio" !== e.kind) throw new Error("audio track only!");
      super(e, t, r),
        (this.mediaStream = new MediaStream()),
        this.mediaStream.addTrack(e);
    }
    resume(e) {
      (this.mediaTrack = e),
        this.removeAllListeners("@get-stats"),
        this.resetStats();
      const t = new MediaStream([e]);
      (this.mediaStream = t),
        this.mediaElement &&
          ((this.mediaElement.dataset.localid = e.id),
          (this.mediaElement.srcObject = t)),
        this.audioManager &&
          (this.audioManager.release("local" === this.direction),
          this.initAudioManager());
    }
    initAudioManager(e) {
      (this.audioManager = new ks()),
        this.audioManager.initAudioContext(),
        this.audioManager.setMediaStreamSource(this.mediaStream),
        this.audioManager.on("audioBuffer", (e) => {
          this.emit("audioBuffer", e);
        }),
        e &&
          Ti.mediaStreamDest &&
          ((this.mediaStream = this.audioManager.audioStream.stream),
          (this.mediaTrack = this.mediaStream.getTracks()[0]));
    }
    setVolume(e) {
      e < 0 || e > 100
        ? he.warning(
            "available volume value is between 0 to 100 , current ".concat(
              e,
              " is unavailable"
            )
          )
        : "local" != this.direction
        ? this.mediaElement && (this.mediaElement.volume = e)
        : this.audioManager.gainNode.gain.setValueAtTime(e, Ts.currentTime);
    }
    getCurrentTimeDomainData() {
      const e = new Uint8Array(2048);
      return this.audioManager.analyserNode.getByteTimeDomainData(e), e;
    }
    getCurrentFrequencyData() {
      const e = new Uint8Array(
        this.audioManager.analyserNode.frequencyBinCount
      );
      return this.audioManager.analyserNode.getByteFrequencyData(e), e;
    }
    getVolume() {
      return this.audioManager.gainNode.gain.value;
    }
    getCurrentVolumeLevel() {
      const e = this.getCurrentFrequencyData();
      let t = 0,
        r = e.length;
      return (
        e.forEach((n, i) => {
          const o = (i * (Ts.sampleRate || 44100)) / e.length;
          if (o > 22050) return void (r -= 1);
          const a =
            ((function (e) {
              const t = e * e;
              return (
                (187374169.94399998 * t * t) /
                ((t + 424.36) *
                  Math.sqrt((t + 11599.29) * (t + 544496.41)) *
                  (t + 14884e4))
              );
            })(o) *
              n) /
            255;
          a <= 0 ? (r -= 1) : (t += a * a);
        }),
        0 === r ? 0 : Math.sqrt(t / r)
      );
    }
    release() {
      this.emit("release"),
        this.removeAllListeners(),
        this.statsInterval && window.clearInterval(this.statsInterval),
        this.audioManager &&
          this.audioManager.release("local" === this.direction),
        this.removeMediaElement();
    }
  }
  class ws extends Pa {
    constructor(e, t, r) {
      super(),
        (this._isRestartingICE = !1),
        (this.isPcReady = !1),
        (this.midRidEncoding = {}),
        (this.removeMids = new Set()),
        (this.lastMediaStatistics = []),
        (this.intervalId = -1),
        (this.playQualityIntervalId = -1),
        (this.qualityStats = new Map()),
        (this._direction = e),
        (this._pc = pa()),
        (this._extendedRtpCapabilities = t),
        (this._remoteSdp = new ts(e, t)),
        (this._simulcast = !!r && r.simulcast),
        (this.coreInstance = r && r.core),
        this._pc.addEventListener("iceconnectionstatechange", () =>
          pe(this, void 0, void 0, function* () {
            let e = "";
            const t = [...(yield this._pc.getStats()).values()].find(
              (e) => "remote-candidate" === e.type
            );
            switch (
              (void 0 !== t && (e = t.protocol), this._pc.iceConnectionState)
            ) {
              case "checking":
                this.emit("@connectionstatechange", "connecting", e);
                break;
              case "connected":
              case "completed":
                this.emit("@connectionstatechange", "connected", e),
                  this.registerMediaStatisticStatsReport(),
                  this.registerPlayQualityReport();
                break;
              case "failed":
                this.emit("@connectionstatechange", "failed", e),
                  this.unregisterMediaStatisticStatsReport(),
                  this.unregisterPlayQualityReport();
                break;
              case "disconnected":
                this.emit("@connectionstatechange", "disconnected", e),
                  this.unregisterMediaStatisticStatsReport(),
                  this.unregisterPlayQualityReport();
                break;
              case "closed":
                this.emit("@connectionstatechange", "closed", e),
                  this.unregisterMediaStatisticStatsReport(),
                  this.unregisterPlayQualityReport();
            }
          })
        );
    }
    getStats(e, t) {
      return pe(this, void 0, void 0, function* () {
        return yield ga(this._pc, e, this._direction, t);
      });
    }
    registerPlayQualityReport() {
      "send" !== this._direction &&
        (this.unregisterPlayQualityReport(),
        (this.playQualityIntervalId = window.setInterval(
          () =>
            pe(this, void 0, void 0, function* () {
              const e = yield (function (e, t) {
                return pe(this, void 0, void 0, function* () {
                  let r;
                  try {
                    r = yield e.getStats();
                  } catch (e) {
                    return (
                      qo(() => {
                        he.debug(
                          "get media statistic stats error, fallback to default",
                          e
                        );
                      }, "getStats error"),
                      []
                    );
                  }
                  if (!r)
                    return (
                      qo(() => {
                        he.debug(
                          "get null media statistic stats, fallback to default"
                        );
                      }, "getStats error"),
                      []
                    );
                  const n = [...r.values()];
                  return t.subscribedTracks
                    .map((e) => {
                      const t = e.mediaTrack,
                        r = n.find(
                          (e) =>
                            e.type === ca.Track && e.trackIdentifier === t.id
                        );
                      if (!r) return;
                      const i = n.find(
                        (e) => e.type === ca.InBoundRtp && e.trackId === r.id
                      );
                      return i
                        ? {
                            time: Date.now(),
                            trackID: e.info.trackID,
                            kind: "video" === i.kind ? "video" : "audio",
                            framesDecoded: i.framesDecoded || -1,
                            totalSamplesReceived: i.totalSamplesReceived || -1,
                          }
                        : void 0;
                    })
                    .filter(Ee);
                });
              })(this._pc, this.coreInstance);
              for (const t of e) {
                const e = this.qualityStats.get(t.trackID);
                e ? e.push(t) : this.qualityStats.set(t.trackID, [t]);
              }
              this.addQualityStats();
            }),
          2e3
        )));
    }
    unregisterPlayQualityReport() {
      "send" !== this._direction &&
        -1 !== this.playQualityIntervalId &&
        (window.clearInterval(this.playQualityIntervalId),
        this.addQualityStats(!0),
        (this.playQualityIntervalId = -1));
    }
    addQualityStats() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      const t = [...this.qualityStats.values()];
      if (t.some((e) => e.length >= 30) || e) {
        he.log("quality stats", this.qualityStats);
        for (const e of t) {
          if (0 === e.length) continue;
          const t = e[0].trackID,
            r = 2 * e.length * 1e3;
          if ("video" === e[0].kind) {
            const n =
              1e3 *
              e.reduce(
                (t, r, n) =>
                  n >= 1 && e[n].framesDecoded === e[n - 1].framesDecoded
                    ? t + 2
                    : t,
                0
              );
            Xi.addEvent("VideoPlayQuality", {
              track_id: t,
              freeze_duration: n,
              total_duration: r,
            });
          } else {
            const n =
              1e3 *
              e.reduce(
                (t, r, n) =>
                  n >= 1 &&
                  e[n].totalSamplesReceived === e[n - 1].totalSamplesReceived
                    ? t + 2
                    : t,
                0
              );
            Xi.addEvent("AudioPlayQuality", {
              track_id: t,
              freeze_duration: n,
              total_duration: r,
            });
          }
        }
        this.qualityStats = new Map();
      }
    }
    registerMediaStatisticStatsReport() {
      this.unregisterMediaStatisticStatsReport(),
        (this.intervalId = window.setInterval(
          () =>
            pe(this, void 0, void 0, function* () {
              const e = yield ua(this._pc, this.coreInstance);
              e &&
                e.length > 0 &&
                (this.addMediaStatistics(e, this.lastMediaStatistics),
                (this.lastMediaStatistics = e));
            }),
          3e3
        ));
    }
    unregisterMediaStatisticStatsReport() {
      -1 !== this.intervalId &&
        (window.clearInterval(this.intervalId),
        (this.lastMediaStatistics = []),
        (this.intervalId = -1));
    }
    addMediaStatistics(e, t) {
      const r = e.map((e) => {
        const r = ta(e.id, e.kind),
          n = t.find((t) => t.id === e.id);
        if (!n) return e;
        const i = n.calculation_stats,
          { calculation_stats: o } = e,
          a = fe(e, ["calculation_stats"]);
        return Object.assign(
          Object.assign({}, a),
          (function (e, t, r) {
            if (!e || !t) return { framerate: 0, kbps: 0, packet_lost_rate: 0 };
            const n = (e.timestamp - t.timestamp) / 1e3,
              i =
                0 === n
                  ? 0
                  : (e.frames_sent -
                      t.frames_sent +
                      (e.frames_received - t.frames_received)) /
                    n,
              o =
                0 === n
                  ? 0
                  : (e.bytes_sent -
                      t.bytes_sent +
                      (e.bytes_received - t.bytes_received)) /
                    ((1024 * n) / 8),
              a = fa(
                t.packets_lost,
                e.packets_lost,
                t.packets_received + t.packets_sent,
                e.packets_received + e.packets_sent
              );
            r.Apply(a);
            const s = r.Filtered() < 0 ? 0 : 100 * r.Filtered();
            return {
              framerate: Math.ceil(i),
              kbps: Math.ceil(o),
              packet_lost_rate: Math.ceil(s),
            };
          })(o, i, r)
        );
      });
      he.log("media statistics", r),
        Xi.addEvent("MediaStatistics", { cpu_loading: 0, track_stats: r });
      let n = na(
        r.sort((e, t) => t.packet_lost_rate - e.packet_lost_rate)[0]
          .packet_lost_rate,
        r.sort((e, t) => t.rtt - e.rtt)[0].rtt
      );
      Ki(n);
      const i = r.map((e) => ({
        kind: e.kind,
        lostRate: e.packet_lost_rate,
        rtt: e.rtt,
        track: e.track_id,
      }));
      this.emit("@send-qos-message", {
        qos: JSON.stringify({ networkGrade: n, tracks_qos: i }),
      });
    }
    getCurrentIceConnectionState() {
      return this._pc.iceConnectionState;
    }
    close() {
      he.log("handle", this._direction, "close"),
        this.removeAllListeners(),
        this.unregisterMediaStatisticStatsReport(),
        this.unregisterPlayQualityReport(),
        this._pc.close(),
        (this.isPcReady = !1);
    }
  }
  class Es extends ws {
    constructor(e, t, r) {
      super("send", e, r),
        he.log("init send handler"),
        (this._transportReady = !1),
        (this._stream = new MediaStream()),
        (this._signaling = t),
        t.on("on-pubpc-state", (e) => {
          this._remoteSdp.transportRemoteParameters &&
            e.pcid === this._remoteSdp.transportRemoteParameters.pcid &&
            (e.connected ||
              this.emit("@connectionstatechange", "remote-disconnected"));
        });
    }
    getReady(e) {
      return new Promise((t, r) => {
        const n = (r) => {
          if (r.pcid === e.pcid) {
            if ((this._signaling.off("on-pubpc-state", n), !r.connected))
              return;
            (this.isPcReady = !0), t();
          }
        };
        this._signaling.on("on-pubpc-state", n);
      });
    }
    addProducerTracks(e) {
      he.debug("add producer", e);
      const t = e.filter((e) => !this._stream.getTrackById(e.mediaTrack.id));
      if (0 === t.length)
        return Promise.reject(new Error("track already added"));
      let r;
      const n = [];
      let i,
        o = !0;
      return Promise.resolve()
        .then(() =>
          pe(this, void 0, void 0, function* () {
            for (const e of t) this._stream.addTrack(e.mediaTrack);
            if (Ti.unifiedPlan && Ti.supportTransceivers)
              for (const e of t) {
                const t = yield ma(
                  e.mediaTrack,
                  this._pc,
                  e.lowStreamConfig,
                  e.info.kbps,
                  this._stream
                );
                he.debug("add transceiver", t, t.mid), n.push(t);
              }
            else
              he.debug("add tracks", t),
                (r = t.map((e) =>
                  this._pc.addTrack(e.mediaTrack, this._stream)
                ));
            return Is(this._pc, this._simulcast);
          })
        )
        .then((e) => {
          let t;
          return (
            Ti.needH264FmtpLine &&
              (e.sdp +=
                "a=fmtp:107 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f".concat(
                  "\n"
                )),
            (t = { type: "offer", sdp: e.sdp }),
            (i = t.sdp),
            he.log("publish: set local offer", t),
            this._pc.setLocalDescription(t)
          );
        })
        .then(() => {
          for (const t of n) {
            if (!t.sender.track) continue;
            const r = e.find((e) => e.mediaTrack === t.sender.track);
            if (!r || !t.mid) throw Yi("can not get transceiver mid!");
            r.setInfo({ mid: t.mid }),
              (this.midRidEncoding[t.mid] = r.lowStreamConfig);
          }
          if (!this._transportReady) return (o = !1), this._setupTransport(e);
        })
        .then(() =>
          this._remoteSdp.createRemoteAnswer(
            i,
            this.midRidEncoding,
            this.removeMids
          )
        )
        .then((e) => {
          const t = { type: "answer", sdp: e };
          return (
            he.debug("addProducer answer", t), this._pc.setRemoteDescription(t)
          );
        })
        .then(() => this._pcReady)
        .then(() =>
          o
            ? this.safeEmitAsPromise("@needpubtracks", e, i)
            : Promise.resolve(this._remoteSdp.transportRemoteParameters)
        )
        .catch((e) => {
          he.log("add producer error", e);
          try {
            for (const e of r) this._pc.removeTrack(e);
            for (const e of n) e.direction = "inactive";
          } catch (e) {}
          for (const e of t) this._stream.removeTrack(e.mediaTrack);
          throw e instanceof Ji ? e : Yi(e);
        });
    }
    removeProducerTracks(e) {
      he.debug("removeProducerTracks", e);
      const t = e
        .filter(
          (e) =>
            void 0 !== e.track &&
            !!this._stream.getTrackById(e.track.mediaTrack.id)
        )
        .map((e) =>
          e.track.isReplacedByImageTrack
            ? e.track.imageStreamTrack.mediaTrack
            : e.track.mediaTrack
        );
      let r;
      return Promise.resolve()
        .then(() => {
          Ti.unifiedPlan &&
            Ti.supportTransceivers &&
            this._pc.getTransceivers().forEach((e) => {
              e.sender.track &&
                e.mid &&
                t.includes(e.sender.track) &&
                this.removeMids.add(e.mid);
            });
          const e = this._pc
            .getSenders()
            .filter((e) => e.track && t.includes(e.track));
          if (0 === e.length)
            return (
              he.warning("removeProducerTracks [nothing to remove]"),
              Promise.reject("removeProducerTracks: nothing to remote")
            );
          for (const t of e) this._pc.removeTrack(t);
          for (const e of t) this._stream.removeTrack(e);
          return Is(this._pc, this._simulcast);
        })
        .then((e) => {
          const t = new RTCSessionDescription(e);
          return (
            (r = t.sdp),
            he.log("unpublish: set local offer", t),
            this._pc.setLocalDescription(t)
          );
        })
        .then(() => {
          const e = {
            type: "answer",
            sdp: this._remoteSdp.createRemoteAnswer(
              r,
              this.midRidEncoding,
              this.removeMids
            ),
          };
          return (
            he.log("unpublish: set remote answer", e),
            this._pc.setRemoteDescription(e)
          );
        })
        .catch((e) => {
          if (0 !== this._stream.getTracks().length)
            throw e instanceof Ji ? e : Yi(e);
          he.debug(
            "removeProducer() | ignoring expected error due no sending tracks: %s",
            e.toString()
          );
        })
        .then(() => {
          this.safeEmitAsPromise("@needunpubtracks", e);
        });
    }
    replaceTrack(e, t) {
      return pe(this, void 0, void 0, function* () {
        if (!this._pc.getSenders) throw Yi("getSenders is not supported.");
        const r = this._pc.getSenders().find((t) => {
          if (!t.track) return !1;
          if (!e.track) return !1;
          const r = t.track.id;
          return (
            !(!e.track.mediaTrack || r !== e.track.mediaTrack.id) ||
            !(!e.track.imageStreamTrack || r !== e.track.imageStreamTrack.id)
          );
        });
        if (!r)
          throw Yi("sender not found when replaceTrack: ".concat(e.trackID));
        if (!r.replaceTrack) throw Yi("replaceTrack is not supported.");
        e.track && ((e.track.mediaTrack = t), e.track.removeMediaElement());
        const n = r.track;
        yield r.replaceTrack(t),
          this._stream.removeTrack(n),
          this._stream.addTrack(t);
      });
    }
    replaceProducerTrack(e, t) {
      return pe(this, void 0, void 0, function* () {
        if (!this._pc.getSenders) throw Yi("getSenders is not supported.");
        const r = this._pc.getSenders().find((t) => {
          if (!t.track) return !1;
          if (!e.track) return !1;
          const r = t.track.id;
          return (
            !(!e.track.mediaTrack || r !== e.track.mediaTrack.id) ||
            !(!e.track.imageStreamTrack || r !== e.track.imageStreamTrack.id)
          );
        });
        if (!r)
          throw Yi(
            "sender not found when replaceProducerTrack: ".concat(e.trackID)
          );
        if (!r.replaceTrack) throw Yi("replaceTrack is not supported.");
        "image" === t
          ? (he.debug("replaceTrack", e.track.imageStreamTrack.mediaTrack),
            yield r.replaceTrack(e.track.imageStreamTrack.mediaTrack))
          : "video" === t &&
            (he.debug("replaceTrack", e.track.mediaTrack),
            yield r.replaceTrack(e.track.mediaTrack));
      });
    }
    restartICE(e, t) {
      return (
        he.log("restart send ice"),
        (this._isRestartingICE = !0),
        Promise.resolve()
          .then(() => this._remoteSdp.updateICEData(e, t))
          .then(() => Is(this._pc, this._simulcast, { iceRestart: !0 }))
          .then((e) => this._pc.setLocalDescription(e))
          .then(() => {
            const e = {
              type: "answer",
              sdp: this._remoteSdp.createRemoteAnswer(
                this._pc.localDescription.sdp,
                this.midRidEncoding,
                this.removeMids
              ),
            };
            return this._pc.setRemoteDescription(e);
          })
      );
    }
    _setupTransport(e) {
      const t = Date.now();
      return Promise.resolve()
        .then(() =>
          this._pc.localDescription
            ? this._pc.localDescription
            : Is(this._pc, this._simulcast)
        )
        .then((t) => this.safeEmitAsPromise("@needpubpc", t.sdp, e))
        .then(
          (r) => (
            Xi.addEvent("PublisherPC", {
              signal_take_time: Date.now() - t,
              result_code: r.code,
              up_stream_ip: (r.iceCandidates || [])
                .map((e) => {
                  let { ip: t } = e;
                  return t;
                })
                .join(","),
              tracks: r.tracks
                .map((t) => {
                  const r = e.find((e) => e.mediaTrack.id === t.localid);
                  if (r)
                    return {
                      local_id: t.localid,
                      track_id: t.trackid,
                      source_type: r.sourceType,
                      kind: r.info.kind,
                      tag: r.info.tag || "",
                      muted: !!r.info.muted,
                      master: !!r.master,
                      kbps: r.info.kbps || -1,
                      encode_video_width: 0,
                      encode_video_height: 0,
                    };
                })
                .filter((e) => void 0 !== e),
            }),
            (this.pcid = r.pcid),
            (this._transportReady = !0),
            (this._pcReady = this.getReady(r)),
            this._remoteSdp.setTransportRemoteParameters(r)
          )
        );
    }
  }
  class Cs extends ws {
    constructor(e, t, r) {
      super("recv", e, r),
        (this._transportCreated = !1),
        (this._consumerInfos = new Map()),
        (this._signaling = t),
        t.on("on-subpc-state", (e) => {
          this._remoteSdp.transportRemoteParameters &&
            e.pcid === this._remoteSdp.transportRemoteParameters.pcid &&
            (e.connected ||
              this.emit("@connectionstatechange", "remote-disconnected"));
        }),
        he.log("init recvhandler", this);
    }
    getReady(e) {
      return new Promise((t, r) => {
        const n = (r) => {
          if (r.pcid === e.pcid) {
            if ((this._signaling.off("on-subpc-state", n), !r.connected))
              return;
            (this.isPcReady = !0), t();
          }
        };
        this._signaling.on("on-subpc-state", n);
      });
    }
    addConsumerTracks(e) {
      return pe(this, void 0, void 0, function* () {
        if (Ti.unifiedPlan && ui) {
          const t = [];
          for (const r of e) {
            const e = yield this.addConsumerTrack(r);
            t.push(e);
          }
          return t;
        }
        he.log("add consumers", e);
        const t = [],
          r = Array.from(this._consumerInfos.values());
        for (const n of e) {
          const e = r.find((e) => e.consumerId === n.id);
          if (e && !e.closed) t.push(e);
          else {
            const e = this.genNewConsumerInfo(n);
            if (Ti.unifiedPlan) {
              const t = n.mid;
              (e.mid = t), this._consumerInfos.set(t, e);
            } else this._consumerInfos.set(n.id, e);
            t.push(e);
          }
        }
        return Promise.resolve()
          .then(() => {
            const e = {
              type: "offer",
              sdp: this._remoteSdp.createRemoteOffer(
                Array.from(this._consumerInfos.values())
              ),
            };
            return (
              he.debug("subscribe: set remote offer", e),
              this._pc.setRemoteDescription(e)
            );
          })
          .then(() => (Ti.unifiedPlan, this._pc.createAnswer()))
          .then(
            (e) => (
              he.debug("subscribe, set local answer", e),
              this._pc.setLocalDescription(e)
            )
          )
          .then(() => this._pcReady)
          .then(() => {
            for (let r = 0; r < t.length; r += 1) {
              const n = t[r],
                i = e[r];
              if (!i.track) {
                if (Ti.unifiedPlan) {
                  const e = this._pc
                    .getTransceivers()
                    .find(
                      (e) =>
                        !!e.receiver.track &&
                        (e.receiver.track.id === n.trackID || e.mid === n.mid)
                    );
                  e && (i.track = e.receiver.track);
                } else if (Ti.getReceivers) {
                  const e = this._pc.getReceivers().find((e) => {
                    const { track: t } = e;
                    return !!t && n.trackID === t.id;
                  });
                  e && (i.track = e.track);
                } else {
                  const e = this._pc
                    .getRemoteStreams()
                    .find((e) => e.id === n.streamId);
                  e && (i.track = e.getTrackById(n.trackID));
                }
                if (!i.track) throw Yi("remote track not found");
                he.log("subscribe: get new track", i.track);
              }
            }
            return e.map((e) => e.track);
          });
      });
    }
    genNewConsumerInfo(e) {
      const t = e.rtpParameters.encodings[0],
        r = e.rtpParameters.rtcp.cname,
        n = e.mid;
      return {
        kind: e.kind,
        streamId: Ti.unifiedPlan
          ? e.rtpParameters.msid
          : "recv-stream-".concat(t.ssrc),
        trackID: Ti.unifiedPlan
          ? "consumer-".concat(e.kind, "-").concat(n)
          : "consumer-".concat(e.kind, "-").concat(t.ssrc),
        ssrc: t.ssrc,
        rtxSsrc: t.rtx ? t.rtx.ssrc : void 0,
        cname: r,
        consumerId: e.id,
        closed: !1,
      };
    }
    addConsumerTrack(e) {
      return pe(this, void 0, void 0, function* () {
        he.log("add consumer", e);
        let t = null;
        const r = Array.from(this._consumerInfos.values()).find(
          (t) => t.consumerId === e.id
        );
        if (r && !r.closed) t = r;
        else {
          const r = this.genNewConsumerInfo(e);
          if (Ti.unifiedPlan) {
            const t = e.mid;
            (r.mid = t), this._consumerInfos.set(t, r);
          } else this._consumerInfos.set(e.id, r);
          t = r;
        }
        return Promise.resolve()
          .then(() => {
            const e = {
              type: "offer",
              sdp: this._remoteSdp.createRemoteOffer(
                Array.from(this._consumerInfos.values())
              ),
            };
            return (
              he.log("set ontrack"),
              (this._pc.ontrack = (e) => {
                he.log("ontrack", e.receiver.track);
              }),
              he.debug("subscribe: set remote offer", e),
              this._pc.setRemoteDescription(e)
            );
          })
          .then(() => this._pc.createAnswer())
          .then(
            (e) => (
              he.debug("subscribe, set local answer", e),
              this._pc.setLocalDescription(e)
            )
          )
          .then(() => this._pcReady)
          .then(() => {
            let r = null;
            if (Ti.unifiedPlan && Ti.supportTransceivers && e && t) {
              const n = this._pc
                .getTransceivers()
                .find(
                  (r) =>
                    !!r.receiver.track &&
                    (r.receiver.track.id === t.trackID || r.mid === t.mid) &&
                    ((e.track = r.receiver.track), !0)
                );
              n && (r = n.receiver.track);
            } else if (e && t) {
              const n = this._pc.getReceivers().find((r) => {
                const { track: n } = r;
                return !!n && t.trackID === n.id && ((e.track = n), !0);
              });
              n && (r = n.track);
            }
            if (!r && e) throw Yi("remote track not found");
            return he.log("subscribe: get new track", r, r.readyState), r;
          });
      });
    }
    removeConsumerTracks(e) {
      he.log("remove consumer", e);
      let t = !1;
      for (const r of e) {
        const e = Array.from(this._consumerInfos.values()).find(
          (e) => e.consumerId === r.id && !e.closed
        );
        e
          ? ((t = !0),
            Ti.unifiedPlan
              ? ((r.track = null), (e.closed = !0))
              : this._consumerInfos.delete(r.id))
          : he.log("can not find unpublish track target, ignore");
      }
      return t
        ? Promise.resolve()
            .then(() => {
              const e = {
                type: "offer",
                sdp: this._remoteSdp.createRemoteOffer(
                  Array.from(this._consumerInfos.values())
                ),
              };
              return (
                he.log("unsubscribe set remote offer", e),
                this._pc.setRemoteDescription(e)
              );
            })
            .then(() => this._pc.createAnswer())
            .then(
              (e) => (
                he.log("unsubscribe set local answer", e),
                this._pc.setLocalDescription(e)
              )
            )
        : Promise.resolve();
    }
    restartICE(e, t) {
      return (
        he.log("recv restart ice"),
        (this._isRestartingICE = !0),
        Promise.resolve()
          .then(() => this._remoteSdp.updateICEData(e, t))
          .then(() => {
            const e = {
              type: "offer",
              sdp: this._remoteSdp.createRemoteOffer(
                Array.from(this._consumerInfos.values())
              ),
            };
            return this._pc.setRemoteDescription(e);
          })
          .then(() => this._pc.createAnswer())
          .then((e) => {
            this._pc.setLocalDescription(e);
          })
      );
    }
    setupTransport(e) {
      return pe(this, void 0, void 0, function* () {
        if (this._transportCreated) return yield this._pcReady;
        const t = Date.now(),
          r = yield this.safeEmitAsPromise("@needsubpc", e);
        return (
          Xi.addEvent("SubscriberPC", {
            signal_take_time: Date.now() - t,
            result_code: r.code,
            down_stream_ip: (r.iceCandidates || [])
              .map((e) => {
                let { ip: t } = e;
                return t;
              })
              .join(","),
            tracks: r.tracks.map((e) => ({
              track_id: e.trackid,
              status: e.status,
            })),
          }),
          (this.pcid = r.pcid),
          (this._transportCreated = !0),
          (this._pcReady = this.getReady(r)),
          he.log("init subscribe, get transport remote", r),
          yield this._remoteSdp.setTransportRemoteParameters(r),
          r
        );
      });
    }
  }
  function Is(e, t, r) {
    return e.createOffer(r).then((e) => {
      let { type: r, sdp: n } = e;
      return n
        ? ((n = is(n)),
          "chrome" === hi.name &&
            t &&
            (n = (function (e, t) {
              const r = ja.parse(e);
              t &&
                "chrome" === hi.name &&
                (r.media = r.media.map((e) => {
                  if (
                    !e.ssrcGroups ||
                    0 === e.ssrcGroups.length ||
                    !e.ssrcs ||
                    0 === e.ssrcs.length
                  )
                    return e;
                  const r = e.ssrcGroups.find((e) => "FID" === e.semantics);
                  if (!r) return e;
                  const [n, i] = r.ssrcs.split(" ").map((e) => parseInt(e, 10));
                  let o, a;
                  e.ssrcs.forEach((e) => {
                    "cname" === e.attribute && (o = e.value),
                      "msid" === e.attribute && (a = e.value);
                  });
                  const s = [];
                  if ((s.push(n), t >= 2)) {
                    const t = n + 1,
                      r = i + 1;
                    e.ssrcs.push({ id: t, attribute: "cname", value: o }),
                      e.ssrcs.push({ id: t, attribute: "msid", value: a }),
                      e.ssrcs.push({ id: r, attribute: "cname", value: o }),
                      e.ssrcs.push({ id: r, attribute: "msid", value: a }),
                      e.ssrcGroups.push({
                        semantics: "FID",
                        ssrcs: "".concat(t, " ").concat(r),
                      }),
                      s.push(t);
                  }
                  if (t >= 3) {
                    const t = n + 2,
                      r = i + 2;
                    e.ssrcs.push({ id: t, attribute: "cname", value: o }),
                      e.ssrcs.push({ id: t, attribute: "msid", value: a }),
                      e.ssrcs.push({ id: r, attribute: "cname", value: o }),
                      e.ssrcs.push({ id: r, attribute: "msid", value: a }),
                      e.ssrcGroups.push({
                        semantics: "FID",
                        ssrcs: "".concat(t, " ").concat(r),
                      }),
                      s.push(t);
                  }
                  return (
                    e.ssrcGroups.push({ semantics: "SIM", ssrcs: s.join(" ") }),
                    e
                  );
                }));
              const n = ja.write(r).split("\r\n");
              let i = n.findIndex((e) => 0 === e.indexOf("a=ssrc-group:FID"));
              for (; -1 !== i && 0 === n[i].indexOf("a=ssrc-group:FID"); ) {
                const e = n[i].split(" ")[2];
                for (let t = i - 1; t >= 0; t--)
                  if (n[t].indexOf(e) > 0) {
                    n.splice(t + 1, 0, n[i]), n.splice(i + 1, 1);
                    break;
                  }
                i++;
              }
              return n.join("\r\n");
            })(n, 3)),
          { type: r, sdp: n })
        : e;
    });
  }
  function Ps(e, t, r, n) {
    switch (e) {
      case "send":
        return new Es(t, r, n);
      case "recv":
        return new Cs(t, r, n);
    }
  }
  var Rs;
  !(function (e) {
    (e.SEND_TRACKS = "@transport:send-tracks"),
      (e.RESTART_SEND_ICE = "@transport:send-restart-ice"),
      (e.REMOVE_TRACKS = "@transport:remove-tracks"),
      (e.INIT_RECV = "@transport:init-recv"),
      (e.RESTART_RECV_ICE = "@transport:recv-restart-ice"),
      (e.ADD_CONUMERS = "@transport:add-consumers"),
      (e.REMOVE_CONSUMERS = "@transport:remove-consumers");
  })(Rs || (Rs = {}));
  class Ms extends Pa {
    get publishTracks() {
      return Array.from(this._publishTracks.values());
    }
    constructor(e, t, r, n) {
      super(),
        (this.sendCommandQueue = new bi("SendQueue")),
        (this.recvCommandQueue = new bi("RecvQueue")),
        (this.simulcast = !1),
        (this.recvInitCommandQueue = new bi("RecvInitQueue")),
        (this.sendTrackQueue = []),
        (this.consumerQueue = []),
        (this._publishTracks = new Map()),
        (this.extendedRtpCapabilities = e),
        (this.signaling = t),
        (this.simulcast = !!n),
        (this.coreInstance = r),
        (this.sendHandler = Ps("send", e, t, {
          simulcast: this.simulcast,
          core: this.coreInstance,
        })),
        (this.recvHandler = Ps("recv", e, t, {
          simulcast: this.simulcast,
          core: this.coreInstance,
        })),
        this.handleSendHandler(),
        this.handleRecvHandler(),
        this.sendCommandQueue.on("exec", this.handleSendCommandTask.bind(this)),
        this.recvCommandQueue.on("exec", this.handleRecvCommandTask.bind(this)),
        this.recvInitCommandQueue.on(
          "exec",
          this.handleRecvInitCommandTask.bind(this)
        ),
        (this.initSubPcPromise = new Promise((e) => {
          this.initSubPcPromiseResolve = e;
        }));
    }
    resolveInitSubPcPromise() {
      this.initSubPcPromiseResolve &&
        (this.initSubPcPromiseResolve(),
        (this.initSubPcPromiseResolve = void 0));
    }
    handleSendHandler() {
      this.sendHandler
        .on("@needpubpc", (e, t, r, n) => {
          this.safeEmitAsPromise("@needpubpc", e, t).then(r).catch(n);
        })
        .on("@connectionstatechange", (t, r) => {
          switch (
            (he.log("pubpc connectionstatechange", t),
            Xi.addEvent("ICEConnectionState", {
              pc_type: 0,
              state: t,
              id: this.sendHandler.pcid,
              protocol: r,
              event_grade:
                "failed" === t ? e.QNEventGrade.SERVERE : e.QNEventGrade.NORMAL,
              event_category: e.QNEventCategory.CORE,
            }),
            t)
          ) {
            case "remote-disconnected":
            case "closed":
            case "failed":
              this.signaling.state === ss.OPEN
                ? this.reconnectProducer()
                : this.sendHandler.close();
              break;
            case "disconnected":
              if (this.sendHandler._isRestartingICE || !this.sendHandler.pcid)
                return;
              this.signaling.state === ss.OPEN
                ? this.restartSendICE(this.sendHandler.pcid)
                : this.signaling.once("@signalingauth", (e) => {
                    "disconnected" ===
                      this.sendHandler.getCurrentIceConnectionState() &&
                      ((this.extendedRtpCapabilities = e.rtpcaps),
                      this.restartSendICE(this.sendHandler.pcid));
                  });
          }
        })
        .on("@needpubtracks", (e, t, r, n) => {
          const i = e.map(Na),
            o = Date.now();
          this.signaling
            .request("pub-tracks", { tracks: i, sdp: t })
            .then((t) => {
              switch (
                (Xi.addEvent("PublishTracks", {
                  signal_take_time: Date.now() - o,
                  result_code: t.code,
                  tracks: t.tracks
                    .map((t) => {
                      const r = e.find((e) => e.mediaTrack.id === t.localid);
                      if (r)
                        return {
                          local_id: t.localid,
                          track_id: t.trackid,
                          source_type: r.sourceType,
                          kind: r.info.kind,
                          tag: r.info.tag || "",
                          muted: !!r.info.muted,
                          master: !!r.master,
                          kbps: r.info.kbps || -1,
                          encode_video_width: 0,
                          encode_video_height: 0,
                        };
                    })
                    .filter((e) => void 0 !== e),
                }),
                t.code)
              ) {
                case 0:
                  break;
                case 10052:
                  return n(Mo());
                case 10061:
                  return this.reconnectProducer(), n(_o(10061, t.error));
                default:
                  return n(_o(t.code, t.error));
              }
              for (const e of t.tracks)
                if (!e.status) return void n(_o(t.code, t.error));
              r(t);
            }, n);
        })
        .on("@needunpubtracks", (e, t, r) => {
          Xi.addEvent("UnPublishTracks", {
            tracks: e.map((e) => ({ track_id: e.trackID })),
          }),
            this.signaling
              .request("unpub-tracks", {
                tracks: e.map((e) => ({ trackid: e.trackID })),
              })
              .then((e) => {
                t(e);
              });
        })
        .on("@send-qos-message", (e) => {
          this.signaling.request("send-qos-message", e);
        });
    }
    sendTracks(e) {
      return pe(this, void 0, void 0, function* () {
        return 0 === e.length
          ? Promise.resolve()
          : this.sendCommandQueue.push(Rs.SEND_TRACKS, e);
      });
    }
    removeTracks(e) {
      return 0 === e.length
        ? Promise.resolve()
        : this.sendCommandQueue.push(Rs.REMOVE_TRACKS, e);
    }
    restartSendICE(e) {
      return pe(this, void 0, void 0, function* () {
        return Ti.supportRestartICE
          ? this.sendCommandQueue.push(Rs.RESTART_SEND_ICE, e)
          : Promise.resolve(this.reconnectProducer());
      });
    }
    handleSendCommandTask(e, t) {
      switch (e.method) {
        case Rs.SEND_TRACKS:
          return void (t.promise = this._execAddProducerTracks(e.data));
        case Rs.REMOVE_TRACKS:
          return void (t.promise = this._execRemoveTracks(e.data));
        case Rs.RESTART_SEND_ICE:
          return void (t.promise = this._execRestartSendICE(e.data));
      }
    }
    addTrackToPublishTracks(e) {
      const t = e.map((e) => new ms(this, "send", e));
      for (const e of t) this._publishTracks.set(e.track.mediaTrack.id, e);
      return t;
    }
    removeTrackFromPublishTracks(e) {
      for (const t of e) this._publishTracks.delete(t.mediaTrack.id);
    }
    _execAddProducerTracks(t) {
      return pe(this, void 0, void 0, function* () {
        const r = yield this.sendHandler.addProducerTracks(
          t.map((e) => e.track)
        );
        for (const e of t) {
          const t = Lo(r.tracks, "localid", e.track.mediaTrack.id);
          t &&
            (e.addTrackId(t.trackid),
            e.track.setInfo({ versionid: t.versionid }),
            e.track.resetStats());
        }
        return (
          t.map((t) => (t.connectStatus = e.TrackConnectStatus.Connect)), r
        );
      });
    }
    _execRemoveTracks(e) {
      return (
        this.removeTrackFromPublishTracks(e.map((e) => e.track)),
        e.map((e) => e.release()),
        this.sendHandler.removeProducerTracks(e)
      );
    }
    _execRestartSendICE(e) {
      return pe(this, void 0, void 0, function* () {
        this.sendHandler._isRestartingICE = !0;
        const t = yield this.signaling.request("pubpc-restart", { pcid: e });
        if (0 !== t.code)
          return (
            (this.sendHandler._isRestartingICE = !1),
            he.debug("restart ice faild", t.code, t.error),
            void this.reconnectProducer()
          );
        try {
          yield this.sendHandler.restartICE(t.iceParameters, t.iceCandidates),
            (this.sendHandler._isRestartingICE = !1);
        } catch (e) {
          he.debug("restart ice faild", t.code, t.error),
            (this.sendHandler._isRestartingICE = !1),
            this.reconnectProducer();
        }
      });
    }
    reconnectProducer() {
      this.resetSendCommandQueue(), this.sendHandler.close();
      const t = this.publishTracks;
      (this.sendHandler = Ps(
        "send",
        this.extendedRtpCapabilities,
        this.signaling,
        { simulcast: this.simulcast, core: this.coreInstance }
      )),
        this.handleSendHandler(),
        t.forEach((t) => {
          t.connectStatus = e.TrackConnectStatus.Connecting;
        }),
        this.emit("@needrepub", t);
    }
    handleRecvHandler() {
      this.recvHandler
        .on("@needsubpc", (e, t, r) => {
          this.safeEmitAsPromise("@needsubpc", e).then(t, r);
        })
        .on("@connectionstatechange", (t, r) => {
          switch (
            (he.log("sub pc connection state change", t),
            Xi.addEvent("ICEConnectionState", {
              pc_type: 1,
              state: t,
              id: this.recvHandler.pcid,
              protocol: r,
              event_grade:
                "failed" === t ? e.QNEventGrade.SERVERE : e.QNEventGrade.NORMAL,
              event_category: e.QNEventCategory.CORE,
            }),
            t)
          ) {
            case "remote-disconnected":
            case "closed":
            case "failed":
              this.signaling.state === ss.OPEN
                ? this.resetRecvHandler()
                : this.recvHandler.close();
              break;
            case "disconnected":
              if (this.recvHandler._isRestartingICE || !this.recvHandler.pcid)
                return;
              this.signaling.state === ss.OPEN
                ? this.restartRecvICE(this.recvHandler.pcid)
                : this.signaling.once("@signalingauth", (e) => {
                    "disconnected" ===
                      this.recvHandler.getCurrentIceConnectionState() &&
                      ((this.extendedRtpCapabilities = e.rtpcaps),
                      this.restartRecvICE(this.recvHandler.pcid));
                  });
          }
        });
    }
    appendConsumer(e) {
      this.consumerQueue.push(e);
    }
    addConsumers() {
      return pe(this, void 0, void 0, function* () {
        const e = this.consumerQueue;
        return (
          (this.consumerQueue = []),
          this.recvCommandQueue.push(Rs.ADD_CONUMERS, e)
        );
      });
    }
    initRecvHandler(e) {
      return this.recvInitCommandQueue.push(Rs.INIT_RECV, e);
    }
    removeConsumers(e) {
      return pe(this, void 0, void 0, function* () {
        yield this.recvCommandQueue.push(Rs.REMOVE_CONSUMERS, e);
      });
    }
    restartRecvICE(e) {
      return pe(this, void 0, void 0, function* () {
        return Ti.supportRestartICE
          ? this.recvCommandQueue.push(Rs.RESTART_RECV_ICE, e)
          : this.resetRecvHandler();
      });
    }
    _removeConsumers(e) {
      return pe(this, void 0, void 0, function* () {
        yield this.recvHandler.removeConsumerTracks(e);
      });
    }
    _initRecvHandler(e) {
      return pe(this, void 0, void 0, function* () {
        return this.recvHandler.isPcReady
          ? (yield this.initSubPcPromise, null)
          : yield this.recvHandler.setupTransport(e);
      });
    }
    _addConsumers(e) {
      return pe(this, void 0, void 0, function* () {
        if (0 === e.length) return Promise.resolve([]);
        return yield this.recvHandler.addConsumerTracks(e);
      });
    }
    _execRestartRecvICE(e) {
      return pe(this, void 0, void 0, function* () {
        this.recvHandler._isRestartingICE = !0;
        const t = yield this.signaling.request("subpc-restart", { pcid: e });
        if (0 !== t.code)
          return (
            (this.recvHandler._isRestartingICE = !1),
            he.debug("restart ice faild", t.code, t.error),
            void this.resetRecvHandler()
          );
        try {
          yield this.recvHandler.restartICE(t.iceParameters, t.iceCandidates),
            (this.recvHandler._isRestartingICE = !1);
        } catch (e) {
          (this.recvHandler._isRestartingICE = !1),
            he.debug("restart ice faild", t.code, t.error),
            this.resetRecvHandler();
        }
      });
    }
    handleRecvCommandTask(e, t) {
      switch (e.method) {
        case Rs.ADD_CONUMERS:
          return void (t.promise = this._addConsumers(e.data));
        case Rs.REMOVE_CONSUMERS:
          return void (t.promise = this._removeConsumers(e.data));
        case Rs.RESTART_RECV_ICE:
          return void (t.promise = this._execRestartRecvICE(e.data));
      }
    }
    handleRecvInitCommandTask(e, t) {
      e.method !== Rs.INIT_RECV || (t.promise = this._initRecvHandler(e.data));
    }
    resetSendCommandQueue() {
      he.log("reset send queue"),
        (this.sendCommandQueue = new bi("SendQueue")),
        this.sendCommandQueue.on("exec", this.handleSendCommandTask.bind(this));
    }
    resetRecvCommandQueue() {
      he.log("reset recv queue"),
        (this.recvCommandQueue = new bi("RecvQueue")),
        (this.recvInitCommandQueue = new bi("RecvInitQueue")),
        this.recvCommandQueue.on("exec", this.handleRecvCommandTask.bind(this)),
        this.recvInitCommandQueue.on(
          "exec",
          this.handleRecvInitCommandTask.bind(this)
        );
    }
    resetRecvHandler() {
      this.resetRecvCommandQueue(),
        this.emit("@needresetrecv"),
        this.recvHandler.close(),
        (this.recvHandler = Ps(
          "recv",
          this.extendedRtpCapabilities,
          this.signaling,
          { simulcast: this.simulcast, core: this.coreInstance }
        )),
        (this.initSubPcPromise = new Promise((e) => {
          this.initSubPcPromiseResolve = e;
        })),
        this.handleRecvHandler(),
        this.emit("@needresub");
    }
    release() {
      this.recvHandler.close(),
        this.sendHandler.close(),
        this.publishTracks.forEach((e) => e.release());
    }
  }
  const Ds = new Pa();
  function Os(e, t) {
    return new Promise((r) => {
      let n;
      const i = Date.now(),
        o = new WebSocket(e);
      (o.onopen = () => {
        n && clearTimeout(n);
        const t = Date.now() - i;
        r({ ws: o, url: e, status: !0, reason: "ok", connectTime: t });
      }),
        (o.onerror = () => {
          n && clearTimeout(n);
          const t = Date.now() - i;
          r({ ws: o, url: e, status: !1, reason: "onerror", connectTime: t });
        }),
        (n = setTimeout(() => {
          const t = Date.now() - i;
          r({ ws: o, url: e, status: !1, reason: "timeout", connectTime: t }),
            o.close();
        }, t));
    });
  }
  var Ns;
  !(function (e) {
    (e[(e.Idle = 0)] = "Idle"),
      (e[(e.Connecting = 1)] = "Connecting"),
      (e[(e.Connected = 2)] = "Connected"),
      (e[(e.Reconnecting = 3)] = "Reconnecting");
  })(Ns || (Ns = {}));
  const xs = {
    transportPolicy: "preferUdp",
    simulcast: !1,
    reconnectTimes: 3,
    requestTimeout: 5e3,
    mcuServerHosts: [],
  };
  class Ls extends le {
    get users() {
      return Array.from(this._users.values());
    }
    get trackInfoList() {
      return this._trackInfo.map(Da);
    }
    get roomState() {
      return this._roomState;
    }
    set roomState(t) {
      this._roomState !== t &&
        ((this._roomState = t),
        he.debug("roomState change", this._roomState),
        this.emit("room-state-change", this._roomState),
        Xi.addEvent("RoomStateChanged", {
          room_state: t,
          event_grade:
            this._roomState === Ns.Reconnecting
              ? e.QNEventGrade.SERVERE
              : e.QNEventGrade.NORMAL,
          event_category: e.QNEventCategory.CORE,
        }));
    }
    constructor(t) {
      var r;
      super(),
        (r = this),
        (this.profiles = new Map()),
        (this._trackInfo = []),
        (this.volumeIndicatorHistory = []),
        (this.subscribeTracks = []),
        (this._users = new Map()),
        (this._roomState = Ns.Idle),
        (this.mergeJobMerger = {}),
        (this.defaultMergeJobTracks = []),
        (this.mergeJobTracks = {}),
        (this.forwardJobTracks = {}),
        (this._mode = e.QNClientMode.RTC),
        (this._role = e.QNClientRole.AUDIENCE),
        (this._privileges = ["subscribe", "publish"]),
        (this._publish = (t, r) =>
          new Promise((n, i) =>
            pe(this, void 0, void 0, function* () {
              if (this.roomState !== Ns.Connected)
                return void i(
                  Yi("not connected to the room, please run joinRoom first")
                );
              if (
                (0 === t.length && n(),
                this._mode === e.QNClientMode.LIVE &&
                  this._role === e.QNClientRole.AUDIENCE)
              )
                return void i(
                  Yi(
                    "no permission. Audience in Live mode has no permission to publish."
                  )
                );
              t.forEach((e) => (e.userID = this.userID)),
                t.forEach(
                  (e) => (e.selfEndedCallback = this.unpublish.bind(this))
                );
              const o = this.connectionTransport,
                a = this.signaling;
              let s;
              if (r) {
                const e = t.map((e) => e.mediaTrack.id);
                s = o.publishTracks.filter(
                  (t) => -1 !== e.indexOf(t.track.mediaTrack.id)
                );
              } else {
                const e = o.publishTracks.map((e) => e.track.mediaTrack.id);
                if (
                  t.filter((t) => -1 === e.indexOf(t.mediaTrack.id)).length !==
                  t.length
                )
                  return void i(
                    Yi(
                      "there are already published tracks in the provided tracks"
                    )
                  );
                s = o.addTrackToPublishTracks(t);
              }
              if ((he.debug("start publish", s, r), !r)) {
                const e = s.map((e) => e.startConnect());
                Promise.all(e)
                  .then(() => n())
                  .catch(() => {
                    i(fo());
                  });
              }
              try {
                yield o.sendTracks(s),
                  a.sendWsMsg("mute-tracks", {
                    tracks: s.map((e) => ({
                      trackid: e.trackID,
                      muted: !!e.track.info.muted,
                    })),
                  });
                const e = Lo(this.users, "userID", this.userID);
                e &&
                  (e.addTracks(s.map((e) => e.track)),
                  e.addPublishedTrackInfo(
                    s.map((e) => ({
                      trackID: e.trackID,
                      muted: !!e.track.info.muted,
                      kind: e.track.info.kind,
                      tag: e.track.info.tag,
                      userID: this.userID,
                      versionid: e.track.info.versionid,
                      profiles: e.track.info.profiles,
                    }))
                  )),
                  t.forEach((e) => {
                    e.on("@get-stats", (t, r, n) => {
                      if (!this.connectionTransport) return r([]);
                      const i = e.isReplacedByImageTrack
                        ? e.imageStreamTrack.mediaTrack
                        : e.mediaTrack;
                      this.connectionTransport.sendHandler
                        .getStats(i, t)
                        .then(r, n);
                    });
                  }),
                  this.getAllMerger().forEach((e) =>
                    e.controller.onAddTracks(t.map((e) => e.info))
                  );
              } catch (e) {
                if (e instanceof Ji)
                  switch (e.code) {
                    case 10061:
                    case 30001:
                      return;
                    case 10052:
                      return (
                        he.warning(e, "republish"),
                        void setTimeout(() => this._publish(t, !0), 1e3)
                      );
                    default:
                      o.removeTrackFromPublishTracks(t), i(e);
                  }
                else
                  he.warning(e, "republish"),
                    setTimeout(() => this._publish(t, !0), 1e3);
              }
            })
          )),
        (this._subscribe = function (t, n) {
          let i =
              arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            o = arguments.length > 3 ? arguments[3] : void 0;
          return new Promise((a, s) =>
            pe(r, void 0, void 0, function* () {
              if (this.roomState !== Ns.Connected)
                return void s(
                  Yi("can not connected to the room, please joinRoom first")
                );
              if (0 === t.length) return void a([]);
              he.debug("subscribe", t, n);
              const r = this._trackInfo.filter((e) => t.includes(e.trackid));
              if (r.length !== t.length)
                return void s(
                  Io(10041, "can not find track in room ".concat(t))
                );
              let c;
              const d = this.connectionTransport,
                u = this.signaling;
              if (n)
                c = this.subscribeTracks.filter(
                  (e) => -1 !== t.indexOf(e.trackID)
                );
              else {
                const e = this.subscribeTracks.map((e) => e.trackID),
                  t = r.filter((t) => !e.includes(t.trackid));
                (c = t.map((e) => new ms(d, "recv", void 0, e.trackid, e.mid))),
                  (this.subscribeTracks = this.subscribeTracks.concat(c));
              }
              o &&
                Object.entries(o).forEach((e) => {
                  let [t, r] = e;
                  this.profiles.set(t, r);
                }),
                he.log("sub tracks", c, o);
              try {
                if (!n) {
                  const e = c.map((e) => e.startConnect());
                  Promise.all(e)
                    .then(() => a(c.map((e) => e.track)))
                    .catch(() => {
                      s(fo());
                    });
                }
                let t = yield d.initRecvHandler(c.map((e) => e.trackID));
                if (!t) {
                  const e = Date.now();
                  (t = yield u.request("sub-tracks", {
                    tracks: c.map((e) => {
                      const t = e.trackID;
                      return this.profiles.get(t)
                        ? { trackid: t, profile: this.profiles.get(t) }
                        : { trackid: t };
                    }),
                  })),
                    Xi.addEvent("SubscribeTracks", {
                      result_code: t.code,
                      signal_take_time: Date.now() - e,
                      tracks: t.tracks.map((e) => ({
                        track_id: e.trackid,
                        status: e.status,
                      })),
                    });
                }
                switch ((he.log("get sub res data", t), t.code)) {
                  case 0:
                    break;
                  case 10052:
                    throw Mo();
                  case 10062:
                    throw (d.resetRecvHandler(), Io(10062, t.error));
                  default:
                    throw Io(t.code, t.error);
                }
                const o = t.tracks.filter((e) => !!e.status),
                  l = t.tracks.filter((e) => !e.status).map((e) => e.trackid);
                if (o.length < t.tracks.length && i)
                  throw Io(
                    10041,
                    "can not find target track id: ".concat(l.join(" "))
                  );
                if (o && !i) {
                  he.debug(
                    "can not find target track id: ".concat(
                      l.join(""),
                      ", continue"
                    )
                  );
                  const e = ge(c, (e) => -1 !== l.indexOf(e.trackID));
                  ge(this.subscribeTracks, (e) => -1 !== l.indexOf(e.trackID)),
                    e.map((e) => e.release());
                }
                t.tracks = o;
                for (const e of t.tracks || []) {
                  const t = c.find((t) => t.trackID === e.trackid),
                    n = r.find((t) => t.trackid === e.trackid);
                  if (!t || !n) continue;
                  const i = e.rtpparams;
                  t.appendConsumner(i, n.kind);
                }
                yield d.addConsumers(), d.resolveInitSubPcPromise();
                for (const e of c) {
                  const { consumer: t } = e;
                  if (!t || !t.track) continue;
                  const n = t.track;
                  let i = e.track;
                  const o = r.find((e) => e.trackid === t.id);
                  if (!o) continue;
                  i
                    ? i.resume(n)
                    : "audio" === n.kind
                    ? ((i = new _s(n, o.playerid, "remote")),
                      i.initAudioManager())
                    : (i = new Ra(n, o.playerid, "remote", o.profiles || [])),
                    i.setInfo({
                      trackID: o.trackid,
                      userID: o.playerid,
                      tag: o.tag,
                      kind: o.kind,
                      muted: o.muted,
                      versionid: o.versionid,
                    }),
                    i.setMaster(o.master),
                    i.removeAllListeners("@get-stats"),
                    i.removeAllListeners("@ended"),
                    i.on("@get-stats", (e, t, r) => {
                      if (!this.connectionTransport) return t([]);
                      this.connectionTransport.recvHandler
                        .getStats(i.mediaTrack, e)
                        .then(t, r);
                    }),
                    i.once("@ended", () =>
                      pe(this, void 0, void 0, function* () {
                        if (i && i.info.trackID) {
                          he.warning("remote track ended, try to resubscribe");
                          try {
                            yield this._unsubscribe([i.info.trackID], !0);
                          } catch (e) {}
                          yield this._subscribe([i.info.trackID], !0);
                        }
                      })
                    ),
                    (e.track = i);
                  const a = this.users.find((e) => e.userID === o.playerid);
                  a && a.addTracks([i]);
                }
                c.forEach(
                  (t) => (t.connectStatus = e.TrackConnectStatus.Connect)
                );
                let A = t.tracks.map((e) => {
                  if (void 0 === e.muted)
                    for (let t = 0; t < this._trackInfo.length; t++)
                      e.trackid === this._trackInfo[t].trackid &&
                        (e.muted = this._trackInfo[t].muted);
                  return e;
                });
                this.handleMute({ tracks: A });
              } catch (e) {
                he.log(e);
                const r = [];
                if (
                  (c.forEach((e) => {
                    e.consumer && r.push(e.consumer);
                  }),
                  yield d.removeConsumers(r),
                  !(e instanceof Ji))
                )
                  return (
                    he.warning(e, "resubscribe"),
                    void setTimeout(() => this._subscribe(t, !0), 1e3)
                  );
                switch (e.code) {
                  case 10062:
                  case 30001:
                    return;
                  case 10052:
                    return (
                      he.warning(e, "resubscribe"),
                      void setTimeout(() => this._subscribe(t, !0), 1e3)
                    );
                  default:
                    ge(
                      this.subscribeTracks,
                      (e) => -1 !== t.indexOf(e.trackID)
                    ),
                      s(e);
                }
              }
              a(c.map((e) => e.track));
            })
          );
        }),
        (this.config = Object.assign(Object.assign({}, xs), t)),
        he.log("config", this.config),
        he.log("version", ei),
        he.log("browser report", Ti, hi);
    }
    _setReconnectTimes(e) {
      (this.config.reconnectTimes = e),
        this.signaling && (this.signaling.reconnectTimes = e);
    }
    set simulcast(e) {
      (this.config.simulcast = e),
        this.connectionTransport &&
          ((this.connectionTransport.simulcast = e),
          (this.connectionTransport.sendHandler._simulcast = e),
          (this.connectionTransport.recvHandler._simulcast = e));
    }
    _getReconnectTimes() {
      return this.config.reconnectTimes || xs.reconnectTimes;
    }
    setRequestTimeout(e) {
      (this.config.requestTimeout = e),
        this.signaling && (this.signaling.requestTimeout = e);
    }
    _setProfile(e, t) {
      if (
        ((this.profile = t),
        this.profiles.set(e, t),
        !this.subscribeTracks.some((t) => t.trackID === e))
      )
        return;
      this.signaling.sendWsMsg("set-sub-profile", {
        tracks: [{ trackid: e, profile: this.profile }],
      });
    }
    getForwardJobTracks() {
      return this.forwardJobTracks;
    }
    get publishedTracks() {
      return this.connectionTransport
        ? this.connectionTransport.publishTracks
            .filter((t) => t.connectStatus === e.TrackConnectStatus.Connect)
            .map((e) => e.track)
        : [];
    }
    get subscribedTracks() {
      return this.subscribeTracks
        .filter((t) => t.connectStatus === e.TrackConnectStatus.Connect)
        .map((e) => e.track);
    }
    setClientMode(e) {
      return pe(this, void 0, void 0, function* () {
        if (this.roomState !== Ns.Idle)
          throw Yi("can not setClientMode, room state is not idle");
        (this._mode = e), this._setPrivileges();
      });
    }
    _setPrivileges() {
      this._mode === e.QNClientMode.RTC ||
      (this._mode === e.QNClientMode.LIVE &&
        this._role === e.QNClientRole.BROADCASTER)
        ? (this._privileges = ["subscribe", "publish"])
        : (this._privileges = ["subscribe"]);
    }
    setClientRole(t) {
      return pe(this, void 0, void 0, function* () {
        if (this._mode === e.QNClientMode.RTC)
          throw Yi("client role can only be set in client mode LIVE.");
        if (
          t === e.QNClientRole.AUDIENCE &&
          this.publishedTracks.length > 0 &&
          t === e.QNClientRole.AUDIENCE
        )
          throw Yi(
            "cannot change to audience, please unpublish all tracks first."
          );
        if (
          ((this._role = t),
          this._setPrivileges(),
          this.roomState !== Ns.Connected)
        )
          return;
        const r = yield this.signaling.request("set-privileges", {
          privileges: this._privileges,
        });
        if (
          (Xi.addEvent("SetClientRole", {
            result_code: r.code,
            user_role: t === e.QNClientRole.BROADCASTER ? 0 : 1,
            audience_latency_level: 0,
          }),
          0 !== r.code)
        )
          throw Ro(r.code, r.error);
      });
    }
    joinRoomWithToken(t, r) {
      return pe(this, void 0, void 0, function* () {
        const n = Date.now();
        let i = 0;
        this._mode === e.QNClientMode.LIVE && (i = 1);
        const o = this._role === e.QNClientRole.BROADCASTER ? 0 : 1;
        if (
          (Xi.addEvent("JoinRoom", {
            room_token: t,
            user_data: r,
            room_type: i,
            user_role: o,
            audience_latency_level: 0,
          }),
          this.roomState !== Ns.Idle)
        )
          throw Yi(
            "roomState is not idle! Do not repeat join room, please run leaveRoom first"
          );
        this.roomState = Ns.Connecting;
        try {
          (this.roomToken = t), (this.userData = r);
          const i = xo(t);
          if (
            ((this.userID = i.userId),
            (this.roomName = i.roomName),
            (this.appId = i.appId),
            Xi.setUserBase(this.userID, this.roomName, this.appId),
            he.log("join room, token:", t),
            he.debug(
              "join room, roomName: "
                .concat(this.roomName, ", userID: ")
                .concat(this.userID)
            ),
            !this.roomName.match(/^[a-zA-Z0-9_-]{1,64}$/))
          )
            throw (
              ((this.roomState = Ns.Idle),
              Yi(
                "invalid roomname. roomname must match /^[a-zA-Z0-9_-]{1,64}$/"
              ))
            );
          if (!this.userID.match(/^[a-zA-Z0-9_-]{1,50}$/))
            throw (
              ((this.roomState = Ns.Idle),
              Yi("invalid userID. userID must match /^[a-zA-Z0-9_-]{1,50}$/"))
            );
          try {
            const e = yield os(i, t, this.config.requestTimeout);
            (this.accessToken = e.accessToken),
              Xi.setSessionId(e.sessionId),
              Xi.setUserBase(this.userID, this.roomName, this.appId);
          } catch (e) {
            throw e;
          }
          const o = yield this.joinRoomWithAccess(this.accessToken);
          return (
            Xi.addEvent("JoinRoomResult", {
              join_start_time: n,
              join_take_time: Date.now() - n,
              join_result_code: 0,
              join_node_info: this.signaling.url,
              join_error_message: "",
              event_grade: e.QNEventGrade.NORMAL,
              event_category: e.QNEventCategory.CORE,
            }),
            this._mode === e.QNClientMode.LIVE &&
              (yield this.setClientRole(this._role)),
            o
          );
        } catch (t) {
          const r = t;
          throw (
            ((this.roomState = Ns.Idle),
            he.debug("joinRoomWithToken fail: " + r.message),
            Xi.addEvent("JoinRoomResult", {
              join_start_time: n,
              join_take_time: Date.now() - n,
              join_result_code: r.code ? r.code : -1,
              join_node_info: this.signaling ? this.signaling.url : "",
              join_error_message: r.message || r.error || "",
              event_grade: e.QNEventGrade.SERVERE,
              event_category: e.QNEventCategory.CORE,
            }),
            r)
          );
        }
      });
    }
    joinRoomWithAccess(t) {
      return pe(this, void 0, void 0, function* () {
        const r = No(t),
          { capsdp: n } = yield (function () {
            return pe(this, void 0, void 0, function* () {
              let e = pa(),
                { isH264: t, sdp: r } = yield rs(e),
                n = 5;
              for (; !t && n > 0; )
                e.close(),
                  (e = pa()),
                  ({ isH264: t, sdp: r } = yield rs(e)),
                  n--;
              Ti.needH264FmtpLine &&
                (r +=
                  "a=fmtp:107 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f".concat(
                    "\n"
                  )),
                (r = is(r));
              const i = { capsdp: r, agent: navigator.userAgent };
              return e.close(), i;
            });
          })();
        if (this._roomState === Ns.Idle)
          throw Yi("roomState is idle, maybe because you left the room.");
        const i = new us(
          t,
          n,
          this._getReconnectTimes(),
          this.config.requestTimeout,
          this.userData,
          this._privileges
        );
        i
          .on("@error", this.handleDisconnect.bind(this))
          .on("@ws-state-change", (e, t) => {
            if (t === ss.CONNECTING)
              this.roomState === Ns.Connected
                ? (this.roomState = Ns.Reconnecting)
                : this.roomState !== Ns.Reconnecting &&
                  (this.roomState = Ns.Connecting);
          })
          .on("@needupdateaccesstoken", (e, t) => {
            this.updateAccessToken().then(e).catch(t);
          })
          .on("on-player-in", this.handlePlayerIn.bind(this))
          .on("on-player-out", this.handlePlayerOut.bind(this))
          .on("on-add-tracks", (e) => {
            this.filterSignalTracks(e), this.handleAddTracks(e);
          })
          .on("on-remove-tracks", (e) => {
            this.filterSignalTracks(e), this.handleRemoveTracks(e);
          })
          .on("mute-tracks", (e) => {
            this.filterSignalTracks(e), this.handleMute(e);
          })
          .on("on-messages", this.handleCustomMessages.bind(this))
          .on("on-qos-messages", this.handleQosMessages.bind(this))
          .on("on-pubpc-restart-notify", (t) => {
            const r = this.connectionTransport;
            Xi.addEvent("AbnormalDisconnect", {
              event_reason: "on-pubpc-restart-notify",
              event_description: t.error,
              event_grade: e.QNEventGrade.SERVERE,
              event_category: e.QNEventCategory.CORE,
              event_reason_code: 0,
              socket_node_info: i.url,
            }),
              r &&
                Ti.supportRestartICE &&
                r.restartSendICE(t.pcid).catch(he.debug);
          })
          .on("on-subpc-restart-notify", (t) => {
            const r = this.connectionTransport;
            Xi.addEvent("AbnormalDisconnect", {
              event_reason: "on-subpc-restart-notify",
              event_description: t.error,
              event_grade: e.QNEventGrade.SERVERE,
              event_category: e.QNEventCategory.CORE,
              event_reason_code: 0,
              socket_node_info: i.url,
            }),
              r &&
                Ti.supportRestartICE &&
                r.restartRecvICE(t.pcid).catch(he.debug);
          })
          .on("on-sub-profile-changed", (e) => {
            this.emit("on-sub-profile-changed", e);
          })
          .on("on-job-connected", (e) => {
            this.emit("forward-job-connected", { jobId: e.id });
          })
          .on("on-job-disconnected", (e) => {
            this.emit("forward-job-disconnected", { jobId: e.id });
          })
          .on("on-merge-job-connected", (e) => {
            this.emit("merge-job-connected", { jobId: e.id });
          })
          .on("on-merge-job-disconnected", (e) => {
            this.emit("merge-job-disconnected", { jobId: e.id });
          })
          .on("on-command", (e) => {
            this.emit("command", { content: e.content, command: e.command });
          })
          .on("on-media-relay-state", (e) => {
            const t = e.roomid.slice(e.roomid.indexOf(":") + 1);
            this.emit("media-relay-state-changed", t, e.state);
          })
          .on("disconnect", this.handleDisconnect.bind(this))
          .on(
            "on-player-reconnect",
            this.handleRemoteUserReconnecting.bind(this)
          )
          .on(
            "on-player-reconnect-in",
            this.handleRemoteUserReconnected.bind(this)
          ),
          he.log("init signaling websocket"),
          (this.signaling = i);
        try {
          let t;
          t =
            r.roomServers && r.roomServers.length > 0
              ? r.roomServers
                  .sort((e, t) => t.score - e.score)
                  .map((e) => e.url)
              : [r.signalingurl2];
          const { ws: n, url: o } = yield (function (t, r) {
              let n = [],
                i = !1;
              return new Promise((o, a) => {
                for (const s of t)
                  Os(s, r).then((r) => {
                    n.push(r),
                      r.status && (o({ ws: r.ws, url: r.url }), (i = !0)),
                      Xi.addEvent("WebsocketConnect", {
                        happy_dns_resolve_time: 0,
                        happy_dns_take_effect: !1,
                        socket_node_info: r.url,
                        socket_connect_time: r.connectTime,
                        socket_connect_success: r.status,
                        socket_connect_error_message: r.reason,
                        event_grade: i
                          ? e.QNEventGrade.NORMAL
                          : e.QNEventGrade.SERVERE,
                        event_category: e.QNEventCategory.CORE,
                        dns_resolve_time: 0,
                        dns_take_effect: !1,
                        dns_resolved_ip: "",
                        socket_connect_reason: "connect",
                      }),
                      n.length !== t.length ||
                        i ||
                        a($i("websocket connect failed."));
                  });
              });
            })(t, this.config.requestTimeout),
            a = yield i.initWs(!0, n, o);
          i.on("@signalingauth", this.handleAuth.bind(this)),
            yield this.handleAuth(a);
        } catch (e) {
          if (
            (this.signaling &&
              (this.signaling.release(), (this.signaling = void 0)),
            10052 === e.code)
          )
            return (
              yield Vo(1e3),
              this.joinRoomWithToken(this.roomToken, this.userData)
            );
          throw e;
        }
        for (let e of this.users)
          e.userID !== this.userID && this.emit("user-join", e);
        return (
          this.trackInfoList.length > 0 &&
            this.emit("track-add", this.trackInfoList),
          this.users
        );
      });
    }
    _unpublish(e) {
      return pe(this, void 0, void 0, function* () {
        if (this.roomState !== Ns.Connected)
          throw Yi("not connected to the room");
        if (0 === e.length) return;
        he.debug("unpublish", e);
        const t = this.connectionTransport,
          r = t.publishTracks.filter((t) => -1 !== e.indexOf(t.trackID));
        if (r.length !== e.length)
          throw Yi("can not find target trackid to unpublish");
        yield t.removeTracks(r),
          this.getAllMerger().forEach((e) =>
            e.controller.onRemoveTracks(r.map((e) => e.track.info))
          );
        const n = Lo(this.users, "userID", this.userID);
        n && (n.removeTracksByTrackId(e), n.removePublishedTrackInfo(e)),
          this.cleanTrackIdsFromMergeJobs(e);
      });
    }
    createMergeJob(e, t) {
      return pe(this, void 0, void 0, function* () {
        if (this.roomState !== Ns.Connected)
          throw Yi("can not createMergeJob, room state is not connected");
        const r = Object.assign(Object.assign(Object.assign({}, Ce), t), {
          id: e,
        });
        he.debug("send create merge job", r, e);
        const n = Date.now(),
          i = yield this.signaling.request("create-merge-job", r);
        if (
          (Xi.addEvent("CreateMergeJob", {
            signal_take_time: Date.now() - n,
            id: e,
            result_code: i.code,
          }),
          0 !== i.code)
        )
          throw wo(i.code, i.error);
        this.mergeJobTracks[e]
          ? he.warning("merge job id already exist", e)
          : (this.mergeJobTracks[e] = []);
      });
    }
    createForwardJob(e) {
      return pe(this, void 0, void 0, function* () {
        if (this.roomState !== Ns.Connected)
          throw Yi("can not createForwardJob, room state is not connected");
        const t = !!e.audioTrackId && !e.videoTrackId,
          r = [e.audioTrackId, e.videoTrackId]
            .filter(Boolean)
            .map((e) => ({ trackid: e })),
          n = {
            id: e.jobId,
            publishUrl: e.publishUrl,
            audioOnly: t,
            tracks: r,
          };
        if (e && e.userConfigExtraInfo) {
          if (((i = e.userConfigExtraInfo), !(new Blob([i]).size <= 1e3)))
            throw Yi("userConfigExtraInfo Up to 1000 Bytes");
          n.seiTemplate = { value: e.userConfigExtraInfo };
        }
        var i;
        const o = Date.now(),
          a = yield this.signaling.request("create-forward-job", n);
        if (
          (Xi.addEvent("CreateForwardJob", {
            signal_take_time: Date.now() - o,
            id: e.jobId,
            result_code: a.code,
          }),
          0 !== a.code)
        )
          throw Eo(a.code, a.error);
        this.forwardJobTracks[e.jobId]
          ? he.warning("forward job id already exist", e.jobId)
          : ((this.forwardJobTracks[e.jobId] = []),
            e.audioTrackId &&
              this.forwardJobTracks[e.jobId].push(e.audioTrackId),
            e.videoTrackId &&
              this.forwardJobTracks[e.jobId].push(e.videoTrackId));
      });
    }
    stopForwardJob(e) {
      return pe(this, void 0, void 0, function* () {
        if (this.roomState !== Ns.Connected)
          throw Yi("can not stopForwardJob, room state is not connected");
        if (e && !this.forwardJobTracks[e])
          throw Yi("no forward job id ".concat(e));
        Xi.addEvent("StopForwardJob", { id: e || "" }),
          yield this.signaling.request("stop-forward", {
            id: e,
            delayMillisecond: 0,
          }),
          delete this.forwardJobTracks[e];
      });
    }
    setDefaultMergeStream(e, t, r) {
      if (r && !this.mergeJobTracks[r]) throw Ao(r);
      this.merger && !r && (this.merger.release(), (this.merger = void 0)),
        r &&
          this.mergeJobMerger[r] &&
          (this.mergeJobMerger[r].release(), delete this.mergeJobMerger[r]);
      const n = this.CreateMergerSessionController();
      r
        ? (this.mergeJobMerger[r] = new As(e, t, n, r))
        : (this.merger = new As(e, t, n, r));
    }
    _stopMerge(e) {
      if (this.roomState !== Ns.Connected)
        throw Yi("can not addMergeTracks, room state is not connected");
      if (e && !this.mergeJobTracks[e]) throw Ao(e);
      Xi.addEvent("StopMerge", { id: e || "" }),
        this.signaling.sendWsMsg("stop-merge", { id: e }),
        e
          ? (delete this.mergeJobTracks[e],
            this.mergeJobMerger[e] &&
              (this.mergeJobMerger[e].release(), delete this.mergeJobMerger[e]))
          : ((this.defaultMergeJobTracks = []),
            this.merger && (this.merger.release(), (this.merger = void 0)));
    }
    _addMergeTracks(e, t) {
      return pe(this, void 0, void 0, function* () {
        if (this.roomState !== Ns.Connected)
          throw Yi("can not addMergeTracks, room state is not connected");
        if (t && !this.mergeJobTracks[t]) throw Ao(t);
        const r = e.map((e) => ({
            trackid: e.trackID,
            x: e.x,
            y: e.y,
            w: e.w,
            h: e.h,
            z: e.z,
            stretchMode: e.stretchMode,
          })),
          n = { id: t, add: r };
        he.debug("addMergeTracks", n),
          t
            ? ((this.mergeJobTracks[t] = this.mergeJobTracks[t].concat(
                e.map((e) => e.trackID)
              )),
              (this.mergeJobTracks[t] = wa(this.mergeJobTracks[t], (e) => e)))
            : ((this.defaultMergeJobTracks = this.defaultMergeJobTracks.concat(
                e.map((e) => e.trackID)
              )),
              (this.defaultMergeJobTracks = wa(
                this.defaultMergeJobTracks,
                (e) => e
              )));
        const i = yield this.signaling.request("update-merge-tracks", n);
        if (
          (Xi.addEvent("UpdateMergeTracks", {
            id: t || "",
            add: r.map((e) => ({
              track_id: e.trackid,
              x: e.x || 0,
              y: e.y || 0,
              w: e.w || 0,
              h: e.h || 0,
              z: e.z || 0,
              stretchMode: e.stretchMode || "",
            })),
            result_code: i.code,
          }),
          0 !== i.code)
        )
          throw Ro(i.code, i.error);
      });
    }
    _removeMergeTracks(e, t) {
      return pe(this, void 0, void 0, function* () {
        if (this.roomState !== Ns.Connected)
          throw Yi("can not addMergeTracks, room state is not connected");
        if (t && !this.mergeJobTracks[t]) throw Ao(t);
        const r = { id: t, remove: e.map((e) => ({ trackid: e })) };
        he.debug("removeMergeTracks", r),
          ge(
            t ? this.mergeJobTracks[t] : this.defaultMergeJobTracks,
            (t) => -1 !== e.indexOf(t)
          );
        const n = yield this.signaling.request("update-merge-tracks", r);
        if (
          (Xi.addEvent("UpdateMergeTracks", {
            id: t || "",
            remove: r.remove.map((e) => ({ track_id: e.trackid })),
            result_code: n.code,
          }),
          0 !== n.code)
        )
          throw Ro(n.code, n.error);
      });
    }
    updateMergeTracks(e, t) {
      return pe(this, void 0, void 0, function* () {
        if (this.roomState !== Ns.Connected)
          throw Yi("can not addMergeTracks, room state is not connected");
        if (t && !this.mergeJobTracks[t]) throw Ao(t);
        const r = e.map((e) => ({
            trackid: e.trackID,
            x: e.x,
            y: e.y,
            w: e.w,
            h: e.h,
            z: e.z,
            stretchMode: e.stretchMode,
          })),
          n = { id: t, all: r, mode: 1 };
        he.debug("updateMergeTracks", n),
          t
            ? ((this.mergeJobTracks[t] = this.mergeJobTracks[t].concat(
                e.map((e) => e.trackID)
              )),
              (this.mergeJobTracks[t] = wa(this.mergeJobTracks[t], (e) => e)))
            : ((this.defaultMergeJobTracks = this.defaultMergeJobTracks.concat(
                e.map((e) => e.trackID)
              )),
              (this.defaultMergeJobTracks = wa(
                this.defaultMergeJobTracks,
                (e) => e
              ))),
          Xi.addEvent("UpdateMergeTracks", {
            id: t || "",
            all: r.map((e) => ({
              track_id: e.trackid,
              x: e.x || 0,
              y: e.y || 0,
              w: e.w || 0,
              h: e.h || 0,
              z: e.z || 0,
              stretchMode: e.stretchMode || "",
            })),
          }),
          yield this.signaling.request("update-merge-tracks", n);
      });
    }
    _unsubscribe(e, t) {
      return pe(this, void 0, void 0, function* () {
        if (this.roomState !== Ns.Connected)
          throw Yi("no signaling model, please run joinRoomWithToken first");
        const r = this.subscribeTracks.filter(
          (t) => -1 !== e.indexOf(t.trackID)
        );
        if ((he.debug("unsubscribe", r), 0 === r.length)) return;
        const n = Date.now(),
          i = yield this.signaling.request("unsub-tracks", {
            tracks: r.map((e) => ({ trackid: e.trackID })),
          });
        Xi.addEvent("UnSubscribeTracks", {
          tracks: e.map((e) => ({ track_id: e })),
          result_code: i.code,
          signal_take_time: Date.now() - n,
        }),
          t ||
            (r.forEach((e) => e.release()),
            ge(this.subscribeTracks, (t) => -1 !== e.indexOf(t.trackID))),
          yield this.connectionTransport.removeConsumers(
            r.map((e) => e.consumer)
          );
      });
    }
    _muteTracks(e) {
      if (this.roomState !== Ns.Connected)
        throw Yi("no signaling model, please run joinRoomWithToken first");
      const t = this.connectionTransport,
        r = {};
      e.forEach((e) => {
        r[e.trackID] = e.muted;
      });
      const n = t.publishTracks.filter((e) => void 0 !== r[e.trackID]);
      n.forEach((e) => {
        e.setMute(r[e.trackID]);
      }),
        Xi.addEvent("MuteTracks", {
          tracks: n.map((e) => ({
            track_id: e.trackID,
            muted: e.track.info.muted,
            kind: e.track.info.kind,
          })),
        }),
        this.signaling.sendWsMsg("mute-tracks", {
          tracks: e.map((e) => ({ trackid: e.trackID, muted: e.muted })),
        });
    }
    kickoutUser(e) {
      return pe(this, void 0, void 0, function* () {
        he.log("kickoutUser", e), yield this.control("kickplayer", e);
      });
    }
    sendCustomMessage(e, t, r) {
      if (this.roomState !== Ns.Connected)
        throw Yi("room state is not connected, can not send message");
      const n = r || Fo(8),
        i = t && 0 !== t.length ? t : void 0;
      this.signaling.sendWsMsg("send-message", {
        msgid: n,
        target: i,
        type: "normal",
        text: e,
      }),
        he.debug("send custom message", e, i, n);
    }
    replaceTrack(e, t) {
      return pe(this, void 0, void 0, function* () {
        if (this.roomState !== Ns.Connected)
          throw Yi("no signaling model, please run joinRoomWithToken first");
        he.log("replaceTrack", e, t);
        const r = this.connectionTransport.publishTracks.find(
          (t) => t.trackID === e
        );
        if (void 0 === r || void 0 === r.track)
          throw Yi("track not exist: ".concat(e));
        return this.connectionTransport.sendHandler.replaceTrack(r, t);
      });
    }
    pushCameraTrackWithImage(e, t) {
      return pe(this, void 0, void 0, function* () {
        if (this.roomState !== Ns.Connected)
          throw Yi("no signaling model, please run joinRoomWithToken first");
        he.log("pushCameraTrackWithImage", { trackID: e, source: t });
        const r = this.connectionTransport.publishTracks.find(
          (t) => t.trackID === e
        );
        if (void 0 === r || void 0 === r.track)
          throw Yi("track not exist: ".concat(e));
        if ("video" !== r.track.info.kind)
          throw Yi("track kind is not video: ".concat(e));
        return (
          r.track.imageStreamTrack || (r.track.imageStreamTrack = new fs()),
          void 0 === t && r.track.isReplacedByImageTrack
            ? (yield this.connectionTransport.sendHandler.replaceProducerTrack(
                r,
                "video"
              ),
              (r.track.isReplacedByImageTrack = !1),
              void r.track.switchPlayingTrack())
            : void 0 !== t && r.track && !r.track.isReplacedByImageTrack
            ? (yield r.track.imageStreamTrack.setSource(t),
              yield this.connectionTransport.sendHandler.replaceProducerTrack(
                r,
                "image"
              ),
              (r.track.isReplacedByImageTrack = !0),
              void r.track.switchPlayingTrack())
            : void 0
        );
      });
    }
    leaveRoom() {
      this.roomState !== Ns.Idle
        ? (he.log("leave room"),
          Xi.addEvent("LeaveRoom", { leave_reason_code: 0 }),
          this.signaling &&
            (Object.keys(this.forwardJobTracks).forEach((e) =>
              this.stopForwardJob(e)
            ),
            this.signaling.sendDisconnect()),
          this.releaseRoom())
        : he.log("can not leave room, please join room first");
    }
    _releasePublishTracks() {}
    control(e, t) {
      return pe(this, void 0, void 0, function* () {
        if (this.roomState !== Ns.Connected)
          throw Yi("can not connected to the room, please run joinRoom first");
        const r = yield this.signaling.request("control", {
          command: e,
          playerid: t,
        });
        if (r.error) throw Po(r.code, r.error);
      });
    }
    handlePlayerOut(e) {
      const t = this._users.get(e.playerid);
      if (t) {
        this._users.delete(e.playerid),
          ge(this._trackInfo, (t) => t.playerid === e.playerid);
        ge(this.subscribeTracks, (e) => e.track.userID === t.userID).forEach(
          (e) => e.release()
        ),
          Ho(() => {
            he.debug("user-leave", t), this.emit("user-leave", t);
          });
      }
    }
    handlePlayerIn(e) {
      const t = xa(e);
      this._users.set(t.userID, t),
        Ho(() => {
          he.debug("user-join", t), this.emit("user-join", t);
        });
    }
    handleAddTracks(e) {
      let { tracks: t } = e;
      he.log("receive track-add", t, Object.assign({}, this._trackInfo));
      const r = new Set();
      for (const e of t) {
        const t = Lo(this.users, "userID", e.playerid);
        if (t)
          if (
            t.published &&
            !r.has(t.userID) &&
            "stream" === this.sessionMode
          ) {
            const r = t.publishedTrackInfo.map((e) => Oa(e, !0));
            this.handleRemoveTracks({ tracks: r }),
              r.push(e),
              this.handleAddTracks({ tracks: r });
          } else
            this._trackInfo.push(e),
              t.addPublishedTrackInfo([Da(e)]),
              r.add(t.userID);
      }
      if ("stream" === this.sessionMode)
        for (const e of Array.from(r))
          Ho(() => {
            he.debug("user-publish", this._users.get(e)),
              this.emit("user-publish", this._users.get(e));
          });
      Ho(() => {
        he.debug("track-add", t.map(Da)), this.emit("track-add", t.map(Da));
      });
    }
    handleRemoveTracks(e) {
      let { tracks: t } = e;
      he.log("receive track-remove", t, Object.assign({}, this._trackInfo));
      const r = ge(this._trackInfo, (e) =>
          t.map((e) => e.trackid).includes(e.trackid)
        ),
        n = new Set();
      for (const e of r) {
        const t = this._users.get(e.playerid);
        if (!t) continue;
        t.removePublishedTrackInfo([e.trackid]),
          t.removeTracksByTrackId([e.trackid]),
          n.add(t.userID);
        const r = ge(this.subscribeTracks, (t) => t.trackID === e.trackid)[0];
        r && r.release();
      }
      if (
        (this.cleanTrackIdsFromMergeJobs(t.map((e) => e.trackid)),
        "stream" === this.sessionMode)
      )
        for (const e of Array.from(n)) {
          const t = this._users.get(e);
          if (t.published) {
            const e = t.publishedTrackInfo.map((e) => Oa(e, !0));
            this.handleRemoveTracks({ tracks: e }),
              this.handleAddTracks({ tracks: e });
          } else
            Ho(() => {
              he.debug("user-unpublish", t), this.emit("user-unpublish", t);
            });
        }
      Ho(() => {
        he.debug("track-remove", r.map(Da)),
          this.emit("track-remove", r.map(Da));
      });
    }
    handleMute(e) {
      let { tracks: t } = e;
      for (const e of t) {
        const t = e.trackid,
          r = e.muted,
          n = Lo(this._trackInfo, "trackid", t);
        if (!n) return;
        const i = this._users.get(n.playerid);
        if (!i) return;
        const o = i.publishedTrackInfo.find((e) => e.trackID === t);
        o && (o.muted = r);
        const a = i.tracks.find((e) => e.info.trackID === t);
        a && ((a.info.muted = r), a.setMute(r)), (n.muted = r);
        const s = this.subscribeTracks.filter((e) => e.trackID === t)[0];
        let c;
        s && s.setMute(r);
        for (let e = 0; e < this._trackInfo.length; e += 1)
          this._trackInfo[e].playerid === n.playerid &&
            this._trackInfo[e].kind !== n.kind &&
            (c = this._trackInfo[e]);
        const d = { userID: n.playerid, muteAudio: !1, muteVideo: !1 };
        "audio" === n.kind
          ? ((d.muteAudio = r), (d.muteVideo = !!c && c.muted))
          : ((d.muteVideo = r), (d.muteAudio = !!c && c.muted)),
          "stream" === this.sessionMode &&
            Ho(() => {
              he.log("user-mute", d), this.emit("user-mute", d);
            });
      }
      Ho(() => {
        he.log(
          "mute-tracks",
          t.map((e) => ({ trackID: e.trackid, muted: e.muted }))
        ),
          this.emit(
            "mute-tracks",
            t.map((e) => ({ trackID: e.trackid, muted: e.muted }))
          );
      });
    }
    handleCustomMessages(e) {
      let { messages: t } = e;
      this.emit("messages-received", t.map(Ma));
    }
    handleQosMessages(e) {
      let { messages: t } = e;
      const r = [];
      t.forEach((e) => {
        try {
          const t = JSON.parse(e.qos);
          t.tracks_qos.forEach((n) => {
            r.push({
              userID: e.playerid,
              networkGrade: t.networkGrade,
              kind: n.kind,
              trackID: n.track,
              packetLossRate: n.lostRate,
              rtt: n.rtt,
            });
          });
        } catch (e) {
          he.warning("parse SignalingQosMessage error: ", e);
        }
      }),
        Ds.emit("remote-track-stats", r),
        this.emit("remote-track-stats", r);
    }
    handleDisconnect(t) {
      if (
        (he.log("handle disconnect", t.code, t),
        -1 === [0, 10005, 10006].indexOf(t.code) &&
          Xi.addEvent("AbnormalDisconnect", {
            event_reason: "websocket_error",
            event_description: t.error,
            event_grade: e.QNEventGrade.SERVERE,
            event_category: e.QNEventCategory.CORE,
            event_reason_code: -1,
            socket_node_info: this.signaling.url,
          }),
        Xi.addEvent("LeaveRoom", { leave_reason_code: t.code }),
        10052 === t.code && this.roomToken)
      )
        return (
          (this.roomState = Ns.Reconnecting),
          void setTimeout(() => this.signaling.initWs(), 1e3)
        );
      if (10006 === t.code)
        this.emit("disconnect", { code: t.code, data: { userID: t.kickedid } });
      else this.emit("disconnect", { code: t.code });
      this.releaseRoom();
    }
    handleRemoteUserReconnecting(e) {
      const t = this.users.find((t) => t.userID === e.playerid);
      t &&
        (he.debug("remote-user-reconnecting", t),
        this.emit("remote-user-reconnecting", t));
    }
    handleRemoteUserReconnected(e) {
      const t = this.users.find((t) => t.userID === e.playerid);
      t &&
        (he.debug("remote-user-reconnected", t),
        this.emit("remote-user-reconnected", t));
    }
    updateAccessToken() {
      return pe(this, void 0, void 0, function* () {
        const e = xo(this.roomToken),
          t = yield os(e, this.roomToken, this.config.requestTimeout);
        Xi.setSessionId(t.sessionId), (this.accessToken = t.accessToken);
        const r = No(t.accessToken);
        if (!this.signaling)
          throw Yi("room state is idle when updateAccessToken");
        (this.signaling.accessToken = this.accessToken),
          this.signaling.setUrl(r.signalingurl2);
      });
    }
    handleAuth(t) {
      return pe(this, void 0, void 0, function* () {
        if ((this.filterSignalTracks(t), he.debug("handleAuth", t), t.error))
          return void (yield this.joinRoomWithToken(
            this.roomToken,
            this.userData
          ));
        (t.tracks = t.tracks || []),
          (t.tracks = t.tracks.filter((e) => e.playerid !== this.userID)),
          (t.players = t.players || []);
        const r = this.roomState === Ns.Reconnecting;
        let n = { join: [], leave: [], add: [], remove: [], mute: [] };
        const i = Array.from(this._users.keys()),
          o = t.players.map((e) => e.playerid);
        if (
          ((n = (function (e, t, r, n, i) {
            const o = { join: [], leave: [], add: [], remove: [], mute: [] },
              a = t.map((e) => e.trackid),
              s = r.map((e) => e.trackid);
            return (
              a.forEach((n, i) => {
                if (t[i].playerid !== e)
                  if (-1 === s.indexOf(n)) o.remove.push(t[i]);
                  else {
                    const e = r.find((e) => e.trackid === n),
                      a = t[i];
                    e.versionid !== a.versionid &&
                      (o.remove.push(a), o.add.push(e));
                  }
              }),
              s.forEach((n, i) => {
                if (r[i].playerid === e) return;
                const s = a.indexOf(n);
                -1 === s
                  ? (o.add.push(r[i]),
                    o.mute.push({ trackid: n, muted: r[i].muted }))
                  : r[i].muted !== t[s].muted &&
                    o.mute.push({ trackid: n, muted: r[i].muted });
              }),
              n.forEach((t) => {
                t !== e && -1 === i.indexOf(t) && o.leave.push({ playerid: t });
              }),
              i.forEach((t) => {
                t !== e && -1 === n.indexOf(t) && o.join.push({ playerid: t });
              }),
              o
            );
          })(this.userID, this._trackInfo, t.tracks, i, o)),
          (this.roomState = Ns.Connected),
          r)
        )
          he.debug("get missing events", n),
            n.remove.length > 0 &&
              this.handleRemoveTracks({ tracks: n.remove }),
            n.leave.length > 0 &&
              n.leave.forEach(this.handlePlayerOut.bind(this)),
            n.join.length > 0 && n.join.forEach(this.handlePlayerIn.bind(this)),
            n.add.length > 0 && this.handleAddTracks({ tracks: n.add }),
            n.mute.length > 0 && this.handleMute({ tracks: n.mute });
        else {
          (this._trackInfo = t.tracks), this._users.clear();
          for (const e of t.players || []) {
            const t = xa(e),
              r = this._trackInfo.filter((e) => e.playerid === t.userID);
            t.addPublishedTrackInfo(r.map(Da)), this._users.set(t.userID, t);
          }
        }
        if (this.connectionTransport) {
          const r = this.connectionTransport.publishTracks.filter(
              (t) => t.connectStatus === e.TrackConnectStatus.Connecting
            ),
            n = this.subscribeTracks.filter(
              (t) => t.connectStatus === e.TrackConnectStatus.Connecting
            );
          (this.connectionTransport.extendedRtpCapabilities = t.rtpcaps),
            (!this.connectionTransport.sendHandler.isPcReady ||
              this.connectionTransport.sendHandler._isRestartingICE ||
              r.length > 0) &&
              this.connectionTransport.reconnectProducer(),
            (!this.connectionTransport.recvHandler.isPcReady ||
              this.connectionTransport.recvHandler._isRestartingICE ||
              n.length > 0) &&
              this.connectionTransport.resetRecvHandler();
        } else this.connectionTransport = this.createConnectionTransport(t.rtpcaps);
      });
    }
    createConnectionTransport(t) {
      const r = this.signaling,
        n = new Ms(t, r, this, this.config.simulcast);
      return (
        n.on("@needpubpc", (e, t, n, i) => {
          r.request("pubpc", {
            sdp: e,
            tracks: t.map(Na),
            policy: this.config.transportPolicy,
          })
            .then((e) => {
              switch (e.code) {
                case 0:
                  return this.emit("refresh-track-info", e.tracks), void n(e);
                case 10052:
                  throw Mo();
                default:
                  throw Yi(e.error);
              }
            })
            .catch(i);
        }),
        n
          .on("@needsubpc", (e, t, n) => {
            r.request("subpc", {
              tracks: e.map((e) =>
                this.profiles.get(e)
                  ? { trackid: e, profile: this.profiles.get(e) }
                  : { trackid: e }
              ),
              policy: this.config.transportPolicy,
            })
              .then((e) => {
                switch (e.code) {
                  case 0:
                    return void t(e);
                  case 10052:
                    throw Mo();
                  default:
                    throw Yi(e.error);
                }
              })
              .catch(n);
          })
          .on("@needresub", () => {
            const t = this.subscribeTracks.map((e) => e.trackID);
            this.subscribeTracks.forEach(
              (t) => (t.connectStatus = e.TrackConnectStatus.Connecting)
            ),
              this._subscribe(t, !0);
          })
          .on("@needrepub", (e) => {
            this._publish(
              e.map((e) => e.track),
              !0
            );
          })
          .on("@needresetrecv", () => {
            this.subscribeTracks
              .filter((e) => !!e.track)
              .forEach((e) => {
                e.track.removeAllListeners("@ended");
              });
          }),
        n
      );
    }
    cleanTrackIdsFromMergeJobs(e) {
      ge(this.defaultMergeJobTracks, (t) => -1 !== e.indexOf(t));
      for (const t in this.mergeJobTracks) ge(t, (t) => -1 !== e.indexOf(t));
    }
    CreateMergerSessionController() {
      const e = new ls(),
        t = (t) => {
          e.onAddTracks(t);
        },
        r = (t) => {
          e.onRemoveTracks(t);
        };
      return (
        this.on("track-add", t),
        this.on("track-remove", r),
        (e.getCurrentTracks = () => {
          if (!this.connectionTransport) return [];
          const e = this._trackInfo.map(Da),
            t = this.connectionTransport.publishTracks.map((e) => e.track.info);
          return e.concat(t);
        }),
        (e.addMergeTrack = (e, t) => {
          this._addMergeTracks(e, t);
        }),
        (e.release = () => {
          this.off("track-add", t), this.off("track-remove", r);
        }),
        e
      );
    }
    getAllMerger() {
      const e = [];
      this.merger && e.push(this.merger);
      for (const t in this.mergeJobMerger) e.push(this.mergeJobMerger[t]);
      return e;
    }
    releaseRoom() {
      this.releaseSession(),
        this.signaling && (this.signaling.release(), (this.signaling = void 0)),
        Xi.addEvent(
          "UnInit",
          { id: "".concat(this.sessionMode, "_").concat(Date.now()) },
          !0
        ),
        this.connectionTransport &&
          (this.connectionTransport.release(),
          (this.connectionTransport = void 0)),
        this.getAllMerger().map((e) => {
          e.release();
        }),
        (this.defaultMergeJobTracks = []),
        (this.mergeJobTracks = {}),
        (this.forwardJobTracks = {}),
        (this.merger = void 0),
        (this.mergeJobMerger = {}),
        (this.roomState = Ns.Idle),
        (this._trackInfo = []),
        this._users.clear(),
        (this.userID = void 0),
        this.subscribeTracks.forEach((e) => {
          e.release();
        }),
        (this.subscribeTracks = []),
        (this.profile = void 0),
        this.profiles.clear(),
        clearInterval(this.volumeIndicatorTimer),
        (this._mode = e.QNClientMode.RTC),
        (this._role = e.QNClientRole.AUDIENCE),
        (this._privileges = ["subscribe", "publish"]);
    }
    registerVolumeIndicatorEvent() {
      clearInterval(this.volumeIndicatorTimer),
        (this.volumeIndicatorTimer = setInterval(() => {
          if (!this.connectionTransport) return !1;
          const e = [...this.subscribedTracks, ...this.publishedTracks]
            .filter((e) => "audio" === e.info.kind && !e.info.muted)
            .map((e) => ({
              trackID: e.info.trackID,
              userID: e.userID,
              level: e.getCurrentVolumeLevel() || 0,
              muted: e.info.muted,
            }));
          if (0 === this.volumeIndicatorHistory.length)
            this.volumeIndicatorHistory.push(e.filter((e) => e.level >= 0.1));
          else {
            const t =
                this.volumeIndicatorHistory[
                  this.volumeIndicatorHistory.length - 1
                ],
              r = {};
            t.forEach((e) => (r[e.trackID] = e.level));
            const n = [];
            for (let t of e)
              t.level >= 0.1
                ? r[t.trackID]
                  ? t.level > r[t.trackID]
                    ? n.push(t)
                    : n.push(
                        Object.assign(Object.assign({}, t), {
                          level: r[t.trackID],
                        })
                      )
                  : n.push(t)
                : r[t.trackID] &&
                  n.push(
                    Object.assign(Object.assign({}, t), { level: r[t.trackID] })
                  );
            this.volumeIndicatorHistory.push(n),
              4 === this.volumeIndicatorHistory.length &&
                (this.emit(
                  "volume-indicator",
                  n
                    .filter((e) => !e.muted)
                    .map((e) => ({
                      trackID: e.trackID,
                      userID: e.userID,
                      level: e.level,
                    }))
                ),
                (this.volumeIndicatorHistory = []));
          }
        }, 500));
    }
    startMediaRelay(t) {
      return pe(this, void 0, void 0, function* () {
        if (this.roomState !== Ns.Connected)
          throw Yi("no signaling model, please run joinRoomWithToken first");
        if (this._mode === e.QNClientMode.RTC)
          throw co(
            "no permission. only BROADCASTER in LIVE mode has permission to media relay"
          );
        if (this._role === e.QNClientRole.AUDIENCE)
          throw uo(
            "no permission. only BROADCASTER in LIVE mode has permission to media relay"
          );
        try {
          const e = yield Promise.all(
              t.destRoomInfos.map((e) =>
                pe(this, void 0, void 0, function* () {
                  const t = xo(e.roomToken),
                    r = yield as(t, e.roomToken, this.config.requestTimeout);
                  return {
                    roomName: e.roomName,
                    playerId: t.userId,
                    token: r.relayToken,
                  };
                })
              )
            ),
            r = yield this.signaling.request("start-media-relay", {
              destinationInfos: e.reduce(
                (e, t) =>
                  Object.assign(Object.assign({}, e), {
                    [t.roomName]: Object.assign({}, t),
                  }),
                {}
              ),
            });
          if (
            (Xi.addEvent("StartMediaRelay", {
              result_code: r.code,
              destination_infos: e.map((e) => ({
                room_name: e.roomName,
                room_token: e.token,
                uid: e.playerId,
              })),
            }),
            0 !== r.code)
          )
            throw Ro(r.code, r.error);
          const n = r.status;
          return Object.keys(n).reduce(
            (e, t) => Object.assign(Object.assign({}, e), { [t]: n[t].state }),
            {}
          );
        } catch (e) {
          throw e instanceof Ji
            ? e
            : Yi(e instanceof Error ? e.message : String(e));
        }
      });
    }
    updateMediaRelay(t) {
      return pe(this, void 0, void 0, function* () {
        if (this.roomState !== Ns.Connected)
          throw Yi("no signaling model, please run joinRoomWithToken first");
        if (this._mode === e.QNClientMode.RTC)
          throw co(
            "no permission. only BROADCASTER in LIVE mode has permission to media relay"
          );
        if (this._role === e.QNClientRole.AUDIENCE)
          throw uo(
            "no permission. only BROADCASTER in LIVE mode has permission to media relay"
          );
        try {
          const e = yield Promise.all(
              t.destRoomInfos.map((e) =>
                pe(this, void 0, void 0, function* () {
                  const t = xo(e.roomToken),
                    r = yield as(t, e.roomToken, this.config.requestTimeout);
                  return {
                    roomName: e.roomName,
                    playerId: t.userId,
                    token: r.relayToken,
                  };
                })
              )
            ),
            r = yield this.signaling.request("update-media-relay", {
              destinationInfos: e.reduce(
                (e, t) =>
                  Object.assign(Object.assign({}, e), {
                    [t.roomName]: Object.assign({}, t),
                  }),
                {}
              ),
            });
          if (
            (Xi.addEvent("UpdateMediaRelay", {
              result_code: r.code,
              destination_infos: e.map((e) => ({
                room_name: e.roomName,
                room_token: e.token,
                uid: e.playerId,
              })),
            }),
            0 !== r.code)
          )
            throw Ro(r.code, r.error);
          const n = r.status;
          return Object.keys(n).reduce(
            (e, t) => Object.assign(Object.assign({}, e), { [t]: n[t].state }),
            {}
          );
        } catch (e) {
          throw e instanceof Ji
            ? e
            : Yi(e instanceof Error ? e.message : String(e));
        }
      });
    }
    stopMediaRelay() {
      return pe(this, void 0, void 0, function* () {
        if (this.roomState !== Ns.Connected)
          throw Yi("no signaling model, please run joinRoomWithToken first");
        if (this._mode === e.QNClientMode.RTC)
          throw co(
            "no permission. only BROADCASTER in LIVE mode has permission to media relay"
          );
        if (this._role === e.QNClientRole.AUDIENCE)
          throw uo(
            "no permission. only BROADCASTER in LIVE mode has permission to media relay"
          );
        try {
          const e = yield this.signaling.request("stop-media-relay", {});
          if (
            (Xi.addEvent("StopMediaRelay", { result_code: e.code }),
            0 !== e.code)
          )
            throw Ro(e.code, e.error);
          const t = e.status;
          return Object.keys(t).reduce(
            (e, r) => Object.assign(Object.assign({}, e), { [r]: t[r].state }),
            {}
          );
        } catch (e) {
          throw e instanceof Ji
            ? e
            : Yi(e instanceof Error ? e.message : String(e));
        }
      });
    }
  }
  class Bs extends Ls {
    get mergeStreamTracks() {
      return this.defaultMergeJobTracks;
    }
    get mergeStreamJobTracks() {
      return this.mergeJobTracks;
    }
    constructor(e) {
      super(e),
        (this.isAudioMastered = !1),
        (this.isVideoMastered = !1),
        (this.sessionMode = "track"),
        Xi.addEvent("Init", {
          id: "".concat(this.sessionMode, "_").concat(Date.now()),
        });
    }
    join(e, t) {
      return pe(this, void 0, void 0, function* () {
        return yield this.joinRoomWithToken(e, t);
      });
    }
    leave() {
      this.leaveRoom(),
        (this.isAudioMastered = !1),
        (this.isVideoMastered = !1);
    }
    publish(e) {
      return pe(this, void 0, void 0, function* () {
        const t = this.isAudioMastered,
          r = this.isVideoMastered;
        for (const t of e)
          "audio" === t.info.kind &&
            (this.isAudioMastered
              ? t.setMaster(!1)
              : (t.setMaster(!0), (this.isAudioMastered = !0))),
            "video" === t.info.kind &&
              (this.isVideoMastered
                ? t.setMaster(!1)
                : (t.setMaster(!0), (this.isVideoMastered = !0)));
        try {
          return yield this._publish(e);
        } catch (e) {
          throw ((this.isAudioMastered = t), (this.isVideoMastered = r), e);
        }
      });
    }
    unpublish(e) {
      return pe(this, void 0, void 0, function* () {
        const t = yield this._unpublish(e);
        return (
          (this.isAudioMastered = this.publishedTracks.some(
            (e) => !("audio" !== e.info.kind || !e.master)
          )),
          (this.isVideoMastered = this.publishedTracks.some(
            (e) => !("video" !== e.info.kind || !e.master)
          )),
          t
        );
      });
    }
    subscribe(e) {
      let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
        r = arguments.length > 2 ? arguments[2] : void 0;
      return pe(this, void 0, void 0, function* () {
        return yield this._subscribe(e, !1, t, r);
      });
    }
    unsubscribe(e) {
      return pe(this, void 0, void 0, function* () {
        return yield this._unsubscribe(e);
      });
    }
    setProfile(e, t) {
      this._setProfile(e, t);
    }
    setReconnectTimes(e) {
      this._setReconnectTimes(e);
    }
    getReconnectTimes() {
      return this._getReconnectTimes();
    }
    muteTracks(e) {
      this._muteTracks(e);
    }
    addMergeStreamTracks(e, t) {
      return pe(this, void 0, void 0, function* () {
        yield this._addMergeTracks(e, t);
      });
    }
    removeMergeStreamTracks(e, t) {
      return pe(this, void 0, void 0, function* () {
        yield this._removeMergeTracks(e, t);
      });
    }
    stopMergeStream(e) {
      this._stopMerge(e);
    }
    filterSignalTracks() {}
    releaseSession() {}
  }
  const Gs = "fk6fk2rnb",
    Hs = "https://api-demo.qnsdk.com",
    js = "/v1",
    Fs = (e, t, r) =>
      "/rtc/token/app/".concat(r, "/room/").concat(e, "/user/").concat(t);
  function Vs() {
    return pe(this, void 0, void 0, function* () {
      he.log("start checkSystemRequirements");
      const t = Date.now();
      let r = !1,
        n = "";
      const i = new Bs(xs),
        o = new Bs(xs),
        a = yield (function () {
          return pe(this, void 0, void 0, function* () {
            let e = "unknow";
            try {
              e = yield Wi();
            } catch (e) {}
            return e + "_" + Fo(8);
          });
        })();
      let s,
        c,
        d,
        u = -1,
        l = -1,
        A = -1,
        h = -1,
        f = -1;
      try {
        const e = yield Xs.getLocalTracks({
          video: { enabled: !0 },
          audio: { enabled: !0 },
        });
        if (
          ((d = e.find((e) => "video" === e.info.kind)),
          (c = e.find((e) => "audio" === e.info.kind)),
          void 0 === d || void 0 === c)
        )
          throw Yi("getLocalTracks failed.");
        const t = (e, t) =>
          new Promise((r, n) => {
            (function (e, t) {
              return pe(this, void 0, void 0, function* () {
                const r = "".concat(Hs).concat(js).concat(Fs(e, t, Gs));
                try {
                  let e;
                  if ("AbortController" in window) {
                    const t = new AbortController();
                    setTimeout(() => t.abort(), 5e3),
                      (e = yield fetch(r, {
                        signal: t.signal,
                        headers: { "Content-Type": "application/json" },
                      }));
                  } else e = yield fetch(r, { headers: { "Content-Type": "application/json" } });
                  if (!e.ok) throw new Error(e.statusText);
                  return e.text();
                } catch (e) {
                  throw e;
                }
              });
            })(a, e)
              .then((e) => t.joinRoomWithToken(e))
              .then(r)
              .catch(n);
          });
        yield Promise.all([t("userA", i), t("userB", o)]);
        const n = (e) =>
          new Promise((t, r) => {
            e.trackInfoList.length > 0
              ? e
                  .subscribe(e.trackInfoList.map((e) => e.trackID))
                  .then(t)
                  .catch(r)
              : e.on("track-add", (n) => {
                  e.subscribe(n.map((e) => e.trackID))
                    .then(t)
                    .catch(r);
                });
          });
        yield Promise.all([i.publish([d]), o.publish([c]), n(i), n(o)]);
        const p = [],
          m = [],
          g = [],
          v = [],
          T = [],
          b = 30;
        let S = 0;
        yield new Promise((e) => {
          s = setInterval(() => {
            const t = i.publishedTracks[0].getStats(),
              r = o.publishedTracks[0].getStats();
            t.length > 0 &&
              r.length > 0 &&
              c &&
              (p.push(t[0].rtt),
              m.push(t[0].packetLossRate),
              g.push(r[0].bitrate),
              v.push(t[0].bitrate),
              T.push(c.getCurrentVolumeLevel())),
              p.length > 15 && (clearInterval(s), e()),
              S > b &&
                (he.warning(
                  "abnormal track stats: less than 15 valid stats in 30s"
                ),
                clearInterval(s),
                e()),
              (S += 1);
          }, 1e3);
        }),
          he.log(
            JSON.stringify({
              detailTestResult: {
                rtts: p,
                packetLossRates: m,
                audioBitrates: g,
                videoBitrates: v,
                volumnLevels: T,
              },
            })
          ),
          p.length > 0 &&
            ((u = Math.ceil(p.reduce((e, t) => e + t, 0) / p.length)),
            (l = m.reduce((e, t) => e + t, 0) / m.length),
            (A = g.reduce((e, t) => e + t, 0) / g.length),
            (h = v.reduce((e, t) => e + t, 0) / v.length),
            (f = T.reduce((e, t) => e + t, 0) / T.length)),
          (r = !0);
      } catch (e) {
        (r = !1),
          (n =
            "string" == typeof e
              ? e
              : e instanceof Ji
              ? JSON.stringify(e)
              : e instanceof Error
              ? e.message
              : "");
      } finally {
        return (
          i.roomState === Ns.Connected &&
            (yield i.unpublish(i.publishedTracks.map((e) => e.info.trackID)),
            i.leaveRoom()),
          o.roomState === Ns.Connected &&
            (yield o.unpublish(o.publishedTracks.map((e) => e.info.trackID)),
            o.leaveRoom()),
          d && d.release(),
          c && c.release(),
          clearTimeout(undefined),
          clearInterval(s),
          Xi.addEvent(
            "SystemRequirementsTest",
            {
              room_name: a,
              ok: r,
              reason: n,
              avg_rtt: u,
              avg_packet_loss_rate: l,
              avg_volumn_level: f,
              avg_audio_bitrate: A,
              avg_video_bitrate: h,
              test_take_time: Date.now() - t,
              event_grade: r ? e.QNEventGrade.NORMAL : e.QNEventGrade.SERVERE,
            },
            !0
          ),
          {
            roomName: a,
            ok: r,
            reason: n,
            avgRTT: u,
            avgPacketLossRate: l,
            avgVolumnLevel: f,
            avgAudioBitrate: A,
            avgVideoBitrate: h,
          }
        );
      }
    });
  }
  class Us extends _s {
    constructor(t, r) {
      if (!Ti.mediaStreamDest)
        throw eo("your browser does not support audio buffer input!");
      const n = new ks();
      n.initAudioContext(),
        t instanceof AudioBuffer
          ? (n.setAudioBufferSource(), n.setAudioBuffer(t))
          : t instanceof HTMLAudioElement && n.setMediaElementSource(t);
      super(n.audioStream.stream.getTracks()[0], r, "local"),
        (this.sourceType = e.TrackSourceType.EXTERNAL),
        (this.isLoop = !1),
        (this.originSource = t),
        (this.audioManager = n),
        this.handleAudioManagerEvents();
    }
    setLoop(e) {
      (this.isLoop = e), this.audioManager.setAudioSourceLoop(e);
    }
    startAudioSource() {
      this.audioManager.playAudioSource();
    }
    pauseAudioSource() {
      this.audioManager.pauseAudioSource();
    }
    resumeAudioSource() {
      this.audioManager.resumeAudioSource();
    }
    stopAudioSource() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      this.audioManager.stopAudioSource(!1, e);
    }
    getCurrentTime() {
      return this.audioManager.getAudioSourceCurrentTime() || 0;
    }
    setCurrentTime(e) {
      this.audioManager.setAudioSourceCurrentTime(e);
    }
    getDuration() {
      return this.audioManager.getAudioSourceDuration() || 0;
    }
    handleAudioManagerEvents() {
      this.audioManager.on("@audio-source-state-change", (e, t) => {
        this.emit("audio-state-change", e, t);
      });
    }
  }
  class qs extends le {
    get audioSourceIsLoop() {
      return this._audioTrack instanceof Us && this._audioTrack.isLoop;
    }
    constructor(e) {
      let t =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : "send",
        r = arguments.length > 2 ? arguments[2] : void 0;
      super(),
        (this.trackList = []),
        (this.isDestroyed = !1),
        (this.enableAudio = !0),
        (this.enableVideo = !0),
        (this.muteAudio = !1),
        (this.muteVideo = !1),
        (this.onAudioEnded = (e) => {
          this.emit("audio-ended", e);
        }),
        (this.onVideoEnded = (e) => {
          this.emit("video-ended", e);
        }),
        (this.onAudioSourceStateChange = (e, t) => {
          this.emit("audio-source-state-change", e, t);
        }),
        (this.direction = t),
        (this.userID = r),
        e.forEach((e) => {
          e.setMaster(!0),
            e.on("mute", () => {
              this.updateTrackState();
            }),
            e.on("release", () => {
              ge(this.trackList, (t) => t === e),
                this.updateTrackState(),
                0 === this.trackList.length && this.release();
            }),
            this.trackList.push(e);
        }),
        this.updateTrackState();
    }
    setVolume(e) {
      this._audioTrack && this._audioTrack.setVolume(e);
    }
    play(e, t) {
      this.trackList.forEach((r) => r.play(e, t)),
        this._audioTrack && (this.audio = this._audioTrack.mediaElement),
        this._videoTrack && (this.video = this._videoTrack.mediaElement);
    }
    getCurrentTimeDomainData() {
      return this._audioTrack
        ? this._audioTrack.getCurrentTimeDomainData()
        : new Uint8Array(0);
    }
    getCurrentFrequencyData() {
      return this._audioTrack
        ? this._audioTrack.getCurrentFrequencyData()
        : new Uint8Array(0);
    }
    getCurrentVolumeLevel() {
      return this._audioTrack ? this._audioTrack.getCurrentVolumeLevel() : 0;
    }
    getStats() {
      let e = ra();
      if (this._audioTrack) {
        const t = this._audioTrack.getStats();
        t.length > 0 && (e = t[0]);
      }
      let t = ra();
      if (this._videoTrack) {
        const e = this._videoTrack.getStats();
        e.length > 0 && (t = e[0]);
      }
      return {
        timestamp: Date.now(),
        videoBitrate: t.bitrate,
        audioBitrate: e.bitrate,
        videoPacketLoss: t.packetLoss,
        audioPacketLoss: e.packetLoss,
        videoPackets: t.packets,
        audioPackets: e.packets,
        videoPacketLossRate: t.packetLossRate,
        audioPacketLossRate: e.packetLossRate,
        videoBytes: t.bytes,
        audioBytes: e.bytes,
        pctype: this.direction,
      };
    }
    getCurrentFrameDataURL() {
      return this._videoTrack
        ? this._videoTrack.getCurrentFrameDataURL()
        : "data:,";
    }
    setAudioSourceLoop(e) {
      this._audioTrack instanceof Us && this._audioTrack.setLoop(e);
    }
    startAudioSource() {
      this._audioTrack instanceof Us && this._audioTrack.startAudioSource();
    }
    pauseAudioSource() {
      this._audioTrack instanceof Us && this._audioTrack.pauseAudioSource();
    }
    resumeAudioSource() {
      this._audioTrack instanceof Us && this._audioTrack.resumeAudioSource();
    }
    stopAudioSource() {
      this._audioTrack instanceof Us && this._audioTrack.stopAudioSource();
    }
    getAudioSourceCurrentTime() {
      return this._audioTrack instanceof Us
        ? this._audioTrack.getCurrentTime()
        : 0;
    }
    getAudioSourceDuration() {
      return this._audioTrack instanceof Us
        ? this._audioTrack.getDuration()
        : 0;
    }
    setAudioSourceCurrentTime(e) {
      if (this._audioTrack instanceof Us)
        return this._audioTrack.setCurrentTime(e);
    }
    setKbps(e, t) {
      e && this._videoTrack && this._videoTrack.setKbps(e),
        t && this._audioTrack && this._audioTrack.setKbps(t);
    }
    updateTrackState() {
      this.trackList.forEach((e) => {
        "audio" === e.info.kind
          ? (this._audioTrack &&
              (this._audioTrack.off("ended", this.onAudioEnded),
              this._audioTrack.off(
                "audio-state-change",
                this.onAudioSourceStateChange
              )),
            (this.audioTrack = e.mediaTrack),
            (this._audioTrack = e),
            this._audioTrack.on("ended", this.onAudioEnded),
            this._audioTrack instanceof Us &&
              this._audioTrack.on(
                "audio-state-change",
                this.onAudioSourceStateChange
              ))
          : (this._videoTrack &&
              this._videoTrack.off("ended", this.onVideoEnded),
            (this.videoTrack = e.mediaTrack),
            (this._videoTrack = e),
            this._videoTrack.on("ended", this.onVideoEnded));
      }),
        this.audioTrack
          ? ((this.enableAudio = !0),
            (this.muteAudio = !this.audioTrack.enabled))
          : (this.enableAudio = !1),
        this.videoTrack
          ? ((this.enableVideo = !0),
            (this.muteVideo = !this.videoTrack.enabled))
          : (this.enableVideo = !1);
    }
    release() {
      if (!this.isDestroyed) {
        for (let e = 0; e < this.trackList.length; e += 1) {
          const t = this.trackList[e];
          t.removeAllListeners("release"), t.release();
        }
        (this.trackList = []),
          (this.isDestroyed = !0),
          this.emit("release"),
          this.removeAllListeners();
      }
    }
    releaseTrack(e) {
      const { removeElement: t, newArray: r } = (function (e, t, r) {
        const n = [];
        let i = null;
        for (let o = 0; o < e.length; o += 1)
          e[o][t] !== r ? n.push(e[o]) : (i = e[o]);
        return { removeElement: i, newArray: n };
      })(this.trackList, "mediaTrack", e.mediaTrack);
      t &&
        (e.release(),
        (this.trackList = r),
        0 === this.trackList.length && (this.isDestroyed = !0));
    }
  }
  var Qs;
  !(function (e) {
    function t(e) {
      let t =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : "anonymous",
        r = arguments.length > 2 ? arguments[2] : void 0,
        n = arguments.length > 3 ? arguments[3] : void 0;
      return pe(this, void 0, void 0, function* () {
        return new Promise((i, o) => {
          const a = document.createElement("audio");
          a.addEventListener("error", () => {
            o(mo());
          });
          const s = () => {
            a.removeEventListener("canplay", s);
            const e = new Us(a);
            n && e.setKbps(n), e.setInfo({ tag: r }), i(e);
          };
          a.addEventListener("canplay", s),
            (a.preload = "auto"),
            (a.src = e),
            a.load(),
            (a.crossOrigin = t);
        });
      });
    }
    function r(e, t, r) {
      return new Promise((n, o) => {
        const a = new FileReader();
        (a.onload = (e) => {
          i(e.target.result)
            .then((e) => {
              const i = new Us(e);
              r && i.setKbps(r), i.setInfo({ tag: t }), n(i);
            })
            .catch(() => {
              o(mo());
            });
        }),
          a.readAsArrayBuffer(e);
      });
    }
    function n(e, t, r) {
      const n = new Us(e);
      return r && n.setKbps(r), n.setInfo({ tag: t }), n;
    }
    function i(e) {
      return pe(this, void 0, void 0, function* () {
        "suspended" === Ts.state && (yield Ts.resume());
        return yield new Promise((t, r) => {
          Ts.decodeAudioData(
            e,
            (e) => {
              t(e);
            },
            (e) => {
              r(io(e));
            }
          );
        });
      });
    }
    (e.createAudioTrackFromURL = t),
      (e.createAudioTrackFromFile = r),
      (e.createAudioTrackFromBuffer = n),
      (e.createAudioTrackFromSource = function (e, i, o) {
        return pe(this, void 0, void 0, function* () {
          return e instanceof File
            ? yield r(e, i, o)
            : e instanceof AudioBuffer
            ? n(e, i, o)
            : "string" == typeof e
            ? yield t(e, "anonymous", i, o)
            : Promise.reject(mo());
        });
      }),
      (e.decodeAudioData = i);
  })(Qs || (Qs = {}));
  const Ws = { audio: { enabled: !0 }, video: { enabled: !0, bitrate: 600 } };
  function zs(e, t) {
    "video" === e.kind &&
      ("contentHint" in e
        ? ((e.contentHint = t),
          e.contentHint !== t && he.warning("invalid optimizationMode ", t))
        : he.warning("optimizationMode not support in this browser"));
  }
  const Xs = new (class extends le {
    constructor() {
      super(),
        (this.deviceMap = {}),
        Ti.support &&
          (this.updateDeivceInfo(),
          Ti.ondevicechange
            ? navigator.mediaDevices.addEventListener("devicechange", () => {
                this.updateDeivceInfo();
              })
            : window.setInterval(this.updateDeivceInfo.bind(this), 1e3));
    }
    getDeviceInfo(e, t) {
      return pe(this, void 0, void 0, function* () {
        if (!e) {
          const e = { audio: !1, video: !1 };
          switch (t) {
            case "all":
              (e.audio = !0), (e.video = !0);
              break;
            case "cameras":
              e.video = !0;
              break;
            case "microphones":
            case "playback":
              e.audio = !0;
          }
          try {
            const t = yield navigator.mediaDevices.getUserMedia(e);
            this.updateDeivceInfo();
            const r = t.getTracks();
            for (let e = 0; e < r.length; e++) r[e].stop();
          } catch (e) {
            throw "NotAllowedError" === e.name ? no("") : e;
          }
        }
        if (!this.deviceInfo) return [];
        switch (t) {
          case "all":
            return this.deviceInfo;
          case "cameras":
            return this.deviceInfo.filter((e) => "videoinput" === e.kind);
          case "microphones":
            return this.deviceInfo.filter((e) => "audioinput" === e.kind);
          case "playback":
            return this.deviceInfo.filter((e) => "audiooutput" === e.kind);
        }
      });
    }
    getElectronScreenSources(t) {
      return pe(this, void 0, void 0, function* () {
        let r;
        try {
          const { ipcRenderer: e } = window.require("electron");
          r = {
            getSources: (t) =>
              e.invoke("QNRTC_DESKTOP_CAPTURER_GET_SOURCES", t),
          };
        } catch (e) {
          throw (he.warning(e), ao(e instanceof Error ? e.message : String(e)));
        }
        let n = { types: [], thumbnailSize: { width: 150, height: 150 } };
        switch (t) {
          case void 0:
          case e.QNElectronScreenSourceType.ALL:
            n.types.push("window", "screen");
            break;
          case e.QNElectronScreenSourceType.SCREEN:
            n.types.push("screen");
            break;
          case e.QNElectronScreenSourceType.WINDOW:
            n.types.push("window");
        }
        try {
          return (yield r.getSources(n)).map((e) => ({
            ID: e.id,
            name: e.name,
            url: e.thumbnail.toDataURL(),
          }));
        } catch (e) {
          throw (
            (he.warning(e),
            Yi(
              "Electron getSources error, ".concat(
                e instanceof Error ? e.message : String(e)
              )
            ))
          );
        }
      });
    }
    createElectronScreenTrack() {
      let e =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      return pe(this, void 0, void 0, function* () {
        let t, r;
        if (
          (!0 === e.audio &&
            (t = {
              audio: { mandatory: { chromeMediaSource: "desktop" } },
              video: { mandatory: { chromeMediaSource: "desktop" } },
            }),
          e.sourceID)
        )
          t = {
            video: {
              mandatory: {
                chromeMediaSourceId: e.sourceID,
                chromeMediaSource: "desktop",
              },
            },
          };
        else {
          const e = yield this.getElectronScreenSources();
          if (0 === e.length) return [];
          const r = yield (function (e) {
            return pe(this, void 0, void 0, function* () {
              return new Promise((t, r) => {
                const n = document.createElement("div");
                n.setAttribute(
                  "style",
                  "position: fixed; z-index: 99999999; top: 50%; left: 50%; width: 620px; height: 525px; background: #ECECEC; border-radius: 4px; -webkit-transform: translate(-50%,-50%); transform: translate(-50%,-50%);"
                );
                const i = document.createElement("div");
                i.setAttribute(
                  "style",
                  "text-align: center; height: 25px; line-height: 25px; border-radius: 4px 4px 0 0; background: #D4D2D4; border-bottom:  solid 1px #B9B8B9;"
                ),
                  (i.innerText = "share screen");
                const o = document.createElement("div");
                o.setAttribute(
                  "style",
                  "width: 100%; height: 500px; padding: 15px 25px ; box-sizing: border-box;"
                ),
                  n.appendChild(i),
                  n.appendChild(o);
                const a = document.createElement("div");
                a.setAttribute("style", "height: 12%;"),
                  (a.innerText =
                    "QiNiu Web Screensharing wants to share the contents. Choose what you'd like to share.");
                const s = document.createElement("div");
                s.setAttribute(
                  "style",
                  "width: 100%; height: 80%; background: #FFF; border:  solid 1px #CBCBCB; display: flex; flex-wrap: wrap; justify-content: space-around; overflow-y: scroll; padding: 0 15px; box-sizing: border-box;"
                );
                const c = document.createElement("button");
                c.setAttribute("style", "width: 85px;"),
                  (c.innerText = "cancel"),
                  (c.onclick = () => {
                    document.body.removeChild(n),
                      r(no("user cancel selection"));
                  });
                const d = document.createElement("div");
                d.setAttribute("style", "text-align: right; padding: 16px 0;"),
                  d.appendChild(c),
                  o.appendChild(a),
                  o.appendChild(s),
                  o.appendChild(d);
                for (const r of e) {
                  const e = document.createElement("div");
                  e.setAttribute(
                    "style",
                    "width: 30%; height: 160px; padding: 20px 0; text-align: center;box-sizing: content-box;"
                  ),
                    (e.onclick = () => {
                      document.body.removeChild(n), t(r.ID);
                    });
                  const i = document.createElement("div");
                  i.setAttribute(
                    "style",
                    "height: 120px; display: table-cell; vertical-align: middle;"
                  );
                  const o = document.createElement("img");
                  o.setAttribute(
                    "style",
                    "width: 100%; background: #333333; box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);"
                  ),
                    (o.src = r.url),
                    i.appendChild(o);
                  const a = document.createElement("div");
                  a.setAttribute(
                    "style",
                    "height: 40px; line-height: 40px; display: inline-block; width: 70%; word-break: keep-all; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                  ),
                    (a.innerText = r.name),
                    e.appendChild(i),
                    e.appendChild(a),
                    s.appendChild(e);
                }
                document.body.appendChild(n);
              });
            });
          })(e);
          t = {
            video: {
              mandatory: {
                chromeMediaSourceId: r,
                chromeMediaSource: "desktop",
              },
            },
          };
        }
        e.width && ((t.video.maxWidth = e.width), (t.video.minWidth = e.width)),
          e.height &&
            ((t.video.maxHeight = e.height), (t.video.minHeight = e.height));
        try {
          he.log("electron getUserMedia constraints: ", t),
            (r = yield navigator.mediaDevices.getUserMedia(t));
        } catch (e) {
          throw Yi(
            "Electron getUserMedia error, "
              .concat(e instanceof Error ? e.message : "", ", config: ")
              .concat(JSON.stringify(t))
          );
        }
        let n = [];
        for (const t of r.getTracks())
          "audio" === t.kind
            ? n.push(La(t, e.audioTag, e.bitrate))
            : (e.optimizationMode && zs(t, e.optimizationMode),
              n.push(La(t, e.tag, e.bitrate)));
        return n;
      });
    }
    getLocalTracks() {
      let t =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Ws;
      return pe(this, void 0, void 0, function* () {
        if ((he.debug("get local tracks", t), be(t) && Te(t))) {
          const e = { screen: t.screen },
            r = { video: t.video, audio: t.audio },
            n = yield Promise.all([
              this.getLocalTracks(e),
              this.getLocalTracks(r),
            ]);
          return n[0].concat(n[1]);
        }
        const r = yield (function (e) {
          return pe(this, void 0, void 0, function* () {
            if (!e) return { audio: !0, video: !0 };
            if (be(e)) {
              if (Te(e))
                throw Yi(
                  "can not get mediaStream with video and screen are all enabled"
                );
              if (!Ti.screenSharing)
                throw eo("your browser can not share screen");
              const t = e.screen;
              if (
                li &&
                (t.forceChromePlugin || !Ti.getDisplayMedia) &&
                !(yield ya())
              )
                throw ro("");
            }
            const t = !(!e.audio || !e.audio.enabled || e.audio.source) && {
                deviceId: e.audio.deviceId,
                sampleRate: e.audio.sampleRate,
                sampleSize: e.audio.sampleSize,
                channelCount: e.audio.channelCount,
                autoGainControl: e.audio.autoGainControl,
                echoCancellation: e.audio.echoCancellation,
                noiseSuppression: e.audio.noiseSuppression,
              },
              r = !(!e.video || !e.video.enabled) && {
                frameRate: e.video.frameRate,
                height: e.video.height,
                width: e.video.width,
                deviceId: e.video.deviceId,
                facingMode: e.video.facingMode,
              };
            if (be(e) && e.screen) {
              if (Ti.getDisplayMedia && !e.screen.forceChromePlugin)
                return Ga({
                  audio: t,
                  video: {
                    displaySurface: Ba(e.screen.source),
                    width: e.screen.width,
                    height: e.screen.height,
                    frameRate: e.screen.frameRate,
                  },
                });
              const r = yield ka(!1, e.screen);
              return Ga({ audio: t, video: r });
            }
            return Ga({ audio: t, video: r });
          });
        })(t);
        let n, i, o, a, s;
        r.video &&
          "object" == typeof r.video &&
          r.video.deviceId &&
          Xi.addEvent("DeviceChanged", {
            type: 0,
            desc: r.video.deviceId,
            event_grade: e.QNEventGrade.GENERAL,
            event_category: e.QNEventCategory.VIDEO,
          }),
          r.audio &&
            "object" == typeof r.audio &&
            r.audio.deviceId &&
            Xi.addEvent("DeviceChanged", {
              type: 1,
              desc: r.audio.deviceId,
              event_grade: e.QNEventGrade.GENERAL,
              event_category: e.QNEventCategory.AUDIO,
            });
        try {
          n = yield this.getUserMedia(t, r, !0);
        } catch (e) {
          throw "NotAllowedError" === e.name ? no("") : e;
        }
        ve(t) && ((o = t.audio.bitrate), (s = t.audio.tag)),
          be(t) &&
            ((i = t.screen.bitrate),
            (a = t.screen.tag),
            (s = t.screen.audioTag)),
          Te(t) && ((i = t.video.bitrate), (a = t.video.tag));
        const c = n ? n.getTracks() : [],
          d = [];
        for (const e of c) {
          let r;
          t.video && t.video.optimizationMode && (r = t.video.optimizationMode),
            t.screen &&
              t.screen.optimizationMode &&
              (r = t.screen.optimizationMode),
            r && zs(e, r);
        }
        for (const e of c) {
          let t;
          (t = "audio" === e.kind ? La(e, s, o) : La(e, a, i)), d.push(t);
        }
        if (t.audio && t.audio.source) {
          const e = yield Qs.createAudioTrackFromSource(t.audio.source, s, o);
          d.push(e);
        }
        return this.updateDeivceInfo(), d;
      });
    }
    getLocalStream(e) {
      return pe(this, void 0, void 0, function* () {
        if (e && be(e) && Te(e))
          throw Yi("can not get local stream with video and screen");
        const t = yield this.getLocalTracks(e);
        return new qs(t, "send");
      });
    }
    getUserMedia(e, t) {
      let r =
        !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
      return pe(this, void 0, void 0, function* () {
        if (
          (he.debug("request to get user media, config", e),
          he.debug("request to get user media, constraints", t),
          !t.audio && !t.video)
        )
          return null;
        let n;
        if (be(e)) n = yield this.getDisplayMedia(t, e);
        else if (
          ((n = yield navigator.mediaDevices.getUserMedia(t)),
          !fi && "getSettings" in MediaStreamTrack.prototype && r)
        ) {
          const r = t.video;
          if (r && "boolean" != typeof r) {
            const i = r.width,
              o = r.height;
            if ("number" == typeof i && "number" == typeof o) {
              const a = n.getVideoTracks(),
                s = a && a[0],
                { height: c = o, width: d = i } = s.getSettings();
              if (d && c) {
                const a = (o - c) * (i - d);
                if (a * a > 10) {
                  const a = o / i;
                  return (
                    c / d < a
                      ? ((r.height = c), (r.width = c / a))
                      : ((r.width = d), (r.height = d * a)),
                    he.debug(
                      "justified constraint constraintHeight, contraintWidth, constraintRatio, screenHeight, screenWidth:",
                      o,
                      i,
                      a,
                      c,
                      d,
                      r
                    ),
                    n.getTracks().forEach((e) => e.stop()),
                    this.getUserMedia(
                      e,
                      Object.assign(Object.assign({}, t), { video: r }),
                      !1
                    )
                  );
                }
              }
            }
          }
        }
        return n;
      });
    }
    getDisplayMedia(e, t) {
      return pe(this, void 0, void 0, function* () {
        let r, n;
        e.audio &&
          (r = yield navigator.mediaDevices.getUserMedia({ audio: e.audio }));
        const i =
          t.screen && t.screen.audio && !e.audio
            ? { video: e.video, audio: t.screen.audio }
            : { video: e.video };
        return (
          (n =
            Ti.getDisplayMedia && t.screen && !t.screen.forceChromePlugin
              ? yield navigator.mediaDevices.getDisplayMedia(i)
              : yield navigator.mediaDevices.getUserMedia(i)),
          r && n.addTrack(r.getAudioTracks()[0]),
          n
        );
      });
    }
    updateDeivceInfo() {
      return pe(this, void 0, void 0, function* () {
        this.deviceInfo = yield navigator.mediaDevices.enumerateDevices();
        const t = this.deviceInfo.map((e) => e.deviceId),
          r = Object.keys(this.deviceMap);
        let n = !1;
        r.forEach((r) => {
          if (-1 === t.indexOf(r) && "@default" !== r) {
            this.emit("device-remove", this.deviceMap[r].device);
            const t = this.deviceMap[r].device;
            this.emit("device-changed", {
              device: t,
              state: e.QNDeviceState.INACTIVE,
            });
            const i =
                "audioinput" === t.kind || "audiooutput" === t.kind
                  ? "AudioDeviceInOut"
                  : "VideoDeviceInOut",
              o =
                "AudioDeviceInOut" === i
                  ? e.QNEventCategory.AUDIO
                  : e.QNEventCategory.VIDEO;
            Xi.addEvent(i, {
              device_type: "audiooutput" === t.kind ? 1 : 0,
              device_state: 0,
              device_label: t.label,
              device_id: t.deviceId,
              device_info: t.label,
              event_grade: e.QNEventGrade.GENERAL,
              event_category: o,
            }),
              delete this.deviceMap[r],
              (n = !0);
          } else this.deviceMap[r].tick += 1;
        }),
          t.forEach((t, i) => {
            if (-1 === r.indexOf(t) && "@default" !== t) {
              this.deviceMap[t] = { device: this.deviceInfo[i], tick: 0 };
              const r = this.deviceMap[t].device;
              this.emit("device-changed", {
                device: r,
                state: e.QNDeviceState.ACTIVE,
              }),
                this.emit("device-add", r);
              const o =
                  "audioinput" === r.kind || "audiooutput" === r.kind
                    ? "AudioDeviceInOut"
                    : "VideoDeviceInOut",
                a =
                  "AudioDeviceInOut" === o
                    ? e.QNEventCategory.AUDIO
                    : e.QNEventCategory.VIDEO;
              Xi.addEvent(o, {
                device_type: "audiooutput" === r.kind ? 1 : 0,
                device_state: 1,
                device_label: r.label,
                device_id: r.deviceId,
                event_grade: e.QNEventGrade.GENERAL,
                event_category: a,
              }),
                (n = !0);
            }
          }),
          n && this.emit("device-update", this.deviceInfo);
      });
    }
  })();
  class Ks {
    constructor(t, r) {
      (this.networkQuality = e.QNNetworkQuality.UNKNOWN),
        (this._client = t),
        (this._user = r),
        (this.userID = r.userID),
        (this.userData = r.userData);
    }
    getVideoTracks() {
      let e = [];
      for (let t of this._client._remoteTracks)
        t.isVideo() && t.userID === this.userID && e.push(t);
      return e;
    }
    getAudioTracks() {
      let e = [];
      for (let t of this._client._remoteTracks)
        t.isAudio() && t.userID === this.userID && e.push(t);
      return e;
    }
  }
  class Js extends le {
    constructor() {
      super(...arguments), (this._isMuted = !1);
    }
    eventNames() {
      return super.eventNames();
    }
    get mediaElement() {
      return this._track && this._track.mediaElement;
    }
    get track() {
      return this._track;
    }
    set track(e) {
      e &&
        ((this._track = e),
        this._track.on("ended", () => {
          Ds.emit("trackEnded", e.mediaTrack.id);
        }),
        this._track.on("audioBuffer", (t) => {
          Ds.emit("audioBuffer", t, e.mediaTrack.id);
        }),
        (this.trackID = this._track.info.trackID),
        (this.userID = this._track.info.userID),
        (this.tag = this._track.info.tag),
        (this._kind = this._track.info.kind),
        (this._isMuted = !!this._track.info.muted));
    }
    play(e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      return this._track
        ? "boolean" == typeof t
          ? this._track.play(e, t, {})
          : this._track.play(e, void 0, t)
        : Promise.reject();
    }
    isAudio() {
      return "audio" === this._kind;
    }
    isVideo() {
      return "video" === this._kind;
    }
    isMuted() {
      return this._isMuted;
    }
    getMediaStreamTrack() {
      return this.track ? this.track.mediaTrack : void 0;
    }
  }
  class Zs extends Js {
    constructor(e) {
      super(),
        (this._isSubScribed = !1),
        (this.uplinkStats = { uplinkRTT: 0, uplinkLostRate: 0 }),
        (this._kind = e.kind),
        (this.trackID = e.trackID),
        (this.userID = e.userID),
        (this.tag = e.tag),
        Ds.on("remote-track-stats", (e) => {
          for (let t of e)
            t.trackID === this.trackID &&
              ((this.uplinkStats.uplinkLostRate = t.packetLossRate),
              (this.uplinkStats.uplinkRTT = t.rtt));
        }),
        Ds.on("mute-tracks", (e) => {
          for (const t of e)
            t.trackID === this.trackID &&
              ((this._isMuted = t.muted),
              this.emit("mute-state-changed", t.muted));
        });
    }
    isSubscribed() {
      return this._isSubScribed;
    }
  }
  class Ys extends Zs {
    constructor(t) {
      super(t),
        (this.isMultiProfileEnabled = !1),
        (this.isLowStreamEnabled = !1),
        (this.profile = e.QNTrackProfile.HIGH),
        t.profiles.length > 0 &&
          ((this.isMultiProfileEnabled = !0), (this.isLowStreamEnabled = !0)),
        Ds.on("sub-profile-changed", (t, r) => {
          if (t === this.trackID)
            switch (r) {
              case "high":
                (this.profile = e.QNTrackProfile.HIGH),
                  this.emit("profile-changed", e.QNTrackProfile.HIGH),
                  this.emit("low-stream-state-changed", !1);
                break;
              case "medium":
                (this.profile = e.QNTrackProfile.MEDIUM),
                  this.emit("profile-changed", e.QNTrackProfile.MEDIUM);
                break;
              case "low":
                (this.profile = e.QNTrackProfile.LOW),
                  this.emit("profile-changed", e.QNTrackProfile.LOW),
                  this.emit("low-stream-state-changed", !0);
            }
        });
    }
    setProfile(e) {
      Ds.emit("set-profile", this.trackID, e);
    }
    setLowStream(t) {
      if (!this.isLowStreamEnabled)
        throw Yi(
          "isLowStreamEnabled is false, do not setLowStream on normal track"
        );
      const r = t ? e.QNTrackProfile.LOW : e.QNTrackProfile.HIGH;
      Ds.emit("set-profile", this.trackID, r);
    }
    getCurrentFrameData() {
      return this._track ? this._track.getCurrentFrameDataURL() : "data:,";
    }
    getStats() {
      const e = {
        downlinkFrameRate: 0,
        downlinkBitrate: 0,
        downlinkLostRate: 0,
        uplinkRTT: 0,
        uplinkLostRate: 0,
      };
      if (!this._track) return e;
      const t = this._track.getStats();
      return (
        0 === t.length ||
          ((e.downlinkBitrate = t[0].bitrate),
          (e.downlinkFrameRate = t[0].frameRate),
          (e.downlinkLostRate = t[0].packetLossRate),
          (e.uplinkLostRate = this.uplinkStats.uplinkLostRate),
          (e.uplinkRTT = this.uplinkStats.uplinkRTT),
          this.isMultiProfileEnabled && (e.profile = this.profile)),
        e
      );
    }
  }
  class $s extends Zs {
    constructor(e) {
      super(e),
        Ds.on("audioBuffer", (e, t) => {
          this._track &&
            t === this._track.mediaTrack.id &&
            this.emit("audioFrame", e);
        });
    }
    setVolume(e) {
      this.track && this.track.setVolume(e);
    }
    getVolumeLevel() {
      if (this.track) return this.track.getCurrentVolumeLevel();
    }
    getCurrentTimeDomainData() {
      if (this.track) return this.track.getCurrentTimeDomainData();
    }
    getCurrentFrequencyDomainData() {
      if (this.track) return this.track.getCurrentFrequencyData();
    }
    setPlaybackDevice(e) {
      return pe(this, void 0, void 0, function* () {
        if (this.track) return this.track.setPlaybackDevice(e);
      });
    }
    getStats() {
      const e = {
        downlinkBitrate: 0,
        downlinkLostRate: 0,
        uplinkRTT: 0,
        uplinkLostRate: 0,
      };
      if (!this._track) return e;
      const t = this._track.getStats();
      return (
        0 === t.length ||
          ((e.downlinkBitrate = t[0].bitrate),
          (e.downlinkLostRate = t[0].packetLossRate),
          (e.uplinkLostRate = this.uplinkStats.uplinkLostRate),
          (e.uplinkRTT = this.uplinkStats.uplinkRTT)),
        e
      );
    }
  }
  class ec {
    constructor(e, t) {
      (this.dbName = e), (this.storeConfigs = t), (this.db = void 0);
    }
    getDB() {
      return pe(this, void 0, void 0, function* () {
        return null != this.db
          ? this.db
          : new Promise((e) => {
              const t = indexedDB.open(this.dbName);
              t.addEventListener("upgradeneeded", () => {
                for (const e of this.storeConfigs) {
                  const r = t.result.createObjectStore(e.name);
                  for (const t of e.indexes) r.createIndex(t.name, t.keyPath);
                }
              }),
                e(rc(t));
            });
      });
    }
    get(e, t) {
      return pe(this, void 0, void 0, function* () {
        return rc(
          (yield this.getDB()).transaction(e, "readonly").objectStore(e).get(t)
        );
      });
    }
    getAll(e) {
      return pe(this, void 0, void 0, function* () {
        return rc(
          (yield this.getDB())
            .transaction(e, "readonly")
            .objectStore(e)
            .getAll()
        );
      });
    }
    count(e) {
      return pe(this, void 0, void 0, function* () {
        return rc(
          (yield this.getDB()).transaction(e, "readonly").objectStore(e).count()
        );
      });
    }
    set(e, t, r) {
      return pe(this, void 0, void 0, function* () {
        const n = (yield this.getDB()).transaction(e, "readwrite");
        return n.objectStore(e).put(r, t), nc(n);
      });
    }
    remove(e, t) {
      return pe(this, void 0, void 0, function* () {
        const r = (yield this.getDB()).transaction(e, "readwrite");
        return r.objectStore(e).delete(t), nc(r);
      });
    }
    removeRange(e, t, r) {
      return pe(this, void 0, void 0, function* () {
        let n = 0;
        const i = (yield this.getDB())
          .transaction(e, "readwrite")
          .objectStore(e)
          .openCursor(void 0, "next");
        return new Promise((e, o) => {
          i.addEventListener("error", () => o(new tc(i.error))),
            i.addEventListener("success", () =>
              pe(this, void 0, void 0, function* () {
                const o = i.result;
                null == o || n >= r
                  ? e()
                  : (n >= t && n < r && (yield rc(o.delete())),
                    ++n,
                    o.continue());
              })
            );
        });
      });
    }
    clear() {
      return pe(this, void 0, void 0, function* () {
        const e = yield this.getDB();
        yield Promise.all(
          this.storeConfigs.map((t) => {
            let { name: r } = t;
            const n = e.transaction(r, "readwrite");
            return n.objectStore(r).clear(), nc(n);
          })
        );
      });
    }
    dispose() {
      this.db && this.db.close();
    }
  }
  class tc extends Error {
    constructor(e) {
      super(e + ""), (this.cause = e), (this.name = "IndexedDBError");
    }
  }
  function rc(e) {
    return new Promise((t, r) => {
      e.addEventListener("success", () => t(e.result)),
        e.addEventListener("error", () => r(new tc(e.error)));
    });
  }
  function nc(e) {
    return new Promise((t, r) => {
      e.addEventListener("complete", () => t()),
        e.addEventListener("error", () => r(new tc(e.error))),
        e.addEventListener("abort", () => r(new tc(e.error)));
    });
  }
  const ic = "log",
    oc = "https://upload.qiniup.com";
  var ac;
  !(function (e) {
    (e[(e.Err_Fetch_Token = 25001)] = "Err_Fetch_Token"),
      (e[(e.Err_Read_File = 25002)] = "Err_Read_File");
  })(ac || (ac = {}));
  const sc = { name: ic, indexes: [] };
  const cc = new (class {
    constructor() {
      (this.taskq = new bi("log", !1)),
        (this.useLog = !1),
        (this.db = new ec("qnwebrtc/dc/v1", [sc])),
        this.initLogQueue();
    }
    setLogConfig(e) {
      (this.useLog = !0),
        (this.config = Object.assign(Object.assign({}, e), {
          maxCount: e.maxCount > 3e3 ? 3e3 : e.maxCount,
        }));
    }
    uploadLog(e) {
      return pe(this, void 0, void 0, function* () {
        if (this.useLog)
          return new Promise((t) => {
            this.taskq.push("uploadLog", { token: e, resolve: t });
          });
      });
    }
    _uploadLog(e) {
      let { token: t, resolve: r } = e;
      return pe(this, void 0, void 0, function* () {
        let e;
        try {
          e = yield this.db.getAll(ic);
        } catch (e) {
          return { code: ac.Err_Read_File };
        }
        const n = e.map(
            (e) => e.map((e) => JSON.stringify(e)).join(" ") + "\n"
          ),
          i = [];
        let o = 0;
        for (let e = n.length - 1; e >= 0 && o + n[e].length <= 10485760; e--)
          (o += n[e].length), i.unshift(n[e]);
        const a = new Blob(i, { type: "text/plain;charset=utf-8" }),
          s = new File([a], "log.text", { type: "text/plain" });
        let c;
        if (void 0 === t)
          try {
            c = (yield Xo("/v4/sdk/log/upload/token")).uploadToken;
          } catch (e) {
            return { code: ac.Err_Fetch_Token };
          }
        else c = t;
        const d = Rc._clients.map((e) => e.userID).join("_"),
          u = yield Wi(),
          l = new FormData();
        l.append("action", oc),
          l.append(
            "key",
            "QNLog_"
              .concat(Date.now(), "_")
              .concat(this.config.tag, "_")
              .concat(u, "_")
              .concat(d)
          ),
          l.append("token", c),
          l.append("file", s);
        try {
          const e = yield fetch(oc, { method: "POST", body: l });
          200 === e.status && (yield this.db.clear()), r({ code: e.status });
        } catch (e) {
          r({ code: -1 });
        }
      });
    }
    addLog(e, t) {
      if (!this.useLog) return;
      const r = [e, ...t].map((e) => this.pretty(e, 2));
      this.taskq.push("add", r);
    }
    _addLog(e) {
      return pe(this, void 0, void 0, function* () {
        (yield this.db.count(ic)) >= this.config.maxCount &&
          (yield this.db.removeRange(ic, 0, 1));
        const t = e;
        yield this.db.set(ic, Date.now().toString(), t);
      });
    }
    initLogQueue() {
      this.taskq.on("exec", (e, t) => {
        switch (e.method) {
          case "add":
            return void (t.promise = this._addLog(e.data));
          case "uploadLog":
            return void (t.promise = this._uploadLog(e.data));
        }
      });
    }
    pretty(e, t) {
      const r = (e) =>
        e
          ? "function" == typeof e || "object" == typeof e
            ? "[native code]"
            : e.toString()
          : "";
      if ("object" == typeof e) {
        const n = {};
        for (let i in e)
          0 === t
            ? (n[i] = r(e[i]))
            : "object" == typeof e[i]
            ? (n[i] = this.pretty(e[i], t - 1))
            : (n[i] = r(e[i]));
        return n;
      }
      return e;
    }
  })();
  class dc extends le {
    constructor(t) {
      super(),
        (this.readyUploadLog = !1),
        (this.connectionState = e.QNConnectionState.DISCONNECTED),
        (this._localTracks = []),
        (this._remoteTracks = []),
        (this._disconnectedInfo = { code: 0 }),
        (this.remoteUsers = []),
        (this.session = new Bs(t)),
        this.session.on("refresh-track-info", (e) => {
          for (let t of e)
            this._localTracks.forEach((e) => {
              e._track &&
                e._track.mediaTrack.id === t.localid &&
                (e.trackID = t.trackid);
            });
        }),
        this.session.on("user-join", (e) => {
          const t = new Ks(this, e);
          this.remoteUsers.push(t),
            this.emit("user-joined", e.userID, e.userData);
        }),
        this.session.on("user-leave", (e) => {
          (this.remoteUsers = this.remoteUsers.filter(
            (t) => t.userID !== e.userID
          )),
            this.emit("user-left", e.userID);
        }),
        this.session.on("track-add", (e) => {
          if (0 === e.length) return;
          const t = e.map((e) => ("audio" === e.kind ? new $s(e) : new Ys(e)));
          this._remoteTracks.push(...t);
          const r = $n(t, (e) => e.userID);
          Object.entries(r).forEach((e) => {
            let [t, r] = e;
            this.emit("user-published", t, r);
          });
        }),
        this.session.on("track-remove", (e) => {
          if (0 === e.length) return;
          const t = e[0].userID,
            r = new Set();
          for (const t of e) r.add(t.trackID);
          let n = [],
            i = [];
          for (const e of this._remoteTracks)
            r.has(e.trackID) ? n.push(e) : i.push(e);
          (this._remoteTracks = i), this.emit("user-unpublished", t, n);
        }),
        this.session.on("mute-tracks", (e) => {
          0 !== e.length && Ds.emit("mute-tracks", e);
        }),
        Ds.on("set-mute-tracks", (e, t, r) => {
          if (r === this.getClientKey())
            this.session.muteTracks([{ trackID: e, muted: t }]);
          else if ("" === r)
            throw Yi("can not setMuted，please publish track first");
        }),
        this.session.on("room-state-change", (t) => {
          switch (t) {
            case Ns.Idle:
              this.connectionState = e.QNConnectionState.DISCONNECTED;
              break;
            case Ns.Connecting:
              this.connectionState = e.QNConnectionState.CONNECTING;
              break;
            case Ns.Reconnecting:
              this.connectionState = e.QNConnectionState.RECONNECTING;
              break;
            case Ns.Connected:
              this.connectionState =
                this.connectionState === e.QNConnectionState.CONNECTING
                  ? e.QNConnectionState.CONNECTED
                  : e.QNConnectionState.RECONNECTED;
              break;
            default:
              he.warning("Invalid roomState: ", t);
          }
          if (this.connectionState === e.QNConnectionState.DISCONNECTED) {
            let t;
            switch (this._disconnectedInfo.code) {
              case 0:
                t = e.QNConnectionDisconnectedReason.LEAVE;
                break;
              case 10006:
                t = e.QNConnectionDisconnectedReason.KICKED_OUT;
                break;
              default:
                t = e.QNConnectionDisconnectedReason.ERROR;
            }
            let r = { reason: t };
            if (t === e.QNConnectionDisconnectedReason.ERROR)
              switch (
                ((r.errorCode = this._disconnectedInfo.code), r.errorCode)
              ) {
                case 10001:
                  r.errorMessage = "token 错误";
                  break;
                case 10002:
                  r.errorMessage = "token 过期";
                  break;
                case 10004:
                  r.errorMessage = "reconnect token 过期";
                  break;
                case 10007:
                  r.errorMessage = "断线重连失败";
                  break;
                case 10022:
                  r.errorMessage = "该用户在其他页面或终端登录";
                  break;
                case 10011:
                  r.errorMessage = "房间人数已满";
                  break;
                case 10012:
                  r.errorMessage = "房间已关闭";
                  break;
                default:
                  r.errorMessage = "unexpected error";
              }
            this.release(),
              this.emit("connection-state-changed", this.connectionState, r);
          } else this.emit("connection-state-changed", this.connectionState);
        }),
        this.session.on("messages-received", (e) => {
          for (let t of e) {
            const e = {
              ID: t.msgid,
              userID: t.userID,
              content: t.data,
              timestamp: t.timestamp,
            };
            this.emit("message-received", e);
          }
        }),
        this.session.on("media-relay-state-changed", (e, t) => {
          this.emit("media-relay-state-changed", e, t);
        }),
        this.session.on("remote-user-reconnecting", (e) => {
          this.emit("user-reconnecting", e.userID);
        }),
        this.session.on("remote-user-reconnected", (e) => {
          this.emit("user-reconnected", e.userID);
        }),
        this.session.on("forward-job-connected", (t) => {
          this.emit(
            "direct-livestreaming-state-changed",
            t.jobId,
            e.QNLiveStreamingState.STARTED
          );
        }),
        this.session.on("forward-job-disconnected", (t) => {
          this.emit(
            "direct-livestreaming-state-changed",
            t.jobId,
            e.QNLiveStreamingState.STOPPED
          );
        }),
        this.session.on("merge-job-connected", (t) => {
          this.emit(
            "transcoding-livestreaming-state-changed",
            t.jobId,
            e.QNLiveStreamingState.STARTED
          );
        }),
        this.session.on("merge-job-disconnected", (t) => {
          this.emit(
            "transcoding-livestreaming-state-changed",
            t.jobId,
            e.QNLiveStreamingState.STOPPED
          );
        }),
        this.session.on("command", (e) => {
          if ("upload-log" === e.command)
            try {
              const t = JSON.parse(e.content);
              t.auto_upload_log &&
                1 === t.auto_upload_log &&
                (this.readyUploadLog = !0);
            } catch (e) {}
        }),
        this.session.on("disconnect", (e) => {
          this._disconnectedInfo = e;
        }),
        this.session.on("on-sub-profile-changed", (e) => {
          Ds.emit("sub-profile-changed", e.trackid, e.profile);
        }),
        this.session.on("volume-indicator", (e) => {
          this.emit("volume-indicator", e);
        }),
        Ds.on("remote-track-stats", (t) => {
          for (let r of t) {
            const t = this.remoteUsers.filter((e) => e.userID === r.userID)[0];
            if (!t) return;
            switch (r.networkGrade) {
              case e.NetworkGrade.INVALID:
                t.networkQuality = e.QNNetworkQuality.UNKNOWN;
                break;
              case e.NetworkGrade.POOR:
                t.networkQuality = e.QNNetworkQuality.POOR;
                break;
              case e.NetworkGrade.FAIR:
                t.networkQuality = e.QNNetworkQuality.FAIR;
                break;
              case e.NetworkGrade.GOOD:
                t.networkQuality = e.QNNetworkQuality.GOOD;
                break;
              case e.NetworkGrade.EXCELLENT:
                t.networkQuality = e.QNNetworkQuality.EXCELLENT;
                break;
              default:
                he.warning("unkonw network grade: ", r.networkGrade);
            }
          }
        }),
        Ds.on("set-profile", (t, r) => {
          switch (r) {
            case e.QNTrackProfile.HIGH:
              this.session.setProfile(t, "high");
              break;
            case e.QNTrackProfile.MEDIUM:
              this.session.setProfile(t, "medium");
              break;
            case e.QNTrackProfile.LOW:
              this.session.setProfile(t, "low");
          }
        }),
        Ds.on("setMediaStreamTrack", (e, t, r, n, i) => {
          if (r === this.getClientKey())
            this.session.replaceTrack(e, t).then(n).catch(i);
          else if ("" === r)
            throw Yi("can not setMediaStreamTrack，please publish track first");
        });
    }
    set config(e) {
      (this.session.config = e),
        this.setTransportPolicy(e.transportPolicy),
        e.simulcast && (this.session.simulcast = e.simulcast),
        e.reconnectTimes && this.session.setReconnectTimes(e.reconnectTimes),
        e.requestTimeout && this.session.setRequestTimeout(e.requestTimeout);
    }
    setTransportPolicy(e) {
      this.session.config.transportPolicy = e;
    }
    get userID() {
      return this.session.userID;
    }
    get userData() {
      return this.session.userData;
    }
    get roomName() {
      return this.session.roomName;
    }
    getRemoteUser(e) {
      return this.remoteUsers.find((t) => t.userID === e);
    }
    setClientMode(e) {
      return pe(this, void 0, void 0, function* () {
        this.session.setClientMode(e);
      });
    }
    setClientRole(e) {
      return pe(this, void 0, void 0, function* () {
        yield this.session.setClientRole(e);
      });
    }
    join(e, t) {
      return pe(this, void 0, void 0, function* () {
        yield this.session.joinRoomWithToken(e, t);
        const r = localStorage.getItem("QNConfig");
        if (r)
          try {
            const e = JSON.parse(r).find(
              (e) =>
                e.appid === this.session.appId &&
                e.userid === this.session.userID
            );
            e && "1" === e.auto_upload_log && (this.readyUploadLog = !0);
          } catch (e) {}
        const n = "".concat(hi.name, " ").concat(hi.version),
          i = yield Wi(),
          o = hi.os,
          a = this.session.appId,
          s = this.session.userID;
        try {
          const e = yield Xo(
              "/v4/sdk/config?platform=Web&appid="
                .concat(a, "&osversion=")
                .concat(o, "&device_model=")
                .concat(n, "&device_name=")
                .concat(i, "&user_id=")
                .concat(s)
            ),
            t = {};
          if (
            (e.content
              .split(";")
              .filter((e) => e)
              .forEach((e) => {
                const r = e.split(":");
                t[r[0]] = r[1];
              }),
            a && (t.appid = a),
            s && (t.userid = s),
            r)
          ) {
            const e = JSON.parse(r),
              n = e.findIndex(
                (e) => e.appid === t.appid && e.userid === t.userid
              );
            n > -1 ? (e[n] = t) : e.push(t),
              localStorage.setItem("QNConfig", JSON.stringify(e));
          } else localStorage.setItem("QNConfig", JSON.stringify([t]));
        } catch (e) {
          he.warning(e);
        }
      });
    }
    leave() {
      return pe(this, void 0, void 0, function* () {
        yield Promise.resolve().then(() => this.session.leave()),
          this.release(),
          this.readyUploadLog &&
            setTimeout(
              () =>
                pe(this, void 0, void 0, function* () {
                  yield cc.uploadLog(), (this.readyUploadLog = !1);
                }),
              0
            );
      });
    }
    release() {
      (this._localTracks = []),
        (this._remoteTracks = []),
        (this._disconnectedInfo = { code: 0 }),
        (this.remoteUsers = []);
    }
    publish(e) {
      return pe(this, void 0, void 0, function* () {
        if (Array.isArray(e)) {
          e.find((e) => e.isVideo()) &&
            (this.session.simulcast = !!e
              .filter((e) => e.isVideo())
              .find((e) => e.isMultiProfileEnabled)),
            yield this.session.publish(e.map((e) => e.track));
          for (const t of e)
            (t.trackID = t.track.info.trackID),
              (t.userID = this.session.userID),
              (t.client = this.getClientKey());
          this._localTracks.push(...e);
        } else e.isVideo() && e.isMultiProfileEnabled && (this.session.config.simulcast = !0), yield this.session.publish([e.track]), (e.trackID = e.track.info.trackID), (e.userID = this.session.userID), (e.client = this.getClientKey()), this._localTracks.push(e);
      });
    }
    getClientKey() {
      return Zn(
        ""
          .concat(this.roomName ? this.roomName : "")
          .concat(this.userID ? this.userID : "")
          .concat(this.session.appId ? this.session.appId : "")
      );
    }
    unpublish(e) {
      return pe(this, void 0, void 0, function* () {
        if (Array.isArray(e)) {
          if (
            this._localTracks.filter((t) => e.includes(t)).length !== e.length
          )
            throw Yi("target tracks has not published");
          yield this.session.unpublish(e.map((e) => e.trackID)),
            (this._localTracks = this._localTracks.filter(
              (t) => !e.includes(t)
            ));
        } else {
          if (!this._localTracks.includes(e))
            throw Yi("target tracks has not published");
          yield this.session.unpublish([e.trackID]),
            (this._localTracks = this._localTracks.filter((t) => t !== e));
        }
      });
    }
    subscribe(e) {
      return pe(this, void 0, void 0, function* () {
        let t;
        if (Array.isArray(e)) {
          t = yield this.session.subscribe(e.map((e) => e.trackID));
          let r = [],
            n = [];
          for (let i of t) {
            const t = e.filter((e) => e.trackID === i.info.trackID);
            if (0 === t.length) continue;
            const o = t[0];
            (o.track = i),
              (o._isSubScribed = !0),
              "audio" === i.info.kind ? n.push(o) : r.push(o);
          }
          return { audioTracks: n, videoTracks: r };
        }
        if (((t = yield this.session.subscribe([e.trackID])), t.length > 0)) {
          const r = t[0];
          return (
            (e.track = r),
            (e._isSubScribed = !0),
            "audio" === r.info.kind
              ? { videoTracks: [], audioTracks: [e] }
              : { audioTracks: [], videoTracks: [e] }
          );
        }
        return { audioTracks: [], videoTracks: [] };
      });
    }
    unsubscribe(e) {
      return pe(this, void 0, void 0, function* () {
        Array.isArray(e)
          ? (yield this.session.unsubscribe(e.map((e) => e.trackID)),
            e.forEach((e) => {
              e._isSubScribed = !1;
            }))
          : (yield this.session.unsubscribe([e.trackID]),
            (e._isSubScribed = !1));
      });
    }
    sendMessage(e, t, r) {
      return pe(this, void 0, void 0, function* () {
        if ("string" != typeof e)
          throw Yi(
            "messageID should be type of string, receive type ".concat(typeof e)
          );
        if ("string" != typeof t)
          throw Yi(
            "message should be type of string, receive type ".concat(typeof t)
          );
        Array.isArray(r)
          ? yield Promise.resolve().then(() =>
              this.session.sendCustomMessage(
                t,
                r.map((e) => e.userID),
                e
              )
            )
          : yield Promise.resolve().then(() =>
              this.session.sendCustomMessage(t, [], e)
            );
      });
    }
    startDirectLiveStreaming(e) {
      return pe(this, void 0, void 0, function* () {
        if (null == e.audioTrack && null == e.videoTrack)
          throw Zi("No track provided. Please check the parameter.");
        yield this.session.createForwardJob(
          Go({
            userConfigExtraInfo: e.userConfigExtraInfo,
            jobId: e.streamID,
            publishUrl: e.url,
            audioTrackId: e.audioTrack && e.audioTrack.trackID,
            videoTrackId: e.videoTrack && e.videoTrack.trackID,
          })
        );
      });
    }
    stopDirectLiveStreaming(e) {
      return pe(this, void 0, void 0, function* () {
        yield this.session.stopForwardJob(e);
      });
    }
    startTranscodingLiveStreaming(e) {
      return pe(this, void 0, void 0, function* () {
        yield this.session.createMergeJob(
          e.streamID,
          Go({
            publishUrl: e.url,
            height: e.height,
            width: e.width,
            fps: e.videoFrameRate,
            kbps: e.bitrate,
            stretchMode: e.renderMode,
            watermarks:
              e.watermarks &&
              e.watermarks.map((e) => ({
                x: e.x,
                y: e.y,
                w: e.width,
                h: e.height,
                url: e.url,
              })),
            background: e.background && {
              x: e.background.x,
              y: e.background.y,
              w: e.background.width,
              h: e.background.height,
              url: e.background.url,
            },
            maxRate: e.maxBitrate,
            minRate: e.minBitrate,
            holdLastFrame: e.holdLastFrame,
          })
        ),
          e.transcodingTracks &&
            (yield this.setTranscodingLiveStreamingTracks(
              e.streamID,
              e.transcodingTracks
            ));
      });
    }
    stopTranscodingLiveStreaming(e) {
      return pe(this, void 0, void 0, function* () {
        yield this.session.stopMergeStream(e);
      });
    }
    setTranscodingLiveStreamingTracks(e, t) {
      return pe(this, void 0, void 0, function* () {
        const r = t.map((e) =>
          Go({
            trackID: e.trackID,
            x: e.x,
            y: e.y,
            w: e.width,
            h: e.height,
            z: e.zOrder,
            stretchMode: e.renderMode,
          })
        );
        e
          ? yield this.session.addMergeStreamTracks(r, e)
          : yield this.session.addMergeStreamTracks(r);
      });
    }
    removeTranscodingLiveStreamingTracks(e, t) {
      return pe(this, void 0, void 0, function* () {
        e
          ? yield this.session.removeMergeStreamTracks(
              t.map((e) => e.trackID),
              e
            )
          : yield this.session.removeMergeStreamTracks(t.map((e) => e.trackID));
      });
    }
    getNetworkQuality() {
      let t = e.QNNetworkQuality.UNKNOWN;
      const r = this._localTracks.reduce(
        (e, t) =>
          t.track
            ? [...e, ...t.track.getStats().map((e) => e.networkGrade)]
            : [...e],
        []
      );
      return r.includes(e.NetworkGrade.POOR)
        ? ((t = e.QNNetworkQuality.POOR), t)
        : r.includes(e.NetworkGrade.FAIR)
        ? ((t = e.QNNetworkQuality.FAIR), t)
        : r.includes(e.NetworkGrade.GOOD)
        ? ((t = e.QNNetworkQuality.GOOD), t)
        : r.includes(e.NetworkGrade.EXCELLENT)
        ? ((t = e.QNNetworkQuality.EXCELLENT), t)
        : t;
    }
    getUserNetworkQuality(t) {
      let r = e.QNNetworkQuality.UNKNOWN;
      const n = this.remoteUsers.filter((e) => e.userID === t)[0];
      return n
        ? ((r = n.networkQuality), r)
        : (he.warning("cannot find userID: ", t), r);
    }
    enableAudioVolumeIndicator() {
      this.session.registerVolumeIndicatorEvent();
    }
    kickOutUser(e) {
      return pe(this, void 0, void 0, function* () {
        this.remoteUsers.find((t) => t.userID === e)
          ? yield this.session.kickoutUser(e)
          : he.warning("cannot find userID: ", e);
      });
    }
    startMediaRelay(e) {
      return pe(this, void 0, void 0, function* () {
        return this.session.startMediaRelay(e);
      });
    }
    updateMediaRelay(e) {
      return pe(this, void 0, void 0, function* () {
        return this.session.updateMediaRelay(e);
      });
    }
    stopMediaRelay() {
      return pe(this, void 0, void 0, function* () {
        return this.session.stopMediaRelay();
      });
    }
  }
  class uc extends Js {
    constructor(e) {
      super(),
        (this.track = e),
        (this.client = ""),
        Ds.on("trackEnded", (e) => {
          this._track && e === this._track.mediaTrack.id && this.emit("ended");
        });
    }
    setMuted(e) {
      (this._isMuted = e),
        Ds.emit("set-mute-tracks", this.trackID, e, this.client);
    }
    destroy() {
      this.track && this.track.release();
    }
  }
  class lc extends uc {
    constructor(e) {
      super(e), (this.isMultiProfileEnabled = !1);
    }
    getLowStreamConfig() {
      if (this._track) return this._track.lowStreamConfig;
    }
    getCurrentFrameData() {
      return this._track ? this._track.getCurrentFrameDataURL() : "data:,";
    }
    getStats() {
      if (!this._track) return [];
      let t = this._track.getStats();
      if (0 === t.length) return [];
      if (1 === t.length) {
        return t.map((e) => ({
          uplinkBitrate: e.bitrate,
          uplinkFrameRate: e.frameRate,
          uplinkLostRate: e.packetLossRate,
          uplinkRTT: e.rtt,
        }));
      }
      {
        t = t
          .filter((e) => 0 !== e.bitrate)
          .sort((e, t) => e.bitrate - t.bitrate);
        const r = t.map((e) => ({
          uplinkBitrate: e.bitrate,
          uplinkFrameRate: e.frameRate,
          uplinkLostRate: e.packetLossRate,
          uplinkRTT: e.rtt,
        }));
        return (
          r[0] && (r[0].profile = e.QNTrackProfile.LOW),
          r[1] && (r[1].profile = e.QNTrackProfile.MEDIUM),
          r[2] && (r[2].profile = e.QNTrackProfile.HIGH),
          2 == r.length &&
            r[1].profile === e.QNTrackProfile.MEDIUM &&
            (r[1].profile = e.QNTrackProfile.HIGH),
          r
        );
      }
    }
    setOptimizationMode(e) {
      if (!this._track) return !1;
      const t = this._track.mediaTrack;
      return "contentHint" in t && ((t.contentHint = e), t.contentHint === e);
    }
  }
  class Ac extends lc {
    get facingMode() {
      var e;
      return null === (e = this._track) || void 0 === e
        ? void 0
        : e.mediaTrack.getSettings().facingMode;
    }
    constructor(e) {
      super(e);
    }
    setMuted(e) {
      if (Ic)
        throw Yi(
          "iOS 15.1 mute interface causes Safari crash, please upgrade to iOS 15.2+"
        );
      super.setMuted(e);
    }
    play(e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      var r;
      return (
        "object" == typeof t && void 0 === t.mirror && (t.mirror = !0),
        he.debug(
          "cam play:",
          t,
          null === (r = this.track) || void 0 === r
            ? void 0
            : r.mediaTrack.getSettings()
        ),
        super.play(e, t)
      );
    }
    switchCamera(e) {
      var t;
      return pe(this, void 0, void 0, function* () {
        if (this.track) {
          const r = {
            settings: this.track.mediaTrack.getSettings(),
            constraints: this.track.mediaTrack.getConstraints(),
          };
          let n = this.track.mediaTrack.getConstraints();
          if ("string" == typeof e) {
            const t = e;
            delete n.facingMode, (n.deviceId = { exact: t });
          } else if ("object" == typeof e)
            n = Object.assign(Object.assign({}, n), e);
          else {
            if (void 0 !== e)
              return void he.error(
                this,
                "invalid argument calling `switchCamera` with arg: ",
                e
              );
            delete n.deviceId,
              (n.facingMode =
                "user" === this.facingMode ? "environment" : "user");
          }
          const i =
            null === (t = this.track.mediaElement) || void 0 === t
              ? void 0
              : t.srcObject;
          i instanceof MediaStream &&
            ((this.track.mediaElement.style.display = "none"),
            i.getTracks().forEach((e) => {
              e.stop(), i.removeTrack(e);
            }));
          const o = Object.assign({}, n);
          he.debug("switching camera with new constraints", o);
          const a = 3;
          let s = 0;
          for (;;)
            try {
              const e = (yield navigator.mediaDevices.getUserMedia({
                  video: o,
                })).getVideoTracks()[0],
                t = {
                  settings: e.getSettings(),
                  constraints: e.getConstraints(),
                };
              he.debug("switchCamera", { before: r, after: t }),
                yield Ds.safeEmitAsPromise(
                  "setMediaStreamTrack",
                  this.trackID,
                  e,
                  this.client
                );
              break;
            } catch (e) {
              if (
                s < a &&
                e instanceof DOMException &&
                "NotFoundError" == e.name
              ) {
                s++,
                  he.debug(
                    "retrying switching camera (".concat(s, "/").concat(a, ")")
                  ),
                  yield Vo(300);
                continue;
              }
              throw e;
            }
        }
      });
    }
  }
  class hc extends _s {
    constructor(t) {
      const r = Ts.createMediaStreamDestination();
      super(r.stream.getAudioTracks()[0], t, "local"),
        (this.sourceType = e.TrackSourceType.MIXING),
        this.initAudioManager(!0),
        (this.destination = r),
        (this.inputList = []);
    }
    appendAudioSource(e) {
      this.inputList.find((t) => t.track === e)
        ? he.warning("track is already in the track list")
        : (this.inputList.push({ track: e }),
          e.on("ended", () => {
            this.emit("ended");
          }),
          e.audioManager.gainNode.connect(this.destination));
    }
    removeAudioSource(e) {
      const t = this.inputList.find((t) => t.track === e);
      if (t) {
        try {
          t.track.audioManager.gainNode.disconnect(this.destination);
        } catch (e) {}
        ge(this.inputList, (e) => e === t);
      }
    }
    release() {
      for (const e of this.inputList) this.removeAudioSource(e.track);
      super.release();
    }
  }
  class fc extends uc {
    constructor(e) {
      const t = new hc();
      (t.info = e.info),
        t.appendAudioSource(e),
        super(t),
        (this.filterList = []),
        (this.sourceTrack = e),
        (this.outputTrack = t),
        Ds.on("audioBuffer", (t, r) => {
          r === e.mediaTrack.id && this.emit("audioFrame", t);
        });
    }
    addAudioFilter(e) {
      this.filterList.push(e), e.add(this.outputTrack);
    }
    removeAudioFilter(e) {
      e.remove(this.outputTrack);
      const t = this.filterList.findIndex((t) => t === e);
      t >= 0 && this.filterList.splice(t, 1);
    }
    setVolume(e) {
      this.sourceTrack && this.sourceTrack.setVolume(e);
    }
    getVolumeLevel() {
      if (this.track) return this.track.getCurrentVolumeLevel();
    }
    getCurrentTimeDomainData() {
      if (this.track) return this.track.getCurrentTimeDomainData();
    }
    getCurrentFrequencyDomainData() {
      if (this.track) return this.track.getCurrentFrequencyData();
    }
    setPlaybackDevice(e) {
      return pe(this, void 0, void 0, function* () {
        if (this.track) return this.track.setPlaybackDevice(e);
      });
    }
    getStats() {
      const e = { uplinkBitrate: 0, uplinkRTT: 0, uplinkLostRate: 0 };
      if (!this._track) return e;
      const t = this._track.getStats();
      return (
        0 === t.length ||
          ((e.uplinkBitrate = t[0].bitrate),
          (e.uplinkRTT = t[0].rtt),
          (e.uplinkLostRate = t[0].packetLossRate)),
        e
      );
    }
    setEarMonitorEnabled(e) {
      throw new Error("setEarMonitorEnabled not supported.");
    }
    destroy() {
      this.outputTrack.removeAudioSource(this.sourceTrack),
        this.outputTrack.release(),
        this.filterList.forEach((e) => {
          e.remove(this.outputTrack);
        }),
        this.sourceTrack.release();
    }
  }
  class pc {
    constructor() {
      (this.gainNode = Ts.createGain()), this.gainNode.connect(Ts.destination);
    }
    setPlayingVolume(e) {
      this.gainNode.gain.setValueAtTime(e, Ts.currentTime);
    }
    addAudioNode(e) {
      e.connect(this.gainNode);
    }
    removeAudioNode(e) {
      e.disconnect(this.gainNode);
    }
    release() {
      this.gainNode.disconnect();
    }
  }
  class mc extends fc {
    constructor(e) {
      super(e), (this.playbackEngine = new pc()), (this.earMonitorEnable = !1);
    }
    isEarMonitorEnabled() {
      return this.earMonitorEnable;
    }
    setEarMonitorEnabled(e) {
      (this.earMonitorEnable = e),
        this.earMonitorEnable
          ? this.playbackEngine.addAudioNode(
              this.sourceTrack.audioManager.gainNode
            )
          : this.playbackEngine.removeAudioNode(
              this.sourceTrack.audioManager.gainNode
            );
    }
    destroy() {
      super.destroy(), this.playbackEngine.release();
    }
  }
  class gc extends lc {
    constructor(e) {
      super(e);
    }
  }
  class vc extends fc {
    constructor(t, r) {
      super(t),
        (this.rawTrack = t),
        (this.source = r),
        t.on("audio-state-change", (t) => {
          switch (t) {
            case e.AudioSourceState.IDLE:
            case e.AudioSourceState.LOADING:
              return;
            case e.AudioSourceState.PLAY:
              return void this.emit(
                "state-changed",
                e.QNAudioSourceState.PlAYING
              );
            case e.AudioSourceState.PAUSE:
              return void this.emit(
                "state-changed",
                e.QNAudioSourceState.PAUSED
              );
            case e.AudioSourceState.END:
              return void this.emit(
                "state-changed",
                e.QNAudioSourceState.STOPPED
              );
          }
        });
    }
    start(e) {
      return pe(this, void 0, void 0, function* () {
        e && this.rawTrack.setLoop(e), this.rawTrack.startAudioSource();
      });
    }
    stop() {
      this.rawTrack.stopAudioSource();
    }
    resume() {
      this.rawTrack.resumeAudioSource();
    }
    pause() {
      this.rawTrack.pauseAudioSource();
    }
    getDuration() {
      return this.rawTrack.getDuration();
    }
    getCurrentPosition() {
      return this.rawTrack.getCurrentTime();
    }
    seekTo(e) {
      this.rawTrack.setCurrentTime(e);
    }
  }
  class Tc extends fc {
    constructor(e) {
      super(e);
    }
    setMediaStreamTrack(e) {
      return pe(this, void 0, void 0, function* () {
        return Ds.safeEmitAsPromise(
          "setMediaStreamTrack",
          this.trackID,
          e,
          this.client
        );
      });
    }
  }
  class bc extends lc {
    constructor(e) {
      super(e);
    }
    setMediaStreamTrack(e) {
      return pe(this, void 0, void 0, function* () {
        return Ds.safeEmitAsPromise(
          "setMediaStreamTrack",
          this.trackID,
          e,
          this.client
        );
      });
    }
  }
  class Sc extends lc {
    constructor(e, t, r, n) {
      super(e),
        (this.drawImage = () => {
          this.drawImageOnce(), requestAnimationFrame(this.drawImage);
        }),
        (this.drawImageOnce = () => {
          if (this.ctx)
            for (const e of this.canvasSources)
              this.ctx.drawImage(e.source, e.x, e.y, e.width, e.heigth);
        }),
        (this.canvas = t),
        (this.ctx = r),
        this.updateSources(n)
          .then(this.drawImage)
          .catch((e) => {
            he.warning(e);
          });
      const i = new Audio();
      (i.src =
        "data:audio/mpeg;base64,SUQzAwAAAAAfdlRJVDIAAAALAAAB//6wZY+JMpPzl1RQRTEAAAABAAAAVEFMQgAAAAEAAABUWUVSAAAAAQAAAFRDT04AAAABAAAAVFJDSwAAAAEAAABDT01NAAAAHwAAAGVuZwBvbmxpbmUtYXVkaW8tY29udmVydGVyLmNvbQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UMAAAAAAAAAAAAAAAAAAAAAAAEluZm8AAAAPAAAAIQAAG8AADg4OFhYWHh4eJSUlLS0tNDQ0PDw8Q0NDS0tLUlJSWlpaYWFhaWlpcHBweHh4f39/h4eHj4+PlpaWnp6epaWlra2ttLS0vLy8w8PDy8vL0tLS2tra4eHh6enp8PDw+Pj4////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQGkQAAAAAAABvAI9ArKwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+1DEAAPAAAGkAAAAIAAANIAAAAQgUuQ2C0ggHpVv2yykMn99MBkmlkbANsGRtN/9DKn6+WMLYws4Lh4WxkjxRTCyjBeEm3+nZCzjyFLIzIKSqMgLKkIP1kOAiDKPuoPHEJhZAyGA11lGJAQwQrN4Rbybog81Oo5/HL4hDAzMhfDIORCH6sJWPxCHi7OvCHrs+08SyrYcjCunFEIUcF3h+GRk/0ezsbcciMXCMV+nqHuc7pCyQEknfL87AuS5wm9PnAe5Y7Ggvq5YntSi4JZp//tSxF2BAAABpAAAACEAm9fYYKG5sVGC+JNCz/TxyljU6F40ShUKyWObiUFhgEjStZ2CVnUitUbMqIzyCqxoUKH3NoM9MdurRtIOQGCAUMFCSESeQjFxRAgYXbXJF0nVe9uFo28sYY7vaCij0ID9hSkkXuTJaCDJFz8gUSiyxc8sXPLPuoSix9OQOB8P8UEoLx8INHg3fTIDwaLh4YNPIFEl33fQs/pyKfc+yxe8tkLuDJtK//QaH9/82KCiVSikopLdrY0AnUanBzTSVpS9C97/+1LEmwISLPzKLWHhSkMzXxT0objEkfG4QCz4OIieKEYpLmuJkMtc5uJdtmDor6SYLaLLX0raXraxBc+7cAr3hDL0qGSsCBwGZqypjA4ElVUY7GnEmFjhwPID30wHCGbtHoN0Z2QB0OAoDhALxQAnYOxcBA+YMFMbLwgKWUbl2Ifrr24gYTadbLMVv/+Mq24Gp3l3/h86KJLTckkhrKhq26mLTJpLGV7fiEblMVS/XOw9nrQlCwNYepQTYgRNCkqGmA1BWGYwNiGrgoDxJm5IFv/7UsRngFKU9SesMNqKVSCldaex+CXJcyfnSS9gOg3353q5gGIk2prcmlvRauYXkE9NM7dDYEWxIRGycMUtXE9qcRhJr8C1O0lVxpn0Kp/m6zF/wRLtSXM4z1RlXWHEd1DXzWM+UW8Ph44xqf///9YEMAABKDji+CgJAK7SWrtM+kLV3seiQMQh5uzbyxuDKYFdoAcmgOJZwcmBsFRkU1rTIqfKZIOMefJpi0XnywvZJR7aIsFdUXI0PYFFX46ocVsWQNp3kq67hYrZ1+B9jnnr//tSxDCAkd0fJwywccHgHeXxhhlw0cdooYK+gHjEOABLZZgYoYOoha7T6UpF/cNAmHxceFk3G7tDTxQeftfcUR4yLAGNEAABjLIu8PEIvus6sXZI0l/YEcBYAi5TEtDaViW8tUmhow2InK0p77jhdbeL1T/1lDS5pDRoaD1pMZGvVbCaVUagkijWnZZ96+TGDn23cr1MU+dv4fIbSmumc8DLQPKiAURQKMEpsSjzxxZ/7knKQBPNsT9UTwW5ZEgAAAi6EyEFKkWBDVKYCjOtzNz/+1LECwAMaGM7qLzBwYyP57WGGDCVOsqXUqVdqZlalUTFyum6B6yWHxKtfJ102ZWAmRDKgGKm50SkSRURkXbmJQqXCSwIKYJnAmGHJVFP5Rz7zcAIfFk1KXvpt2GxUQOCIwByRMAAFAlSgpAjMNQ8juOgiKhoYJIHB/jdGqTq0yaTTZenn0fTOdih3rwVkZPSk/GucPt+pjheShUIMHrA4BmQ6ecxGPKokxEtyAYL11Oo4YOAIvsHPAVTxpwg482MiPpbRYoCNuRgAEglOCRk4//7UsQFgAu4bT+sMGVBfRZntYSM+HIk6vqeMSCuSkM5F5bEQlk5Ptzp4h0YiQfCQ4LCAJJ66Ay034GEiBh1I8OIcZNrDJ0CtF40XfZPB4TPaTGXgUoPhuzNH7XhK9yydOvhjHxIQ/e0KuNMkAAAAuICRAlnsIdx2ZI+hATsEgUIiAC0abFoVUl4s+KU8Y1KK7EAxKkZHFLy8g0ZoX2HZdiKzaFS7p/jzo4VFLXt1YCQKFLl9KFoSC6AfcK8pQp3ULnCDeovRY8OT+xIBJpKPFQD//tSxAUACtCpQ6YYbIFUj2h1hgw4gD04ikwjCAIbw/nRingHLMRPNKQhE6uZE36qFjtpR42aCmPJUDGvE/BMa9n/9ijarn7LWG7Vbg6MCSCSn2S8UkXut/rOz56xjvQS0rCft+aIbkklAIkPGBmSx3JSwUD8OXEgoGJXMUUHuqmnVxp0WqTG1SmSj6rUNEuDOFqQYVYiPDTnAk2LixIzzwmDyUCKdCYKhEJD4yhWe3HRFaGAC6xVBXdWh0Uk5ZHMBYyEl5SybRFAgQCMIxAtY4f/+1LEDQAKhGlL56RloSqJZzGEmOBohpRiSG2F4Y7OCKCqEH5Z7UjVAZPgJgu0MFD6Xko0XsCIHsOmRuwydoeKKQONTv3OCCSpGAH2FVDlAlZRogBlsDCAQCfCsLoxxm8qVFBGDo8IxS4UIGygImCZNLcvIYCgbEmHAwdMmhdxAcCRsnoKjknVgIkiKLc9GlPo2hquKP/Wis6lAwAQBrN81FlZbkuy0KgqxigfmZl0DCeBofolpYVFMlFI0HJ2SAtf7Y4bQQXbfBhn6Oc/joGPk//7UsQbgApkeTCssGnBUY2pdPSM5BZITGvPiYYSXI7CRsyzKCVjlrVPOFlp9eBRhTcNr/vY3bpFLjPRI1TiGcuWg3BEGTIlJNCwgaBIFTZvolcQhPAShI4USOykeGVnFICwWHg61MSOmQMqQSWYFH0fTowBBNYmIgFL0bVGTRtdbv/f+n6VBUSZJAASRciGgy5liuXZZgbBq4T/QDlEJzRfXkiMwxN01xqHg5g+7BJpjM+v3yescqw+RuInWTjoiKngfCQo0v+zcxQwyX4+ttMy//tSxCWACfBpO6wwxUFLjGgw9Izs+2j1fuDbkrMAVK5HBzgpCdrRIkAdQcSFhcSNBtyo6imj6JdDFDx8SvYEJYXTiAsCEjhoiLkWS5QctQcLA+/kkD1pSKnBZrQIw4+5AZZenuS8URKQCTLdKg4m2y01KKMZZlzCDGoe7IIsASGhUPjxCgbARPv1kbWJTWOnGbfljF9Ti3bCSDlx2h8SOkyu4RKQPPD2Qw6OC2MbL0oJ4iatyRTloqCDhRL6fSCMAAAK4DLBnFrNdlDgUrjgcbD/+1LEMgAKLHNLh6TFsUyU5qWEjPhMbExcgCpAhIGnL2X51kh0iVQRZQQOuowcUaDmbvclmzMn387nP/fhOQfMJUFFp73K2sEZ2OSy+nLpEazQxbVRal+7tFlBALj2M4ghjEoBCYyAqZLbFw+HFeLWA5JzByKCpyUH/g6RyJ9HXpcNWoKaPNM4i/E5E3bxRD3Pe9hFhMJi9IqbmXFlEP5QEyIq8kU+wKkJkoghJNzAVDwXgkA9ciBE4BbZ2QEikHCtQMSk44haxACDjJ5Z0EEjmP/7UsQ9gAoQs0kmGG5xTwan9MSYmE7jpAw0RrGMdUNFLAEBGaxahOJDJxYFcwUlXeLKYLo72/oIKhTz5BdCag4k6ATJSda8IyHYGTovkg+aA0Z0M8OSgog7CQpDTjiTAw8abfl1o59z3iKVZq+6DxUPKWZ24aYlYuVT2UOqHrJzaVEmLWrV3n9AoKs/ohn/aguuaCU0k3AlKYUkJKFEIjxiSduHBqUg9ogMyXuEb3fNyM92e8OEDqqSRSriAmTYBRDcdNH6sQ1b0Rf0sIVxUBxy//tSxEkACihtPUwwwYE5jmjoww2SFcqgWYzRUazFdyXkP10MAAAAAYnBaB4CxiZq1IljkJIwOE5meE9wQSNhGLRMOZYxEgYi+ngx0h2xAQgXDqllDI99JcVujUNCbCbbLxGUaPFkraoagWPipq5XjdK7P8WN1jjZBRaQSoZy+HwzRk8FD1ImZFsBSbJCNJ7b1E0e6+Jc6gKCVFhgtbJsY6iIiC4xpEs1pgacY87QJyb+9abaKg0GSBUms2HuqjX/w5YJ//1KD5UASmvACU7USp//+1LEVwAKKGU3JhhuwUSM6LT2DDx7Y+CxY0AUTmjALRAthrHJHm/aasmceDjn0BHWOxU2zDHD+qkcQbUFQ4JQ6MNAwLuhNTNs2zEzAWHrD0ImyrDGnIIYQKs2f+4GeV1IoyNFPA8BAD3GYjjuIQ6GKosgGLEiET0Op7Cq5Qo5QoHkxZdokyNsjC77QKWXnP5EQxRwgxzCy2TPq7yB9TRKOzX5U0RU8ZCvXWLybyn3pjXBAGSma+pqEO/OPbQwuC45WnIIZvPCtkXXrojyITkkAv/7UsRjgApgezssJGXBSxMo9MSNFKIzdzlgD2gk2svFxytcWsjvlmhKn1eSZn3q8MwoZki5AIrYePhhwjXAzgG+GD+jt7IAIBR2aMkZI0QDF14mkgBY3rlyYPZeI50Jxj6keGaIj7pUBpWdRClqy6/6dsW3++zDROLlF4gIHR4oJ1kgg2+5sUpz4TjxXvb9c26t5rs31QwEAABBLdMNhCpOXUQXM4TOGsP+9DKHFdtg8ifKunQ1iQRNGMBRUN42jZYVbEGzfYIEDwGA8JpAgxwc//tSxG6CCjitMgykbwE9juaZhhh4nRe7ZadDN4KR5vVPgyWqARjOO/53YiIYW+4PU2PJ4uQmu4J3j/P+Tb/+36/6rWr1zqmve437/sLIQAA2k9ySNBNCHihLSTkHRKHM0OhCNiOPRmH7ZCF5eWvLTJuuuMC3FvQFRKkGyEisiDMK1MQKg5UT/rIblCO1IpX+v55fO+/2lMF/fXX1KNKW90n5eX8i/LTsdooMnT3UgutZNX/iZQQAAAxk2cYkSJaEAEngiYh+4SwKR8HuwyJlDnz/+1LEe4AOSHs3TCTQiaEn56mWDLhsSAlNRIaVYyNm6wThPzA8QQiULALDsPwJlspB6L07ymp9G8ndvclRH69p0OilmBW9D8qpXtBikk6XtILNNfT8uJeLNc0t5zu07wut2Htqm1m7v7xBvx7iJe2fe7Nn7HlBIOvNur62iJ+VL3/lUAEEFQ4azSgXqweuhMaUpW6TET7Q4/jcHbAMcwjV2o1dI1TsZSN6+kFCoVdpx5uI1tlo4vpLpCdvRJ3JQg5eaql/X3NfUxslzvnZI7rW5f/7UsRsAZE9KyjNsNLB5B6lqZeZOPsqTqh1523vbVZub7n7/kzCbmh46qxpqMaoiNHNOjQ0uVfeubvtqjanZ5oeQAIALpnZgH5SIyAEP07HlV1HV4rXgCZXSu2eZIzFOmiWZSvw7tO7rcJ6elMDytrkojMjgtLDeOdJTHLWtYX8Y0WUZvPZ03xsfsqHi2Vkb3SYxsjMN+5spPVUqFUVHJK7K6zB+QjlRl/v3GjQ+6DhYrKdGXX/V1QQONm1K/f+/o2oxngAAMZ2QIIQVNFqjRgA//tSxEiAEH2bLOyYtworIOTJpKLIsBQGJ3l0YGaeylxnIUxZyoSwEv04xetvWGwZLazmMPd5sDmNIWDjFMzdnIEk+BVYmk0H5lg3sH1NJUNFlYOJipQWOmmMujEGQPNWhssKjpaZvMTcaNrnZFB/YbK33jTpYmnJu5izzkyguOQAwOpwwLA0vSmHlCx2ZfS+i7ENAKQAAAfNJ0QbCRbhrfSJQgp4agASxIiXhGSAbow8MLRLDpCP4jIkqlJxZAPE4nJio+484qaaoKtOLx4Ia43/+1LEHwAM7JEvLLBpwdEeJamGGXC18RMGDqjRVQ0OIWKB3aNaRAqybOdYGgk2hDudAKFvARw6K3mqcdou8sAiwAAIRLgYY40NbnADxrUcWWtbo3ebYGJoYCUFxfE9MIJ6uMRxRHRNO9D4kE4sBq+PQ41rFmPcmRLwfbvtwhub5jZLrfkItmuz9rTPrUoykMzC1e3748PW8VU329//ESoYDsFS+7OAwKhdZN5Qm1R18CZLSgIfAACKStFFFmg87S1XMlbjDtA+pQ8tAuWBSYHJOf/7UsQPAAy9JTVMMKnBeh8naYSM6NVw2vHy85fsugSHv/WB6J+CcmY7KIolRrqj95fKdEVSEpc7PF2Zlbd0VHpZagOjNVTLkNOf5nm//EDkxYoDs2ZYKNdCJDyb0A92QCm27sF4RJKNkKu5S8GYLnwIE40jEICEw0goijjkSKDOtMYmUBA49fs4eMUnoZEec7ISy4/9L3K1yhllsuq84+fkR//J+9XChEDixZ+tpoTiqBR4GNET7Ou6jZJ1AU+jUAEiacoBKW4WpMjX60dZxp9G//tSxAqACoxpQ6eYbGFHCebplhjgtPQuwsaobCZzorZNuwyvYGJ+fgg0gQOMDBRBRZgk6w2RjhC0awkSdJ6j7jx1ZIWaUpeWCPohsYLuGvUuz2/9QG7iABJJ0GTwX8DgmE224vUwNCGxTXGqHENJ94l2WQplp/nmiHoJdLDjzwy0XcMIui5MeBFiqrpgqxo9De8mMkNEvHAVFjb2I6iQTSRPExROlqoASWRIBKNuagE4aIl1ToqzQYgRBMjFQwMjEimdDxdz/T7m535NK11OAIX/+1LEFQAKcHs9p7BnwVAM57WEmRAIrENipTmOynjrhcTIDIReAws5AlkB6pfdIk7sfUY1q1MLhpKMZc///rAC2kaATablw2AUUlG1t+GkuLEGuuUBIiKhs0TjjhK5lHJybTu7GKuZJzDy5bMzrMQB4GD9yAA8kxKVi6JlhogtjhVtBs1cfPQWrU07/Mo6Pbo0KqoDvuAGk3LhPxJQWEwlzHZct3yoCgnMuQHyY/YXco39WxS2IcqoxqFYQroj1ShRyoC98bXoyUd3OfaDzK7Wh//7UsQfAEtZAzlMJEfBSomncYYYYJKrWzK/AeyWyvyasoM8/2Iepx0MNezzzluPXlBQBSrNIC8TMAjC/TpiSSBSsQSSqMTVw24WASWBbmqKjqvuvHU7HhE24KklMeNB0+WaIqCgUKbBYSBJoooel6Wza0hIVlgTW1j2W6F1CooLO1/fqXUe37e2FWpuXgkBQWGYEEQvfLhyiN2xqOHFkgwhIzGY/yevZAt3LGsQihk41qRnGIsFRgCTSyhJAgZGrjhbfeHzomeMHNGMFy8Wq3UE//tSxCYACqBvR6YYbSFHieb1lhhgzYCVds9VDfsuAMSZQABJKcoxCZoSnEFnwqIg/iUZJUhcfTgIJAZXkiZUkEr/knjQR6bmjZcSQ2KCxM8RFdFkkf6wAqhhnIqYyXFrXxV7PK2ImDKL3Oo70Cun0AXZG0gE425upMoUwVwgiCwaSyZDE7FrCZWZEtmpmbPkeKvK9IgtBBYVtBZgaKBUVD7hUewpYoJRQWFCqQStTZXoC8te5m9j/wbCYAeMde/J+YFLWa6w7td3CnbIpeYitGb/+1LEMIAKsGE9rDBjgWcOKPT2GKShB5iPC5UOxmvCsilY+VHprIOdOKxp9eHAp1VM8ZXOfaqmhftPThYiRPGRUDBEpPHWnwy4QkzmxMEXnGXiccbCYIHRZCqddkr6e7MbDnrqBebrRILkjm67MlxMBdDuCJ9OQUZ6eDQuWKmF0a+q1gRMOlNi9wZ0iNmLppmeecfiZa8jEYyTKB7Roq6J3n6iosRETJhw1QoGjo0YO/NTq81f1u/qBds0cKLjac4hZCyJSCWLsoDSCzbYNExEHf/7UsQ2gAqAk0GnsGVBTZJotPSM5OOkDs0Uh8O9anh4GckBP7c1wiiWeK6sfkX5+cuJ0CZrjIAWwcfGWYHYXRHIExhVQrV60MH39fp9KqnVAGlAAEoqU2QHYpMKzWF5AYXDqXEhuaD33FwwOOHwsEtZFi2JMckTwyzOUWJjBUOg094PhddDoqLvvSPUHzCrnM/KrQGL5oVUzumnspfW+/vUqZv6ASrAALSUvHeAlnCpDiTBqyiQakICQcHyIgJ0CBdNBjcUQZaGTdzAEd2T86mZ//tSxECACohVN0wwxQGEkCfo9IzooUEU4VwQ4gPhhpQIjhoeCwq1JOTEN9VWt8BgS+9h/tJirxjULUNGqsSBDI4TuQTZUcC/xIoRqlQUk0xBJBQlWzRF8pdIx+LWXC0rLFmuLWqmaBSASd9m1cPDUL+ihaYK1iOUjZSUo+RmpPtnMxamMCoaAQsJZ+7en3GxyUlUZhyf//FYmen2cWcKBCR9lINRyXgGyGQGzpVVkLwBSYgKTZUdiSWwLiGMI0mQQ+nOh930zwfJERkhSQJCNgD/+1LEQ4AKpKtDR7Bo0UwKaDWWGGAEYCD6APOvolzoxDFVQmxzwnQ8mQQYap5P+8PnBx+OCPTVAkV5iTZHL7rfxwq5Wbzbrvq89BCLLrRd1J6mZzKobw9GAUIEC9OM5FDnLDFAzKlTSuBJrqMUHVNhzaur0j3Lgnqxc7fcMurjzSCzVP8O///X77wWpX7ev/8+gBNUuSAEhRxNpRJuQAHhLLDGXQBxAHpVoA4+7xfNdZaIMAF0HkicaRAVgHsHKYIxT8EceOkOdr53pDakdomzjP/7UsRNAAtEcU31gYAqYSbmtzTwAelqwkmxLb1Iui+ZtPHcXcUlagUyvNKFnt9K7owP/qM5qtrfv4M+/77pNeW89Fcssj95PBiVvqurZ3/ExBz/aJRieRKODyTX/+P/X3/pibzb3RUPImPEvALKAGAAAgArwFi3Cif+bImX+lmP+BDZooObSf8DSrgBmw5JEcAQ2Bi0AGfOGJMocCw8DAlgMmKBYE6KSfh6QN1gbuHUAaARb/AwoQckVgAUMFkofXqV/AXDBYEPqAuCCyUG2osh//tSxDGAEoFFELmqAAAAADSDgAAESVSqv4ciFkIqIpEG6oNsS8JtC33//8OSGTAQDCxIL7BjoXyC5ocsR0Hza9f//k+XkkxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+1LERYPAAAGkAAAAIAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg=="),
        (i.autoplay = !0),
        (i.loop = !0),
        (i.muted = !0),
        (i.ontimeupdate = () => {
          this.drawImageOnce();
        }),
        (this.audioElement = i);
    }
    updateSources(e) {
      return pe(this, void 0, void 0, function* () {
        (this.sources = e), (this.canvasSources = []);
        const t = yield Promise.all(e.map((e) => hs.loadImage(e.source)));
        this.ctx &&
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let r = 0; r < e.length; r++)
          this.canvasSources.push({
            source: t[r],
            x: e[r].x,
            y: e[r].y,
            width: e[r].width || t[r].width,
            heigth: e[r].height || t[r].height,
          });
      });
    }
    play(e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      return void 0 === t.mirror && (t.mirror = !1), super.play(e, t);
    }
    destroy() {
      (this.ctx = null),
        this.canvas.remove(),
        (this.sources = []),
        (this.canvasSources = []),
        (this.audioElement.ontimeupdate = null),
        (this.audioElement.src = ""),
        this.audioElement.remove(),
        super.destroy();
    }
  }
  var yc;
  (e.QNRecorderState = void 0),
    ((yc = e.QNRecorderState || (e.QNRecorderState = {})).IDLE = "IDLE"),
    (yc.RECORDING = "RECORDING"),
    (yc.STOPPED = "STOPPED");
  class kc extends le {
    constructor(e, t) {
      var r, n;
      super(),
        (this.source = e),
        (this.config = t),
        (this.maxDurationMs =
          null !== (r = t.maxDurationMs) && void 0 !== r ? r : 12e4),
        (this.recorderInfoUpdateInterval =
          null !== (n = t.recorderInfoUpdateInterval) && void 0 !== n
            ? n
            : 1e3);
    }
    set state(e) {
      (this._state = e), this.emit(kc.STATE_CHANGED, e);
    }
    get state() {
      return this._state;
    }
    startRecording() {
      return pe(this, void 0, void 0, function* () {
        if (this.state === e.QNRecorderState.RECORDING) {
          const e = ko();
          throw (this.emit(kc.ERROR, ko()), e);
        }
        const { storagePath: t } = this.config,
          r = [],
          n = [];
        this.source.forEach((e) =>
          "video" === e.track.kind ? r.push(e) : n.push(e)
        );
        let i = [];
        if (
          (n.length && i.push(this.processAudioTracks(n)),
          r.length && i.push(this.processVideoTracks(r)),
          0 === i.length)
        ) {
          const e = So();
          throw (this.emit(kc.ERROR, e), e);
        }
        const o = new MediaStream(i);
        let a;
        this.mediaRecorder = new MediaRecorder(o);
        try {
          a = yield window.showSaveFilePicker({
            excludeAcceptAllOption: !0,
            suggestedName: t,
            types: [
              {
                description: "qnweb-rtc-record",
                accept: { "video/webm": [".webm"], "audio/webm": [".weba"] },
              },
            ],
          });
        } catch (e) {
          const t = bo();
          throw (this.emit(kc.ERROR, t), t);
        }
        const s = yield a.getFile();
        (this.writer = yield a.createWritable()),
          (this.mediaRecorder.onstart = (e) => {
            const t = e.timeStamp;
            let r = 0,
              n = performance.now();
            this.mediaRecorder.ondataavailable = (e) =>
              pe(this, void 0, void 0, function* () {
                if (e.data.size >= 1e3) n = performance.now();
                else if (performance.now() - n >= 5e3) {
                  const e = So();
                  throw (this.emit(kc.ERROR, e), this.releaseRecoreding(), e);
                }
                const i = e.timeStamp - t;
                if (i > this.maxDurationMs) {
                  const e = yo();
                  throw (this.emit(kc.ERROR, e), this.releaseRecoreding(), e);
                }
                (r += e.data.size),
                  this.emit(kc.INFO_UPDATED, {
                    durationMs: i,
                    fileSize: r,
                    fileName: s.name,
                  }),
                  this.writer.write(e.data);
              });
          }),
          this.mediaRecorder.start(this.recorderInfoUpdateInterval),
          (this.state = e.QNRecorderState.RECORDING);
      });
    }
    stopRecording() {
      return pe(this, void 0, void 0, function* () {
        if (
          this.state === e.QNRecorderState.IDLE ||
          this.state === e.QNRecorderState.STOPPED
        ) {
          const e = ko();
          throw (this.emit(kc.ERROR, e), e);
        }
        return new Promise((t) => {
          this.mediaRecorder.stop(),
            setTimeout(() => {
              this.writer.close(),
                (this.state = e.QNRecorderState.STOPPED),
                t();
            }, 1e3);
        });
      });
    }
    releaseRecoreding() {
      return pe(this, void 0, void 0, function* () {
        if (this.state === e.QNRecorderState.IDLE) {
          const e = ko();
          throw (this.emit(kc.ERROR, e), e);
        }
        return new Promise((t) => {
          this.mediaRecorder.stop(),
            setTimeout(() => {
              this.writer.close(),
                (this.state = e.QNRecorderState.IDLE),
                this.removeAllListeners(),
                t();
            }, 1e3);
        });
      });
    }
    processVideoTracks(e) {
      const { width: t, height: r, frameRate: n, storagePath: i } = this.config,
        o = document.createElement("canvas"),
        a = o.getContext("2d"),
        s = window.devicePixelRatio || 1;
      (o.width = t * s),
        (o.height = r * s),
        (o.style.width = "".concat(t, "px")),
        (o.style.height = "".concat(r, "px")),
        a.scale(s, s);
      const c = e.sort((e, t) => (e.zOrder || 0) - (t.zOrder || 0)),
        d = [];
      for (let e of c) {
        const t = document.createElement("video");
        (t.srcObject = new MediaStream([e.track])),
          d.push(Object.assign({ elt: t }, e)),
          t.play();
      }
      this.renderVideoCanvas(a, d);
      const u = o.captureStream(n).getVideoTracks().pop();
      if (void 0 === u) {
        const e = So();
        throw (this.emit(kc.ERROR, e), this.releaseRecoreding(), e);
      }
      return u;
    }
    processAudioTracks(e) {
      const t = new AudioContext(),
        r = t.createMediaStreamDestination();
      for (let n of e) {
        t.createMediaStreamSource(new MediaStream([n.track])).connect(r);
      }
      const n = r.stream.getAudioTracks().pop();
      if (void 0 === n) {
        const e = So();
        throw (this.emit(kc.ERROR, e), this.releaseRecoreding(), e);
      }
      return n;
    }
    renderVideoCanvas(e, t) {
      return pe(this, void 0, void 0, function* () {
        for (let r of t) e.drawImage(r.elt, r.x, r.y, r.width, r.height);
        requestAnimationFrame(this.renderVideoCanvas.bind(this, e, t));
      });
    }
  }
  (kc.STATE_CHANGED = "state-changed"),
    (kc.INFO_UPDATED = "info-updated"),
    (kc.ERROR = "error");
  class _c extends le {
    constructor() {
      super(), this.handleDeviceManager();
    }
    setRecordingDevice(e) {
      this.currentRecordingDeviceID = e;
    }
    setPlaybackDevice(e) {
      this.currentPlaybackDeviceID = e;
    }
    setCameraDevice(e) {
      this.currentCameraDeviceID = e;
    }
    startRecordingDeviceTest(e, t) {
      return pe(this, void 0, void 0, function* () {
        if (this.recordingDeviceTrack instanceof mc) return;
        this.currentRecordingDeviceID
          ? (this.recordingDeviceTrack = yield Rc.createMicrophoneAudioTrack({
              microphoneId: this.currentRecordingDeviceID,
            }))
          : (this.recordingDeviceTrack = yield Rc.createMicrophoneAudioTrack()),
          t && this.recordingDeviceTrack.setEarMonitorEnabled(!0);
        const r = () => {
          const e = this.recordingDeviceTrack
            ? this.recordingDeviceTrack.getVolumeLevel()
            : 0;
          this.emit("test-recording-device-volume", e);
        };
        (this.recordingDeviceTimer = setInterval(() => {
          r();
        }, e)),
          r();
      });
    }
    stopRecordingDeviceTest() {
      clearInterval(this.recordingDeviceTimer),
        this.recordingDeviceTrack && this.recordingDeviceTrack.destroy(),
        (this.recordingDeviceTrack = null);
    }
    startPlaybackDeviceTest(e) {
      return pe(this, void 0, void 0, function* () {
        if (this.playbackDeviceTrack instanceof vc) return;
        const t = e instanceof Blob ? URL.createObjectURL(e) : e;
        (this.playbackDeviceTrack = yield Rc.createBufferSourceAudioTrack({
          source: t,
        })),
          (this.playbackDeviceEl = document.createElement("div")),
          document.body.append(this.playbackDeviceEl),
          this.playbackDeviceTrack.start(),
          this.playbackDeviceTrack.play(this.playbackDeviceEl),
          this.currentPlaybackDeviceID &&
            this.playbackDeviceTrack.mediaElement.setSinkId(
              this.currentPlaybackDeviceID
            );
      });
    }
    stopPlaybackDeviceTest() {
      this.playbackDeviceTrack && this.playbackDeviceTrack.destroy(),
        (this.playbackDeviceTrack = null),
        this.playbackDeviceEl.remove();
    }
    getCameraDevices() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      return pe(this, void 0, void 0, function* () {
        return Xs.getDeviceInfo(e, "cameras");
      });
    }
    getRecordingDevices() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      return pe(this, void 0, void 0, function* () {
        return Xs.getDeviceInfo(e, "microphones");
      });
    }
    getPlaybackDevices() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      return pe(this, void 0, void 0, function* () {
        return Xs.getDeviceInfo(e, "playback");
      });
    }
    getDevices() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      return pe(this, void 0, void 0, function* () {
        return Xs.getDeviceInfo(e, "all");
      });
    }
    handleDeviceManager() {
      Xs.on("device-changed", (e) => {
        switch (e.device.kind) {
          case "audioinput":
            this.emit("recording-device-changed", e.device, e.state);
            break;
          case "audiooutput":
            this.emit("playback-device-changed", e.device, e.state);
            break;
          case "videoinput":
            this.emit("camera-device-changed", e.device, e.state);
        }
      });
    }
  }
  class wc extends le {
    constructor(e) {
      super(),
        (this.source = e),
        (this.outTrackList = []),
        (this.musicOption = { loop: !1, volume: 1 }),
        (this.musicVolume = 1),
        (this.playbackEngine = new pc()),
        (this.playback = !0);
    }
    get audioNode() {
      return this.musicTrack ? this.musicTrack.audioManager.gainNode : null;
    }
    add(e) {
      this.outTrackList.find((t) => t === e) ||
        (this.outTrackList.push(e),
        this.musicTrack && e.appendAudioSource(this.musicTrack));
    }
    remove(e) {
      const t = this.outTrackList.findIndex((t) => t === e);
      t >= 0 && this.outTrackList.splice(t, 1),
        this.musicTrack && e.removeAudioSource(this.musicTrack);
    }
    start() {
      let e =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
      return pe(this, void 0, void 0, function* () {
        this._start(e);
      });
    }
    stop() {
      (this.loopCount = 1), this.stopMusicMixing();
    }
    resume() {
      this.musicTrack
        ? this.musicTrack.resumeAudioSource()
        : he.warning("can not find target music, please run startAudioMixing");
    }
    pause() {
      this.musicTrack
        ? this.musicTrack.pauseAudioSource()
        : he.warning("can not find target music, please run startAudioMixing");
    }
    getDuration() {
      return this.musicTrack ? this.musicTrack.getDuration() : 0;
    }
    getCurrentPosition() {
      return this.musicTrack ? this.musicTrack.getCurrentTime() : 0;
    }
    seekTo(e) {
      if (
        (this.musicTrack && this.musicTrack.setCurrentTime(e),
        this.musicTrack && !this.musicTrack.audioManager.audioSource)
      )
        throw Yi("can not find audio source");
    }
    getMixingVolume() {
      return this.musicVolume;
    }
    setMixingVolume(e) {
      let t = Number(e);
      (t = isNaN(t) ? 0 : t),
        (this.musicVolume = t),
        this.setMusicOption({ volume: this.musicVolume });
    }
    release() {
      (this.loopCount = 1), this.stopMusicMixing();
    }
    _start() {
      let e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
        t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      return pe(this, void 0, void 0, function* () {
        (this.loopCount = Math.max(-1, Number(e))),
          this.setMusicOption({
            loop: -1 === this.loopCount,
            volume: this.musicVolume,
          }),
          0 !== this.loopCount && (yield this.startMusicMixing(this.source, t));
      });
    }
    startMusicMixing(t) {
      let r = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      return pe(this, void 0, void 0, function* () {
        if (this.musicTrack)
          return this.stopMusicMixing(r), yield this.startMusicMixing(t);
        try {
          if (
            ((this.musicTrack = yield Qs.createAudioTrackFromSource(t)),
            this.outTrackList.forEach((e) =>
              e.appendAudioSource(this.musicTrack)
            ),
            this.setMusicOption({}),
            !this.musicTrack.audioManager.audioSource)
          )
            throw Yi("can not find audio source");
          this.playback &&
            this.audioNode &&
            this.playbackEngine.addAudioNode(this.audioNode),
            this.musicTrack.on("audio-state-change", (t) => {
              switch (t) {
                case e.AudioSourceState.IDLE:
                  this.emit(wc.STATE_CHANGED, e.QNAudioSourceState.IDLE);
                  break;
                case e.AudioSourceState.LOADING:
                  break;
                case e.AudioSourceState.PLAY:
                  this.emit(wc.STATE_CHANGED, e.QNAudioSourceState.MIXING);
                  break;
                case e.AudioSourceState.PAUSE:
                  this.emit(wc.STATE_CHANGED, e.QNAudioSourceState.PAUSED);
                  break;
                case e.AudioSourceState.END:
                  this.loopCount > 1
                    ? (--this.loopCount, this._start(this.loopCount, !0))
                    : this.emit(
                        wc.STATE_CHANGED,
                        e.QNAudioSourceState.COMPLETED
                      );
                  break;
                case e.AudioSourceState.STOP:
                  this.emit(wc.STATE_CHANGED, e.QNAudioSourceState.STOPPED);
              }
            }),
            this.musicTrack.startAudioSource();
        } catch (e) {
          if (e instanceof Ji) throw (this.emit(wc.ERROR, e), e);
        }
      });
    }
    stopMusicMixing() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      this.musicTrack &&
        (this.musicTrack.stopAudioSource(e),
        this.outTrackList.forEach((e) => e.removeAudioSource(this.musicTrack)),
        this.musicTrack.release(),
        (this.musicTrack = void 0));
    }
    setMusicOption(e) {
      (this.musicOption = Object.assign(this.musicOption, e)),
        this.musicTrack &&
          (this.musicTrack.setVolume(this.musicOption.volume),
          this.musicTrack.setLoop(this.musicOption.loop));
    }
  }
  (wc.STATE_CHANGED = "state-changed"), (wc.ERROR = "error");
  class Ec extends le {
    constructor(e, t) {
      super(),
        (this.playbackEngine = e),
        (this.effectID = t),
        (this.playback = !0),
        (this.loopCount = 1);
    }
    getDuration() {
      return this.getValidateAudioTrack().getDuration();
    }
    getID() {
      return this.effectID;
    }
    getFilePath() {
      return this._filePath;
    }
    setLoopCount(e) {
      (this.loopCount =
        -1 === e ? Number.MAX_SAFE_INTEGER : Math.max(0, Number(e))),
        0 === this.loopCount && this.stopEffect();
    }
    getLoopCount() {
      return this.loopCount === Number.MAX_SAFE_INTEGER ? -1 : this.loopCount;
    }
    playEffect(e) {
      if (this.loopCount > 0) {
        const t = this.getValidateAudioTrack();
        e && t.setVolume(e),
          this.playback &&
            t.audioManager.audioSource &&
            this.playbackEngine.addAudioNode(t.audioManager.gainNode),
          t.startAudioSource();
      }
    }
    stopEffect() {
      const e = this.getValidateAudioTrack();
      (this.loopCount = 1), e.stopAudioSource();
    }
    resumeEffect() {
      this.getValidateAudioTrack().resumeAudioSource();
    }
    pauseEffect() {
      this.getValidateAudioTrack().pauseAudioSource();
    }
    getCurrentPosition() {
      return this.getValidateAudioTrack().getCurrentTime();
    }
    addEffectSource(e) {
      return pe(this, void 0, void 0, function* () {
        try {
          (this.audioTrack = yield Qs.createAudioTrackFromSource(e)),
            (this._filePath =
              "string" == typeof e ? e : URL.createObjectURL(e)),
            this.handleAudioTrack();
        } catch (e) {
          e instanceof Ji && this.emit(Ec.ERROR, e);
        }
      });
    }
    appendAudioSource(e) {
      this.audioTrack && e.appendAudioSource(this.audioTrack);
    }
    removeAudioSource(e) {
      this.audioTrack && e.removeAudioSource(this.audioTrack);
    }
    release() {
      void 0 !== this.audioTrack &&
        (this.audioTrack.release(), (this.audioTrack = void 0));
    }
    getValidateAudioTrack() {
      if (void 0 === this.audioTrack) {
        const e = go();
        throw (this.emit(Ec.ERROR, e), e);
      }
      return this.audioTrack;
    }
    handleAudioTrack() {
      this.audioTrack &&
        this.audioTrack.on("audio-state-change", (t) => {
          if (t === e.AudioSourceState.END)
            this.loopCount > 1
              ? ((this.loopCount =
                  this.loopCount === Number.MAX_SAFE_INTEGER
                    ? Number.MAX_SAFE_INTEGER
                    : this.loopCount - 1),
                this.playEffect(this.loopCount))
              : this.emit(Ec.FINISHED);
        });
    }
  }
  (Ec.FINISHED = "finished"), (Ec.ERROR = "error");
  class Cc extends le {
    constructor() {
      super(...arguments),
        (this.outTrackList = []),
        (this.audioEffectMap = new Map()),
        (this.startedList = new Map()),
        (this.playbackEngine = new pc());
    }
    add(e) {
      this.outTrackList.find((t) => t === e) ||
        (this.outTrackList.push(e),
        this.audioEffectMap.forEach((t) => {
          t.appendAudioSource(e);
        }));
    }
    remove(e) {
      const t = this.outTrackList.findIndex((t) => t === e);
      t >= 0 && this.outTrackList.splice(t, 1),
        this.audioEffectMap.forEach((t) => {
          t.removeAudioSource(e);
        });
    }
    createAudioEffect(e, t) {
      return pe(this, void 0, void 0, function* () {
        if (this.audioEffectMap.has(e)) {
          const e = vo();
          throw (this.emit(Cc.ERROR, e), e);
        }
        {
          const r = new Ec(this.playbackEngine, e);
          return (
            this.handleAudioEffect(e, r),
            yield r.addEffectSource(t),
            this.outTrackList.forEach((e) => r.appendAudioSource(e)),
            this.audioEffectMap.set(e, r),
            r
          );
        }
      });
    }
    start(e) {
      this.getValidateAudioEffect(e).playEffect(1), this.startedList.set(e, !0);
    }
    stop(e) {
      this.getValidateAudioEffect(e).stopEffect();
    }
    pause(e) {
      this.getValidateAudioEffect(e).pauseEffect();
    }
    resume(e) {
      this.getValidateAudioEffect(e).resumeEffect();
    }
    stopAll() {
      this.audioEffectMap.forEach((e) => {
        e.stopEffect();
      });
    }
    pauseAll() {
      this.audioEffectMap.forEach((e) => {
        e.pauseEffect();
      });
    }
    resumeAll() {
      this.audioEffectMap.forEach((e) => {
        e.resumeEffect();
      });
    }
    getCurrentPosition(e) {
      const t = this.getValidateAudioEffect(e);
      return this.startedList.get(e)
        ? Math.floor(1e3 * t.getCurrentPosition())
        : 0;
    }
    setVolume(e, t) {
      this.getValidateAudioEffect(e).getValidateAudioTrack().setVolume(t);
    }
    getVolume(e) {
      return this.getValidateAudioEffect(e).getValidateAudioTrack().getVolume();
    }
    setAllEffectsVolume(e) {
      this.audioEffectMap.forEach((t) => {
        t.getValidateAudioTrack().setVolume(e);
      });
    }
    release() {
      this.audioEffectMap.forEach((e) => {
        e.release(), this.outTrackList.forEach((t) => e.removeAudioSource(t));
      }),
        this.audioEffectMap.clear();
    }
    getValidateAudioEffect(e) {
      const t = this.audioEffectMap.get(e);
      if (void 0 === t) {
        const e = To();
        throw (this.emit(Cc.ERROR, e), e);
      }
      return t;
    }
    handleAudioEffect(e, t) {
      t.on(Ec.FINISHED, () => {
        this.emit(Cc.FINISHED, e);
      }),
        t.on(Ec.ERROR, (e) => {
          throw (this.emit(Cc.ERROR, e), e);
        });
    }
  }
  (Cc.FINISHED = "finished"), (Cc.ERROR = "error");
  const Ic =
    ("safari" === hi.name || "ios" === hi.name) &&
    navigator.userAgent.includes("15_1");
  Ic &&
    he.warning(
      "QNRTC: iOS 15.1 has a bug causing the SDK to crash. Please upgrade to iOS 15.2 or later.",
      hi
    );
  class Pc {
    static get VERSION() {
      return ei;
    }
    static isBrowserSupported() {
      return Ti.support;
    }
    static checkSystemRequirements() {
      return pe(this, void 0, void 0, function* () {
        return yield Vs();
      });
    }
    static setLogLevel(t) {
      switch (t) {
        case e.QNLogLevel.VERBOSE:
          he.setLevel("log");
          break;
        case e.QNLogLevel.INFO:
          he.setLevel("debug");
          break;
        case e.QNLogLevel.WARNING:
        case e.QNLogLevel.ERROR:
          he.setLevel("warning");
          break;
        case e.QNLogLevel.NONE:
          he.setLevel("disable");
      }
    }
    static isChromeExtensionAvailable() {
      return pe(this, void 0, void 0, function* () {
        return yield ya();
      });
    }
    static createClient() {
      const e = new dc(this._config);
      return Pc._clients.push(e), e;
    }
    static getCameras() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      return pe(this, void 0, void 0, function* () {
        return Xs.getDeviceInfo(e, "cameras");
      });
    }
    static getMicrophones() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      return pe(this, void 0, void 0, function* () {
        return Xs.getDeviceInfo(e, "microphones");
      });
    }
    static getPlaybackDevices() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      return pe(this, void 0, void 0, function* () {
        return Xs.getDeviceInfo(e, "playback");
      });
    }
    static getDevices() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      return pe(this, void 0, void 0, function* () {
        return Xs.getDeviceInfo(e, "all");
      });
    }
    static createAudioMusicMixer(e) {
      return (
        this.audioMusicMixer || (this.audioMusicMixer = new wc(e)),
        this.audioMusicMixer
      );
    }
    static destroyAudioMusicMixer() {
      this.audioMusicMixer && this.audioMusicMixer.release();
    }
    static createAudioEffectMixer() {
      return (
        this.audioEffectMixer || (this.audioEffectMixer = new Cc()),
        this.audioEffectMixer
      );
    }
    static destroyAudioEffectMixer() {
      this.audioEffectMixer && this.audioEffectMixer.release();
    }
    static createCameraVideoTrack(e) {
      return pe(this, void 0, void 0, function* () {
        let t;
        if ((he.log("createCameraVideoTrack start", e), e && e.encoderConfig))
          if ("string" == typeof e.encoderConfig) {
            if (((t = ki[e.encoderConfig]), !t)) throw po();
          } else t = Object.assign(Object.assign({}, _i), e.encoderConfig);
        else t = _i;
        const r = Go({
          enabled: !0,
          width: t.width,
          height: t.height,
          frameRate: t.frameRate,
          bitrate: t.bitrate,
          tag: e && e.tag,
          facingMode: e && e.facingMode,
          optimizationMode: e && e.optimizationMode,
          deviceId: e && e.cameraId,
        });
        !r.deviceId &&
          Pc.deviceManager &&
          Pc.deviceManager.currentCameraDeviceID &&
          (r.deviceId = Pc.deviceManager.currentCameraDeviceID);
        const n = (yield Xs.getLocalTracks({ video: r }))[0];
        e &&
          e.encoderConfig &&
          "string" != typeof e.encoderConfig &&
          e.encoderConfig.lowStreamConfig &&
          (n.lowStreamConfig = e.encoderConfig.lowStreamConfig);
        const i = new Ac(n);
        return (
          void 0 !== t.isMultiProfileEnabled &&
            (i.isMultiProfileEnabled = t.isMultiProfileEnabled),
          he.log("createCameraVideoTrack end", i),
          i
        );
      });
    }
    static createMicrophoneAudioTrack(e) {
      return pe(this, void 0, void 0, function* () {
        let t;
        if (
          (he.log("createMicrophoneAudioTrack start", e), e && e.encoderConfig)
        )
          if ("string" == typeof e.encoderConfig) {
            if (((t = wi[e.encoderConfig]), !t)) throw po();
          } else t = Object.assign(Object.assign({}, Ei), e.encoderConfig);
        else t = Ei;
        const r = Go({
          enabled: !0,
          bitrate: t.bitrate,
          sampleRate: t.sampleRate,
          sampleSize: t.sampleSize,
          channelCount: t.stereo ? 2 : 1,
          autoGainControl: !e || void 0 === e.AGC || e.AGC,
          noiseSuppression: !e || void 0 === e.ANS || e.ANS,
          echoCancellation: !e || void 0 === e.AEC || e.AEC,
          deviceId: e && e.microphoneId,
          tag: e && e.tag,
        });
        !r.deviceId &&
          Pc.deviceManager &&
          Pc.deviceManager.currentRecordingDeviceID &&
          (r.deviceId = Pc.deviceManager.currentRecordingDeviceID);
        const n = yield Xs.getLocalTracks({ audio: r }),
          i = new mc(n[0]);
        return he.log("createMicrophoneAudioTrack end", i), i;
      });
    }
    static createScreenVideoTrack(t, r) {
      return pe(this, void 0, void 0, function* () {
        let n;
        if (
          (he.log("createScreenVideoTrack start", t, r), t && t.encoderConfig)
        )
          if ("string" == typeof t.encoderConfig) {
            if (((n = Ci[t.encoderConfig]), !n)) throw po();
          } else n = Object.assign(Object.assign({}, Ii), t.encoderConfig);
        else n = Ii;
        let i = [];
        if (pi)
          i = yield Xs.createElectronScreenTrack(
            Go({
              sourceID: t && t.electronScreenSourceID,
              screenBitrate: n.bitrate,
              width: n.width,
              height: n.height,
              optimizationMode: t && t.optimizationMode,
              tag: t && t.screenVideoTag,
              audio: !(!r || !["enable", "auto"].includes(r)) || void 0,
              audioTag: t && t.screenAudioTag,
            })
          );
        else {
          let o = Go({
            enabled: !0,
            width: n.width,
            height: n.height,
            frameRate: n.frameRate,
            bitrate: n.bitrate,
            optimizationMode: t && t.optimizationMode,
            tag: t && t.screenVideoTag,
            audio: !(!r || !["enable", "auto"].includes(r)) || void 0,
            audioTag: t && t.screenAudioTag,
          });
          if (t && t.chromeExtensionSourceType)
            switch (t.chromeExtensionSourceType) {
              case e.QNChromeExtensionSourceType.ALL:
                o = Object.assign(Object.assign({}, o), {
                  forceChromePlugin: !0,
                });
                break;
              case e.QNChromeExtensionSourceType.SCREEN:
              case e.QNChromeExtensionSourceType.WINDOW:
                o = Object.assign(Object.assign({}, o), {
                  forceChromePlugin: !0,
                  source: t.chromeExtensionSourceType,
                });
            }
          i = yield Xs.getLocalTracks({ screen: o });
        }
        if (1 === i.length && "video" === i[0].info.kind && "enable" === r)
          throw (i[0].release(), oo());
        if (1 === i.length && "video" === i[0].info.kind) {
          const e = i[0];
          t &&
            t.encoderConfig &&
            "string" != typeof t.encoderConfig &&
            t.encoderConfig.lowStreamConfig &&
            (e.lowStreamConfig = t.encoderConfig.lowStreamConfig);
          const r = new gc(e);
          return (
            void 0 !== n.isMultiProfileEnabled &&
              (r.isMultiProfileEnabled = n.isMultiProfileEnabled),
            he.log("createScreenVideoTrack end", r),
            r
          );
        }
        {
          const e = i.filter((e) => "audio" === e.info.kind)[0],
            r = i.filter((e) => "video" === e.info.kind)[0];
          if (!e || !r)
            throw Yi(
              "createScreenVideoTrack error, audioTrack: "
                .concat(e, ", videoTrack: ")
                .concat(r)
            );
          t &&
            t.encoderConfig &&
            "string" != typeof t.encoderConfig &&
            t.encoderConfig.lowStreamConfig &&
            (r.lowStreamConfig = t.encoderConfig.lowStreamConfig);
          const o = new fc(e),
            a = new gc(r);
          return (
            void 0 !== n.isMultiProfileEnabled &&
              (a.isMultiProfileEnabled = n.isMultiProfileEnabled),
            he.log("createScreenVideoTrack end", [a, o]),
            [a, o]
          );
        }
      });
    }
    static createMicrophoneAndCameraTracks(e, t) {
      return pe(this, void 0, void 0, function* () {
        let r, n;
        if (
          (he.log("createMicrophoneAndCameraTracks start", e, t),
          e && e.encoderConfig)
        )
          if ("string" == typeof e.encoderConfig) {
            if (((r = wi[e.encoderConfig]), !r)) throw po();
          } else r = Object.assign(Object.assign({}, Ei), e.encoderConfig);
        else r = Ei;
        if (t && t.encoderConfig)
          if ("string" == typeof t.encoderConfig) {
            if (((n = ki[t.encoderConfig]), !n)) throw po();
          } else n = Object.assign(Object.assign({}, _i), t.encoderConfig);
        else n = _i;
        const i = Go({
          enabled: !0,
          bitrate: r.bitrate,
          sampleRate: r.sampleRate,
          sampleSize: r.sampleSize,
          channelCount: r.stereo ? 2 : 1,
          autoGainControl: !e || void 0 === e.AGC || e.AGC,
          noiseSuppression: !e || void 0 === e.ANS || e.ANS,
          echoCancellation: !e || void 0 === e.AEC || e.AEC,
          deviceId: e && e.microphoneId,
          tag: e && e.tag,
        });
        !i.deviceId &&
          Pc.deviceManager &&
          Pc.deviceManager.currentRecordingDeviceID &&
          (i.deviceId = Pc.deviceManager.currentRecordingDeviceID);
        const o = yield Xs.getLocalTracks({
            audio: i,
            video: Go({
              enabled: !0,
              width: n.width,
              height: n.height,
              frameRate: n.frameRate,
              bitrate: n.bitrate,
              tag: t && t.tag,
              facingMode: t && t.facingMode,
              deviceId: t && t.cameraId,
            }),
          }),
          a = o.filter((e) => "audio" === e.info.kind)[0],
          s = o.filter((e) => "video" === e.info.kind)[0];
        if (!a || !s)
          throw Yi(
            "createMicrophoneAndCameraTracks error, audioTrack: "
              .concat(a, ", videoTrack: ")
              .concat(s)
          );
        t &&
          t.encoderConfig &&
          "string" != typeof t.encoderConfig &&
          t.encoderConfig.lowStreamConfig &&
          (s.lowStreamConfig = t.encoderConfig.lowStreamConfig);
        const c = new mc(a),
          d = new Ac(s);
        return (
          void 0 !== n.isMultiProfileEnabled &&
            (d.isMultiProfileEnabled = n.isMultiProfileEnabled),
          he.log("createMicrophoneAndCameraTracks end", [c, d]),
          [c, d]
        );
      });
    }
    static createBufferSourceAudioTrack(e) {
      return pe(this, void 0, void 0, function* () {
        let t;
        if (
          (he.log("createBufferSourceAudioTrack start", e),
          e && e.encoderConfig)
        )
          if ("string" == typeof e.encoderConfig) {
            if (((t = wi[e.encoderConfig]), !t)) throw po();
          } else t = Object.assign(Object.assign({}, Ei), e.encoderConfig);
        else t = Ei;
        const r = yield Xs.getLocalTracks({
            audio: Go({
              enabled: !0,
              source: e.source,
              bitrate: t.bitrate,
              sampleRate: t.sampleRate,
              sampleSize: t.sampleSize,
              channelCount: t.stereo ? 2 : 1,
              tag: e && e.tag,
            }),
          }),
          n = new vc(r[0], e.source);
        return he.log("createBufferSourceAudioTrack end", n), n;
      });
    }
    static createCanvasVideoTrack(e) {
      const t = document.createElement("canvas");
      (t.width = e.width), (t.height = e.height);
      const r = t.getContext("2d");
      if (null === r) throw eo("get context error, canvas track not supported");
      let n;
      if (t.captureStream) n = t.captureStream(15);
      else {
        if (!t.mozCaptureStream)
          throw eo("capture stream error, canvas track not supported");
        n = t.mozCaptureStream(15);
      }
      const i = n.getTracks()[0];
      e.optimizationMode &&
        "contentHint" in i &&
        (i.contentHint = e.optimizationMode);
      const o = La(i, e.tag);
      return new Sc(o, t, r, e.sources);
    }
    static createCustomAudioTrack(e) {
      const t = La(e.mediaStreamTrack, e.tag, e.bitrate);
      return new Tc(t);
    }
    static createCustomVideoTrack(e) {
      e.optimizationMode &&
        "contentHint" in e.mediaStreamTrack &&
        (e.mediaStreamTrack.contentHint = e.optimizationMode);
      const t = La(e.mediaStreamTrack, e.tag, e.bitrate);
      return new bc(t);
    }
    static setTransportPolicy(t) {
      t === e.QNTransportPolicy.FORCE_TCP &&
        (this._config.transportPolicy = "forceTcp"),
        t === e.QNTransportPolicy.FORCE_UDP &&
          (this._config.transportPolicy = "forceUdp"),
        this._clients.forEach((e) =>
          e.setTransportPolicy(this._config.transportPolicy)
        );
    }
    static setConfig(e) {
      (this._config = Object.assign(Object.assign({}, this._config), e)),
        e.mcuServerHosts && Wo.splice(0, Wo.length, ...e.mcuServerHosts),
        this._clients.forEach((t) => {
          t.config = Object.assign(Object.assign({}, t.config), e);
        }),
        he.debug("setConfig", e);
    }
    static checkAudioTrackIsActive(e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 5e3;
      return pe(this, void 0, void 0, function* () {
        const r = Math.min(200, t);
        return new Promise((t, n) => {
          if (e.isAudio()) {
            const n = 0.01,
              i = 200;
            let o = e.getVolumeLevel() || 0,
              a = e.getVolumeLevel() || 0,
              s = a <= n,
              c = !0;
            if (e.isMuted()) t(!1);
            else {
              const d = setInterval(() => {
                e.isMuted()
                  ? (t(!1), clearInterval(d))
                  : ((o = a),
                    (a = e.getVolumeLevel() || 0),
                    a > n && (s = !1),
                    a !== o && (c = !1));
              }, i);
              setTimeout(
                () =>
                  setTimeout(() => {
                    d && (clearInterval(d), t(!s && !c));
                  }, 0),
                r
              );
            }
          } else n(Yi("only support audio track"));
        });
      });
    }
    static checkVideoTrackIsActive(e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 5e3;
      return pe(this, void 0, void 0, function* () {
        return new Promise((r, n) => {
          if (e.isVideo()) {
            const i = e.getMediaStreamTrack();
            if ((e.isMuted() && r(!1), void 0 === i))
              n(Yi("cannot find mediaStreamTrack"));
            else {
              const o = document.createElement("video");
              (o.style.width = "1px"),
                (o.style.height = "1px"),
                o.setAttribute("muted", ""),
                (o.muted = !0),
                o.setAttribute("playsinline", ""),
                (o.controls = !1),
                (o.style.opacity = "0.01"),
                (o.style.position = "fixed"),
                (o.style.left = "0"),
                (o.style.top = "0"),
                document.body.appendChild(o),
                (o.srcObject = new MediaStream([i])),
                o.play();
              const a = document.createElement("canvas");
              (a.width = 160), (a.height = 120);
              const s = a.getContext("2d");
              if (s) {
                let n = !1,
                  i = null;
                const c = setInterval(() => {
                  e.isMuted() &&
                    (c && (clearInterval(c), r(!1)), o && o.remove()),
                    s.drawImage(o, 0, 0, 160, 120);
                  const t = s.getImageData(0, 0, a.width, a.height);
                  var d = Math.floor(t.data.length / 3);
                  if (i) {
                    for (let e = 0; e < d; e += 3)
                      if (t.data[e] !== i[e]) {
                        n = !0;
                        break;
                      }
                  } else i = t.data;
                }, 30);
                setTimeout(() => {
                  setTimeout(() => {
                    c && (clearInterval(c), r(n)), o && o.remove();
                  }, 0);
                }, t);
              } else n(Yi("can not get canvas 2d context"));
            }
          } else n(Yi("only support video track"));
        });
      });
    }
    static getElectronScreenSources(e) {
      return pe(this, void 0, void 0, function* () {
        return Xs.getElectronScreenSources(e);
      });
    }
    static createMediaRecorder(e, t) {
      return new kc(e, t);
    }
    static setLogConfig(t) {
      switch ((cc.setLogConfig(t), t.level)) {
        case e.QNLogLevel.VERBOSE:
          he.setSavedLevel("log");
          break;
        case e.QNLogLevel.INFO:
          he.setSavedLevel("debug");
          break;
        case e.QNLogLevel.WARNING:
        case e.QNLogLevel.ERROR:
          he.setSavedLevel("warning");
          break;
        case e.QNLogLevel.NONE:
          he.setSavedLevel("disable");
          break;
        default:
          he.setSavedLevel("log");
      }
      he.removeAllListeners(),
        he.addListener("log", (e, t) => {
          cc.addLog(e, t);
        });
    }
    static uploadLog() {
      return pe(this, void 0, void 0, function* () {
        return cc.uploadLog();
      });
    }
    static createDeviceManger() {
      return (
        Pc.deviceManager || (Pc.deviceManager = new _c()), Pc.deviceManager
      );
    }
  }
  (Pc.audioMusicMixer = null),
    (Pc.audioEffectMixer = null),
    (Pc._clients = []),
    (Pc._config = Object.assign({}, xs)),
    (Pc.forceAudioWorklet = !1),
    Xs.on("device-changed", (e) => {
      switch (e.device.kind) {
        case "audioinput":
          Pc.onMicrophoneChanged && Pc.onMicrophoneChanged(e);
          break;
        case "audiooutput":
          Pc.onPlaybackDeviceChanged && Pc.onPlaybackDeviceChanged(e);
          break;
        case "videoinput":
          Pc.onCameraChanged && Pc.onCameraChanged(e);
      }
    });
  var Rc = Pc;
  he.debug("SDK VERSION", Rc.VERSION),
    he.debug("BROWSER VERSION", de.browserDetails),
    (e.AUDIO_ENCODER_CONFIG_SETTINGS = wi),
    (e.QNAudioEffect = Ec),
    (e.QNAudioEffectMixer = Cc),
    (e.QNAudioFilter = class {}),
    (e.QNAudioMixingTrack = hc),
    (e.QNAudioMusicMixer = wc),
    (e.QNBufferSourceAudioTrack = vc),
    (e.QNCameraVideoTrack = Ac),
    (e.QNCanvasVideoTrack = Sc),
    (e.QNCustomAudioTrack = Tc),
    (e.QNCustomVideoTrack = bc),
    (e.QNLocalAudioTrack = fc),
    (e.QNLocalTrack = uc),
    (e.QNLocalVideoTrack = lc),
    (e.QNMediaRecorder = kc),
    (e.QNMicrophoneAudioTrack = mc),
    (e.QNRTCClient = dc),
    (e.QNRemoteAudioTrack = $s),
    (e.QNRemoteTrack = Zs),
    (e.QNRemoteUser = Ks),
    (e.QNRemoteVideoTrack = Ys),
    (e.QNScreenVideoTrack = gc),
    (e.QNTrack = Js),
    (e.QosEventType = Pe),
    (e.REC_AUDIO_ENABLE = ve),
    (e.REC_SCREEN_ENABLE = be),
    (e.REC_VIDEO_ENABLE = Te),
    (e.SUPPORT_SCREEN_ENCODER_CONFIG_LIST = Ci),
    (e.SUPPORT_VIDEO_ENCODER_CONFIG_LIST = ki),
    (e.default = Rc),
    (e.defaultAudioEncoderConfiguration = Ei),
    (e.defaultMergeJob = Ce),
    (e.defaultScreenEncoderConfiguration = Ii),
    (e.defaultVideoEncoderConfiguration = _i),
    (e.isDefined = Ee),
    Object.defineProperty(e, "__esModule", { value: !0 });
});
