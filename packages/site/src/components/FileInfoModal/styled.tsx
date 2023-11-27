import styled from "styled-components";

export const ModalContainer = styled.div`
  display: flex;
  width: 80vw;
  height: 90vh;
  border-radius: 20px;
  overflow: hidden;
  /* font */
  font-family: Lato;

  .info-container {
    width: 35%;
    background-color: #f8f8f8;

    > .title {
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 1.2rem;
      padding: 25px;
      height: 10vh;
      /* font */
      font-family: Lato;
      font-weight: 600;
    }

    .file-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 80vh;

      .info-list {
        > .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 25px;
          column-gap: 5px;
          > .info-key {
            font-weight: 500;
            font-size: 0.9rem;
            color: #999999;
          }

          > .info-value {
            font-size: 0.9rem;
            color: #000000;
            white-space: nowrap;
            overflow-x: hidden;
            text-overflow: ellipsis;
            margin-left: 5px;

            &[data-unavailable="true"] {
              color: #999999;
            }
          }
        }
      }

      .extra {
        border-radius: 10px;
        border: 1px solid #e8e8ea;
        background-color: white;
        margin: 25px 20px;
        padding: 10px;

        > .extra-title {
          font-size: 1rem;
          padding: 5px;
        }

        > .extra-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px;

          > .extra-key {
            font-size: 0.8rem;
            color: #999999;

            > a {
              cursor: pointer;
              color: #007aff !important;
            }
          }

          > .extra-value {
            font-size: 0.8rem;
            color: #000000;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-left: 5px;

            > a {
              cursor: pointer;
              color: #007aff !important;
            }

            > img {
              height: 1rem;
            }

            &[data-unavailable="true"] {
              color: #999999;
            }
          }

          .buttons {
            display: flex;
            align-items: center;
            column-gap: 25px;

            > button {
              min-width: 86px;
              max-height: 36px;
              background-color: #007aff;
              color: white;
              padding: 8px 19px;
              cursor: pointer;
              border-radius: 8px;
              /* font */
              font-family: Lato;
              font-size: 16px;
              font-weight: 500;
              line-height: 19px;
              letter-spacing: 0px;
              text-align: center;

              &[disabled] {
                color: #999999;
                background-color: #d9d9d9;
                cursor: not-allowed;
              }
            }
          }
        }

        .extra-addition {
          padding-right: 5px;
          display: block;
          text-align: right;
          font-size: 0.8rem;
          color: #000000;
        }
      }
    }
  }

  > .content-container {
    width: 70%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;

    > .image-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 70vh;
      height: 70vh;
      // border: 1px solid #f7f7f7;
      // border-radius: 20px;
      overflow: hidden;
      #stream {
        overflow: auto;
        height: 100%;
      }
    }
  }

  .close-btn {
    float: right;
    cursor: pointer;
    margin: 20px 20px 0px -40px;
    height: 20px;
    width: 20px;
  }
`;
