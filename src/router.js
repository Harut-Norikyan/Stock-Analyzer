import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App";
import Home from "./Pages/Home";
import { OneInstrumentAnalizer } from "./Pages/OneInstrumentAnalizer";
import { TwoInstrumentsAnalizer } from "./Pages/TwoInstrumentsAnalizer";
import { NotifyForOneInstrument } from "./Pages/NotifyForOneInstrument";
import { NotifyForOneInstrumentForm } from "./Pages/NotifyForOneInstrumentForm";
import { NotifyForTwoInstruments } from "./Pages/NotifyForTwoInstruments";
import { NotifyForTwoInstrumentsForm } from "./Pages/NotifyForTwoInstrumentsForm";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<Navigate to={"/"} />}>
      <Route index element={<Home />} />
      <Route
        path="one-instrument-analizer"
        element={<OneInstrumentAnalizer />}
        loader={OneInstrumentAnalizer.loader}
      />
      <Route
        path="two-instruments-analizer"
        loader={TwoInstrumentsAnalizer.loader}
        element={<TwoInstrumentsAnalizer />}
      />
      <Route path="notify-for-one-instrument">
        <Route
          index
          element={<NotifyForOneInstrument />}
          loader={NotifyForOneInstrument.loader}
        />
        <Route path="form">
          <Route
            index
            element={<NotifyForOneInstrumentForm />}
            loader={NotifyForOneInstrumentForm.loader}
          />
          <Route
            path=":itemId"
            element={<NotifyForOneInstrumentForm />}
            loader={NotifyForOneInstrumentForm.loader}
          />
        </Route>
      </Route>
      <Route path="/notify-for-two-instruments">
        <Route
          index
          element={<NotifyForTwoInstruments />}
          loader={NotifyForTwoInstruments.loader}
        />
        <Route path="form">
          <Route
            index
            element={<NotifyForTwoInstrumentsForm />}
            loader={NotifyForTwoInstrumentsForm.loader}
          />
          <Route
            path=":itemId"
            element={<NotifyForTwoInstrumentsForm />}
            loader={NotifyForTwoInstrumentsForm.loader}
          />
        </Route>
      </Route>
    </Route>
  )
);
