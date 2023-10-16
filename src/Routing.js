// import React from 'react'
// import Form from './Form'
// import { Routes, Route, Navigate } from "react-router-dom"
// import Home from './Pages/Home'
// import OneInstrumentAnalizer from './Pages/OneInstrumentAnalizer'
// import TwoInstrumentsAnalizer from './Pages/TwoInstrumentsAnalizer'
// import NotifyForTwoInstruments from './Pages/NotifyForTwoInstruments'
// import NotifyForOneInstrument from './Pages/NotifyForOneInstrument'
// import NotifyForOneInstrumentForm from './Pages/NotifyForOneInstrumentForm'
// import NotifyForTwoInstrumentsForm from './Pages/NotifyForTwoInstrumentsForm'

// export default function Routing(props) {
//   const { setIsShowLoader, isShowLoader } = props;
//   return (
//     <Routes>
//       <Route>
//         <Route path="/" element={<Home setIsShowLoader={setIsShowLoader} />} />
//         <Route path="/one-instrument-analizer" element={<OneInstrumentAnalizer setIsShowLoader={setIsShowLoader} isShowLoader={isShowLoader} />} />
//         <Route path="/two-instruments-analizer" element={<TwoInstrumentsAnalizer setIsShowLoader={setIsShowLoader} isShowLoader={isShowLoader} />} />
//         <Route path="/notify-for-one-instrument" element={<NotifyForOneInstrument setIsShowLoader={setIsShowLoader} isShowLoader={isShowLoader} />} />
//         <Route path="/notify-for-one-instrument/form" element={<NotifyForOneInstrumentForm setIsShowLoader={setIsShowLoader} isShowLoader={isShowLoader} />} />
//         <Route path="/notify-for-one-instrument/form/:itemId" element={<NotifyForOneInstrumentForm setIsShowLoader={setIsShowLoader} isShowLoader={isShowLoader} />} />
//         <Route path="/notify-for-two-instruments" element={<NotifyForTwoInstruments setIsShowLoader={setIsShowLoader} isShowLoader={isShowLoader} />} />
//         <Route path="/notify-for-two-instruments/form" element={<NotifyForTwoInstrumentsForm setIsShowLoader={setIsShowLoader} isShowLoader={isShowLoader} />} />
//         <Route path="/notify-for-two-instruments/form/:itemId" element={<NotifyForTwoInstrumentsForm setIsShowLoader={setIsShowLoader} isShowLoader={isShowLoader} />} />
//         <Route path="/form" element={<Form />} />
//         <Route path="*" element={<Navigate replace to="/" />} />
//       </Route>
//     </Routes>
//   )
// }
