import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import random
import time

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

load_dotenv()
app = Flask(__name__)

@app.route("/")
def index():
    return "API da Freya para o Pinterest está no ar!"

@app.route("/search")
def search_pins():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Parâmetro 'query' é obrigatório."}), 400

    print(f"Buscando imagens para: '{query}'")
    
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    
    service = Service(executable_path="./chromedriver.exe")
    driver = webdriver.Chrome(service=service, options=options)
    
    try:
        url_busca = f"https://br.pinterest.com/search/pins/?q={query}"
        driver.get(url_busca)

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "img"))
        )
        time.sleep(2)

        page_html = driver.page_source
        soup = BeautifulSoup(page_html, 'html.parser')
        
        imagens_encontradas = soup.find_all('img')
        links_validos = [img.get('src') for img in imagens_encontradas if img.get('src') and 'i.pinimg.com' in img.get('src')]

        if not links_validos:
            return jsonify({"error": "Não foi possível extrair nenhum link de imagem válido."}), 500
            
        url_miniatura = random.choice(links_validos)
        
        url_alta_qualidade = url_miniatura.replace('/236x/', '/originals/').replace('/474x/', '/originals/').replace('/60x60/', '/originals/')
        
        print(f"URL de alta qualidade: {url_alta_qualidade}")
        return jsonify({"image_url": url_alta_qualidade})

    except Exception as e:
        print(f"Ocorreu um erro durante o scraping com Selenium: {e}")
        return jsonify({"error": "Ocorreu um erro ao tentar extrair imagens do Pinterest."}), 500
    finally:
        driver.quit()

if __name__ == "__main__":
    app.run(debug=True, port=5000)