import { useEffect, useRef, useState } from "react";
import { useEnvironment, usePlayer } from "spacesvr";
import { Vector3 } from "three";

export const useHTMLInput = (
  type: "file" | "text" | "number"
): HTMLInputElement | undefined => {
  const [input, setInput] = useState<HTMLInputElement>();

  useEffect(() => {
    if (!input) {
      const inp = document.createElement("input");
      inp.setAttribute("type", type);
      inp.style.zIndex = "-99";
      inp.style.opacity = "0";
      inp.style.fontSize = "16px"; // this disables zoom on mobile
      inp.style.position = "absolute";
      inp.style.left = "50%";
      inp.style.top = "0";
      inp.style.transform = "translate(-50%, 0%)";

      document.body.appendChild(inp);

      setInput(inp);
    }
  }, [input, type]);

  return input;
};

export const useNumberInput = (
  value: string,
  setValue: (s: string) => void,
  onChange?: (s: string) => string
) => {
  const input = useHTMLInput("number");

  const { paused, device } = useEnvironment();
  const { controls, velocity } = usePlayer();

  const [cursorPos, setCursorPos] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);
  const protectClick = useRef(false); // used to click off of the input to blur

  // input setup
  useEffect(() => {
    if (!input) return;

    input.addEventListener("focus", () => {
      setFocused(true);
      // reset values on focus
      setValue("");
      if (onChange) {
        onChange("");
      }
    });
    input.addEventListener("blur", () => setFocused(false));

    input.autocomplete = "off";
    setCursorPos(0);
    input.value = value || "";
  }, [input]);

  // respond to events
  useEffect(() => {
    // lock movement while typing
    if (focused) {
      velocity.set(new Vector3(0, 0, 0));
      controls.lock();
    } else {
      velocity.set(new Vector3(0, 0, 0));
      controls.unlock();
    }

    // blur on pause
    if (input && focused) {
      if (paused && device.desktop) {
        input.blur();
        setCursorPos(null);
      }
    }
  }, [input, focused, paused, device, velocity, controls]);

  // set up event listeners
  useEffect(() => {
    // blur on clicking outside of input
    const onDocClick = () => {
      if (input) {
        if (!protectClick.current) input.blur();
        else input.focus();
      }
      protectClick.current = false;
    };

    // keyup event
    const onKeyup = (e: KeyboardEvent) => {
      if (!focused || !input) return;
      if (onChange) input.value = onChange(input.value);
      setCursorPos(input.selectionStart);
      setValue(input.value);
      if (e.key === "Enter") input.blur();
    };

    const onSelectionChange = () => setCursorPos(input?.selectionStart || null);

    document.addEventListener("click", onDocClick);
    document.addEventListener("keyup", onKeyup);
    document.addEventListener("selectionchange", onSelectionChange);

    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keyup", onKeyup);
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, [focused, input, controls, setValue]);

  // keep the input's value in sync with the passed state value
  useEffect(() => {
    if (!input) return;
    input.value = value || "";
  }, [value, input]);

  const focusInput = () => {
    if (!input) return;
    protectClick.current = true;
    input.focus();
  };

  return { input, focused, cursorPos, focusInput };
};
