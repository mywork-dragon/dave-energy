
from flask import Flask, render_template, send_from_directory

from app import app
from controller.common_routes import login_required


@app.route("/tools/index", methods=["GET"])
@login_required
def index():
    return render_template("/tools/index.html")


@app.route("/tools/css/<path:path>", methods=["GET"])
@login_required
def css(path):
    return send_from_directory("client/build/tools/css", path)


@app.route("/tools/js/<path:path>", methods=["GET"])
@login_required
def js(path):
    return send_from_directory("client/build/tools/js", path)


@app.route("/tools/buildings", methods=["GET"])
@login_required
def buildings():
    return render_template("/tools/buildings.html")


@app.route("/tools/bill_history", methods=["GET"])
@login_required
def bill_history():
    return render_template("/tools/bill_history.html")

@app.route("/tools/n4_credential", methods=["GET"])
@login_required
def n4_credential():
    return render_template("/tools/n4_credential.html")

@app.route("/tools/solar_edge_credential", methods=["GET"])
@login_required
def solar_edge_credential():
    return render_template("/tools/solar_edge_credential.html")

@app.route("/tools/point_checker", methods=["GET"])
@login_required
def point_checker():
    return render_template("/tools/point_checker.html")