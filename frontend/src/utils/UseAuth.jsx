export default function UseAuth() {
  const user = localStorage.getItem("email");

  if (user) {
    return true;
  } else {
    return false;
  }
}
