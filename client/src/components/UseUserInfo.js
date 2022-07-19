import { React, useState, useEffect } from "react";

export function useUserInfo() {
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    var id = localStorage.getItem("userid");
    var url = "/api/users/" + id;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setUsername(data.user.username);
        setBusy(false);
        // console.log("hook " + username);
      })
      .catch((err) => console.log(err));
  }, []);

  return username, busy;
}
