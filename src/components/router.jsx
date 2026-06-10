import { createSignal } from "solid-js";

export const [currentPath, setCurrentPath] = createSignal(window.location.pathname);

// Listen to popstate event (e.g. browser back/forward buttons)
window.addEventListener("popstate", () => {
  setCurrentPath(window.location.pathname);
});

export function navigate(to) {
  if (to.startsWith("#")) {
    window.history.pushState({}, "", to);
    const id = to.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    return;
  }

  window.history.pushState({}, "", to);
  setCurrentPath(window.location.pathname);

  if (to.includes("#")) {
    const id = to.split("#")[1];
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  } else {
    window.scrollTo(0, 0);
  }
}

export function Link(props) {
  const handleClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    navigate(props.to);
    if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <a href={props.to} class={props.class} onClick={handleClick}>
      {props.children}
    </a>
  );
}
