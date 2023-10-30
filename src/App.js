import React, { useState, useEffect } from "react";
import Header from "./Components/Header";
import { Outlet } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from "react-redux";
import { setIsLoading } from "./redux/actions/itemActions";
import Api from "./Api";

export default function App() {

  const dispatch = useDispatch();
  const [isShowWaitingModal, setIsShowWaitingModal] = useState(false);

  useEffect(() => {
    checkUserAuth();
  }, [])

  const checkUserAuth = async () => {
    try {
      setIsShowWaitingModal(true)
      dispatch(setIsLoading(true));
      const response = await Api.checkUserIsAuth();
      if (typeof response.data === "boolean") {
        if (!response.data) window.open("https://auth.stockanalyzer.online", "", `width=${500},height=${700}`);
        else {
          setIsShowWaitingModal(false);
        }
      }
    } catch (error) {
      console.error(error);

    } finally {
      dispatch(setIsLoading(false));
    }
  }
  return (
    <div className="container">
      <Modal show={isShowWaitingModal} centered >
        <Modal.Header closeButton={false}>
          <Modal.Title>Please wait</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <b className="d-block text-center">
              We are checking your authentication
            </b>
          </div>
          <div className="d-flex justify-content-center my-4">
            <div className="spinner-border text-primary" role="status" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary px-4"
            onClick={() => window.location.reload()}
          >
            Reload this page
          </button>
        </Modal.Footer>
      </Modal>
      <Header />
      <Outlet />
    </div>
  );
}
