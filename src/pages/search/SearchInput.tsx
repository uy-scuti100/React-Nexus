import React, { ChangeEvent } from "react";

interface SearchInputProps {
   placeholder: string;
   value: string;
   onChange: (value: string) => void;
   onSearch: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
   placeholder,
   value,
   onChange,
   onSearch,
}) => {
   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      onSearch(newValue);
   };

   return (
      <input
         placeholder={placeholder}
         className="h-10 bg-transparent w-full md:max-w-[50%] border-b outline-none placeholder:text-base placeholder:opacity-75"
         value={value}
         onChange={handleChange}
      />
   );
};

export default SearchInput;
