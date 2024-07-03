from flask import Flask, send_from_directory, request, render_template

app = Flask(__name__)


@app.route('/')
def hello():
    return '<h1>Hello, World!</h1>'


# Launch the local web server
if __name__ == "__main__":
    # app.run(host='localhost', debug=True)
    app.run(host='0.0.0.0', port=3000, debug=True)