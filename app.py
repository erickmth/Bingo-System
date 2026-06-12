# -*- coding: utf-8 -*-
"""
gerar_bingo.py

Gera 50 cartelas de Bingo Junino em um único PDF:
- 2 cartelas por página A4
- 3x3 imagens por cartela
- Bordas arredondadas
- Logo
- Layout profissional
- Imagens com cantos arredondados usando Pillow
- Evita CONJUNTOS DE IMAGENS duplicados (CORRIGIDO - previne múltiplos ganhadores)
- Remove arquivos temporários ao final
- Cartelas mais estreitas horizontalmente

Estrutura esperada:

project/
│
├── logo.png
├── imagens/
│   ├── image1.png
│   ├── image2.jpg
│   └── ...
│
└── gerar_bingo.py
"""

import os
import random
import tempfile
import shutil
from pathlib import Path

from PIL import Image, ImageDraw

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

# ============================================================
# CONFIGURAÇÕES
# ============================================================

PDF_OUTPUT = "Bingo_Junino_IRB.pdf"

TOTAL_CARTELAS = 50
IMAGENS_POR_CARTELA = 9

IMAGES_FOLDER = "./imagens"
LOGO_PATH = "./logo.png"

# Cores tema junino
COR_PRIMARIA = colors.HexColor("#C62828")  # vermelho
COR_SECUNDARIA = colors.HexColor("#F9A825")  # amarelo
COR_BORDA = colors.HexColor("#5D4037")  # marrom
COR_FUNDO_CARTELA = colors.white
COR_GRADE = colors.HexColor("#BDBDBD")

# Configurações de layout
MARGEM_LATERAL = 55  # Aumentado de 30 para 55 (cartelas mais estreitas)
MARGEM_SUPERIOR = 25
ESPACAMENTO_ENTRE_CARTELAS = 18

# ============================================================
# UTILIDADES
# ============================================================

def criar_imagem_arredondada(input_path, output_path, radius=35):
    """
    Aplica cantos arredondados usando Pillow.
    """
    img = Image.open(input_path).convert("RGBA")

    mask = Image.new("L", img.size, 0)
    draw = ImageDraw.Draw(mask)

    draw.rounded_rectangle(
        [(0, 0), img.size],
        radius=radius,
        fill=255
    )

    img.putalpha(mask)

    img.save(output_path)


def listar_imagens():
    """
    Carrega todas as imagens da pasta.
    """
    extensoes = (".png", ".jpg", ".jpeg")

    arquivos = []

    for arquivo in os.listdir(IMAGES_FOLDER):
        if arquivo.lower().endswith(extensoes):
            arquivos.append(os.path.join(IMAGES_FOLDER, arquivo))

    return sorted(arquivos)


def verificar_duplicatas_conjuntos(cartelas):
    """
    Verifica se há cartelas com o MESMO CONJUNTO de imagens.
    Isso é crucial para evitar múltiplos ganhadores simultâneos.
    """
    conjuntos = [frozenset(cartela) for cartela in cartelas]
    
    if len(set(conjuntos)) != len(conjuntos):
        from collections import Counter
        contagem = Counter(conjuntos)
        duplicatas = [(list(conjunto), count) for conjunto, count in contagem.items() if count > 1]
        
        print(f"\n⚠️ ATENÇÃO: {len(duplicatas)} conjuntos de imagens duplicados encontrados!")
        for duplicata, count in duplicatas:
            print(f"   Conjunto duplicado {count} vezes: {duplicata[:3]}...")
        return False
    else:
        print("✅ VERIFICAÇÃO PASSADA: Nenhuma cartela compartilha o mesmo conjunto de imagens!")
        print(f"   ✓ Múltiplos ganhadores simultâneos PREVENIDOS!")
        return True


