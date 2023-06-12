import React from "react";
import Input from "../../Shared/Components/Input";

const UserCheckbox = (props) => (
  <div key={`user_${props.user.id}`} className="user-item">
    <Input
      element="checkbox"
      id={props.user.id}
      type="checkbox"
      value={props.user.id}
      label={props.user.username}
      onChange={props.onChange}
      checked={props.checked}
    />
  </div>
);

export default UserCheckbox;
