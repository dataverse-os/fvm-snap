import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { FlattenSimpleInterpolation, css } from "styled-components";

import { SelectorWrap } from "./styled";

import { easeTransition } from "@/utils/ui";

export type Option = {
  /**
   * name to display, use the logical value if not provided
   */
  name?: string;
  /**
   * logical value
   */
  value: string;
};

export type StyleConfig = {
  lineHeight?: string | number;
  padding?: string | number;
  autoFitWidth?: boolean;
  hoverStyle?: FlattenSimpleInterpolation;
  selectedStyle?: FlattenSimpleInterpolation;
  customRightContent?: React.ReactNode;
  customLeftContent?: React.ReactNode;
};

const defaultStyleConfig: StyleConfig = {
  lineHeight: "19px",
  padding: "10px",
  autoFitWidth: false,
  hoverStyle: css`
    background-color: #edf2fc;
  `,
  customRightContent: null,
  customLeftContent: null,
};

export interface SelectorProps {
  /**
   * selectable options
   */
  options: Option[];
  /**
   * default selected option or index or value, provide true will select the first option
   */
  defaultSelected?: Option | number | string | boolean;
  onChange?: (option: Option, idx: number) => void;
  onSelectingChange?: (isSelecting: boolean) => void;
  styleConfig?: StyleConfig;
  style?: React.CSSProperties;
  className?: string;
}

export const Selector = ({
  options,
  defaultSelected,
  onChange,
  onSelectingChange,
  styleConfig,
  style,
  className,
}: SelectorProps) => {
  styleConfig = { ...defaultStyleConfig, ...styleConfig };
  const motionStyle = {
    initial: {
      height: `calc(${styleConfig.lineHeight} + ${styleConfig.padding} + ${styleConfig.padding})`,
      transition: easeTransition,
    },
    animate: { height: "auto", transition: easeTransition },
  };
  // -1 to select nothing
  const [selectedIdx, setSelectedIdx] = useState<number>(
    defaultSelected && options.length > 0 ? 0 : -1,
  );
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  useEffect(() => {
    setIsSelecting(false);
  }, [selectedIdx]);

  useEffect(() => {
    onSelectingChange?.(isSelecting);
  }, [isSelecting]);

  const innerItem = (option: Option, idx: number) => {
    return (
      <div
        key={option.value}
        className='inner-item'
        data-active={idx === selectedIdx}
        onClick={() => {
          if (!isSelecting) return;
          setSelectedIdx(idx);
          onChange?.(option, idx);
        }}
        style={!isSelecting ? { backgroundColor: "#ffffff" } : undefined}
      >
        {option.name || option.value}
      </div>
    );
  };

  return (
    <SelectorWrap
      style={style}
      className={className}
      lineHeight={styleConfig.lineHeight}
      padding={styleConfig.padding}
      autoFitWidth={styleConfig.autoFitWidth}
      hoverStyle={styleConfig.hoverStyle}
      selectedStyle={styleConfig.selectedStyle}
      isSelecting={isSelecting}
    >
      <motion.div
        className='inner-container'
        variants={motionStyle}
        initial='initial'
        animate={isSelecting ? "animate" : "initial"}
        onClick={() => setIsSelecting(isSelecting => !isSelecting)}
      >
        {styleConfig.customLeftContent}
        {selectedIdx >= 0 && innerItem(options[selectedIdx], selectedIdx)}
        {options.map((option, idx) => {
          if (idx !== selectedIdx) {
            return innerItem(option, idx);
          }
        })}
        {styleConfig.customRightContent}
      </motion.div>
    </SelectorWrap>
  );
};
