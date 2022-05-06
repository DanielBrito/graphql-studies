import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { LOAD_USERS } from "../graphql/queries";

function GetUsers() {
  const { error, loading, data } = useQuery(LOAD_USERS);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (data) {
      setUsers([...data.getAllUsers].reverse());
    }
  }, [data]);

  return (
    <div>
      {users.map((val, index) => {
        return <h2 key={index}>{val.firstName}</h2>;
      })}
    </div>
  );
}

export default GetUsers;
