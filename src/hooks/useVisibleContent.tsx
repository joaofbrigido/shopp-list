import { useState } from "react";

export const useVisibleContent = () => {
  const [visible, setVisible] = useState<"home" | "register" | "edit">("home");

  return {
    homeVisible: visible === "home",
    registerVisible: visible === "register",
    editVisible: visible === "edit",
    showHome: () => setVisible("home"),
    showRegister: () => setVisible("register"),
    showEdit: () => setVisible("edit"),
  };
};
