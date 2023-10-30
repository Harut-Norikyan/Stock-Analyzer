import React, { useState } from "react";
import ReactSelectOption from "../Components/ReactSelectOption";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";
import { Row, Col, Table } from "react-bootstrap";
import Api from "../Api";
import {
  convertDateFormat,
  onNumberChange,
  onSelectOptionChange,
} from "../helper";
import { useLoaderData } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../redux/actions/itemActions";

const barTypes = [
  {
    id: "1 Minute",
    name: "1min",
  },
  {
    id: "2 Minute",
    name: "2min",
  },
  {
    id: "3 Minute",
    name: "3min",
  },
  {
    id: "5 Minute",
    name: "5min",
  },
  {
    id: "10 Minute",
    name: "10min",
  },
  {
    id: "15 Minute",
    name: "15min",
  },
  {
    id: "30 Minute",
    name: "30min",
  },
  {
    id: "1 Hour",
    name: "1h",
  },
  {
    id: "2 Hour",
    name: "2h",
  },
  {
    id: "3 Hour",
    name: "3h",
  },
  {
    id: "4 Hour",
    name: "4h",
  },
  {
    id: "8 Hour",
    name: "8h",
  },
  {
    id: "1 Day",
    name: "1d",
  },
  {
    id: "1 Week",
    name: "1w",
  },
  {
    id: "1 Month",
    name: "1m",
  },
];

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

const getToday = () => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  return (today = yyyy + "-" + mm + "-" + dd);
};

function Components(props) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.isLoading);
  const [searchFormFields, setSearchFormFields] = useState({
    secType: "",
    name: false,
    symbol: "",
  });

  const [analizeInstrumentFormFields, setAnalizeInstrumentFormFields] =
    useState({
      conId: null,
      startDate: "",
      endDate: "",
      bar: "",
      changePercentage: "",
      deviationPercentage: "",
      direction: true,
    });

  console.log(analizeInstrumentFormFields);

  const secTypes = useLoaderData();
  const [securities, setSecurities] = useState([]);
  const [analysisResult, setAnalysisResult] = useState([]);
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

  const analizeData = async () => {
    if (
      analizeInstrumentFormFields.startDate &&
      analizeInstrumentFormFields.bar &&
      typeof analizeInstrumentFormFields.changePercentage === "number" &&
      typeof analizeInstrumentFormFields.deviationPercentage === "number"
    ) {
      if (!analizeInstrumentFormFields.endDate) {
        analizeInstrumentFormFields.endDate = getToday();
      }
      try {
        dispatch(setIsLoading(true));

        const response = await Api.oneInstrumentAnalayzer(
          analizeInstrumentFormFields
        );
        if (response && response.data) {
          setAnalysisResult(response.data);
        } else {
          setAnalysisResult([]);
        }
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
              <h3 className="text-muted">(One Instrument Analizer)</h3>
            </div>
            <div>
              <div className="form-group mb-2">
                {secTypes && secTypes.length ? (
                  <div>
                    <label className="mb-1 fw-500">Choose Security Type*</label>
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
                ) : null}
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

            {securities && securities.length ? (
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

            {analizeInstrumentFormFields.conId ? (
              <>
                <hr />
                <div className="mb-4">
                  <Row>
                    <Col md={6}>
                      <div className="form-group mb-2">
                        <label htmlFor="startDate" className="mb-1 fw-500">
                          Start Date*
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="startDate"
                          value={analizeInstrumentFormFields.startDate}
                          onChange={(event) => {
                            setAnalizeInstrumentFormFields((values) => ({
                              ...values,
                              startDate: event.target.value,
                            }));
                          }}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-group mb-2">
                        <label htmlFor="endDate" className="mb-1 fw-500">
                          End Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="endDate"
                          value={analizeInstrumentFormFields.endDate}
                          onChange={(event) => {
                            setAnalizeInstrumentFormFields((values) => ({
                              ...values,
                              endDate: event.target.value,
                            }));
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="form-group mb-2">
                    {barTypes && barTypes.length ? (
                      <div>
                        <label className="mb-1 fw-500">Choose Bar*</label>
                        <ReactSelectOption
                          value={analizeInstrumentFormFields.bar}
                          isSearchable={true}
                          selectedValue={(() => {
                            const selectedItem = {
                              ...barTypes.find(
                                (data) =>
                                  data.name === analizeInstrumentFormFields.bar
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
                          items={barTypes.map((data) => ({
                            ...data,
                            label: data.id,
                            value: data.name,
                          }))}
                          onChange={(item) =>
                            onSelectOptionChange(
                              item,
                              setAnalizeInstrumentFormFields,
                              "bar"
                            )
                          }
                        />
                      </div>
                    ) : null}
                  </div>
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
              </>
            ) : null}
            {analysisResult && analysisResult.length ? (
              <Table responsive className="table table-striped mb-0">
                <thead>
                  <tr className="cursor-default">
                    <th className="nowrap">Starting Price</th>
                    <th className="nowrap">Starting Date Time</th>
                    <th className="nowrap">Changed Price</th>
                    <th className="nowrap">Changed Date Time</th>
                    <th className="nowrap">Changed Percent</th>
                    <th className="nowrap">Deviationed Price</th>
                    <th className="nowrap">Deviationed Date Time</th>
                    <th className="nowrap">Deviationed Percent</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisResult.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <p className="word-break-break-word max-line-3 m-0">
                            {item.startingPrice}
                          </p>
                        </td>
                        <td>
                          <p className="word-break-break-word max-line-3 m-0">
                            {convertDateFormat(item.startingDateTime)}
                          </p>
                        </td>
                        <td>
                          <p className="word-break-break-word max-line-3 m-0">
                            {item.changedPrice}
                          </p>
                        </td>
                        <td>
                          <p className="word-break-break-word max-line-3 m-0">
                            {convertDateFormat(item.changedDateTime)}
                          </p>
                        </td>
                        <td>
                          <p className="word-break-break-word max-line-3 m-0">
                            {item.changedPercent}
                          </p>
                        </td>
                        <td>
                          <p className="word-break-break-word max-line-3 m-0">
                            {item.deviationedPrice}
                          </p>
                        </td>
                        <td>
                          <p className="word-break-break-word max-line-3 m-0">
                            {convertDateFormat(item.deviationedDateTime)}
                          </p>
                        </td>
                        <td>
                          <p className="word-break-break-word max-line-3 m-0">
                            {item.deviationedPercent}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : null}
            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-primary px-4"
                disabled={
                  !analizeInstrumentFormFields.conId ||
                  !analizeInstrumentFormFields.startDate ||
                  !analizeInstrumentFormFields.bar ||
                  typeof analizeInstrumentFormFields.changePercentage !==
                    "number" ||
                  typeof analizeInstrumentFormFields.deviationPercentage !==
                    "number" ||
                  isLoading
                }
                onClick={analizeData}>
                Analize
              </button>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
}

const loader = async ({ params: { lang, page = 1 }, request }) => {
  try {
    const response = await Api.getSecurityTypes({
      secType: "",
      name: false,
      symbol: "",
    });
    if (response && response.data) {
      return response.data;
    } else {
      return [];
    }
    // setIsShowLoader(false);
  } catch (error) {
    console.error(error);
    // setIsShowLoader(false);
  }
};

export const OneInstrumentAnalizer = Object.assign(Components, { loader });
