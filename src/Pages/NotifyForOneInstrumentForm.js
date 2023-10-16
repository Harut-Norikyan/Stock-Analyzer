import React, { useState } from "react";
import ReactSelectOption from "../Components/ReactSelectOption";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";
import { Row, Col, Table } from "react-bootstrap";
import Api from "../Api";
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../redux/actions/itemActions";
import { onNumberChange, onSelectOptionChange } from "../helper";

const directions = [
  {
    id: "Positive",
    name: true,
  },
  {
    id: "Negative",
    name: false,
  },
];

export default function Components(props) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.isLoading);

  const [searchFormFields, setSearchFormFields] = useState({
    secType: "",
    name: false,
    symbol: "",
  });
  const { secTypes, fields } = useLoaderData();
  const [analizeInstrumentFormFields, setAnalizeInstrumentFormFields] =
    useState(
      fields || {
        conId: null,
        name: "",
        changePercentage: "",
        deviationPercentage: "",
        direction: true,
      }
    );

  let { itemId } = useParams();
  const navigate = useNavigate();

  const [securities, setSecurities] = useState([]);
  const [searchFormDebounced] = useDebounce(searchFormFields, 500);

  useEffect(() => {
    const fetchData = async () => {
      if (
        searchFormDebounced.secType.trim().length &&
        searchFormDebounced.symbol.trim().length
      ) {
        try {
          dispatch(setIsLoading(true));
          const response = await Api.getSecurities(searchFormDebounced);
          if (response && response.data) {
            setSecurities(response.data);
          } else {
            setSecurities([]);
          }
          dispatch(setIsLoading(false));
        } catch (error) {
          console.error(error);
          dispatch(setIsLoading(false));
        }
      }
    };
    fetchData();
  }, [searchFormDebounced, dispatch]);

  const onSubmit = async () => {
    if (
      analizeInstrumentFormFields.conId &&
      analizeInstrumentFormFields.name &&
      typeof analizeInstrumentFormFields.changePercentage === "number" &&
      typeof analizeInstrumentFormFields.deviationPercentage === "number"
    ) {
      if (itemId) analizeInstrumentFormFields.id = +itemId;
      try {
        dispatch(setIsLoading(true));
        await (itemId
          ? Api.updateOneInstrumentNotifier(analizeInstrumentFormFields)
          : Api.createOneInstrumentNotifier(analizeInstrumentFormFields));
        navigate("/notify-for-one-instrument");
        dispatch(setIsLoading(false));
      } catch (error) {
        console.error(error);
        dispatch(setIsLoading(false));
      }
    }
  };

  return (
    <>
      <section style={{ marginTop: "80px", marginBottom: "80px" }}>
        <Row>
          <Col lg={12}>
            <div className="d-flex flex-wrap-reverse justify-content-between">
              <h3>Search Instrument</h3>
              <h3 className="text-muted">(Notify for one instrument form)</h3>
            </div>
            {!itemId ? (
              <div>
                <div className="form-group mb-2">
                  {secTypes && secTypes.length && (
                    <div>
                      <label className="mb-1 fw-500">
                        Choose Security Type*
                      </label>
                      <ReactSelectOption
                        value={searchFormFields.secType}
                        isSearchable={true}
                        items={secTypes.map((data) => ({
                          label: data,
                          value: data,
                        }))}
                        onChange={(item) =>
                          onSelectOptionChange(
                            item,
                            setSearchFormFields,
                            "secType"
                          )
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="form-check mt-3 mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    checked={searchFormFields.name}
                    onChange={(event) => {
                      setSearchFormFields((values) => ({
                        ...values,
                        name: event.target.checked,
                        symbol: "",
                      }));
                    }}
                  />
                  <label
                    className="form-check-label cursor-pointer fw-500"
                    htmlFor="flexCheckDefault">
                    Search by Compamy Name
                  </label>
                </div>

                <div className="form-group mb-2">
                  {!searchFormFields.name ? (
                    <div className="form-group">
                      <label htmlFor="symbol" className="mb-1 fw-500">
                        Symbol*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="symbol"
                        value={searchFormFields.symbol}
                        onChange={(event) => {
                          setSearchFormFields((values) => ({
                            ...values,
                            symbol: event.target.value,
                          }));
                        }}
                      />
                    </div>
                  ) : (
                    <div className="form-group">
                      <label htmlFor="companyName" className="mb-1 fw-500">
                        Company Name*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="companyName"
                        value={searchFormFields.symbol}
                        onChange={(event) => {
                          setSearchFormFields((values) => ({
                            ...values,
                            symbol: event.target.value,
                          }));
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {securities && securities.length && !itemId ? (
              <Table responsive className="table table-striped mb-0">
                <thead>
                  <tr className="cursor-default">
                    <th className="nowrap">Company Name</th>
                    <th className="nowrap">Symbol</th>
                    <th className="nowrap">Market</th>
                    <th className="nowrap">Conid</th>
                    <th className="nowrap">Choose</th>
                  </tr>
                </thead>
                <tbody>
                  {securities.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className="cursor-pointer"
                        onClick={() => {
                          setAnalizeInstrumentFormFields((prevFields) => ({
                            ...prevFields,
                            conId: item.conId,
                            name: item.companyName,
                          }));
                        }}>
                        <td className="fw-500 w-25">
                          <p className="word-break-break-word max-line-3 m-0">
                            {item.companyName}
                          </p>
                        </td>
                        <td className="fw-500 w-20">
                          <p className="word-break-break-word max-line-3 m-0">
                            {item.symbol}
                          </p>
                        </td>
                        <td className="fw-500 w-25">
                          <p className="word-break-break-word max-line-3 m-0">
                            {item.market}
                          </p>
                        </td>
                        <td className="fw-500 w-20">
                          <p className="word-break-break-word max-line-3 m-0">
                            {item.conId}
                          </p>
                        </td>
                        <td className="fw-500 w-10">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="conId"
                              checked={
                                analizeInstrumentFormFields.conId === item.conId
                                  ? true
                                  : false
                              }
                              onChange={() => {
                                setAnalizeInstrumentFormFields(
                                  (prevFields) => ({
                                    ...prevFields,
                                    conId: item.conId,
                                    name: item.companyName,
                                  })
                                );
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : null}

            {analizeInstrumentFormFields.conId || itemId ? (
              <div className="mt-3">
                <div className="mb-4">
                  <div className="form-group mb-2">
                    <label htmlFor="changePercentage" className="mb-1 fw-500">
                      Change Percentage*
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="changePercentage"
                      value={analizeInstrumentFormFields.changePercentage}
                      onChange={(event) =>
                        onNumberChange(
                          event,
                          setAnalizeInstrumentFormFields,
                          "changePercentage",
                          100
                        )
                      }
                    />
                  </div>
                  <div className="form-group mb-2">
                    <label
                      htmlFor="deviationPercentage"
                      className="mb-1 fw-500">
                      Deviation Percentage*
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="deviationPercentage"
                      value={analizeInstrumentFormFields.deviationPercentage}
                      onChange={(event) =>
                        onNumberChange(
                          event,
                          setAnalizeInstrumentFormFields,
                          "deviationPercentage",
                          100
                        )
                      }
                    />
                  </div>
                  {directions && directions.length ? (
                    <div>
                      <label className="mb-1 fw-500">Direction*</label>
                      <ReactSelectOption
                        value={analizeInstrumentFormFields.direction}
                        isSearchable={true}
                        selectedValue={(() => {
                          const selectedItem = {
                            ...directions.find(
                              (data) =>
                                data.name ===
                                analizeInstrumentFormFields.direction
                            ),
                          };
                          if (Object.keys(selectedItem).length) {
                            selectedItem.label = selectedItem.id;
                            selectedItem.value = selectedItem.name;
                            return selectedItem;
                          } else {
                            return { value: null, label: "Choose" };
                          }
                        })()}
                        items={directions.map((data) => ({
                          ...data,
                          label: data.id,
                          value: data.name,
                        }))}
                        onChange={(item) =>
                          onSelectOptionChange(
                            item,
                            setAnalizeInstrumentFormFields,
                            "direction"
                          )
                        }
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-primary px-4"
                disabled={
                  !analizeInstrumentFormFields.conId ||
                  !analizeInstrumentFormFields.name ||
                  typeof analizeInstrumentFormFields.changePercentage !==
                    "number" ||
                  typeof analizeInstrumentFormFields.deviationPercentage !==
                    "number" ||
                  isLoading
                }
                onClick={onSubmit}>
                {itemId ? "Update" : "Create"}
              </button>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
}

const loader = async ({ params: { itemId } }) => {
  try {
    const responseSecurityTypes = await Api.getSecurityTypes({
      secType: "",
      name: false,
      symbol: "",
    });
    let responseOneInstrumentNotifierById;
    if (itemId) {
      responseOneInstrumentNotifierById =
        await Api.getOneInstrumentNotifierById(+itemId);
    }
    return {
      secTypes: responseSecurityTypes.data || [],
      fields: responseOneInstrumentNotifierById?.data || null,
    };
  } catch (error) {
    console.error(error);
  }
};
export const NotifyForOneInstrumentForm = Object.assign(Components, { loader });
