import styled from "styled-components";

export const PageWrapper = styled.main`
  width: 100%;
  display: flex;
`;

export const Sidebar = styled.aside`
  height: 100%;
  min-width: 256px;
  padding: 10px 16px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 15px;

  .brand {
    display: flex;
    column-gap: 8px;
    align-items: center;
    /* font */
    font-family: Inter-Medium;
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0em;
    text-align: left;
    color: #232325;
  }

  .side-menu {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
  }

  .footer {
    display: flex;
    flex-direction: column;

    .storage {
      display: flex;
      flex-direction: column;
      padding: 0px 18px;

      .storage-text {
        margin-top: 6px;
        width: 100%;
        text-align: right;
        /* font */
        font-family: Inter-Medium;
        font-size: 14px;
        font-weight: 500;
        line-height: 17px;
        letter-spacing: 0em;
        color: #232325;

        span {
          color: #4383f7;
        }
      }
    }

    .get-more-btn {
      margin-top: 19px;
      padding: 8px 32px;
      border-radius: 16px;
      border: 1px solid #757678;
      /* font */
      font-family: Inter-Medium;
      font-size: 14px;
      font-weight: 500;
      line-height: 17px;
      letter-spacing: 0em;
      text-align: left;
      color: #4383f7;
    }
  }

  .desc-text {
    font-family: Inter;
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
    letter-spacing: 0em;
    text-align: left;
    color: #999999;
  }
`;

export const MainWrap = styled.section`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding-right: 17px;
`;

export const HeaderWrap = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 0;

  .upload-btn {
    min-width: 120px;
    border-radius: 8px;
    background-color: #4383f7;
    padding: 7px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 9px;
    /* font */
    font-family: Inter-Medium;
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
    letter-spacing: 0em;
    text-align: left;
    color: #ffffff;
  }
`;

export const FinderWrap = styled.div`
  flex: 1 1 auto;
  border-radius: 16px;
  background-color: #ffffff;
  padding: 21px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .top-bar {
    display: flex;
    /* align-items: center; */
    justify-content: space-between;

    .info {
      display: flex;
      column-gap: 14px;
      align-items: baseline;

      .path {
        font-family: Inter-Medium;
        font-size: 24px;
        font-weight: 500;
        line-height: 29px;
        letter-spacing: 0em;
        text-align: left;
        color: #232325;
      }

      .file-count {
        font-family: Inter;
        font-size: 14px;
        font-weight: 400;
        line-height: 17px;
        letter-spacing: 0em;
        text-align: left;
        color: #999999;
        text-decoration: underline;
        text-underline-offset: 2px;
      }
    }

    .filter-selector {
      .inner-container {
        top: 0;
        left: unset;
        right: 0;
        /* width: max-content; */
        border: 1px solid #4383f7;
        border-radius: 8px;
      }
      .inner-item {
        padding: 8px 37px 9px 19px;
        font-family: Inter-Medium;
        font-size: 16px;
        font-weight: 500;
        line-height: 19px;
        letter-spacing: 0em;
        text-align: left;
      }
    }
  }

  .file-table {
    flex: 1 1 auto;
    padding-top: 18px;
    display: flex;
    flex-direction: column;
    overflow: auto;

    .table-container {
      overflow: auto;
    }

    .table-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #d9d9d9;

      .table-item {
        font-family: Inter-Medium;
        font-size: 14px;
        font-weight: 500;
        line-height: 17px;
        letter-spacing: 0em;
        text-align: left;
        color: #232325;
        overflow: hidden;
        text-overflow: ellipsis;

        .btn {
          border-radius: 8px;
          background-color: #4383f7;
          color: #ffffff;
          padding: 6px 18px;
        }
      }

      .buttons {
        display: flex;
        padding: 0 24px;
        align-items: center;
        justify-content: center;
        column-gap: 32px;
      }

      &:hover {
        transition: all 0.2s ease-in-out;
        background-color: #f2f3f5;
      }
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 9px 0;
      border-bottom: 1px solid #d9d9d9;
      position: sticky;
      top: 0;
      background: #ffffff;

      .table-item {
        font-family: Inter-Medium;
        font-size: 16px;
        font-weight: 500;
        line-height: 19px;
        letter-spacing: 0em;
        text-align: left;
        color: #232325;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .table-row,
    .table-header {
      .table-item:nth-child(1) {
        flex: 0 1 40%;
      }
      .table-item:nth-child(2) {
        flex: 0 1 15%;
      }
      .table-item:nth-child(3) {
        flex: 0 1 20%;
      }
      .table-item:nth-child(4) {
        flex: 0 1 15%;
      }
      .table-item:nth-child(5) {
        flex: 0 1 10%;
        min-width: 120px;
      }
    }

    .table-row {
      .table-item:nth-child(1) {
        padding-left: 20px;
      }
      .table-item:not(:nth-child(1)) {
        color: #5c5c5c;
      }
    }
  }
`;
