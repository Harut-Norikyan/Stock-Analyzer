import React, { useState } from "react";
import { Row, Col, Table } from "react-bootstrap";
import Api from "../Api";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { convertDateFormat } from "../helper";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../redux/actions/itemActions";

export default function Components(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useLoaderData()
  const [allOneInstrumentNotifiers, setAllOneInstrumentNotifiers] = useState(data);
  const [deletedItemId, setDeletedItemId] = useState(null);
  const deleteOneInstrumentsNotifier = async () => {
    if (!deletedItemId) return false;
    dispatch(setIsLoading(true));
    Api.deleteOneInstrumentsNotifier(deletedItemId)
      .then((response) => {
        setAllOneInstrumentNotifiers(
          allOneInstrumentNotifiers.find((item) => item.id !== deletedItemId)
        );
        dispatch(setIsLoading(false));
        setDeletedItemId(null);
      })
      .catch((error) => {
        console.error(error);
        dispatch(setIsLoading(false));
        setDeletedItemId(null);
      });
  };

  return (
    <section style={{ marginTop: "80px", marginBottom: "80px" }}>
      <div className="mb-3">
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s Lorem Ipsum is simply dummy text of the printing and
          typesetting industry. Lorem Ipsum has been the industry's standard
          dummy text ever since the 1500s
        </p>
        <Link
          className="btn btn-primary btn-sm btn-lg px-3"
          to="/notify-for-one-instrument/form"
          role="button">
          Create notify
        </Link>
      </div>
      {deletedItemId ? (
        <Modal size="sm" show={true} centered>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Are you sure ?
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="px-3"
              onClick={() => setDeletedItemId(false)}>
              No
            </Button>
            <Button
              variant="primary"
              className="px-3"
              onClick={deleteOneInstrumentsNotifier}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null}
      <Row>
        <Col lg={12}>
          {allOneInstrumentNotifiers && allOneInstrumentNotifiers.length ? (
            <Table responsive className="table table-striped mb-0">
              <thead>
                <tr className="cursor-default">
                  <th className="nowrap">Company Name</th>
                  <th className="nowrap">Contract Id</th>
                  <th className="nowrap">Deviation Percentage</th>
                  <th className="nowrap">Change Percentage</th>
                  <th className="nowrap">Direction</th>
                  <th className="nowrap">Start Price</th>
                  <th className="nowrap">Start Date</th>
                  <th className="nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allOneInstrumentNotifiers.map((item, index) => {
                  return (
                    <tr key={index} className="cursor-pointer">
                      <td className="fw-500">
                        <p className="word-break-break-word max-line-3 m-0">
                          {item.name}
                        </p>
                      </td>
                      <td className="fw-500">
                        <p className="word-break-break-word max-line-3 m-0">
                          {item.conId}
                        </p>
                      </td>
                      <td className="fw-500">
                        <p className="word-break-break-word max-line-3 m-0">
                          {item.deviationPercentage}
                        </p>
                      </td>
                      <td className="fw-500">
                        <p className="word-break-break-word max-line-3 m-0">
                          {item.changePercentage}
                        </p>
                      </td>
                      <td className="fw-500">
                        <p className="word-break-break-word max-line-3 m-0">
                          {item.direction ? "Positive" : "Negative"}
                        </p>
                      </td>
                      <td className="fw-500">
                        <p className="word-break-break-word max-line-3 m-0">
                          {item.startPrice}
                        </p>
                      </td>
                      <td className="fw-500">
                        <p className="word-break-break-word max-line-3 m-0">
                          {convertDateFormat(item.startPriceDate)}
                        </p>
                      </td>
                      <td className="fw-500">
                        <div className="nowrap">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success me-1"
                            onClick={() =>
                              navigate(
                                `/notify-for-one-instrument/form/${item.id}`
                              )
                            }>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger me-1"
                            onClick={() => setDeletedItemId(item.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <div className="text-center">
              <p>
                <b>There is no notifiers yet</b>
              </p>
            </div>
          )}
        </Col>
      </Row>
    </section>
  );
}
const loader = async () => {
  try {
    const response = await Api.getAllOneInstrumentNotifiers();
    if (response && response.data) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
  }
};
export const NotifyForOneInstrument = Object.assign(Components, { loader });
