import React from "react";
import Button from "./Button";

const categories = [
  "All",
  "Gaming",
  "Songs",
  "Live",
  "Soccer",
  "Cricket",
  "Cooking",
  "Valentines",
];

const ButtonList = () => {
  return (
    <div className="flex">
      {categories.map((category) => (
        <Button key={category} name={category} />
      ))}
    </div>
  );
};

export default ButtonList;
