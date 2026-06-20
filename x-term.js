/* VORNAC cross-link hovercard (Wikipedia-style page preview).
 *
 * Reads per-page definitions from <script type="application/json" id="x-term-defs">
 * (injected by the `crosslink` Eleventy transform) and attaches a single
 * shared popover element to every <a class="x-term"> on the page.
 *
 * Behavior:
 *   - 250 ms show delay (avoids flicker on cursor passing)
 *   - 180 ms hide delay (gives user time to move into the popover)
 *   - Popover stays open while cursor is over it
 *   - Keyboard support: focus shows, blur hides
 *   - Auto-flips above the link when there's no room below
 *   - Disabled on touch devices (no hover) and when prefers-reduced-motion
 *     is set (popover still works, just no transition)
 */
(function () {
  "use strict";

  if (typeof document === "undefined") return;

  // Skip on touch devices - hover preview is desktop only.
  // (Touch users still see the link work as a normal anchor.)
  var isTouch = (window.matchMedia && window.matchMedia("(hover: none)").matches);
  if (isTouch) return;

  var dataEl = document.getElementById("x-term-defs");
  if (!dataEl) return;

  var defs = {};
  try { defs = JSON.parse(dataEl.textContent || "{}"); }
  catch (e) { return; }

  var links = document.querySelectorAll("a.x-term");
  if (!links.length) return;

  var SHOW_DELAY = 250;
  var HIDE_DELAY = 180;

  var popover = null;
  var showTimer = null;
  var hideTimer = null;

  function ensurePopover() {
    if (popover) return popover;
    popover = document.createElement("div");
    popover.className = "x-term-popover";
    popover.setAttribute("role", "tooltip");
    popover.setAttribute("aria-hidden", "true");
    document.body.appendChild(popover);
    popover.addEventListener("mouseenter", cancelHide);
    popover.addEventListener("mouseleave", scheduleHide);
    return popover;
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isDeLocale() {
    // Domain-based i18n: German is served at the root of its own domain,
    // so detect locale from the document language rather than the path.
    return (document.documentElement.lang || "").toLowerCase().indexOf("de") === 0;
  }
  var MORE_LABEL = isDeLocale() ? "Zur Definition →" : "View definition →";

  function showFor(link) {
    var id = link.getAttribute("data-x-term");
    var def = id && defs[id];
    if (!def) return;
    var p = ensurePopover();
    p.innerHTML =
      '<div class="x-term-popover-title">' + escapeHtml(def.term) + "</div>" +
      (def.snippet
        ? '<div class="x-term-popover-body">' + escapeHtml(def.snippet) + "</div>"
        : "") +
      '<a class="x-term-popover-more" href="' + escapeHtml(def.href) + '">' +
        MORE_LABEL +
      "</a>";
    p.style.display = "block";
    p.setAttribute("aria-hidden", "false");
    position(p, link);
    // Fade in on next frame for the CSS transition to kick in.
    requestAnimationFrame(function () {
      p.classList.add("is-open");
    });
  }

  function position(p, link) {
    // Reset before measuring so it doesn't carry over flipped state.
    p.style.top = "0px";
    p.style.left = "0px";

    var rect = link.getBoundingClientRect();
    var pr = p.getBoundingClientRect();
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var gap = 8;

    // Vertical: prefer below; flip above if it would overflow.
    var top = rect.bottom + scrollY + gap;
    if (rect.bottom + pr.height + gap > vh - 16) {
      top = rect.top + scrollY - pr.height - gap;
    }
    // Horizontal: align left edge with link, but clamp inside viewport.
    var left = rect.left + scrollX;
    if (left + pr.width > scrollX + vw - 16) {
      left = scrollX + vw - pr.width - 16;
    }
    if (left < scrollX + 8) left = scrollX + 8;

    p.style.top = top + "px";
    p.style.left = left + "px";
  }

  function hide() {
    if (!popover) return;
    popover.classList.remove("is-open");
    popover.setAttribute("aria-hidden", "true");
    // Wait for fade-out before display:none so the transition plays.
    setTimeout(function () {
      if (popover && !popover.classList.contains("is-open")) {
        popover.style.display = "none";
      }
    }, 150);
  }

  function scheduleShow(link) {
    cancelShow();
    cancelHide();
    showTimer = setTimeout(function () { showFor(link); }, SHOW_DELAY);
  }
  function cancelShow() {
    if (showTimer) { clearTimeout(showTimer); showTimer = null; }
  }
  function scheduleHide() {
    cancelHide();
    hideTimer = setTimeout(hide, HIDE_DELAY);
  }
  function cancelHide() {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  }

  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    link.addEventListener("mouseenter", (function (l) {
      return function () { scheduleShow(l); };
    })(link));
    link.addEventListener("mouseleave", function () {
      cancelShow();
      scheduleHide();
    });
    link.addEventListener("focus", (function (l) {
      return function () { scheduleShow(l); };
    })(link));
    link.addEventListener("blur", function () {
      cancelShow();
      scheduleHide();
    });
  }

  // Dismiss on Escape so keyboard users aren't trapped.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && popover && popover.classList.contains("is-open")) {
      hide();
    }
  });
})();
