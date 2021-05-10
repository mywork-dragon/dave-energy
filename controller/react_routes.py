# type: ignore
from flask import send_from_directory, render_template
from flask_login import current_user
from werkzeug import Response
from app import app


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def any_root_path(path) -> Response:
    return render_template("index.html", preloaded_state={})


@app.route("/static/<path:path>")
def serve(path) -> Response:
    return send_from_directory("client/build/static", path)


@app.route("/fonts/<path:path>")
def serve_fonts(path) -> Response:
    return send_from_directory("client/build/fonts", path)


@app.route("/service-worker.js")
def serviceworkerForReact() -> Response:
    return send_from_directory("client/build", "service-worker.js")


@app.route("/favicon.png")
def favicon() -> Response:
    return send_from_directory("client/build", "favicon.png")


@app.route("/og-image.png")
def og_image() -> Response:
    return send_from_directory("client/build", "og-image.png")