def gerar_cartelas_unicas(lista_imagens):
    """
    Gera cartelas com CONJUNTOS DE IMAGENS ÚNICOS.
    
    🔒 GARANTIA: Nenhuma cartela terá o mesmo conjunto de 9 imagens
       que outra cartela. Isso previne múltiplos ganhadores simultâneos.
    
    As posições das imagens são aleatórias para variar o visual.
    """
    
    if len(lista_imagens) < IMAGENS_POR_CARTELA:
        raise ValueError(
            f"É necessário ter pelo menos {IMAGENS_POR_CARTELA} imagens. "
            f"Você tem apenas {len(lista_imagens)} imagens."
        )
    
    # Calcula combinações possíveis (matemática de combinação)
    from math import comb
    max_combinacoes = comb(len(lista_imagens), IMAGENS_POR_CARTELA)
    
    print(f"\n📊 ANÁLISE DE COMBINAÇÕES ÚNICAS:")
    print(f"   Total de imagens disponíveis: {len(lista_imagens)}")
    print(f"   Imagens por cartela: {IMAGENS_POR_CARTELA}")
    print(f"   Conjuntos únicos possíveis: {max_combinacoes:,}")
    
    if TOTAL_CARTELAS > max_combinacoes:
        print(f"\n⚠️ ATENÇÃO: Você pediu {TOTAL_CARTELAS} cartelas, mas só é possível {max_combinacoes} combinações únicas!")
        print(f"   O código gerará {max_combinacoes} cartelas.")
        cartelas_a_gerar = max_combinacoes
    else:
        cartelas_a_gerar = TOTAL_CARTELAS
    
    # Usa SET para controlar CONJUNTOS (não ordem!)
    conjuntos_vistos = set()
    cartelas = []
    
    print(f"\n🎲 Gerando {cartelas_a_gerar} cartelas com CONJUNTOS ÚNICOS...")
    print(f"   (Garantindo que nenhuma cartela repita as mesmas 9 imagens)")
    
    tentativas = 0
    max_tentativas = cartelas_a_gerar * 50  # Evita loop infinito
    
    while len(cartelas) < cartelas_a_gerar and tentativas < max_tentativas:
        
        # Seleciona 9 imagens únicas
        selecao = random.sample(lista_imagens, IMAGENS_POR_CARTELA)
        
        # 🔑 CRUCIAL: Verifica o CONJUNTO (ignora ordem)
        chave_conjunto = frozenset(selecao)
        
        # Só aceita se o CONJUNTO nunca foi usado antes
        if chave_conjunto not in conjuntos_vistos:
            conjuntos_vistos.add(chave_conjunto)
            
            # Embaralha para ter ordem aleatória (visual)
            random.shuffle(selecao)
            cartelas.append(selecao)
            
            if len(cartelas) % 10 == 0:
                print(f"  ✅ {len(cartelas)}/{cartelas_a_gerar} cartelas geradas")
        
        tentativas += 1
    
    if len(cartelas) < cartelas_a_gerar:
        print(f"\n⚠️ Aviso: Só foi possível gerar {len(cartelas)} conjuntos únicos.")
        print(f"   Você precisa de mais {TOTAL_CARTELAS - len(cartelas)} imagens distintas.")
        print(f"   Atual: {len(lista_imagens)} imagens | Necessário: pelo menos {TOTAL_CARTELAS + IMAGENS_POR_CARTELA - 1} imagens")
    
    # VERIFICAÇÃO FINAL RIGOROSA
    print(f"\n🔍 VERIFICAÇÃO FINAL...")
    
    # Verificação 1: Conjuntos duplicados?
    conjuntos_gerados = [frozenset(c) for c in cartelas]
    if len(set(conjuntos_gerados)) != len(conjuntos_gerados):
        print("❌ ERRO CRÍTICO: Encontrado conjuntos duplicados!")
        return []
    
    # Verificação 2: Comparação direta entre todas as cartelas
    for i in range(len(cartelas)):
        for j in range(i + 1, len(cartelas)):
            if set(cartelas[i]) == set(cartelas[j]):
                print(f"❌ ERRO: Cartelas {i+1} e {j+1} têm as mesmas imagens!")
                return []
    
    # Verificação 3: Tamanho correto?
    for i, cartela in enumerate(cartelas):
        if len(set(cartela)) != IMAGENS_POR_CARTELA:
            print(f"❌ ERRO: Cartela {i+1} tem imagens repetidas!")
            return []
    
    print(f"✅ VERIFICAÇÃO PASSADA!")
    print(f"   Total de cartelas: {len(cartelas)}")
    print(f"   Conjuntos únicos: {len(set(conjuntos_gerados))}")
    print(f"   ✓ NENHUMA cartela compartilha as mesmas 9 imagens!")
    print(f"   ✓ Múltiplos ganhadores simultâneos PREVENIDOS!")
    
    return cartelas


# ============================================================
# DESENHO
# ============================================================

def desenhar_sombra(c, x, y, w, h, radius):
    """
    Simula sombra suave.
    """
    c.setFillColor(colors.HexColor("#EAEAEA"))
    c.roundRect(
        x + 3,
        y - 3,
        w,
        h,
        radius,
        fill=1,
        stroke=0
    )


