import { redirect, RedirectType } from "next/navigation";

export default function Redirect() {
  redirect("/dashboard", RedirectType.replace);
}
