from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Bot de gerenciamento funcionando!"

if __name__ == '__main__':
    app.run(debug=True)
