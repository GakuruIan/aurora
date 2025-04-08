import React, { useState } from "react";
import Avatar from "boring-avatars";
import Select from "react-select";

type TagInputProps = {
  suggestions: {
    name: string;
    address: string;
  }[];
  placeholder: string;
  label: string;

  onChange: (values: { label: string; value: string }[]) => void;
  value: { label: string; value: string }[];
};

const TagInput: React.FC<TagInputProps> = ({
  suggestions,
  label,
  onChange,
  value,
}) => {
  const [input, setInput] = useState("");

  const options = suggestions?.map((suggestion) => ({
    label: (
      <span className="flex items-center gap-2">
        <Avatar name={suggestion?.name} size="25" variant="marble" />
        {suggestion.name} - ({suggestion.address})
      </span>
    ),
    value: suggestion.address,
  }));

  return (
    <div className="border rounded-md flex items-center mb-1">
      <span className="ml-3 text-sm text-gray-500">{label}</span>
      <Select
        value={value}
        onChange={onChange}
        className="w-full flex-1"
        isMulti
        onInputChange={setInput}
        placeholder={""}
        options={
          input
            ? options.concat({
                label: (
                  <span className="flex items-center gap-2">
                    <Avatar name={input} size="25" />
                    {input}
                  </span>
                ),
                value: input,
              })
            : options
        }
        classNames={{
          input: () => "dark:text-white",
          control: () => {
            return "!border-none !outline-none !ring-0 !shadow-none focus:border-none focus:outline-none focus:ring-0 focus:shadow-none dark:bg-transparent dark:text-white";
          },
          menu: () => "dark:bg-dark-50 bg-white z-50", // <-- Dropdown container
          menuList: () => "dark:bg-dark-50 bg-white",
          option: () =>
            "dark:hover:bg-dark-20 dark:text-white text-black cursor-pointer",
          multiValue: () => {
            return "dark:!bg-gray-700";
          },
          multiValueLabel: () => {
            return "dark:text-white dark:bg-gray-700 rounded-md";
          },
        }}
        styles={{
          option: (base, state) => ({
            ...base,
            backgroundColor: "dark:bg-dark-20 bg-zinc-200", // remove default hover
            "&:hover": {
              backgroundColor: "dark:bg-dark-20 bg-zinc-200",
            },
          }),
        }}
        classNamePrefix="select"
      />
    </div>
  );
};

export default TagInput;
