import React from "react";

import { SearchWrapper } from "./styled";

import SearchIconSvg from "@/assets/icons/search-icon.svg";

export type StyleConfig = {
  showSearchIcon?: boolean;
};

const defaultStyleConfig: StyleConfig = {
  showSearchIcon: true,
};

export interface SearchProps {
  placeHolder?: string;
  styleConfig?: StyleConfig;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const Search = ({
  placeHolder,
  styleConfig,
  onSearch,
  onChange,
  style,
  className,
}: SearchProps) => {
  styleConfig = { ...defaultStyleConfig, ...styleConfig };

  return (
    <SearchWrapper style={style} className={className}>
      {styleConfig?.showSearchIcon && (
        <img className='search-icon' src={SearchIconSvg} />
      )}
      <input
        className='input'
        placeholder={placeHolder}
        onChange={e => onChange?.(e.currentTarget.value)}
        onKeyDown={e => {
          if (e.key === "Enter") onSearch?.(e.currentTarget.value);
        }}
      />
    </SearchWrapper>
  );
};
