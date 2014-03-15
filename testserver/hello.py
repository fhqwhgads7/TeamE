from flask import Flask, redirect, url_for, render_template
from os.path import abspath, normpath, join

app = Flask(__name__, static_url_path='')
app.config['DEBUG'] = True

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def interface(path):
    if path:
        return app.send_static_file(path)
    return render_template('tests.html')

if __name__ == '__main__':
    app.run()