import styled from "styled-components";

export const SearchWrapper = styled.div`
  border-radius: 24px;
  background-color: #edf2fc;
  padding: 12px 16px;
  display: flex;
  align-items: center;

  .search-icon {
    margin-right: 15px;
  }

  .input {
    flex: 1 1 auto;
    background: none;
    /* font */
    font-family: Inter;
    font-size: 16px;
    font-weight: 400;
    line-height: 19px;
    letter-spacing: 0em;
    text-align: left;

    &::placeholder {
      color: #999999;
    }
  }
`;
