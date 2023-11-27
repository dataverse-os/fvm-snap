import styled, { FlattenSimpleInterpolation } from "styled-components";

export const SelectorWrap = styled.div<{
  lineHeight?: string | number;
  padding?: string | number;
  autoFitWidth?: boolean;
  hoverStyle?: FlattenSimpleInterpolation;
  selectedStyle?: FlattenSimpleInterpolation;
  isSelecting?: boolean;
}>`
  position: relative;
  /* padding: 10px;
  border-radius: 24px;
  border: 1px solid #757678; */

  .inner-container {
    position: absolute;
    top: 100%;
    left: 0;
    width: ${prop =>
      prop.autoFitWidth
        ? `${prop.isSelecting ? "max-content" : "auto"}`
        : "100%"};
    border-radius: 24px;
    border: 1px solid #757678;
    overflow: hidden;
  }

  .inner-item {
    width: 100%;
    /* ${prop => (prop.autoFitWidth ? "width: auto;" : "")} */
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    /* font */
    font-family: Inter;
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
    letter-spacing: 0em;
    text-align: left;
    color: #232325;
    background-color: #ffffff;

    &:hover {
      transition: all 0.2s ease-in-out;
      ${prop => prop.hoverStyle || `background-color: #edf2fc;`}
    }
    &[data-active="true"] {
      ${prop =>
        prop.autoFitWidth
          ? `width: ${prop.isSelecting ? "auto" : "max-content"};`
          : ""}
      ${prop => prop.selectedStyle}
    }
    &[data-active="false"] {
      ${prop =>
        prop.autoFitWidth && !prop.isSelecting ? "display: none;" : ""}
    }
  }
`;