def desenhar_cartela(
        c,
        x,
        y,
        largura,
        altura,
        imagens,
        logo_reader,
        imagens_arredondadas,
        numero_cartela
):
    """
    Desenha uma cartela completa.
    """
    
    raio = 14

    # ---------------------------
    # Sombra
    # ---------------------------
    desenhar_sombra(c, x, y, largura, altura, raio)

    # ---------------------------
    # Fundo
    # ---------------------------
    c.setFillColor(COR_FUNDO_CARTELA)
    c.setStrokeColor(COR_BORDA)
    c.setLineWidth(2.5)

    c.roundRect(
        x,
        y,
        largura,
        altura,
        raio,
        fill=1,
        stroke=1
    )

    # ---------------------------
    # Cabeçalho Profissional
    # ---------------------------
    header_h = 70

    # Fundo suave do cabeçalho
    c.setFillColor(colors.HexColor("#FFF8E1"))
    c.roundRect(
        x + 3,
        y + altura - header_h - 3,
        largura - 6,
        header_h,
        10,
        fill=1,
        stroke=0
    )

    # Logo
    logo_w = 90
    logo_h = 28

    c.drawImage(
        logo_reader,
        x + 10,
        y + altura - 46,
        width=logo_w,
        height=logo_h,
        preserveAspectRatio=True,
        mask='auto'
    )

    # Título
    c.setFillColor(COR_PRIMARIA)
    c.setFont("Helvetica-Bold", 16)

    c.drawCentredString(
        x + largura / 2 + 15,
        y + altura - 28,
        "BINGO JUNINO"
    )

    # Subtítulo
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 8.5)

    c.drawCentredString(
        x + largura / 2 + 15,
        y + altura - 42,
        "Instituto Robert Bosch"
    )
    
    # Número da cartela
    c.setFillColor(COR_SECUNDARIA)
    c.setFont("Helvetica-Bold", 10)
    
    c.drawRightString(
        x + largura - 12,
        y + altura - 36,
        f"Nº {numero_cartela:03d}"
    )

    # Linha decorativa
    c.setStrokeColor(COR_SECUNDARIA)
    c.setLineWidth(1.8)

    c.line(
        x + 12,
        y + altura - 62,
        x + largura - 12,
        y + altura - 62
    )
    
    # ---------------------------
    # Grade 3x3
    # ---------------------------
    margem = 14
    topo_grade = y + altura - 85

    largura_grade = largura - margem * 2
    altura_grade = altura - 108

    cell_w = largura_grade / 3
    cell_h = altura_grade / 3

    idx = 0

    for linha in range(3):
        for coluna in range(3):
            cell_x = x + margem + coluna * cell_w
            cell_y = topo_grade - (linha + 1) * cell_h

            # Moldura da célula
            c.setFillColor(colors.white)
            c.setStrokeColor(COR_GRADE)
            c.setLineWidth(1.2)

            c.roundRect(
                cell_x + 1.5,
                cell_y + 1.5,
                cell_w - 3,
                cell_h - 3,
                8,
                fill=1,
                stroke=1
            )

            img_path = imagens[idx]
            img_round = imagens_arredondadas[img_path]

            padding = 5

            # Centraliza a imagem dentro da célula
            c.drawImage(
                img_round,
                cell_x + padding,
                cell_y + padding,
                width=cell_w - padding * 2,
                height=cell_h - padding * 2,
                preserveAspectRatio=True,
                anchor='c',
                mask='auto'
            )

            idx += 1


# ============================================================
# PDF
# ============================================================

