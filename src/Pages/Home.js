import React from "react"
import { Link } from "react-router-dom"

export default function Home(props) {
  return (
    <div>

      <main role="main">
        <div className="jumbotron">
          <div className="container">
            <h1 className="display-3">Instruments Analizer</h1>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
            <Link
              className="btn btn-primary btn-lg m-1"
              to="/one-instrument-analizer"
              role="button">
              One Instrument Analizer »
            </Link>
            <Link
              className="btn btn-primary btn-lg m-1"
              to="/two-instruments-analizer"
              role="button">
              Two Instruments Analizer »
            </Link>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h2>Notify for one instrument</h2>
              <p>
                Donec id elit non mi porta gravida at eget metus. Fusce dapibus,
                tellus ac cursus commodo, tortor mauris condimentum nibh, ut
                fermentum massa justo sit amet risus. Etiam porta sem malesuada
                magna mollis euismod. Donec sed odio dui.{" "}
              </p>
              <p>
                <Link
                  to="/notify-for-one-instrument"
                  className="btn btn-secondary px-4"
                  role="button">
                  View »
                </Link>
              </p>
            </div>
            <div className="col-md-6">
              <h2>Notify for two instruments</h2>
              <p>
                Donec id elit non mi porta gravida at eget metus. Fusce dapibus,
                tellus ac cursus commodo, tortor mauris condimentum nibh, ut
                fermentum massa justo sit amet risus. Etiam porta sem malesuada
                magna mollis euismod. Donec sed odio dui.{" "}
              </p>
              <p>
                <Link
                  to="/notify-for-two-instruments"
                  className="btn btn-secondary px-4"
                  role="button">
                  View »
                </Link>
              </p>
            </div>
          </div>
          <hr />
        </div>
      </main>
      <footer className="container">
        <p>© Company</p>
      </footer>
    </div>
  );
}
