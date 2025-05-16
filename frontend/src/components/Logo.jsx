import React from "react";
import { Link } from "react-router";
import logoSvg from "../assets/logo.svg";

export default function Logo() {
  return (
    <Link to={"/"}>
      <img src={logoSvg} alt="Logo" className="h-8" />
    </Link>
  );
}