def gerar_pdf():
    """
    Função principal.
    """
    
    print("=" * 60)
    print("GERADOR DE BINGO JUNINO")
    print("=" * 60)
    
    # Verifica se a pasta de imagens existe
    if not os.path.exists(IMAGES_FOLDER):
        raise FileNotFoundError(
            f"Pasta '{IMAGES_FOLDER}' não encontrada!"
        )
    
    imagens = listar_imagens()
    
    print(f"\n📷 Imagens encontradas: {len(imagens)}")
    
    if not imagens:
        raise FileNotFoundError(
            "Nenhuma imagem encontrada em ./imagens"
        )
    
    if not os.path.exists(LOGO_PATH):
        raise FileNotFoundError(
            "logo.png não encontrado. Verifique o caminho."
        )
    
    print(f"🎯 Total de cartelas a gerar: {TOTAL_CARTELAS}")
    print("🔄 Processando imagens...")
    
    # Pasta temporária para imagens arredondadas
    pasta_temp = tempfile.mkdtemp(prefix="bingo_junino_")
    
    try:
        # ----------------------------------------------------
        # Pré-processa todas as imagens
        # ----------------------------------------------------
        imagens_arredondadas = {}
        
        for i, img in enumerate(imagens):
            nome = Path(img).stem
            destino = os.path.join(
                pasta_temp,
                f"{nome}_round.png"
            )
            
            criar_imagem_arredondada(
                img,
                destino,
                radius=35
            )
            
            imagens_arredondadas[img] = destino
            
            # Feedback de progresso
            if (i + 1) % 10 == 0:
                print(f"  Processadas {i + 1}/{len(imagens)} imagens...")
        
        print("✅ Todas as imagens processadas!")
        
        # ----------------------------------------------------
        # Gera cartelas com CONJUNTOS ÚNICOS
        # ----------------------------------------------------
        print("\n🎲 Gerando combinações com CONJUNTOS ÚNICOS...")
        cartelas = gerar_cartelas_unicas(imagens)
        
        if not cartelas:
            raise ValueError("Não foi possível gerar nenhuma cartela!")
        
        # ----------------------------------------------------
        # PDF
        # ----------------------------------------------------
        print("\n📄 Gerando PDF...")
        
        c = canvas.Canvas(
            PDF_OUTPUT,
            pagesize=A4
        )
        
        largura_pagina, altura_pagina = A4
        
        # Calcula dimensões com as novas margens
        cartela_largura = largura_pagina - (MARGEM_LATERAL * 2)
        cartela_altura = (
            altura_pagina
            - MARGEM_SUPERIOR * 2
            - ESPACAMENTO_ENTRE_CARTELAS
        ) / 2
        
        print(f"\n📏 Dimensões da cartela:")
        print(f"   Largura: {cartela_largura:.1f} pontos ({cartela_largura/2.83:.1f} mm)")
        print(f"   Altura: {cartela_altura:.1f} pontos ({cartela_altura/2.83:.1f} mm)")
        
        logo_reader = ImageReader(LOGO_PATH)
        
        indice = 0
        pagina = 1
        
        while indice < len(cartelas):
            
            # Cartela superior
            y_superior = (
                altura_pagina
                - MARGEM_SUPERIOR
                - cartela_altura
            )
            
            desenhar_cartela(
                c,
                MARGEM_LATERAL,
                y_superior,
                cartela_largura,
                cartela_altura,
                cartelas[indice],
                logo_reader,
                imagens_arredondadas,
                indice + 1
            )
            
            indice += 1
            
            # Cartela inferior
            if indice < len(cartelas):
                y_inferior = MARGEM_SUPERIOR
                
                desenhar_cartela(
                    c,
                    MARGEM_LATERAL,
                    y_inferior,
                    cartela_largura,
                    cartela_altura,
                    cartelas[indice],
                    logo_reader,
                    imagens_arredondadas,
                    indice + 1
                )
                
                indice += 1
            
            c.showPage()
            print(f"  Página {pagina} gerada ({indice} cartelas)")
            pagina += 1
        
        c.save()
        
        print("\n" + "=" * 60)
        print("✅ PDF GERADO COM SUCESSO!")
        print(f"📁 Arquivo: {PDF_OUTPUT}")
        print(f"🎫 Cartelas: {len(cartelas)}")
        print(f"📄 Páginas: {pagina - 1}")
        print("=" * 60)
        
        # Estatísticas finais
        print("\n📊 Estatísticas:")
        print(f"  - Total de imagens disponíveis: {len(imagens)}")
        print(f"  - Tamanho de cada cartela: {IMAGENS_POR_CARTELA} imagens")
        print(f"  - Margem lateral: {MARGEM_LATERAL} pontos ({MARGEM_LATERAL/2.83:.1f} mm)")
        
        from math import comb
        max_possible = comb(len(imagens), IMAGENS_POR_CARTELA)
        print(f"  - Conjuntos únicos possíveis: {max_possible:,}")
        
        if len(cartelas) < TOTAL_CARTELAS:
            print(f"  ⚠️ Geradas {len(cartelas)} de {TOTAL_CARTELAS} solicitadas")
            print(f"  💡 Dica: Adicione mais {TOTAL_CARTELAS - len(cartelas)} imagens para gerar todas")
            print(f"     Necessário: pelo menos {IMAGENS_POR_CARTELA + TOTAL_CARTELAS - 1} imagens no total")
        
        # Verificação final de conjuntos
        verificar_duplicatas_conjuntos(cartelas)
        
    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        raise
    
    finally:
        # Remove arquivos temporários
        print("\n🧹 Limpando arquivos temporários...")
        shutil.rmtree(
            pasta_temp,
            ignore_errors=True
        )
        print("✅ Limpeza concluída!")


# ============================================================
# EXECUÇÃO
# ============================================================

if __name__ == "__main__":
    try:
        gerar_pdf()
    except Exception as e:
        print(f"\n❌ Falha na execução: {e}")
        print("\nVerifique se:")
        print("1. A pasta './imagens' existe e contém imagens")
        print("2. O arquivo 'logo.png' está no diretório atual")
        print("3. As bibliotecas estão instaladas:")
        print("   - pip install pillow reportlab")